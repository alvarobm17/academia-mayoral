<?php
/* Puntos y logros: list · complete */
declare(strict_types=1);
require __DIR__ . '/lib.php';

$in = api_boot();

switch (action()) {
    case 'list':
        $u = require_user();
        $rows = q('SELECT exercise, best_score FROM completions WHERE user_id = ?', [$u['id']])->fetchAll();
        $map = [];
        foreach ($rows as $r) $map[$r['exercise']] = (int)$r['best_score'];
        out(['ok' => true, 'completions' => (object)$map]);

    case 'complete':
        $exercise = (string)($in['exercise'] ?? '');
        $topic = (string)($in['topic'] ?? '');
        $kind = (string)($in['kind'] ?? '');
        $score = max(0, min(100, (int)($in['score'] ?? 0)));
        $base = max(5, min(50, (int)($in['base'] ?? 20)));
        $topicTotal = max(3, min(20, (int)($in['topic_total'] ?? 3)));
        $seconds = max(1, min(3600, (int)($in['seconds'] ?? 0)));
        $bestPoints = (int)round($base * $score / 100); // puntos del ejercicio para el ranking del tema
        if (!preg_match('#^[a-z0-9/-]{3,160}$#', $exercise) || !preg_match('#^[a-z0-9/-]{3,120}$#', $topic) || !str_starts_with($exercise, $topic . '/')) fail('Ejercicio no válido.');
        if (!in_array($kind, AM_KINDS, true)) fail('Tipo de ejercicio no válido.');

        $gained = (int)round($base * $score / 100);
        $u = current_user();
        if (!$u) out(['ok' => true, 'guest' => true, 'xp_gained' => $gained]);

        // Anti-spam: mínimo 5 s entre ejercicios
        $last = $_SESSION['last_complete'] ?? 0;
        if (time() - $last < 5) fail('Demasiado rápido. Espera unos segundos.', 429);
        $_SESSION['last_complete'] = time();

        $prev = q('SELECT best_score FROM completions WHERE user_id = ? AND exercise = ?', [$u['id'], $exercise])->fetch();
        if ($prev) $gained = (int)round($gained * 0.3);

        // Límite diario
        $daily = $u['day'] === today() ? (int)$u['daily_xp'] : 0;
        $cap = (int)(cfg('daily_xp_cap') ?: 600);
        $capped = false;
        if ($daily + $gained > $cap) { $gained = max(0, $cap - $daily); $capped = true; }

        // Racha y semana
        $streak = (int)$u['streak'];
        if ($u['last_active'] !== today()) $streak = $u['last_active'] === yesterday() ? $streak + 1 : 1;
        $weekly = $u['week_key'] === week_key() ? (int)$u['weekly_xp'] : 0;

        // Ligas y cofres
        //  · Un cofre la PRIMERA vez que se llega a cada liga (Plata, Oro, Zafiro, Diamante).
        //  · Un cofre cada semana que se supera la liga con la que se terminó la semana anterior.
        if ($u['week_key'] !== week_key()) {
            $prevLeague = $u['week_key'] === date('o-W', strtotime('-7 days')) ? league_index((int)$u['weekly_xp']) : 0;
        } else {
            $prevLeague = (int)$u['prev_week_league'];
        }
        $L = league_index($weekly + $gained);
        $maxL = (int)$u['max_league']; $maxAt = $u['max_league_at']; $chests = (int)$u['chests']; $weekChest = (string)$u['week_chest'];
        $chestEvents = [];
        if ($L > $maxL) {
            for ($i = $maxL + 1; $i <= $L; $i++) $chestEvents[] = ['type' => 'first', 'league' => AM_LEAGUE_NAMES[$i]];
            $chests += $L - $maxL; $maxL = $L; $maxAt = date('Y-m-d H:i:s'); $weekChest = week_key();
        } elseif ($L >= 1 && $L > $prevLeague && $weekChest !== week_key()) {
            $chestEvents[] = ['type' => 'weekly', 'league' => AM_LEAGUE_NAMES[$L]];
            $chests++; $weekChest = week_key();
        }
        $monthLeague = max(month_league($u), $L); // la evolución del avatar se reinicia cada mes

        db()->beginTransaction();
        q('UPDATE users SET xp = xp + ?, weekly_xp = ?, week_key = ?, daily_xp = ?, day = ?, streak = ?, last_active = ?,
                  prev_week_league = ?, max_league = ?, max_league_at = ?, chests = ?, week_chest = ?, month_key = ?, month_league = ?
           WHERE id = ?',
            [$gained, $weekly + $gained, week_key(), $daily + $gained, today(), $streak, today(),
             $prevLeague, $maxL, $maxAt, $chests, $weekChest, month_key(), $monthLeague, $u['id']]);
        // Se guarda el MEJOR intento: más nota y, a igual nota, menos tiempo.
        // (MySQL aplica las asignaciones en orden: best_score se actualiza al final.)
        q('INSERT INTO completions (user_id, exercise, best_score, best_points, best_seconds, times) VALUES (?, ?, ?, ?, ?, 1)
           ON DUPLICATE KEY UPDATE
             best_seconds = IF(VALUES(best_score) > best_score OR (VALUES(best_score) = best_score AND VALUES(best_seconds) < best_seconds), VALUES(best_seconds), best_seconds),
             best_points  = IF(VALUES(best_score) > best_score, VALUES(best_points), best_points),
             best_score   = GREATEST(best_score, VALUES(best_score)),
             times = times + 1, last_at = NOW()',
            [$u['id'], $exercise, $score, $bestPoints, $seconds]);
        q('INSERT IGNORE INTO user_kinds (user_id, kind) VALUES (?, ?)', [$u['id'], $kind]);
        db()->commit();

        $u = q('SELECT * FROM users WHERE id = ?', [$u['id']])->fetch();
        $new = [];
        $uid = (int)$u['id'];
        grant($uid, 'primer_paso', $new);
        if ($score >= 100) grant($uid, 'perfecto', $new);
        if ($streak >= 3) grant($uid, 'racha_3', $new);
        if ($streak >= 7) grant($uid, 'racha_7', $new);
        if ($u['xp'] >= 100) grant($uid, 'xp_100', $new);
        if ($u['xp'] >= 500) grant($uid, 'xp_500', $new);
        if ($u['xp'] >= 2000) grant($uid, 'xp_2000', $new);
        if ($kind === 'quiz' && !empty($in['flawless'])) grant($uid, 'contrarreloj', $new);
        if ($kind === 'memory') grant($uid, 'memoria', $new);
        if ((int)q('SELECT COUNT(*) FROM user_kinds WHERE user_id = ?', [$uid])->fetchColumn() >= 6) grant($uid, 'explorador', $new);
        $done = (int)q('SELECT COUNT(*) FROM completions WHERE user_id = ? AND exercise LIKE ?', [$uid, $topic . '/%'])->fetchColumn();
        if ($done >= $topicTotal) grant($uid, 'tema_completo', $new);

        out(['ok' => true, 'xp_gained' => $gained, 'capped' => $capped, 'user' => public_user($u), 'new_achievements' => $new, 'chest_events' => $chestEvents]);
}
fail('Acción desconocida', 404);
