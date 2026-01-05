# How to Get Your Zoho App-Specific Password

## Step-by-Step Guide

### Step 1: Log in to Zoho Mail
1. Go to [https://mail.zoho.com](https://mail.zoho.com)
2. Sign in with your Zoho account (the account that manages `hello@mysmartly.app`)

### Step 2: Enable Two-Factor Authentication (2FA)
**Important:** You MUST enable 2FA before you can create App-Specific Passwords.

1. Once logged in, click on the **Settings icon** (gear icon) in the top right
2. Go to **Settings** → **Security** (or **Account** → **Security**)
3. Find **Two-Factor Authentication** section
4. Click **Enable** or **Set Up Two-Factor Authentication**
5. Follow the prompts to set up 2FA (usually via SMS or Authenticator app)
6. Complete the setup

### Step 3: Generate App-Specific Password
1. Still in **Settings** → **Security**
2. Look for **App Passwords** section (should be visible after 2FA is enabled)
3. Click **Generate New Password** or **Create App Password**
4. Enter a name for the password (e.g., "Supabase SMTP" or "MySmartly App")
5. Click **Generate** or **Create**
6. **⚠️ IMPORTANT:** Copy the password immediately - you will NOT be able to see it again!
7. Save it securely (this is your `ZOHO_SMTP_PASS` value)

### Visual Guide (Common Zoho Interface)
```
Zoho Mail → Settings (⚙️) → Security → App Passwords → Generate New Password
```

### Alternative Paths (if the above doesn't match)
- Sometimes it's: **Settings** → **Mail** → **Security** → **App Passwords**
- Or: **My Account** → **Security** → **App Passwords**
- Or: Click your profile picture → **Account Settings** → **Security** → **App Passwords**

## What the Password Looks Like
- It's usually 16 characters long
- Contains letters and numbers
- Example format: `AbCdEf123456GhIj` (your actual password will be different - 16 characters)

## Generate Your Password
Follow the steps above to generate your App-Specific Password. Make sure to copy it immediately as you won't be able to see it again!

## Important Notes

✅ **DO:**
- Enable 2FA first (required step)
- Copy the password immediately when generated
- Save it in a password manager or secure location
- Use this password in your configuration

❌ **DON'T:**
- Use your regular Zoho account password for SMTP
- Share this password publicly
- Skip the 2FA step (it won't work)

## Troubleshooting

**Can't find "App Passwords" option?**
- Make sure 2FA is fully enabled and verified
- Try logging out and back in
- Check if you're on a Zoho Mail plan that supports App Passwords

**"2FA required" error?**
- You must enable Two-Factor Authentication first
- Go back to Step 2 and complete 2FA setup

**Password not working?**
- Verify you copied the entire password (no extra spaces)
- Make sure you're using the App-Specific Password, not your account password
- Try generating a new App-Specific Password

