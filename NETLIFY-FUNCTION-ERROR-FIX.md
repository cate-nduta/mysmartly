# Fixing Email Error on Netlify (Was Working Locally)

## Problem
Emails worked locally but fail after deployment to Netlify.

## Common Netlify-Specific Issues

### Issue 1: Function Timeout
Netlify functions have a default timeout of 10 seconds. Email sending can take longer.

**Symptoms:**
- Function times out
- Error about execution time
- No email sent

**Fix:** The code already has timeouts configured, but we can verify they're appropriate.

### Issue 2: Environment Variables Not Available at Runtime
Variables might not be accessible in serverless functions.

**Symptoms:**
- "SMTP not configured" errors
- Variables show as undefined
- Works locally but not on Netlify

**Fix:** 
- Verify variables are set for "All scopes"
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### Issue 3: Node.js Version Mismatch
Netlify might use different Node version than local.

**Fix:** `netlify.toml` sets NODE_VERSION = 18, which should be fine.

### Issue 4: Memory Limits
Large email HTML might exceed memory limits.

**Fix:** Current email HTML is reasonable size, shouldn't be an issue.

### Issue 5: Network/Firewall Restrictions
Netlify functions might have network restrictions.

**Symptoms:**
- Connection timeout errors
- Network errors
- Can't reach SMTP server

**Fix:** Check if Netlify functions can reach smtp.zoho.com on port 465.

## Immediate Steps to Diagnose

1. **Check Function Logs in Netlify:**
   - Go to Functions → `/api/waitlist`
   - Submit a test entry
   - Look for error messages
   - Copy the exact error

2. **Common Error Messages:**

**"Function execution timed out"**
→ Email sending taking too long
→ May need to increase timeout or optimize

**"SMTP not configured"**
→ Environment variables not being read
→ Need to verify variables are set correctly

**"Connection timeout" or "ETIMEDOUT"**
→ Can't reach Zoho SMTP from Netlify
→ Network/firewall issue

**"Invalid login" or "EAUTH"**
→ Password/authentication issue
→ Need App-Specific Password

**"Module not found" or "require is not defined"**
→ Node.js/runtime issue
→ Check Netlify build logs

## What to Share

Please share:
1. **Exact error message** from Netlify function logs
2. **Error code** (if any)
3. **Whether you see "[WAITLIST EMAIL] Attempting to send"** message
4. **Any timeout or memory errors**

## Quick Test

To verify if it's a Netlify-specific issue:
1. Check if the function is even being called (look for any logs)
2. See if environment variables are being read (look for "[WAITLIST EMAIL] SMTP Config" log)
3. Check for any error messages

---

**Most Important**: Check the Netlify function logs and share the exact error message. That will tell us exactly what's wrong.

