import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// You can use either OpenAI or Claude API
// Set OPENAI_API_KEY or ANTHROPIC_API_KEY in your environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

interface Recommendation {
  id: string
  title: string
  description: string
  recommendation_type: string
  priority: string
  projected_impact: string | null
  projected_roi: string | null
  implementation_steps: string[] | null
  status: string
  created_at: string
}

async function getRecommendationsForUser(userId: string): Promise<Recommendation[]> {
  try {
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching recommendations:', error)
    return []
  }
}

// Extract recommendations from chatbot response
function extractRecommendationsFromResponse(response: string): Array<{
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  projected_impact?: string
  projected_roi?: string
  implementation_steps?: string[]
}> {
  const recommendations: Array<{
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
    projected_impact?: string
    projected_roi?: string
    implementation_steps?: string[]
  }> = []

  // Look for RECOMMENDATION||| format with optional ROI and implementation steps
  // Format: RECOMMENDATION|||Title|||Description|||Priority|||Projected Impact|||Projected ROI|||Implementation Steps
  const recommendationPattern = /RECOMMENDATION\|\|\|([^\|]+)\|\|\|([^\|]+)\|\|\|([^\|]+)\|\|\|([^\|]+)(?:\|\|\|([^\|]+))?(?:\|\|\|([^\n]+))?/g
  let match

  while ((match = recommendationPattern.exec(response)) !== null) {
    const [, title, description, priority, projectedImpact, projectedROI, implementationSteps] = match
    
    // Parse implementation steps (comma-separated)
    const steps = implementationSteps 
      ? implementationSteps.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : undefined
    
    recommendations.push({
      title: title.trim(),
      description: description.trim(),
      priority: (priority.trim().toLowerCase() as 'high' | 'medium' | 'low') || 'medium',
      projected_impact: projectedImpact.trim() || undefined,
      projected_roi: projectedROI?.trim() || undefined,
      implementation_steps: steps,
    })
  }

  return recommendations
}

// Save recommendations generated from chatbot conversations
async function saveRecommendationsFromChat(
  userId: string,
  recommendations: Array<{
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
    projected_impact?: string
    projected_roi?: string
    implementation_steps?: string[]
  }>
) {
  try {
    const recommendationsToInsert = recommendations.map(rec => ({
      user_id: userId,
      title: rec.title,
      description: rec.description,
      action_type: 'chatbot_generated',
      priority: rec.priority,
      status: 'pending',
      projected_impact: rec.projected_impact || null,
      projected_roi: rec.projected_roi || null,
      implementation_steps: rec.implementation_steps || null,
    }))

    const { error } = await supabase
      .from('recommendations')
      .insert(recommendationsToInsert)

    if (error) {
      console.error('Error saving recommendations from chat:', error)
    } else {
      // Track decisions usage (each recommendation counts as a decision)
      await updateUsageTracking(userId, recommendations.length, 0)
    }
  } catch (error) {
    console.error('Error saving recommendations from chat:', error)
  }
}

// Update usage tracking for decisions and tokens
async function updateUsageTracking(userId: string, decisionsIncrement: number, tokensIncrement: number) {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Fetch or create usage tracking for current month
    const { data: existingUsage } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', userId)
      .eq('period_start', startOfMonth.toISOString().split('T')[0])
      .single()

    if (existingUsage) {
      // Update existing usage
      await supabase
        .from('usage_tracking')
        .update({
          decisions_count: (existingUsage.decisions_count || 0) + decisionsIncrement,
          tokens_used: (existingUsage.tokens_used || 0) + tokensIncrement,
        })
        .eq('id', existingUsage.id)
    } else {
      // Create new usage record
      await supabase
        .from('usage_tracking')
        .insert({
          user_id: userId,
          period_start: startOfMonth.toISOString().split('T')[0],
          period_end: endOfMonth.toISOString().split('T')[0],
          decisions_count: decisionsIncrement,
          tokens_used: tokensIncrement,
          connections_count: 0,
        })
    }
  } catch (error) {
    console.error('Error updating usage tracking:', error)
    // Don't fail the request if usage tracking fails
  }
}

