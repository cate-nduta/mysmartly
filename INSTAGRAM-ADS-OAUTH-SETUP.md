# Instagram OAuth Integration Setup Guide

This guide explains how to set up Instagram Page and Instagram Ads OAuth authentication for mySmartly.

## Overview

Instagram uses Meta's (Facebook) OAuth API. The integration supports two connection types:

### Instagram Page Connection
1. User clicks "Connect Instagram Page"
2. User is redirected to Meta OAuth login
3. User authorizes mySmartly to access their Facebook Pages and Instagram accounts
4. Meta redirects back with an authorization code
5. Backend exchanges code for access token
6. Backend fetches user's Facebook Pages that have Instagram Business accounts
7. User selects which Instagram page to connect
8. Connection is saved and ready to use

### Instagram Ads Connection
1. User clicks "Connect Instagram Ads"
2. User is redirected to Meta OAuth login
3. User authorizes mySmartly to access their ad data
4. Meta redirects back with an authorization code
5. Backend exchanges code for access token
6. User selects which Ad Account to connect
7. Connection is saved and ready to use

## Prerequisites

1. **Meta Developer Account**: Create an app at [developers.facebook.com](https://developers.facebook.com)
2. **App ID and App Secret**: From your Meta app settings
3. **Environment Variables**: Add to your `.env.local` file

## Step 1: Create Meta App

1. Go to [Meta for Developers](https://developers.facebook.com)
2. Click "My Apps" → "Create App"
3. Choose "Business" as the app type
4. Fill in app details:
   - App Name: `mySmartly`
   - App Contact Email: Your email
   - Business Account: (Optional)

## Step 2: Configure OAuth Settings

1. In your Meta app dashboard, go to **Settings** → **Basic**
2. Note your **App ID** and **App Secret** (click "Show" to reveal secret)
3. Add **OAuth Redirect URIs**:
   - Development: `http://localhost:3000/api/oauth/meta/callback`
   - Production: `https://mysmartly.app/api/oauth/meta/callback`
4. Go to **Settings** → **Advanced** → **Security**
   - Enable "Require App Secret" for server-side API calls
5. Go to **Products** → **Instagram** → **Basic Display** (if needed)
   - This is required for Instagram Page connections

## Step 3: Request Permissions

1. Go to **App Review** → **Permissions and Features**
2. Request the following permissions:

   **For Instagram Page:**
   - `pages_show_list` - List user's Facebook Pages
   - `pages_read_engagement` - Read page engagement data
   - `instagram_basic` - Access Instagram basic profile info
   - `instagram_manage_insights` - Read Instagram insights and analytics
   - `business_management` - Access business accounts

   **For Instagram Ads:**
   - `ads_read` - Read ad account data
   - `ads_management` - Manage ads (optional, for future features)
   - `business_management` - Access business accounts

**Note**: Some permissions may require app review for production use. Instagram permissions typically require app review.

## Step 4: Set Environment Variables

Add these to your `.env.local` file:

```env
# Meta OAuth Credentials
META_APP_ID=your_app_id_here
META_APP_SECRET=your_app_secret_here

# Site URL (for OAuth redirects)
NEXT_PUBLIC_SITE_URL=https://mysmartly.app
# For local development, use: http://localhost:3000
```

## Step 5: Database Setup

The `data_connections` table should already exist. It stores connections for both Instagram Pages and Instagram Ads:

**Instagram Page Connection:**
- `connection_type`: `'instagram_page'`
- `connection_name`: `'Instagram Page'`
- `status`: `'connected'` or `'pending_page_selection'`
- `connection_config`: JSON object containing:
  - `user_access_token`: User's OAuth access token
  - `page_access_token`: Selected page's access token
  - `selected_page_id`: The Facebook Page ID selected by user
  - `selected_page_name`: The Facebook Page name
  - `instagram_business_account_id`: The Instagram Business Account ID
  - `instagram_username`: Instagram username
  - `instagram_name`: Instagram display name
  - `instagram_profile_picture`: Instagram profile picture URL
  - `pages`: Array of available Facebook Pages with Instagram accounts

**Instagram Ads Connection:**
- `connection_type`: `'instagram_ads'`
- `connection_name`: `'Instagram Ads'`
- `status`: `'connected'` or `'pending_account_selection'`
- `connection_config`: JSON object containing:
  - `access_token`: OAuth access token (encrypt in production)
  - `expires_at`: Token expiration timestamp
  - `selected_account_id`: The ad account ID selected by user
  - `account_id`: The account ID for API calls
  - `ad_accounts`: Array of available ad accounts

## Step 6: Test the Integration

### Testing Instagram Page Connection

1. Start your development server: `npm run dev`
2. Go to `/dashboard`
3. Click "Connect" on **Instagram Page**
4. You should be redirected to Meta login
5. After authorizing, you'll be redirected back
6. Select an Instagram page (from your Facebook Pages that have Instagram Business accounts)
7. Connection should be saved
8. The recommendation engine will analyze your Instagram page data

### Testing Instagram Ads Connection

1. Go to `/dashboard`
2. Click "Connect" on **Instagram Ads**
3. You should be redirected to Meta login
4. After authorizing, you'll be redirected back
5. Select an ad account
6. Connection should be saved
7. The recommendation engine will analyze your ad performance data

**Note**: Make sure your Facebook Page has an Instagram Business account connected before testing Instagram Page connection.

## Security Considerations

### Production Checklist

- [ ] Store `META_APP_SECRET` securely (never commit to git)
- [ ] Encrypt `access_token` in database (use Supabase encryption or similar)
- [ ] Implement token refresh logic (tokens expire after 60 days)
- [ ] Add rate limiting to OAuth endpoints
- [ ] Use HTTPS for all OAuth redirects
- [ ] Validate state parameter to prevent CSRF attacks
- [ ] Log OAuth errors for monitoring

### Token Refresh

Meta access tokens expire after 60 days. Implement a refresh mechanism:

1. Check token expiration before API calls
2. Use long-lived tokens (exchange short-lived for long-lived)
3. Implement automatic refresh in background jobs
4. Notify users if refresh fails

## API Usage

### Instagram Page API

Once connected, you can fetch Instagram Page data:

```javascript
// Example: Fetch Instagram insights
const pageAccessToken = connection.connection_config.page_access_token
const instagramAccountId = connection.connection_config.instagram_business_account_id

// Get insights
const insightsResponse = await fetch(
  `https://graph.facebook.com/v18.0/${instagramAccountId}/insights?metric=impressions,reach,profile_views&period=day&access_token=${pageAccessToken}`
)

// Get recent posts
const postsResponse = await fetch(
  `https://graph.facebook.com/v18.0/${instagramAccountId}/media?fields=id,media_type,like_count,comments_count&access_token=${pageAccessToken}`
)
```

### Instagram Ads API

Once connected, you can fetch Instagram Ads data:

```javascript
// Example: Fetch ad account insights
const accessToken = connection.connection_config.access_token
const accountId = connection.connection_config.account_id

const response = await fetch(
  `https://graph.facebook.com/v18.0/${accountId}/insights?fields=spend,impressions,clicks,ctr,cpc,cpp,cpm,actions,cost_per_action_type&access_token=${accessToken}`
)
```

## Troubleshooting

### "Invalid OAuth redirect URI"
- Check that redirect URI in Meta app matches exactly (including http/https)
- Ensure no trailing slashes

### "App Not Setup"
- Verify App ID and App Secret are correct
- Check that OAuth is enabled in app settings

### "Permissions Not Granted"
- User must grant all requested permissions
- Some permissions require app review for production

### "No Instagram Pages Found"
- User's Facebook Pages may not have Instagram Business accounts connected
- User needs to connect Instagram to their Facebook Page first
- Check that `pages_show_list` and `instagram_basic` permissions are granted

### "No Ad Accounts Found"
- User may not have any ad accounts
- Check that `business_management` permission is granted
- Verify the user has access to ad accounts in Meta Business Manager

## Next Steps

1. Implement data fetching from Meta Ads API
2. Add token refresh mechanism
3. Create background jobs to sync data regularly
4. Add error handling and retry logic
5. Implement webhooks for real-time updates (optional)

## Resources

- [Meta Graph API Documentation](https://developers.facebook.com/docs/graph-api)
- [Meta Marketing API](https://developers.facebook.com/docs/marketing-apis)
- [OAuth 2.0 Guide](https://developers.facebook.com/docs/facebook-login/guides/advanced/oauth-2.0)

