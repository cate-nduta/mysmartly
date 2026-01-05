# Quick Password Reset Email Template Setup

## What to Do with `{{ .ConfirmationURL }}`

**Answer: NOTHING!** 🎉

`{{ .ConfirmationURL }}` is a **Supabase template variable** - you should keep it exactly as written. Supabase will automatically replace it with the actual password reset link when sending the email.

## Quick Setup Steps

1. **Go to Supabase Dashboard:**
   - Navigate to **Authentication** → **Email Templates**
   - Click on **"Reset Password"** template

2. **Copy and Paste the Template:**
   - Copy the entire HTML template from `SUPABASE-PASSWORD-RESET-TEMPLATE.md`
   - Paste it into the **Body (HTML)** field in Supabase
   - **DO NOT modify `{{ .ConfirmationURL }}` or `{{ .Email }}`** - leave them exactly as they are

3. **Set the Subject Line:**
   ```
   Reset Your MySmartly Password
   ```

4. **Configure Redirect URL:**
   - Go to **Authentication** → **URL Configuration**
   - Add to **Redirect URLs**:
     ```
     http://localhost:3000/auth/reset-password
     ```
   - (Add your production URL when ready)

5. **Save and Test:**
   - Click **Save** in Supabase
   - Test by going to `/auth/forgot-password` and requesting a reset

## Template Variables Explained

When Supabase sends the password reset email, it automatically replaces:

- `{{ .ConfirmationURL }}` → Becomes something like: `https://yourproject.supabase.co/auth/v1/verify?token=abc123&type=recovery&redirect_to=http://localhost:3000/auth/reset-password`
- `{{ .Email }}` → Becomes the user's actual email address (e.g., `user@example.com`)

**You don't need to do anything - Supabase handles this automatically!**

## Example

When the email is sent, your template:
```html
<a href="{{ .ConfirmationURL }}" class="button">Reset My Password</a>
```

Becomes:
```html
<a href="https://xyz.supabase.co/auth/v1/verify?token=abc123&type=recovery&redirect_to=http://localhost:3000/auth/reset-password" class="button">Reset My Password</a>
```

Supabase does this replacement automatically - you just paste the template as-is! ✅

