-- Migration: Add tokens_used column to usage_tracking table
-- Run this if you already have the usage_tracking table

ALTER TABLE usage_tracking 
ADD COLUMN IF NOT EXISTS tokens_used INTEGER DEFAULT 0;

-- Update existing records to have 0 tokens if null
UPDATE usage_tracking 
SET tokens_used = 0 
WHERE tokens_used IS NULL;

