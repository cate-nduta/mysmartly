-- Automatic: Add admin user by email (finds user ID automatically)
-- Replace 'catherinenkuria@gmail.com' with your actual email

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

-- Verify the admin user was added
SELECT 
  au.id,
  au.email,
  au.is_active,
  au.created_at,
  u.email as auth_email
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id
WHERE au.email = 'catherinenkuria@gmail.com';

