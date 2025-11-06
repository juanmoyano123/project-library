-- ================================================
-- MIGRATION 002: Add V2.0 Tables for 8-Module System
-- Date: November 2025
-- Description: Adds 7 new tables for Project Library V2.0
-- ================================================

-- ================================================
-- M-001: VALIDACIONES (Idea Validator)
-- ================================================

CREATE TABLE IF NOT EXISTS validations (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Input
  raw_idea TEXT NOT NULL,
  target_market TEXT NOT NULL, -- 'USA' | 'LATAM' | 'AR' | 'MX' | etc

  -- Output del análisis
  verdict TEXT NOT NULL CHECK (verdict IN ('go', 'validate_more', 'no_go')),
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100),

  -- Análisis de mercado
  market_analysis JSONB NOT NULL DEFAULT '{}',
  problem_analysis TEXT,
  solution_proposal TEXT,

  -- Adaptaciones y barreras
  adaptations_needed JSONB DEFAULT '[]',
  barriers JSONB DEFAULT '[]',

  -- Stack recomendado
  stack_recommendation JSONB NOT NULL DEFAULT '{}',

  -- MVP scope
  core_features JSONB NOT NULL DEFAULT '[]',
  out_of_scope JSONB DEFAULT '[]',

  -- Estimaciones
  estimated_weeks INTEGER,
  estimated_budget DECIMAL(10,2),

  -- Metadata
  validated_by TEXT DEFAULT 'Claude Sonnet 4',
  validation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  markdown_output TEXT,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- M-002: PRODUCT PLANS (Product Manager)
-- ================================================

CREATE TABLE IF NOT EXISTS product_plans (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  validation_id TEXT REFERENCES validations(id),

  -- Executive Summary
  problem_statement TEXT NOT NULL,
  solution_statement TEXT NOT NULL,
  value_proposition TEXT NOT NULL,

  -- User Persona
  persona JSONB NOT NULL DEFAULT '{}',

  -- User Journey
  user_journey JSONB DEFAULT '[]',

  -- Success Metrics
  success_metrics JSONB NOT NULL DEFAULT '[]',

  -- Tech Stack decision
  tech_stack JSONB NOT NULL DEFAULT '{}',

  -- Dependencies
  dependencies JSONB DEFAULT '{}',

  -- Timeline
  estimated_timeline_days INTEGER,
  milestones JSONB DEFAULT '[]',

  -- Metadata
  created_by TEXT DEFAULT 'Claude Opus 4',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  markdown_output TEXT
);

-- ================================================
-- M-005: FEATURES (Tickets & Kanban)
-- ================================================

CREATE TABLE IF NOT EXISTS features (
  id TEXT PRIMARY KEY, -- F-001, F-002, F-003...
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  plan_id TEXT REFERENCES product_plans(id),

  -- Feature info
  name TEXT NOT NULL,
  description TEXT,
  user_story TEXT NOT NULL, -- "Como X quiero Y para Z"

  -- Priorización
  priority TEXT NOT NULL CHECK (priority IN ('P0', 'P1', 'P2')),
  rice_score JSONB DEFAULT '{}',

  -- Dependencies
  dependencies TEXT[] DEFAULT '{}',
  blocks_features TEXT[] DEFAULT '{}',

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'testing', 'done')),

  -- Acceptance Criteria (Given-When-Then)
  acceptance_criteria JSONB NOT NULL DEFAULT '[]',

  -- Time tracking
  estimated_hours INTEGER,
  actual_hours INTEGER,

  -- Assignee (futuro: multi-user)
  assigned_to TEXT,

  -- Notas de ejecución
  notes TEXT,
  git_commits TEXT[] DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  deployed_to_staging_at TIMESTAMP,
  deployed_to_production_at TIMESTAMP
);

-- ================================================
-- M-004: DESIGNS (UX/UI Designer)
-- ================================================

CREATE TABLE IF NOT EXISTS designs (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  plan_id TEXT REFERENCES product_plans(id),

  -- Design System
  design_system JSONB NOT NULL DEFAULT '{}',

  -- Screens
  screens JSONB DEFAULT '[]',

  -- Component Specs
  components JSONB DEFAULT '[]',

  -- Style Guide
  style_guide_url TEXT,

  -- Metadata
  designed_by TEXT DEFAULT 'Claude Sonnet 4',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP
);

-- ================================================
-- M-006: PROJECT METRICS (Dashboard)
-- ================================================

