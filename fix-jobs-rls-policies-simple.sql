-- Fix RLS policies for jobs table - Allow all operations
-- Run this SQL in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read active jobs" ON jobs;
DROP POLICY IF EXISTS "Allow service role full access jobs" ON jobs;

-- Allow public to read active jobs
CREATE POLICY "Allow public read active jobs" ON jobs
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Allow service role full access (for admin operations)
CREATE POLICY "Allow service role full access jobs" ON jobs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- IMPORTANT: Allow anon to insert/update/delete jobs for admin dashboard
-- This allows the admin dashboard to work with the anon key
CREATE POLICY "Allow anon full access jobs" ON jobs
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);


