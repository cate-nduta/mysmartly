# How to Check Netlify Function Logs for Email Issues

## Why Network Tab Isn't Enough

The network tab shows `waitlist 200` which means the API request succeeded, but it doesn't tell us if the email was actually sent.

The email sending happens **asynchronously in the background**, so:
- ✅ API returns 200 (request processed)
- ❓ Email might still fail silently

We need to check **function logs** to see what actually happened.

## Step-by-Step: Check Function Logs

### Step 1: Access Function Logs
1. Go to **Netlify Dashboard**
2. Select your site
3. Click **"Functions"** tab (in the top menu bar)
4. Find **`/api/waitlist`** in the list
5. Click on it

### Step 2: View Recent Logs
You'll see a log viewer with recent function executions. Look for entries that show:
- Timestamp
- Function execution details
- Console logs from the function

### Step 3: Submit a Test Entry
1. Open your deployed website in a new tab
2. Submit a test waitlist entry (use a test email)
3. **Immediately go back** to the Netlify function logs
4. Look for the most recent log entry

### Step 4: Look for These Messages

The code logs messages starting with `[WAITLIST EMAIL]`:

#### ✅ Good Signs:
```
[WAITLIST EMAIL] Attempting to send welcome email to: test@example.com
[WAITLIST EMAIL] SMTP Config: { host: 'smtp.zoho.com', port: '465', user: 'hello@mysmartly.app', ... }
[WAITLIST EMAIL] SMTP connection verified successfully
[WAITLIST EMAIL] Successfully sent welcome email to: test@example.com
```
→ Email is being sent successfully!

#### ❌ Problem Signs:

**Variables Not Read:**
```
[WAITLIST EMAIL] SMTP not configured. Missing: { host: true, user: false, pass: true }
```
→ Environment variables aren't being read (need redeploy or check variable names)

**Authentication Error:**
```
[WAITLIST EMAIL] Error sending welcome email to: test@example.com
[WAITLIST EMAIL] Error code: EAUTH
[WAITLIST EMAIL] Error message: Invalid login credentials
```
→ Password issue (need App-Specific Password, not regular password)

**Connection Error:**
```
[WAITLIST EMAIL] Error code: ETIMEDOUT
[WAITLIST EMAIL] Error message: Connection timeout
```
→ Network/connection issue (check ZOHO_SMTP_HOST and ZOHO_SMTP_PORT)

**SMTP Verification Failed:**
```
[WAITLIST EMAIL] SMTP verification failed: { message: '...', code: '...' }
```
→ SMTP connection/auth issue

## Step 5: Copy the Error Details

If you see errors, copy:
- The error code (EAUTH, ETIMEDOUT, etc.)
- The error message
- Any "Missing:" details

This will help diagnose the exact issue.

## Alternative: Check Build Logs

If you can't find function logs, also check:
1. **Deploys** tab
2. Click on the most recent deployment
3. Check build logs for any errors

## What to Share

If emails still don't work after checking logs, share:
1. What you see in the function logs
2. Any error codes or messages
3. Whether you see "[WAITLIST EMAIL] Attempting to send" message

---

**Remember**: The network tab showing 200 just means the API accepted the request. Function logs show what actually happened with the email sending.

