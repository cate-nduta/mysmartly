import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Force dynamic rendering - this route uses searchParams
export const dynamic = 'force-dynamic'

/**
 * Initiate Google OAuth flow for Google Analytics
 * This allows each user to authorize their own Google Analytics account
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const connectionType = searchParams.get('connectionType') || 'google_analytics'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get OAuth credentials from environment (these are YOUR app's credentials, not user-specific)
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mysmartly.app'}/api/oauth/google/callback`

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Google OAuth credentials not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment variables.' },
        { status: 500 }
      )
    }

    // Generate state parameter to prevent CSRF attacks
    const state = Buffer.from(JSON.stringify({ userId, connectionType })).toString('base64')

    // Required scopes for Google Analytics Data API
    const scopes = [
      'https://www.googleapis.com/auth/analytics.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' ')

    // Build OAuth URL
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('scope', scopes)
    authUrl.searchParams.set('access_type', 'offline') // Required to get refresh token
    authUrl.searchParams.set('prompt', 'consent') // Force consent to get refresh token
    authUrl.searchParams.set('state', state)

    // Redirect user to Google OAuth consent screen
    return NextResponse.redirect(authUrl.toString())
  } catch (error: any) {
    console.error('Error initiating Google OAuth:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to initiate OAuth flow' },
      { status: 500 }
    )
  }
}

