# Fix: "Email not confirmed" Error After Signup

## Problem

After users sign up, they're redirected to the login page and see "Email not confirmed" instead of going to their dashboard.

## Why This Happens

Supabase requires email confirmation by default. When users sign up:
1. Account is created but email is unconfirmed
2. User tries to access dashboard
3. Supabase checks if email is confirmed
4. Since it's not, access is denied
5. User is redirected to login with "Email not confirmed" error

## Solution Options

### Option 1: Disable Email Confirmation (Recommended for Development/Testing)

**Best for:** Development, testing, or when you want immediate access

1. Go to Supabase Dashboard
2. Navigate to **Authentication** > **Settings**
3. Under **Email Auth**, find **"Enable email confirmations"**
4. **Toggle it OFF** (disable)
5. Click **Save**

Now users will be able to sign in immediately after signup without email confirmation.

### Option 2: Keep Email Confirmation (Production Recommended)

**Best for:** Production environments where security is important

If you want to keep email confirmation enabled, you need to:

1. **Send confirmation email after signup**
2. **Handle the confirmation link**
3. **Redirect users to dashboard after confirmation**

This requires additional code changes. See the updated signup flow below.

### Option 3: Auto-Confirm Emails via API (Hybrid)

Use Supabase's service role to auto-confirm users during signup. This requires backend API routes.

## Quick Fix (Recommended for Now)

**Disable email confirmation in Supabase Dashboard:**

1. Open Supabase Dashboard
2. Go to **Authentication** > **Settings**
3. Find **"Enable email confirmations"**
4. Turn it **OFF**
5. Save

This will allow users to go directly to the dashboard after signup.

## Updated Code (For Option 2 - Email Confirmation Enabled)

If you want to keep email confirmation, update your signup page to handle it:

```typescript
// After signup, check if email confirmation is required
const { data, error: signUpError } = await signUpWithEmail(email, password)

if (signUpError) throw signUpError

if (data.user) {
  // Check if email confirmation is needed
  if (data.user.confirmed_at === null) {
    // Email confirmation required
    setMessage('Please check your email to confirm your account before signing in.')
    // Don't redirect to dashboard yet
    return
  } else {
    // Email already confirmed (or confirmation disabled)
    // Proceed to dashboard
    router.push('/dashboard')
  }
}
```

## Recommendation

For development and testing: **Disable email confirmation** (Option 1)
For production: **Enable email confirmation** and implement proper email handling (Option 2)


