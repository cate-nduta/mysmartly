# Admin Authentication Setup Guide

## Overview

The admin dashboard now requires:
1. **Google OAuth** authentication (no password-based login)
2. **Two-Factor Authentication (2FA)** - must be enabled before accessing admin

## Setup Steps

### 1. Create Admin Users Table

Run the SQL script `add-admin-users-table.sql` in your Supabase SQL Editor.

This creates:
- `admin_users` table to track which users have admin access
- RLS policies for security
- Helper function `is_admin()` to check admin status

### 2. Add Admin User

To grant admin access to a user, insert their user ID into the `admin_users` table:

```sql
-- First, find the user's ID from auth.users table
-- Then insert into admin_users
INSERT INTO admin_users (user_id, email, is_active)
VALUES (
  'USER_ID_FROM_AUTH_USERS',
  'admin@example.com',
  true
);
```

**To find a user's ID:**
1. Go to Supabase Dashboard > Authentication > Users
2. Find the user's email
3. Copy their UUID (user ID)
4. Use that UUID in the INSERT statement above

### 3. Enable 2FA for Admin User

The admin user must enable 2FA before accessing the admin dashboard:

1. **Sign in as the admin user** (regular user login)
2. Go to `/dashboard/settings`
3. Enable Two-Factor Authentication
4. Scan QR code with authenticator app (Google Authenticator, Authy, etc.)
5. Verify the setup code
6. 2FA is now enabled

### 4. Access Admin Dashboard

1. Navigate to `/admin`
2. Click "Continue with Google"
3. Sign in with Google OAuth
4. Enter 2FA code when prompted
5. Access granted to admin dashboard

## Security Features

### OAuth-Only Authentication
- No password-based login for admin
- Must use Google OAuth
- Prevents password-based attacks

### Mandatory 2FA
- All admin users must have 2FA enabled
- 2FA code required on every admin login
- Uses TOTP (Time-based One-Time Password)

### Admin User Tracking
- `admin_users` table tracks who has admin access
- Can activate/deactivate admin users
- Email address stored for reference

## Managing Admin Users

### Add New Admin User

```sql
INSERT INTO admin_users (user_id, email, is_active)
VALUES (
  'NEW_USER_UUID',
  'newadmin@example.com',
  true
);
```

### Remove Admin Access

```sql
UPDATE admin_users
SET is_active = false
WHERE email = 'admin@example.com';
```

### Reactivate Admin Access

```sql
UPDATE admin_users
SET is_active = true
WHERE email = 'admin@example.com';
```

## Troubleshooting

### "Access denied. You do not have admin privileges."
- User is not in `admin_users` table
- User's `is_active` is set to `false`
- Solution: Add user to `admin_users` table or set `is_active = true`

### "Two-Factor Authentication Required"
- User has admin access but 2FA is not enabled
- Solution: User must enable 2FA in `/dashboard/settings` first

### "Invalid verification code"
- Wrong 2FA code entered
- Authenticator app time is out of sync
- Solution: Check time sync in authenticator app, try again

### Google OAuth Not Working
- Check Google OAuth is configured in Supabase Dashboard
- Verify redirect URLs are correct
- See `GOOGLE-OAUTH-SETUP.md` for detailed instructions

## Best Practices

1. **Limit Admin Users**: Only grant admin access to trusted users
2. **Regular Audits**: Periodically review `admin_users` table
3. **2FA Enforcement**: Never disable 2FA requirement for admin
4. **Email Verification**: Ensure admin emails are verified
5. **Session Management**: Admin sessions expire when browser closes

## Migration from Old System

If you were using the old password-based admin system:

1. Run `add-admin-users-table.sql`
2. Add your admin user to `admin_users` table
3. Enable 2FA for that user
4. Remove `NEXT_PUBLIC_ADMIN_PASSWORD` from `.env.local` (no longer needed)
5. Old password-based login will no longer work

