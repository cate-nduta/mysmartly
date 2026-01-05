-- ============================================
-- FIX THE 406 ERROR ON ADMIN LOGIN
-- Run this NOW in Supabase SQL Editor
-- ============================================

-- Step 1: Drop the old policy if it exists
DROP POLICY IF EXISTS "Allow anonymous read username for login" ON admin_users;

-- Step 2: Create the policy that allows anonymous users to read username/email for login
CREATE POLICY "Allow anonymous read username for login" ON admin_users
  FOR SELECT 
  TO anon
  USING (is_active = true);

-- Step 3: Verify it worked
SELECT 
  '✅ Policy created!' as status,
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'admin_users' 
  AND policyname = 'Allow anonymous read username for login';

-- If you see the policy above, you're good to go!
-- Now try logging in again at /admin

