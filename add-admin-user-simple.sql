-- Simple: Add admin user by email
-- This will automatically find your user ID and add you as admin
-- Just replace 'catherinenkuria@gmail.com' with your email if different

INSERT INTO admin_users (user_id, email, is_active)
SELECT 
  id,
  email,
  true
FROM auth.users
WHERE email = 'catherinenkuria@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
  is_active = true,
  updated_at = NOW();

-- Check if it worked
SELECT * FROM admin_users WHERE email = 'catherinenkuria@gmail.com';

