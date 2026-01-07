# Google Analytics Data Integration Setup

This guide explains how to set up Google Analytics Data API integration to fetch real data from your Google Analytics properties.

## Overview

When a user connects their Google Analytics Property ID (like `514668607` from the URL `https://analytics.google.com/analytics/web/#/a376316871p514668607`), the system will:

1. Fetch real-time data from Google Analytics Data API (GA4)
2. Store metrics like users, sessions, pageviews, conversions, revenue, etc.
3. Make this data available to the chatbot for conversations
4. Enable data-driven recommendations

## Setup (OAuth 2.0 - Multi-Tenant)

**This is a multi-tenant platform where each client authorizes their own Google Analytics account.**

You only need to set up YOUR app's OAuth credentials once. Each client will then authorize their own account through OAuth.

### Steps:

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - "Google Analytics Data API"
     - "Google Analytics Admin API" (to list user's properties)

2. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/oauth/google/callback` (development)
     - `https://mysmartly.app/api/oauth/google/callback` (production)

3. **Add Environment Variables (YOUR app credentials only)**
   ```env
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_REDIRECT_URI=https://mysmartly.app/api/oauth/google/callback
   ```

**That's it!** Each client will:
- Click "Connect Google Analytics"
- Be redirected to Google to authorize their account
- Their OAuth tokens are stored in their connection config
- Their data is fetched using their own tokens

**No need to add individual client credentials to .env file!**

## Database Setup

Run the SQL script to create the analytics data table:

```bash
# In Supabase SQL Editor, run:
CREATE-ANALYTICS-DATA-TABLE.sql
```

This creates:
- `analytics_data` table to store fetched metrics
- Indexes for fast queries
- RLS policies for security

## How It Works

1. **User Connects Property ID**
   - User enters Property ID (e.g., `514668607`) in the connection modal
   - System stores it in `data_connections.connection_config`

2. **Automatic Data Sync**
   - When connection is created, `/api/analytics/sync` is called
   - Fetches data from Google Analytics Data API
   - Stores in `analytics_data` table

3. **Chatbot Access**
   - Chatbot reads from `analytics_data` table
   - Includes real metrics in conversation context
   - Can answer questions about actual data

4. **Data Refresh**
   - Data is synced on connection
   - Can be manually refreshed via API
   - Consider adding scheduled sync (cron job)

## API Endpoints

### Sync Analytics Data

```POST /api/analytics/sync```

Request body:
```json
{
  "userId": "user-uuid",
  "connectionId": "connection-uuid"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "propertyId": "514668607",
    "summary": {
      "activeUsers": 1234,
      "sessions": 5678,
      "pageviews": 9012,
      "conversions": 45,
      "totalRevenue": 1234.56
    },
    "dailyData": [...],
    "topCountries": [...],
    "deviceBreakdown": [...],
    "topSources": [...]
  }
}
```

## Metrics Fetched

The system fetches the following metrics for the last 30 days:

- **Users**: Active users
- **Sessions**: Total sessions
- **Pageviews**: Total page views
- **Average Session Duration**: Average time per session
- **Bounce Rate**: Percentage of single-page sessions
- **Conversions**: Total conversions
- **Revenue**: Total revenue (if e-commerce is set up)
- **Event Count**: Total events tracked

**Dimensions**:
- Date (daily breakdown)
- Country (geographic data)
- Device Category (desktop, mobile, tablet)
- Session Source (traffic sources)

## Troubleshooting

### "API credentials not configured"
- Set up OAuth, Service Account, or Access Token (see above)

### "Property not found"
- Verify the Property ID is correct
- Ensure the account has access to the property

### "Insufficient permissions"
- For Service Account: Grant Viewer access in Google Analytics
- For OAuth: Request `https://www.googleapis.com/auth/analytics.readonly` scope

### Data not syncing
- Check API credentials are valid
- Verify Property ID format (numeric only, no "GA-" prefix)
- Check server logs for API errors

## Next Steps

1. Implement OAuth flow for user authorization
2. Add refresh token handling for long-lived access
3. Set up scheduled sync (daily/hourly)
4. Add more metrics and dimensions as needed
5. Implement data visualization in dashboard

## References

- [Google Analytics Data API Documentation](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [OAuth 2.0 Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [Service Account Setup](https://cloud.google.com/iam/docs/service-accounts)

