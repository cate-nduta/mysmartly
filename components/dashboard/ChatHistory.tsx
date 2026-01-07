'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
  session_id: string | null
}

interface ChatHistoryProps {
  userId: string
}

export default function ChatHistory({ userId }: ChatHistoryProps) {
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [historyDays, setHistoryDays] = useState<number | null>(7)
  const [groupedSessions, setGroupedSessions] = useState<Record<string, ChatMessage[]>>({})

  useEffect(() => {
    fetchHistory()
    fetchHistoryLimit()
  }, [userId])

  const fetchHistoryLimit = async () => {
    try {
      // Get user's subscription to determine history limit
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('plan_name, status')
        .eq('user_id', userId)
        .single()

      let days: number | null = 7 // Default for trial/Starter
      if (subscription) {
        const { data: plan } = await supabase
          .from('pricing_plans')
          .select('data_history_days')
          .eq('name', subscription.plan_name)
          .single()

        if (plan?.data_history_days) {
          days = plan.data_history_days
        } else if (subscription.plan_name === 'Enterprise') {
          days = null // Unlimited
        }
      }

      setHistoryDays(days)
    } catch (error) {
      console.error('Error fetching history limit:', error)
    }
  }

  const fetchHistory = async () => {
    try {
      setLoading(true)

      // Get user's subscription to determine history limit
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('plan_name, status')
        .eq('user_id', userId)
        .single()

      let historyDaysLimit = 7 // Default for trial/Starter
      if (subscription) {
        const { data: plan } = await supabase
          .from('pricing_plans')
          .select('data_history_days')
          .eq('name', subscription.plan_name)
          .single()

        if (plan?.data_history_days) {
          historyDaysLimit = plan.data_history_days
        } else if (subscription.plan_name === 'Enterprise') {
          historyDaysLimit = 9999 // Effectively unlimited
        }
      }

      // Calculate cutoff date
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - historyDaysLimit)

      // Fetch chat history within the limit
      let query = supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100) // Limit to last 100 messages for performance

      if (historyDaysLimit < 9999) {
        query = query.gte('created_at', cutoffDate.toISOString())
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching chat history:', error)
        return
      }

      if (data) {
        setHistory(data)
        
        // Group by session_id
        const grouped: Record<string, ChatMessage[]> = {}
        data.forEach((msg) => {
          const sessionKey = msg.session_id || 'no-session'
          if (!grouped[sessionKey]) {
            grouped[sessionKey] = []
          }
          grouped[sessionKey].push(msg)
        })

        // Sort each session by created_at
        Object.keys(grouped).forEach((key) => {
          grouped[key].sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
        })

        setGroupedSessions(grouped)
      }
    } catch (error) {
      console.error('Error fetching chat history:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      </div>
    )
  }

  const sessions = Object.keys(groupedSessions)
  const totalMessages = history.length

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2">Chat History</h2>
        <p className="text-text-secondary">
          {historyDays === null 
            ? 'Unlimited history (Enterprise plan)'
            : `Showing conversations from the last ${historyDays} day${historyDays > 1 ? 's' : ''}`
          }
        </p>
        {totalMessages > 0 && (
          <p className="text-sm text-text-secondary mt-1">
            {totalMessages} message{totalMessages > 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {totalMessages === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-text-secondary">No chat history yet.</p>
          <p className="text-sm text-text-secondary mt-2">
            Start a conversation with the AI chatbot to see your history here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sessions.map((sessionKey, sessionIndex) => {
            const sessionMessages = groupedSessions[sessionKey]
            const firstMessage = sessionMessages[0]
            const lastMessage = sessionMessages[sessionMessages.length - 1]
            const sessionDate = new Date(firstMessage.created_at)

            return (
              <div key={sessionKey} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4 pb-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-primary">
                      Conversation {sessions.length - sessionIndex}
                    </h3>
                    <span className="text-sm text-text-secondary">
                      {formatDate(firstMessage.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    {sessionMessages.length} message{sessionMessages.length > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {sessionMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === 'user'
                            ? 'bg-accent text-white'
                            : 'bg-gray-100 text-primary'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.role === 'user' ? 'text-emerald-100' : 'text-gray-500'
                        }`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {historyDays !== null && historyDays < 90 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>History Limit:</strong> Your plan includes {historyDays}-day chat history. 
            {' '}
            <Link href="/dashboard/upgrade" className="underline hover:text-blue-900">
              Upgrade to Pro
            </Link>
            {' '}
            for 90-day history, or Enterprise for unlimited history.
          </p>
        </div>
      )}
    </div>
  )
}

