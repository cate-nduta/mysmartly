# Zoho SMTP Quick Reference for hello@mysmartly.app

## Quick Setup for Your Business Email

**Your Email:** `hello@mysmartly.app`

### Step 1: Get App-Specific Password
1. Log in to Zoho Mail (https://mail.zoho.com)
2. Settings → Security → Enable 2FA (if not enabled)
3. Settings → Security → App Passwords → Generate New Password
4. Name it: "Supabase SMTP"
5. **Copy the password immediately** (you won't see it again!)

### Step 2: Configure in Supabase Dashboard

Go to: **Supabase Dashboard → Authentication → Settings → SMTP Settings**

**Enable Custom SMTP:** ON

**Settings:**
```
SMTP Host: smtp.zoho.com
SMTP Port: 587
Encryption: TLS
SMTP Username: hello@mysmartly.app
SMTP Password: [paste your app-specific password here]
Sender Email: hello@mysmartly.app
Sender Name: MySmartly
```

**Test Connection:** Click "Send Test Email"
**Save:** Click "Save"

## Important Notes

✅ **DO:** Use your App-Specific Password (not your regular password)  
✅ **DO:** Use `smtp.zoho.com` as SMTP host (even for custom domain)  
✅ **DO:** Use `hello@mysmartly.app` as both username and sender email  

❌ **DON'T:** Put SMTP settings in `.env.local` file  
❌ **DON'T:** Use your regular Zoho password  
❌ **DON'T:** Change the SMTP host for custom domains  

## Your .env.local File (No Changes Needed)

Your `.env.local` stays the same - no email settings needed:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

SMTP configuration is done entirely in Supabase Dashboard!

