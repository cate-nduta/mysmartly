-- ============================================
-- QUICK CHANGE ADMIN USERNAME
-- Replace 'your_new_username' with your desired username
-- Replace 'whooptydoo' with your current username
-- ============================================

-- Change username
UPDATE admin_users
SET username = 'your_new_username'
WHERE username = 'whooptydoo';

-- Verify the change
SELECT 
  username,
  is_active,
  created_at
FROM admin_users
WHERE username = 'your_new_username';

