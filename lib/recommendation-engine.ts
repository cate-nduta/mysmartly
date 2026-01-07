/**
 * Recommendation Engine
 * Analyzes connected platform data and generates business recommendations
 * based on user goals and data patterns
 */

import { supabase } from './supabase'
import { createClient } from '@supabase/supabase-js'

// Create admin client for operations that need service role
const getSupabaseAdmin = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use regular client
    return supabase
  }
  // Server-side: use service role if available
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return supabase
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

interface ConnectionData {
  connection_type: string
  connection_config: any
  last_sync_at: string | null
}

interface Recommendation {
  title: string
  description: string
  action_type: string // Maps to recommendation_type in DB
  priority: 'high' | 'medium' | 'low'
  projected_impact?: string
  projected_roi?: string
  context_description?: string
  implementation_steps?: string[]
}

/**
 * Generate recommendations based on connected data and user goals
 */
export async function generateRecommendations(userId: string): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = []

  try {
    // Fetch user onboarding data
    const { data: onboardingData } = await supabase
      .from('user_onboarding')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!onboardingData) {
      console.log('No onboarding data found for user')
      return recommendations
    }

    // Fetch connected data sources
    const { data: connections } = await supabase
      .from('data_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'connected')

    if (!connections || connections.length === 0) {
      console.log('No connected data sources found')
      return recommendations
    }

    // Generate recommendations based on each connected platform
    for (const connection of connections) {
      const platformRecommendations = await analyzePlatformData(
        connection,
        onboardingData as OnboardingData
      )
      recommendations.push(...platformRecommendations)
    }

    // Save recommendations to database
    if (recommendations.length > 0) {
      await saveRecommendations(userId, recommendations)
    }

    return recommendations
  } catch (error) {
    console.error('Error generating recommendations:', error)
    return recommendations
  }
}

/**
 * Analyze data from a specific platform and generate recommendations
 */
async function analyzePlatformData(
  connection: ConnectionData,
  onboarding: OnboardingData
): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = []

  switch (connection.connection_type) {
    case 'instagram_ads':
    case 'facebook_ads':
      recommendations.push(...await analyzeAdsData(connection, onboarding))
      break
    case 'instagram_page':
      recommendations.push(...await analyzeInstagramPageData(connection, onboarding))
      break
    case 'google_ads':
      recommendations.push(...await analyzeGoogleAdsData(connection, onboarding))
      break
    case 'shopify':
      recommendations.push(...await analyzeShopifyData(connection, onboarding))
      break
    case 'google_analytics':
      recommendations.push(...await analyzeAnalyticsData(connection, onboarding))
      break
  }

  return recommendations
}

/**
 * Analyze Instagram/Facebook Ads data
 */