// Build context from connected data sources
async function buildConnectedDataContext(connections: any[]): Promise<string> {
  if (!connections || connections.length === 0) {
    return 'No data sources connected.'
  }

  // Use service role to access analytics data (bypasses RLS)
  const { createClient } = await import('@supabase/supabase-js')
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let context = 'Connected Data Sources and Metrics:\n\n'
  
  for (const connection of connections) {
    const type = connection.connection_type
    const name = connection.connection_name || type
    const config = connection.connection_config || {}
    const lastSync = connection.last_sync_at ? new Date(connection.last_sync_at).toLocaleDateString() : 'Never'
    
    context += `**${name}** (${type}):\n`
    context += `- Last synced: ${lastSync}\n`
    
    // Format data based on connection type
    switch (type) {
      case 'google_analytics':
        const propertyId = config.propertyId || config.property_id
        if (propertyId) {
          context += `- Property ID: ${propertyId}\n`
          
          // Fetch actual analytics data using service role (to bypass RLS)
          const { data: analyticsData, error: analyticsError } = await supabaseAdmin
            .from('analytics_data')
            .select('data, synced_at')
            .eq('user_id', connection.user_id || '')
            .eq('connection_id', connection.id)
            .order('synced_at', { ascending: false })
            .limit(1)
            .maybeSingle()

          if (analyticsData && analyticsData.data) {
            const data = analyticsData.data
            const summary = data.summary || {}
            const syncedDate = analyticsData.synced_at ? new Date(analyticsData.synced_at).toLocaleDateString() : 'Unknown'
            
            context += `- Data Last Synced: ${syncedDate}\n`
            context += `\n📊 Current Metrics (Last 30 Days):\n`
            context += `- Active Users: ${summary.activeUsers?.toLocaleString() || 0}\n`
            context += `- Total Sessions: ${summary.sessions?.toLocaleString() || 0}\n`
            context += `- Total Pageviews: ${summary.pageviews?.toLocaleString() || 0}\n`
            context += `- Average Session Duration: ${summary.averageSessionDuration ? Math.round(summary.averageSessionDuration) + ' seconds' : 'N/A'}\n`
            context += `- Bounce Rate: ${summary.bounceRate ? (summary.bounceRate * 100).toFixed(1) + '%' : 'N/A'}\n`
            context += `- Total Conversions: ${summary.conversions?.toLocaleString() || 0}\n`
            context += `- Total Revenue: ${summary.totalRevenue ? '$' + summary.totalRevenue.toLocaleString() : '$0'}\n`
            context += `- Total Events: ${summary.eventCount?.toLocaleString() || 0}\n`
            
            if (data.topCountries && data.topCountries.length > 0) {
              context += `\n🌍 Top Countries by Users:\n`
              data.topCountries.slice(0, 5).forEach((c: any, idx: number) => {
                context += `  ${idx + 1}. ${c.country}: ${c.users.toLocaleString()} users\n`
              })
            }
            
            if (data.deviceBreakdown && data.deviceBreakdown.length > 0) {
              context += `\n📱 Device Breakdown:\n`
              data.deviceBreakdown.forEach((d: any) => {
                context += `  - ${d.device}: ${d.percentage.toFixed(1)}% (${d.users.toLocaleString()} users)\n`
              })
            }
            
            if (data.topSources && data.topSources.length > 0) {
              context += `\n🔗 Top Traffic Sources:\n`
              data.topSources.slice(0, 5).forEach((s: any, idx: number) => {
                context += `  ${idx + 1}. ${s.source}: ${s.sessions.toLocaleString()} sessions\n`
              })
            }
            
            if (data.dailyData && data.dailyData.length > 0) {
              const recentDays = data.dailyData.slice(-7) // Last 7 days
              const avgDailyUsers = Math.round(recentDays.reduce((sum: number, day: any) => sum + (day.users || 0), 0) / recentDays.length)
              const avgDailySessions = Math.round(recentDays.reduce((sum: number, day: any) => sum + (day.sessions || 0), 0) / recentDays.length)
              context += `\n📈 Recent Trends (Last 7 Days Average):\n`
              context += `- Average Daily Users: ${avgDailyUsers.toLocaleString()}\n`
              context += `- Average Daily Sessions: ${avgDailySessions.toLocaleString()}\n`
            }
            
            context += `\n💡 Note: All metrics above are from the client's actual Google Analytics data. You can answer specific questions about their traffic, user behavior, conversions, top pages, traffic sources, geographic data, device usage, trends, and any other analytics metrics. Use the exact numbers provided above when answering questions.\n`
          } else {
            if (analyticsError) {
              console.error('Error fetching analytics data for chatbot:', analyticsError)
            }
            context += `- Status: Data sync in progress or not yet available\n`
            context += `- Note: Analytics data is being synced. Once available, I'll be able to answer questions about your website traffic, user behavior, conversions, and other metrics.\n`
          }
        }
        break
        
      case 'google_ads':
        const accountId = config.account_id || config.customer_id
        if (accountId) {
          context += `- Account ID: ${accountId}\n`
          context += `- Note: Google Ads data is available. Ask me about your ad performance, ROAS, CPC, CTR, or campaign optimization.\n`
        }
        break
        
      case 'instagram_ads':
        const adAccountId = config.account_id || config.selected_account_id
        if (adAccountId) {
          context += `- Ad Account ID: ${adAccountId}\n`
          context += `- Note: Instagram Ads data is available. Ask me about your ad spend, ROAS, impressions, clicks, or campaign performance.\n`
        }
        break
        
      case 'instagram_page':
        const instagramId = config.instagram_business_account_id
        const username = config.username
        if (instagramId) {
          context += `- Instagram Account: ${username || instagramId}\n`
          context += `- Note: Instagram Page data is available. Ask me about your follower growth, engagement rates, post performance, or content strategy.\n`
        }
        break
        
      case 'shopify':
        const shopName = config.shop_name || config.shop
        if (shopName) {
          context += `- Shop: ${shopName}\n`
          context += `- Note: Shopify data is available. Ask me about your sales, products, inventory, or customer behavior.\n`
        }
        break
        
      default:
        context += `- Connected and ready for analysis\n`
    }
    
    context += '\n'
  }
  
  return context
}

