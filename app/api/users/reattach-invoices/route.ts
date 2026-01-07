import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Reattach invoices to user when they sign up again after account deletion
 * Matches invoices by email and updates user_id
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

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Find invoices with null user_id that match this email
    const { data: invoices, error: fetchError } = await supabaseAdmin
      .from('invoices')
      .select('id, user_email, status')
      .is('user_id', null)
      .eq('user_email', userEmail)
      .in('status', ['pending', 'overdue'])

    if (fetchError) {
      throw fetchError
    }

    if (invoices && invoices.length > 0) {
      // Reattach invoices to the new user account
      const { error: updateError } = await supabaseAdmin
        .from('invoices')
        .update({ user_id: userId })
        .in('id', invoices.map(inv => inv.id))

      if (updateError) {
        throw updateError
      }

      return NextResponse.json({
        success: true,
        reattachedCount: invoices.length,
        message: `Reattached ${invoices.length} unpaid invoice(s) to your account.`
      })
    }

    return NextResponse.json({
      success: true,
      reattachedCount: 0,
      message: 'No unpaid invoices found to reattach.'
    })
  } catch (error: any) {
    console.error('Error reattaching invoices:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to reattach invoices' },
      { status: 500 }
    )
  }
}

