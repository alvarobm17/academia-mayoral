<?php
/* =========================================================================
   Webhook de Stripe — activa y desactiva Mayoral Plus.
   En Stripe → Desarrolladores → Webhooks, añade:
     URL: https://TU-DOMINIO/api/webhook.php
     Eventos: checkout.session.completed, customer.subscription.created,
              customer.subscription.updated, customer.subscription.deleted
   ========================================================================= */
declare(strict_types=1);
require __DIR__ . '/lib.php';

$payload = (string)file_get_contents('php://input');
$sigHeader = (string)($_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '');
$secret = (string)(cfg('stripe')['webhook_secret'] ?? '');

// --- Verificación de la firma (equivalente a la librería oficial) ---
$t = null; $sigs = [];
foreach (explode(',', $sigHeader) as $part) {
    [$k, $v] = array_pad(explode('=', trim($part), 2), 2, '');
    if ($k === 't') $t = (int)$v;
    if ($k === 'v1') $sigs[] = $v;
}
$expected = hash_hmac('sha256', $t . '.' . $payload, $secret);
$valid = $t && abs(time() - $t) < 300 && array_filter($sigs, fn($s) => hash_equals($expected, $s));
if (!$valid) fail('Firma no válida', 400);

$event = json_decode($payload, true);
if (!is_array($event) || empty($event['id'])) fail('Evento no válido', 400);

// Idempotencia: cada evento se procesa una sola vez
if (q('SELECT 1 FROM stripe_events WHERE id = ?', [$event['id']])->fetch()) out(['ok' => true, 'duplicate' => true]);

$obj = $event['data']['object'] ?? [];

function user_for(array $obj): ?int {
    $id = $obj['metadata']['user_id'] ?? $obj['client_reference_id'] ?? null;
    if ($id) return (int)$id;
    if (!empty($obj['customer'])) {
        $r = q('SELECT id FROM users WHERE stripe_customer = ?', [$obj['customer']])->fetchColumn();
        if ($r) return (int)$r;
    }
    return null;
}
function period_end(array $sub): ?int {
    $end = $sub['current_period_end'] ?? ($sub['items']['data'][0]['current_period_end'] ?? null);
    return $end ? (int)$end : null;
}

switch ($event['type'] ?? '') {
    case 'checkout.session.completed':
        $uid = user_for($obj);
        if ($uid && !empty($obj['customer'])) {
            q('UPDATE users SET stripe_customer = ? WHERE id = ?', [$obj['customer'], $uid]);
            if (!empty($obj['subscription'])) {
                $sub = stripe('GET', 'subscriptions/' . $obj['subscription']);
                $end = period_end($sub);
                if ($end) q('UPDATE users SET plus_until = FROM_UNIXTIME(?) WHERE id = ?', [$end + 86400, $uid]);
            }
        }
        break;

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
        $uid = user_for($obj);
        if ($uid) {
            if (!empty($obj['customer'])) q('UPDATE users SET stripe_customer = ? WHERE id = ?', [$obj['customer'], $uid]);
            $status = $obj['status'] ?? '';
            $end = period_end($obj);
            if (in_array($status, ['active', 'trialing'], true) && $end) {
                q('UPDATE users SET plus_until = FROM_UNIXTIME(?) WHERE id = ?', [$end + 86400, $uid]); // +1 día de margen
            } elseif (in_array($status, ['canceled', 'unpaid', 'incomplete_expired'], true)) {
                q('UPDATE users SET plus_until = NOW() WHERE id = ?', [$uid]);
            }
        }
        break;

    case 'customer.subscription.deleted':
        $uid = user_for($obj);
        if ($uid) q('UPDATE users SET plus_until = NOW() WHERE id = ?', [$uid]);
        break;
}
// Se marca como procesado solo si todo ha ido bien (si falla, Stripe lo reintenta)
q('INSERT IGNORE INTO stripe_events (id, type) VALUES (?, ?)', [$event['id'], $event['type'] ?? '']);
out(['ok' => true]);
