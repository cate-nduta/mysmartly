import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/email'

async function sendWaitlistWelcomeEmail(toEmail: string) {
  try {
    console.log('[WAITLIST EMAIL] Attempting to send welcome email to:', toEmail)

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thanks for joining the mySmartly waitlist</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.7;
      color: #1F2933;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #F9FAFB;
    }
    .email-container {
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .content {
      padding: 40px;
    }
    p {
      margin-bottom: 1.5rem;
      color: #1F2933;
    }
    ul {
      margin-bottom: 1.5rem;
      padding-left: 1.5rem;
      color: #1F2933;
    }
    li {
      margin-bottom: 0.75rem;
    }
    .signature {
      margin-top: 2rem;
    }
    .footer {
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid #E5E7EB;
      font-size: 14px;
      color: #6B7280;
      text-align: center;
    }
    a {
      color: #10B981;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="content">
      <p>Hi there,</p>
      
      <p>Thank you for joining the mySmartly waitlist. I truly appreciate you taking the time to check it out and support what's being built.</p>
      
      <p>mySmartly exists to help entrepreneurs turn their data into clear, actionable steps they can actually take and start seeing things move. Less guessing. More direction. Real momentum.</p>
      
      <p>Right now, I'm shaping the product around real users and real challenges. As part of the waitlist, you'll be part of a small early group that gets:</p>
      
      <ul>
        <li>priority access when mySmartly opens</li>
        <li>the ability to directly influence what gets built first</li>
        <li>early visibility into how the product is evolving</li>
      </ul>
      
      <p>Your interest helps turn this from an idea into something tangible, and that matters more than you know.</p>
      
      <p>Thank you for believing in mySmartly.</p>
      
      <div class="signature">
        <p>Sincerely yours,<br>
        <strong>Catherine.K</strong><br>
        Founder, mySmartly</p>
      </div>
      
      <div class="footer">
        <p><a href="https://mysmartly.app">https://mysmartly.app</a></p>
      </div>
    </div>
  </div>
</body>
</html>
    `

    const text = `Hi there,

Thank you for joining the mySmartly waitlist. I truly appreciate you taking the time to check it out and support what's being built.

mySmartly exists to help entrepreneurs turn their data into clear, actionable steps they can actually take and start seeing things move. Less guessing. More direction. Real momentum.

Right now, I'm shaping the product around real users and real challenges. As part of the waitlist, you'll be part of a small early group that gets:

* priority access when mySmartly opens
* the ability to directly influence what gets built first
* early visibility into how the product is evolving

Your interest helps turn this from an idea into something tangible, and that matters more than you know.

Thank you for believing in mySmartly.

Sincerely yours,
Catherine.K
Founder, mySmartly

https://mysmartly.app
    `

    // Use shared email function (same one test endpoint uses)
    const result = await sendEmail({
      to: toEmail,
      subject: 'Thanks for joining the mySmartly waitlist',
      html,
      text,
    })

    console.log('[WAITLIST EMAIL] ✅ Successfully sent welcome email to:', toEmail)
    
    // Also log success to email_logs table if it exists (optional)
    try {
      const { supabase } = await import('@/lib/supabase')
      await supabase.from('email_logs').insert([{
        to_email: toEmail,
        email_type: 'waitlist_welcome',
        status: 'sent',
        recipient_email: toEmail,
        subject: 'Thanks for joining the mySmartly waitlist',
        sent_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }])
      console.log('[WAITLIST EMAIL] Logged success to email_logs table')
    } catch (logError) {
      // Ignore logging errors - table might not exist, that's OK
      console.log('[WAITLIST EMAIL] Note: Could not log to email_logs table (optional, not critical)')
    }
  } catch (error: any) {
    // Log error with full details
    console.error('[WAITLIST EMAIL] ========== EMAIL SEND ERROR ==========')
    console.error('[WAITLIST EMAIL] Error sending welcome email to:', toEmail)
    console.error('[WAITLIST EMAIL] Error message:', error.message)
    console.error('[WAITLIST EMAIL] Error code:', error.code)
    console.error('[WAITLIST EMAIL] Error command:', error.command)
    console.error('[WAITLIST EMAIL] Error response:', error.response)
    console.error('[WAITLIST EMAIL] Error responseCode:', error.responseCode)
    console.error('[WAITLIST EMAIL] Error stack:', error.stack)
    console.error('[WAITLIST EMAIL] Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
    console.error('[WAITLIST EMAIL] =======================================')
    
    // Also log to email_logs table if it exists (don't fail if it doesn't)
    try {
      await supabase.from('email_logs').insert([{
        to_email: toEmail,
        email_type: 'waitlist_welcome',
        status: 'failed',
        error_message: error.message || 'Unknown error',
        error_details: JSON.stringify({
          code: error.code,
          command: error.command,
          response: error.response,
          responseCode: error.responseCode,
        }),
        created_at: new Date().toISOString(),
      }])
    } catch (logError) {
      // Ignore logging errors
      console.error('[WAITLIST EMAIL] Failed to log error to email_logs table:', logError)
    }
    
    throw error // Re-throw so it can be caught by the calling code
  }
}

export async function POST(request: Request) {
  try {
    const { email, features, integration_wish, custom_feature } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    const insertData: any = {
      email,
      created_at: new Date().toISOString()
    }

    // Add optional fields if provided
    if (features && Array.isArray(features) && features.length > 0) {
      insertData.features = features
    }
    if (integration_wish && integration_wish.trim()) {
      insertData.integration_wish = integration_wish.trim()
    }
    if (custom_feature && custom_feature.trim()) {
      insertData.custom_feature = custom_feature.trim()
    }

    const { error } = await supabase
      .from('waitlist')
      .insert([insertData])

    if (error) {
      // If duplicate email error
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already on the waitlist' },
          { status: 409 }
        )
      }
      throw error
    }

    // Send welcome email - try to await it so we can log any errors properly
    // But don't fail the request if email fails (user should still be added to waitlist)
    try {
      await sendWaitlistWelcomeEmail(email)
      console.log('[WAITLIST] Successfully sent welcome email to:', email)
    } catch (emailError: any) {
      // Email failed but user was added to waitlist - log it but don't fail the request
      console.error('[WAITLIST] Failed to send welcome email (non-critical):', emailError?.message || emailError)
      // The detailed error is already logged in sendWaitlistWelcomeEmail function
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}

