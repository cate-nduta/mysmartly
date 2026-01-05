-- Add salary column to jobs table
-- Run this SQL in your Supabase SQL Editor if you already have a jobs table

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary NUMERIC;
