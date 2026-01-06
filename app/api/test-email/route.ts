import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function GET() {
  try {
    // Check if SMTP is configured
    const smtpHost = process.env.ZOHO_SMTP_HOST || process.env.SMTP_HOST
    const smtpUser = process.env.ZOHO_SMTP_USER || process.env.SMTP_USER
    const smtpPass = process.env.ZOHO_SMTP_PASS || process.env.SMTP_PASS
    const smtpPort = process.env.ZOHO_SMTP_PORT || process.env.SMTP_PORT || '465'
    const fromEmail = process.env.ZOHO_FROM_EMAIL || process.env.EMAIL_FROM || smtpUser

    const config = {
      host: smtpHost || 'NOT SET',
      port: smtpPort,
      user: smtpUser || 'NOT SET',
      pass: smtpPass ? '***SET***' : 'NOT SET',
      fromEmail: fromEmail || 'NOT SET',
    }

    // Check if all required vars are set
    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json({
        status: 'error',
        message: 'SMTP configuration incomplete',
        config,
        missing: {
          host: !smtpHost,
          user: !smtpUser,
          pass: !smtpPass,
        },
      }, { status: 500 })
    }

    // Try to create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    })

    // Try to verify connection
    try {
      await transporter.verify()
    } catch (verifyError: any) {
      return NextResponse.json({
        status: 'error',
        message: 'SMTP connection verification failed',
        config,
        error: {
          message: verifyError.message,
          code: verifyError.code,
          command: verifyError.command,
          response: verifyError.response,
          responseCode: verifyError.responseCode,
        },
      }, { status: 500 })
    }

    // Try to actually send an email
    try {
      const testEmail = process.env.ADMIN_EMAIL || fromEmail
      const fromName = process.env.EMAIL_FROM_NAME || 'Catherine.K'
      const fromAddress = `"${fromName}" <${fromEmail}>`

      const result = await transporter.sendMail({
        from: fromAddress,
        to: testEmail,
        replyTo: fromEmail,
        subject: 'Test Email from mySmartly',
        html: '<p>This is a test email. If you receive this, email sending is working!</p>',
        text: 'This is a test email. If you receive this, email sending is working!',
      })

      return NextResponse.json({
        status: 'success',
        message: 'SMTP configuration is valid, connection verified, AND test email sent successfully!',
        config: {
          host: config.host,
          port: config.port,
          user: config.user,
          fromEmail: config.fromEmail,
          pass: 'SET (hidden)',
        },
        emailSent: {
          to: testEmail,
          messageId: result.messageId,
          response: result.response,
        },
        note: 'Check your inbox (and spam folder) for the test email',
      })
    } catch (sendError: any) {
      return NextResponse.json({
        status: 'error',
        message: 'SMTP connection verified BUT email sending failed',
        config,
        error: {
          message: sendError.message,
          code: sendError.code,
          command: sendError.command,
          response: sendError.response,
          responseCode: sendError.responseCode,
          stack: sendError.stack,
        },
        note: 'Connection works but sendMail() is failing - this is the issue!',
      }, { status: 500 })
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Error testing SMTP configuration',
      error: {
        message: error.message,
        code: error.code,
        stack: error.stack,
      },
    }, { status: 500 })
  }
}

