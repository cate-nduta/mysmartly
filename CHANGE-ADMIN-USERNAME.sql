-- ============================================
-- CHANGE ADMIN USERNAME
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: View current admin accounts
SELECT 
  au.id,
  au.username,
  au.is_active,
  au.created_at
FROM admin_users au
ORDER BY au.created_at DESC;

-- Step 2: Update username
-- Replace 'old_username' with your current username
-- Replace 'new_username' with your desired new username
UPDATE admin_users
SET username = 'new_username'
WHERE username = 'old_username';

-- Step 3: Update username for whooptydoo (if that's your account)
UPDATE admin_users
SET username = 'your_new_username'
WHERE username = 'whooptydoo';

-- Step 4: Verify the change
SELECT 
  au.username,
  au.is_active,
  'Username updated successfully' as status
FROM admin_users au
WHERE au.username = 'your_new_username';

