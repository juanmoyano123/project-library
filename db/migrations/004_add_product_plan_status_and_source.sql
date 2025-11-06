-- Migration 004: Add status and source fields to product_plans table
-- This enables workflow management and tracking of plan origin

BEGIN;

-- Add status column (draft | approved)
ALTER TABLE product_plans
ADD COLUMN status TEXT NOT NULL DEFAULT 'draft'
CHECK (status IN ('draft', 'approved'));

-- Add source column (ai | manual)
ALTER TABLE product_plans
ADD COLUMN source TEXT NOT NULL DEFAULT 'ai'
CHECK (source IN ('ai', 'manual'));

-- Create indexes for better query performance
CREATE INDEX idx_product_plans_status ON product_plans(status);
CREATE INDEX idx_product_plans_source ON product_plans(source);

-- Update existing records to be 'approved' and 'ai'
-- Since they were generated with AI and are already being used
UPDATE product_plans
SET status = 'approved', source = 'ai'
WHERE status = 'draft';

COMMIT;
