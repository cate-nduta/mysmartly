# URGENT: Fix Zoho Authentication

## The Problem
Both test endpoint and waitlist are failing with "535 Authentication Failed"

## The Solution: Use Zoho App Password

Zoho Mail **REQUIRES** an App Password for SMTP authentication. Your regular login password won't work.

---

## Quick Fix (5 minutes):

### Step 1: Enable 2FA (if not already enabled)
1. Go to https://mail.zoho.com
2. Click your profile icon (top right)
3. Go to **Security** or **My Account** → **Security**
4. Enable **Two-Factor Authentication** if not already enabled

### Step 2: Create App Password
1. In Security settings, scroll to **App Passwords**
2. Click **Generate New Password**
3. Name it: "SMTP for mySmartly"
4. **COPY THE PASSWORD IMMEDIATELY** (you can only see it once!)

### Step 3: Update .env.local
1. Open `.env.local` file
2. Find `ZOHO_SMTP_PASS=`
3. Replace the value with the **App Password** you just copied:
   ```
   ZOHO_SMTP_PASS=your_app_password_here
   ```
   **Important:**
   - NO quotes around the password
   - NO spaces before/after
   - Use the EXACT password from Zoho

### Step 4: Restart Server
```bash
# Stop server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 5: Test
1. Visit: `http://localhost:3000/api/test-email`
2. Should return success
3. Check your email inbox

---

## Alternative: Check if SMTP Access is Enabled

If App Password doesn't work:

1. Go to Zoho Mail Settings
2. Look for **POP/IMAP Access** or **Mail Client Access**
3. Make sure **SMTP Access** is enabled
4. Some accounts require this to be enabled separately

---

## Still Not Working?

Try port 587 instead of 465:

In `.env.local`:
```
ZOHO_SMTP_PORT=587
```

Then update code to use STARTTLS instead of SSL (but port 465 should work with App Password).

