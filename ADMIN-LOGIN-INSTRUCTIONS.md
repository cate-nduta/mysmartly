# Admin Login Instructions

## How to Access the Admin Dashboard

The admin system uses **email/password authentication** through Supabase. There is **no default password** - you need to create your own admin account.

## Option 1: Sign Up as Admin (Recommended)

1. Navigate to `/admin` in your browser
2. Click **"Don't have an admin account? Sign up"**
3. Fill in the form:
   - **Full Name**: Your name
   - **Email**: Your email address (e.g., `catherinenkuria@gmail.com`)
   - **Password**: Choose a secure password (minimum 8 characters)
   - **Confirm Password**: Re-enter your password
4. Click **"Sign Up"**
5. You'll be automatically added to the admin users table and redirected to the admin dashboard

## Option 2: Add Existing User as Admin

If you already have a user account in Supabase Auth, you can add yourself as an admin using SQL:

1. Go to your Supabase Dashboard > SQL Editor
2. Run this SQL script (replace the email with your actual email):

```sql
-- Add admin user by email (finds user ID automatically)
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
```

3. After running the script, you can log in at `/admin` using your existing email and password

## Logging In

Once you have an admin account:

1. Go to `/admin`
2. Enter your **email** and **password**
3. Click **"Sign In"**
4. You'll be redirected to the admin dashboard

## Important Notes

- **Password Requirements**: Minimum 8 characters
- **Security**: Use a strong, unique password
- **Email Confirmation**: If email confirmation is enabled in Supabase, you may need to confirm your email before logging in
- **Multiple Admins**: You can create multiple admin accounts by signing up different users

## Troubleshooting

**"Access denied. You do not have admin privileges"**
- Your email is not in the `admin_users` table
- Run the SQL script above to add yourself as admin
- Or sign up directly from the `/admin` page

**"Email not confirmed"**
- Check your email inbox for a confirmation link
- Or disable email confirmation in Supabase Dashboard > Authentication > Settings

**Forgot Password**
- Use the "Forgot password?" link on the login page
- Or go to `/auth/forgot-password`

