# Email Setup Instructions for Interview Invitations

## Overview

The email system is now configured to send interview invitation emails directly to applicants using your Zoho SMTP settings. All sent emails are tracked in the `email_logs` table.

## Setup Steps

### 1. Run Database Migration

Run the SQL script `add-email-logs-table.sql` in your Supabase SQL Editor to create the `email_logs` table for tracking sent emails.

### 2. Environment Variables

Make sure you have the following environment variables in your `.env.local` file:

```env
# Zoho SMTP Settings (already configured)
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465
ZOHO_SMTP_USER=hello@mysmartly.app
ZOHO_SMTP_PASS=your_app_specific_password
ZOHO_FROM_EMAIL=hello@mysmartly.app
EMAIL_FROM_NAME=mySmartly
```

**Note:** The `ZOHO_SMTP_PASS` should be an App-Specific Password generated from your Zoho account (not your regular account password).

### 3. How to Use

1. **Send Interview Invitation:**
   - Go to Admin Dashboard → Applications
   - Find the applicant you want to invite
   - Click "Send Interview Invitation" button
   - The email will be sent directly to the applicant's email address
   - The application status will be updated to "reviewed"

2. **View Email Logs:**
   - Go to Admin Dashboard → Email Logs
   - View all sent emails with:
     - Recipient information
     - Email type (interview_invitation, etc.)
     - Status (sent/failed)
     - Timestamp
     - Error messages (if any)

### 4. Email Template

The interview invitation email template is built into the system and includes:
- Professional HTML design with your company branding
- Personalized greeting with applicant name
- Job title information
- Clear call-to-action
- Footer with company information

The template is defined in `app/api/send-email/route.ts` and can be customized as needed.

### 5. Email Tracking

Every email sent is automatically logged in the `email_logs` table with:
- `application_id`: Link to the job application
- `recipient_email`: Email address
- `recipient_name`: Applicant name
- `email_type`: Type of email (e.g., 'interview_invitation')
- `subject`: Email subject line
- `body`: Full HTML email content
- `status`: 'sent' or 'failed'
- `error_message`: Error details if sending failed
- `sent_at`: Timestamp when email was sent

### 6. Troubleshooting

**Email not sending?**
- Check that all SMTP environment variables are set correctly
- Verify that `ZOHO_SMTP_PASS` is an App-Specific Password (not your regular password)
- Check server logs for error messages
- View Email Logs in the admin dashboard to see error details

**Email sent but not received?**
- Check spam/junk folder
- Verify the recipient email address is correct
- Check Zoho Mail dashboard for delivery status

**Need to customize email templates?**
- Edit the `getInterviewInvitationTemplate` function in `app/api/send-email/route.ts`
- Templates support HTML formatting
- Both HTML and plain text versions are included

## Notes

- **No Zoho Templates Required:** The email templates are built into the application code, so you don't need to create templates in Zoho Mail. All formatting is handled by the application.

- **Email Logs:** All emails are tracked automatically. You can view the full history in the Admin Dashboard under "Email Logs".

- **Future Email Types:** The system is designed to support additional email types (like rejection emails). You can extend the `getInterviewInvitationTemplate` function or add new template functions as needed.

