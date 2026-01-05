import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This should be run as a cron job daily to check for invoices that need to be sent
export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration missing' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get all active subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*, pricing_plans(*)')
      .eq('status', 'active')

    if (subError) throw subError

    const invoicesToSend: any[] = []

    for (const subscription of subscriptions || []) {
      // Check if renewal is in 5 days
      const renewalDate = new Date(subscription.current_period_end)
      const today = new Date()
      const daysUntilRenewal = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (daysUntilRenewal === 5) {
        // Check if user has on-demand spending
        const { data: spendingLimit } = await supabase
          .from('spending_limits')
          .select('*')
          .eq('user_id', subscription.user_id)
          .eq('is_active', true)
          .single()

        if (spendingLimit && spendingLimit.current_spending > 0) {
          // Check if invoice already exists
          const { data: existingInvoice } = await supabase
            .from('invoices')
            .select('*')
            .eq('user_id', subscription.user_id)
            .eq('invoice_type', 'on-demand')
            .eq('status', 'pending')
            .gte('due_date', today.toISOString().split('T')[0])
            .single()

          if (!existingInvoice) {
            // Create invoice for on-demand charges
            const invoiceNumber = `INV-OND-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`
            
            const { data: newInvoice, error: invoiceError } = await supabase
              .from('invoices')
              .insert({
                user_id: subscription.user_id,
                subscription_id: subscription.id,
                invoice_number: invoiceNumber,
                amount: spendingLimit.current_spending,
                currency: 'USD',
                status: 'pending',
                invoice_type: 'on-demand',
                description: `On-demand usage charges for ${subscription.plan_name} plan`,
                due_date: renewalDate.toISOString().split('T')[0],
                metadata: {
                  spending_limit_id: spendingLimit.id,
                  auto_generated: true,
                },
              })
              .select()
              .single()

            if (!invoiceError && newInvoice) {
              invoicesToSend.push(newInvoice)
            }
          } else {
            // Update existing invoice amount if spending has changed
            if (existingInvoice.amount !== spendingLimit.current_spending) {
              await supabase
                .from('invoices')
                .update({
                  amount: spendingLimit.current_spending,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', existingInvoice.id)

              invoicesToSend.push({ ...existingInvoice, amount: spendingLimit.current_spending })
            }
          }
        }
      }
    }

    // Send emails for all invoices
    const results = []
    for (const invoice of invoicesToSend) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://mysmartly.app'}/api/send-ondemand-invoice`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: invoice.user_id,
            invoiceId: invoice.id,
          }),
        })

        const result = await response.json()
        results.push({ invoiceId: invoice.id, success: result.success })
      } catch (error) {
        console.error(`Error sending invoice ${invoice.id}:`, error)
        results.push({ invoiceId: invoice.id, success: false, error: error })
      }
    }

    return NextResponse.json({
      success: true,
      invoicesProcessed: invoicesToSend.length,
      results,
    })
  } catch (error: any) {
    console.error('Error checking on-demand invoices:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check invoices' },
      { status: 500 }
    )
  }
}

