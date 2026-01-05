# Adding Zoho SMTP Settings to .env.local File

## Important Clarification

**Supabase SMTP Configuration:**
- Supabase handles SMTP configuration in the **Supabase Dashboard**, NOT through environment variables
- Go to: **Supabase Dashboard → Authentication → Settings → SMTP Settings**
- Configure Zoho SMTP there (see `ZOHO-EMAIL-SETUP.md` for details)

**Environment Variables:**
- The `.env.local` file variables below are **optional** - only add them if you need to send emails directly from your Next.js application (not through Supabase Auth)
- These env vars are NOT used by Supabase for authentication emails

## Your .env.local File Structure

Your `.env.local` file should contain:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_PASSWORD=admin123

# Zoho SMTP Settings (OPTIONAL - for direct email sending, not Supabase Auth)
ZOHO_SMTP_HOST=smtp.zoho.com        # or smtp.zoho.eu if you're on the EU servers
ZOHO_SMTP_PORT=465                  # 465 = SSL, 587 = STARTTLS
ZOHO_SMTP_USER=hello@mysmartly.app
ZOHO_SMTP_PASS=your_zoho_app_password_here         # Get from Zoho Mail → Security → App Passwords
ZOHO_FROM_EMAIL=hello@mysmartly.app
EMAIL_FROM_NAME=mySmartly
CALENDAR_EMAIL=hello@mysmartly.app
```

**Note:** There's a typo in your original - `ZOHO_FROM_EMAIL=hhello@mysmartly.app` should be `ZOHO_FROM_EMAIL=hello@mysmartly.app` (single 'h').

## How to Get Your Zoho Password (ZOHO_SMTP_PASS)

### Step-by-Step:

1. **Log in to Zoho Mail:**
   - Go to [https://mail.zoho.com](https://mail.zoho.com)
   - Sign in with the account that manages `hello@mysmartly.app`

2. **Enable Two-Factor Authentication (2FA):**
   - Click **Settings** (⚙️ icon) in the top right
   - Go to **Settings** → **Security**
   - Enable **Two-Factor Authentication** (required before creating App Passwords)
   - Complete the 2FA setup (via SMS or Authenticator app)

3. **Generate App-Specific Password:**
   - Still in **Settings** → **Security**
   - Find **App Passwords** section
   - Click **Generate New Password** or **Create App Password**
   - Name it (e.g., "MySmartly App" or "Supabase SMTP")
   - Click **Generate**
   - **⚠️ COPY THE PASSWORD IMMEDIATELY** - you won't see it again!
   - This is your `ZOHO_SMTP_PASS` value

4. **Add to .env.local:**
   - Open your `.env.local` file
   - Add the Zoho SMTP settings as shown above
   - Replace `your_zoho_app_password_here` with your actual App-Specific Password

### Quick Navigation Path:
```
Zoho Mail → Settings (⚙️) → Security → App Passwords → Generate New Password
```

## Important Notes

- **Generate a new password:** Follow the steps above to generate one
- **If you need a new password:** Follow the steps above to generate one
- **The password is 16 characters:** Usually a mix of letters and numbers
- **Never share this password:** Treat it like your account password

## Where Each Setting Goes

### In Supabase Dashboard (for Authentication emails):
- Go to **Supabase Dashboard → Authentication → Settings → SMTP Settings**
- Enter the Zoho SMTP details there
- This is where password reset emails, confirmation emails, etc. are configured

### In .env.local (optional - for direct email sending):
- Only needed if you're sending emails directly from your Next.js app
- Not used by Supabase Authentication system
- Useful for transactional emails, notifications, etc.

## Full Example .env.local File

```env
# ============================================
# Supabase Configuration (REQUIRED)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_ADMIN_PASSWORD=admin123

# ============================================
# Zoho SMTP Configuration (OPTIONAL)
# Only needed if sending emails directly from Next.js app
# Supabase Auth emails are configured in Supabase Dashboard
# ============================================
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465
ZOHO_SMTP_USER=hello@mysmartly.app
ZOHO_SMTP_PASS=your_zoho_app_password_here
ZOHO_FROM_EMAIL=hello@mysmartly.app
EMAIL_FROM_NAME=mySmartly
CALENDAR_EMAIL=hello@mysmartly.app
```

## Security Reminder

- Never commit `.env.local` to Git (it should be in `.gitignore`)
- Keep your App-Specific Password secure
- If compromised, generate a new App-Specific Password immediately

