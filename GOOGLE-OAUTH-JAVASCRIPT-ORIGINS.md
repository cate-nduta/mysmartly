# Google OAuth: Authorized JavaScript Origins Explained

## Quick Answer

**Yes, you can change it!** The Supabase URL (`https://rmnjqlfbpomvklxgekgu.supabase.co`) is **NOT needed** for your OAuth flow. You should change it to your actual app domains.

## What's the Difference?

### Authorized JavaScript Origins
- **What it's for**: Client-side JavaScript OAuth flows (like Google Sign-In button in browser)
- **Format**: Just the domain origin (no path)
- **Example**: `http://localhost:3000` or `https://mysmartly.app`

### Authorized Redirect URIs
- **What it's for**: Server-side OAuth flows (what we're using)
- **Format**: Full URL including the callback path
- **Example**: `http://localhost:3000/api/oauth/google/callback` or `https://mysmartly.app/api/oauth/google/callback`

## What You Should Set

### Authorized JavaScript Origins
Add these (one at a time):
```
http://localhost:3000
https://mysmartly.app
```

**Note**: Replace `mysmartly.app` with your actual production domain if different.

### Authorized Redirect URIs
Add these (one at a time):
```
http://localhost:3000/api/oauth/google/callback
https://mysmartly.app/api/oauth/google/callback
```

## Why Remove the Supabase URL?

The Supabase URL (`https://rmnjqlfbpomvklxgekgu.supabase.co`) was likely added by mistake or from a different setup. Your OAuth flow goes:
1. User clicks "Connect" on your app
2. Redirects to Google OAuth
3. Google redirects back to **your app's callback** (`/api/oauth/google/callback`)
4. **NOT** to Supabase

So the Supabase URL is not needed and can be removed.

## Steps to Fix

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Find your OAuth 2.0 Client ID

2. **Update Authorized JavaScript Origins**
   - Remove: `https://rmnjqlfbpomvklxgekgu.supabase.co`
   - Add: `http://localhost:3000`
   - Add: `https://mysmartly.app` (or your production domain)

3. **Verify Authorized Redirect URIs**
   - Should have: `http://localhost:3000/api/oauth/google/callback`
   - Should have: `https://mysmartly.app/api/oauth/google/callback`
   - Remove any Supabase URLs if present

4. **Save Changes**

## Will It Still Work?

**Yes!** After you update it:
- Your OAuth flow will work exactly the same
- The Supabase URL was never actually used
- You'll have cleaner, correct configuration

## Important Notes

- **JavaScript Origins** = Domain only (no path)
- **Redirect URIs** = Full URL with callback path
- Both should match your actual app domains
- Supabase URL is not needed for this OAuth flow

