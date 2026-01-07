-- Fix Guides RLS Policy and Verify Data
-- Run this in your Supabase SQL Editor

-- First, let's check if the guides table exists and see the data
SELECT 
  id,
  title,
  slug,
  is_published,
  published_date,
  category,
  created_at
FROM guides
ORDER BY created_at DESC;

-- Check current RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'guides';

-- Drop and recreate RLS policies to ensure they're correct
DROP POLICY IF EXISTS "Allow public read published guides" ON guides;
DROP POLICY IF EXISTS "Allow authenticated full access guides" ON guides;
DROP POLICY IF EXISTS "Allow service role full access guides" ON guides;
DROP POLICY IF EXISTS "Allow anon full access guides" ON guides;

-- Allow anonymous users to read published guides
CREATE POLICY "Allow public read published guides" ON guides
  FOR SELECT
  TO anon
  USING (is_published = true);

-- Allow authenticated users (admins) full access
CREATE POLICY "Allow authenticated full access guides" ON guides
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access guides" ON guides
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Verify the policy was created
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'guides';

-- Test query as anonymous user (this simulates what the client-side does)
-- Note: This will run as the service role, but shows what should be returned
SELECT 
  id,
  title,
  slug,
  is_published,
  published_date
FROM guides
WHERE is_published = true
ORDER BY published_date DESC;

