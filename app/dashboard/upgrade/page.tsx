'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'

function UpgradeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [plans, setPlans] = useState<any[]>([])
  const [currentPlan, setCurrentPlan] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    checkUser()
    fetchPlans()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser) {
        router.push('/auth/login?redirect=/dashboard/upgrade')
        return
      }

      setUser(currentUser)

      // Fetch current subscription
      const { data: subData } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', currentUser.id)
        .single()

      setSubscription(subData)

      // Fetch current plan
      if (subData?.plan_name) {
        const { data: planData } = await supabase
          .from('pricing_plans')
          .select('*')
          .eq('name', subData.plan_name)
          .single()

        setCurrentPlan(planData)
      }
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error

      // Sort plans: Starter, Pro, Enterprise
      const sortedPlans = (data || []).sort((a, b) => {
        const order = ['Starter', 'Pro', 'Enterprise']
        return order.indexOf(a.name) - order.indexOf(b.name)
      })

      setPlans(sortedPlans)
    } catch (error) {
      console.error('Error fetching plans:', error)
    }
  }

  const handleUpgrade = (planName: string) => {
    router.push(`/dashboard/checkout?plan=${planName}`)
  }

  const isCurrentPlan = (planName: string) => {
    return currentPlan?.name === planName
  }

  const canUpgradeTo = (planName: string) => {
    if (!currentPlan) return true // No current plan, can choose any
    if (isCurrentPlan(planName)) return false // Can't upgrade to same plan
    
    const planOrder = ['Starter', 'Pro', 'Enterprise']
    const currentIndex = planOrder.indexOf(currentPlan.name)
    const targetIndex = planOrder.indexOf(planName)
    
    return targetIndex > currentIndex // Can only upgrade to higher tiers
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Choose Your Plan</h1>
          <p className="text-text-secondary">
            Select a plan that fits your business needs. You can upgrade or downgrade at any time.
          </p>
          {currentPlan && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Current Plan:</strong> {currentPlan.name} - {currentPlan.price}{currentPlan.period}
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const isCurrent = isCurrentPlan(plan.name)
            const canUpgrade = canUpgradeTo(plan.name)
            const isPopular = plan.is_popular

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white rounded-xl border-2 p-8 relative ${
                  isPopular ? 'border-accent shadow-lg' : 'border-gray-200'
                } ${isCurrent ? 'ring-2 ring-primary' : ''}`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-primary mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-text-secondary">{plan.period}</span>
                  </div>
                  <p className="text-text-secondary text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-text-secondary text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <button
                    disabled
                    className="w-full px-6 py-3 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : canUpgrade ? (
                  <button
                    onClick={() => handleUpgrade(plan.name)}
                    className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                      isPopular
                        ? 'bg-accent text-white hover:bg-emerald-600'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {currentPlan ? `Upgrade to ${plan.name}` : `Choose ${plan.name}`}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full px-6 py-3 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed"
                  >
                    Downgrade Not Available
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>

        <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-900 mb-2">Important Notes:</h3>
          <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
            <li>If you run out of decisions mid-month, you can use on-demand usage or upgrade to a higher tier</li>
            <li>You cannot renew your current plan early - you must wait until your billing period ends</li>
            <li>On-demand charges will be invoiced 5 days before your subscription renewal date</li>
            <li>All plan changes take effect immediately</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/dashboard"
            className="text-accent hover:text-emerald-600 transition-colors font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function UpgradePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    }>
      <UpgradeContent />
    </Suspense>
  )
}

