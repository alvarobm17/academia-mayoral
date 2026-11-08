<?php
/* Mayoral Plus con Stripe: create {plan: monthly|yearly} · portal */
declare(strict_types=1);
require __DIR__ . '/lib.php';

$in = api_boot();
$u = require_user();
$site = rtrim((string)cfg('site_url'), '/');
$st = cfg('stripe');

switch (action()) {
    case 'create':
        if (is_plus($u)) fail('Ya tienes Mayoral Plus activo.');
        $plan = ($in['plan'] ?? '') === 'yearly' ? 'yearly' : 'monthly';
        $price = $st[$plan === 'yearly' ? 'price_yearly' : 'price_monthly'] ?? '';
        if (!$price || str_contains($price, 'CAMBIAR')) fail('Los pagos aún no están configurados.', 503);

        $params = [
            'mode' => 'subscription',
            'line_items[0][price]' => $price,
            'line_items[0][quantity]' => 1,
            'success_url' => $site . '/plus.html?estado=ok',
            'cancel_url' => $site . '/plus.html?estado=cancelado',
            'client_reference_id' => (string)$u['id'],
            'metadata[user_id]' => (string)$u['id'],
            'subscription_data[metadata][user_id]' => (string)$u['id'],
            'allow_promotion_codes' => 'true',
            'locale' => 'es',
        ];
        if (!empty($u['stripe_customer'])) $params['customer'] = $u['stripe_customer'];
        else $params['customer_email'] = $u['parent_email'] ?: $u['email']; // el pago lo hace un adulto
        $s = stripe('POST', 'checkout/sessions', $params);
        out(['ok' => true, 'url' => $s['url']]);

    case 'portal':
        if (empty($u['stripe_customer'])) fail('No tienes ninguna suscripción que gestionar.');
        $s = stripe('POST', 'billing_portal/sessions', ['customer' => $u['stripe_customer'], 'return_url' => $site . '/cuenta.html']);
        out(['ok' => true, 'url' => $s['url']]);
}
fail('Acción desconocida', 404);
