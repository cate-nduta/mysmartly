# Fix: App Using Production URL Instead of Localhost

## The Problem

Your app is trying to use `https://mysmartly.app/api/oauth/google/callback` instead of `http://localhost:3000/api/oauth/google/callback`.

This happens because the code falls back to `NEXT_PUBLIC_SITE_URL` if `GOOGLE_REDIRECT_URI` is not set.

## Solution

### Step 1: Check Your `.env.local` File

Open your `.env.local` file and make sure you have:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/google/callback
```

**Important**: Make sure `GOOGLE_REDIRECT_URI` is set and points to localhost.

### Step 2: Check NEXT_PUBLIC_SITE_URL

If you have `NEXT_PUBLIC_SITE_URL` set to the production URL, that's fine - it won't be used if `GOOGLE_REDIRECT_URI` is set.

But if you want to be safe, you can temporarily comment it out or set it to localhost:

```env
# NEXT_PUBLIC_SITE_URL=https://mysmartly.app
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 3: Restart Your Server

**CRITICAL**: After changing `.env.local`, you MUST restart your development server:

1. Stop the server (press `Ctrl+C` in the terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

Environment variables are only loaded when the server starts!

### Step 4: Verify in Google Cloud Console

Make sure you have BOTH URIs added in Google Cloud Console:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on "mySmartly Web Client"
3. In "Authorized redirect URIs", make sure you have:
   - `http://localhost:3000/api/oauth/google/callback` ✅
   - `https://mysmartly.app/api/oauth/google/callback` (for later)

### Step 5: Test Again

1. Make sure server is restarted
2. Try connecting Google Analytics again
3. It should now use `http://localhost:3000/api/oauth/google/callback`

## Quick Checklist

- [ ] `.env.local` has `GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/google/callback`
- [ ] No typos in the URI (no trailing slash, correct protocol)
- [ ] Server was restarted after changing `.env.local`
- [ ] Google Cloud Console has `http://localhost:3000/api/oauth/google/callback` added
- [ ] Tried connecting again

## Still Not Working?

1. **Double-check the exact value** in `.env.local`:
   ```env
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/google/callback
   ```
   (No quotes, no spaces, exact match)

2. **Check server logs** - when you start the server, it should show if env vars are loaded

3. **Verify the server actually restarted** - sometimes the terminal shows it's running but it's using old env vars

4. **Add a console.log** (temporarily) in `app/api/oauth/google/route.ts`:
   ```typescript
   console.log('Redirect URI:', redirectUri)
   ```
   This will show you what URI is actually being used.

