# Complete Setup Instructions for mySmartly Authentication & Dashboard

This guide will help you set up the complete authentication system, user dashboard, and payment integration.

## Step 1: Enable Google OAuth in Supabase

**IMPORTANT:** See `GOOGLE-OAUTH-SETUP.md` for detailed step-by-step instructions.

Quick steps:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or select existing)
3. Enable Google+ API
4. Configure OAuth consent screen
5. Create OAuth 2.0 credentials (Web application type)
6. Add redirect URI: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
   - Replace `YOUR_PROJECT_ID` with your Supabase project ID
7. Copy Client ID and Client Secret
8. In Supabase Dashboard:
   - Go to **Authentication** > **Providers**
   - Enable **Google** provider
   - Paste Client ID and Client Secret
   - Click **Save**

**Note:** The error "At least one Client ID is required" means you need to add the Client ID and Client Secret from Google Cloud Console.

## Step 2: Enable Email Authentication

1. In Supabase Dashboard, go to **Authentication** > **Settings**
2. Enable **Email** provider
3. Configure email templates if needed

## Step 3: Run Database Schema

Run `database-schema-extended.sql` in your Supabase SQL Editor. This creates:
- `user_subscriptions` table
- `data_connections` table  
- `recommendations` table
- `user_preferences` table
- All necessary RLS policies

## Step 4: Set Up Paystack

1. Create account at [Paystack](https://paystack.com/)
2. Get your Public Key and Secret Key
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
   PAYSTACK_SECRET_KEY=sk_test_xxxxx
   ```

## Step 5: Configure Environment Variables

Update your `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

## Step 6: Enable 2FA (Two-Factor Authentication)

2FA is automatically supported through Supabase Auth. Users can enable it in their dashboard settings after signing up.

## Security Features

- **Supabase Auth**: Industry-standard authentication
- **Row Level Security (RLS)**: Database-level security - users can only access their own data
- **OAuth 2.0**: Secure Google sign-in
- **2FA Support**: TOTP-based two-factor authentication
- **Encrypted Tokens**: OAuth tokens stored encrypted
- **Secure Sessions**: JWT-based sessions with refresh tokens

## Next Steps

After setup, users can:
1. Sign up with email or Google
2. Start 14-day free trial
3. Access dashboard
4. Connect data sources
5. View recommendations
6. Upgrade to paid plan via Paystack

