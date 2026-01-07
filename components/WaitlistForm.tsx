'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [features, setFeatures] = useState<string[]>([])
  const [integrationWish, setIntegrationWish] = useState('')
  const [customFeature, setCustomFeature] = useState('')
  const [showOptional, setShowOptional] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleFeatureChange = (value: string) => {
    setFeatures(prev => 
      prev.includes(value) 
        ? prev.filter(f => f !== value)
        : [...prev, value]
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          features: features.length > 0 ? features : undefined,
          integration_wish: integrationWish.trim() || undefined,
          custom_feature: customFeature.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: "Thank you! You've been added to the waitlist. We'll be in touch soon." })
        setEmail('')
        setFeatures([])
        setIntegrationWish('')
        setCustomFeature('')
        setShowOptional(false)
      } else {
        setMessage({ type: 'error', text: data.error || 'Something went wrong. Please try again.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again later.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
      {/* Email Input */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          disabled={loading}
          className="flex-1 px-5 py-3.5 border border-gray-200 rounded-lg font-sans text-[15px] text-text-primary bg-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-50"
        />
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3.5 bg-white text-primary rounded-lg font-medium text-[15px] hover:bg-accent hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-lg"
        >
          {loading ? 'Joining...' : 'Join Waitlist'}
        </motion.button>
      </div>

      {/* Optional Questions Toggle */}
      <div className="text-center">
        <button
          type="button"
          onClick={() => setShowOptional(!showOptional)}
          className="text-text-secondary hover:text-primary text-sm underline transition-colors"
        >
          {showOptional ? 'Hide' : 'Show'} optional questions (help us build better features)
        </button>
      </div>

      {/* Optional Questions */}
      {showOptional && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-6 pt-4 border-t border-gray-200"
        >
          {/* Feature Poll */}
          <div>
            <p className="font-semibold text-primary mb-2">
              Which potential features matter most to you? (Optional)
            </p>
            <p className="text-sm text-text-secondary mb-4">
              This helps us build the right tools for you.
            </p>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={features.includes('cashflow')}
                  onChange={() => handleFeatureChange('cashflow')}
                  className="mt-1 w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <div className="flex-1">
                  <strong className="text-primary">Predictive Cash Flow Alerts</strong>
                  <br />
                  <small className="text-text-secondary">Get warned 30 days before cash shortages based on sales trends and expenses.</small>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={features.includes('competitor')}
                  onChange={() => handleFeatureChange('competitor')}
                  className="mt-1 w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <div className="flex-1">
                  <strong className="text-primary">Competitor Price Monitoring</strong>
                  <br />
                  <small className="text-text-secondary">Track competitor pricing changes and get recommendations to stay competitive.</small>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={features.includes('profit-optimization')}
                  onChange={() => handleFeatureChange('profit-optimization')}
                  className="mt-1 w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <div className="flex-1">
                  <strong className="text-primary">Profit Margin Optimization</strong>
                  <br />
                  <small className="text-text-secondary">AI suggests optimal pricing for each product/service to maximize profit.</small>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={features.includes('team-reports')}
                  onChange={() => handleFeatureChange('team-reports')}
                  className="mt-1 w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <div className="flex-1">
                  <strong className="text-primary">Automated Team Performance Reports</strong>
                  <br />
                  <small className="text-text-secondary">Auto-generate weekly reports for your team on KPIs, goals, and action items.</small>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={features.includes('customer-health')}
                  onChange={() => handleFeatureChange('customer-health')}
                  className="mt-1 w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <div className="flex-1">
                  <strong className="text-primary">Customer Health & Churn Predictor</strong>
                  <br />
                  <small className="text-text-secondary">Identify at-risk customers and get retention strategies before they leave.</small>
                </div>
              </label>
            </div>
          </div>

          {/* Integration Wish */}
          <div>
            <p className="font-semibold text-primary mb-2">
              What's the ONE integration you couldn't live without?
            </p>
            <input
              type="text"
              value={integrationWish}
              onChange={(e) => setIntegrationWish(e.target.value)}
              placeholder="Example: QuickBooks, Salesforce, Amazon Seller Central"
              maxLength={50}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[15px] text-text-primary bg-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
            <small className="text-text-secondary text-sm">We prioritize integrations based on demand.</small>
          </div>

          {/* Custom Feature */}
          <div>
            <p className="font-semibold text-primary mb-2">
              Have a unique need not listed above?
            </p>
            <textarea
              value={customFeature}
              onChange={(e) => setCustomFeature(e.target.value)}
              rows={3}
              placeholder="Briefly describe the feature or problem you'd like solved..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[15px] text-text-primary bg-surface focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
            />
          </div>
        </motion.div>
      )}

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg text-[15px] ${
            message.type === 'success'
              ? 'bg-secondary text-primary'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </motion.div>
      )}
    </form>
  )
}
