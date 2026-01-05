-- ============================================
-- FIX ADMIN ACCOUNT FOR catherinenkuria@gmail.com
-- Run this ONCE in Supabase SQL Editor
-- This will ensure you can log in as admin
-- ============================================

-- Step 1: Check if your account exists in auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN '❌ Email NOT confirmed - you may need to check your email'
    ELSE '✅ Email confirmed'
  END as email_status
FROM auth.users
WHERE email = 'catherinenkuria@gmail.com';

-- Step 2: Add/Update you as admin (runs automatically)
-- This will add you to admin_users table if you're not there
-- Or update your status if you're already there
INSERT INTO admin_users (user_id, email, is_active)
SELECT 
  id as user_id,
  email,
  true as is_active
FROM auth.users
WHERE email = 'catherinenkuria@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
  is_active = true,
  email = EXCLUDED.email,
  updated_at = NOW();

-- Step 3: Verify you're now an admin
SELECT 
  '✅ ADMIN STATUS CHECK' as status,
  au.id as admin_id,
  au.email as admin_email,
  au.is_active,
  au.created_at as admin_since,
  u.email as auth_email,
  u.email_confirmed_at,
  CASE 
    WHEN au.is_active = true AND u.email_confirmed_at IS NOT NULL THEN '✅ READY TO LOGIN'
    WHEN au.is_active = true AND u.email_confirmed_at IS NULL THEN '⚠️ Admin but email not confirmed - check your email'
    ELSE '❌ NOT SET UP CORRECTLY'
  END as login_status
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id
WHERE au.email = 'catherinenkuria@gmail.com';

-- Step 4: If email is not confirmed, you can manually confirm it (optional)
-- Uncomment the line below ONLY if you want to manually confirm the email
-- UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'catherinenkuria@gmail.com';

