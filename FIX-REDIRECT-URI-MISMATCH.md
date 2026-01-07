# Fix Redirect URI Mismatch Error

## The Problem
Error: `redirect_uri_mismatch` means the redirect URI in your Google Cloud Console doesn't match what your app is sending.

## Quick Fix Steps

### Step 1: Check Your Current Environment Variable

Open your `.env.local` file and check what `GOOGLE_REDIRECT_URI` is set to:

```env
GOOGLE_REDIRECT_URI=https://mysmartly.app/api/oauth/google/callback
```

**OR if testing locally:**
```env
GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/google/callback
```

### Step 2: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID (the one you created)
3. Look at the "Authorized redirect URIs" section

### Step 3: Add the Exact URI

You need to add **BOTH** URIs (development and production):

1. Click "Add URI" button
2. Add these **exact** URIs (one at a time):
   ```
   http://localhost:3000/api/oauth/google/callback
   https://mysmartly.app/api/oauth/google/callback
   ```

**Important Notes:**
- ✅ Must match **exactly** (including `http` vs `https`)
- ✅ No trailing slashes
- ✅ Case-sensitive
- ✅ Must include the full path: `/api/oauth/google/callback`

### Step 4: Save and Wait

1. Click "Save" at the bottom
2. **Wait 1-2 minutes** for changes to propagate (Google caches these settings)

### Step 5: Test Again

1. Make sure your `.env.local` matches one of the URIs you added
2. Restart your development server
3. Try connecting again

## Common Mistakes

### ❌ Wrong Protocol
- Wrong: `http://mysmartly.app/api/oauth/google/callback` (should be `https`)
- Wrong: `https://localhost:3000/api/oauth/google/callback` (should be `http`)

### ❌ Trailing Slash
- Wrong: `https://mysmartly.app/api/oauth/google/callback/`
- Correct: `https://mysmartly.app/api/oauth/google/callback`

### ❌ Missing Path
- Wrong: `https://mysmartly.app/`
- Correct: `https://mysmartly.app/api/oauth/google/callback`

### ❌ Wrong Domain
- Make sure the domain matches exactly (no `www.` if you didn't add it)

## For Local Development

If you're testing on `localhost:3000`, make sure:

1. **Google Cloud Console** has:
   ```
   http://localhost:3000/api/oauth/google/callback
   ```

2. **Your `.env.local`** has:
   ```env
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/google/callback
   ```

3. **Restart your server** after changing `.env.local`

## For Production

If you're deploying to production:

1. **Google Cloud Console** must have:
   ```
   https://your-actual-domain.com/api/oauth/google/callback
   ```

2. **Your production environment variables** (Vercel, Netlify, etc.) must have:
   ```env
   GOOGLE_REDIRECT_URI=https://your-actual-domain.com/api/oauth/google/callback
   ```

## Still Not Working?

1. **Double-check the exact URI** in the error message
   - The error shows: `redirect_uri=https://mysmartly.app/api/oauth/google/callback`
   - Make sure this **exact** string is in Google Cloud Console

2. **Clear browser cache** and try again

3. **Wait a few minutes** - Google sometimes takes time to update

4. **Check for typos** - even one character difference will fail

5. **Verify you're editing the correct OAuth client** - make sure you're editing the Web application client, not a different one

## Quick Checklist

- [ ] Added `http://localhost:3000/api/oauth/google/callback` to Google Cloud Console
- [ ] Added `https://mysmartly.app/api/oauth/google/callback` to Google Cloud Console
- [ ] `.env.local` has the correct URI (matching one of the above)
- [ ] No trailing slashes
- [ ] Correct protocol (`http` for localhost, `https` for production)
- [ ] Saved changes in Google Cloud Console
- [ ] Waited 1-2 minutes after saving
- [ ] Restarted development server
- [ ] Tried again

