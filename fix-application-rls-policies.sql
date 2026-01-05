-- Fix RLS policies for job_applications table
-- Run this SQL in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public insert applications" ON job_applications;
DROP POLICY IF EXISTS "Allow service role full access applications" ON job_applications;
DROP POLICY IF EXISTS "Allow anon read applications" ON job_applications;

-- Allow public to insert applications (job applicants)
CREATE POLICY "Allow public insert applications" ON job_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow service role full access (for admin dashboard)
CREATE POLICY "Allow service role full access applications" ON job_applications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- IMPORTANT: Allow anon to read applications (for admin dashboard using anon key)
CREATE POLICY "Allow anon read applications" ON job_applications
  FOR SELECT
  TO anon
  USING (true);

-- Allow anon to update applications (for admin dashboard status updates)
CREATE POLICY "Allow anon update applications" ON job_applications
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);


