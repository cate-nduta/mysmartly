# Google OAuth Setup Guide for Supabase

## What the Error Means

"At least one Client ID is required when Google sign-in is enabled" means you've enabled Google as an authentication provider in Supabase, but you haven't provided the required Google OAuth credentials (Client ID and Client Secret).

## Step-by-Step Setup

### Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project (or Select Existing)**
   - Click on the project dropdown at the top
   - Click "New Project"
   - Name it (e.g., "mySmartly OAuth")
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click on it and click "Enable"

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" (unless you have a Google Workspace account)
   - Click "Create"
   - Fill in the required fields:
     - App name: "mySmartly"
     - User support email: Your email
     - Developer contact email: Your email
   - Click "Save and Continue"
   - On "Scopes" screen, click "Save and Continue"
   - On "Test users" screen, add your email if needed, click "Save and Continue"
   - Review and click "Back to Dashboard"

5. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Name: "mySmartly Web Client"
   - **Authorized JavaScript origins:**
     - Add: `https://YOUR_PROJECT_ID.supabase.co`
     - Example: `https://abcdefghijklmnop.supabase.co`
   - **Authorized redirect URIs:**
     - Add: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
     - Example: `https://abcdefghijklmnop.supabase.co/auth/v1/callback`
   - Click "Create"
   - **IMPORTANT:** Copy the "Client ID" and "Client Secret" immediately (you won't be able to see the secret again)

### Step 2: Get Your Supabase Project ID

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to "Settings" > "API"
4. Your Project URL will look like: `https://abcdefghijklmnop.supabase.co`
5. The part after `https://` and before `.supabase.co` is your Project ID
6. Copy this Project ID (you'll need it for the redirect URI)

### Step 3: Add Credentials to Supabase

1. **In Supabase Dashboard:**
   - Go to "Authentication" > "Providers"
   - Find "Google" in the list
   - Click the toggle to enable it (if not already enabled)

2. **Enter Your Credentials:**
   - **Client ID (for OAuth):** Paste the Client ID from Google Cloud Console
   - **Client Secret (for OAuth):** Paste the Client Secret from Google Cloud Console
   - Click "Save"

3. **Verify:**
   - The error should disappear
   - Google provider should show as "Enabled"

## Important Notes

### Redirect URI Format
- Your redirect URI in Google Cloud Console must be:
  ```
  https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
  ```
- Replace `YOUR_PROJECT_ID` with your actual Supabase project ID
- Make sure it matches exactly (including `https://` and no trailing slash)

### For Development
- If you're testing locally, you might also want to add:
  ```
  http://localhost:3000/auth/callback
  ```
  to the Authorized redirect URIs in Google Cloud Console

### For Production
- When deploying to production (e.g., Vercel), add your production domain:
  ```
  https://yourdomain.com/auth/callback
  ```

## Troubleshooting

### "Error: redirect_uri_mismatch"
- Make sure the redirect URI in Google Cloud Console exactly matches:
  - For Supabase: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
  - Check for typos, missing `https://`, or trailing slashes

### "Client ID not found"
- Double-check that you copied the Client ID correctly
- Make sure you're using the correct project in Google Cloud Console

### "Invalid client secret"
- The Client Secret can only be viewed once in Google Cloud Console
- If you lost it, create a new OAuth client ID in Google Cloud Console

### Still Getting Errors?
1. Make sure Google+ API is enabled in Google Cloud Console
2. Verify OAuth consent screen is configured
3. Check that your redirect URI matches exactly
4. Try creating new OAuth credentials if the old ones don't work
5. Make sure you've saved the credentials in Supabase dashboard

## Security Best Practices

1. **Never commit credentials to Git**
   - Client ID and Secret should only be in Supabase dashboard
   - They're stored securely by Supabase

2. **Use Different Credentials for Production**
   - Create separate OAuth clients for development and production
   - Update redirect URIs accordingly

3. **Regularly Review OAuth Apps**
   - Periodically check Google Cloud Console for unused credentials
   - Revoke credentials that are no longer needed

## Quick Checklist

- [ ] Created Google Cloud Project
- [ ] Enabled Google+ API
- [ ] Configured OAuth Consent Screen
- [ ] Created OAuth 2.0 Client ID
- [ ] Added correct redirect URI to Google Cloud Console
- [ ] Copied Client ID and Client Secret
- [ ] Added credentials to Supabase Dashboard
- [ ] Saved changes in Supabase
- [ ] Verified Google provider is enabled

Once all steps are complete, users will be able to sign in with their Google accounts!


