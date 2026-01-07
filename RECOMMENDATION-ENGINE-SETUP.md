# Recommendation Engine Setup Guide

The recommendation engine analyzes connected platform data (Instagram Ads, Google Ads, Shopify, etc.) and generates personalized business recommendations based on user goals.

## How It Works

1. **Data Analysis**: Fetches data from connected platforms (Instagram Ads, Google Ads, etc.)
2. **Pattern Detection**: Analyzes metrics (ROAS, CTR, CPC, spend, etc.)
3. **Goal Alignment**: Matches recommendations to user's onboarding goals
4. **Recommendation Generation**: Creates actionable recommendations with projected impact
5. **Storage**: Saves recommendations to the `recommendations` table

## Current Implementation

### Instagram Ads Analysis

The engine analyzes:
- **ROAS (Return on Ad Spend)**: Revenue / Spend
- **CTR (Click-Through Rate)**: Clicks / Impressions
- **CPC (Cost Per Click)**: Spend / Clicks
- **CPM (Cost Per Mille)**: Cost per 1000 impressions
- **Spend Trends**: Daily/monthly spending patterns

### Recommendation Types

1. **Budget Optimization** (High Impact)
   - Triggered when: ROAS > 2.5x and spend is capped
   - Example: "Increase Ad Budget by 15%"
   - Impact: Projected revenue increase

2. **Creative Optimization** (Medium Priority)
   - Triggered when: CTR < 1.0% and clicks > 100
   - Example: "Improve Ad Creative to Increase CTR"
   - Impact: Potential revenue from better engagement

3. **Cost Optimization** (Medium Priority)
   - Triggered when: CPC > $2.00 and spend > $1000
   - Example: "Optimize Targeting to Reduce CPC"
   - Impact: Monthly cost savings

## API Endpoints

### Generate Recommendations

**POST** `/api/recommendations/generate`

```json
{
  "userId": "user-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "recommendations": [...]
}
```

## Automatic Generation

Recommendations are automatically generated when:
- User visits the Decision Feed
- No recommendations exist, or
- Last recommendations are older than 24 hours

## Manual Trigger

You can manually trigger recommendation generation:

```javascript
// From client-side
await fetch('/api/recommendations/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: 'user-id' })
})
```

## Environment Variables

Add to `.env.local`:

```env
# Required for admin operations
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Meta API (for Instagram Ads)
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
```

## Database Schema

The `recommendations` table stores:
- `title`: Recommendation title
- `description`: Full description with impact and context
- `action_type`: Type of recommendation (budget_optimization, cost_optimization, etc.)
- `priority`: high, medium, or low
- `status`: pending, approved, rejected, implemented

## Extending the Engine

To add analysis for other platforms:

1. **Add analysis function** in `lib/recommendation-engine.ts`:
```typescript
async function analyzeShopifyData(
  connection: ConnectionData,
  onboarding: OnboardingData
): Promise<Recommendation[]> {
  // Fetch data from Shopify API
  // Analyze patterns
  // Generate recommendations
  return recommendations
}
```

2. **Add case** in `analyzePlatformData`:
```typescript
case 'shopify':
  recommendations.push(...await analyzeShopifyData(connection, onboarding))
  break
```

## Scheduled Jobs

For production, set up a cron job to generate recommendations daily:

```bash
# Example: Run daily at 2 AM
0 2 * * * curl -X POST https://mysmartly.app/api/recommendations/generate \
  -H "Content-Type: application/json" \
  -d '{"userId":"all"}' # Or iterate through all users
```

## Testing

1. Connect Instagram Ads account
2. Wait for data to sync (or manually trigger sync)
3. Visit `/dashboard` - Decision Feed
4. Recommendations should appear automatically

## Troubleshooting

### No Recommendations Generated

- Check that data connections are `status: 'connected'`
- Verify OAuth tokens are valid (not expired)
- Check API responses in browser console
- Ensure user has completed onboarding

### Recommendations Not Appearing

- Check browser console for errors
- Verify recommendations were saved to database
- Check that `status` is `'pending'`
- Ensure user_id matches

### API Errors

- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check Meta API credentials if using Instagram Ads
- Review server logs for detailed error messages

