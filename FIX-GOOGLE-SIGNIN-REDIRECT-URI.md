# Fix Google Sign-In Redirect URI Mismatch

## Problem
When signing in with Google, you get:
```
Error 400: redirect_uri_mismatch
```

This happens because Supabase's Google OAuth redirect URI is not configured in Google Cloud Console.

## Solution

### Step 1: Find Your Supabase Project URL
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** > **API**
4. Copy your **Project URL** (it looks like: `https://xxxxx.supabase.co`)

### Step 2: Add Supabase Redirect URI to Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (the same one you're using for Google Analytics)
3. Navigate to **APIs & Services** > **Credentials**
4. Find your OAuth 2.0 Client ID (the one you're using for mySmartly)
5. Click **Edit** (pencil icon)
6. Under **Authorized redirect URIs**, add:
   ```
   https://[YOUR-SUPABASE-PROJECT-REF].supabase.co/auth/v1/callback
   ```
   Replace `[YOUR-SUPABASE-PROJECT-REF]` with your actual Supabase project reference.
   
   For example, if your Supabase URL is `https://rmnjqlfbpomvklxgekgu.supabase.co`, add:
   ```
   https://rmnjqlfbpomvklxgekgu.supabase.co/auth/v1/callback
   ```

7. **Important**: Make sure you have BOTH redirect URIs:
   - `https://[YOUR-SUPABASE-PROJECT-REF].supabase.co/auth/v1/callback` (for Supabase Auth sign-in)
   - `http://localhost:3000/api/oauth/google/callback` (for local development - Google Analytics connection)
   - `https://mysmartly.app/api/oauth/google/callback` (for production - Google Analytics connection)

8. Click **Save**

### Step 3: Wait for Changes to Propagate
- Google says it can take 5 minutes to a few hours for changes to take effect
- Usually it's within 5-10 minutes

### Step 4: Test
1. Try signing in with Google again
2. The redirect URI mismatch error should be resolved

## Why This Happens

When you use Supabase's `signInWithOAuth()` for Google sign-in, Supabase handles the OAuth flow and redirects to:
```
https://[your-project].supabase.co/auth/v1/callback
```

This redirect URI **must** be added to your Google Cloud Console OAuth client configuration, otherwise Google will reject the request with `redirect_uri_mismatch`.

## Important Notes

- **Two Different OAuth Flows**:
  - **Supabase Auth** (for sign-in/sign-up): Uses `https://[project].supabase.co/auth/v1/callback`
  - **Google Analytics Connection** (for data connections): Uses `http://localhost:3000/api/oauth/google/callback` or `https://mysmartly.app/api/oauth/google/callback`

- Both redirect URIs need to be in your Google Cloud Console configuration.

## Troubleshooting

If you still get the error after adding the redirect URI:

1. **Double-check the exact URL**: Make sure there are no typos, and it matches exactly (including `https://` and `/auth/v1/callback`)

2. **Check which OAuth client you're editing**: Make sure you're editing the same OAuth client ID that Supabase is using

3. **Verify Supabase Google OAuth is enabled**:
   - Go to Supabase Dashboard > Authentication > Providers
   - Make sure Google is enabled
   - Check that the Client ID and Client Secret match your Google Cloud Console

4. **Wait longer**: Sometimes it takes up to an hour for changes to propagate

5. **Clear browser cache**: Try in an incognito window or clear your browser cache

