-- ============================================
-- COMPLETE ADMIN SETUP SQL SCRIPT
-- Run this in your Supabase SQL Editor to set up admin authentication
-- This creates the admin_users table, adds username support, and sets up RLS policies
-- ============================================

-- Step 1: Create admin_users table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  username TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Step 2: Add username column if it doesn't exist (for existing tables)
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Step 3: Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Step 4: Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "Allow service role full access admin users" ON admin_users;
DROP POLICY IF EXISTS "Allow authenticated read own admin status" ON admin_users;

-- Allow service role full access (for admin operations)
CREATE POLICY "Allow service role full access admin users" ON admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to check if they are admin
CREATE POLICY "Allow authenticated read own admin status" ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Step 6: Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = user_uuid AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Instructions for adding your admin user
-- After running this script, you need to:
-- 1. Find your user ID in auth.users:
--    SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
--
-- 2. Insert your user into admin_users:
--    INSERT INTO admin_users (user_id, email, username, is_active)
--    VALUES (
--      'YOUR_USER_ID_FROM_STEP_1',
--      'your-email@example.com',
--      'whooptydoo',  -- or your desired username
--      true
--    )
--    ON CONFLICT (user_id) DO UPDATE SET
--      username = EXCLUDED.username,
--      is_active = true,
--      updated_at = NOW();

-- Step 8: Verification query (uncomment and run after adding your user)
-- SELECT 
--   au.username,
--   au.email,
--   au.is_active,
--   u.email as auth_email,
--   CASE 
--     WHEN au.is_active = true AND au.username IS NOT NULL THEN '✅ Ready'
--     WHEN au.username IS NULL THEN '⚠️ Username not set'
--     WHEN au.is_active = false THEN '⚠️ Account inactive'
--     ELSE '❌ Check status'
--   END as status
-- FROM admin_users au
-- JOIN auth.users u ON au.user_id = u.id
-- WHERE au.username = 'whooptydoo';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Admin setup complete!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Find your user ID: SELECT id, email FROM auth.users WHERE email = ''your-email@example.com'';';
  RAISE NOTICE '2. Add yourself to admin_users with username ''whooptydoo''';
  RAISE NOTICE '3. Run: npm run setup-admin';
END $$;

