-- ============================================
-- SIMPLE CHANGE ADMIN USERNAME
-- Replace 'your_new_username' with your desired username
-- Replace 'whooptydoo' with your current username
-- ============================================

UPDATE admin_users
SET username = 'your_new_username'
WHERE username = 'whooptydoo';

-- Verify it worked
SELECT username, is_active 
FROM admin_users 
WHERE username = 'your_new_username';