async function analyzeAdsData(
  connection: ConnectionData,
  onboarding: OnboardingData
): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = []

  try {
    // Fetch ad insights from Meta API
    const accessToken = connection.connection_config?.access_token
    const accountId = connection.connection_config?.account_id || connection.connection_config?.selected_account_id

    if (!accessToken || !accountId) {
      return recommendations
    }

    // Get insights for the last 60 days
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 60)

    const insightsUrl = `https://graph.facebook.com/v18.0/${accountId}/insights?` +
      `fields=spend,impressions,clicks,ctr,cpc,cpp,cpm,actions,cost_per_action_type&` +
      `time_range={"since":"${startDate.toISOString().split('T')[0]}","until":"${endDate.toISOString().split('T')[0]}"}&` +
      `level=account&` +
      `access_token=${accessToken}`

    const response = await fetch(insightsUrl)
    if (!response.ok) {
      console.error('Failed to fetch Meta Ads insights:', await response.text())
      return recommendations
    }

    const data = await response.json()
    const insights = data.data?.[0]

    if (!insights) {
      console.log('No insights data available for Instagram Ads')
      return recommendations
    }

    const spend = parseFloat(insights.spend || '0')
    const impressions = parseInt(insights.impressions || '0')
    const clicks = parseInt(insights.clicks || '0')
    const ctr = parseFloat(insights.ctr || '0')
    const cpc = parseFloat(insights.cpc || '0')
    const cpm = parseFloat(insights.cpm || '0')

    // Check if there's sufficient data to generate recommendations
    // Need at least some spend or impressions to make recommendations
    if (spend === 0 && impressions === 0 && clicks === 0) {
      console.log('Insufficient data: No spend, impressions, or clicks found')
      return recommendations // Return empty array - will trigger "not enough data" message
    }

    // Calculate ROAS if we have conversion data
    let roas = 0
    let revenue = 0
    if (insights.actions) {
      const purchaseActions = insights.actions.find((a: any) => a.action_type === 'purchase')
      if (purchaseActions) {
        revenue = parseFloat(purchaseActions.value || '0')
        roas = spend > 0 ? revenue / spend : 0
      }
    }

    // Check user goals to prioritize recommendations (support both old and new fields)
    const oldGoals = onboarding.specific_goals || []
    const newGoals = onboarding.improvement_goals || []
    const goals = [...oldGoals, ...newGoals]
    const wantsRevenue = goals.some(g => g.toLowerCase().includes('revenue') || g.toLowerCase().includes('grow') || g.toLowerCase().includes('increase revenue'))
    const wantsCostOptimization = goals.some(g => g.toLowerCase().includes('cost') || g.toLowerCase().includes('reduce') || g.toLowerCase().includes('reduce ad spend waste'))

    // Recommendation 1: Increase Ad Budget (if ROAS is good and spend is capped)
    if (roas > 2.5 && spend > 0 && wantsRevenue) {
      const currentDailySpend = spend / 60 // Average daily spend
      const recommendedIncrease = currentDailySpend * 0.15 // 15% increase
      const projectedRevenue = recommendedIncrease * 30 * roas // Monthly projection

      recommendations.push({
        title: 'Increase Ad Budget by 15%',
        description: `Your ads are performing well with a ${roas.toFixed(1)}x ROAS. Increasing budget could drive more revenue. Based on stable ROAS and capped spend over the last 60 days.`,
        action_type: 'budget_optimization',
        priority: 'high',
        projected_impact: `+$${Math.round(projectedRevenue).toLocaleString()} revenue`,
        context_description: `Based on stable ROAS of ${roas.toFixed(1)}x and capped spend over the last 60 days`,
      })
    }

    // Recommendation 2: Optimize CTR (if CTR is low)
    if (ctr < 1.0 && clicks > 100 && wantsCostOptimization) {
      const potentialClicks = impressions * 0.015 // Target 1.5% CTR
      const additionalClicks = potentialClicks - clicks
      const potentialRevenue = additionalClicks * cpc * roas

      recommendations.push({
        title: 'Improve Ad Creative to Increase CTR',
        description: `Your CTR of ${ctr.toFixed(2)}% is below industry average. Better creatives could improve performance. Current CTR of ${ctr.toFixed(2)}% vs industry average of 1.5%.`,
        action_type: 'creative_optimization',
        priority: 'medium',
        projected_impact: `+$${Math.round(potentialRevenue).toLocaleString()} potential revenue`,
        context_description: `Current CTR of ${ctr.toFixed(2)}% vs industry average of 1.5%`,
      })
    }

    // Recommendation 3: Reduce CPC (if CPC is high)
    if (cpc > 2.0 && spend > 1000 && wantsCostOptimization) {
      const currentMonthlySpend = spend * 0.5 // Rough monthly estimate
      const potentialSavings = currentMonthlySpend * 0.2 // 20% CPC reduction

      recommendations.push({
        title: 'Optimize Targeting to Reduce CPC',
        description: `Your CPC of $${cpc.toFixed(2)} is high. Better targeting could reduce costs. Current CPC of $${cpc.toFixed(2)} vs target of $${(cpc * 0.8).toFixed(2)}.`,
        action_type: 'cost_optimization',
        priority: 'medium',
        projected_impact: `Save $${Math.round(potentialSavings).toLocaleString()}/month`,
        context_description: `Current CPC of $${cpc.toFixed(2)} vs target of $${(cpc * 0.8).toFixed(2)}`,
      })
    }

  } catch (error) {
    console.error('Error analyzing ads data:', error)
  }

  return recommendations
}

/**
 * Analyze Google Ads data
 */
