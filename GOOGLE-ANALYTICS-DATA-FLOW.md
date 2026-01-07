# Google Analytics Data Flow - Complete Verification

## ✅ Complete Flow Verification

This document confirms that the entire flow from OAuth connection to chatbot answering questions works correctly.

## Flow Overview

1. **Client Connects Account** → OAuth authorization
2. **Store Tokens** → Client's OAuth tokens saved in `data_connections.connection_config`
3. **Auto-Sync Data** → Fetches real data from Google Analytics API
4. **Store Data** → Saves metrics to `analytics_data` table
5. **Chatbot Access** → Chatbot reads data and includes in conversation context
6. **Answer Questions** → Chatbot uses real data to answer client questions

## Step-by-Step Flow

### Step 1: Client Clicks "Connect Google Analytics"
- Location: Dashboard → Data Connections section
- Action: Redirects to `/api/oauth/google?userId=...&connectionType=google_analytics`

### Step 2: OAuth Authorization
- Client authorizes on Google's OAuth page
- Google redirects to: `/api/oauth/google/callback?code=...&state=...`

### Step 3: OAuth Callback (`app/api/oauth/google/callback/route.ts`)
✅ **What it does:**
- Exchanges authorization code for access token + refresh token
- Fetches user's Google Analytics properties
- Stores tokens and property ID in `data_connections` table
- **Automatically triggers data sync** (background fetch)

✅ **Stored in `connection_config`:**
```json
{
  "access_token": "ya29...",
  "refresh_token": "1//...",
  "token_expires_at": "2026-01-08T...",
  "google_email": "client@example.com",
  "google_account_id": "123456789",
  "propertyId": "514668607",
  "propertyName": "My Website"
}
```

### Step 4: Data Sync (`app/api/analytics/sync/route.ts`)
✅ **What it does:**
- Uses client's access token to call Google Analytics Data API
- Fetches metrics for last 30 days:
  - Active Users
  - Sessions
  - Pageviews
  - Average Session Duration
  - Bounce Rate
  - Conversions
  - Revenue
  - Events
- Fetches dimensions:
  - Date (daily breakdown)
  - Country (geographic data)
  - Device Category (desktop/mobile/tablet)
  - Session Source (traffic sources)
- Formats and stores in `analytics_data` table

✅ **Data Structure Stored:**
```json
{
  "propertyId": "514668607",
  "summary": {
    "activeUsers": 1234,
    "sessions": 5678,
    "pageviews": 9012,
    "averageSessionDuration": 120,
    "bounceRate": 0.45,
    "conversions": 45,
    "totalRevenue": 1234.56,
    "eventCount": 890
  },
  "dailyData": [...],
  "topCountries": [...],
  "deviceBreakdown": [...],
  "topSources": [...]
}
```

### Step 5: Chatbot Context Building (`app/api/chat/route.ts`)
✅ **What it does:**
- When client asks a question, chatbot fetches their analytics data
- Uses service role to bypass RLS and access `analytics_data` table
- Includes comprehensive metrics in the system prompt:
  - All summary metrics
  - Top 5 countries
  - Device breakdown
  - Top 5 traffic sources
  - Recent trends (7-day averages)

✅ **Context Format:**
```
**Google Analytics** (google_analytics):
- Last synced: 1/7/2026
- Property ID: 514668607

📊 Current Metrics (Last 30 Days):
- Active Users: 1,234
- Total Sessions: 5,678
- Total Pageviews: 9,012
- Average Session Duration: 120 seconds
- Bounce Rate: 45.0%
- Total Conversions: 45
- Total Revenue: $1,235
- Total Events: 890

🌍 Top Countries by Users:
  1. United States: 800 users
  2. Kenya: 300 users
  ...

📱 Device Breakdown:
  - desktop: 60.0% (740 users)
  - mobile: 35.0% (432 users)
  ...

💡 Note: All metrics above are from the client's actual Google Analytics data...
```

### Step 6: Chatbot Answers Questions
✅ **What it does:**
- Receives client's question
- Has access to all their real Google Analytics metrics
- Answers using the exact numbers from their data
- Can discuss:
  - Traffic patterns
  - User behavior
  - Conversions
  - Geographic data
  - Device usage
  - Traffic sources
  - Trends and patterns

## Example Questions & Answers

**Client asks:** "How many users visited my site?"
**Chatbot responds:** "Based on your Google Analytics data, you had **1,234 active users** in the last 30 days."

**Client asks:** "What's my bounce rate?"
**Chatbot responds:** "Your bounce rate is **45.0%** based on the last 30 days of data."

**Client asks:** "Which countries are my top visitors from?"
**Chatbot responds:** "Your top countries by users are: 1. United States (800 users), 2. Kenya (300 users), 3. Germany (134 users)..."

## Data Refresh

- **On Connection:** Data syncs automatically when client connects
- **Manual Refresh:** Can be triggered via `/api/analytics/sync` endpoint
- **Token Refresh:** Access tokens auto-refresh when expired using refresh token

## Verification Checklist

✅ OAuth flow stores client's tokens
✅ Property ID is automatically detected or can be set manually
✅ Data sync fetches real data from Google Analytics API
✅ Data is stored in `analytics_data` table
✅ Chatbot uses service role to access data (bypasses RLS)
✅ Chatbot includes comprehensive metrics in context
✅ Chatbot can answer questions using real data
✅ All metrics are from client's actual Google Analytics account

## Troubleshooting

### If data doesn't appear in chatbot:
1. Check `analytics_data` table has data for the user
2. Verify `connection_id` matches in both tables
3. Check server logs for sync errors
4. Verify OAuth tokens are valid

### If sync fails:
1. Check access token is valid
2. Verify property ID is correct
3. Check Google Analytics API quota/errors
4. Verify user has access to the property

### If chatbot shows "data being synced":
1. Wait a few minutes for sync to complete
2. Check sync endpoint logs
3. Manually trigger sync if needed

