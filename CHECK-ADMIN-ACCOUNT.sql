-- ============================================
-- CHECK YOUR ADMIN ACCOUNT STATUS
-- Run this in Supabase SQL Editor to see your admin account
-- ============================================

-- Check if your admin account exists
SELECT 
  'ADMIN ACCOUNT CHECK' as check_type,
  au.id as admin_id,
  au.username,
  au.email,
  au.is_active,
  au.created_at as admin_created,
  u.id as user_id,
  u.email as auth_email,
  u.email_confirmed_at,
  u.created_at as user_created,
  CASE 
    WHEN au.id IS NULL THEN '❌ NO ADMIN RECORD - Run signup again'
    WHEN u.id IS NULL THEN '❌ NO AUTH USER - Account creation failed'
    WHEN u.email_confirmed_at IS NULL THEN '⚠️ EMAIL NOT CONFIRMED - Check your email or disable email confirmation in Supabase'
    WHEN au.is_active = false THEN '⚠️ ADMIN ACCOUNT INACTIVE'
    WHEN au.username IS NULL THEN '⚠️ USERNAME NOT SET'
    ELSE '✅ ACCOUNT LOOKS GOOD'
  END as status
FROM admin_users au
LEFT JOIN auth.users u ON au.user_id = u.id
WHERE au.username = 'whooptydoo' OR au.email LIKE '%whooptydoo%' OR au.email = 'catherinenkuria@gmail.com'
ORDER BY au.created_at DESC
LIMIT 5;

-- List all admin users
SELECT 
  'ALL ADMIN USERS' as check_type,
  au.username,
  au.email,
  au.is_active,
  u.email_confirmed_at IS NOT NULL as email_confirmed
FROM admin_users au
LEFT JOIN auth.users u ON au.user_id = u.id
ORDER BY au.created_at DESC;

