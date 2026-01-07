'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { checkTokenLimit } from '@/lib/usageLimits'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIChatbotProps {
  userName?: string
  userId?: string
  onRecommendationsGenerated?: () => void
}

export default function AIChatbot({ userName = 'there', userId, onRecommendationsGenerated }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [initialized, setInitialized] = useState(false)
  const [hasData, setHasData] = useState<boolean | null>(null) // null = checking, true = has data, false = no data
  const [checkingData, setCheckingData] = useState(true)
  const [showRecommendationsButton, setShowRecommendationsButton] = useState(false)
  const [tokenLimitReached, setTokenLimitReached] = useState(false)
  const [tokenLimitMessage, setTokenLimitMessage] = useState<string>('')
  const [sessionId, setSessionId] = useState<string>(() => `session-${Date.now()}`)

  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([])

  // Check if user has connected data sources and recommendations
  useEffect(() => {
    const checkDataAvailability = async () => {
      if (!userId) {
        setHasData(false)
        setCheckingData(false)
        return
      }

      try {
        // Check for connected data sources with their types - force fresh data
        const { data: connections } = await supabase
          .from('data_connections')
          .select('id, connection_type, connection_name')
          .eq('user_id', userId)
          .eq('status', 'connected')
          .gte('created_at', new Date(0).toISOString()) // Cache bust

        // Check for recommendations - force fresh data
        const { data: recommendations } = await supabase
          .from('recommendations')
          .select('id')
          .eq('user_id', userId)
          .gte('created_at', new Date(0).toISOString()) // Cache bust
          .limit(1)

        const hasConnections = connections && connections.length > 0
        const hasRecommendations = recommendations && recommendations.length > 0

        // Store connected platform names for context-aware messages
        if (hasConnections) {
          const platformNames = connections.map(conn => {
            // Map connection types to readable names
            const nameMap: Record<string, string> = {
              'google_analytics': 'Google Analytics',
              'google_ads': 'Google Ads',
              'instagram_ads': 'Instagram Ads',
              'instagram_page': 'Instagram Page',
              'shopify': 'Shopify',
              'stripe': 'Stripe',
              'facebook_ads': 'Facebook Ads',
            }
            return nameMap[conn.connection_type] || conn.connection_name || conn.connection_type
          })
          setConnectedPlatforms(platformNames)
        }

        setHasData(hasConnections || hasRecommendations)
      } catch (error) {
        console.error('Error checking data availability:', error)
        setHasData(false)
      } finally {
        setCheckingData(false)
      }
    }

    checkDataAvailability()
    checkTokenLimitStatus()
  }, [userId])

  // Check token limit status
  const checkTokenLimitStatus = async () => {
    if (!userId) return
    
    try {
      const result = await checkTokenLimit(userId)
      setTokenLimitReached(!result.allowed)
      if (!result.allowed && result.message) {
        setTokenLimitMessage(result.message)
      }
    } catch (error) {
      console.error('Error checking token limit:', error)
    }
  }

  // Initialize with greeting message only once
  useEffect(() => {
    const setInitialMessage = async () => {
      if (!initialized && hasData !== null && !checkingData) {
        let initialMessage = ''
        
        if (!hasData) {
          initialMessage = `Hello, ${userName}! I'm your AI business advisor. To help you, I need access to your business data. Please connect your data sources (like Google Analytics, Google Ads, Instagram Ads, or Shopify) in the Data Connections section above. Once connected, I can analyze your data and provide personalized recommendations.`
        } else {
          // Check if there are recommendations specifically
          try {
            const { data: recs } = await supabase
              .from('recommendations')
              .select('id')
              .eq('user_id', userId || '')
              .limit(1)
            
            if (recs && recs.length > 0) {
              initialMessage = `Hello, ${userName}! I see you have recommendations available. Ask me anything about your business data, or I can help you understand your recommendations better. What would you like to know?`
            } else {
              // No recommendations but connections exist
              if (connectedPlatforms.length > 0) {
                const platformsList = connectedPlatforms.length === 1 
                  ? connectedPlatforms[0]
                  : connectedPlatforms.length === 2
                    ? `${connectedPlatforms[0]} and ${connectedPlatforms[1]}`
                    : `${connectedPlatforms.slice(0, -1).join(', ')}, and ${connectedPlatforms[connectedPlatforms.length - 1]}`
                
                initialMessage = `Hello, ${userName}! I see you have connected ${platformsList}. Ask me questions about your business data, and I'll analyze it to provide personalized recommendations. What would you like to know?`
              } else {
                initialMessage = `Hello, ${userName}! I'm your AI business advisor. Connect your data sources above to get started, then ask me questions about your business.`
              }
            }
          } catch (error) {
            // Fallback message
            initialMessage = `Hello, ${userName}! I'm your AI business advisor. Ask me questions about your business data, and I'll provide insights and recommendations based on your connected data sources. What would you like to know?`
          }
        }

        setMessages([
          {
            id: '1',
            role: 'assistant',
            content: initialMessage,
            timestamp: new Date(),
          },
        ])
        setInitialized(true)
      }
    }

    setInitialMessage()
  }, [userName, initialized, hasData, userId, checkingData, connectedPlatforms])

  // Removed auto-scroll functionality - user requested no auto-scrolling

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading || !hasData || tokenLimitReached) return

    // Double-check token limit before sending
    if (userId) {
      const limitCheck = await checkTokenLimit(userId)
      if (!limitCheck.allowed) {
        setTokenLimitReached(true)
        setTokenLimitMessage(limitCheck.message || 'Token limit reached. Please upgrade.')
        return
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      if (!userId) {
        throw new Error('User ID is required for AI chat')
      }

      if (!hasData) {
        throw new Error('Please connect your data sources first. I can only provide insights based on your connected data and recommendations.')
      }

      // Prepare messages for API (only send last 10 messages for context)
      const recentMessages = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content,
      }))

      // Call the LLM API
      const apiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: recentMessages,
          userId: userId,
        }),
      })

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}))
        const errorMessage = errorData.error || `HTTP ${apiResponse.status}: ${apiResponse.statusText}`
        
        // Provide more specific error messages
        let userFriendlyMessage = 'I apologize, but I encountered an error. Please try again or rephrase your question.'
        
        if (errorMessage.includes('API key') || errorMessage.includes('not configured')) {
          userFriendlyMessage = 'AI assistant is not configured. Please contact support to enable this feature.'
        } else if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
          userFriendlyMessage = 'The AI service is currently busy. Please try again in a moment.'
        } else if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
          userFriendlyMessage = 'AI service authentication failed. Please contact support.'
        }
        
        throw new Error(userFriendlyMessage)
      }

      const data = await apiResponse.json()
      
      if (!data.response) {
        throw new Error('No response received from AI service')
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Save messages to database (both user and assistant)
      if (userId) {
        try {
          await fetch('/api/chat/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              messages: [userMessage, assistantMessage],
              sessionId,
            }),
          })
        } catch (err) {
          console.error('Error saving chat history:', err)
          // Don't fail the chat if saving history fails
        }
      }
      
      // If new recommendations were generated, show the "See Recommendations" button
      if (data.newRecommendations && data.newRecommendations > 0) {
        setShowRecommendationsButton(true)
        // Trigger a refresh of recommendations in the parent component
        window.dispatchEvent(new CustomEvent('recommendationsUpdated'))
        // Notify parent component
        if (onRecommendationsGenerated) {
          onRecommendationsGenerated()
        }
      }
    } catch (error: any) {
      console.error('Error getting AI response:', error)
      
      // Show the actual error message if it's user-friendly, otherwise show generic message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error.message || 'I apologize, but I encountered an error. Please try again or rephrase your question.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">AI Business Advisor</h2>
            <p className="text-text-secondary text-sm">
              Ask questions about your business data and get personalized recommendations
            </p>
          </div>
        </div>
      </div>

      {/* See Recommendations Button - Show after recommendations are generated */}
      {showRecommendationsButton && (
        <div className="mb-4 flex justify-center">
          <button
            onClick={() => {
              // Scroll to Decision Feed section
              const decisionFeed = document.getElementById('decision-feed-section')
              if (decisionFeed) {
                decisionFeed.scrollIntoView({ behavior: 'smooth', block: 'start' })
                // Show the Decision Feed if it's hidden
                decisionFeed.style.display = 'block'
              }
            }}
            className="px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
            See Recommendations
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="h-96 overflow-y-auto mb-4 space-y-4 pr-2 border-b border-gray-200 pb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-primary'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
              <p className={`text-xs mt-2 ${
                message.role === 'user' ? 'text-emerald-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-primary rounded-lg p-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        
      </div>

      {/* No Data Notice - Only show if no connections AND no recommendations */}
      {!checkingData && !hasData && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>No data connected yet.</strong> Connect your data sources (Google Analytics, Google Ads, Instagram Ads, or Shopify) in the Data Connections section above to get started.
          </p>
        </div>
      )}

      {/* Token Limit Reached Notice */}
      {tokenLimitReached && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 mb-2">
            <strong>Token limit reached.</strong> {tokenLimitMessage || 'You\'ve used all your tokens for this month.'}
          </p>
          <Link
            href="/dashboard/upgrade"
            className="text-sm text-red-600 underline hover:text-red-700"
          >
            Upgrade to continue using the AI chatbot →
          </Link>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            tokenLimitReached 
              ? "Token limit reached. Upgrade to continue..." 
              : hasData 
              ? "Ask me about your business data..." 
              : "Connect data sources above to start..."
          }
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={loading || !hasData || checkingData || tokenLimitReached}
        />
        <button
          type="submit"
          disabled={loading || !input.trim() || !hasData || checkingData || tokenLimitReached}
          className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Send
        </button>
      </form>

      {/* Quick Suggestions */}
      {hasData && (
        <div className="mt-4">
          <p className="text-xs text-text-secondary mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'How can I increase my revenue?',
              'What are my top performing channels?',
              'How can I optimize my marketing spend?',
              'What recommendations do you have for me?',
            ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="px-3 py-1.5 text-xs bg-gray-100 text-primary rounded-full hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              {suggestion}
            </button>
          ))}
          </div>
        </div>
      )}
    </div>
  )
}

