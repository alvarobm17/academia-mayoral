<?php
/* =========================================================================
   Academia Mayoral — librería común del backend (PHP 8+ / MySQL)
   ========================================================================= */
declare(strict_types=1);

const AM_COURSES = ['1eso', '2eso', '3eso', '4eso', '1bach', '2bach'];
const AM_KINDS   = ['quiz', 'match', 'memory', 'fill', 'hangman', 'order'];

/* ---------- Ligas, avatares, títulos y fondos (deben coincidir con assets/js/data.js y avatars.js) ---------- */
const AM_LEAGUES = [0, 150, 400, 800, 1500];            // XP semanales mínimos: Bronce, Plata, Oro, Zafiro, Diamante
const AM_LEAGUE_NAMES = ['Bronce', 'Plata', 'Oro', 'Zafiro', 'Diamante'];
const AM_AVATARS = [                                    // id => rareza
    'leon' => 'comun', 'lobo' => 'comun', 'buho' => 'comun', 'tiburon' => 'comun', 'cobra' => 'comun',
    'trex' => 'rara', 'triceratops' => 'rara', 'kraken' => 'rara', 'unicornio' => 'rara',
    'dragon' => 'epica', 'sirena' => 'epica', 'fenix' => 'epica',
];
const AM_RARITY_WEIGHT = ['comun' => 60, 'rara' => 30, 'epica' => 10];
const AM_TITLES = ['iniciado' => 0, 'aprendiz' => 3, 'explorador' => -1, 'sabio' => 6, 'maestro' => 10]; // nº de logros (-1: logro «explorador»)
const AM_THEMES = ['aurora' => 0, 'oceano' => 0, 'bosque' => 2, 'atardecer' => 3, 'galaxia' => 4, 'sakura' => 'plus', 'dorado' => 'plus'];
const AM_CHEST_BONUS_XP = 50;                           // si ya tienes todas las criaturas, el cofre da XP

$CFG = @include __DIR__ . '/config.php';
if (!is_array($CFG)) { http_response_code(500); header('Content-Type: application/json; charset=utf-8'); echo '{"ok":false,"error":"Falta api/config.php (cópialo desde config.sample.php)"}'; exit; }

function cfg(string $k) { global $CFG; return $CFG[$k] ?? null; }

/* ---------- Respuesta JSON ---------- */
function out(array $data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
function fail(string $msg, int $code = 400): void { out(['ok' => false, 'error' => $msg], $code); }

/* ---------- Petición (API JSON) ---------- */
function api_boot(): array {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Método no permitido', 405);
    // Mitigación CSRF: solo nuestro JS envía esta cabecera (otras webs no pueden sin CORS)
    if (($_SERVER['HTTP_X_AM'] ?? '') !== '1') fail('Petición no válida', 403);
    start_session();
    $in = json_decode((string)file_get_contents('php://input'), true);
    return is_array($in) ? $in : [];
}
function action(): string { return preg_replace('/[^a-z_]/', '', (string)($_GET['action'] ?? '')); }

function start_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_name('AMSESS');
    session_set_cookie_params(['lifetime' => 60 * 60 * 24 * 30, 'path' => '/', 'secure' => $https, 'httponly' => true, 'samesite' => 'Lax']);
    ini_set('session.gc_maxlifetime', (string)(60 * 60 * 24 * 30));
    session_start();
}

