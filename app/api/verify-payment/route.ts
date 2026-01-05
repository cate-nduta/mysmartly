import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { reference, userId, plan } = await request.json()

    if (!reference || !userId || !plan) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!paystackSecretKey) {
      return NextResponse.json(
        { error: 'Paystack secret key not configured' },
        { status: 500 }
      )
    }

    // Verify payment with Paystack
    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    })

    const verifyData = await verifyResponse.json()

    if (!verifyData.status || verifyData.data.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment verification failed', details: verifyData },
        { status: 400 }
      )
    }

    // Create invoice if Supabase is configured
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey)
      const amount = verifyData.data.amount / 100 // Convert from kobo/cents to dollars
      const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`

      // Get subscription ID if exists
      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select('id')
        .eq('user_id', userId)
        .single()

      // Create invoice
      await supabase
        .from('invoices')
        .insert({
          user_id: userId,
          subscription_id: subscriptionData?.id || null,
          paystack_reference: reference,
          paystack_transaction_id: verifyData.data.id?.toString(),
          invoice_number: invoiceNumber,
          amount: amount,
          currency: 'USD',
          status: 'paid',
          invoice_type: 'subscription',
          description: `Subscription payment for ${plan} plan`,
          paid_at: new Date().toISOString(),
          receipt_url: verifyData.data.receipt_url || null,
          metadata: verifyData.data,
        })
    }

    // Payment verified successfully
    return NextResponse.json({
      success: true,
      customerCode: verifyData.data.customer?.customer_code,
      subscriptionCode: verifyData.data.authorization?.authorization_code,
      amount: verifyData.data.amount,
    })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    )
  }
}


