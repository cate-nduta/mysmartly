# Google OAuth Setup Guide - Step by Step

This guide will walk you through setting up Google OAuth credentials for your mySmartly app. You only need to do this **once** - all your clients will use these same credentials to authorize their own accounts.

## Step 1: Create a Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account (this can be your personal or business Google account)

2. **Create a New Project**
   - Click the project dropdown at the top (next to "Google Cloud")
   - Click "New Project"
   - Enter project name: `mySmartly` (or any name you prefer)
   - Click "Create"
   - Wait for the project to be created (takes a few seconds)

3. **Select Your Project**
   - Make sure your new project is selected in the project dropdown

## Step 2: Enable Required APIs

1. **Go to APIs & Services**
   - In the left sidebar, click "APIs & Services" > "Library"
   - Or visit: https://console.cloud.google.com/apis/library

2. **Enable Google Analytics Data API**
   - Search for: `Google Analytics Data API`
   - Click on it
   - Click the blue "Enable" button
   - Wait for it to enable

3. **Enable Google Analytics Admin API** (to list user's properties)
   - Search for: `Google Analytics Admin API`
   - Click on it
   - Click the blue "Enable" button
   - Wait for it to enable

## Step 3: Create OAuth 2.0 Credentials

1. **Go to Credentials Page**
   - In the left sidebar, click "APIs & Services" > "Credentials"
   - Or visit: https://console.cloud.google.com/apis/credentials

2. **Configure OAuth Consent Screen** (Required First)
   - Click "OAuth consent screen" tab at the top
   - Select "External" (unless you have a Google Workspace account, then you can use "Internal")
   - Click "Create"

3. **Fill OAuth Consent Screen Form**
   - **App name**: `mySmartly` (or your app name)
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
   - Click "Save and Continue"

4. **Add Scopes** (Optional - you can skip this step)
   - Click "Add or Remove Scopes"
   - The default scopes are usually fine
   - Click "Update" then "Save and Continue"

5. **Add Test Users** (Only needed if app is in Testing mode)
   - If your app is in "Testing" mode, add test user emails
   - Click "Save and Continue"
   - Click "Back to Dashboard"

6. **Create OAuth Client ID**
   - Go back to "Credentials" tab
   - Click "+ Create Credentials" at the top
   - Select "OAuth client ID"

7. **Configure OAuth Client**
   - **Application type**: Select "Web application"
   - **Name**: `mySmartly Web Client` (or any name)

8. **Add Authorized Redirect URIs**
   - Under "Authorized redirect URIs", click "Add URI"
   - Add these URIs (one at a time):
     ```
     http://localhost:3000/api/oauth/google/callback
     https://mysmartly.app/api/oauth/google/callback
     ```
   - **Important**: Replace `mysmartly.app` with your actual domain if different
   - Click "Create"

9. **Copy Your Credentials**
   - A popup will appear with your credentials
   - **Copy the Client ID** (looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`)
   - **Copy the Client Secret** (looks like: `GOCSPX-abcdefghijklmnopqrstuvwxyz`)
   - **IMPORTANT**: Save these securely - you won't be able to see the secret again!

## Step 4: Add Credentials to Your Project

1. **Open your `.env.local` file** in your project root

2. **Add these lines**:
   ```env
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_REDIRECT_URI=https://mysmartly.app/api/oauth/google/callback
   ```

3. **Replace the values**:
   - Replace `your_client_id_here` with the Client ID you copied
   - Replace `your_client_secret_here` with the Client Secret you copied
   - Replace `mysmartly.app` with your actual domain (or keep `localhost:3000` for development)

4. **Save the file**

## Step 5: Verify Setup

1. **Restart your development server** (if running)
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

2. **Test the connection**:
   - Go to your dashboard
   - Click "Connect Google Analytics"
   - You should be redirected to Google's OAuth page
   - After authorizing, you should be redirected back to your dashboard

## Troubleshooting

### "Redirect URI mismatch" error
- Make sure the redirect URI in your `.env.local` exactly matches one of the URIs you added in Google Cloud Console
- Check for trailing slashes, `http` vs `https`, etc.

### "Access blocked: This app's request is invalid"
- Make sure you've completed the OAuth consent screen setup
- If in Testing mode, make sure you've added test users

### "Client ID not found"
- Double-check that you copied the Client ID correctly
- Make sure there are no extra spaces in your `.env.local` file

### Can't see Client Secret again
- If you lost the secret, you'll need to create a new OAuth client ID
- Go to Credentials > Your OAuth client > Delete it > Create a new one

## Where to Find Your Credentials Later

If you need to find your credentials again:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. You'll see the Client ID (but not the secret - you'll need to create a new one if lost)

## Production Checklist

Before going to production:

- [ ] OAuth consent screen is published (not in Testing mode)
- [ ] All redirect URIs are added (both development and production)
- [ ] Environment variables are set in your production hosting (Vercel, Netlify, etc.)
- [ ] Test the OAuth flow in production

## Security Notes

- **Never commit `.env.local` to git** (it should already be in `.gitignore`)
- **Never share your Client Secret** publicly
- **Use different credentials for development and production** (optional but recommended)
- **Rotate credentials** if you suspect they've been compromised

## Need Help?

- Google Cloud Console: https://console.cloud.google.com/
- Google OAuth Documentation: https://developers.google.com/identity/protocols/oauth2
- Google Analytics Data API: https://developers.google.com/analytics/devguides/reporting/data/v1

