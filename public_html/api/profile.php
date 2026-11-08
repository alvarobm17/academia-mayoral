<?php
/* Perfil personal: open_chest · set_avatar · set_title · set_theme */
declare(strict_types=1);
require __DIR__ . '/lib.php';

$in = api_boot();
$u = require_user();
$uid = (int)$u['id'];

switch (action()) {
    case 'open_chest':
        if ((int)$u['chests'] < 1) fail('No tienes cofres por abrir. ¡Sube de liga para conseguir uno!');
        $owned = q('SELECT avatar_id FROM user_avatars WHERE user_id = ?', [$uid])->fetchAll(PDO::FETCH_COLUMN);
        $count = is_plus($u) ? 2 : 1; // Mayoral Plus: 2 criaturas por cofre
        $rewards = [];
        $bonus = 0;
        db()->beginTransaction();
        for ($n = 0; $n < $count; $n++) {
            $pool = array_diff(array_keys(AM_AVATARS), $owned);
            if (!$pool) { $bonus += AM_CHEST_BONUS_XP; $rewards[] = ['xp' => AM_CHEST_BONUS_XP]; continue; }
            // Primero se sortea la rareza (entre las que aún quedan) y luego la criatura
            $byRarity = [];
            foreach ($pool as $a) $byRarity[AM_AVATARS[$a]][] = $a;
            $total = 0; foreach ($byRarity as $r => $_) $total += AM_RARITY_WEIGHT[$r];
            $roll = random_int(1, $total); $rar = array_key_first($byRarity);
            foreach ($byRarity as $r => $_) { $roll -= AM_RARITY_WEIGHT[$r]; if ($roll <= 0) { $rar = $r; break; } }
            $list = array_values($byRarity[$rar]);
            $pick = $list[random_int(0, count($list) - 1)];
            q('INSERT IGNORE INTO user_avatars (user_id, avatar_id) VALUES (?, ?)', [$uid, $pick]);
            $owned[] = $pick;
            $rewards[] = ['avatar_id' => $pick, 'rarity' => $rar];
        }
        q('UPDATE users SET chests = chests - 1, xp = xp + ?, avatar_id = COALESCE(avatar_id, ?) WHERE id = ?',
            [$bonus, $rewards[0]['avatar_id'] ?? null, $uid]);
        db()->commit();
        out(['ok' => true, 'rewards' => $rewards, 'user' => public_user(q('SELECT * FROM users WHERE id = ?', [$uid])->fetch())]);

    case 'set_avatar':
        $a = (string)($in['avatar_id'] ?? '');
        if (!q('SELECT 1 FROM user_avatars WHERE user_id = ? AND avatar_id = ?', [$uid, $a])->fetch()) fail('Aún no tienes esa criatura.');
        q('UPDATE users SET avatar_id = ? WHERE id = ?', [$a, $uid]);
        break;

    case 'set_title':
        $t = (string)($in['title'] ?? '');
        $ach = q('SELECT achievement FROM achievements WHERE user_id = ?', [$uid])->fetchAll(PDO::FETCH_COLUMN);
        if (!title_unlocked($t, $ach)) fail('Aún no has desbloqueado ese título.');
        q('UPDATE users SET title_id = ? WHERE id = ?', [$t, $uid]);
        break;

    case 'set_theme':
        $t = (string)($in['theme'] ?? '');
        if (!theme_unlocked($t, $u)) fail('Ese fondo aún está bloqueado.');
        q('UPDATE users SET panel_theme = ? WHERE id = ?', [$t, $uid]);
        break;

    default:
        fail('Acción desconocida', 404);
}
out(['ok' => true, 'user' => public_user(q('SELECT * FROM users WHERE id = ?', [$uid])->fetch())]);
