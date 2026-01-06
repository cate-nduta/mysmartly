# Professional OAuth Setup Guide

## Problem
When users sign in with Google, they see:
- "Sign in to rmnjqlfbpomvklxgekgu.supabase.co"
- This looks unprofessional and confusing

## Solution: Customize Google OAuth Consent Screen

### Step 1: Update Google Cloud Console OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one if you haven't)
3. Navigate to **APIs & Services** > **OAuth consent screen**

4. **Configure the consent screen:**
   - **App name**: `mySmartly` or `mysmartly - AI Driven Business Solutions`
   - **User support email**: `hello@mysmartly.app`
   - **App logo**: Upload your mySmartly logo (optional but recommended)
   - **App domain**: `mysmartly.app`
   - **Developer contact information**: `hello@mysmartly.app`
   - **Authorized domains**: Add `mysmartly.app` and `www.mysmartly.app`

5. **Scopes** (if you need to add any):
   - `email`
   - `profile`
   - `openid`

6. **Test users** (for development):
   - Add test emails that can use the OAuth before publishing

7. **Publishing status**:
   - For production, you'll need to submit for verification if using sensitive scopes
   - For basic email/profile scopes, you can publish immediately

### Step 2: Update Supabase OAuth Settings

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Providers** > **Google**
3. Update the following:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
   - **Authorized redirect URLs**: 
     - `https://rmnjqlfbpomvklxgekgu.supabase.co/auth/v1/callback`
     - `https://mysmartly.app/auth/callback` (if using custom domain)

### Step 3: Use Custom Domain (Optional but Recommended)

If you have a custom domain set up:

1. **In Supabase Dashboard**:
   - Go to **Settings** > **API**
   - Add your custom domain under **Custom Domain** (requires Supabase Pro plan)

2. **Update redirect URLs**:
   - Use your custom domain instead of the Supabase subdomain
   - Example: `https://mysmartly.app/auth/callback`

3. **Update environment variables**:
   - Update `NEXT_PUBLIC_SUPABASE_URL` to use your custom domain (if applicable)

### Step 4: Update OAuth Consent Screen Branding

**In Google Cloud Console OAuth Consent Screen:**

1. **Application home page**: `https://mysmartly.app`
2. **Application privacy policy link**: `https://mysmartly.app/privacy` (create this page)
3. **Application terms of service link**: `https://mysmartly.app/terms` (create this page)
4. **Authorized JavaScript origins**:
   - `https://mysmartly.app`
   - `https://www.mysmartly.app`
   - `https://rmnjqlfbpomvklxgekgu.supabase.co` (keep this for Supabase)

5. **Authorized redirect URIs**:
   - `https://rmnjqlfbpomvklxgekgu.supabase.co/auth/v1/callback`
   - `https://mysmartly.app/auth/callback` (if using custom domain)

### Step 5: Verify the Changes

1. Clear browser cache
2. Try signing in with Google
3. You should now see:
   - **App name**: "mySmartly" or "mysmartly - AI Driven Business Solutions"
   - **Your logo** (if uploaded)
   - **Professional branding**

## Alternative: Custom Domain Setup (Best Solution)

If you want to completely remove the Supabase domain from the OAuth flow:

### Option A: Supabase Custom Domain (Requires Pro Plan)

1. **Set up custom domain in Supabase**:
   - Go to Supabase Dashboard > Settings > API
   - Add custom domain: `api.mysmartly.app` or `auth.mysmartly.app`
   - Follow DNS configuration instructions

2. **Update redirect URLs**:
   - Use your custom domain for all OAuth redirects
   - Example: `https://auth.mysmartly.app/auth/v1/callback`

### Option B: Self-Hosted OAuth (Advanced)

1. Set up your own OAuth server
2. Handle OAuth callbacks on your domain
3. Forward to Supabase for authentication

## Quick Fix (Immediate)

**Update Google OAuth Consent Screen App Name:**

1. Go to Google Cloud Console > OAuth consent screen
2. Change **App name** from default to: **"mySmartly"**
3. Add **App logo** (upload your logo)
4. Save changes

This will immediately show "Sign in to mySmartly" instead of the Supabase domain.

## Verification Checklist

- [ ] Google OAuth consent screen shows "mySmartly" as app name
- [ ] App logo is uploaded and visible
- [ ] Authorized domains include mysmartly.app
- [ ] Redirect URLs are correctly configured
- [ ] Test OAuth sign-in works
- [ ] Users see professional branding during sign-in

## Notes

- The Supabase subdomain (`rmnjqlfbpomvklxgekgu.supabase.co`) will still appear in the redirect URL, but the consent screen will show your app name
- For complete removal of Supabase domain, you need a custom domain setup (Pro plan)
- The consent screen branding is what users see first, so updating it makes the biggest impact