CREATE TABLE IF NOT EXISTS project_metrics (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Velocity metrics
  velocity DECIMAL(5,2),
  avg_feature_hours DECIMAL(6,2),

  -- Accuracy metrics
  estimation_accuracy DECIMAL(5,2),

  -- Burndown data
  burndown_data JSONB DEFAULT '[]',

  -- RACI matrix
  raci_data JSONB DEFAULT '{}',

  -- Progress
  completion_percentage INTEGER CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  features_completed INTEGER DEFAULT 0,
  features_total INTEGER DEFAULT 0,

  -- Deploy frequency
  deploys_count INTEGER DEFAULT 0,
  last_deploy_at TIMESTAMP,

  -- Timestamps
  recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- M-008: TOOLS (Hub de Herramientas)
-- ================================================

CREATE TABLE IF NOT EXISTS tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('design', 'api', 'deployment', 'development', 'latam', 'inspiration')),
  url TEXT NOT NULL,
  description TEXT,
  icon_name TEXT, -- Lucide icon name

  -- Configuration
  requires_api_key BOOLEAN DEFAULT FALSE,
  api_key_placeholder TEXT,

  -- LATAM specific
  supported_countries TEXT[] DEFAULT '{}',

  -- Metadata
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ================================================
-- M-008: PROJECT_TOOLS (Many-to-Many Relation)
-- ================================================

CREATE TABLE IF NOT EXISTS project_tools (
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,

  -- Configuration per project
  api_key_configured BOOLEAN DEFAULT FALSE,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,

  added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (project_id, tool_id)
);

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- Validations
CREATE INDEX IF NOT EXISTS idx_validations_project_id ON validations(project_id);
CREATE INDEX IF NOT EXISTS idx_validations_verdict ON validations(verdict);
CREATE INDEX IF NOT EXISTS idx_validations_created_at ON validations(created_at DESC);

-- Product Plans
CREATE INDEX IF NOT EXISTS idx_product_plans_project_id ON product_plans(project_id);
CREATE INDEX IF NOT EXISTS idx_product_plans_validation_id ON product_plans(validation_id);
CREATE INDEX IF NOT EXISTS idx_product_plans_created_at ON product_plans(created_at DESC);

-- Features
CREATE INDEX IF NOT EXISTS idx_features_project_id ON features(project_id);
CREATE INDEX IF NOT EXISTS idx_features_plan_id ON features(plan_id);
CREATE INDEX IF NOT EXISTS idx_features_status ON features(status);
CREATE INDEX IF NOT EXISTS idx_features_priority ON features(priority);
CREATE INDEX IF NOT EXISTS idx_features_created_at ON features(created_at DESC);

-- Designs
CREATE INDEX IF NOT EXISTS idx_designs_project_id ON designs(project_id);
CREATE INDEX IF NOT EXISTS idx_designs_plan_id ON designs(plan_id);

-- Project Metrics
CREATE INDEX IF NOT EXISTS idx_project_metrics_project_id ON project_metrics(project_id);
CREATE INDEX IF NOT EXISTS idx_project_metrics_recorded_at ON project_metrics(recorded_at DESC);

-- Tools
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_name ON tools(name);

-- Project Tools
CREATE INDEX IF NOT EXISTS idx_project_tools_project_id ON project_tools(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tools_tool_id ON project_tools(tool_id);
CREATE INDEX IF NOT EXISTS idx_project_tools_is_favorite ON project_tools(is_favorite);

-- ================================================
-- TRIGGERS
-- ================================================

-- Update project.updated_at cuando se crea/actualiza una validation
CREATE OR REPLACE FUNCTION update_project_on_validation()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_project_on_validation
  AFTER INSERT OR UPDATE ON validations
  FOR EACH ROW
  EXECUTE FUNCTION update_project_on_validation();

-- Update project.updated_at cuando se crea/actualiza un plan
CREATE TRIGGER trigger_update_project_on_plan
  AFTER INSERT OR UPDATE ON product_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_project_on_validation();

-- Update project.updated_at cuando se crea/actualiza una feature
CREATE TRIGGER trigger_update_project_on_feature
  AFTER INSERT OR UPDATE ON features
  FOR EACH ROW
  EXECUTE FUNCTION update_project_on_validation();

-- ================================================
-- COMMENTS
-- ================================================

COMMENT ON TABLE validations IS 'M-001: Validaciones de ideas USA→LATAM';
COMMENT ON TABLE product_plans IS 'M-002: Product plans con RICE scoring';
COMMENT ON TABLE features IS 'M-005: Features tipo Jira con Kanban tracking';
COMMENT ON TABLE designs IS 'M-004: Design systems y mockups';
COMMENT ON TABLE project_metrics IS 'M-006: Métricas y KPIs del proyecto';
COMMENT ON TABLE tools IS 'M-008: Catálogo de herramientas';
COMMENT ON TABLE project_tools IS 'M-008: Relación many-to-many projects↔tools';

-- ================================================
-- MIGRATION COMPLETE
-- ================================================

-- Log migration
DO $$
BEGIN
  RAISE NOTICE 'Migration 002 completed: 7 tables created for V2.0';
  RAISE NOTICE '  - validations';
  RAISE NOTICE '  - product_plans';
  RAISE NOTICE '  - features';
  RAISE NOTICE '  - designs';
  RAISE NOTICE '  - project_metrics';
  RAISE NOTICE '  - tools';
  RAISE NOTICE '  - project_tools';
END $$;
