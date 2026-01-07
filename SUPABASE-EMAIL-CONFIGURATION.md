# Supabase Email Template Configuration Guide

This guide ensures all Supabase email templates use the correct production URL (`https://mysmartly.app`) instead of localhost.

## ⚠️ Important: Configure in Supabase Dashboard

All email templates must be configured in your Supabase Dashboard. The codebase cannot directly modify these templates.

## Step-by-Step Configuration

### 1. Access Supabase Email Templates

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Email Templates**
4. You'll see all available email templates

### 2. Configure Each Email Template

For **EACH** email template, you need to update the redirect URLs. Replace any `localhost` or placeholder URLs with your production URL.

#### Required Production URL
```
https://mysmartly.app
```

---

## Email Templates to Configure

### 1. **Confirm sign up** (Email Confirmation)

**Subject:** `Confirm your signup`

**Body Template:**
```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

**Important:** The `{{ .ConfirmationURL }}` will automatically include the correct redirect URL if configured in the template settings below.

**Redirect URL Setting:**
- In the template settings, set **Redirect URL** to: `https://mysmartly.app/auth/callback?type=signup`

---

### 2. **Invite user** (User Invitation)

**Subject:** `You have been invited`

**Body Template:**
```html
<h2>You have been invited</h2>

<p>You have been invited to create a user on {{ .SiteURL }}. Follow this link to accept the invite:</p>
<p><a href="{{ .ConfirmationURL }}">Accept the invite</a></p>
```

**Redirect URL Setting:**
- Set **Redirect URL** to: `https://mysmartly.app/auth/callback?type=invite`

---

### 3. **Magic link** (Passwordless Sign-in)

**Subject:** `Magic Link`

**Body Template:**
```html
<h2>Magic Link</h2>

<p>Follow this link to login:</p>
<p><a href="{{ .ConfirmationURL }}">Log In</a></p>
```

**Redirect URL Setting:**
- Set **Redirect URL** to: `https://mysmartly.app/auth/callback?type=magiclink`

---

### 4. **Change email address** (Email Change Verification)

**Subject:** `Confirm your email change`

**Body Template:**
```html
<h2>Confirm your email change</h2>

<p>Follow this link to confirm the update:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm email change</a></p>
```

**Redirect URL Setting:**
- Set **Redirect URL** to: `https://mysmartly.app/auth/callback?type=email_change`

---

### 5. **Reset password** (Password Recovery) ⚠️ CRITICAL

**Subject:** `Reset Your Password`

**Body Template:**
```html
<h2>Reset Your Password</h2>

<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>

<p>If you didn't request this, you can safely ignore this email.</p>
```

**Redirect URL Setting:**
- Set **Redirect URL** to: `https://mysmartly.app/auth/reset-password`

**⚠️ This is the most important one!** Make sure this points to your production reset password page.

---

### 6. **Reauthentication** (Re-authentication Request)

**Subject:** `Confirm your action`

**Body Template:**
```html
<h2>Confirm your action</h2>

<p>Follow this link to confirm:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm</a></p>
```

**Redirect URL Setting:**
- Set **Redirect URL** to: `https://mysmartly.app/auth/callback?type=reauthentication`

---

## Security Email Templates

### 7. **Password changed** (Security Notification)

**Subject:** `Your password has been changed`

**Body Template:**
```html
<h2>Password Changed</h2>

<p>Your password has been successfully changed.</p>
<p>If you didn't make this change, please contact support immediately.</p>

<p><a href="https://mysmartly.app">Visit mySmartly</a></p>
```

**Note:** This is a notification email, no redirect URL needed.

---

### 8. **Email address changed** (Security Notification)

**Subject:** `Your email address has been changed`

**Body Template:**
```html
<h2>Email Address Changed</h2>

<p>Your email address has been successfully changed to: {{ .NewEmail }}</p>
<p>If you didn't make this change, please contact support immediately.</p>

<p><a href="https://mysmartly.app">Visit mySmartly</a></p>
```

**Note:** This is a notification email, no redirect URL needed.

---

### 9. **Phone number changed** (Security Notification)

**Subject:** `Your phone number has been changed`

**Body Template:**
```html
<h2>Phone Number Changed</h2>

<p>Your phone number has been successfully changed.</p>
<p>If you didn't make this change, please contact support immediately.</p>

<p><a href="https://mysmartly.app">Visit mySmartly</a></p>
```

**Note:** This is a notification email, no redirect URL needed.

---

