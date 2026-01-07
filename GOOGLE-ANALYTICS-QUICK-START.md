# Google Analytics Integration - Quick Start Checklist

## ✅ Setup Complete Checklist

After setting up your Google OAuth credentials, follow these steps:

### 1. Database Setup
- [ ] Run `CREATE-ANALYTICS-DATA-TABLE.sql` in your Supabase SQL Editor
  - Go to: Supabase Dashboard > SQL Editor
  - Copy and paste the entire SQL file
  - Click "Run"

### 2. Environment Variables
- [ ] Added to `.env.local`:
  ```env
  GOOGLE_CLIENT_ID=your_client_id
  GOOGLE_CLIENT_SECRET=your_client_secret
  GOOGLE_REDIRECT_URI=https://mysmartly.app/api/oauth/google/callback
  ```
- [ ] Restarted your development server after adding env variables

### 3. Test the Connection
- [ ] Go to your dashboard: `http://localhost:3000/dashboard`
- [ ] Click "Connect" on Google Analytics 4
- [ ] Should redirect to Google OAuth page
- [ ] After authorizing, should redirect back to dashboard
- [ ] Should show "Connected" status
- [ ] Data should sync automatically

### 4. Verify Data Sync
- [ ] Check that analytics data appears in chatbot context
- [ ] Ask chatbot: "What's my website traffic?"
- [ ] Should see real metrics from your Google Analytics

## Troubleshooting

### If OAuth redirect fails:
1. Check redirect URI matches exactly in Google Cloud Console
2. Verify environment variables are loaded (restart server)
3. Check browser console for errors

### If data doesn't sync:
1. Check Supabase `analytics_data` table has data
2. Verify connection has `access_token` in `connection_config`
3. Check server logs for API errors

### If chatbot doesn't show data:
1. Verify `analytics_data` table exists and has data
2. Check connection status is "connected"
3. Verify `last_sync_at` is recent

## Next Steps

Once everything works:
- [ ] Test with a different Google Analytics account
- [ ] Set up production environment variables
- [ ] Consider adding scheduled sync (cron job) for automatic updates

## Support

If you encounter issues:
1. Check server logs for error messages
2. Verify all environment variables are set
3. Ensure SQL script was run successfully
4. Check Google Cloud Console for API quota/errors

