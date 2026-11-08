<?php
/* Formulario de contacto: send */
declare(strict_types=1);
require __DIR__ . '/lib.php';

$in = api_boot();
if (action() !== 'send') fail('Acción desconocida', 404);

if (!empty($in['website'])) out(['ok' => true]); // trampa anti-bots

$name = trim(mb_substr((string)($in['name'] ?? ''), 0, 80));
$email = strtolower(trim((string)($in['email'] ?? '')));
$course = trim(mb_substr((string)($in['course'] ?? ''), 0, 40));
$topic = trim(mb_substr((string)($in['topic'] ?? ''), 0, 60));
$msg = trim(mb_substr((string)($in['message'] ?? ''), 0, 3000));

if ($name === '' || $msg === '') fail('Rellena tu nombre y el mensaje.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail('Escribe un email válido.');
if (empty($in['privacy'])) fail('Debes aceptar la política de privacidad.');

$ip = client_ip();
$recent = (int)q('SELECT COUNT(*) FROM contact_messages WHERE ip = ? AND created_at > (NOW() - INTERVAL 1 HOUR)', [$ip])->fetchColumn();
if ($recent >= 5) fail('Has enviado varios mensajes seguidos. Inténtalo más tarde.', 429);

q('INSERT INTO contact_messages (name, email, course, topic, message, ip) VALUES (?, ?, ?, ?, ?, ?)', [$name, $email, $course, $topic, $msg, $ip]);

send_mail((string)cfg('admin_email'), '[Contacto] ' . $topic . ' — ' . $name,
    '<p><b>Nombre:</b> ' . h($name) . '<br><b>Email:</b> ' . h($email) . '<br><b>Curso:</b> ' . h($course) . '<br><b>Motivo:</b> ' . h($topic) . '</p><p>' . nl2br(h($msg)) . '</p>', $email);

out(['ok' => true]);
