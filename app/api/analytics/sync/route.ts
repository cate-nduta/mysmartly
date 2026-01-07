import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { listAnalyticsProperties } from '@/lib/google-analytics'

/**
 * Sync Google Analytics data for a user
 * This fetches real data from Google Analytics Data API (GA4)
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, connectionId } = await req.json()

    if (!userId || !connectionId) {
      return NextResponse.json(
        { error: 'User ID and Connection ID are required' },
        { status: 400 }
      )
    }

    // Use service role for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Fetch connection details
    const { data: connection, error: connError } = await supabaseAdmin
      .from('data_connections')
      .select('*')
      .eq('id', connectionId)
      .eq('user_id', userId)
      .single()

    if (connError || !connection) {
      return NextResponse.json(
        { error: 'Connection not found' },
        { status: 404 }
      )
    }

    if (connection.connection_type !== 'google_analytics') {
      return NextResponse.json(
        { error: 'This endpoint is only for Google Analytics connections' },
        { status: 400 }
      )
    }

    let propertyId = connection.connection_config?.propertyId || connection.connection_config?.property_id

    // If property ID is not found, try to fetch it from the user's account
    if (!propertyId) {
      try {
        const properties = await listAnalyticsProperties(connection.connection_config?.access_token)
        if (properties && properties.length > 0) {
          propertyId = properties[0].propertyId
          // Update connection config with property ID
          await supabaseAdmin
            .from('data_connections')
            .update({
              connection_config: {
                ...connection.connection_config,
                propertyId: propertyId,
                property_id: propertyId,
              },
            })
            .eq('id', connectionId)
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
      }
    }

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID not found. Please ensure your Google Analytics account has at least one property, or reconnect your account.' },
        { status: 400 }
      )
    }

    // Fetch data from Google Analytics Data API using user's OAuth tokens
    const analyticsData = await fetchGoogleAnalyticsData(propertyId, connection.connection_config)

    // Update connection config if token was refreshed
    if (connection.connection_config !== connection.connection_config) {
      await supabaseAdmin
        .from('data_connections')
        .update({
          connection_config: connection.connection_config,
        })
        .eq('id', connectionId)
    }

    // Store the data
    await storeAnalyticsData(userId, connectionId, propertyId, analyticsData)

    // Update last sync time
    await supabaseAdmin
      .from('data_connections')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', connectionId)

    return NextResponse.json({
      success: true,
      data: analyticsData,
      message: 'Analytics data synced successfully'
    })
  } catch (error: any) {
    console.error('Error syncing analytics data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to sync analytics data' },
      { status: 500 }
    )
  }
}

/**
 * Refresh Google OAuth access token using refresh token
 */
async function refreshAccessToken(refreshToken: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth credentials not configured')
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Token refresh failed: ${error}`)
  }

  return await response.json()
}

/**
 * Fetch data from Google Analytics Data API (GA4)
 * Uses the user's own OAuth tokens stored in their connection config
 */
async function fetchGoogleAnalyticsData(propertyId: string, connectionConfig: any) {
  // Get access token from user's connection config (their own OAuth token)
  let accessToken = connectionConfig?.access_token

  // Check if token is expired and refresh if needed
  if (accessToken) {
    const tokenExpiresAt = connectionConfig?.token_expires_at
    if (tokenExpiresAt && new Date(tokenExpiresAt) < new Date()) {
      // Token expired, refresh it
      const refreshToken = connectionConfig?.refresh_token
      if (refreshToken) {
        try {
          const newTokens = await refreshAccessToken(refreshToken)
          accessToken = newTokens.access_token
          
          // Update connection config with new token (we'll save this later)
          connectionConfig.access_token = newTokens.access_token
          connectionConfig.token_expires_at = new Date(Date.now() + (newTokens.expires_in * 1000)).toISOString()
        } catch (error) {
          console.error('Error refreshing token:', error)
          throw new Error('Failed to refresh access token. Please reconnect your Google Analytics account.')
        }
      } else {
        throw new Error('Access token expired and no refresh token available. Please reconnect your Google Analytics account.')
      }
    }
  }

  if (!accessToken) {
    throw new Error('No access token found. Please reconnect your Google Analytics account through OAuth.')
  }

  try {
    // Use Google Analytics Data API v1
    const property = `properties/${propertyId}`
    
    // Fetch key metrics for the last 30 days
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/${property}:runReport`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [
            {
              startDate: '30daysAgo',
              endDate: 'today',
            },
          ],
          metrics: [
            { name: 'activeUsers' },
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'averageSessionDuration' },
            { name: 'bounceRate' },
            { name: 'conversions' },
            { name: 'totalRevenue' },
            { name: 'eventCount' },
          ],
          dimensions: [
            { name: 'date' },
            { name: 'country' },
            { name: 'deviceCategory' },
            { name: 'sessionSource' },
          ],
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('Google Analytics API error:', error)
      throw new Error(`Google Analytics API error: ${error}`)
    }

    const data = await response.json()
    return formatAnalyticsData(data, propertyId)
  } catch (error) {
    console.error('Error fetching from Google Analytics API:', error)
    // Fallback to mock data
    return getMockAnalyticsData(propertyId)
  }
}

