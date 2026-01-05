import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
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

    // Get user subscription
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('*, pricing_plans(*)')
      .eq('user_id', userId)
      .single()

    if (!subscription) {
      return NextResponse.json({
        canProceed: false,
        reason: 'no_subscription',
        message: 'No active subscription found',
      })
    }

    // Get plan limits
    const plan = subscription.pricing_plans
    if (!plan) {
      return NextResponse.json({
        canProceed: false,
        reason: 'no_plan',
        message: 'Plan details not found',
      })
    }

    // Parse limits from features
    let decisionsLimit: number | null = null
    let connectionsLimit: number | null = null

    plan.features.forEach((feature: string) => {
      if (feature.toLowerCase().includes('decision') || feature.toLowerCase().includes('recommendation')) {
        if (feature.toLowerCase().includes('unlimited')) {
          decisionsLimit = null
        } else {
          const match = feature.match(/([\d,]+)\s*(?:decision|recommendation)/i)
          if (match) {
            decisionsLimit = parseInt(match[1].replace(/,/g, ''), 10)
          }
        }
      }
      if (feature.toLowerCase().includes('connection')) {
        if (feature.toLowerCase().includes('unlimited')) {
          connectionsLimit = null
        } else {
          const match = feature.match(/(\d+)\s*data?\s*connection/i)
          if (match) {
            connectionsLimit = parseInt(match[1], 10)
          }
        }
      }
    })

    // Get current usage for this month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const { count: decisionsCount } = await supabase
      .from('recommendations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString())

    const { count: connectionsCount } = await supabase
      .from('data_connections')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Check if limits exceeded
    const decisionsExceeded = decisionsLimit !== null && (decisionsCount || 0) >= decisionsLimit
    const connectionsExceeded = connectionsLimit !== null && (connectionsCount || 0) >= connectionsLimit

    if (decisionsExceeded || connectionsExceeded) {
      // Check if user has on-demand budget
      const { data: spendingLimit } = await supabase
        .from('spending_limits')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single()

      const hasOnDemandBudget = spendingLimit && spendingLimit.on_demand_budget > 0
      const remainingBudget = spendingLimit 
        ? spendingLimit.on_demand_budget - (spendingLimit.current_spending || 0)
        : 0

      return NextResponse.json({
        canProceed: hasOnDemandBudget && remainingBudget > 0,
        reason: 'limit_exceeded',
        exceeded: {
          decisions: decisionsExceeded,
          connections: connectionsExceeded,
        },
        usage: {
          decisions: decisionsCount || 0,
          decisionsLimit,
          connections: connectionsCount || 0,
          connectionsLimit,
        },
        onDemand: {
          available: hasOnDemandBudget,
          remainingBudget,
        },
        message: hasOnDemandBudget && remainingBudget > 0
          ? 'Using on-demand budget'
          : 'Plan limit exceeded. Please upgrade or set an on-demand budget.',
      })
    }

    return NextResponse.json({
      canProceed: true,
      usage: {
        decisions: decisionsCount || 0,
        decisionsLimit,
        connections: connectionsCount || 0,
        connectionsLimit,
      },
    })
  } catch (error: any) {
    console.error('Error checking usage limits:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to check usage limits' },
      { status: 500 }
    )
  }
}

