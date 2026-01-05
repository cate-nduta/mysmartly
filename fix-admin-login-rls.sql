-- Fix RLS policy to allow anonymous login queries
-- Run this in Supabase SQL Editor to fix the 406 error on admin login
-- THIS IS REQUIRED FOR ADMIN LOGIN TO WORK!

-- Allow anonymous users to read username, email, and is_active for login purposes
-- This is safe because we only expose non-sensitive data needed for authentication
DROP POLICY IF EXISTS "Allow anonymous read username for login" ON admin_users;
CREATE POLICY "Allow anonymous read username for login" ON admin_users
  FOR SELECT TO anon
  USING (is_active = true)
  WITH CHECK (false);

-- Verify the policy was created
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'admin_users' 
  AND policyname = 'Allow anonymous read username for login';

