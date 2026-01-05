-- Fix RLS policies for jobs table to allow admin operations
-- Run this SQL in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read active jobs" ON jobs;
DROP POLICY IF EXISTS "Allow service role full access jobs" ON jobs;
DROP POLICY IF EXISTS "Allow authenticated insert jobs" ON jobs;
DROP POLICY IF EXISTS "Allow authenticated update jobs" ON jobs;
DROP POLICY IF EXISTS "Allow authenticated delete jobs" ON jobs;

-- Allow public to read active jobs
CREATE POLICY "Allow public read active jobs" ON jobs
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Allow service role full access (for admin dashboard via service role key)
CREATE POLICY "Allow service role full access jobs" ON jobs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to insert (for admin operations)
CREATE POLICY "Allow authenticated insert jobs" ON jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update jobs" ON jobs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete jobs" ON jobs
  FOR DELETE
  TO authenticated
  USING (true);

-- Also allow anon to insert/update/delete (for admin dashboard using anon key)
-- This is less secure but necessary if admin dashboard uses anon key
CREATE POLICY "Allow anon insert jobs" ON jobs
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update jobs" ON jobs
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon delete jobs" ON jobs
  FOR DELETE
  TO anon
  USING (true);


