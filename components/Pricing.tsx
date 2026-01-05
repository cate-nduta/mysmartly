'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

interface PricingPlan {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  is_popular: boolean
  cta_text: string
}

const defaultPlans: PricingPlan[] = [
  {
    id: '1',
    name: 'Starter',
    price: '$149',
    period: '/month',
    description: 'Perfect for small businesses getting started',
    features: ['3 data connections', '500 decisions/month', 'Email support', '7-day data history'],
    is_popular: false,
    cta_text: 'Start Free Trial',
  },
  {
    id: '2',
    name: 'Pro',
    price: '$399',
    period: '/month',
    description: 'For growing businesses',
    features: ['10 data connections', '5,000 decisions/month', 'Priority support', '90-day data history', 'Team collaboration (3 seats)'],
    is_popular: true,
    cta_text: 'Start Free Trial',
  },
  {
    id: '3',
    name: 'Enterprise',
    price: '$1,299',
    period: '/month',
    description: 'For large organizations',
    features: ['Unlimited connections', 'Unlimited decisions', '24/7 phone support', 'Custom models', 'Dedicated CSM', 'SOC 2 reports', 'Unlimited seats'],
    is_popular: false,
    cta_text: 'Contact Sales',
  },
]

export default function Pricing() {
  const router = useRouter()
  const [plans, setPlans] = useState<PricingPlan[]>(defaultPlans)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // Use default plans if Supabase is not configured
        setPlans(defaultPlans)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching pricing plans:', error)
        // Check if it's an RLS policy error
        if (error.message?.includes('row-level security') || error.message?.includes('policy')) {
          console.warn('RLS policy error - using default plans. Run fix-all-admin-rls-policies.sql to fix.')
        }
        // Use default plans on error
        setPlans(defaultPlans)
        setLoading(false)
        return
      }
      if (data && data.length > 0) {
        // Sort plans to ensure correct order: Starter, Pro, Enterprise
        const sortedPlans = data.sort((a, b) => {
          const order = ['Starter', 'Pro', 'Enterprise']
          const aIndex = order.indexOf(a.name)
          const bIndex = order.indexOf(b.name)
          return aIndex - bIndex
        })
        setPlans(sortedPlans)
      } else {
        // No data found - use default plans
        setPlans(defaultPlans)
      }
    } catch (error) {
      console.error('Error fetching pricing plans:', error)
      // Use default plans on error
      setPlans(defaultPlans)
    } finally {
      setLoading(false)
    }
  }

  const handlePlanClick = (planName: string) => {
    // Navigate to signup page with plan selected
    router.push(`/auth/signup?plan=${planName}`)
  }

  if (loading) {
    return (
      <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <p className="text-text-secondary">Loading pricing plans...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary text-center mb-4"
        >
          Get Your Automated Business Analyst
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-text-secondary text-center mb-16"
        >
          14-day free trial • No credit card required
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl border-2 p-8 ${
                plan.is_popular
                  ? 'border-accent shadow-xl scale-105'
                  : 'border-gray-200 shadow-md'
              }`}
            >
              {plan.is_popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-primary mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-text-secondary">{plan.period}</span>
                </div>
                <p className="text-text-secondary">{plan.description}</p>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-text-primary">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePlanClick(plan.name)}
                data-cta={`pricing-${plan.name.toLowerCase()}`}
                className={`block w-full text-center py-4 rounded-lg font-medium transition-colors ${
                  plan.is_popular
                    ? 'bg-accent text-white hover:bg-emerald-600'
                    : 'bg-gray-100 text-primary hover:bg-gray-200'
                }`}
              >
                {plan.cta_text}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
