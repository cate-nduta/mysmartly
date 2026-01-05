'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIChatbotProps {
  userName?: string
}

export default function AIChatbot({ userName = 'there' }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [initialized, setInitialized] = useState(false)

  // Initialize with greeting message only once
  useEffect(() => {
    if (!initialized) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Hello, ${userName}! I am your AI business Advisor... how may I help you today? I can help you understand recommendations, explore additional strategies, and answer questions about optimizing your business decisions. What would you like to know?`,
          timestamp: new Date(),
        },
      ])
      setInitialized(true)
    }
  }, [userName, initialized])

  const scrollToBottom = () => {
    // Only scroll when user sends a message, not on initial load
    if (messages.length > 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    // Only scroll when new messages are added after the initial greeting
    if (messages.length > 1) {
      scrollToBottom()
    }
  }, [messages.length])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

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
      // Simulate API call - In production, replace with actual API endpoint
      const response = await simulateAIResponse(userMessage.content)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or rephrase your question.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const lowerMessage = userMessage.toLowerCase()

    // Context-aware responses
    if (lowerMessage.includes('recommendation') || lowerMessage.includes('suggest')) {
      return 'Based on your connected data sources, I can help you understand the recommendations in your feed. For example, if you see a budget adjustment recommendation, you might want to: 1) Review your current spending patterns, 2) Analyze ROI of current campaigns, 3) Consider reallocating budget to higher-performing channels. Would you like me to elaborate on any specific recommendation?'
    }

    if (lowerMessage.includes('analytics') || lowerMessage.includes('data')) {
      return 'Great question! To get the most out of mySmartly, make sure you have connected all your key data sources (Google Analytics, Shopify, Stripe, etc.). Once connected, our AI analyzes patterns and trends to provide actionable recommendations. You can connect more sources from the Data Connections section to get even better insights.'
    }

    if (lowerMessage.includes('revenue') || lowerMessage.includes('sales') || lowerMessage.includes('income')) {
      return 'To improve revenue, I recommend: 1) Review your pricing strategy based on market trends, 2) Focus on high-converting traffic sources, 3) Optimize your sales funnel based on conversion data, 4) Consider upselling/cross-selling opportunities. Our recommendations in your Decision Feed will provide specific actions based on your actual data.'
    }

    if (lowerMessage.includes('budget') || lowerMessage.includes('spend') || lowerMessage.includes('cost')) {
      return 'Budget optimization is key! Here are some strategies: 1) Allocate more budget to high-performing channels, 2) Reduce spending on low-ROI campaigns, 3) Test new channels with small budgets first, 4) Monitor seasonal trends to adjust budgets accordingly. Check your Decision Feed for specific budget recommendations based on your data.'
    }

    if (lowerMessage.includes('marketing') || lowerMessage.includes('campaign') || lowerMessage.includes('ads')) {
      return 'For marketing optimization: 1) Analyze which campaigns drive the most valuable traffic, 2) A/B test ad creatives and messaging, 3) Retarget high-intent visitors, 4) Optimize for lifetime value, not just immediate conversions. Connect your Facebook Ads or other ad platforms to get specific campaign recommendations.'
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello! I&apos;m here to help you make better business decisions. You can ask me about your recommendations, get additional strategies beyond what&apos;s in your Decision Feed, or ask questions about optimizing your business. What would you like to explore?'
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('what')) {
      return 'I can help you with: 1) Understanding and implementing recommendations from your Decision Feed, 2) Additional strategies beyond the automated recommendations, 3) Interpreting your business data and analytics, 4) Planning next steps for business growth. Feel free to ask me anything specific!'
    }

    // Default response
    return 'That&apos;s an interesting question! Based on your business data and the recommendations in your Decision Feed, I can help you explore this further. To give you the best advice, could you provide a bit more context? For example, are you asking about a specific recommendation you saw, or are you looking for general guidance on a particular area of your business?'
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
              Ask questions and get personalized advice beyond your recommendations
            </p>
          </div>
        </div>
      </div>

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
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about your business..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Send
        </button>
      </form>

      {/* Quick Suggestions */}
      <div className="mt-4">
        <p className="text-xs text-text-secondary mb-2">Quick questions:</p>
        <div className="flex flex-wrap gap-2">
          {[
            'How can I improve revenue?',
            'Explain my recommendations',
            'Marketing optimization tips',
            'Budget allocation advice',
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
    </div>
  )
}