function buildRecommendationContext(recommendations: Recommendation[]): string {
  if (recommendations.length === 0) {
    return 'No recommendations are currently available.'
  }

  let context = 'Current business recommendations:\n\n'
  
  recommendations.forEach((rec, index) => {
    context += `${index + 1}. **${rec.title}**\n`
    context += `   - Type: ${rec.recommendation_type}\n`
    context += `   - Priority: ${rec.priority}\n`
    if (rec.projected_impact) {
      context += `   - Projected Impact: ${rec.projected_impact}\n`
    }
    if (rec.projected_roi) {
      context += `   - Projected ROI: ${rec.projected_roi}\n`
    }
    if (rec.description) {
      context += `   - Description: ${rec.description}\n`
    }
    if (rec.implementation_steps && rec.implementation_steps.length > 0) {
      context += `   - Implementation Steps: ${rec.implementation_steps.join(', ')}\n`
    }
    context += `   - Status: ${rec.status}\n\n`
  })

  return context
}

async function callOpenAI(messages: any[], recommendationContext: string, dataContext: string, hasConnections: boolean): Promise<{ response: string; tokensUsed: number }> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  const systemPrompt = `You are an AI business advisor for mySmartly, an AI-powered business decision platform. Your role is to help users understand their business data and generate actionable recommendations FROM CONVERSATIONS.

CRITICAL RULES - YOU MUST FOLLOW THESE STRICTLY:
1. **ONLY USE PROVIDED DATA**: Answer questions about the user's connected data sources using ONLY the information provided in the "Connected Data Sources" section below. Use the EXACT numbers and metrics from their data. DO NOT make up, guess, or assume any data that is not explicitly provided.

2. **NO GUESSWORK**: If the user asks about data that is not in the "Connected Data Sources" section, you must say "I don't have that information in your connected data. Please connect that data source or ask about metrics I can see in your connected data." DO NOT invent numbers or metrics.

3. **DATA-DRIVEN RECOMMENDATIONS**: When a user asks a question about their business, analyze their connected data and generate 1-3 actionable, specific recommendations based ONLY on their actual metrics and data patterns shown in the "Connected Data Sources" section.

4. **RECOMMENDATION FORMAT**: Format recommendations in this EXACT format (one per line, use ||| as separator):
   RECOMMENDATION|||Title|||Description|||Priority (high/medium/low)|||Projected Impact|||Projected ROI|||Implementation Steps (comma-separated)
   
   Example (using actual data from Connected Data Sources):
   RECOMMENDATION|||Increase Ad Budget by 15%|||Based on your current ROAS of 3.2x and stable performance, increasing your ad budget by 15% could drive additional revenue. Your current spend is $5,000/month with $16,000 in revenue.|||high|||+$18,750 revenue|||+375% ROI|||Review current campaign performance, Identify top-performing ad sets, Increase budget by 15% on best performers, Monitor results weekly
   RECOMMENDATION|||Optimize Landing Pages|||Your bounce rate is 45% and conversion rate is 2.1%. Focusing on improving your top 3 landing pages could significantly increase conversions.|||medium|||15-25% increase in conversions|||+200% ROI|||Analyze top landing pages, A/B test headlines and CTAs, Improve page load speed, Add trust signals

5. **RECOMMENDATIONS MUST BE**:
   - Based ONLY on actual data from their connected sources (use specific numbers from the Connected Data Sources section)
   - Actionable and specific (not generic advice)
   - Include realistic projected impact and ROI based on their actual metrics
   - Include clear implementation steps
   - Prioritized based on potential impact and ease of implementation

6. **WHEN ANSWERING QUESTIONS**:
   - Reference specific metrics from their data (e.g., "Your bounce rate is 45%" - only if this number is in the Connected Data Sources)
   - If a metric is not available, say "I don't have that specific metric in your connected data"
   - Explain what the data means in business terms
   - Provide context and insights, not just numbers
   - Be conversational and helpful
   - Always end with a helpful summary

7. **NO DATA INVENTORY**: If the "Connected Data Sources" section says "No data sources connected" or shows no actual metrics, you must tell the user to connect their data sources. DO NOT make up recommendations or metrics.

8. Generate recommendations AFTER meaningful conversations - when the user has asked questions that reveal their business needs or challenges, and ONLY if you have relevant data to base recommendations on.

Current Recommendations Context:
${recommendationContext}

Connected Data Sources:
${dataContext}

REMEMBER: 
- Use ONLY the connected data sources information to answer questions about the user's business metrics
- DO NOT make up, guess, or assume any data not explicitly provided
- If data is missing, tell the user what data you need
- Generate practical, actionable recommendations based ONLY on the user's actual data
- Format recommendations using the RECOMMENDATION||| format above
- Be conversational and helpful, explaining data insights in plain language`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini', // Using cost-effective model, can be changed to gpt-4 or gpt-3.5-turbo
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${error}`)
  }

  const data = await response.json()
  const responseText = data.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'
  const tokensUsed = data.usage?.total_tokens || 500 // Get actual token usage from API response
  
  return { response: responseText, tokensUsed }
}

async function callClaude(messages: any[], recommendationContext: string, dataContext: string, hasConnections: boolean): Promise<{ response: string; tokensUsed: number }> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured')
  }

  const systemPrompt = `You are an AI business advisor for mySmartly, an AI-powered business decision platform. Your role is to help users understand their business data and generate actionable recommendations.

