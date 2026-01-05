import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { userId, amount, description } = await request.json()

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Missing or invalid parameters' },
        { status: 400 }
      )
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!paystackSecretKey || !supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration missing' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user's email and payment method
    const { data: userData } = await supabase.auth.admin.getUserById(userId)
    if (!userData?.user?.email) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user's subscription to find payment method
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('paystack_customer_code, paystack_subscription_code')
      .eq('user_id', userId)
      .single()

    if (!subscription?.paystack_customer_code) {
      return NextResponse.json(
        { error: 'No payment method on file. Please update your payment method.' },
        { status: 400 }
      )
    }

    // Charge via Paystack
    const chargeResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.user.email,
        amount: Math.round(amount * 100), // Convert to kobo/cents
        currency: 'USD',
        reference: `ondemand_${Date.now()}_${userId}`,
        metadata: {
          userId,
          type: 'on-demand',
          description: description || 'On-demand usage charge',
        },
      }),
    })

    const chargeData = await chargeResponse.json()

    if (!chargeData.status) {
      return NextResponse.json(
        { error: chargeData.message || 'Failed to initialize charge' },
        { status: 400 }
      )
    }

    // Create pending invoice
    const invoiceNumber = `INV-OND-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`
    
    await supabase
      .from('invoices')
      .insert({
        user_id: userId,
        paystack_reference: chargeData.data.reference,
        invoice_number: invoiceNumber,
        amount: amount,
        currency: 'USD',
        status: 'pending',
        invoice_type: 'on-demand',
        description: description || 'On-demand usage charge',
        metadata: chargeData.data,
      })

    return NextResponse.json({
      success: true,
      authorizationUrl: chargeData.data.authorization_url,
      reference: chargeData.data.reference,
    })
  } catch (error: any) {
    console.error('On-demand charge error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process charge' },
      { status: 500 }
    )
  }
}

