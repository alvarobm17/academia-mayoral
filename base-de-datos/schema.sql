-- =========================================================================
-- Academia Mayoral — estructura de la base de datos (MySQL / MariaDB)
-- Importa este archivo en hPanel → Bases de datos → phpMyAdmin → Importar
-- =========================================================================

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nick VARCHAR(20) NOT NULL,
  email VARCHAR(120) NOT NULL,
  pass_hash VARCHAR(255) NOT NULL,
  birthdate DATE NOT NULL,
  course VARCHAR(8) NOT NULL DEFAULT '3eso',
  parent_email VARCHAR(120) NULL,
  parent_token CHAR(48) NULL,
  parent_confirmed_at DATETIME NULL,
  status ENUM('active','pending_parent') NOT NULL DEFAULT 'active',
  friend_code CHAR(8) NOT NULL,
  xp INT UNSIGNED NOT NULL DEFAULT 0,
  weekly_xp INT UNSIGNED NOT NULL DEFAULT 0,
  week_key VARCHAR(8) NOT NULL DEFAULT '',
  daily_xp INT UNSIGNED NOT NULL DEFAULT 0,
  day DATE NULL,
  streak INT UNSIGNED NOT NULL DEFAULT 0,
  last_active DATE NULL,
  plus_until DATETIME NULL,
  stripe_customer VARCHAR(64) NULL,
  prev_week_league TINYINT UNSIGNED NOT NULL DEFAULT 0,
  max_league TINYINT UNSIGNED NOT NULL DEFAULT 0,
  max_league_at DATETIME NULL,
  chests SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  week_chest VARCHAR(8) NOT NULL DEFAULT '',
  month_key CHAR(7) NOT NULL DEFAULT '',
  month_league TINYINT UNSIGNED NOT NULL DEFAULT 0,
  avatar_id VARCHAR(20) NULL,
  title_id VARCHAR(20) NOT NULL DEFAULT 'iniciado',
  panel_theme VARCHAR(20) NOT NULL DEFAULT 'aurora',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_nick (nick),
  UNIQUE KEY uq_email (email),
  UNIQUE KEY uq_code (friend_code),
  KEY idx_token (parent_token),
  KEY idx_customer (stripe_customer),
  KEY idx_rank_week (week_key, weekly_xp),
  KEY idx_rank_all (xp),
  KEY idx_course (course)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS completions (
  user_id INT UNSIGNED NOT NULL,
  exercise VARCHAR(160) NOT NULL,
  best_score TINYINT UNSIGNED NOT NULL DEFAULT 0,
  best_points SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  best_seconds INT UNSIGNED NOT NULL DEFAULT 0,
  times INT UNSIGNED NOT NULL DEFAULT 1,
  last_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, exercise),
  CONSTRAINT fk_comp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_avatars (
  user_id INT UNSIGNED NOT NULL,
  avatar_id VARCHAR(20) NOT NULL,
  obtained_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, avatar_id),
  CONSTRAINT fk_av_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_kinds (
  user_id INT UNSIGNED NOT NULL,
  kind VARCHAR(16) NOT NULL,
  PRIMARY KEY (user_id, kind),
  CONSTRAINT fk_kind_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS achievements (
  user_id INT UNSIGNED NOT NULL,
  achievement VARCHAR(32) NOT NULL,
  at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, achievement),
  CONSTRAINT fk_ach_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS friends (
  user_id INT UNSIGNED NOT NULL,
  friend_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, friend_id),
  CONSTRAINT fk_fr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_fr_friend FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL,
  course VARCHAR(40) NULL,
  topic VARCHAR(60) NULL,
  message TEXT NOT NULL,
  ip VARCHAR(45) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_ip_time (ip, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS login_attempts (
  ip VARCHAR(45) NOT NULL,
  at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_ip (ip, at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS stripe_events (
  id VARCHAR(255) PRIMARY KEY,
  type VARCHAR(80) NOT NULL,
  received_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
