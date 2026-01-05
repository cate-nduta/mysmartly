# 📧 Email Setup Verification Guide

## ✅ Email Configuration Check

To ensure emails are being sent correctly, verify your environment variables are set:

### Required Environment Variables

```bash
# Zoho SMTP Configuration (or your SMTP provider)
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465
ZOHO_SMTP_USER=hello@mysmartly.app
ZOHO_SMTP_PASS=your_app_password_here
ZOHO_FROM_EMAIL=hello@mysmartly.app
EMAIL_FROM_NAME=mySmartly
```

### Verification Steps

1. **Check Environment Variables**
   - Ensure all SMTP variables are set in `.env.local` (local) and Netlify (production)
   - Verify the password is an **App Password**, not your regular email password

2. **Test Email Sending**
   - Go to Admin Dashboard → Email Logs
   - Send a test interview invitation
   - Check if email appears in logs with status "sent"

3. **Check Email Logs**
   - All emails are logged in the `email_logs` table
   - Status can be: `sent`, `failed`
   - Failed emails include error messages

## 🔧 Email Error Handling

The system now includes:

- ✅ **SMTP Connection Verification** - Tests connection before sending
- ✅ **Email Format Validation** - Validates recipient email addresses
- ✅ **Error Logging** - All failures are logged to `email_logs` table
- ✅ **Detailed Error Messages** - Clear error messages for troubleshooting

## 📋 Common Issues

### "Email service is not configured"
- **Cause**: Missing SMTP environment variables
- **Fix**: Set all required SMTP variables in `.env.local` and Netlify

### "SMTP connection failed"
- **Cause**: Wrong SMTP host/port or invalid credentials
- **Fix**: Verify SMTP settings match your email provider

### "Failed to send email"
- **Cause**: Network issue, invalid recipient, or provider limits
- **Fix**: Check email logs for specific error message

## 🧪 Testing Email Functionality

1. **Send Test Interview Invitation**
   - Admin Dashboard → Applications
   - Select an application
   - Click "Send Interview Invitation"
   - Check Email Logs for status

2. **Check Email Logs**
   - Admin Dashboard → Email Logs
   - View all sent/failed emails
   - Check error messages for failed emails

## 📊 Email Logs Table

All emails are tracked in `email_logs` with:
- Recipient email and name
- Email type (interview_invitation, ondemand_invoice, etc.)
- Subject and body
- Status (sent/failed)
- Error message (if failed)
- Timestamp

## ✅ Success Indicators

- ✅ Email appears in `email_logs` with status "sent"
- ✅ Recipient receives email in inbox (check spam folder)
- ✅ No errors in console or email logs
- ✅ SMTP connection verification passes

