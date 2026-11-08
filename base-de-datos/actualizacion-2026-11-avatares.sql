-- =========================================================================
-- Academia Mayoral — actualización: avatares, cofres, títulos, fondos y liga máxima
-- SOLO si ya importaste schema.sql antes de esta versión (noviembre de 2026).
-- Si instalas desde cero, no hace falta: schema.sql ya lo incluye.
-- Importar en phpMyAdmin → tu base de datos → Importar.
-- =========================================================================
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS prev_week_league TINYINT UNSIGNED NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_league TINYINT UNSIGNED NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_league_at DATETIME NULL,
  ADD COLUMN IF NOT EXISTS chests SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS week_chest VARCHAR(8) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS month_key CHAR(7) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS month_league TINYINT UNSIGNED NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS avatar_id VARCHAR(20) NULL,
  ADD COLUMN IF NOT EXISTS title_id VARCHAR(20) NOT NULL DEFAULT 'iniciado',
  ADD COLUMN IF NOT EXISTS panel_theme VARCHAR(20) NOT NULL DEFAULT 'aurora';

CREATE TABLE IF NOT EXISTS user_avatars (
  user_id INT UNSIGNED NOT NULL,
  avatar_id VARCHAR(20) NOT NULL,
  obtained_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, avatar_id),
  CONSTRAINT fk_av_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
