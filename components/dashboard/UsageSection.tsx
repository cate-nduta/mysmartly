'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getPlanLimits, PlanLimits } from '@/lib/planLimits'
import Link from 'next/link'

interface UsageSectionProps {
  userId: string
  plan: any
  subscription: any
}

export default function UsageSection({ userId, plan, subscription }: UsageSectionProps) {
  const router = useRouter()
  const [usage, setUsage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [connectionsCount, setConnectionsCount] = useState(0)
  const [recommendationsCount, setRecommendationsCount] = useState(0)
  const [tokensUsed, setTokensUsed] = useState(0)
  const [starterPlan, setStarterPlan] = useState<any>(null)

  useEffect(() => {
    fetchUsage()
    fetchStarterPlan()
  }, [userId])

  const fetchUsage = async () => {
    try {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      // Fetch or create usage tracking for current month
      const { data: usageData, error: usageError } = await supabase
        .from('usage_tracking')
        .select('*')
        .eq('user_id', userId)
        .eq('period_start', startOfMonth.toISOString().split('T')[0])
        .single()

      if (usageError && usageError.code !== 'PGRST116') {
        throw usageError
      }

      if (usageData) {
        setUsage(usageData)
        setConnectionsCount(usageData.connections_count || 0)
        setRecommendationsCount(usageData.decisions_count || 0)
        setTokensUsed(usageData.tokens_used || 0)
      } else {
        // Create new usage record for current month
        const { data: newUsage } = await supabase
          .from('usage_tracking')
          .insert({
            user_id: userId,
            period_start: startOfMonth.toISOString().split('T')[0],
            period_end: endOfMonth.toISOString().split('T')[0],
            decisions_count: 0,
            connections_count: 0,
            tokens_used: 0,
          })
          .select()
          .single()

        if (newUsage) {
          setUsage(newUsage)
        }
      }

      // Fetch actual counts
      const { count: connectionsCountData } = await supabase
        .from('data_connections')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      setConnectionsCount(connectionsCountData || 0)

      const { count: recommendationsCountData } = await supabase
        .from('recommendations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())

      setRecommendationsCount(recommendationsCountData || 0)
    } catch (error) {
      console.error('Error fetching usage:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStarterPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('name', 'Starter')
        .single()

      if (!error && data) {
        setStarterPlan(data)
      }
    } catch (error) {
      console.error('Error fetching Starter plan:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-text-secondary">Loading usage data...</p>
        </div>
      </div>
    )
  }

  // Check if user is on free trial
  const isFreeTrial = !subscription || subscription.status === 'trial'
  
  // Priority order for getting limits:
  // 1. Subscription limits (if set - these are correct for trial/paid)
  // 2. Plan limits (from pricing_plans.tokens_limit and decisions_limit)
  // 3. For trial: half of plan limits
  // 4. Fallback: parse from features (backward compatibility)
  
  let effectiveLimits: PlanLimits = {
    recommendations: null,
    tokens: null,
    connections: null,
  }
  
  // First, try to get from subscription (most accurate)
  if (subscription?.decisions_limit !== null && subscription?.decisions_limit !== undefined) {
    effectiveLimits.recommendations = subscription.decisions_limit
  }
  if (subscription?.tokens_limit !== null && subscription?.tokens_limit !== undefined) {
    effectiveLimits.tokens = subscription.tokens_limit
  }
  
  // If subscription doesn't have limits, get from plan
  if (plan) {
    // For trials, always use Starter plan limits (half of Starter), not the user's plan
    if (isFreeTrial) {
      // Use Starter plan from state (already fetched in useEffect)
      if (starterPlan) {
        if (effectiveLimits.recommendations === null && starterPlan.decisions_limit !== null && starterPlan.decisions_limit !== undefined) {
          // Trial gets half of Starter plan limits
          effectiveLimits.recommendations = Math.floor(starterPlan.decisions_limit / 2)
        }
        
        if (effectiveLimits.tokens === null && starterPlan.tokens_limit !== null && starterPlan.tokens_limit !== undefined) {
          // Trial gets half of Starter plan limits
          effectiveLimits.tokens = Math.floor(starterPlan.tokens_limit / 2)
        }
      }
    } else {
      // Paid users get full plan limits
      if (effectiveLimits.recommendations === null && plan.decisions_limit !== null && plan.decisions_limit !== undefined) {
        effectiveLimits.recommendations = plan.decisions_limit
      }
      
      if (effectiveLimits.tokens === null && plan.tokens_limit !== null && plan.tokens_limit !== undefined) {
        effectiveLimits.tokens = plan.tokens_limit
      }
    }
  }
  
  // Final fallback: if still null, try parsing features (for backward compatibility)
  if ((effectiveLimits.recommendations === null || effectiveLimits.tokens === null) && plan) {
    const limits: PlanLimits = getPlanLimits(plan.features || [])
    if (effectiveLimits.recommendations === null) {
      effectiveLimits.recommendations = limits.recommendations
    }
    if (effectiveLimits.tokens === null) {
      effectiveLimits.tokens = limits.tokens
    }
  }
  
  // Check if limits are reached
  const decisionsExceeded = effectiveLimits.recommendations !== null && recommendationsCount >= effectiveLimits.recommendations
  const tokensExceeded = effectiveLimits.tokens !== null && tokensUsed >= effectiveLimits.tokens

  const getUsagePercentage = (current: number, limit: number | null) => {
    if (limit === null) return 0
    return Math.min((current / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-accent'
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2">Usage Overview</h2>
        <p className="text-text-secondary">
          Track your usage for the current billing period
        </p>
      </div>

      {/* Upgrade Nudge when limits reached */}
      {(decisionsExceeded || tokensExceeded) && (
        <div className="mb-6 p-6 bg-gradient-to-r from-accent to-emerald-600 rounded-xl shadow-lg text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <h3 className="text-xl font-bold">You&apos;ve reached your limit</h3>
              </div>
              <p className="mb-4 opacity-90">
                {decisionsExceeded && tokensExceeded
                  ? `You've used all ${effectiveLimits.recommendations} decisions and ${effectiveLimits.tokens?.toLocaleString() || 0} tokens. Upgrade to continue using mySmartly.`
                  : decisionsExceeded
                  ? `You've used all ${effectiveLimits.recommendations} decisions this month. Upgrade to get more.`
                  : `You've used all ${effectiveLimits.tokens?.toLocaleString() || 0} tokens this month. Upgrade to get more.`}
              </p>
              <Link
                href="/dashboard/upgrade"
                className="inline-block px-6 py-3 bg-white text-accent rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Decisions Usage */}
        <div className={`bg-white rounded-lg border-2 p-6 ${decisionsExceeded ? 'border-red-300' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">Decisions</h3>
            <span className={`text-sm font-medium ${decisionsExceeded ? 'text-red-600' : 'text-text-secondary'}`}>
              {effectiveLimits.recommendations === null 
                ? 'Unlimited' 
                : `${recommendationsCount} / ${effectiveLimits.recommendations.toLocaleString()}`}
            </span>
          </div>
          {effectiveLimits.recommendations !== null && (
            <>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full transition-all ${decisionsExceeded ? 'bg-red-500' : getUsageColor(getUsagePercentage(recommendationsCount, effectiveLimits.recommendations))}`}
                  style={{ width: `${getUsagePercentage(recommendationsCount, effectiveLimits.recommendations)}%` }}
                />
              </div>
              <p className={`text-sm ${decisionsExceeded ? 'text-red-600 font-semibold' : 'text-text-secondary'}`}>
                {decisionsExceeded 
                  ? 'Limit reached! Upgrade to continue.'
                  : `${effectiveLimits.recommendations - recommendationsCount} decisions remaining this month`}
              </p>
            </>
          )}
          {effectiveLimits.recommendations === null && !isFreeTrial && (
            <p className="text-sm text-text-secondary">
              You have unlimited decisions on your plan
            </p>
          )}
        </div>

        {/* Tokens Usage (AI Chatbot) */}
        <div className={`bg-white rounded-lg border-2 p-6 ${tokensExceeded ? 'border-red-300' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">Tokens</h3>
            <span className={`text-sm font-medium ${tokensExceeded ? 'text-red-600' : 'text-text-secondary'}`}>
              {effectiveLimits.tokens === null 
                ? 'Unlimited' 
                : `${tokensUsed.toLocaleString()} / ${effectiveLimits.tokens.toLocaleString()}`}
            </span>
          </div>
          {effectiveLimits.tokens !== null && (
            <>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full transition-all ${tokensExceeded ? 'bg-red-500' : getUsageColor(getUsagePercentage(tokensUsed, effectiveLimits.tokens))}`}
                  style={{ width: `${getUsagePercentage(tokensUsed, effectiveLimits.tokens)}%` }}
                />
              </div>
              <p className={`text-sm ${tokensExceeded ? 'text-red-600 font-semibold' : 'text-text-secondary'}`}>
                {tokensExceeded 
                  ? 'Limit reached! Upgrade to continue.'
                  : `${effectiveLimits.tokens - tokensUsed} tokens remaining this month`}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Used for AI chatbot interactions
              </p>
            </>
          )}
          {effectiveLimits.tokens === null && !isFreeTrial && (
            <p className="text-sm text-text-secondary">
              You have unlimited tokens on your plan
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Billing Period:</strong> {usage ? new Date(usage.period_start).toLocaleDateString() : 'N/A'} - {usage ? new Date(usage.period_end).toLocaleDateString() : 'N/A'}
        </p>
      </div>
    </div>
  )
}

