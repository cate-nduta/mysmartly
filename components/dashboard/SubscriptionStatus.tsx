'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Subscription {
  id: string
  plan_name: string
  status: string
  current_period_end: string
  trial_end: string | null
}

export default function SubscriptionStatus({ subscription }: { subscription: Subscription }) {
  const router = useRouter()
  const [daysRemaining, setDaysRemaining] = useState(0)
  const isTrial = subscription.status === 'trial'
  const isActive = subscription.status === 'active'
  const isExpired = subscription.status === 'expired' || subscription.status === 'cancelled'

  useEffect(() => {
    const calculateDaysRemaining = () => {
      const endDate = isTrial && subscription.trial_end 
        ? new Date(subscription.trial_end)
        : new Date(subscription.current_period_end)
      const today = new Date()
      const diff = endDate.getTime() - today.getTime()
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
      setDaysRemaining(days > 0 ? days : 0)
    }

    calculateDaysRemaining()
    const interval = setInterval(calculateDaysRemaining, 86400000) // Update daily

    return () => clearInterval(interval)
  }, [subscription, isTrial])

  const handleUpgrade = () => {
    router.push('/dashboard/checkout')
  }

  return (
    <div className={`rounded-xl border-2 p-6 ${
      isTrial 
        ? 'bg-yellow-50 border-yellow-200'
        : isActive
        ? 'bg-emerald-50 border-emerald-200'
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-primary mb-2">
            {isTrial && `Free Trial - ${daysRemaining} days remaining`}
            {isActive && `Active Subscription - ${subscription.plan_name} Plan`}
            {isExpired && 'Subscription Expired'}
          </h3>
          <p className="text-text-secondary">
            {isTrial && 'Upgrade to continue using mySmartly after your trial ends'}
            {isActive && `Next billing date: ${new Date(subscription.current_period_end).toLocaleDateString()}`}
            {isExpired && 'Please upgrade to continue using mySmartly'}
          </p>
        </div>
        <div>
          {isTrial && (
            <button
              onClick={handleUpgrade}
              className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
            >
              Upgrade Now
            </button>
          )}
          {isExpired && (
            <button
              onClick={handleUpgrade}
              className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
            >
              Reactivate
            </button>
          )}
          {isActive && (
            <Link
              href="/dashboard/billing"
              className="px-6 py-3 bg-gray-100 text-primary rounded-lg font-medium hover:bg-gray-200 transition-colors inline-block"
            >
              Manage Billing
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}