/* ---------- Base de datos ---------- */
function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $c = cfg('db');
    try {
        $pdo = new PDO('mysql:host=' . $c['host'] . ';dbname=' . $c['name'] . ';charset=utf8mb4', $c['user'], $c['pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (Throwable $e) {
        error_log('[AM] DB: ' . $e->getMessage());
        fail('No se pudo conectar con la base de datos.', 500);
    }
    return $pdo;
}
function q(string $sql, array $p = []): PDOStatement { $s = db()->prepare($sql); $s->execute($p); return $s; }

/* ---------- Fechas ---------- */
function today(): string { return date('Y-m-d'); }
function yesterday(): string { return date('Y-m-d', strtotime('-1 day')); }
function week_key(): string { return date('o-W'); }
function client_ip(): string { return substr((string)($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45); }

/* ---------- Usuarios ---------- */
function current_user(): ?array {
    $id = $_SESSION['uid'] ?? null;
    if (!$id) return null;
    $u = q('SELECT * FROM users WHERE id = ? AND status = "active"', [$id])->fetch();
    return $u ?: null;
}
function require_user(): array {
    $u = current_user();
    if (!$u) fail('Inicia sesión para continuar.', 401);
    return $u;
}
function is_plus(array $u): bool { return !empty($u['plus_until']) && strtotime($u['plus_until']) > time(); }

function month_key(): string { return date('Y-m'); }
function league_index(int $weeklyXp): int { $i = 0; foreach (AM_LEAGUES as $k => $min) if ($weeklyXp >= $min) $i = $k; return $i; }
/* Liga más alta del mes en curso (se reinicia cada mes) */
function month_league(array $u): int { return ($u['month_key'] ?? '') === month_key() ? (int)$u['month_league'] : 0; }
/* Fase del avatar: Bronce/Plata = huevo (0), Oro = cría (1), Zafiro = adulto (2), Diamante = legendario (3) */
function avatar_phase(int $monthLeague): int { return $monthLeague >= 4 ? 3 : ($monthLeague >= 3 ? 2 : ($monthLeague >= 2 ? 1 : 0)); }
function title_unlocked(string $t, array $ach): bool {
    if (!array_key_exists($t, AM_TITLES)) return false;
    $need = AM_TITLES[$t];
    return $need === -1 ? in_array('explorador', $ach, true) : count($ach) >= $need;
}
function theme_unlocked(string $t, array $u): bool {
    if (!array_key_exists($t, AM_THEMES)) return false;
    $need = AM_THEMES[$t];
    return $need === 'plus' ? is_plus($u) : (int)$u['max_league'] >= $need;
}

function public_user(array $u): array {
    $ach = q('SELECT achievement FROM achievements WHERE user_id = ?', [$u['id']])->fetchAll(PDO::FETCH_COLUMN);
    $streak = in_array($u['last_active'], [today(), yesterday()], true) ? (int)$u['streak'] : 0;
    $owned = q('SELECT avatar_id FROM user_avatars WHERE user_id = ? ORDER BY obtained_at', [$u['id']])->fetchAll(PDO::FETCH_COLUMN);
    $ml = month_league($u);
    return [
        'max_league' => (int)$u['max_league'],
        'max_league_at' => $u['max_league_at'] ? date('d/m/Y', strtotime($u['max_league_at'])) : date('d/m/Y', strtotime($u['created_at'])),
        'month_league' => $ml,
        'phase' => avatar_phase($ml),
        'chests' => (int)$u['chests'],
        'avatar_id' => $u['avatar_id'],
        'avatars' => $owned,
        'title' => title_unlocked((string)$u['title_id'], $ach) ? $u['title_id'] : 'iniciado',
        'panel_theme' => theme_unlocked((string)$u['panel_theme'], $u) ? $u['panel_theme'] : 'aurora',
        'id' => (int)$u['id'],
        'nick' => $u['nick'],
        'course' => $u['course'],
        'xp' => (int)$u['xp'],
        'weekly_xp' => $u['week_key'] === week_key() ? (int)$u['weekly_xp'] : 0,
        'streak' => $streak,
        'plus' => is_plus($u),
        'plus_until' => is_plus($u) ? date('d/m/Y', strtotime($u['plus_until'])) : null,
        'friend_code' => $u['friend_code'],
        'achievements' => $ach,
    ];
}

function new_friend_code(): string {
    $abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    do {
        $c = 'AM-';
        for ($i = 0; $i < 5; $i++) $c .= $abc[random_int(0, strlen($abc) - 1)];
    } while (q('SELECT 1 FROM users WHERE friend_code = ?', [$c])->fetch());
    return $c;
}

function grant(int $uid, string $ach, array &$new): void {
    $s = q('INSERT IGNORE INTO achievements (user_id, achievement) VALUES (?, ?)', [$uid, $ach]);
    if ($s->rowCount() > 0) $new[] = $ach;
}

/* ---------- Correo ---------- */
function send_mail(string $to, string $subject, string $html, ?string $replyTo = null): bool {
    $from = cfg('mail_from');
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: Academia Mayoral <' . $from . '>',
    ];
    if ($replyTo) $headers[] = 'Reply-To: ' . $replyTo;
    $subject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $body = '<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1b2340">' . $html .
        '<p style="color:#8a93ad;font-size:12px;margin-top:30px">Academia Mayoral · ' . htmlspecialchars((string)cfg('site_url')) . '</p></div>';
    return @mail($to, $subject, $body, implode("\r\n", $headers), '-f' . $from);
}

function h(?string $s): string { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

/* ---------- Stripe (sin librerías: API REST con cURL) ---------- */
function stripe(string $method, string $path, array $params = []): array {
    $key = cfg('stripe')['secret_key'] ?? '';
    if (!$key || str_contains($key, 'CAMBIAR')) fail('Los pagos aún no están configurados.', 503);
    $ch = curl_init('https://api.stripe.com/v1/' . $path . ($method === 'GET' && $params ? '?' . http_build_query($params) : ''));
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERPWD => $key . ':',
        CURLOPT_TIMEOUT => 20,
        CURLOPT_HTTPHEADER => ['Stripe-Version: 2024-06-20'],
    ]);
    if ($method === 'POST') { curl_setopt($ch, CURLOPT_POST, true); curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params)); }
    $res = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $j = json_decode((string)$res, true) ?: [];
    if ($code >= 400 || !$res) { error_log('[AM] Stripe ' . $path . ': ' . $res); fail('Error con la pasarela de pago. Inténtalo de nuevo.', 502); }
    return $j;
}
