import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/lib/email'

/**
 * Admin API route to send upgrade email to users with expired trials
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, userEmail } = await req.json()

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      )
    }

    // Verify admin authentication
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (!adminData) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    // Fetch user's onboarding data for personalization
    const { data: onboardingData } = await supabase
      .from('user_onboarding')
      .select('business_name, specific_goals')
      .eq('user_id', userId)
      .single()

    const businessName = onboardingData?.business_name || 'there'
    const goals = onboardingData?.specific_goals || []

    // Create personalized email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mysmartly.app'
    const upgradeUrl = `${siteUrl}/dashboard/upgrade`

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Upgrade Your mySmartly Account</title>
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
    h1 {
      color: #10B981;
      margin-bottom: 1rem;
    }
    p {
      margin-bottom: 1.5rem;
      color: #1F2933;
    }
    .cta-button {
      display: inline-block;
      padding: 14px 28px;
      background-color: #10B981;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 1.5rem 0;
    }
    .cta-button:hover {
      background-color: #059669;
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
      <h1>Your Free Trial Has Expired</h1>
      
      <p>Hi ${businessName},</p>
      
      <p>Your 14-day free trial of mySmartly has ended. We hope you enjoyed exploring the platform and seeing how AI-powered business insights can help you make better decisions.</p>
      
      ${goals.length > 0 ? `
      <p>We noticed you were working toward: <strong>${goals.slice(0, 3).join(', ')}${goals.length > 3 ? ' and more' : ''}</strong>. With a paid plan, you'll get:</p>
      ` : `
      <p>With a paid plan, you'll get:</p>
      `}
      
      <ul>
        <li>Unlimited data connections</li>
        <li>More decisions and tokens per month</li>
        <li>Extended data history (90 days on Pro, unlimited on Enterprise)</li>
        <li>Priority support</li>
        <li>Advanced AI recommendations</li>
      </ul>
      
      <p>Ready to continue your journey with mySmartly? Choose a plan that fits your needs:</p>
      
      <div style="text-align: center;">
        <a href="${upgradeUrl}" class="cta-button">Upgrade Now</a>
      </div>
      
      <p>If you have any questions or need help choosing the right plan, just reply to this email. We're here to help!</p>
      
      <div class="footer">
        <p>Best regards,<br>
        <strong>Catherine.K</strong><br>
        Founder, mySmartly</p>
        <p><a href="https://mysmartly.app">https://mysmartly.app</a></p>
      </div>
    </div>
  </div>
</body>
</html>
    `

    const emailText = `
Your Free Trial Has Expired

Hi ${businessName},

Your 14-day free trial of mySmartly has ended. We hope you enjoyed exploring the platform and seeing how AI-powered business insights can help you make better decisions.

With a paid plan, you'll get:
- Unlimited data connections
- More decisions and tokens per month
- Extended data history (90 days on Pro, unlimited on Enterprise)
- Priority support
- Advanced AI recommendations

Ready to continue your journey with mySmartly? Choose a plan that fits your needs:

Upgrade now: ${upgradeUrl}

If you have any questions or need help choosing the right plan, just reply to this email. We're here to help!

Best regards,
Catherine.K
Founder, mySmartly

https://mysmartly.app
    `

    // Send email
    await sendEmail({
      to: userEmail,
      subject: 'Your Free Trial Has Expired - Upgrade to Continue',
      html: emailHtml,
      text: emailText,
    })

    return NextResponse.json({ success: true, message: 'Upgrade email sent successfully' })
  } catch (error: any) {
    console.error('Error sending upgrade email:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send upgrade email' },
      { status: 500 }
    )
  }
}