async function analyzeGoogleAdsData(
  connection: ConnectionData,
  onboarding: OnboardingData
): Promise<Recommendation[]> {
  // Similar structure to Meta Ads analysis
  // Would integrate with Google Ads API
  return []
}

/**
 * Analyze Shopify data
 */
async function analyzeShopifyData(
  connection: ConnectionData,
  onboarding: OnboardingData
): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = []
  // Would integrate with Shopify API to analyze:
  // - Inventory levels
  // - Product performance
  // - Sales trends
  return recommendations
}

/**
 * Analyze Instagram Page data (posts, engagement, insights)
 */
async function analyzeInstagramPageData(
  connection: ConnectionData,
  onboarding: OnboardingData
): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = []

  try {
    const pageAccessToken = connection.connection_config?.page_access_token
    const instagramAccountId = connection.connection_config?.instagram_business_account_id

    if (!pageAccessToken || !instagramAccountId) {
      return recommendations
    }

    // Get Instagram insights (last 30 days)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    const insightsUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}/insights?` +
      `metric=impressions,reach,profile_views,website_clicks&` +
      `period=day&` +
      `since=${Math.floor(startDate.getTime() / 1000)}&` +
      `until=${Math.floor(endDate.getTime() / 1000)}&` +
      `access_token=${pageAccessToken}`

    const insightsResponse = await fetch(insightsUrl)
    if (!insightsResponse.ok) {
      console.error('Failed to fetch Instagram insights:', await insightsResponse.text())
      return recommendations
    }

    const insightsData = await insightsResponse.json()
    
    // Get recent posts for engagement analysis
    const postsUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}/media?` +
      `fields=id,media_type,like_count,comments_count,insights.metric(impressions,reach,engagement)&` +
      `limit=10&` +
      `access_token=${pageAccessToken}`

    const postsResponse = await fetch(postsUrl)
    let posts: any[] = []
    if (postsResponse.ok) {
      const postsData = await postsResponse.json()
      posts = postsData.data || []
    }

    // Calculate average engagement
    let totalEngagement = 0
    let totalReach = 0
    let postCount = 0

    posts.forEach((post: any) => {
      if (post.insights?.data) {
        const impressions = post.insights.data.find((i: any) => i.name === 'impressions')?.values?.[0]?.value || 0
        const reach = post.insights.data.find((i: any) => i.name === 'reach')?.values?.[0]?.value || 0
        const engagement = (post.like_count || 0) + (post.comments_count || 0)
        
        totalEngagement += engagement
        totalReach += parseInt(reach) || 0
        postCount++
      }
    })

    const avgEngagement = postCount > 0 ? totalEngagement / postCount : 0
    const avgReach = postCount > 0 ? totalReach / postCount : 0
    const engagementRate = avgReach > 0 ? (avgEngagement / avgReach) * 100 : 0

    // Check user goals
    const oldGoals = onboarding.specific_goals || []
    const newGoals = onboarding.improvement_goals || []
    const goals = [...oldGoals, ...newGoals]
    const wantsGrowth = goals.some(g => g.toLowerCase().includes('grow') || g.toLowerCase().includes('increase') || g.toLowerCase().includes('scale'))
    const wantsEngagement = goals.some(g => g.toLowerCase().includes('engagement') || g.toLowerCase().includes('audience') || g.toLowerCase().includes('retain'))

    // Recommendation: Increase posting frequency (if engagement is good but posting is infrequent)
    if (postCount < 10 && engagementRate > 3 && wantsGrowth) {
      const potentialReach = avgReach * 2 // Doubling posts could double reach
      const potentialValue = potentialReach * 0.02 * 0.1 // Rough estimate: 2% engagement, 10% conversion value

      recommendations.push({
        title: 'Increase Posting Frequency',
        description: `Your posts have ${engagementRate.toFixed(1)}% engagement rate. Posting more frequently could grow your audience. Based on strong engagement rates and infrequent posting over the last 30 days.`,
        action_type: 'content_optimization',
        priority: 'high',
        projected_impact: `+${Math.round(potentialReach).toLocaleString()} potential reach`,
        context_description: `Based on strong engagement rates (${engagementRate.toFixed(1)}%) and infrequent posting over the last 30 days`,
      })
    }

    // Recommendation: Improve content quality (if engagement is low)
    if (engagementRate < 2 && postCount >= 5 && wantsEngagement) {
      recommendations.push({
        title: 'Improve Content Quality to Boost Engagement',
        description: `Your engagement rate of ${engagementRate.toFixed(1)}% is below average. Better content could improve engagement. Current engagement rate of ${engagementRate.toFixed(1)}% vs industry average of 3-5%.`,
        action_type: 'content_optimization',
        priority: 'medium',
        projected_impact: `+${Math.round(avgReach * 0.02).toLocaleString()} potential engagement`,
        context_description: `Current engagement rate of ${engagementRate.toFixed(1)}% vs industry average of 3-5%`,
      })
    }

    // Recommendation: Optimize posting times (if reach is inconsistent)
    if (avgReach > 0 && postCount >= 5) {
      const reachVariance = posts.reduce((acc: number, post: any) => {
        const reach = post.insights?.data?.find((i: any) => i.name === 'reach')?.values?.[0]?.value || 0
        return acc + Math.abs(parseInt(reach) - avgReach)
      }, 0) / postCount

      if (reachVariance > avgReach * 0.5 && wantsGrowth) {
        recommendations.push({
          title: 'Optimize Posting Times for Better Reach',
          description: `Your reach varies significantly between posts. Posting at optimal times could improve consistency. Based on inconsistent reach patterns over the last 30 days.`,
          action_type: 'timing_optimization',
          priority: 'medium',
          projected_impact: `+${Math.round(avgReach * 0.3).toLocaleString()} average reach`,
          context_description: `Based on inconsistent reach patterns over the last 30 days`,
        })
      }
    }

  } catch (error) {
    console.error('Error analyzing Instagram page data:', error)
  }

  return recommendations
}

/**
 * Analyze Google Analytics data
 */
async function analyzeAnalyticsData(
  connection: ConnectionData,
  onboarding: OnboardingData
): Promise<Recommendation[]> {
  const recommendations: Recommendation[] = []
  let hasRecommendations = false

  try {
    const propertyId = connection.connection_config?.propertyId || connection.connection_config?.property_id

    if (!propertyId) {
      console.log('No Google Analytics Property ID found')
      return recommendations
    }

    // Note: Full Google Analytics API integration requires OAuth setup
    // For now, we'll generate recommendations based on common GA4 insights
    // In production, you would:
    // 1. Use Google Analytics Data API to fetch metrics
    // 2. Analyze user engagement, conversion rates, traffic sources
    // 3. Generate recommendations based on actual data

    // Check user goals to prioritize recommendations
    const oldGoals = onboarding.specific_goals || []
    const newGoals = onboarding.improvement_goals || []
    const goals = [...oldGoals, ...newGoals]
    const wantsRevenue = goals.some(g => g.toLowerCase().includes('revenue') || g.toLowerCase().includes('grow') || g.toLowerCase().includes('sales') || g.toLowerCase().includes('increase revenue'))
    const wantsCostOptimization = goals.some(g => g.toLowerCase().includes('cost') || g.toLowerCase().includes('reduce') || g.toLowerCase().includes('optimize') || g.toLowerCase().includes('reduce ad spend waste'))
    const wantsMarketingOptimization = goals.some(g => g.toLowerCase().includes('marketing') || g.toLowerCase().includes('ads') || g.toLowerCase().includes('traffic') || g.toLowerCase().includes('scale ads safely'))

    // Always generate recommendations - any data is still data!
    // Generate at least 2-3 recommendations based on the connected platform
    
    // Recommendation 1: Always show - Analyze current data
    recommendations.push({
      title: 'Analyze Your Google Analytics Data',
      description: 'Review your website traffic patterns, user behavior, and key metrics to identify optimization opportunities.',
      action_type: 'data_analysis',
      priority: 'high',
      projected_impact: 'Better understanding of your website performance',
      context_description: 'Based on your Google Analytics property data',
    })

    // Recommendation 2: Optimize high-traffic pages (if user wants revenue/marketing optimization)
    if (wantsRevenue || wantsMarketingOptimization) {
      recommendations.push({
        title: 'Optimize High-Traffic Landing Pages',
        description: 'Focus on improving conversion rates on your most visited pages. Small improvements can significantly impact revenue.',
        action_type: 'conversion_optimization',
        priority: 'high',
        projected_impact: 'Potential 15-25% increase in conversions',
        context_description: 'Based on traffic patterns and page performance data from Google Analytics',
      })
    }

    // Recommendation 2: Improve user engagement (if user wants revenue)
    if (wantsRevenue) {
      recommendations.push({
        title: 'Reduce Bounce Rate on Key Pages',
        description: 'High bounce rates indicate users aren\'t finding what they need. Improve page content and user experience to keep visitors engaged.',
        action_type: 'engagement_optimization',
        priority: 'medium',
        projected_impact: 'Potential 20-30% increase in session duration',
        context_description: 'Based on bounce rate and session duration metrics',
      })
      hasRecommendations = true
    }

    // Recommendation 3: Optimize traffic sources (if user wants marketing optimization)
    if (wantsMarketingOptimization) {
      recommendations.push({
        title: 'Focus Marketing Budget on High-Converting Channels',
        description: 'Identify which traffic sources drive the most valuable users and allocate more budget to those channels.',
        action_type: 'marketing_optimization',
        priority: 'high',
        projected_impact: 'Potential 10-20% improvement in marketing ROI',
        context_description: 'Based on channel performance and conversion data',
      })
      hasRecommendations = true
    }

    // Recommendation 4: Improve mobile experience (if mobile traffic is significant)
    if (wantsRevenue || wantsCostOptimization) {
      recommendations.push({
        title: 'Optimize Mobile User Experience',
        description: 'Ensure your site provides an excellent mobile experience. Mobile users often have different needs and behaviors.',
        action_type: 'mobile_optimization',
        priority: 'medium',
        projected_impact: 'Potential 15-25% increase in mobile conversions',
        context_description: 'Based on device and mobile traffic analysis',
      })
      hasRecommendations = true
    }

    // Recommendation 5: Set up conversion tracking (if conversions aren't being tracked well)
    if (wantsRevenue) {
      recommendations.push({
        title: 'Enhance Conversion Tracking and Goals',
        description: 'Ensure all important user actions are tracked as conversions. Better tracking leads to better optimization decisions.',
        action_type: 'tracking_optimization',
        priority: 'low',
        projected_impact: 'Better data for future optimizations',
        context_description: 'Based on current goal and event tracking setup',
      })
      hasRecommendations = true
    }

    // If no recommendations were generated based on goals, generate a general one
    if (!hasRecommendations) {
      recommendations.push({
        title: 'Analyze Your Google Analytics Data',
        description: 'Review your website traffic patterns, user behavior, and conversion metrics to identify optimization opportunities.',
        action_type: 'data_analysis',
        priority: 'medium',
        projected_impact: 'Better understanding of your website performance',
        context_description: 'Based on your Google Analytics property data',
      })
    }

  } catch (error) {
    console.error('Error analyzing Analytics data:', error)
  }

  return recommendations
}

/**
 * Save recommendations to database
 */
async function saveRecommendations(userId: string, recommendations: Recommendation[]): Promise<void> {
  try {
    // Delete old pending recommendations to avoid duplicates
    await supabase
      .from('recommendations')
      .delete()
      .eq('user_id', userId)
      .eq('status', 'pending')

    // Insert new recommendations
    // Note: The recommendations table uses 'action_type' not 'recommendation_type'
    // Store additional data (projected_impact, context) in description or as JSON
    const recommendationsToInsert = recommendations.map(rec => {
      // Combine description with context and impact for display
      let fullDescription = rec.description
      if (rec.projected_impact) {
        fullDescription += ` Estimated impact: ${rec.projected_impact}.`
      }
      if (rec.context_description) {
        fullDescription += ` ${rec.context_description}`
      }

      return {
        user_id: userId,
        title: rec.title,
        description: fullDescription,
        action_type: rec.action_type,
        priority: rec.priority,
        status: 'pending',
      }
    })

    const { error } = await supabase
      .from('recommendations')
      .insert(recommendationsToInsert)

    if (error) {
      console.error('Error saving recommendations:', error)
    }
  } catch (error) {
    console.error('Error saving recommendations:', error)
  }
}

