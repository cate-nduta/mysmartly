# 🔧 Fix Admin Login Issues - ONE TIME SETUP

## Problem
You've created an account but still can't log in to `/admin`. This is usually because:
1. Your account isn't in the `admin_users` table
2. Your email isn't confirmed
3. Your account exists but `is_active = false`

## ✅ ONE-TIME FIX (Run This Once)

### Step 1: Run SQL Script in Supabase

1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the entire contents of `FIX-ADMIN-ACCOUNT.sql`
3. Click **Run**
4. Check the results - it will show you:
   - ✅ If your account exists
   - ✅ If your email is confirmed
   - ✅ If you're in the admin_users table
   - ✅ Your login status

### Step 2: If Email Not Confirmed

If the SQL shows your email is not confirmed:

**Option A: Check Your Email**
- Look for an email from Supabase
- Click the confirmation link
- Then try logging in again

**Option B: Manually Confirm (Quick Fix)**
- In Supabase Dashboard → **Authentication** → **Users**
- Find your email: `catherinenkuria@gmail.com`
- Click on it
- Click **"Confirm Email"** button

### Step 3: Log In

After running the SQL script:
1. Go to `/admin`
2. Enter:
   - **Email**: `catherinenkuria@gmail.com`
   - **Password**: The password you created when you signed up
3. Click **"Sign In"**

## 🔄 What Changed in the Code

I've updated the login flow to:
- ✅ Automatically add you to `admin_users` if you log in but aren't there
- ✅ Show clearer error messages if email isn't confirmed
- ✅ Better handle edge cases

## 🚫 You Should NOT Need To:

- ❌ Sign up multiple times
- ❌ Create multiple accounts
- ❌ Run SQL scripts repeatedly

## ✅ After This Fix:

- ✅ Log in ONCE with your email and password
- ✅ You'll stay logged in
- ✅ No more signup needed

## 📝 If You Forgot Your Password:

1. Go to `/admin`
2. Click **"Forgot password?"** (if available)
3. Or go to `/auth/forgot-password`
4. Enter your email
5. Check your email for reset link

## 🆘 Still Having Issues?

Run this in Supabase SQL Editor to check everything:

```sql
-- Complete status check
SELECT 
  'Account Status' as check_type,
  u.id,
  u.email,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  au.id IS NOT NULL as is_admin,
  au.is_active as admin_active,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL AND au.is_active = true THEN '✅ READY TO LOGIN'
    WHEN u.email_confirmed_at IS NULL THEN '⚠️ Email not confirmed'
    WHEN au.id IS NULL THEN '⚠️ Not in admin_users table'
    WHEN au.is_active = false THEN '⚠️ Admin account inactive'
    ELSE '❌ Unknown issue'
  END as status
FROM auth.users u
LEFT JOIN admin_users au ON u.id = au.user_id
WHERE u.email = 'catherinenkuria@gmail.com';
```

