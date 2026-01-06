# Email Not Sending - Quick Fix Guide

## Critical Step: Check Function Logs

**You MUST check the Netlify function logs to see the error.**

### How to Check Logs:

1. **Go to Netlify Dashboard** → Your Site
2. **Click "Functions" tab** (top menu)
3. **Click on `/api/waitlist`** function
4. **Submit a test waitlist entry** on your website
5. **Immediately check the logs** (most recent entry)
6. **Look for messages starting with `[WAITLIST EMAIL]`**

## Common Errors and Fixes

### Error 1: "SMTP not configured"
**What you'll see:**
```
[WAITLIST EMAIL] SMTP not configured. Missing: { host: true, user: false, pass: true }
```

**Fix:**
- Environment variables not being read
- Make sure variables are set for "All scopes"
- Redeploy after adding variables
- Clear cache and redeploy

### Error 2: "EAUTH" or "Invalid login"
**What you'll see:**
```
[WAITLIST EMAIL] Error code: EAUTH
[WAITLIST EMAIL] Error message: Invalid login credentials
```

**Fix:**
- Use **App-Specific Password**, not regular password
- Generate at: Zoho Mail → Security → App Passwords
- Update `ZOHO_SMTP_PASS` in Netlify
- Redeploy after updating

### Error 3: "Connection timeout" or "ETIMEDOUT"
**What you'll see:**
```
[WAITLIST EMAIL] Error code: ETIMEDOUT
[WAITLIST EMAIL] Error message: Connection timeout
```

**Fix:**
- Netlify functions might not be able to reach Zoho SMTP
- Try port 587 instead of 465
- Or check Zoho SMTP settings
- This is a network/firewall issue

### Error 4: "Function timeout"
**What you'll see:**
```
Function execution timed out
```

**Fix:**
- Email sending taking too long
- Netlify functions have 10s timeout by default
- This is less likely but possible

## If You Don't See Any Logs

If there are NO logs at all:
1. The function might not be running
2. Check if the API route is being called
3. Check browser console for errors
4. Verify the route is deployed correctly

## Most Likely Issues (Based on Your Situation)

Since it worked locally but not on Netlify:

1. **Environment variables not accessible** (most common)
   - Even though they're set, functions might not see them
   - Try: Clear cache, redeploy

2. **Network restrictions**
   - Netlify functions might be blocked from Zoho SMTP
   - Less common but possible

3. **Authentication issue**
   - Password might not be App-Specific Password
   - Or password has extra spaces

## Action Required NOW

**Please check the function logs and share:**
1. Do you see ANY `[WAITLIST EMAIL]` messages?
2. What error message appears?
3. What error code (if any)?

Without seeing the actual error from the logs, we're guessing. The logs will tell us exactly what's wrong.

---

**Next Step**: Go to Netlify → Functions → /api/waitlist → Check logs → Share the error message you see.

