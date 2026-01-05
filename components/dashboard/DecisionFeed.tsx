'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Recommendation {
  id: string
  title: string
  description: string
  recommendation_type: string
  priority: string
  projected_impact: string | null
  projected_roi: string | null
  implementation_steps: string[]
  status: string
  created_at: string
}

interface OnboardingData {
  business_name: string | null
  business_role: string | null
  goals_year: number | null
  specific_goals: string[] | null
  how_mysmartly_helps: string | null
}

interface DecisionFeedProps {
  userId: string
  onboardingData?: OnboardingData | null
}

export default function DecisionFeed({ userId, onboardingData }: DecisionFeedProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    fetchRecommendations()
  }, [userId, filter])

  const fetchRecommendations = async () => {
    try {
      let query = supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query

      if (error) throw error
      setRecommendations(data || [])
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const updateData: any = { status }
      
      if (status === 'approved') {
        updateData.approved_at = new Date().toISOString()
      }
      if (status === 'implemented') {
        updateData.implemented_at = new Date().toISOString()
        updateData.status = 'implemented'
      }

      const { error } = await supabase
        .from('recommendations')
        .update(updateData)
        .eq('id', id)

      if (error) throw error
      await fetchRecommendations()
    } catch (error) {
      console.error('Error updating recommendation:', error)
      alert('Failed to update recommendation. Please try again.')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <p className="text-text-secondary">Loading recommendations...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2">Decision Feed</h2>
          <p className="text-text-secondary">
            {onboardingData?.business_name 
              ? `AI-powered recommendations tailored for ${onboardingData.business_name}`
              : 'AI-powered recommendations to optimize your business decisions'}
          </p>
          {onboardingData?.specific_goals && onboardingData.specific_goals.length > 0 && (
            <p className="text-sm text-text-secondary mt-1">
              Focused on your {onboardingData.goals_year} goals: {onboardingData.specific_goals.slice(0, 3).join(', ')}
              {onboardingData.specific_goals.length > 3 && '...'}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-primary hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'pending'
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-primary hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'approved'
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-primary hover:bg-gray-200'
            }`}
          >
            Approved
          </button>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary mb-4">
            {filter === 'all' 
              ? 'No recommendations yet. Connect your data sources to get started.'
              : `No ${filter} recommendations.`}
          </p>
          {filter === 'all' && (
            <p className="text-sm text-text-secondary">
              Our AI will analyze your connected data sources and provide actionable recommendations within hours.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-accent transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-primary">{rec.title}</h3>
                    <span className={`px-3 py-1 rounded text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-text-secondary mb-4">{rec.description}</p>
                  
                  {(rec.projected_impact || rec.projected_roi) && (
                    <div className="flex gap-4 mb-4 text-sm">
                      {rec.projected_impact && (
                        <span className="text-emerald-600 font-medium">
                          Impact: {rec.projected_impact}
                        </span>
                      )}
                      {rec.projected_roi && (
                        <span className="text-blue-600 font-medium">
                          ROI: {rec.projected_roi}
                        </span>
                      )}
                    </div>
                  )}

                  {rec.implementation_steps && rec.implementation_steps.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-primary mb-2">Implementation Steps:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-text-secondary text-sm">
                        {rec.implementation_steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  rec.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  rec.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                  rec.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
                </span>
                
                {rec.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(rec.id, 'approved')}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(rec.id, 'rejected')}
                      className="px-4 py-2 bg-gray-200 text-primary rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
                
                {rec.status === 'approved' && (
                  <button
                    onClick={() => handleStatusUpdate(rec.id, 'implemented')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Mark as Implemented
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


