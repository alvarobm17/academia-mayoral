-- =========================================================================
-- Academia Mayoral — actualización: ranking por tema (puntos y tiempo)
-- SOLO si ya importaste schema.sql ANTES de noviembre de 2026.
-- Si instalas desde cero, no hace falta: schema.sql ya incluye estas columnas.
-- Importar en phpMyAdmin → tu base de datos → Importar.
-- =========================================================================
ALTER TABLE completions
  ADD COLUMN IF NOT EXISTS best_points SMALLINT UNSIGNED NOT NULL DEFAULT 0 AFTER best_score,
  ADD COLUMN IF NOT EXISTS best_seconds INT UNSIGNED NOT NULL DEFAULT 0 AFTER best_points;
