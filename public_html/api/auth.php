<?php
/* Cuentas: me · register · login · logout · update */
declare(strict_types=1);
require __DIR__ . '/lib.php';

$in = api_boot();

switch (action()) {
    case 'me':
        $u = current_user();
        out(['ok' => true, 'user' => $u ? public_user($u) : null]);

    case 'register':
        $nick = trim((string)($in['nick'] ?? ''));
        $email = strtolower(trim((string)($in['email'] ?? '')));
        $pass = (string)($in['password'] ?? '');
        $birth = (string)($in['birthdate'] ?? '');
        $course = (string)($in['course'] ?? '');
        $parent = strtolower(trim((string)($in['parent_email'] ?? '')));

        if (!preg_match('/^[\p{L}0-9_.]{3,20}$/u', $nick)) fail('El apodo debe tener entre 3 y 20 letras, números, punto o guion bajo.');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail('Escribe un email válido.');
        if (strlen($pass) < 8) fail('La contraseña debe tener al menos 8 caracteres.');
        if (!in_array($course, AM_COURSES, true)) fail('Elige tu curso.');
        if (empty($in['privacy'])) fail('Debes aceptar la política de privacidad.');
        $d = DateTime::createFromFormat('Y-m-d', $birth);
        if (!$d || $d->format('Y-m-d') !== $birth) fail('Revisa tu fecha de nacimiento.');
        $age = $d->diff(new DateTime('today'))->y;
        if ($age < 10 || $age > 99) fail('Revisa tu fecha de nacimiento.');
        $minor = $age < 14;
        if ($minor && !filter_var($parent, FILTER_VALIDATE_EMAIL)) fail('Al tener menos de 14 años, necesitamos el email de tu padre, madre o tutor.');

        if (q('SELECT 1 FROM users WHERE nick = ?', [$nick])->fetch()) fail('Ese apodo ya está cogido. Prueba con otro.');
        if (q('SELECT 1 FROM users WHERE email = ?', [$email])->fetch()) fail('Ya existe una cuenta con ese email.');

        $token = $minor ? bin2hex(random_bytes(24)) : null;
        q('INSERT INTO users (nick, email, pass_hash, birthdate, course, parent_email, parent_token, status, friend_code, week_key, day)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            $nick, $email, password_hash($pass, PASSWORD_DEFAULT), $birth, $course, $minor ? $parent : null, $token,
            $minor ? 'pending_parent' : 'active', new_friend_code(), week_key(), today(),
        ]);
        $id = (int)db()->lastInsertId();

        if ($minor) {
            $base = rtrim((string)cfg('site_url'), '/') . '/api/parent.php?token=' . $token;
            send_mail($parent, 'Confirma la cuenta de ' . $nick . ' en Academia Mayoral',
                '<h2>Hola:</h2><p>Un alumno con el apodo <b>' . h($nick) . '</b> (' . h($email) . ') se ha registrado en <b>Academia Mayoral</b>, una academia virtual gratuita para ESO y Bachillerato, y ha indicado que eres su padre, madre o tutor.</p>' .
                '<p>Como es menor de 14 años, la ley (art. 7 LOPDGDD) exige tu consentimiento para que pueda usar su perfil (puntos, logros y ranking por apodo).</p>' .
                '<p><a href="' . h($base) . '&action=ok" style="display:inline-block;background:#E8B04B;color:#0A0F1E;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:bold">Autorizar la cuenta</a></p>' .
                '<p>Si no reconoces esta solicitud, <a href="' . h($base) . '&action=deny">pulsa aquí para borrarla</a>.</p>');
            out(['ok' => true, 'pending_parent' => true]);
        }

        session_regenerate_id(true);
        $_SESSION['uid'] = $id;
        out(['ok' => true, 'user' => public_user(q('SELECT * FROM users WHERE id = ?', [$id])->fetch())]);

    case 'login':
        $ip = client_ip();
        q('DELETE FROM login_attempts WHERE at < (NOW() - INTERVAL 15 MINUTE)');
        $fails = (int)q('SELECT COUNT(*) FROM login_attempts WHERE ip = ?', [$ip])->fetchColumn();
        if ($fails >= 10) fail('Demasiados intentos. Espera 15 minutos.', 429);

        $login = trim((string)($in['login'] ?? ''));
        $u = q('SELECT * FROM users WHERE nick = ? OR email = ? LIMIT 1', [$login, strtolower($login)])->fetch();
        if (!$u || !password_verify((string)($in['password'] ?? ''), $u['pass_hash'])) {
            q('INSERT INTO login_attempts (ip) VALUES (?)', [$ip]);
            fail('Apodo/email o contraseña incorrectos.');
        }
        if ($u['status'] === 'pending_parent') fail('Tu cuenta está esperando la autorización de tu padre, madre o tutor. Pídele que revise su email.');
        if (password_needs_rehash($u['pass_hash'], PASSWORD_DEFAULT)) q('UPDATE users SET pass_hash = ? WHERE id = ?', [password_hash((string)$in['password'], PASSWORD_DEFAULT), $u['id']]);
        session_regenerate_id(true);
        $_SESSION['uid'] = (int)$u['id'];
        out(['ok' => true, 'user' => public_user($u)]);

    case 'logout':
        $_SESSION = [];
        session_destroy();
        out(['ok' => true]);

    case 'update':
        $u = require_user();
        $course = (string)($in['course'] ?? '');
        if (in_array($course, AM_COURSES, true)) q('UPDATE users SET course = ? WHERE id = ?', [$course, $u['id']]);
        out(['ok' => true, 'user' => public_user(q('SELECT * FROM users WHERE id = ?', [$u['id']])->fetch())]);
}
fail('Acción desconocida', 404);
