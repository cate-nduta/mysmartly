'use client'

import { useState, useEffect } from 'react'
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
  available_applications?: string[]
  tokens_limit?: number
  decisions_limit?: number
}

const ALL_APPLICATIONS = [
  { type: 'google_analytics', name: 'Google Analytics 4' },
  { type: 'google_ads', name: 'Google Ads' },
  { type: 'shopify', name: 'Shopify' },
  { type: 'instagram_ads', name: 'Instagram Ads' },
  { type: 'quickbooks', name: 'QuickBooks' },
  { type: 'hubspot', name: 'HubSpot' },
  { type: 'zendesk', name: 'Zendesk' },
  { type: 'youtube_ads', name: 'YouTube Ads' },
  { type: 'tiktok_ads', name: 'TikTok Ads' },
  { type: 'facebook_ads', name: 'Facebook Ads' },
]

export default function PricingManagement() {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('created_at', { ascending: true })

      if (fetchError) {
        // Check if it's a configuration error
        if (fetchError.message?.includes('Invalid API key') || fetchError.message?.includes('JWT')) {
          setError('Supabase is not configured correctly. Please check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local file.')
        } else {
          throw fetchError
        }
        return
      }
      
      // Sort plans to ensure correct order: Starter, Pro, Enterprise
      if (data && data.length > 0) {
        const sortedPlans = data.sort((a, b) => {
          const order = ['Starter', 'Pro', 'Enterprise']
          const aIndex = order.indexOf(a.name)
          const bIndex = order.indexOf(b.name)
          return aIndex - bIndex
        })
        setPlans(sortedPlans)
      } else {
        setPlans(data || [])
      }
    } catch (error: any) {
      console.error('Error fetching pricing plans:', error)
      if (error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
        setError('Failed to connect to Supabase. Please check your configuration and restart the server.')
      } else {
        setError(error.message || 'Failed to load pricing plans. Please check your Supabase configuration.')
      }
      setMessage({ type: 'error', text: error.message || 'Failed to load pricing plans' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (plan: PricingPlan) => {
    try {
      const { error } = await supabase
        .from('pricing_plans')
        .update({
          price: plan.price,
          period: plan.period,
          description: plan.description,
          features: plan.features,
          is_popular: plan.is_popular,
          cta_text: plan.cta_text,
          available_applications: plan.available_applications || [],
          tokens_limit: plan.tokens_limit || 250,
          decisions_limit: plan.decisions_limit || 150,
          updated_at: new Date().toISOString(),
        })
        .eq('id', plan.id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Pricing plan updated successfully' })
      setEditingPlan(null)
      fetchPlans()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update pricing plan' })
    }
  }

  if (loading) return <div>Loading...</div>

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Configuration Error</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <p className="text-sm text-red-600 mb-2">
          Make sure you have:
        </p>
        <ul className="text-sm text-red-600 list-disc list-inside mb-4">
          <li>Created a <code className="bg-red-100 px-2 py-1 rounded">.env.local</code> file with your Supabase credentials</li>
          <li>Restarted your development server after creating/updating .env.local</li>
        </ul>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Manage Pricing Plans</h2>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {plans.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Pricing Plans Found</h3>
          <p className="text-yellow-700 mb-4">
            The pricing plans table is empty. Please run the SQL script to insert default pricing plans.
          </p>
          <p className="text-sm text-yellow-600">
            Run the <code className="bg-yellow-100 px-2 py-1 rounded">fix-pricing-plans-rls.sql</code> script in your Supabase SQL Editor to:
          </p>
          <ul className="text-sm text-yellow-600 list-disc list-inside mt-2">
            <li>Fix RLS policies to allow admins to view pricing plans</li>
            <li>Insert default pricing plans (Starter, Pro, Enterprise)</li>
          </ul>
        </div>
      ) : (
        plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg border border-gray-200 p-6">
            {editingPlan?.id === plan.id ? (
              <EditPlanForm
                plan={editingPlan}
                onSave={handleSave}
                onCancel={() => setEditingPlan(null)}
              />
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {plan.name}
                      {plan.is_popular && (
                        <span className="ml-2 text-sm bg-accent text-white px-2 py-1 rounded">Most Popular</span>
                      )}
                    </h3>
                    <p className="text-text-secondary">{plan.description}</p>
                  </div>
                  <button
                    onClick={() => setEditingPlan(plan)}
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-primary">Price:</span> {plan.price}{plan.period}
                  </div>
                  <div>
                    <span className="font-medium text-primary">CTA:</span> {plan.cta_text}
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-primary">Features:</span>
                    <ul className="list-disc list-inside mt-2 text-text-secondary">
                      {plan.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        ))
      )}
      </div>
    </div>
  )
}

function EditPlanForm({ plan, onSave, onCancel }: { plan: PricingPlan; onSave: (plan: PricingPlan) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    ...plan,
    available_applications: plan.available_applications || [],
    tokens_limit: plan.tokens_limit || 250,
    decisions_limit: plan.decisions_limit || 150,
  })
  const [featuresText, setFeaturesText] = useState(plan.features.join('\n'))
  
  const toggleApplication = (appType: string) => {
    setFormData(prev => ({
      ...prev,
      available_applications: prev.available_applications?.includes(appType)
        ? prev.available_applications.filter(a => a !== appType)
        : [...(prev.available_applications || []), appType]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      features: featuresText.split('\n').filter(f => f.trim() !== ''),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Price</label>
          <input
            type="text"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Period</label>
          <input
            type="text"
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1">Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1">Features (one per line)</label>
        <textarea
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_popular}
            onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
            className="w-4 h-4 text-accent focus:ring-accent"
          />
          <span className="text-sm font-medium text-primary">Mark as Most Popular</span>
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1">CTA Text</label>
        <input
          type="text"
          value={formData.cta_text}
          onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      
      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-primary mb-3">Available Applications</label>
        <p className="text-xs text-text-secondary mb-3">Select which applications clients on this tier can access</p>
        <div className="grid grid-cols-2 gap-3">
          {ALL_APPLICATIONS.map((app) => (
            <label key={app.type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.available_applications?.includes(app.type) || false}
                onChange={() => toggleApplication(app.type)}
                className="w-4 h-4 text-accent focus:ring-accent"
              />
              <span className="text-sm text-text-secondary">{app.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-primary mb-3">Usage Limits</label>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Tokens Limit</label>
            <input
              type="number"
              value={formData.tokens_limit}
              onChange={(e) => setFormData({ ...formData, tokens_limit: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Decisions Limit</label>
            <input
              type="number"
              value={formData.decisions_limit}
              onChange={(e) => setFormData({ ...formData, decisions_limit: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-100 text-primary rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
