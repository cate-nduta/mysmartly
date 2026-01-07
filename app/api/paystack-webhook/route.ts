import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!paystackSecretKey || !supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration missing' },
        { status: 500 }
      )
    }

    const body = await request.text()
    const hash = request.headers.get('x-paystack-signature')

    // Verify webhook signature
    const computedHash = crypto
      .createHmac('sha512', paystackSecretKey)
      .update(body)
      .digest('hex')

    if (hash !== computedHash) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    const event = JSON.parse(body)
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
      case 'transaction.success':
        await handleSuccessfulPayment(event.data, supabase)
        break

      case 'subscription.create':
      case 'subscription.update':
        await handleSubscriptionUpdate(event.data, supabase)
        break

      case 'invoice.create':
      case 'invoice.update':
        await handleInvoiceUpdate(event.data, supabase)
        break

      default:
        console.log('Unhandled event type:', event.event)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleSuccessfulPayment(data: any, supabase: any) {
  try {
    const reference = data.reference
    const amount = data.amount / 100 // Convert from kobo/cents to dollars
    const userId = data.metadata?.userId
    const planName = data.metadata?.plan_name || data.metadata?.custom_fields?.find((f: any) => f.variable_name === 'plan_name')?.value

    if (!userId) {
      console.error('No userId in payment metadata')
      return
    }

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`

    // Create invoice record
    const { error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        user_id: userId,
        paystack_reference: reference,
        paystack_transaction_id: data.id?.toString(),
        invoice_number: invoiceNumber,
        amount: amount,
        currency: 'USD',
        status: 'paid',
        invoice_type: planName ? 'subscription' : 'on-demand',
        description: planName ? `Subscription payment for ${planName} plan` : 'On-demand usage payment',
        paid_at: new Date().toISOString(),
        receipt_url: data.receipt_url || null,
        metadata: data,
      })

    if (invoiceError) {
      console.error('Error creating invoice:', invoiceError)
    }

    // If it's a subscription payment, update subscription
    if (planName) {
      const periodStart = new Date()
      const periodEnd = new Date()
      periodEnd.setDate(periodEnd.getDate() + 30)

      // Get plan limits for the paid plan
      const { data: planData } = await supabase
        .from('pricing_plans')
        .select('tokens_limit, decisions_limit')
        .eq('name', planName)
        .single()

      const planTokensLimit = planData?.tokens_limit || 250
      const planDecisionsLimit = planData?.decisions_limit || 150

      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (subscriptionData) {
        await supabase
          .from('user_subscriptions')
          .update({
            status: 'active',
            current_period_start: periodStart.toISOString(),
            current_period_end: periodEnd.toISOString(),
            tokens_limit: planTokensLimit, // Full plan limits for paid subscriptions
            decisions_limit: planDecisionsLimit, // Full plan limits for paid subscriptions
            updated_at: new Date().toISOString(),
          })
          .eq('id', subscriptionData.id)
      }
    }

    // If it's an on-demand payment, update spending limit
    if (!planName) {
      const { data: spendingData } = await supabase
        .from('spending_limits')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (spendingData) {
        await supabase
          .from('spending_limits')
          .update({
            current_spending: (spendingData.current_spending || 0) + amount,
            updated_at: new Date().toISOString(),
          })
          .eq('id', spendingData.id)
      }
    }
  } catch (error) {
    console.error('Error handling successful payment:', error)
  }
}

async function handleSubscriptionUpdate(data: any, supabase: any) {
  // Handle subscription updates if needed
  console.log('Subscription update:', data)
}

async function handleInvoiceUpdate(data: any, supabase: any) {
  // Handle invoice updates if needed
  console.log('Invoice update:', data)
}

