-- Step 1: Find your user ID by email
-- Replace 'catherinenkuria@gmail.com' with your actual email
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'catherinenkuria@gmail.com';

-- Step 2: After you get your user ID from Step 1, run this query
-- Replace 'YOUR_USER_ID_FROM_STEP_1' with the actual UUID you got
-- Example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
INSERT INTO admin_users (user_id, email, is_active)
VALUES (
  'YOUR_USER_ID_FROM_STEP_1',  -- Replace with the UUID from Step 1
  'catherinenkuria@gmail.com',
  true
)
ON CONFLICT (user_id) DO UPDATE SET
  is_active = true,
  updated_at = NOW();