CRITICAL RULES:
1. Answer questions about the user's connected data sources using the information provided in the "Connected Data Sources" section below.
2. If recommendations exist in the context, explain them clearly and help users understand them.
3. If no recommendations exist but the user asks a question, generate actionable recommendations based on their connected data sources and question.
4. When generating recommendations, format them clearly with:
   - Title (actionable recommendation)
   - Description (why this matters)
   - Projected impact (if applicable)
   - Implementation guidance
5. Be proactive and helpful. Ask clarifying questions if needed.
6. Base recommendations on the connected data sources.

Current Recommendations Context:
${recommendationContext}

Connected Data Sources:
${dataContext}

Remember: 
- Use the connected data sources information to answer questions about the user's business metrics
- Generate practical, actionable recommendations based on the user's question and their connected data
- Be conversational and helpful, explaining data insights in plain language`

  // Get the last user message
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()
  const userMessage = lastUserMessage?.content || ''

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022', // or claude-3-opus-20240229 for better quality
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userMessage },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Anthropic API error: ${error}`)
  }

  const data = await response.json()
  return data.content[0]?.text || 'I apologize, but I could not generate a response.'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, userId } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Fetch user's recommendations to provide as context
    const recommendations = await getRecommendationsForUser(userId)
    
    // Fetch connected data sources with their actual data
    const { data: connections } = await supabase
      .from('data_connections')
      .select('id, connection_type, connection_name, connection_config, last_sync_at')
      .eq('user_id', userId)
      .eq('status', 'connected')

    const hasConnections = !!(connections && connections.length > 0)
    const hasRecommendations = !!(recommendations && recommendations.length > 0)
    
    // Fetch and format actual data from connected sources
    const connectedDataContext = await buildConnectedDataContext(connections || [])

    // If no data sources connected and no recommendations, inform user
    if (!hasConnections && !hasRecommendations) {
      return NextResponse.json({
        response: 'I can only provide insights based on your connected data sources and recommendations. Please connect your data sources (like Google Ads, Instagram Ads, Shopify, etc.) in the Data Connections section of your dashboard. Once you have connected data and recommendations are generated, I\'ll be able to help you understand them and answer your questions.',
        recommendationsCount: 0
      })
    }

    // Allow conversations even without recommendations - chatbot can answer questions about connected data
    // Continue to process the request and let the chatbot handle the conversation

    const recommendationContext = buildRecommendationContext(recommendations)
    const dataContext = connectedDataContext

    // Use OpenAI (ChatGPT) - primary LLM
    let response: string
    
    // Count tokens: Each message the client sends = 1 token
    // Get the last user message (the one they just sent)
    const userMessages = messages.filter(m => m.role === 'user')
    const tokensToCount = userMessages.length // Count each user message as 1 token
    
    try {
      let result: { response: string; tokensUsed: number }
      
      if (OPENAI_API_KEY) {
        result = await callOpenAI(messages, recommendationContext, dataContext, hasConnections)
        response = result.response
        
        // Track tokens: Count 1 token per message sent (not API tokens)
        await updateUsageTracking(userId, 0, tokensToCount)
        
      } else if (ANTHROPIC_API_KEY) {
        // Fallback to Claude only if OpenAI is not available
        result = await callClaude(messages, recommendationContext, dataContext, hasConnections)
        response = result.response
        
        // Track tokens: Count 1 token per message sent (not API tokens)
        await updateUsageTracking(userId, 0, tokensToCount)
      } else {
        return NextResponse.json(
          { error: 'No LLM API key configured. Please set OPENAI_API_KEY in environment variables.' },
          { status: 500 }
        )
      }
    } catch (apiError: any) {
      console.error('LLM API call failed:', apiError)
      
      // Provide helpful error messages
      const errorMessage = apiError.message || 'Unknown error'
      
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized') || errorMessage.includes('Invalid API key')) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your OPENAI_API_KEY or ANTHROPIC_API_KEY.' },
          { status: 401 }
        )
      }
      if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
        return NextResponse.json(
          { error: 'API rate limit exceeded. Please try again in a moment.' },
          { status: 429 }
        )
      }
      if (errorMessage.includes('not configured') || errorMessage.includes('OPENAI_API_KEY') || errorMessage.includes('ANTHROPIC_API_KEY')) {
        return NextResponse.json(
          { error: 'No LLM API key configured. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY in environment variables.' },
          { status: 500 }
        )
      }
      
      // Return a more descriptive error message
      return NextResponse.json(
        { error: `AI service error: ${errorMessage}` },
        { status: 500 }
      )
    }

    // Extract recommendations from the response if any
    const extractedRecommendations = extractRecommendationsFromResponse(response)
    
    // Save recommendations to database if any were generated
    let newRecommendationsCount = 0
    if (extractedRecommendations.length > 0) {
      await saveRecommendationsFromChat(userId, extractedRecommendations)
      newRecommendationsCount = extractedRecommendations.length
    }

    return NextResponse.json({ 
      response,
      recommendationsCount: recommendations.length + extractedRecommendations.length,
      newRecommendations: extractedRecommendations.length
    })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process chat request' },
      { status: 500 }
    )
  }
}

