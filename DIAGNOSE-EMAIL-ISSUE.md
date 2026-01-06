# Diagnosing Email Not Sending - Step by Step

Since you've added the environment variables but it's still not working, let's diagnose step by step.

## Step 1: Check Netlify Function Logs

This is the MOST IMPORTANT step to see what's actually happening.

1. Go to Netlify Dashboard → Your Site
2. Click **Functions** tab (top menu)
3. Find `/api/waitlist` function
4. Click on it to see logs
5. Submit a test waitlist entry
6. Immediately check the logs

**Look for these messages:**

### If you see:
```
[WAITLIST EMAIL] SMTP not configured. Missing: { host: false, user: false, pass: false }
```
→ Environment variables are NOT being read by Netlify functions

### If you see:
```
[WAITLIST EMAIL] Attempting to send welcome email to: [email]
[WAITLIST EMAIL] SMTP Config: { host: 'smtp.zoho.com', port: '465', user: 'hello@mysmartly.app', ... }
```
→ Variables ARE being read, but something else is wrong

### If you see:
```
[WAITLIST EMAIL] Error sending welcome email
[WAITLIST EMAIL] Error code: EAUTH
[WAITLIST EMAIL] Error message: Invalid login credentials
```
→ Password/auth issue

### If you see:
```
[WAITLIST EMAIL] Error code: ETIMEDOUT
[WAITLIST EMAIL] Error message: Connection timeout
```
→ Connection/network issue

## Step 2: Verify Environment Variables in Netlify

1. Go to **Site settings** → **Environment variables**
2. Make sure you see ALL of these:
   - `ZOHO_SMTP_HOST`
   - `ZOHO_SMTP_PORT`
   - `ZOHO_SMTP_USER`
   - `ZOHO_SMTP_PASS`
   - `ZOHO_FROM_EMAIL` (optional but recommended)
   - `EMAIL_FROM_NAME` (optional)

3. Check for typos:
   - ✅ Correct: `ZOHO_SMTP_HOST`
   - ❌ Wrong: `ZOHO_SMTP_HOST ` (trailing space)
   - ❌ Wrong: `zoho_smtp_host` (wrong case)

4. Check values don't have quotes:
   - ✅ Correct: `smtp.zoho.com`
   - ❌ Wrong: `"smtp.zoho.com"` (with quotes)

## Step 3: Redeploy After Adding Variables

**CRITICAL:** After adding/changing environment variables, you MUST redeploy:

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete
4. Test again

OR

1. Make a small change to any file (like add a space)
2. Commit and push
3. Wait for auto-deployment
4. Test again

## Step 4: Verify Zoho App Password

1. Log into Zoho Mail
2. Go to **Security** → **App Passwords**
3. Make sure you have an app password generated
4. Copy the password (it's long, like: `abcd1234efgh5678`)
5. Make sure you're using this password, NOT your regular account password

## Step 5: Common Issues

### Issue 1: Variables Not Available in Functions
**Symptom**: Logs show "SMTP not configured" even though variables are set

**Fix**: 
- Make sure variables are set for "All scopes" or "Production"
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)

### Issue 2: Authentication Error
**Symptom**: Error code EAUTH or "Invalid login credentials"

**Fix**:
- Use App-Specific Password, not regular password
- Make sure ZOHO_SMTP_USER matches your Zoho email exactly
- Check password doesn't have extra spaces

### Issue 3: Connection Timeout
**Symptom**: Error code ETIMEDOUT

**Fix**:
- Verify ZOHO_SMTP_HOST = `smtp.zoho.com`
- Verify ZOHO_SMTP_PORT = `465`
- Check Zoho account allows SMTP access
- Some Zoho plans require SMTP to be enabled

### Issue 4: Function Not Seeing Variables
**Symptom**: Variables show in Netlify but logs say they're missing

**Fix**:
- Clear build cache in Netlify (Site settings → Build & deploy → Clear cache)
- Redeploy
- Check if variables are set for correct environment (Production/Branch)

## Step 6: Test Locally First

To verify your credentials work, test locally:

1. Make sure your `.env.local` has the same values
2. Run: `node test-email.js`
3. If it works locally but not on Netlify → Netlify environment variable issue
4. If it doesn't work locally → Credential issue

## Step 7: Contact Info

When checking logs, look for:
- Exact error messages
- Error codes (EAUTH, ETIMEDOUT, etc.)
- Whether variables are being read
- Connection attempt messages

Share these details if you need more help!

