-- COMPLETE FIX: All RLS policies and storage policies
-- Run this SQL in your Supabase SQL Editor to fix ALL issues at once

-- ============================================
-- 1. FIX JOBS TABLE POLICIES
-- ============================================
DROP POLICY IF EXISTS "Allow public read active jobs" ON jobs;
DROP POLICY IF EXISTS "Allow service role full access jobs" ON jobs;
DROP POLICY IF EXISTS "Allow anon full access jobs" ON jobs;

-- Allow public to read active jobs
CREATE POLICY "Allow public read active jobs" ON jobs
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Allow service role full access
CREATE POLICY "Allow service role full access jobs" ON jobs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon to insert/update/delete jobs (for admin dashboard)
CREATE POLICY "Allow anon full access jobs" ON jobs
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 2. FIX JOB_APPLICATIONS TABLE POLICIES
-- ============================================
DROP POLICY IF EXISTS "Allow public insert applications" ON job_applications;
DROP POLICY IF EXISTS "Allow service role full access applications" ON job_applications;
DROP POLICY IF EXISTS "Allow anon read applications" ON job_applications;
DROP POLICY IF EXISTS "Allow anon update applications" ON job_applications;

-- Allow public to insert applications (job applicants)
CREATE POLICY "Allow public insert applications" ON job_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access applications" ON job_applications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon to read applications (for admin dashboard)
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

-- ============================================
-- 3. FIX STORAGE (RESUMES) POLICIES
-- ============================================
-- Make sure the bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow public upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow service role full access resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon read resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read resumes" ON storage.objects;

-- Allow public to upload resumes (job applicants)
CREATE POLICY "Allow public upload resumes" ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'resumes');

-- Allow service role full access
CREATE POLICY "Allow service role full access resumes" ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'resumes')
  WITH CHECK (bucket_id = 'resumes');

-- IMPORTANT: Allow public/anonymous to read resumes (for admin dashboard)
-- This allows viewing/downloading resumes
CREATE POLICY "Allow public read resumes" ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'resumes');

-- ============================================
-- 4. ADD SALARY COLUMN IF IT DOESN'T EXIST
-- ============================================
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary NUMERIC;


