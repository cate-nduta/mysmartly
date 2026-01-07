import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import { listAnalyticsProperties } from '@/lib/google-analytics'

/**
 * Handle Google OAuth callback
 * Exchange authorization code for access token and refresh token
 * Store tokens in user's connection config
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mysmartly.app'}/dashboard?error=oauth_failed&message=${encodeURIComponent(error)}`
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mysmartly.app'}/dashboard?error=missing_params`
      )
    }

    // Decode state to get userId and connectionType
    let stateData: { userId: string; connectionType: string }
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString())
    } catch (e) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mysmartly.app'}/dashboard?error=invalid_state`
      )
    }

    const { userId, connectionType } = stateData

    // Exchange authorization code for tokens
    const tokens = await exchangeCodeForTokens(code)

    if (!tokens.access_token || !tokens.refresh_token) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mysmartly.app'}/dashboard?error=token_exchange_failed`
      )
    }

    // Use service role for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get user's email from Google to verify
    const userInfo = await getUserInfo(tokens.access_token)

    // Check if connection already exists
    const { data: existingConnection } = await supabaseAdmin
      .from('data_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('connection_type', connectionType)
      .eq('status', 'connected')
      .single()

    if (existingConnection) {
      // Update existing connection with new tokens
      await supabaseAdmin
        .from('data_connections')
        .update({
          connection_config: {
            ...existingConnection.connection_config,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            token_expires_at: new Date(Date.now() + (tokens.expires_in * 1000)).toISOString(),
            google_email: userInfo.email,
            google_account_id: userInfo.id,
          },
          last_sync_at: new Date().toISOString(),
        })
        .eq('id', existingConnection.id)
    } else {
      // Create new connection
      await supabaseAdmin
        .from('data_connections')
        .insert({
          user_id: userId,
          connection_type: connectionType,
          connection_name: 'Google Analytics',
          status: 'connected',
          connection_config: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            token_expires_at: new Date(Date.now() + (tokens.expires_in * 1000)).toISOString(),
            google_email: userInfo.email,
            google_account_id: userInfo.id,
          },
          last_sync_at: new Date().toISOString(),
        })
    }

    // Trigger analytics data sync
    const { data: connection } = await supabaseAdmin
      .from('data_connections')
      .select('id')
      .eq('user_id', userId)
      .eq('connection_type', connectionType)
      .eq('status', 'connected')
      .single()

    if (connection) {
      // Sync analytics data immediately (don't wait for response)
      // This ensures data is available when user asks questions
      // The sync endpoint will handle fetching propertyId if needed
      fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://mysmartly.app'}/api/analytics/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          connectionId: connection.id,
        }),
      })
      .then(response => {
        if (!response.ok) {
          console.error('Analytics sync failed:', response.status, response.statusText)
        } else {
          console.log('Analytics data synced successfully for user:', userId)
        }
      })
      .catch(err => {
        console.error('Background sync error:', err)
        // Don't fail the OAuth flow if sync fails - user can retry later
      })
    }

    // Redirect back to dashboard with success
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mysmartly.app'}/dashboard?connected=google_analytics`
    )
  } catch (error: any) {
    console.error('Error handling Google OAuth callback:', error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mysmartly.app'}/dashboard?error=oauth_callback_failed&message=${encodeURIComponent(error.message)}`
    )
  }
}

/**
 * Exchange authorization code for access token and refresh token
 */
async function exchangeCodeForTokens(code: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mysmartly.app'}/api/oauth/google/callback`

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: clientId!,
      client_secret: clientSecret!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Token exchange failed: ${error}`)
  }

  return await response.json()
}

/**
 * Get user info from Google
 */
async function getUserInfo(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to get user info')
  }

  return await response.json()
}


