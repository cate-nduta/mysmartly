# Fix Admin Login Issue

## Quick Fix Steps

### Step 1: Check Your Admin Account
Run this SQL in Supabase SQL Editor:
```sql
-- Check your admin account
SELECT 
  au.username,
  au.email,
  au.is_active,
  u.email_confirmed_at,
  CASE 
    WHEN au.id IS NULL THEN '❌ NO ADMIN RECORD'
    WHEN u.id IS NULL THEN '❌ NO AUTH USER'
    WHEN u.email_confirmed_at IS NULL THEN '⚠️ EMAIL NOT CONFIRMED'
    WHEN au.is_active = false THEN '⚠️ INACTIVE'
    ELSE '✅ OK'
  END as status
FROM admin_users au
LEFT JOIN auth.users u ON au.user_id = u.id
WHERE au.username = 'whooptydoo' OR au.email LIKE '%whooptydoo%';
```

### Step 2: Disable Email Confirmation (Recommended for Development)
1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Settings**
3. Scroll to **Email Auth**
4. **Disable** "Enable email confirmations"
5. Save changes

### Step 3: If Admin Record Doesn't Exist
If the SQL query shows "NO ADMIN RECORD", run this to create it manually:
```sql
-- Replace 'YOUR_USER_ID' with the actual user ID from auth.users table
-- First, find your user ID:
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email = 'YOUR_EMAIL_HERE';

-- Then insert admin record (replace USER_ID_HERE with the ID from above):
INSERT INTO admin_users (user_id, username, email, is_active)
VALUES (
  'USER_ID_HERE',
  'whooptydoo',
  'YOUR_EMAIL_HERE',
  true
)
ON CONFLICT (user_id) DO UPDATE SET
  username = EXCLUDED.username,
  email = EXCLUDED.email,
  is_active = true;
```

### Step 4: If Email Not Confirmed
If email confirmation is enabled and you can't access your email:
1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Find your user
4. Click **Actions** → **Send confirmation email** (or manually confirm)

### Step 5: Reset Password (If Needed)
If you forgot your password:
1. Go to `/admin`
2. Click "Don't have an admin account? Sign up"
3. Try signing up again with the same email (it will say account exists)
4. Or use password reset if available

## Common Issues

### "Invalid username or password"
- **Cause**: Username not found in `admin_users` table
- **Fix**: Run Step 3 to create the admin record

### "Email not confirmed"
- **Cause**: Email confirmation is enabled in Supabase
- **Fix**: Disable email confirmation (Step 2) or confirm your email

### "Admin account not found"
- **Cause**: User exists in auth but not in `admin_users` table
- **Fix**: Run Step 3 to add admin record

## After Fixing
1. Try logging in again with username: `whooptydoo` and your password
2. Check browser console (F12) for any error messages
3. If still not working, check the error message and follow the specific fix above

