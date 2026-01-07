import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

/**
 * Admin API route to fetch all users
 * Requires admin authentication
 */
export async function GET(req: NextRequest) {
  try {
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

    // Use service role to access all users
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Fetch all users from auth.users
    const { data: authUsers, error: authUsersError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (authUsersError) throw authUsersError

    // Fetch onboarding data for each user (including goals - both old and new fields)
    const { data: onboardingData } = await supabaseAdmin
      .from('user_onboarding')
      .select('user_id, specific_goals, improvement_goals, business_name, business_role, other_role, goals_year, business_type, business_type_other, business_stage, monthly_revenue, tools_used, improvement_goals')

    const onboardingMap = new Map(onboardingData?.map(o => [o.user_id, o]) || [])

    // Fetch subscription status
    const { data: subscriptions } = await supabaseAdmin
      .from('user_subscriptions')
      .select('user_id, status')

    const subscriptionMap = new Map(subscriptions?.map(s => [s.user_id, s.status]) || [])

    // Fetch all invoices (paid and unpaid) for each user
    const { data: allInvoices } = await supabaseAdmin
      .from('invoices')
      .select('user_id, status, amount, currency, created_at, paid_at, invoice_number')
      .order('created_at', { ascending: false })

    // Group invoices by user_id
    const invoicesByUser = new Map<string, any[]>()
    const unpaidInvoiceCountMap = new Map<string, number>()
    allInvoices?.forEach(inv => {
      if (!invoicesByUser.has(inv.user_id)) {
        invoicesByUser.set(inv.user_id, [])
      }
      invoicesByUser.get(inv.user_id)!.push(inv)
      
      if (inv.status === 'pending' || inv.status === 'overdue') {
        unpaidInvoiceCountMap.set(inv.user_id, (unpaidInvoiceCountMap.get(inv.user_id) || 0) + 1)
      }
    })

    // Combine data
    const usersWithData = (authUsers?.users || []).map(user => {
      const onboarding = onboardingMap.get(user.id)
      const invoices = invoicesByUser.get(user.id) || []
      const subscriptionStatus = subscriptionMap.get(user.id)
      
      // Check if account is active (not banned and not deleted)
      const accountActive = !(user as any).banned_until && !(user as any).deleted_at
      
      // Calculate days since signup
      const signupDate = new Date(user.created_at)
      const now = new Date()
      const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24))
      
      // Check if trial expired (14 days from signup, and no active subscription)
      const trialExpired = !subscriptionStatus && daysSinceSignup > 14
      
      return {
        id: user.id,
        email: user.email || null,
        created_at: user.created_at || '',
        user_metadata: user.user_metadata || {},
        onboarding_completed: !!onboarding,
        // Combine old and new goals for display
        goals: (() => {
          const oldGoals = onboarding?.specific_goals || []
          const newGoals = onboarding?.improvement_goals || []
          const combined = [...oldGoals, ...newGoals]
          return combined.length > 0 ? combined : null
        })(),
        business_name: onboarding?.business_name || null,
        business_role: onboarding?.business_role || null,
        other_role: onboarding?.other_role || null,
        goals_year: onboarding?.goals_year || null,
        // New fields
        business_type: onboarding?.business_type || null,
        business_type_other: onboarding?.business_type_other || null,
        business_stage: onboarding?.business_stage || null,
        monthly_revenue: onboarding?.monthly_revenue || null,
        tools_used: onboarding?.tools_used || null,
        subscription_status: subscriptionStatus || null,
        account_active: accountActive,
        unpaid_invoices_count: unpaidInvoiceCountMap.get(user.id) || 0,
        paid_invoices_count: invoices.filter(inv => inv.status === 'paid').length,
        invoices: invoices, // All invoices (paid and unpaid)
        trial_expired: trialExpired,
        days_since_signup: daysSinceSignup,
      }
    })

    return NextResponse.json({ users: usersWithData })
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

/**
 * Admin API route to delete a user account
 */
export async function DELETE(req: NextRequest) {
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

    // Use service role to delete user
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Preserve unpaid invoices before deleting user
    const { error: invoiceError } = await supabaseAdmin
      .from('invoices')
      .update({ 
        user_id: null, // Set to null to preserve invoice
        user_email: userEmail // Keep email for reattaching when user signs up again
      })
      .eq('user_id', userId)
      .in('status', ['pending', 'overdue']) // Only preserve unpaid invoices

    if (invoiceError) {
      console.error('Error updating invoices:', invoiceError)
      // Continue anyway - try to preserve what we can
    }

    // Delete the user from auth (cascades to most tables)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({ success: true, message: 'Account deleted successfully. Invoices have been preserved.' })
  } catch (error: any) {
    console.error('Error deleting account:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete account' },
      { status: 500 }
    )
  }
}

