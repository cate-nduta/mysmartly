import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { supabase } from '@/lib/supabase'

// Email template for interview invitations
function getInterviewInvitationTemplate(applicantName: string, jobTitle: string, companyName: string = 'mySmartly'): { subject: string; html: string; text: string } {
  const subject = `Interview Invitation - ${jobTitle} Position at ${companyName}`
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interview Invitation</title>
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
  </style>
</head>
<body>
  <div class="header">
    <h1>${companyName}</h1>
  </div>
  <div class="content">
    <h2>Interview Invitation</h2>
    <p>Dear ${applicantName},</p>
    <p>Thank you for your interest in the <strong>${jobTitle}</strong> position at ${companyName}. We have reviewed your application and are impressed with your background and experience.</p>
    <p>We would like to invite you for an interview to discuss this opportunity further and learn more about how you can contribute to our team.</p>
    <p>Our team will contact you shortly to schedule a convenient time for the interview. If you have any questions or preferred times, please feel free to reply to this email.</p>
    <p>We look forward to speaking with you soon!</p>
    <p>Best regards,<br>The ${companyName} Team</p>
  </div>
  <div class="footer">
    <p>© 2026 ${companyName}. All rights reserved.</p>
    <p>This email was sent to inform you about your application status.</p>
  </div>
</body>
</html>
  `
  
  const text = `
Interview Invitation

Dear ${applicantName},

Thank you for your interest in the ${jobTitle} position at ${companyName}. We have reviewed your application and are impressed with your background and experience.

We would like to invite you for an interview to discuss this opportunity further and learn more about how you can contribute to our team.

Our team will contact you shortly to schedule a convenient time for the interview. If you have any questions or preferred times, please feel free to reply to this email.

We look forward to speaking with you soon!

Best regards,
The ${companyName} Team

© 2026 ${companyName}. All rights reserved.
  `
  
  return { subject, html, text }
}

export async function POST(request: NextRequest) {
  let body: any = null
  try {
    body = await request.json()
    const { applicationId, emailType, recipientEmail, recipientName, jobTitle } = body

    if (!recipientEmail || !emailType) {
      return NextResponse.json(
        { error: 'Recipient email and email type are required' },
        { status: 400 }
      )
    }

    // Get SMTP configuration from environment variables
    const smtpHost = process.env.ZOHO_SMTP_HOST || process.env.SMTP_HOST
    const smtpPort = parseInt(process.env.ZOHO_SMTP_PORT || process.env.SMTP_PORT || '465')
    const smtpUser = process.env.ZOHO_SMTP_USER || process.env.SMTP_USER
    const smtpPass = process.env.ZOHO_SMTP_PASS || process.env.SMTP_PASS
    const fromEmail = process.env.ZOHO_FROM_EMAIL || process.env.EMAIL_FROM || smtpUser
    const fromName = process.env.EMAIL_FROM_NAME || 'mySmartly'

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.error('SMTP configuration missing. Required: SMTP_HOST, SMTP_USER, SMTP_PASS')
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact the administrator.' },
        { status: 500 }
      )
    }

    // Create email template based on type
    let emailContent: { subject: string; html: string; text: string }
    
    if (emailType === 'interview_invitation') {
      emailContent = getInterviewInvitationTemplate(
        recipientName || 'Applicant',
        jobTitle || 'Position',
        fromName
      )
    } else {
      return NextResponse.json(
        { error: 'Unsupported email type' },
        { status: 400 }
      )
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    // Send email
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: recipientEmail,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    }

    const info = await transporter.sendMail(mailOptions)

    // Log the email in database
    const { error: logError } = await supabase
      .from('email_logs')
      .insert({
        application_id: applicationId || null,
        recipient_email: recipientEmail,
        recipient_name: recipientName || null,
        email_type: emailType,
        subject: emailContent.subject,
        body: emailContent.html,
        status: 'sent',
        sent_at: new Date().toISOString(),
      })

    if (logError) {
      console.error('Error logging email:', logError)
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully',
    })
  } catch (error: any) {
    console.error('Error sending email:', error)
    
    // Log the error in database if we have the application ID
    try {
      if (body.applicationId && body.recipientEmail) {
        await supabase
          .from('email_logs')
          .insert({
            application_id: body.applicationId,
            recipient_email: body.recipientEmail,
            recipient_name: body.recipientName || null,
            email_type: body.emailType || 'unknown',
            subject: 'Failed to send',
            body: '',
            status: 'failed',
            error_message: error.message || 'Unknown error',
          })
      }
    } catch (logError) {
      console.error('Error logging failed email:', logError)
    }

    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    )
  }
}

