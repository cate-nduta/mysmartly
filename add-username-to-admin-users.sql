-- ============================================
-- ADD USERNAME TO ADMIN_USERS TABLE
-- Run this in Supabase SQL Editor
-- This adds username support for admin login
-- ============================================

-- Step 1: Add username column (unique)
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Step 2: Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);

-- Step 3: Set username for existing admin user
-- This sets your username to 'whooptydoo' for catherinenkuria@gmail.com
UPDATE admin_users
SET username = 'whooptydoo'
WHERE email = 'catherinenkuria@gmail.com'
  AND username IS NULL;

-- Step 4: Set default username for any other admins (use email prefix)
UPDATE admin_users
SET username = SPLIT_PART(email, '@', 1)
WHERE username IS NULL;

-- Step 5: Verify the update worked
SELECT 
  '✅ VERIFICATION' as status,
  au.username,
  au.email,
  au.is_active,
  CASE 
    WHEN au.username IS NOT NULL AND au.is_active = true THEN '✅ Ready to login with username'
    WHEN au.username IS NULL THEN '⚠️ Username not set'
    WHEN au.is_active = false THEN '⚠️ Account inactive'
    ELSE '❌ Check account status'
  END as login_status
FROM admin_users au
WHERE au.email = 'catherinenkuria@gmail.com';
