<?php
/* Ranking: list {scope: global|course|friends, period: week|all}
            topic {topic: "curso/asignatura/tema", total: nº de ejercicios del tema} */
declare(strict_types=1);
require __DIR__ . '/lib.php';

$in = api_boot();

/* Aspecto público de cada alumno en los rankings: avatar, fase, título y aureola Plus */
function looks(array $r): array {
    return ['avatar_id' => $r['avatar_id'] ?? null, 'phase' => avatar_phase(month_league($r)),
            'title' => $r['title_id'] ?: 'iniciado', 'plus' => !empty($r['plus_until']) && strtotime($r['plus_until']) > time()];
}

/* ---------- Ranking de los ejercicios de un tema ----------
   Puntos = suma de los puntos del mejor intento de cada ejercicio.
   Tiempo = suma del tiempo de esos mejores intentos (solo cuenta si se han hecho todos). */
if (action() === 'topic') {
    $topic = (string)($in['topic'] ?? '');
    if (!preg_match('#^[a-z0-9-]+/[a-z0-9-]+/[a-z0-9-]+$#', $topic)) fail('Tema no válido.');
    $total = max(1, min(30, (int)($in['total'] ?? 1)));
    $me = current_user();
    $sql = 'SELECT u.id, u.nick, u.course, u.avatar_id, u.title_id, u.month_key, u.month_league, u.plus_until, IF(u.week_key = ?, u.weekly_xp, 0) AS wxp,
                   COUNT(*) AS done, SUM(c.best_points) AS pts, SUM(c.best_seconds) AS secs
            FROM completions c JOIN users u ON u.id = c.user_id
            WHERE c.exercise LIKE ? AND u.status = "active"';
    $rows = q($sql . ' GROUP BY u.id ORDER BY pts DESC, done DESC, secs ASC, u.id ASC LIMIT 20', [week_key(), $topic . '/%'])->fetchAll();
    $out = [];
    $seen = false;
    $map = function ($r) use ($me, $total) {
        $done = min($total, (int)$r['done']);
        return ['nick' => $r['nick'], 'course' => $r['course'], 'weekly_xp' => (int)$r['wxp'], 'points' => (int)$r['pts'],
                'done' => $done, 'seconds' => $done >= $total ? (int)$r['secs'] : null, 'me' => $me && (int)$r['id'] === (int)$me['id']] + looks($r);
    };
    foreach ($rows as $r) { $x = $map($r); $seen = $seen || $x['me']; $out[] = $x; }
    if ($me && !$seen) {
        $mine = q($sql . ' AND u.id = ? GROUP BY u.id', [week_key(), $topic . '/%', $me['id']])->fetch();
        if ($mine) $out[] = $map($mine);
    }
    out(['ok' => true, 'rows' => $out, 'total' => $total]);
}

if (action() !== 'list') fail('Acción desconocida', 404);

$scope = in_array($in['scope'] ?? '', ['global', 'course', 'friends'], true) ? $in['scope'] : 'global';
$period = ($in['period'] ?? '') === 'all' ? 'all' : 'week';
$me = current_user();
$wk = week_key();

$where = 'u.status = "active"';
$params = [$wk];
if ($scope === 'course') {
    if (!$me) fail('Inicia sesión para ver el ranking de tu curso.', 401);
    $where .= ' AND u.course = ?';
    $params[] = $me['course'];
} elseif ($scope === 'friends') {
    if (!$me) fail('Inicia sesión para ver el ranking de tus amigos.', 401);
    $where .= ' AND (u.id = ? OR u.id IN (SELECT friend_id FROM friends WHERE user_id = ?))';
    $params[] = $me['id'];
    $params[] = $me['id'];
}
$order = $period === 'all' ? 'u.xp' : 'wxp';

$rows = q("SELECT u.id, u.nick, u.course, u.xp, u.avatar_id, u.title_id, u.month_key, u.month_league, u.plus_until, IF(u.week_key = ?, u.weekly_xp, 0) AS wxp
           FROM users u WHERE $where ORDER BY $order DESC, u.id ASC LIMIT 50", $params)->fetchAll();

$out = [];
$seen = false;
foreach ($rows as $r) {
    $isMe = $me && (int)$r['id'] === (int)$me['id'];
    $seen = $seen || $isMe;
    $out[] = ['nick' => $r['nick'], 'course' => $r['course'], 'xp' => (int)$r['xp'], 'weekly_xp' => (int)$r['wxp'], 'me' => $isMe] + looks($r);
}
if ($me && !$seen && $scope !== 'friends') {
    $p = public_user($me);
    $out[] = ['nick' => $p['nick'], 'course' => $p['course'], 'xp' => $p['xp'], 'weekly_xp' => $p['weekly_xp'], 'me' => true] + looks($me);
}
out(['ok' => true, 'rows' => $out]);
