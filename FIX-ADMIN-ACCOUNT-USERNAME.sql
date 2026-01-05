-- ============================================
-- FIX ADMIN ACCOUNT FOR USERNAME LOGIN
-- Run this ONCE in Supabase SQL Editor
-- This will ensure you can log in as admin with username
-- ============================================

-- Step 1: Add username column if it doesn't exist
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Create index for faster username lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);

-- Step 2: Set username for existing admin (replace 'your_username' with your desired username)
-- This will set username based on email prefix if username is NULL
UPDATE admin_users
SET username = COALESCE(username, SPLIT_PART(email, '@', 1))
WHERE email = 'catherinenkuria@gmail.com'
  AND username IS NULL;

-- Step 3: Check if your account exists and has username
SELECT 
  '✅ ADMIN ACCOUNT STATUS' as status,
  au.id as admin_id,
  au.username,
  au.email as internal_email,
  au.is_active,
  au.created_at as admin_since,
  u.email as auth_email,
  u.email_confirmed_at,
  CASE 
    WHEN au.is_active = true AND au.username IS NOT NULL AND u.email_confirmed_at IS NOT NULL THEN '✅ READY TO LOGIN WITH USERNAME'
    WHEN au.username IS NULL THEN '⚠️ Username not set - run UPDATE statement above'
    WHEN au.is_active = false THEN '⚠️ Admin account inactive'
    WHEN u.email_confirmed_at IS NULL THEN '⚠️ Email not confirmed'
    ELSE '❌ NOT SET UP CORRECTLY'
  END as login_status
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id
WHERE au.email = 'catherinenkuria@gmail.com';

-- Step 4: If you want to set a custom username, run this:
-- UPDATE admin_users
-- SET username = 'your_preferred_username'
-- WHERE email = 'catherinenkuria@gmail.com';

