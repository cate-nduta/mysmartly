import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Meta OAuth callback handler
// This receives the authorization code from Meta and exchanges it for an access token
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state') // Format: "userId:connectionType"
  const error = searchParams.get('error')
  const errorReason = searchParams.get('error_reason')

  // Handle OAuth errors
  if (error) {
    console.error('Meta OAuth error:', error, errorReason)
    const errorUrl = new URL('/dashboard', request.url)
    errorUrl.searchParams.set('error', 'meta_oauth_failed')
    errorUrl.searchParams.set('message', errorReason || 'Failed to connect Instagram')
    return NextResponse.redirect(errorUrl)
  }

  if (!code || !state) {
    const errorUrl = new URL('/dashboard', request.url)
    errorUrl.searchParams.set('error', 'meta_oauth_invalid')
    errorUrl.searchParams.set('message', 'Invalid OAuth response')
    return NextResponse.redirect(errorUrl)
  }

  // Parse state to get userId and connectionType
  const [userId, connectionType] = state.split(':')
  const finalConnectionType = connectionType || 'instagram_page'

  try {
    const META_APP_ID = process.env.META_APP_ID
    const META_APP_SECRET = process.env.META_APP_SECRET
    const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/oauth/meta/callback`

    if (!META_APP_ID || !META_APP_SECRET) {
      throw new Error('Meta OAuth credentials not configured')
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: META_APP_ID,
        client_secret: META_APP_SECRET,
        redirect_uri: redirectUri,
        code: code,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange error:', errorData)
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token
    const expiresIn = tokenData.expires_in || 5184000 // Default to 60 days

    // Calculate token expiration
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn)

    // Get long-lived token (optional, but recommended for production)
    // For now, we'll use the short-lived token and handle refresh later
    // You can implement token refresh logic as needed

    if (finalConnectionType === 'instagram_page') {
      // Fetch user's Facebook Pages that have Instagram accounts
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${accessToken}`
      )

      let pages: any[] = []
      if (pagesResponse.ok) {
        const pagesData = await pagesResponse.json()
        pages = (pagesData.data || []).filter((page: any) => page.instagram_business_account) // Only pages with Instagram
      }

      // Store the OAuth token temporarily in the database
      // We'll complete the connection after the user selects an Instagram page
      const { error: storeError } = await supabase
        .from('data_connections')
        .upsert({
          user_id: userId,
          connection_type: 'instagram_page',
          connection_name: 'Instagram Page',
          status: 'pending_page_selection', // Special status while waiting for page selection
          connection_config: {
            user_access_token: accessToken, // Store encrypted in production
            expires_at: expiresAt.toISOString(),
            pages: pages.map((page: any) => ({
              page_id: page.id,
              page_name: page.name,
              page_access_token: page.access_token,
              instagram_business_account_id: page.instagram_business_account?.id,
            })),
            oauth_provider: 'meta',
          },
          last_sync_at: null,
        }, {
          onConflict: 'user_id,connection_type',
        })

      if (storeError) {
        console.error('Error storing OAuth token:', storeError)
        throw storeError
      }

      // Redirect to Instagram page selection
      const selectPageUrl = new URL('/dashboard/connections/instagram/select-page', request.url)
      selectPageUrl.searchParams.set('userId', userId)
      return NextResponse.redirect(selectPageUrl)
    } else {
      // Instagram Ads flow (existing)
      // Fetch user's ad accounts
      const adAccountsResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/adaccounts?fields=id,name,account_id&access_token=${accessToken}`
      )

      let adAccounts: any[] = []
      if (adAccountsResponse.ok) {
        const adAccountsData = await adAccountsResponse.json()
        adAccounts = adAccountsData.data || []
      }

      // Store the OAuth token temporarily in the database
      const { error: storeError } = await supabase
        .from('data_connections')
        .upsert({
          user_id: userId,
          connection_type: 'instagram_ads',
          connection_name: 'Instagram Ads',
          status: 'pending_account_selection',
          connection_config: {
            access_token: accessToken,
            expires_at: expiresAt.toISOString(),
            ad_accounts: adAccounts,
            oauth_provider: 'meta',
          },
          last_sync_at: null,
        }, {
          onConflict: 'user_id,connection_type',
        })

      if (storeError) {
        console.error('Error storing OAuth token:', storeError)
        throw storeError
      }

      // Redirect to account selection page
      const selectAccountUrl = new URL('/dashboard/connections/instagram-ads/select-account', request.url)
      selectAccountUrl.searchParams.set('userId', userId)
      return NextResponse.redirect(selectAccountUrl)
    }

  } catch (error: any) {
    console.error('Meta OAuth callback error:', error)
    const errorUrl = new URL('/dashboard', request.url)
    errorUrl.searchParams.set('error', 'meta_oauth_error')
    errorUrl.searchParams.set('message', error.message || 'Failed to complete Instagram Ads connection')
    return NextResponse.redirect(errorUrl)
  }
}

