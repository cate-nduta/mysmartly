-- ============================================
-- FIND ADMIN EMAIL FOR PASSWORD RESET
-- Run this to find the email associated with your username
-- ============================================

-- Find email for username "whooptydoo"
SELECT 
  username,
  email,
  is_active
FROM admin_users
WHERE username = 'whooptydoo';

-- Find all admin users and their emails
SELECT 
  username,
  email,
  is_active,
  created_at
FROM admin_users
ORDER BY created_at DESC;

