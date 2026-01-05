-- ============================================
-- SET ADMIN USERNAME
-- Replace 'your_username' with your desired username
-- Replace 'old_username' with your current username (or leave blank to set for all)
-- ============================================

-- Update username for a specific admin
UPDATE admin_users
SET username = 'your_username'
WHERE username = 'old_username';

-- Or set username if it's NULL/empty
UPDATE admin_users
SET username = 'your_username'
WHERE username IS NULL OR username = '';

-- Check the result
SELECT 
  '✅ Username Updated' as status,
  username,
  is_active
FROM admin_users
WHERE username = 'your_username';