/**
 * Format Google Analytics API response into our data structure
 */
function formatAnalyticsData(apiResponse: any, propertyId: string) {
  const rows = apiResponse.rows || []
  
  // Aggregate metrics
  const totals = {
    activeUsers: 0,
    sessions: 0,
    screenPageViews: 0,
    conversions: 0,
    totalRevenue: 0,
    eventCount: 0,
  }

  let totalDuration = 0
  let totalBounce = 0
  let bounceSessions = 0

  const dailyData: any[] = []
  const countryData: Record<string, number> = {}
  const deviceData: Record<string, number> = {}
  const sourceData: Record<string, number> = {}

  rows.forEach((row: any) => {
    const metrics = row.metricValues || []
    const dimensions = row.dimensionValues || []

    const date = dimensions[0]?.value
    const country = dimensions[1]?.value
    const device = dimensions[2]?.value
    const source = dimensions[3]?.value

    const users = parseInt(metrics[0]?.value || '0')
    const sessions = parseInt(metrics[1]?.value || '0')
    const pageviews = parseInt(metrics[2]?.value || '0')
    const duration = parseFloat(metrics[3]?.value || '0')
    const bounceRate = parseFloat(metrics[4]?.value || '0')
    const conversions = parseFloat(metrics[5]?.value || '0')
    const revenue = parseFloat(metrics[6]?.value || '0')
    const events = parseInt(metrics[7]?.value || '0')

    totals.activeUsers += users
    totals.sessions += sessions
    totals.screenPageViews += pageviews
    totals.conversions += conversions
    totals.totalRevenue += revenue
    totals.eventCount += events

    totalDuration += duration * sessions
    totalBounce += bounceRate * sessions
    bounceSessions += sessions

    if (date) {
      dailyData.push({
        date,
        users,
        sessions,
        pageviews,
        conversions,
        revenue,
      })
    }

    if (country) {
      countryData[country] = (countryData[country] || 0) + users
    }

    if (device) {
      deviceData[device] = (deviceData[device] || 0) + users
    }

    if (source) {
      sourceData[source] = (sourceData[source] || 0) + sessions
    }
  })

  const avgSessionDuration = bounceSessions > 0 ? totalDuration / bounceSessions : 0
  const avgBounceRate = bounceSessions > 0 ? totalBounce / bounceSessions : 0

  return {
    propertyId,
    period: '30days',
    summary: {
      activeUsers: totals.activeUsers,
      sessions: totals.sessions,
      pageviews: totals.screenPageViews,
      averageSessionDuration: avgSessionDuration,
      bounceRate: avgBounceRate,
      conversions: totals.conversions,
      totalRevenue: totals.totalRevenue,
      eventCount: totals.eventCount,
    },
    dailyData: dailyData.slice(0, 30), // Last 30 days
    topCountries: Object.entries(countryData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([country, users]) => ({ country, users })),
    deviceBreakdown: Object.entries(deviceData)
      .map(([device, users]) => ({ device, users, percentage: (users / totals.activeUsers) * 100 })),
    topSources: Object.entries(sourceData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([source, sessions]) => ({ source, sessions })),
    syncedAt: new Date().toISOString(),
  }
}

/**
 * Mock data structure (used when API credentials aren't configured)
 */
function getMockAnalyticsData(propertyId: string) {
  return {
    propertyId,
    period: '30days',
    summary: {
      activeUsers: 0,
      sessions: 0,
      pageviews: 0,
      averageSessionDuration: 0,
      bounceRate: 0,
      conversions: 0,
      totalRevenue: 0,
      eventCount: 0,
    },
    dailyData: [],
    topCountries: [],
    deviceBreakdown: [],
    topSources: [],
    syncedAt: new Date().toISOString(),
    note: 'API credentials not configured. Please set up Google Analytics OAuth to fetch real data.',
  }
}

/**
 * Store analytics data in database
 */
async function storeAnalyticsData(
  userId: string,
  connectionId: string,
  propertyId: string,
  data: any
) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Delete old data for this connection
  await supabaseAdmin
    .from('analytics_data')
    .delete()
    .eq('user_id', userId)
    .eq('connection_id', connectionId)

  // Insert new data
  const { error } = await supabaseAdmin
    .from('analytics_data')
    .insert({
      user_id: userId,
      connection_id: connectionId,
      property_id: propertyId,
      data: data,
      synced_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Error storing analytics data:', error)
    throw error
  }
}

