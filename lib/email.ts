import nodemailer from 'nodemailer'

export async function sendEmail(options: {
  to: string
  subject: string
  html: string
  text: string
}) {
  // Use exact same logic that works in test endpoint
  const smtpHost = process.env.ZOHO_SMTP_HOST || process.env.SMTP_HOST
  const smtpUser = process.env.ZOHO_SMTP_USER || process.env.SMTP_USER
  const smtpPass = process.env.ZOHO_SMTP_PASS || process.env.SMTP_PASS
  const smtpPort = process.env.ZOHO_SMTP_PORT || process.env.SMTP_PORT || '465'
  const fromEmail = process.env.ZOHO_FROM_EMAIL || process.env.EMAIL_FROM || smtpUser
  const fromName = process.env.EMAIL_FROM_NAME || 'Catherine.K'

  // Validate configuration (minimal logging for production)

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error('[EMAIL] Missing config:', {
      host: !smtpHost,
      user: !smtpUser,
      pass: !smtpPass,
    })
    throw new Error('SMTP configuration incomplete')
  }

  // Create transporter with Zoho-optimized settings
  // DO NOT trim password - Zoho needs exact password as stored
  const transporter = nodemailer.createTransport({
    host: smtpHost!,
    port: parseInt(smtpPort),
    secure: parseInt(smtpPort) === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser!,
      pass: smtpPass!, // NO TRIM - use exact password
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
    // Zoho-specific TLS settings
    requireTLS: true,
    tls: {
      // Don't reject unauthorized certificates (some SMTP servers need this)
      rejectUnauthorized: false,
    },
  } as nodemailer.TransportOptions)

  const fromAddress = `"${fromName}" <${fromEmail}>`

  const result = await transporter.sendMail({
    from: fromAddress,
    to: options.to,
    replyTo: fromEmail,
    subject: options.subject,
    html: options.html,
    text: options.text,
  })

  return result
}

