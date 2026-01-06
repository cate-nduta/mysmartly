-- Add feature poll and feedback fields to waitlist table
-- Run this in Supabase SQL Editor

ALTER TABLE waitlist 
ADD COLUMN IF NOT EXISTS features TEXT[],
ADD COLUMN IF NOT EXISTS integration_wish TEXT,
ADD COLUMN IF NOT EXISTS custom_feature TEXT;

-- Add index for searching by integration_wish
CREATE INDEX IF NOT EXISTS idx_waitlist_integration_wish ON waitlist(integration_wish);

