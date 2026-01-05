# Zoho Email SMTP Setup for Supabase

This guide will help you configure Zoho email SMTP settings in Supabase to send authentication emails (password reset, email confirmation, etc.).

## What You Need from Zoho

To set up Zoho email with Supabase, you'll need:

1. **Your Zoho Email Address** (e.g., `hello@mysmartly.app` for business email)
2. **Zoho App-Specific Password** (NOT your regular Zoho password)

**Note:** If you're using a custom domain email like `hello@mysmartly.app`, the setup is the same as Zoho Mail - just use your custom domain email address instead of @zoho.com.

## Step 1: Get Your Zoho App-Specific Password

**Important:** You CANNOT use your regular Zoho password for SMTP. You must create an App-Specific Password.

1. **Log in to Zoho Mail:**
   - Go to [https://mail.zoho.com](https://mail.zoho.com)
   - Sign in with your Zoho account

2. **Enable Two-Factor Authentication (2FA):**
   - Go to **Settings** → **Security**
   - Enable **Two-Factor Authentication** (if not already enabled)
   - This is required to generate App-Specific Passwords

3. **Generate App-Specific Password:**
   - Go to **Settings** → **Security** → **App Passwords**
   - Click **Generate New Password**
   - Name it (e.g., "Supabase SMTP")
   - Click **Generate**
   - **COPY THE PASSWORD IMMEDIATELY** (you won't be able to see it again!)
   - Save it securely (this is your SMTP password)

## Step 2: Zoho SMTP Configuration Details

Use these SMTP settings for Zoho:

- **SMTP Host:** `smtp.zoho.com` (for Zoho Mail)
  - OR `smtp.zoho.eu` (for Zoho Europe)
  - OR `smtp.zoho.in` (for Zoho India)
- **SMTP Port:** `587` (TLS) or `465` (SSL)
- **Encryption:** TLS (recommended) or SSL
- **SMTP Username:** Your full Zoho email address (e.g., `yourname@zoho.com`)
- **SMTP Password:** The App-Specific Password you generated in Step 1

## Step 3: Configure SMTP in Supabase

1. **Go to Supabase Dashboard:**
   - Navigate to your Supabase project
   - Go to **Authentication** → **Settings** → **SMTP Settings**

2. **Enable Custom SMTP:**
   - Toggle **Enable Custom SMTP** to ON

3. **Enter SMTP Details:**
   ```
   SMTP Host: smtp.zoho.com
   SMTP Port: 587
   SMTP Username: hello@mysmartly.app (your Zoho email address)
   SMTP Password: [your app-specific password from Step 1]
   Sender Email: hello@mysmartly.app (usually same as username)
   Sender Name: MySmartly (or your preferred sender name)
   ```
   
   **For your business email `hello@mysmartly.app`:**
   - Use `hello@mysmartly.app` as both the SMTP Username and Sender Email
   - The SMTP Host remains `smtp.zoho.com` (even for custom domain emails)

4. **Choose Encryption:**
   - Select **TLS** (recommended) for port 587
   - OR **SSL** for port 465

5. **Test Connection:**
   - Click **Send Test Email** to verify the configuration
   - Check your email inbox to confirm the test email was received

6. **Save Settings:**
   - Click **Save** to apply the changes

## Step 4: Verify Email Templates

After configuring SMTP, verify your email templates:

1. Go to **Authentication** → **Email Templates**
2. Check that templates are configured (especially "Reset Password")
3. Test by requesting a password reset from `/auth/forgot-password`

## Zoho SMTP Settings Summary

| Setting | Value |
|---------|-------|
| **SMTP Host** | `smtp.zoho.com` |
| **SMTP Port** | `587` (TLS) or `465` (SSL) |
| **Encryption** | TLS or SSL |
| **SMTP Username** | `hello@mysmartly.app` (your business email) |
| **SMTP Password** | App-Specific Password (NOT your regular password) |
| **Sender Email** | `hello@mysmartly.app` (same as username) |
| **Sender Name** | MySmartly (or your choice) |

## Important Notes

⚠️ **Critical:**
- You **MUST** use an **App-Specific Password**, NOT your regular Zoho password
- App-Specific Passwords can only be created if 2FA is enabled
- Keep your App-Specific Password secure (treat it like a regular password)
- If you lose your App-Specific Password, generate a new one

📧 **Email Limits:**
- Zoho free accounts: Usually 250-500 emails per day
- Zoho paid accounts: Higher limits (check your plan)
- Supabase has its own email limits too

🔒 **Security:**
- Never share your App-Specific Password
- Store it securely (consider using a password manager)
- Regenerate it if you suspect it's compromised

## Troubleshooting

**"Authentication failed" error:**
- Verify you're using the App-Specific Password, not your regular password
- Check that 2FA is enabled on your Zoho account
- Ensure the username is your full email address

**"Connection timeout" error:**
- Verify SMTP host: `smtp.zoho.com`
- Check port: `587` for TLS or `465` for SSL
- Ensure your firewall allows SMTP connections

**"Sender email not verified" error:**
- The sender email must match your Zoho email address
- Ensure you're using the same email in both "SMTP Username" and "Sender Email"

**Emails not sending:**
- Check your Zoho email daily sending limit
- Verify SMTP settings are saved correctly in Supabase
- Test with a simple email template first
- Check Supabase logs for error messages

## Using Your Business Email (hello@mysmartly.app)

Since you're using a custom domain email (`hello@mysmartly.app`), the setup is the same:

- **SMTP Host:** `smtp.zoho.com` (same as regular Zoho Mail)
- **SMTP Username:** `hello@mysmartly.app` (your business email address)
- **SMTP Password:** App-Specific Password (generate from Zoho account settings)
- **Sender Email:** `hello@mysmartly.app` (same as username)

**Important:** Even though your email is `@mysmartly.app`, you still use `smtp.zoho.com` as the SMTP host if Zoho is hosting your email. The custom domain doesn't change the SMTP server address.

## Environment Variables (Optional - For Reference Only)

**Important Note:** Supabase SMTP settings are configured directly in the Supabase Dashboard, NOT through environment variables. However, if you want to store your Zoho credentials for reference or use them elsewhere in your application, you can add them to `.env.local`:

```env
# Zoho SMTP Settings (for reference/other use)
# Note: Supabase SMTP is configured in Supabase Dashboard, not via env vars
ZOHO_SMTP_HOST=smtp.zoho.com        # or smtp.zoho.eu if you're on the EU servers
ZOHO_SMTP_PORT=465                  # 465 = SSL, 587 = STARTTLS
ZOHO_SMTP_USER=hello@mysmartly.app
ZOHO_SMTP_PASS=your_app_specific_password_here  # Get from Zoho Mail → Security → App Passwords
ZOHO_FROM_EMAIL=hello@mysmartly.app
EMAIL_FROM_NAME=mySmartly
CALENDAR_EMAIL=hello@mysmartly.app
```

**Remember:** 
- Supabase Authentication emails are configured in **Supabase Dashboard → Authentication → Settings → SMTP Settings**
- These env vars are only useful if you're sending emails from your Next.js application directly (not through Supabase Auth)
- The `.env.local` file should already contain your Supabase credentials (which are required)

## Next Steps

1. Generate your Zoho App-Specific Password
2. Configure SMTP in Supabase Dashboard
3. Test the connection
4. Verify email templates are set up
5. Test password reset flow from your app

## Resources

- [Zoho Mail SMTP Settings](https://www.zoho.com/mail/help/zoho-mail-smtp-configuration.html)
- [Supabase SMTP Documentation](https://supabase.com/docs/guides/auth/auth-smtp)
- [Zoho App Passwords Guide](https://help.zoho.com/portal/en/kb/accounts/account-security/articles/manage-app-passwords)

