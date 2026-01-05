-- Fix resume storage policies to allow viewing/downloading
-- Run this SQL in your Supabase SQL Editor

-- First, make sure the resumes bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow public upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow service role full access resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon download resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon read resumes" ON storage.objects;

-- Allow public to upload resumes (job applicants)
CREATE POLICY "Allow public upload resumes" ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'resumes');

-- Allow service role full access (for admin operations)
CREATE POLICY "Allow service role full access resumes" ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'resumes')
  WITH CHECK (bucket_id = 'resumes');

-- IMPORTANT: Allow anon to read/download resumes (for admin dashboard)
-- This allows the admin to view resumes using the anon key
CREATE POLICY "Allow anon read resumes" ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'resumes');


