'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface OnboardingQuestionnaireProps {
  userId: string
  onComplete: () => void
}

const BUSINESS_ROLES = [
  { value: 'owner', label: 'Business Owner / Founder' },
  { value: 'ceo', label: 'CEO' },
  { value: 'social_media_manager', label: 'Social Media Manager' },
  { value: 'marketing_director', label: 'Marketing Director' },
  { value: 'operations_manager', label: 'Operations Manager' },
  { value: 'cmo', label: 'CMO (Chief Marketing Officer)' },
  { value: 'cfo', label: 'CFO (Chief Financial Officer)' },
  { value: 'other', label: 'Other' },
]

const COMMON_GOALS = [
  'Increase revenue',
  'Reduce costs',
  'Improve customer acquisition',
  'Optimize marketing spend',
  'Scale operations',
  'Improve inventory management',
  'Increase customer retention',
  'Launch new products/services',
  'Expand to new markets',
  'Improve team productivity',
]

const CURRENT_YEAR = new Date().getFullYear()

export default function OnboardingQuestionnaire({ userId, onComplete }: OnboardingQuestionnaireProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    businessName: '',
    businessRole: '',
    otherRole: '',
    goalsYear: CURRENT_YEAR,
    specificGoals: [] as string[],
    customGoal: '',
    howMysmartlyHelps: '',
    additionalInfo: '',
  })

  const totalSteps = 5

  const handleNext = () => {
    if (currentStep < totalSteps) {
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

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      specificGoals: prev.specificGoals.includes(goal)
        ? prev.specificGoals.filter(g => g !== goal)
        : [...prev.specificGoals, goal],
    }))
  }

  const addCustomGoal = () => {
    if (formData.customGoal.trim()) {
      setFormData(prev => ({
        ...prev,
        specificGoals: [...prev.specificGoals, prev.customGoal.trim()],
        customGoal: '',
      }))
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.businessName.trim()) {
        setError('Business name is required')
        setLoading(false)
        return
      }

      if (!formData.businessRole) {
        setError('Please select your role')
        setLoading(false)
        return
      }

      if (formData.businessRole === 'other' && !formData.otherRole.trim()) {
        setError('Please specify your role')
        setLoading(false)
        return
      }

      if (formData.specificGoals.length === 0) {
        setError('Please select at least one goal')
        setLoading(false)
        return
      }

      // Prepare data for database
      const onboardingData = {
        user_id: userId,
        business_name: formData.businessName.trim(),
        business_role: formData.businessRole,
        other_role: formData.businessRole === 'other' ? formData.otherRole.trim() : null,
        goals_year: formData.goalsYear,
        specific_goals: formData.specificGoals,
        how_mysmartly_helps: formData.howMysmartlyHelps.trim() || null,
        additional_info: formData.additionalInfo.trim() || null,
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

        {/* Step 1: Business Name */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Welcome to mySmartly!</h2>
              <p className="text-text-secondary">
                Let&apos;s personalize your experience. First, tell us about your business.
              </p>
            </div>
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-primary mb-2">
                What's the name of your business? *
              </label>
              <input
                type="text"
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="e.g., Acme Corporation"
                required
              />
            </div>
          </div>
        )}

        {/* Step 2: Business Role */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Your Role</h2>
              <p className="text-text-secondary">
                What role do you play in your business?
              </p>
            </div>
            <div className="space-y-3">
              {BUSINESS_ROLES.map((role) => (
                <label
                  key={role.value}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.businessRole === role.value
                      ? 'border-accent bg-accent/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="businessRole"
                    value={role.value}
                    checked={formData.businessRole === role.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessRole: e.target.value }))}
                    className="mr-3"
                  />
                  <span className="text-text-primary">{role.label}</span>
                </label>
              ))}
              {formData.businessRole === 'other' && (
                <input
                  type="text"
                  value={formData.otherRole}
                  onChange={(e) => setFormData(prev => ({ ...prev, otherRole: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent mt-3"
                  placeholder="Please specify your role"
                />
              )}
            </div>
          </div>
        )}

        {/* Step 3: Goals Year */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Setting Goals</h2>
              <p className="text-text-secondary">
                What year are you setting goals for?
              </p>
            </div>
            <div>
              <label htmlFor="goalsYear" className="block text-sm font-medium text-primary mb-2">
                Year *
              </label>
              <input
                type="number"
                id="goalsYear"
                value={formData.goalsYear}
                onChange={(e) => setFormData(prev => ({ ...prev, goalsYear: parseInt(e.target.value) || CURRENT_YEAR }))}
                min={CURRENT_YEAR}
                max={CURRENT_YEAR + 5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
              <p className="text-xs text-text-secondary mt-1">
                We&apos;ll help you track progress toward your {formData.goalsYear} goals
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Specific Goals */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Your Goals for {formData.goalsYear}</h2>
              <p className="text-text-secondary">
                What specific goals do you want to achieve? Select all that apply.
              </p>
            </div>
            <div className="space-y-3">
              {COMMON_GOALS.map((goal) => (
                <label
                  key={goal}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.specificGoals.includes(goal)
                      ? 'border-accent bg-accent/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.specificGoals.includes(goal)}
                    onChange={() => toggleGoal(goal)}
                    className="mr-3"
                  />
                  <span className="text-text-primary">{goal}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.customGoal}
                onChange={(e) => setFormData(prev => ({ ...prev, customGoal: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && addCustomGoal()}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Add a custom goal..."
              />
              <button
                onClick={addCustomGoal}
                className="px-6 py-3 bg-gray-100 text-primary rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
            {formData.specificGoals.length > 0 && (
              <div className="mt-4 p-4 bg-accent/10 rounded-lg">
                <p className="text-sm font-medium text-primary mb-2">Selected Goals:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.specificGoals.map((goal, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-accent text-white rounded-full text-sm"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 5: How mySmartly Can Help */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">How Can mySmartly Help?</h2>
              <p className="text-text-secondary">
                Tell us how you&apos;d like mySmartly to help you achieve your goals.
              </p>
            </div>
            <div>
              <label htmlFor="howMysmartlyHelps" className="block text-sm font-medium text-primary mb-2">
                How do you want mySmartly to help you? *
              </label>
              <textarea
                id="howMysmartlyHelps"
                value={formData.howMysmartlyHelps}
                onChange={(e) => setFormData(prev => ({ ...prev, howMysmartlyHelps: e.target.value }))}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="e.g., I want mySmartly to help me identify which marketing channels are most effective, optimize my ad spend, and predict customer behavior..."
                required
              />
            </div>
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-primary mb-2">
                Additional Information (Optional)
              </label>
              <textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Any other information that would help us personalize your experience..."
              />
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

