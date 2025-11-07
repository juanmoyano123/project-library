-- Migration 008: Create Themes Tables
-- Fecha: 2025-11-06
-- Descripción: Tablas para almacenar themes (guías de estilo del /design-system)

-- Tabla principal de themes
CREATE TABLE IF NOT EXISTS themes (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  preview_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de archivos del theme
CREATE TABLE IF NOT EXISTS theme_files (
  id SERIAL PRIMARY KEY,
  theme_id VARCHAR(50) NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
  file_path VARCHAR(500) NOT NULL,
  file_content TEXT NOT NULL,
  file_type VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(theme_id, file_path)
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_theme_files_theme_id ON theme_files(theme_id);
CREATE INDEX IF NOT EXISTS idx_theme_files_type ON theme_files(file_type);

-- Comentarios para documentación
COMMENT ON TABLE themes IS 'Guías de estilo generadas por /design-system';
COMMENT ON TABLE theme_files IS 'Archivos individuales (md, html, css, js) de cada theme';
COMMENT ON COLUMN themes.preview_path IS 'Path al archivo HTML principal para preview (ej: style-guide.html)';
COMMENT ON COLUMN theme_files.file_path IS 'Path relativo del archivo dentro del theme (ej: wireframes/index.html)';
COMMENT ON COLUMN theme_files.file_type IS 'Tipo de archivo: md, html, css, js';
