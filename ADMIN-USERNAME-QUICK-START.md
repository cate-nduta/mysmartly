# 🚀 Admin Username Login - Quick Start Guide

## ✅ Where to Run SQL

### Step 1: Run SQL in Supabase

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**
5. Copy and paste the entire contents of `add-username-to-admin-users.sql`
6. Click **"Run"** (or press Ctrl+Enter)

That's it! The SQL will:
- Add the `username` column to `admin_users` table
- Create an index for faster lookups
- Set your username to 'whooptydoo' (as you've already added in the file)

## 🔑 What's Your Password?

Your password is **the same password you used when you signed up** as admin.

- If you signed up with email `catherinenkuria@gmail.com`, use that password
- If you forgot your password, you can reset it (see below)

### To Reset Password (if needed):

Since we're now using username login, password reset works differently:

1. Go to `/admin`
2. Try logging in with username `whooptydoo` and your password
3. If password doesn't work, you'll need to reset it via Supabase Dashboard:
   - Go to Supabase Dashboard → Authentication → Users
   - Find your user (email: `catherinenkuria@gmail.com` or the internal email)
   - Click on the user
   - Click "Send password reset email" (but this sends to the internal email)
   
   **OR** use the SQL to manually update password hash (not recommended)

   **OR** create a new admin account with a new username and password

## 📝 Do You Need to Change .env File?

**NO!** You don't need to change your `.env` file.

The `.env` file is for:
- Supabase connection (URL and keys)
- Email/SMTP settings
- Other API keys

The username login is handled entirely in the database - no environment variables needed.

## 🎯 How to Log In Now

1. Go to `/admin` in your browser
2. Enter:
   - **Username**: `whooptydoo` (as you set in the SQL)
   - **Password**: The password you used when you signed up
3. Click "Sign In"

## ⚠️ If Login Doesn't Work

### Check 1: Verify Username is Set
Run this in Supabase SQL Editor:
```sql
SELECT username, email, is_active 
FROM admin_users 
WHERE email = 'catherinenkuria@gmail.com';
```

You should see:
- `username`: `whooptydoo`
- `is_active`: `true`

### Check 2: Verify Account Exists
Run this in Supabase SQL Editor:
```sql
SELECT id, email, email_confirmed_at 
FROM auth.users 
WHERE email LIKE '%catherinenkuria%';
```

### Check 3: If Password Doesn't Work
You have two options:

**Option A: Create New Admin Account**
1. Go to `/admin`
2. Click "Don't have an admin account? Sign up"
3. Enter:
   - Full Name: Your name
   - Username: `whooptydoo` (or a new one)
   - Password: Choose a new password
   - Confirm Password: Same password
4. Click "Sign Up"

**Option B: Reset via Supabase Dashboard**
1. Go to Supabase Dashboard → Authentication → Users
2. Find user with email containing `catherinenkuria`
3. Click "Send password reset email"
4. Check the email (might be the internal `whooptydoo@admin.mysmartly.local` email)

## 📋 Summary

- ✅ **Run SQL**: In Supabase Dashboard → SQL Editor
- ✅ **Password**: Same as when you signed up (or create new account)
- ✅ **.env File**: No changes needed
- ✅ **Username**: `whooptydoo` (as you set in SQL)

## 🆘 Still Having Issues?

Run `FIX-ADMIN-ACCOUNT-USERNAME.sql` in Supabase SQL Editor - it will:
1. Add username column if missing
2. Set your username automatically
3. Show you the status of your account

Then try logging in with:
- Username: `whooptydoo`
- Password: Your original password (or create a new account if you forgot it)

