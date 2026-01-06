// Test script to debug email sending
// Run with: node test-email.js

require('dotenv').config({ path: '.env.local' })

const nodemailer = require('nodemailer')

async function testEmail() {
  const smtpHost = process.env.ZOHO_SMTP_HOST || process.env.SMTP_HOST
  const smtpUser = process.env.ZOHO_SMTP_USER || process.env.SMTP_USER
  const smtpPass = process.env.ZOHO_SMTP_PASS || process.env.SMTP_PASS
  const smtpPort = process.env.ZOHO_SMTP_PORT || process.env.SMTP_PORT || '465'
  const fromEmail = process.env.ZOHO_FROM_EMAIL || process.env.EMAIL_FROM || smtpUser
  const testEmail = process.env.ADMIN_EMAIL || 'hello@mysmartly.app'

  console.log('=== Email Configuration Test ===')
  console.log('SMTP Host:', smtpHost || 'MISSING')
  console.log('SMTP Port:', smtpPort)
  console.log('SMTP User:', smtpUser || 'MISSING')
  console.log('SMTP Pass:', smtpPass ? '***' + smtpPass.slice(-4) : 'MISSING')
  console.log('From Email:', fromEmail || 'MISSING')
  console.log('Test To Email:', testEmail)
  console.log('')

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error('❌ ERROR: Missing SMTP configuration!')
    console.error('Please check your .env.local file')
    process.exit(1)
  }

  console.log('Creating transporter...')
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort),
    secure: parseInt(smtpPort) === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })

  console.log('Verifying SMTP connection...')
  try {
    await transporter.verify()
    console.log('✅ SMTP connection verified successfully!')
  } catch (error) {
    console.error('❌ SMTP verification failed!')
    console.error('Error:', error.message)
    console.error('Code:', error.code)
    console.error('Command:', error.command)
    console.error('Response:', error.response)
    process.exit(1)
  }

  console.log('')
  console.log('Sending test email...')
  try {
    const result = await transporter.sendMail({
      from: `"Cate" <${fromEmail}>`,
      to: testEmail,
      replyTo: fromEmail,
      subject: 'Test Email from mySmartly',
      html: `
        <p>This is a test email from mySmartly.</p>
        <p>If you received this, your email configuration is working correctly!</p>
      `,
      text: 'This is a test email from mySmartly. If you received this, your email configuration is working correctly!',
    })
    
    console.log('✅ Test email sent successfully!')
    console.log('Message ID:', result.messageId)
    console.log('Response:', result.response)
    console.log('')
    console.log('Please check your inbox (and spam folder) for:', testEmail)
  } catch (error) {
    console.error('❌ Failed to send test email!')
    console.error('Error:', error.message)
    console.error('Code:', error.code)
    console.error('Command:', error.command)
    console.error('Response:', error.response)
    console.error('Response Code:', error.responseCode)
    process.exit(1)
  }
}

testEmail().catch(console.error)

