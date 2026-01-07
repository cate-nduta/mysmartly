'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface OnboardingQuestionnaireProps {
  userId: string
  onComplete: () => void
}

const BUSINESS_TYPES = [
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'saas', label: 'SaaS' },
  { value: 'agency', label: 'Agency' },
  { value: 'local_service', label: 'Local service' },
  { value: 'creator_brand', label: 'Creator / brand' },
  { value: 'other', label: 'Other' },
]

const BUSINESS_STAGES = [
  { value: 'just_starting', label: 'Just starting' },
  { value: 'growing_inconsistent', label: 'Growing but inconsistent' },
  { value: 'scaling_fast', label: 'Scaling fast' },
  { value: 'mature_optimized', label: 'Mature / optimized' },
]

const REVENUE_RANGES = [
  { value: '<1k', label: '<$1k' },
  { value: '1k-10k', label: '$1k–$10k' },
  { value: '10k-50k', label: '$10k–$50k' },
  { value: '50k-250k', label: '$50k–$250k' },
  { value: '250k+', label: '$250k+' },
]

const TOOLS = [
  { value: 'google_analytics', label: 'Google Analytics' },
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'facebook_instagram_ads', label: 'Facebook / Instagram Ads' },
  { value: 'shopify', label: 'Shopify' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'paystack', label: 'Paystack' },
  { value: 'zoho', label: 'Zoho' },
  { value: 'hubspot', label: 'HubSpot' },
  { value: 'quickbooks', label: 'QuickBooks' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'email_marketing', label: 'Email marketing (Mailchimp, Klaviyo, etc.)' },
  { value: 'other', label: 'Other' },
]

const IMPROVEMENT_GOALS = [
  'Increase revenue',
  'Reduce ad spend waste',
  'Improve profit margins',
  'Retain customers',
  'Scale ads safely',
  'Understand what\'s working vs not',
  'All of the above',
]

const RECOMMENDATION_DELIVERY = [
  { value: 'direct', label: 'Just tell me what to do' },
  { value: 'options', label: 'Show me options, I\'ll decide' },
  { value: 'detailed', label: 'Explain the reasoning in detail' },
]

const AI_COMFORT_LEVELS = [
  { value: 'suggestions_only', label: 'Want suggestions only' },
  { value: 'okay_executing', label: "I'm okay executing AI recommendations" },
  { value: 'full_explanations', label: 'I want full explanations before acting' },
]

