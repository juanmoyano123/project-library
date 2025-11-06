-- ================================================
-- MIGRATION 005: Create Features Table
-- Date: November 2025
-- Description: M-005 - Features/Tickets/Kanban System
-- ================================================

-- ================================================
-- M-005: FEATURES (Tickets & Kanban)
-- ================================================

CREATE TABLE IF NOT EXISTS features (
  id TEXT PRIMARY KEY, -- F-001, F-002, etc.
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  plan_id TEXT REFERENCES product_plans(id) ON DELETE SET NULL,

  -- Core Feature Info
  name TEXT NOT NULL,
  description TEXT,
  user_story TEXT NOT NULL, -- Given-When-Then format

  -- Prioritization
  priority TEXT NOT NULL CHECK (priority IN ('P0', 'P1', 'P2')),
  rice_score JSONB DEFAULT '{}', -- {reach, impact, confidence, effort, score}

  -- Dependencies
  dependencies TEXT[] DEFAULT '{}', -- Array of feature IDs that this depends on
  blocks_features TEXT[] DEFAULT '{}', -- Array of feature IDs that this blocks

  -- Status & Workflow
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'testing', 'done')),
  acceptance_criteria JSONB NOT NULL DEFAULT '[]', -- Array of criteria objects

  -- Estimation & Tracking
  estimated_hours DECIMAL(10,2),
  actual_hours DECIMAL(10,2),

  -- Assignment
  assigned_to TEXT, -- User/Developer name

  -- Notes & Git
  notes TEXT,
  git_commits TEXT[] DEFAULT '{}', -- Array of commit SHAs/messages

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP, -- When status changed to in_progress
  completed_at TIMESTAMP, -- When status changed to done
  deployed_to_staging_at TIMESTAMP,
  deployed_to_production_at TIMESTAMP
);

-- ================================================
-- Indexes for Performance
-- ================================================

CREATE INDEX IF NOT EXISTS idx_features_project_id ON features(project_id);
CREATE INDEX IF NOT EXISTS idx_features_plan_id ON features(plan_id);
CREATE INDEX IF NOT EXISTS idx_features_status ON features(status);
CREATE INDEX IF NOT EXISTS idx_features_priority ON features(priority);
CREATE INDEX IF NOT EXISTS idx_features_assigned_to ON features(assigned_to);
CREATE INDEX IF NOT EXISTS idx_features_created_at ON features(created_at);

-- ================================================
-- Trigger for auto-updating updated_at
-- ================================================

CREATE OR REPLACE FUNCTION update_features_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_features_updated_at
  BEFORE UPDATE ON features
  FOR EACH ROW
  EXECUTE FUNCTION update_features_updated_at();

-- ================================================
-- Comments for Documentation
-- ================================================

COMMENT ON TABLE features IS 'M-005: Features/Tickets for Kanban/Gantt project management';
COMMENT ON COLUMN features.id IS 'Feature ID in format F-001, F-002, etc.';
COMMENT ON COLUMN features.rice_score IS 'RICE scoring: {reach, impact, confidence, effort, score}';
COMMENT ON COLUMN features.dependencies IS 'Array of feature IDs that this feature depends on';
COMMENT ON COLUMN features.blocks_features IS 'Array of feature IDs that this feature blocks';
COMMENT ON COLUMN features.acceptance_criteria IS 'Array of Given-When-Then acceptance criteria';
