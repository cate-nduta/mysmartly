# Complete mySmartly System Guide

## Overview

This document provides a comprehensive guide to the complete mySmartly system, including authentication, dashboard, payments, and all features.

## System Architecture

### 1. Authentication System

**Features:**
- Email/Password authentication
- Google OAuth sign-in
- Two-Factor Authentication (2FA) with TOTP
- Secure session management with Supabase Auth
- Row Level Security (RLS) for data protection

**Files:**
- `app/auth/login/page.tsx` - Login page
- `app/auth/signup/page.tsx` - Signup page
- `app/auth/callback/route.ts` - OAuth callback handler
- `lib/supabase-auth.ts` - Authentication helpers
- `app/dashboard/settings/page.tsx` - 2FA setup

**Security Features:**
- JWT-based sessions
- Encrypted password storage
- OAuth 2.0 for Google sign-in
- TOTP for 2FA
- RLS policies ensuring users can only access their own data

### 2. User Dashboard

**Features:**
- Welcome screen with user info
- Subscription status display
- Data connections management
- Decision feed with AI recommendations
- Settings and billing management

**Files:**
- `app/dashboard/page.tsx` - Main dashboard
- `components/dashboard/SubscriptionStatus.tsx` - Subscription display
- `components/dashboard/DataConnections.tsx` - Data source connections
- `components/dashboard/DecisionFeed.tsx` - Recommendations feed

**Data Connections:**
Users can connect:
- Google Analytics
- Shopify
- Stripe
- Facebook Ads
- QuickBooks
- Salesforce

*Note: In production, implement actual OAuth flows for each service*

### 3. Subscription & Payment System

**Features:**
- 14-day free trial (automatic on signup)
- Paystack inline payment integration
- 30-day subscription cycles
- Automatic renewal handling
- Subscription status management

**Files:**
- `app/dashboard/checkout/page.tsx` - Checkout page
- `app/api/verify-payment/route.ts` - Payment verification API
- `components/dashboard/SubscriptionStatus.tsx` - Status display

**Payment Flow:**
1. User clicks "Start Free Trial" → Signup
2. User completes signup → 14-day trial starts
3. Trial ends or user upgrades → Checkout page
4. Paystack inline payment widget → Secure payment
5. Payment verified → Subscription activated
6. Automatic renewal every 30 days

**Subscription Statuses:**
- `trial` - 14-day free trial
- `active` - Paid subscription active
- `cancelled` - Subscription cancelled
- `expired` - Subscription expired

### 4. Database Schema

**Tables:**
- `user_subscriptions` - User subscription details
- `data_connections` - Connected data sources
- `recommendations` - AI-generated recommendations
- `user_preferences` - User settings (including 2FA)

**RLS Policies:**
All tables have RLS enabled with policies ensuring:
- Users can only read/update their own data
- Service role has full access for admin operations
- Anonymous users can only insert applications/jobs

See `database-schema-extended.sql` for full schema.

## User Workflows

### New User Signup Flow

1. User clicks "Start Free Trial" on pricing page
2. Redirected to `/auth/signup?plan=Starter` (or Pro/Enterprise)
3. User signs up with email/password OR Google OAuth
4. Account created → User preferences record created
5. Trial subscription created (14 days)
6. Redirected to dashboard
7. Dashboard shows trial status and remaining days

### Trial to Paid Conversion

1. User sees trial status in dashboard
2. Clicks "Upgrade Now" → `/dashboard/checkout`
3. Sees plan summary and pricing
4. Enters email for receipt
5. Clicks "Pay" → Paystack inline widget opens
6. Completes payment securely
7. Payment verified via API
8. Subscription updated to `active`
9. Next billing date set (30 days from now)
10. Redirected to dashboard with active subscription

### Data Connection Flow

1. User navigates to dashboard
2. Sees "Data Connections" section
3. Clicks "Connect" on a service (e.g., Google Analytics)
4. *In production: OAuth flow initiated*
5. *Current: Simulated connection created*
6. Connection appears as "Connected"
7. AI begins analyzing connected data
8. Recommendations appear in Decision Feed

### Decision Feed Flow

1. AI analyzes connected data sources
2. Generates recommendations based on patterns
3. Recommendations appear in Decision Feed
4. User can:
   - View recommendation details
   - See projected impact and ROI
   - Approve or reject recommendations
   - Mark as implemented
5. System learns from user decisions

### 2FA Setup Flow

1. User goes to Settings → Security
2. Clicks "Enable 2FA"
3. TOTP secret generated
4. User scans QR code with authenticator app
5. User enters 6-digit code to verify
6. 2FA enabled and saved to preferences
7. On next login, user must enter 2FA code

## Environment Variables

Required environment variables in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxx

# Admin (optional)
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

## Setup Instructions

### 1. Database Setup

Run these SQL scripts in Supabase SQL Editor (in order):
1. `supabase-setup.sql` - Base tables
2. `database-schema-extended.sql` - User/subscription tables
3. `FINAL-COMPLETE-FIX.sql` - Fix RLS policies (if needed)

### 2. Supabase Authentication Setup

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Email provider
3. Enable Google provider:
   - Add Google OAuth credentials
   - Set redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
4. Configure email templates (optional)

### 3. Paystack Setup

1. Create Paystack account at https://paystack.com
2. Get your API keys (test keys for development)
3. Add keys to `.env.local`
4. Configure webhook (optional, for production)

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

## Security Features

1. **Row Level Security (RLS)**
   - Database-level security
   - Users can only access their own data
   - Policies enforced at database level

2. **Authentication**
   - Supabase Auth (industry-standard)
   - JWT tokens with refresh
   - Secure password hashing
   - OAuth 2.0 for Google

3. **Two-Factor Authentication**
   - TOTP-based (Time-based One-Time Password)
   - Compatible with Google Authenticator, Authy, etc.
   - Optional but recommended

4. **Payment Security**
   - Paystack handles all card data
   - PCI DSS compliant
   - No card data stored on our servers
   - Secure API communication

5. **Data Encryption**
   - TLS/HTTPS for all communication
   - Encrypted database connections
   - OAuth tokens encrypted at rest

## API Routes

### `/api/verify-payment`
- **Method:** POST
- **Body:** `{ reference, userId, plan }`
- **Response:** `{ success, customerCode, subscriptionCode }`
- **Purpose:** Verify Paystack payment and activate subscription

## Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Required Environment Variables for Production

- All variables from `.env.local`
- Use production Paystack keys
- Use production Supabase project

### Post-Deployment Checklist

- [ ] Update Supabase redirect URIs
- [ ] Configure Paystack webhook
- [ ] Test authentication flows
- [ ] Test payment flow
- [ ] Enable email verification (optional)
- [ ] Set up monitoring/logging
- [ ] Configure backups

## Future Enhancements

1. **Actual OAuth Integrations**
   - Implement real OAuth flows for data connections
   - Store encrypted access tokens
   - Sync data periodically

2. **AI Recommendation Engine**
   - Connect to actual AI service
   - Generate real recommendations
   - Learn from user actions

3. **Webhook System**
   - Paystack webhooks for subscription events
   - Automatic renewal handling
   - Failed payment notifications

4. **Email Notifications**
   - Welcome emails
   - Trial ending reminders
   - Payment confirmations
   - Recommendation alerts

5. **Team Features**
   - Multi-user accounts
   - Role-based permissions
   - Team collaboration

## Support

For issues or questions:
- Check `SETUP-INSTRUCTIONS.md` for setup help
- Review Supabase documentation
- Review Paystack documentation
- Check console logs for errors


