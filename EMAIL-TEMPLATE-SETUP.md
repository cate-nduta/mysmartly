# Email Template Configuration for Supabase

This guide will help you configure email templates in Supabase for email confirmation and other auth emails.

## Step 1: Access Email Templates

1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Email Templates**
3. You'll see templates for:
   - **Confirm signup** (email confirmation)
   - **Magic Link**
   - **Change Email Address**
   - **Reset Password**
   - **Invite user**

## Step 2: Configure "Confirm signup" Template

This is the email users receive when they sign up and need to confirm their email.

1. Click on **"Confirm signup"** template
2. You'll see the email template editor with:
   - **Subject** field
   - **Body** HTML template

### Recommended Email Template

**Subject:**
```
Confirm your mySmartly account
```

**Body (HTML):**
```html
<h2>Welcome to mySmartly!</h2>
<p>Thank you for signing up. Please confirm your email address by clicking the link below:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email Address</a></p>
<p>If the link doesn't work, copy and paste this URL into your browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p>Once confirmed, you can sign in to access your dashboard and start your 14-day free trial.</p>
<p>If you didn't create an account, you can safely ignore this email.</p>
<p>Best regards,<br>The mySmartly Team</p>
```

**Plain Text Version:**
```
Welcome to mySmartly!

Thank you for signing up. Please confirm your email address by clicking the link below:

{{ .ConfirmationURL }}

Once confirmed, you can sign in to access your dashboard and start your 14-day free trial.

If you didn't create an account, you can safely ignore this email.

Best regards,
The mySmartly Team
```

### Template Variables

Supabase provides these variables you can use:

- `{{ .ConfirmationURL }}` - The confirmation link
- `{{ .Email }}` - User's email address
- `{{ .Token }}` - The confirmation token (usually used in URL)
- `{{ .TokenHash }}` - Hashed token
- `{{ .SiteURL }}` - Your site URL

## Step 3: Configure Redirect URL

The confirmation link will automatically redirect to your app. Make sure:

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your domain (e.g., `https://mysmartly.app` or `http://localhost:3000` for development)
3. Add **Redirect URLs** (one per line):
   ```
   http://localhost:3000/auth/callback
   https://mysmartly.app/auth/callback
   ```
   This tells Supabase where to redirect users after they click the confirmation link.

## Step 4: Test Email Confirmation

1. Sign up with a test email
2. Check your email inbox
3. Click the confirmation link
4. You should be redirected to your dashboard

## Step 5: Configure Other Templates (Optional)

### Magic Link Template
Used for passwordless login.

**Subject:**
```
Sign in to mySmartly
```

**Body:**
```html
<h2>Sign in to mySmartly</h2>
<p>Click the link below to sign in:</p>
<p><a href="{{ .ConfirmationURL }}">Sign In</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this, you can safely ignore this email.</p>
```

### Reset Password Template

**Subject:**
```
Reset your mySmartly password
```

**Body:**
```html
<h2>Reset Password</h2>
<p>Click the link below to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
<p>This link will expire in 1 hour.</p>
<p>If you didn't request this, you can safely ignore this email.</p>
```

## Customization Tips

1. **Add Your Logo**: Upload your logo to Supabase Storage and reference it in the email template
2. **Brand Colors**: Use your brand colors in the email design
3. **Test First**: Always test emails in development before going to production
4. **Plain Text**: Supabase will auto-generate a plain text version, but you can customize it

## Email Provider Configuration

By default, Supabase uses their email service. For production, you may want to configure a custom SMTP provider:

1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Configure your SMTP provider (SendGrid, Mailgun, AWS SES, etc.)
3. This ensures better deliverability and branding

## Important Notes

- Email templates use Go template syntax ({{ .Variable }})
- Always include the confirmation/reset link using `{{ .ConfirmationURL }}`
- Keep emails professional and clear
- Test thoroughly before production
- The confirmation link will automatically redirect to `/auth/callback` and then to `/dashboard`

## Troubleshooting

**Emails not sending?**
- Check SMTP settings if using custom provider
- Check spam folder
- Verify email address is valid

**Confirmation link not working?**
- Verify redirect URLs are configured correctly
- Check that `/auth/callback` route exists
- Ensure Site URL is set correctly

**Users not redirected to dashboard?**
- Check `/app/auth/callback/route.ts` is set up correctly
- Verify the callback route redirects to `/dashboard`


