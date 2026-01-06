# How to Check Email Logs in Netlify

## Quick Steps to Diagnose Email Issues

### 1. Access Function Logs in Netlify

1. Log into your Netlify dashboard
2. Select your site
3. Go to **Functions** tab (in the top menu)
4. Click on `/api/waitlist` function
5. View the logs

### 2. What to Look For

**If environment variables are missing, you'll see:**
```
[WAITLIST EMAIL] SMTP not configured. Missing: { host: true, user: true, pass: true }
```

**If SMTP connection fails, you'll see:**
```
[WAITLIST EMAIL] Error sending welcome email to: [email]
[WAITLIST EMAIL] Error message: [specific error]
[WAITLIST EMAIL] Error code: [error code]
```

**If email sends successfully, you'll see:**
```
[WAITLIST EMAIL] Successfully sent welcome email to: [email]
[WAITLIST EMAIL] Message ID: [message-id]
```

### 3. Common Log Patterns

#### Pattern 1: Variables Not Set
```
[WAITLIST EMAIL] SMTP not configured. Missing: { host: true, user: false, pass: true }
```
**Fix**: Add the missing variables to Netlify environment variables

#### Pattern 2: Authentication Error
```
[WAITLIST EMAIL] Error code: EAUTH
[WAITLIST EMAIL] Error message: Invalid login
```
**Fix**: Use App-Specific Password, not regular password

#### Pattern 3: Connection Error
```
[WAITLIST EMAIL] Error code: ETIMEDOUT
[WAITLIST EMAIL] Error message: Connection timeout
```
**Fix**: Check ZOHO_SMTP_HOST and ZOHO_SMTP_PORT values

### 4. Testing After Fix

1. Add/update environment variables in Netlify
2. Redeploy site (or push a commit)
3. Submit a test waitlist entry
4. Check function logs immediately after
5. Look for success or error messages

### 5. Alternative: Check Email Logs Table

If your Supabase has the `email_logs` table set up, you can also check there:

1. Go to Supabase dashboard
2. Navigate to Table Editor
3. Open `email_logs` table
4. Look for entries with `email_type = 'waitlist_welcome'`
5. Check `status` column (should be 'sent' or 'failed')
6. If 'failed', check `error_message` column

---

**Tip**: Function logs in Netlify are real-time. Submit a test entry and check logs immediately to see what's happening.

