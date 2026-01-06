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
      return NextResponse.json({
        status: 'success',
        message: 'SMTP configuration is valid and connection verified',
        config: {
          host: config.host,
          port: config.port,
          user: config.user,
          fromEmail: config.fromEmail,
          pass: 'SET (hidden)',
        },
      })
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

