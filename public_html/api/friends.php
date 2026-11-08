<?php
/* Amigos: add {code} · list */
declare(strict_types=1);
require __DIR__ . '/lib.php';

$in = api_boot();
$u = require_user();

switch (action()) {
    case 'add':
        $code = strtoupper(trim((string)($in['code'] ?? '')));
        if (!preg_match('/^AM-[A-Z0-9]{5}$/', $code)) fail('El código debe tener el formato AM-XXXXX.');
        $f = q('SELECT id, nick FROM users WHERE friend_code = ? AND status = "active"', [$code])->fetch();
        if (!$f) fail('No existe ningún alumno con ese código.');
        if ((int)$f['id'] === (int)$u['id']) fail('¡Ese es tu propio código!');
        $count = (int)q('SELECT COUNT(*) FROM friends WHERE user_id = ?', [$u['id']])->fetchColumn();
        if ($count >= 100) fail('Has llegado al máximo de 100 amigos.');
        q('INSERT IGNORE INTO friends (user_id, friend_id) VALUES (?, ?), (?, ?)', [$u['id'], $f['id'], $f['id'], $u['id']]);
        $new = [];
        grant((int)$u['id'], 'social', $new);
        $n2 = [];
        grant((int)$f['id'], 'social', $n2);
        out(['ok' => true, 'friend' => $f['nick'], 'new_achievements' => $new]);

    case 'list':
        $rows = q('SELECT u.nick FROM friends f JOIN users u ON u.id = f.friend_id WHERE f.user_id = ? ORDER BY u.nick', [$u['id']])->fetchAll(PDO::FETCH_COLUMN);
        out(['ok' => true, 'friends' => $rows]);
}
fail('Acción desconocida', 404);
