-- Migration 003: Add status and source fields to validations table
-- Author: Claude Code
-- Date: 2025-11-05

BEGIN;

-- Add status column (draft | approved)
ALTER TABLE validations
ADD COLUMN status TEXT NOT NULL DEFAULT 'draft'
CHECK (status IN ('draft', 'approved'));

-- Add source column (ai | manual)
ALTER TABLE validations
ADD COLUMN source TEXT NOT NULL DEFAULT 'ai'
CHECK (source IN ('ai', 'manual'));

-- Create index on status for filtering
CREATE INDEX idx_validations_status ON validations(status);

-- Create index on source for analytics
CREATE INDEX idx_validations_source ON validations(source);

-- Update existing records to be 'approved' if verdict is 'go', otherwise 'draft'
UPDATE validations
SET status = CASE
    WHEN verdict = 'go' THEN 'approved'
    ELSE 'draft'
END
WHERE status = 'draft'; -- Only update records that haven't been manually set

-- All existing records are from AI
UPDATE validations
SET source = 'ai'
WHERE source = 'ai'; -- This is redundant but explicit

COMMIT;

-- Verify changes
SELECT
    'validations' as table_name,
    COUNT(*) as total_records,
    COUNT(*) FILTER (WHERE status = 'draft') as draft_count,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_count,
    COUNT(*) FILTER (WHERE source = 'ai') as ai_count,
    COUNT(*) FILTER (WHERE source = 'manual') as manual_count
FROM validations;
