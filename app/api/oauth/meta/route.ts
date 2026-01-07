import { NextRequest, NextResponse } from 'next/server'

// Meta OAuth initiation endpoint
// This redirects the user to Meta's OAuth login page
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')
  const redirectUri = searchParams.get('redirectUri') || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/oauth/meta/callback`

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  // Meta App ID and App Secret from environment variables
  const META_APP_ID = process.env.META_APP_ID
  const META_APP_SECRET = process.env.META_APP_SECRET

  if (!META_APP_ID) {
    return NextResponse.json({ error: 'Meta App ID not configured' }, { status: 500 })
  }

  // Determine connection type from query params (default to instagram_page)
  const connectionType = searchParams.get('type') || 'instagram_page' // 'instagram_page' or 'instagram_ads'

  // Meta OAuth URL
  // For Instagram Pages: Need pages_show_list, instagram_basic, instagram_manage_insights
  // For Instagram Ads: Need ads_read, business_management, ads_management
  const metaOAuthUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth')
  metaOAuthUrl.searchParams.set('client_id', META_APP_ID)
  metaOAuthUrl.searchParams.set('redirect_uri', redirectUri)
  
  // Set scopes based on connection type
  // Note: instagram_basic and instagram_manage_insights are deprecated
  // Instagram Business accounts are accessed through Facebook Pages
  if (connectionType === 'instagram_page') {
    metaOAuthUrl.searchParams.set('scope', 'pages_show_list,pages_read_engagement,business_management')
  } else {
    // Instagram Ads
    metaOAuthUrl.searchParams.set('scope', 'ads_read,business_management,ads_management')
  }
  
  metaOAuthUrl.searchParams.set('state', `${userId}:${connectionType}`) // Pass user ID and connection type in state
  metaOAuthUrl.searchParams.set('response_type', 'code')

  // Redirect to Meta OAuth
  return NextResponse.redirect(metaOAuthUrl.toString())
}

