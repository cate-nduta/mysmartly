'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

declare global {
  interface Window {
    PaystackPop: any
  }
}

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planName = searchParams.get('plan') || 'Starter'
  
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [plan, setPlan] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [paystackLoaded, setPaystackLoaded] = useState(false)

  useEffect(() => {
    checkUser()
    fetchPlan()
  }, [planName])

  const checkUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser) {
        router.push('/auth/login?redirect=/dashboard/checkout')
        return
      }

      setUser(currentUser)
      setEmail(currentUser.email || '')
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('name', planName)
        .single()

      if (error) throw error
      setPlan(data)
    } catch (error) {
      console.error('Error fetching plan:', error)
    }
  }

  const handlePayment = async () => {
    if (!user || !plan || !paystackLoaded) return

    setProcessing(true)

    try {
      // Get plan price (remove $ and convert to cents for Paystack)
      const priceStr = plan.price.replace('$', '').replace(',', '')
      const priceInCents = parseFloat(priceStr) * 100

      // Initialize Paystack payment
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        email: email,
        amount: priceInCents, // Amount in kobo/cents
        currency: 'USD',
        ref: `mysmartly_${Date.now()}_${user.id}`,
        metadata: {
          userId: user.id,
          planName: planName,
          custom_fields: [
            {
              display_name: 'Plan',
              variable_name: 'plan_name',
              value: planName,
            },
          ],
        },
        callback: async (response: any) => {
          // Verify payment on backend - keep processing state true during verification
          await verifyPayment(response.reference, user.id, planName)
        },
        onClose: () => {
          setProcessing(false)
          alert('Payment window closed. Please try again if you want to complete the payment.')
        },
      })

      handler.openIframe()
    } catch (error) {
      console.error('Error initiating payment:', error)
      alert('Failed to initiate payment. Please try again.')
      setProcessing(false)
    }
  }

  const verifyPayment = async (reference: string, userId: string, plan: string) => {
    try {
      // Call backend API to verify payment
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, userId, plan }),
      })

      const data = await response.json()

      if (data.success) {
        // Check if user already has this plan
      const { data: existingSub } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()

      // If upgrading to same plan, don't allow early renewal
      if (existingSub && existingSub.plan_name === plan) {
        const renewalDate = new Date(existingSub.current_period_end)
        const today = new Date()
        
        if (renewalDate > today) {
          alert('You cannot renew your current plan early. Please wait until your billing period ends, or upgrade to a higher tier.')
          setProcessing(false)
          return
        }
      }

      // Update subscription in database
      const periodStart = existingSub?.current_period_start 
        ? new Date(existingSub.current_period_start)
        : new Date()
      const periodEnd = existingSub?.current_period_end && new Date(existingSub.current_period_end) > new Date()
        ? new Date(existingSub.current_period_end)
        : new Date()
      
      // If upgrading, start new period immediately
      // If renewing, extend from current end date
      if (existingSub && existingSub.plan_name !== plan) {
        periodStart.setTime(new Date().getTime())
        periodEnd.setTime(new Date().getTime())
      }
      periodEnd.setDate(periodEnd.getDate() + 30) // 30-day cycle

      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          plan_name: plan,
          status: 'active',
          current_period_start: periodStart.toISOString(),
          current_period_end: periodEnd.toISOString(),
          paystack_customer_code: data.customerCode || existingSub?.paystack_customer_code,
          paystack_subscription_code: data.subscriptionCode || existingSub?.paystack_subscription_code,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        })

      if (updateError) throw updateError

        alert('Payment successful! Your subscription is now active.')
        router.push('/dashboard')
      } else {
        throw new Error(data.error || 'Payment verification failed')
      }
    } catch (error) {
      console.error('Error verifying payment:', error)
      alert('Payment verification failed. Please contact support.')
      setProcessing(false)
    }
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

  if (!user || !plan) {
    return null
  }

  // Show processing overlay when payment is being processed
  if (processing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-accent border-t-transparent"></div>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-4">Processing...</h2>
          <p className="text-text-secondary mb-2">
            Please wait a while, this may take a few moments.
          </p>
          <p className="text-text-secondary font-medium">
            Don&apos;t refresh or click browser back button.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Complete Your Subscription</h1>
          <p className="text-text-secondary mb-8">Secure payment powered by Paystack</p>

          {/* Plan Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-primary">{plan.name} Plan</h3>
                <p className="text-text-secondary">{plan.description}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{plan.price}</div>
                <div className="text-text-secondary">{plan.period}</div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <ul className="space-y-2">
                {plan.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-text-secondary">
                    <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment Info */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-primary mb-2">
              Email Address (for payment receipt)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={processing || !paystackLoaded || !email}
            className="w-full px-6 py-4 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? 'Processing...' : `Pay ${plan.price}${plan.period}`}
          </button>

          <p className="mt-4 text-sm text-text-secondary text-center">
            Your subscription will renew automatically every 30 days. You can cancel anytime from your dashboard.
          </p>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Secure Payment:</strong> Your payment is processed securely by Paystack. 
              We never store your card details.
            </p>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Remember:</strong> The free trial has limitations. When you reach your plan&apos;s limits, you&apos;ll see an upgrade notification on your dashboard.
            </p>
          </div>
        </div>
      </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}

