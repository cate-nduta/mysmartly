# 👤 Admin Username Login Setup

## ✅ What Changed

Admin login now uses **username and password** instead of email and password.

## 🔧 Setup Required

### Step 1: Run SQL Script

Run `add-username-to-admin-users.sql` in your Supabase SQL Editor to:
- Add `username` column to `admin_users` table
- Create index for faster lookups
- Set default usernames for existing admins (based on email prefix)

### Step 2: Update Your Admin Account

After running the SQL, update your admin username:

```sql
-- Update your admin username (replace with your desired username)
UPDATE admin_users
SET username = 'your_username_here'
WHERE email = 'catherinenkuria@gmail.com';
```

## 📋 How It Works

### Login Flow
1. User enters **username** and **password**
2. System looks up username in `admin_users` table
3. Gets the associated email (used internally for Supabase auth)
4. Authenticates with Supabase using email and password
5. Grants admin access if username exists and is active

### Signup Flow
1. User enters **username**, **full name**, and **password**
2. System checks if username already exists
3. Creates account with internal email: `username@admin.mysmartly.local`
4. Stores username in `admin_users` table
5. User can log in with username going forward

## 🔒 Security

- ✅ Usernames are case-insensitive (converted to lowercase)
- ✅ Usernames must be unique
- ✅ Username validation: letters, numbers, and underscores only
- ✅ Minimum 3 characters
- ✅ Passwords still required and secure

## 📝 Username Requirements

- **Minimum**: 3 characters
- **Allowed**: Letters (a-z, A-Z), numbers (0-9), underscores (_)
- **Case**: Automatically converted to lowercase
- **Uniqueness**: Must be unique across all admin users

## 🚀 Usage

### Login
- Go to `/admin`
- Enter your **username** (not email)
- Enter your **password**
- Click "Sign In"

### Signup
- Go to `/admin`
- Click "Don't have an admin account? Sign up"
- Enter:
  - **Full Name**
  - **Username** (must be unique)
  - **Password** (min 8 characters)
  - **Confirm Password**

## ⚠️ Important Notes

- **Email is still used internally** for Supabase authentication
- **Username is what you use to log in** (displayed in UI)
- **Existing admins** need to set their username after running the SQL
- **New admins** will set username during signup

## 🔄 Migration for Existing Admins

If you're an existing admin:

1. Run `add-username-to-admin-users.sql`
2. Your username will be set to the part before @ in your email
3. You can change it by running:
   ```sql
   UPDATE admin_users
   SET username = 'your_preferred_username'
   WHERE email = 'your_email@example.com';
   ```
4. Log in with your new username (not email)