export default function OnboardingQuestionnaire({ userId, onComplete }: OnboardingQuestionnaireProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    // Step 1
    businessType: '',
    businessTypeOther: '',
    businessStage: '',
    monthlyRevenue: '',
    // Step 2
    toolsUsed: [] as string[],
    toolsOther: '',
    improvementGoals: [] as string[],
    recommendationDelivery: '',
    aiComfortLevel: '',
  })

  const totalSteps = 2

  const handleNext = () => {
    // Validate current step before allowing next
    let canProceed = true
    
    if (currentStep === 1) {
      // Step 1: Business Type and Stage - required
      if (!formData.businessType) {
        setError('Please select what best describes your business')
        canProceed = false
      } else if (formData.businessType === 'other' && !formData.businessTypeOther.trim()) {
        setError('Please specify your business type')
        canProceed = false
      } else if (!formData.businessStage) {
        setError('Please select what stage your business is at')
        canProceed = false
      }
    }
    
    if (canProceed && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      setError(null)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  const toggleTool = (tool: string) => {
    setFormData(prev => ({
      ...prev,
      toolsUsed: prev.toolsUsed.includes(tool)
        ? prev.toolsUsed.filter(t => t !== tool)
        : [...prev.toolsUsed, tool],
    }))
  }

  const toggleImprovementGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      improvementGoals: prev.improvementGoals.includes(goal)
        ? prev.improvementGoals.filter(g => g !== goal)
        : [...prev.improvementGoals, goal],
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.businessType) {
        setError('Please select what best describes your business')
        setLoading(false)
        return
      }

      if (formData.businessType === 'other' && !formData.businessTypeOther.trim()) {
        setError('Please specify your business type')
        setLoading(false)
        return
      }

      if (!formData.businessStage) {
        setError('Please select what stage your business is at')
        setLoading(false)
        return
      }

      if (formData.improvementGoals.length === 0) {
        setError('Please select at least one improvement goal')
        setLoading(false)
        return
      }

      if (!formData.recommendationDelivery) {
        setError('Please select how you would like recommendations delivered')
        setLoading(false)
        return
      }

      if (!formData.aiComfortLevel) {
        setError('Please select your comfort level with AI-generated recommendations')
        setLoading(false)
        return
      }

      // Prepare data for database
      const onboardingData = {
        user_id: userId,
        // New fields
        business_type: formData.businessType,
        business_type_other: formData.businessType === 'other' ? formData.businessTypeOther.trim() : null,
        business_stage: formData.businessStage,
        monthly_revenue: formData.monthlyRevenue || null,
        tools_used: formData.toolsUsed,
        tools_other: formData.toolsOther.trim() || null,
        improvement_goals: formData.improvementGoals,
        recommendation_delivery: formData.recommendationDelivery,
        ai_comfort_level: formData.aiComfortLevel,
        // Keep old fields for backward compatibility (set to null)
        business_name: null,
        business_role: null,
        other_role: null,
        goals_year: null,
        specific_goals: null,
        how_mysmartly_helps: null,
        additional_info: null,
        completed_at: new Date().toISOString(),
      }

      const { error: insertError } = await supabase
        .from('user_onboarding')
        .insert([onboardingData])

      if (insertError) throw insertError

      // Onboarding complete, proceed to dashboard
      onComplete()
    } catch (err: any) {
      console.error('Error saving onboarding data:', err)
      setError(err.message || 'Failed to save your information. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-text-secondary">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-text-secondary">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Business Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Tell us about your business</h2>
              <p className="text-text-secondary">
                Help us personalize your experience
              </p>
            </div>

            {/* Business Type */}
            <div>
              <label className="block text-sm font-medium text-primary mb-3">
                What best describes your business? *
              </label>
              <div className="space-y-3">
                {BUSINESS_TYPES.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.businessType === type.value
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="businessType"
                      value={type.value}
                      checked={formData.businessType === type.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value, businessTypeOther: '' }))}
                      className="mr-3"
                    />
                    <span className="text-text-primary">{type.label}</span>
                  </label>
                ))}
                {formData.businessType === 'other' && (
                  <input
                    type="text"
                    value={formData.businessTypeOther}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessTypeOther: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent mt-3"
                    placeholder="Please specify your business type"
                  />
                )}
              </div>
            </div>

            {/* Business Stage */}
            <div>
              <label className="block text-sm font-medium text-primary mb-3">
                What stage is your business at? *
              </label>
              <div className="space-y-3">
                {BUSINESS_STAGES.map((stage) => (
                  <label
                    key={stage.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.businessStage === stage.value
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="businessStage"
                      value={stage.value}
                      checked={formData.businessStage === stage.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessStage: e.target.value }))}
                      className="mr-3"
                    />
                    <span className="text-text-primary">{stage.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Monthly Revenue (Optional) */}
            <div>
              <label className="block text-sm font-medium text-primary mb-3">
                Monthly revenue range <span className="text-text-secondary font-normal">(optional but powerful)</span>
              </label>
              <p className="text-xs text-text-secondary mb-3">
                This helps your AI not give advice like "scale ads" to someone with no cash flow.
              </p>
              <div className="space-y-3">
                {REVENUE_RANGES.map((range) => (
                  <label
                    key={range.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.monthlyRevenue === range.value
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="monthlyRevenue"
                      value={range.value}
                      checked={formData.monthlyRevenue === range.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, monthlyRevenue: e.target.value }))}
                      className="mr-3"
                    />
                    <span className="text-text-primary">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Tools & Preferences */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Tools & Preferences</h2>
              <p className="text-text-secondary">
                Help us understand how you work and what you need
              </p>
            </div>

            {/* Tools Used */}
            <div>
              <label className="block text-sm font-medium text-primary mb-3">
                Which tools do you currently use to run your business? (Select all that apply)
              </label>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {TOOLS.map((tool) => (
                  <label
                    key={tool.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.toolsUsed.includes(tool.value)
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.toolsUsed.includes(tool.value)}
                      onChange={() => toggleTool(tool.value)}
                      className="mr-3"
                    />
                    <span className="text-text-primary">{tool.label}</span>
                  </label>
                ))}
                {formData.toolsUsed.includes('other') && (
                  <input
                    type="text"
                    value={formData.toolsOther}
                    onChange={(e) => setFormData(prev => ({ ...prev, toolsOther: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent mt-3"
                    placeholder="Please specify other tools"
                  />
                )}
              </div>
            </div>

            {/* Improvement Goals */}
            <div>
              <label className="block text-sm font-medium text-primary mb-3">
                What would you like mySmartly to help you improve first? (Select all that apply) *
              </label>
              <div className="space-y-3">
                {IMPROVEMENT_GOALS.map((goal) => (
                  <label
                    key={goal}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.improvementGoals.includes(goal)
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.improvementGoals.includes(goal)}
                      onChange={() => toggleImprovementGoal(goal)}
                      className="mr-3"
                    />
                    <span className="text-text-primary">{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Recommendation Delivery */}
            <div>
              <label className="block text-sm font-medium text-primary mb-3">
                How would you like recommendations delivered? *
              </label>
              <div className="space-y-3">
                {RECOMMENDATION_DELIVERY.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.recommendationDelivery === option.value
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="recommendationDelivery"
                      value={option.value}
                      checked={formData.recommendationDelivery === option.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, recommendationDelivery: e.target.value }))}
                      className="mr-3"
                    />
                    <span className="text-text-primary">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* AI Comfort Level */}
            <div>
              <label className="block text-sm font-medium text-primary mb-3">
                How comfortable are you with AI-generated recommendations? *
              </label>
              <div className="space-y-3">
                {AI_COMFORT_LEVELS.map((level) => (
                  <label
                    key={level.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      formData.aiComfortLevel === level.value
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="aiComfortLevel"
                      value={level.value}
                      checked={formData.aiComfortLevel === level.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, aiComfortLevel: e.target.value }))}
                      className="mr-3"
                    />
                    <span className="text-text-primary">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-3 bg-gray-100 text-primary rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Complete Setup'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
