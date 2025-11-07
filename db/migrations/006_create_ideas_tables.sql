-- Migration 006: Create Ideas and Idea Combinations tables for M-009: Idea Mixer
-- Created: 2025-11-06
-- Description: Tables for managing project ideas and analyzing combinations

-- Drop tables if they exist (for clean re-runs)
DROP TABLE IF EXISTS idea_combinations CASCADE;
DROP TABLE IF EXISTS ideas CASCADE;

-- Create ideas table
CREATE TABLE ideas (
  id TEXT PRIMARY KEY,              -- IDEA-001, IDEA-002...
  user_id TEXT,                     -- Owner de la idea (futuro: link to auth)

  -- DEMANDA (Problema → Mercado)
  problema TEXT NOT NULL,
  mercado_objetivo TEXT NOT NULL,
  urgencia TEXT CHECK(urgencia IN ('baja', 'media', 'alta', 'crítica')) NOT NULL,
  tamaño_mercado TEXT,
  evidencia_demanda TEXT,

  -- OFERTA (Solución → Herramientas)
  solucion TEXT NOT NULL,
  herramientas_disponibles TEXT[],
  integraciones_necesarias JSONB DEFAULT '[]'::jsonb,   -- Array de {nombre, api, docs, complejidad}
  informacion_requerida TEXT[],

  -- ANÁLISIS TÉCNICO
  complejidad_tecnica INTEGER CHECK(complejidad_tecnica BETWEEN 1 AND 5) NOT NULL,
  skills_requeridos JSONB DEFAULT '[]'::jsonb,          -- Array de {skill, nivel, tenemos}
  tiempo_estimado JSONB,                                 -- {diseño, desarrollo, testing}
  bloqueadores TEXT[],

  -- METADATA
  tags TEXT[],
  categoria TEXT,                   -- fintech, saas, marketplace, etc.
  notas TEXT,
  favorita BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create idea_combinations table
CREATE TABLE idea_combinations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT,
  idea_ids TEXT[] NOT NULL,         -- IDs de las ideas combinadas

  -- RESULTADO DEL ANÁLISIS
  veredicto TEXT CHECK(veredicto IN ('VIABLE', 'NO_VIABLE')),
  confianza INTEGER CHECK(confianza BETWEEN 0 AND 100),
  analisis_completo JSONB,          -- Todo el análisis de Claude

  -- METADATA
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_ideas_urgencia ON ideas(urgencia);
CREATE INDEX idx_ideas_complejidad ON ideas(complejidad_tecnica);
CREATE INDEX idx_ideas_favorita ON ideas(favorita);
CREATE INDEX idx_ideas_categoria ON ideas(categoria);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);

CREATE INDEX idx_combinations_user_id ON idea_combinations(user_id);
CREATE INDEX idx_combinations_veredicto ON idea_combinations(veredicto);
CREATE INDEX idx_combinations_created_at ON idea_combinations(created_at DESC);

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_ideas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ideas_updated_at
  BEFORE UPDATE ON ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_ideas_updated_at();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Migration 006 completed successfully: ideas and idea_combinations tables created';
END $$;
