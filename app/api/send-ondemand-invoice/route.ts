import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const { userId, invoiceId } = await request.json()

    if (!userId || !invoiceId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration missing' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .eq('user_id', userId)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Get user email
    const { data: userData } = await supabase.auth.admin.getUserById(userId)
    const userEmail = userData?.user?.email

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 404 }
      )
    }

    // Get subscription for renewal date
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('current_period_end, plan_name')
      .eq('user_id', userId)
      .single()

    const renewalDate = subscription?.current_period_end
      ? new Date(subscription.current_period_end).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'your next billing date'

    // Email configuration
    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com',
      port: parseInt(process.env.ZOHO_SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.ZOHO_SMTP_USER,
        pass: process.env.ZOHO_SMTP_PASS,
      },
    })

    const invoiceUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mysmartly.app'}/dashboard?section=billing`

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'mySmartly'} <${process.env.ZOHO_FROM_EMAIL || process.env.ZOHO_SMTP_USER}>`,
      to: userEmail,
      subject: `Payment Required: On-Demand Usage Invoice - ${invoice.invoice_number}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0F4C5C 0%, #10B981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 40px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .invoice-box { background: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .invoice-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .invoice-row:last-child { border-bottom: none; font-weight: bold; font-size: 1.1em; }
            .button { display: inline-block; background: #10B981; color: white; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; margin: 20px 0; text-align: center; }
            .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px 16px; margin: 20px 0; border-radius: 4px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6B7280; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>mySmartly</h1>
            </div>
            <div class="content">
              <h2>Payment Required: On-Demand Usage Invoice</h2>
              <p>Hello,</p>
              <p>You have on-demand usage charges that need to be paid before your subscription renews on <strong>${renewalDate}</strong>.</p>
              
              <div class="invoice-box">
                <div class="invoice-row">
                  <span>Invoice Number:</span>
                  <span>${invoice.invoice_number}</span>
                </div>
                <div class="invoice-row">
                  <span>Amount Due:</span>
                  <span>$${invoice.amount.toFixed(2)}</span>
                </div>
                <div class="invoice-row">
                  <span>Due Date:</span>
                  <span>${renewalDate}</span>
                </div>
                <div class="invoice-row">
                  <span>Total:</span>
                  <span>$${invoice.amount.toFixed(2)}</span>
                </div>
              </div>

              <div class="warning">
                <strong>⚠️ Important:</strong> Please pay this invoice within 5 days to avoid service interruption. Your subscription will not renew until this invoice is paid.
              </div>

              <div style="text-align: center;">
                <a href="${invoiceUrl}" class="button">Pay Invoice Now</a>
              </div>

              <p>If you have any questions, please contact us at <a href="mailto:hello@mysmartly.app">hello@mysmartly.app</a>.</p>
            </div>
            <div class="footer">
              <p>© 2026 mySmartly. All rights reserved.</p>
              <p>This email was sent regarding your on-demand usage charges.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    await transporter.sendMail(mailOptions)

    // Log email in email_logs
    await supabase
      .from('email_logs')
      .insert({
        recipient_email: userEmail,
        subject: mailOptions.subject,
        email_type: 'ondemand_invoice',
        status: 'sent',
        metadata: {
          invoice_id: invoiceId,
          invoice_number: invoice.invoice_number,
        },
      })

    return NextResponse.json({ success: true, message: 'Invoice email sent successfully' })
  } catch (error: any) {
    console.error('Error sending on-demand invoice email:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send invoice email' },
      { status: 500 }
    )
  }
}

