# Email Not Sending After Deployment - Fix Guide

## Problem
Emails aren't being sent when users join the waitlist after deploying to Netlify.

## Root Cause
Environment variables for SMTP/email are not set in Netlify, or they're configured incorrectly.

## Solution

### Step 1: Add Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Navigate to: **Site settings** → **Environment variables**
3. Add the following variables:

**Required for Email Sending:**
```
ZOHO_SMTP_HOST = smtp.zoho.com
ZOHO_SMTP_PORT = 465
ZOHO_SMTP_USER = hello@mysmartly.app
ZOHO_SMTP_PASS = [your Zoho app password]
ZOHO_FROM_EMAIL = hello@mysmartly.app
EMAIL_FROM_NAME = Catherine.K
```

### Step 2: Important Notes

1. **ZOHO_SMTP_PASS** must be an **App-Specific Password**, not your regular Zoho password
   - Log into Zoho Mail
   - Go to: Security → App Passwords
   - Generate a new app password
   - Use that password (not your regular account password)

2. **Case Sensitivity**: Environment variable names are case-sensitive
   - Make sure they match exactly: `ZOHO_SMTP_HOST` (all caps)

3. **No Spaces**: Don't include spaces around the `=` sign
   - ✅ Correct: `ZOHO_SMTP_HOST=smtp.zoho.com`
   - ❌ Wrong: `ZOHO_SMTP_HOST = smtp.zoho.com`

### Step 3: Redeploy After Adding Variables

After adding environment variables:
1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Deploy site**
3. This will rebuild with the new environment variables

OR

1. Make a small commit and push to trigger automatic deployment

### Step 4: Verify in Function Logs

1. Go to **Functions** tab in Netlify dashboard
2. Look for function logs after a waitlist submission
3. Check for error messages like:
   - `[WAITLIST EMAIL] SMTP not configured`
   - `[WAITLIST EMAIL] Error sending welcome email`
   - Connection/auth errors

### Step 5: Test

1. Submit a test waitlist entry
2. Check Netlify function logs
3. Check your email inbox (and spam folder)
4. Verify email was sent

## Troubleshooting

### If emails still don't send after adding variables:

1. **Check Function Logs** in Netlify:
   - Functions → `/api/waitlist` → View logs
   - Look for `[WAITLIST EMAIL]` messages
   - Check for specific error messages

2. **Verify Zoho App Password**:
   - Make sure you're using an App-Specific Password
   - Regular password won't work for SMTP

3. **Check Zoho Mail Settings**:
   - Ensure SMTP is enabled in your Zoho account
   - Some Zoho plans require SMTP to be enabled

4. **Verify Email Addresses**:
   - `ZOHO_SMTP_USER` should match your Zoho email
   - `ZOHO_FROM_EMAIL` should be the same or authorized domain

5. **Check Port Settings**:
   - Port 465 requires SSL/TLS
   - Port 587 requires STARTTLS
   - Make sure port matches your Zoho account settings

## Quick Checklist

- [ ] Environment variables added in Netlify dashboard
- [ ] Using App-Specific Password (not regular password)
- [ ] Redeployed site after adding variables
- [ ] Checked function logs for errors
- [ ] Tested with a new waitlist submission
- [ ] Checked spam folder

## Common Error Messages

### "SMTP not configured"
- **Fix**: Add `ZOHO_SMTP_HOST`, `ZOHO_SMTP_USER`, `ZOHO_SMTP_PASS` to Netlify

### "Invalid login credentials"
- **Fix**: Use App-Specific Password instead of regular password

### "Connection timeout"
- **Fix**: Check `ZOHO_SMTP_HOST` and `ZOHO_SMTP_PORT` are correct

### "Authentication failed"
- **Fix**: Verify `ZOHO_SMTP_USER` and `ZOHO_SMTP_PASS` are correct

## Need More Help?

Check the Netlify function logs for detailed error messages. The code logs comprehensive error details starting with `[WAITLIST EMAIL]`.

