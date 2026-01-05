# Set Admin Password for Username Login

## Option 1: Use Supabase Dashboard (Easiest)

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Find the user with email that matches your admin account (check `admin_users` table for the email)
4. Click on the user
5. Click **"Reset Password"** or **"Send Password Reset Email"**
6. Check your email and click the reset link
7. Set your new password: `@MyCK!254`

## Option 2: Find Your Admin Email First

Run this SQL to find the email associated with username "whooptydoo":

```sql
SELECT username, email 
FROM admin_users 
WHERE username = 'whooptydoo';
```

Then use that email to reset the password in Supabase Dashboard.

## Option 3: Reset Password via API (If you have access)

If you want to set it programmatically, you'll need to use Supabase Admin API or create a password reset link.

