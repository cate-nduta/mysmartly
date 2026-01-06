# Zoho SMTP Authentication Fix

## Problem
Getting "535 Authentication Failed" even though password is correct.

## Solution: Use Zoho App Password

Zoho Mail requires **App Passwords** for SMTP authentication. Your regular account password won't work.

### How to Create App Password:

1. **Login to Zoho Mail**
   - Go to https://mail.zoho.com
   - Login with your account

2. **Go to Security Settings**
   - Click on your profile/account icon (top right)
   - Go to **Security** or **My Account** → **Security**

3. **Enable Two-Factor Authentication (if not enabled)**
   - App Passwords require 2FA to be enabled
   - Enable 2FA if you haven't already

4. **Generate App Password**
   - Scroll to **App Passwords** section
   - Click **Generate New Password**
   - Give it a name like "SMTP for mySmartly"
   - Copy the generated password (you can only see it once!)

5. **Update `.env.local`**
   ```env
   ZOHO_SMTP_HOST=smtp.zoho.com
   ZOHO_SMTP_PORT=465
   ZOHO_SMTP_USER=hello@mysmartly.app
   ZOHO_SMTP_PASS=<PASTE THE APP PASSWORD HERE - NOT YOUR REGULAR PASSWORD>
   ZOHO_FROM_EMAIL=hello@mysmartly.app
   ```

6. **Restart dev server**
   ```bash
   npm run dev
   ```

7. **Test again**
   - Submit a waitlist entry
   - Check if email sends

## Important Notes:

- ✅ **Use App Password** - Not your regular login password
- ✅ **Keep it secret** - Don't commit to git
- ✅ **Copy it immediately** - You can only see it once
- ✅ **No spaces** - Remove any spaces when pasting

## If Still Not Working:

1. Check Zoho account settings:
   - Enable SMTP access in Zoho Mail settings
   - Some accounts need SMTP access enabled separately

2. Check firewall/network:
   - Port 465 should be open
   - Some networks block SMTP

3. Try port 587 with STARTTLS:
   ```env
   ZOHO_SMTP_PORT=587
   ```
   (Then update code to use STARTTLS instead of SSL)

