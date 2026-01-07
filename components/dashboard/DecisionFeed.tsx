'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { checkDecisionLimit } from '@/lib/usageLimits'
import Link from 'next/link'

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
  // Old fields (for backward compatibility)
  business_name: string | null
  business_role: string | null
  goals_year: number | null
  specific_goals: string[] | null
  how_mysmartly_helps: string | null
  // New fields
  business_type: string | null
  business_type_other: string | null
  business_stage: string | null
  monthly_revenue: string | null
  tools_used: string[] | null
  tools_other: string | null
  improvement_goals: string[] | null
  recommendation_delivery: string | null
  ai_comfort_level: string | null
}

interface DecisionFeedProps {
  userId: string
  onboardingData?: OnboardingData | null
}

export default function DecisionFeed({ userId, onboardingData }: DecisionFeedProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [hasConnections, setHasConnections] = useState(false)
  const [decisionLimitReached, setDecisionLimitReached] = useState(false)
  const [decisionLimitMessage, setDecisionLimitMessage] = useState<string>('')

  useEffect(() => {
    // Clear state first to avoid showing stale data
    setRecommendations([])
    setLoading(true)
    fetchRecommendations()
    checkConnections()
    checkDecisionLimitStatus()
  }, [userId, filter])

  // Check decision limit status
  const checkDecisionLimitStatus = async () => {
    if (!userId) return
    
    try {
      const result = await checkDecisionLimit(userId)
      setDecisionLimitReached(!result.allowed)
      if (!result.allowed && result.message) {
        setDecisionLimitMessage(result.message)
      }
    } catch (error) {
      console.error('Error checking decision limit:', error)
    }
  }

  // Refetch when window gains focus (user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      fetchRecommendations()
      checkConnections()
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [userId, filter])

  // Listen for recommendations updates from chatbot
  useEffect(() => {
    const handleRecommendationsUpdate = () => {
      fetchRecommendations()
    }
    
    window.addEventListener('recommendationsUpdated', handleRecommendationsUpdate)
    return () => {
      window.removeEventListener('recommendationsUpdated', handleRecommendationsUpdate)
    }
  }, [])

  const checkConnections = async () => {
    try {
      // Force fresh data
      const { data: connections } = await supabase
        .from('data_connections')
        .select('connection_type, status')
        .eq('user_id', userId)
        .eq('status', 'connected')
        .gte('created_at', new Date(0).toISOString()) // Cache bust

      setHasConnections(!!(connections && connections.length > 0))
    } catch (error) {
      console.error('Error checking connections:', error)
    }
  }

  // Recommendations are generated from chatbot conversations, not automatically

  const fetchRecommendations = async () => {
    try {
      // Force fresh data by clearing state first
      setRecommendations([])
      
      let query = supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        // Add a dummy filter to bust cache
        .gte('created_at', new Date(0).toISOString())

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
    // Check decision limit before allowing any decision actions
    if (status === 'approved' && userId) {
      const limitCheck = await checkDecisionLimit(userId)
      if (!limitCheck.allowed) {
        setDecisionLimitReached(true)
        setDecisionLimitMessage(limitCheck.message || 'Decision limit reached. Please upgrade.')
        alert(limitCheck.message || 'You\'ve reached your decision limit. Please upgrade to continue reviewing recommendations.')
        return
      }
    }

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
      
      // Track decision: When status is updated to 'approved', count as 1 decision
      if (status === 'approved') {
        try {
          await fetch('/api/usage/track-decision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId }),
          })
          // Recheck limit after tracking
          await checkDecisionLimitStatus()
        } catch (err) {
          console.error('Error tracking decision:', err)
          // Don't fail the update if tracking fails
        }
      }
      
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
          <div className="mb-2">
            <h2 className="text-2xl font-bold text-primary">Decision Feed</h2>
          </div>
          <div className="mb-2">
            <span className="text-sm text-text-secondary font-medium">Today</span>
          </div>
          <p className="text-text-secondary mb-1">
            {onboardingData?.business_name 
              ? `AI-powered recommendations tailored for ${onboardingData.business_name}`
              : 'AI-powered recommendations to optimize your business decisions'}
          </p>
          {(() => {
            // Support both old and new goal fields
            const oldGoals = onboardingData?.specific_goals || []
            const newGoals = onboardingData?.improvement_goals || []
            const allGoals = [...oldGoals, ...newGoals]
            const goalsYear = onboardingData?.goals_year
            
            if (allGoals.length > 0) {
              return (
                <p className="text-sm text-text-secondary mt-1">
                  {goalsYear 
                    ? `Focused on your ${goalsYear} goals: ${allGoals.join(', ')} and is using AI`
                    : `Focused on: ${allGoals.join(', ')} and is using AI`}
                </p>
              )
            }
            return null
          })()}
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
              ? 'No recommendations yet. Start a conversation with the AI Business Advisor above to get personalized recommendations based on your connected data.'
              : `No ${filter} recommendations.`}
          </p>
          {filter === 'all' && (
            <p className="text-sm text-text-secondary">
              Ask the AI Business Advisor questions about your business, and recommendations will appear here based on your conversations.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {recommendations.filter(r => r.status === 'pending').map((rec) => {
              // Determine badge and styling based on recommendation type and priority
              const getBadgeInfo = () => {
                const title = rec.title.toLowerCase()
                const actionType = rec.recommendation_type?.toLowerCase() || ''
                
                // High impact recommendations (budget increases, revenue growth)
                if (title.includes('increase') && (title.includes('budget') || title.includes('ad'))) {
                  return { text: 'High Impact • Low Risk', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-500' }
                }
                
                // Cost optimization
                if (title.includes('inventory') || title.includes('cost') || title.includes('save') || title.includes('reduce') || title.includes('optimize') || actionType.includes('cost')) {
                  return { text: 'Cost Optimization', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-500' }
                }
                
                // Urgent/retention
                if (title.includes('retention') || title.includes('churn') || title.includes('urgent') || rec.priority === 'high') {
                  return { text: 'Urgent', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-500' }
                }
                
                // Default based on priority
                if (rec.priority === 'high') {
                  return { text: 'High Impact', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-500' }
                }
                
                return { text: rec.priority || 'Medium', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-500' }
              }
              
              const badgeInfo = getBadgeInfo()
              
              // Extract impact from description (format: "Estimated impact: +$18,750 revenue")
              const impactMatch = rec.description?.match(/Estimated impact: ([^\.]+)/i)
              const impactText = impactMatch ? impactMatch[1] : null
              
              // Extract context description (the part after "Based on...")
              const contextMatch = rec.description?.match(/Based on (.+)/i)
              const contextText = contextMatch ? contextMatch[1] : null
              
              return (
                <div
                  key={rec.id}
                  className={`${badgeInfo.bg} border-l-4 ${badgeInfo.border} p-4 rounded-lg`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-primary">{rec.title}</h4>
                    <span className={`text-xs ${badgeInfo.color} font-medium px-2 py-1 rounded`}>{badgeInfo.text}</span>
                  </div>
                  {impactText && (
                    <p className="text-sm font-medium text-emerald-700 mb-1">
                      Estimated impact: {impactText}
                    </p>
                  )}
                  {contextText && (
                    <p className="text-xs text-text-secondary">{contextText}</p>
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Action Buttons for Pending Recommendations */}
          {recommendations.filter(r => r.status === 'pending').length > 0 && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={async () => {
                  const pendingRecs = recommendations.filter(r => r.status === 'pending')
                  // Update all to approved
                  for (const rec of pendingRecs) {
                    await handleStatusUpdate(rec.id, 'approved')
                  }
                  // Track decision: Clicking "Approve All" = 1 decision
                  try {
                    await fetch('/api/usage/track-decision', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ userId: userId }),
                    })
                  } catch (err) {
                    console.error('Error tracking decision:', err)
                  }
                }}
                className="flex-1 bg-accent text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
              >
                Approve All
              </button>
              <button
                onClick={async () => {
                  // Track decision: Clicking "Review" = 1 decision
                  try {
                    await fetch('/api/usage/track-decision', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ userId: userId }),
                    })
                  } catch (err) {
                    console.error('Error tracking decision:', err)
                  }
                  setFilter('pending')
                }}
                className="flex-1 bg-gray-100 text-primary py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Review
              </button>
            </div>
          )}
          
          {/* Show other status recommendations below */}
          {recommendations.filter(r => r.status !== 'pending').length > 0 && (
            <div className="space-y-4 mt-6 pt-6 border-t border-gray-200">
              {recommendations.filter(r => r.status !== 'pending').map((rec) => (
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
        </>
      )}
    </div>
  )
}


