# Supabase Password Reset Email Template Setup

This guide will help you configure the password reset email template in Supabase.

## Steps to Configure Password Reset Email Template

1. **Navigate to Email Templates in Supabase Dashboard:**
   - Go to your Supabase project dashboard
   - Click on **Authentication** in the left sidebar
   - Click on **Email Templates**
   - Select **Reset Password** from the template list

2. **Update the Email Template:**

Use the following HTML template for the password reset email:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your MySmartly Password</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 30px 0;
            background-color: #10B981;
            color: white;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            background-color: #ffffff;
            padding: 40px;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .button {
            display: inline-block;
            background-color: #10B981;
            color: white;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            text-align: center;
            border: none;
            cursor: pointer;
        }
        .button:hover {
            background-color: #0DA271;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6B7280;
            text-align: center;
        }
        .warning {
            background-color: #FEF3C7;
            border-left: 4px solid #F59E0B;
            padding: 12px 16px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .security-note {
            font-size: 14px;
            color: #6B7280;
            margin-top: 30px;
        }
        .code {
            background-color: #F9FAFB;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            word-break: break-all;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>MySmartly</h1>
    </div>
    
    <div class="content">
        <h2>Reset Your Password</h2>
        
        <p>Hello,</p>
        
        <p>We received a request to reset your password for your MySmartly account. If you didn't make this request, you can safely ignore this email.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ .ConfirmationURL }}" class="button">
                Reset My Password
            </a>
        </div>
        
        <p style="text-align: center; margin: 20px 0;">
            <small>Or copy and paste this link into your browser:</small><br>
            <span class="code">{{ .ConfirmationURL }}</span>
        </p>
        
        <div class="warning">
            <strong>⚠️ This link expires in 24 hours</strong><br>
            For security reasons, this password reset link will stop working after 24 hours.
        </div>
        
        <div class="security-note">
            <strong>Security Tip:</strong> Never share your password or this link with anyone. MySmartly will never ask for your password via email.
        </div>
    </div>
    
    <div class="footer">
        <p>© 2026 MySmartly. All rights reserved.</p>
        <p>This email was sent to {{ .Email }} because you requested a password reset.</p>
        <p>
            <a href="https://mysmartly.app" style="color: #10B981;">Visit MySmartly</a> • 
            <a href="https://mysmartly.app/support" style="color: #10B981;">Get Help</a> • 
            <a href="https://mysmartly.app/security" style="color: #10B981;">Security</a>
        </p>
    </div>
</body>
</html>
```

**Important Notes:**
- **DO NOT replace `{{ .ConfirmationURL }}`** - This is a Supabase template variable that gets automatically replaced with the actual reset link when the email is sent
- **DO NOT replace `{{ .Email }}`** - This is also a template variable that shows the user's email address
- Just copy and paste the entire HTML template into Supabase's email template editor
- Supabase will automatically replace these variables when sending the email

3. **Alternative Simple Text Template:**

If you prefer a simpler text-only version:

```
Reset Your Password

Hi there,

We received a request to reset your password for your mySmartly account. Click the link below to reset your password:

{{ .ConfirmationURL }}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

Best regards,
The mySmartly Team

---
This is an automated message. Please do not reply to this email.
```

## Template Variables

Supabase provides the following variables you can use in email templates:

- `{{ .ConfirmationURL }}` - The password reset link URL
- `{{ .Email }}` - The user's email address
- `{{ .Token }}` - The reset token (rarely needed)
- `{{ .TokenHash }}` - The hashed token (rarely needed)
- `{{ .SiteURL }}` - Your site URL (configured in Authentication settings)
- `{{ .RedirectTo }}` - The redirect URL after password reset

## Redirect URL Configuration

1. **Set Redirect URL in Supabase:**
   - Go to **Authentication** → **URL Configuration**
   - Add your redirect URLs:
     - Development: `http://localhost:3000/auth/reset-password`
     - Production: `https://mysmartly.app/auth/reset-password`

2. **Site URL Configuration:**
   - In **Authentication** → **URL Configuration**
   - Set **Site URL**:
     - Development: `http://localhost:3000`
     - Production: `https://mysmartly.app`

## Email Provider Settings

If you're using a custom SMTP provider (recommended for production):

1. Go to **Authentication** → **Email Templates**
2. Click on **SMTP Settings**
3. Configure your SMTP provider:
   - **Host:** Your SMTP server (e.g., `smtp.sendgrid.net`)
   - **Port:** Usually 587 for TLS
   - **Username:** Your SMTP username
   - **Password:** Your SMTP password
   - **Sender email:** The email address that will send the reset emails
   - **Sender name:** Display name (e.g., "mySmartly")

## Testing

To test the password reset flow:

1. Go to `/auth/forgot-password`
2. Enter a valid email address
3. Check the email inbox for the reset link
4. Click the link (should redirect to `/auth/reset-password`)
5. Enter a new password
6. Verify you can log in with the new password

## Security Notes

- Password reset links expire after 1 hour (default Supabase setting)
- Reset links can only be used once
- Users must click the link from the email to reset their password
- The reset token is cryptographically secure

## Troubleshooting

**Email not received:**
- Check spam/junk folder
- Verify email address is correct
- Check SMTP settings if using custom provider
- Verify email templates are saved correctly

**Reset link not working:**
- Verify redirect URL is configured correctly
- Check that the link hasn't expired (1 hour limit)
- Ensure the link hasn't already been used
- Check browser console for errors

**Redirect not working:**
- Verify Site URL is set correctly in Supabase
- Check that redirect URL is in the allowed list
- Ensure the route `/auth/reset-password` exists

## Additional Resources

- [Supabase Email Templates Documentation](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Supabase SMTP Configuration](https://supabase.com/docs/guides/auth/auth-smtp)
- [Supabase Password Reset Guide](https://supabase.com/docs/guides/auth/auth-reset-password)

