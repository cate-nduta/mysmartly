# Reset Admin Password to @MyCK!254

## Quick Steps:

### Step 1: Find Your Admin Email
Run this SQL in Supabase SQL Editor:
```sql
SELECT username, email 
FROM admin_users 
WHERE username = 'whooptydoo';
```

### Step 2: Reset Password in Supabase Dashboard
1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Search for the email from Step 1
3. Click on the user
4. Click **"Send Password Reset Email"** or **"Reset Password"**
5. Check your email and set password to: `@MyCK!254`

### Step 3: Test Login
1. Go to `/admin`
2. Username: `whooptydoo`
3. Password: `@MyCK!254`

---

## Alternative: If You Can't Access Email

If you can't access the email, you can create a new admin account or update the email:

```sql
-- Update email for your username
UPDATE admin_users
SET email = 'your_new_email@example.com'
WHERE username = 'whooptydoo';
```

Then reset password for the new email.

