<?php
/* Confirmación (o rechazo) de la cuenta de un menor de 14 años por su tutor */
declare(strict_types=1);
require __DIR__ . '/lib.php';

$token = preg_replace('/[^a-f0-9]/', '', (string)($_GET['token'] ?? ''));
$act = ($_GET['action'] ?? '') === 'deny' ? 'deny' : 'ok';
$confirm = ($_SERVER['REQUEST_METHOD'] === 'POST');

$u = strlen($token) === 48 ? q('SELECT id, nick FROM users WHERE parent_token = ? AND status = "pending_parent"', [$token])->fetch() : null;

if ($u && $confirm) {
    if ($act === 'ok') {
        q('UPDATE users SET status = "active", parent_token = NULL, parent_confirmed_at = NOW() WHERE id = ?', [$u['id']]);
        $title = '¡Cuenta autorizada!';
        $text = 'Gracias. <b>' . h($u['nick']) . '</b> ya puede entrar en Academia Mayoral con su apodo o email y su contraseña.';
    } else {
        q('DELETE FROM users WHERE id = ?', [$u['id']]);
        $title = 'Cuenta eliminada';
        $text = 'Hemos borrado la cuenta y todos sus datos. Gracias por avisarnos.';
    }
} elseif ($u) {
    // Pedimos un clic de confirmación (evita que los antivirus de correo, que abren los enlaces, confirmen solos)
    $title = $act === 'ok' ? 'Autorizar la cuenta de ' . h($u['nick']) : 'Eliminar la cuenta de ' . h($u['nick']);
    $text = '<form method="post"><button style="background:#E8B04B;color:#0A0F1E;border:0;padding:14px 22px;border-radius:999px;font-weight:bold;font-size:16px;cursor:pointer">' .
        ($act === 'ok' ? 'Sí, autorizo la cuenta' : 'Sí, eliminar la cuenta') . '</button></form>';
} else {
    $title = 'Enlace no válido';
    $text = 'Este enlace ya se ha usado o ha caducado.';
}
header('Content-Type: text/html; charset=utf-8');
?><!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Academia Mayoral</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0D1324;color:#E9EDF7;font-family:Inter,system-ui,sans-serif;padding:16px}.box{max-width:480px;text-align:center;background:#151E3A;border:1px solid rgba(233,237,247,.12);border-radius:20px;padding:36px}a{color:#F6D58A}</style></head>
<body><div class="box"><img src="../assets/img/logo.svg" alt="" width="64" height="64" style="margin:0 auto 12px;display:block"><h1 style="font-size:1.5rem"><?= $title ?></h1><p><?= $text ?></p><p><a href="../index.html">Ir a Academia Mayoral</a></p></div></body></html>