### 10. **Identity linked** (Security Notification)

**Subject:** `New sign-in method added`

**Body Template:**
```html
<h2>New Sign-in Method Added</h2>

<p>A new sign-in method has been added to your account.</p>
<p>If you didn't add this, please contact support immediately.</p>

<p><a href="https://mysmartly.app">Visit mySmartly</a></p>
```

**Note:** This is a notification email, no redirect URL needed.

---

### 11. **Identity unlinked** (Security Notification)

**Subject:** `Sign-in method removed`

**Body Template:**
```html
<h2>Sign-in Method Removed</h2>

<p>A sign-in method has been removed from your account.</p>
<p>If you didn't remove this, please contact support immediately.</p>

<p><a href="https://mysmartly.app">Visit mySmartly</a></p>
```

**Note:** This is a notification email, no redirect URL needed.

---

### 12. **Multi-factor authentication method added** (Security Notification)

**Subject:** `MFA method added`

**Body Template:**
```html
<h2>MFA Method Added</h2>

<p>A new multi-factor authentication method has been added to your account.</p>
<p>If you didn't add this, please contact support immediately.</p>

<p><a href="https://mysmartly.app">Visit mySmartly</a></p>
```

**Note:** This is a notification email, no redirect URL needed.

---

### 13. **Multi-factor authentication method removed** (Security Notification)

**Subject:** `MFA method removed`

**Body Template:**
```html
<h2>MFA Method Removed</h2>

<p>A multi-factor authentication method has been removed from your account.</p>
<p>If you didn't remove this, please contact support immediately.</p>

<p><a href="https://mysmartly.app">Visit mySmartly</a></p>
```

**Note:** This is a notification email, no redirect URL needed.

---

## Global Site URL Configuration

### In Supabase Dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://mysmartly.app`
3. Set **Redirect URLs** to include:
   ```
   https://mysmartly.app/**
   https://mysmartly.app/auth/callback
   https://mysmartly.app/auth/reset-password
   https://mysmartly.app/auth/callback?type=*
   ```

This ensures all email links default to your production site.

---

## Testing Email Templates

### Test Each Template:

1. **Password Reset:**
   - Go to `/auth/forgot-password`
   - Enter your email
   - Check the email you receive
   - Verify the link goes to `https://mysmartly.app/auth/reset-password` (NOT localhost)

2. **Email Confirmation:**
   - Sign up a new user
   - Check the confirmation email
   - Verify the link goes to `https://mysmartly.app/auth/callback?type=signup`

3. **Magic Link:**
   - Request a magic link
   - Check the email
   - Verify the link goes to `https://mysmartly.app/auth/callback?type=magiclink`

---

## Common Issues

### ❌ Problem: Links still point to localhost

**Solution:**
- Check the **Site URL** in Authentication → URL Configuration
- Verify each email template's redirect URL setting
- Clear browser cache and test again

### ❌ Problem: Links point to Supabase domain

**Solution:**
- This is normal for the initial redirect
- The final redirect should go to `https://mysmartly.app`
- Check that your redirect URLs are set correctly

### ❌ Problem: Email not received

**Solution:**
- Check Supabase → Settings → Auth → SMTP Settings
- Verify your SMTP configuration
- Check spam folder
- Verify email is not blocked

---

## Environment Variables

Make sure your `.env.local` (and production environment) has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://mysmartly.app
```

The `NEXT_PUBLIC_SITE_URL` is used in the codebase for generating correct redirect URLs.

---

## Quick Checklist

- [ ] Site URL set to `https://mysmartly.app` in Supabase
- [ ] Redirect URLs include `https://mysmartly.app/**`
- [ ] Password reset template redirects to `https://mysmartly.app/auth/reset-password`
- [ ] Email confirmation template redirects to `https://mysmartly.app/auth/callback?type=signup`
- [ ] Magic link template redirects to `https://mysmartly.app/auth/callback?type=magiclink`
- [ ] All security notification emails link to `https://mysmartly.app`
- [ ] Tested password reset flow
- [ ] Tested email confirmation flow
- [ ] No localhost URLs in any templates
- [ ] Environment variable `NEXT_PUBLIC_SITE_URL` is set

---

## Support

If you encounter issues:
1. Check Supabase Dashboard → Authentication → Email Templates
2. Verify all redirect URLs are correct
3. Test each email flow
4. Check browser console for errors
5. Verify environment variables are set correctly

---

**Last Updated:** This guide should be reviewed whenever deploying to production or changing domains.

