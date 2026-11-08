<?php
/* Contenido Plus: get {id: "curso/asignatura/tema/n"}
   Los recursos son archivos HTML en api/private/premium/ (no accesibles desde el navegador).
   Nombre del archivo: el id con "/" cambiado por "-", p. ej. 3eso-matematicas-ecuaciones-0.html */
declare(strict_types=1);
require __DIR__ . '/lib.php';

$in = api_boot();
if (action() !== 'get') fail('Acción desconocida', 404);
$u = require_user();
if (!is_plus($u)) fail('Este recurso es exclusivo de Mayoral Plus.', 403);

$id = (string)($in['id'] ?? '');
if (!preg_match('#^[a-z0-9-]+(/[a-z0-9-]+){3}$#', $id)) fail('Recurso no válido.');
$file = __DIR__ . '/private/premium/' . str_replace('/', '-', $id) . '.html';
if (!is_file($file)) fail('Este recurso estará disponible muy pronto.', 404);
out(['ok' => true, 'html' => (string)file_get_contents($file)]);
