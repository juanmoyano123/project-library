-- Migration 009: Add theme_id to projects
-- Fecha: 2025-11-06
-- Descripción: Agregar relación de themes a projects

-- Agregar columna theme_id a projects
ALTER TABLE projects
ADD COLUMN theme_id VARCHAR(50) REFERENCES themes(id) ON DELETE SET NULL;

-- Crear índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_projects_theme_id ON projects(theme_id);

-- Comentario para documentación
COMMENT ON COLUMN projects.theme_id IS 'ID del theme asignado al proyecto (opcional)';
