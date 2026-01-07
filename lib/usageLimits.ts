import { supabase } from './supabase'

export interface UsageCheckResult {
  allowed: boolean
  limit: number | null
  current: number
  remaining: number | null
  message?: string
}

/**
 * Check if user has remaining tokens
 */
export async function checkTokenLimit(userId: string): Promise<UsageCheckResult> {
  try {
    // Get user's subscription
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('tokens_limit, status')
      .eq('user_id', userId)
      .single()

    if (!subscription) {
      // No subscription - check plan defaults
      const { data: plan } = await supabase
        .from('pricing_plans')
        .select('tokens_limit')
        .eq('name', 'Starter')
        .single()

      const limit = plan?.tokens_limit ? Math.floor(plan.tokens_limit / 2) : null // Trial gets half
      
      if (limit === null) {
        return { allowed: true, limit: null, current: 0, remaining: null }
      }

      // Check current usage
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('tokens_used')
        .eq('user_id', userId)
        .eq('period_start', startOfMonth.toISOString().split('T')[0])
        .maybeSingle()

      const current = usage?.tokens_used || 0
      const remaining = limit - current

      if (current >= limit) {
        return {
          allowed: false,
          limit,
          current,
          remaining: 0,
          message: `You've reached your token limit (${limit.toLocaleString()}). Upgrade to continue using the AI chatbot.`
        }
      }

      return { allowed: true, limit, current, remaining }
    }

    const isTrial = subscription.status === 'trial'
    
    // For trials, always use Starter plan limits (half of Starter)
    if (isTrial) {
      const { data: starterPlan } = await supabase
        .from('pricing_plans')
        .select('tokens_limit')
        .eq('name', 'Starter')
        .single()

      const starterLimit = starterPlan?.tokens_limit || null
      const limit = starterLimit ? Math.floor(starterLimit / 2) : null
      
      if (limit === null) {
        return { allowed: true, limit: null, current: 0, remaining: null }
      }

      // Check current usage
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('tokens_used')
        .eq('user_id', userId)
        .eq('period_start', startOfMonth.toISOString().split('T')[0])
        .maybeSingle()

      const current = usage?.tokens_used || 0
      const remaining = limit - current

      if (current >= limit) {
        return {
          allowed: false,
          limit,
          current,
          remaining: 0,
          message: `You've reached your token limit (${limit.toLocaleString()}). Upgrade to continue using the AI chatbot.`
        }
      }

      return { allowed: true, limit, current, remaining }
    }

    const limit = subscription.tokens_limit

    // If unlimited (null or very large number)
    if (limit === null || limit >= 999999999) {
      return { allowed: true, limit: null, current: 0, remaining: null }
    }

    // Check current usage
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('tokens_used')
      .eq('user_id', userId)
      .eq('period_start', startOfMonth.toISOString().split('T')[0])
      .maybeSingle()

    const current = usage?.tokens_used || 0
    const remaining = limit - current

    if (current >= limit) {
      return {
        allowed: false,
        limit,
        current,
        remaining: 0,
        message: `You've reached your token limit (${limit.toLocaleString()}). Upgrade to continue using the AI chatbot.`
      }
    }

    return { allowed: true, limit, current, remaining }
  } catch (error) {
    console.error('Error checking token limit:', error)
    // On error, allow usage (fail open)
    return { allowed: true, limit: null, current: 0, remaining: null }
  }
}

/**
 * Check if user has remaining decisions
 */
export async function checkDecisionLimit(userId: string): Promise<UsageCheckResult> {
  try {
    // Get user's subscription
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('decisions_limit, status')
      .eq('user_id', userId)
      .single()

    if (!subscription) {
      // No subscription - check plan defaults
      const { data: plan } = await supabase
        .from('pricing_plans')
        .select('decisions_limit')
        .eq('name', 'Starter')
        .single()

      const limit = plan?.decisions_limit ? Math.floor(plan.decisions_limit / 2) : null // Trial gets half
      
      if (limit === null) {
        return { allowed: true, limit: null, current: 0, remaining: null }
      }

      // Check current usage
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('decisions_count')
        .eq('user_id', userId)
        .eq('period_start', startOfMonth.toISOString().split('T')[0])
        .maybeSingle()

      const current = usage?.decisions_count || 0
      const remaining = limit - current

      if (current >= limit) {
        return {
          allowed: false,
          limit,
          current,
          remaining: 0,
          message: `You've reached your decision limit (${limit.toLocaleString()}). Upgrade to continue reviewing recommendations.`
        }
      }

      return { allowed: true, limit, current, remaining }
    }

    const isTrial = subscription.status === 'trial'
    
    // For trials, always use Starter plan limits (half of Starter)
    if (isTrial) {
      const { data: starterPlan } = await supabase
        .from('pricing_plans')
        .select('decisions_limit')
        .eq('name', 'Starter')
        .single()

      const starterLimit = starterPlan?.decisions_limit || null
      const limit = starterLimit ? Math.floor(starterLimit / 2) : null
      
      if (limit === null) {
        return { allowed: true, limit: null, current: 0, remaining: null }
      }

      // Check current usage
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('decisions_count')
        .eq('user_id', userId)
        .eq('period_start', startOfMonth.toISOString().split('T')[0])
        .maybeSingle()

      const current = usage?.decisions_count || 0
      const remaining = limit - current

      if (current >= limit) {
        return {
          allowed: false,
          limit,
          current,
          remaining: 0,
          message: `You've reached your decision limit (${limit.toLocaleString()}). Upgrade to continue reviewing recommendations.`
        }
      }

      return { allowed: true, limit, current, remaining }
    }

    const limit = subscription.decisions_limit

    // If unlimited (null or very large number)
    if (limit === null || limit >= 999999999) {
      return { allowed: true, limit: null, current: 0, remaining: null }
    }

    // Check current usage
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('decisions_count')
      .eq('user_id', userId)
      .eq('period_start', startOfMonth.toISOString().split('T')[0])
      .maybeSingle()

    const current = usage?.decisions_count || 0
    const remaining = limit - current

    if (current >= limit) {
      return {
        allowed: false,
        limit,
        current,
        remaining: 0,
        message: `You've reached your decision limit (${limit.toLocaleString()}). Upgrade to continue reviewing recommendations.`
      }
    }

    return { allowed: true, limit, current, remaining }
  } catch (error) {
    console.error('Error checking decision limit:', error)
    // On error, allow usage (fail open)
    return { allowed: true, limit: null, current: 0, remaining: null }
  }
}

