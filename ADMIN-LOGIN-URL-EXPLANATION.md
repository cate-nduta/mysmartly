# Admin Login URL Explanation

## What URL Are You Seeing?

When you try to login as admin, you'll see different URLs depending on where you are in the process:

### 1. **Initial Admin Login Page**
- **URL**: `https://mysmartly.app/admin` or `http://localhost:3000/admin`
- **What you see**: "Admin Login" page with "Continue with Google" button
- **This is your website's admin page**

### 2. **Google OAuth Redirect (The Confusing One)**
- **URL**: `https://accounts.google.com/...` or `https://rmnjqlfbpomvklxgekgu.supabase.co/auth/v1/callback`
- **What you see**: Google sign-in page showing "Sign in to rmnjqlfbpomvklxgekgu.supabase.co"
- **This is the Supabase OAuth callback URL**

### 3. **After Google Sign-In**
- **URL**: `https://rmnjqlfbpomvklxgekgu.supabase.co/auth/v1/callback?code=...`
- **What happens**: Supabase processes the OAuth callback
- **Then redirects to**: `https://mysmartly.app/auth/callback?admin=true`

### 4. **Final Redirect**
- **URL**: `https://mysmartly.app/admin`
- **What you see**: Admin dashboard (if authenticated and authorized)

## Why You See the Supabase URL

The URL `rmnjqlfbpomvklxgekgu.supabase.co` is your **Supabase project's authentication endpoint**. Here's why it appears:

1. **OAuth Flow**: When you click "Continue with Google" on the admin page:
   - Your app redirects to Google for authentication
   - Google redirects back to Supabase's callback URL
   - Supabase processes the authentication
   - Supabase redirects back to your app

2. **The Supabase Domain**: 
   - `rmnjqlfbpomvklxgekgu` is your Supabase project ID
   - `.supabase.co` is Supabase's domain
   - This is where Supabase handles the OAuth callback

## Is This Normal?

**Yes, this is completely normal!** The Supabase URL is part of the OAuth flow. However, you can make it look more professional by:

### Option 1: Update Google OAuth Consent Screen (Quick Fix)
- Change the app name from "rmnjqlfbpomvklxgekgu.supabase.co" to "mySmartly"
- Users will see "Sign in to mySmartly" instead
- See `PROFESSIONAL-OAUTH-SETUP.md` for instructions

### Option 2: Use Custom Domain (Advanced)
- Set up a custom domain in Supabase (requires Pro plan)
- Use `auth.mysmartly.app` instead of the Supabase subdomain
- More professional but requires additional setup

## Current Admin Login Flow

```
1. User visits: https://mysmartly.app/admin
   ↓
2. Clicks "Continue with Google"
   ↓
3. Redirects to: https://accounts.google.com/...
   (Shows: "Sign in to rmnjqlfbpomvklxgekgu.supabase.co")
   ↓
4. User signs in with Google
   ↓
5. Google redirects to: https://rmnjqlfbpomvklxgekgu.supabase.co/auth/v1/callback
   ↓
6. Supabase processes authentication
   ↓
7. Supabase redirects to: https://mysmartly.app/auth/callback?admin=true
   ↓
8. Your app checks if user is admin
   ↓
9. If admin + 2FA verified → Admin Dashboard
   If not admin → Access denied message
```

## Troubleshooting

### "Access denied. You do not have admin privileges."
- **Cause**: Your user ID is not in the `admin_users` table
- **Fix**: Add your user to the admin_users table in Supabase

### "Two-Factor Authentication Required"
- **Cause**: You're an admin but haven't enabled 2FA
- **Fix**: 
  1. Sign in as regular user
  2. Go to `/dashboard/settings`
  3. Enable 2FA
  4. Try admin login again

### Stuck on Supabase URL
- **Cause**: OAuth callback is not redirecting properly
- **Fix**: Check that redirect URLs are configured correctly in Google Cloud Console

## What URL Should You Share?

**Never share the Supabase callback URL publicly!** 

- ✅ **Share**: `https://mysmartly.app/admin` (your admin login page)
- ❌ **Don't share**: `https://rmnjqlfbpomvklxgekgu.supabase.co/auth/v1/callback` (internal OAuth callback)

## Summary

The Supabase URL (`rmnjqlfbpomvklxgekgu.supabase.co`) is:
- ✅ **Normal** - Part of the OAuth authentication flow
- ✅ **Secure** - Handled by Supabase's secure infrastructure
- ⚠️ **Can be improved** - Update Google OAuth consent screen to show "mySmartly" instead

The URL appears briefly during the OAuth redirect process, but users end up back on your domain for the actual admin dashboard.

