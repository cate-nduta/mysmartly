# Tier-Specific Applications & Trial Limits Setup

## Overview
This update allows admins to configure which applications appear for each pricing tier, and ensures free trials always get half the tokens and decisions of the plan.

## SQL Scripts to Run

### 1. Add Tier Applications and Limits to Pricing Plans
Run `ADD-TIER-APPLICATIONS-AND-LIMITS.sql` in Supabase SQL Editor:
- Adds `available_applications` column (array of connection types)
- Adds `tokens_limit` column (integer)
- Adds `decisions_limit` column (integer)
- Sets default applications and limits for existing plans

### 2. Add Limits to User Subscriptions
Run `UPDATE-SUBSCRIPTION-LIMITS.sql` in Supabase SQL Editor:
- Adds `tokens_limit` and `decisions_limit` to `user_subscriptions` table
- Updates existing subscriptions with appropriate limits

## How It Works

### Admin Configuration
1. Go to Admin Dashboard → Pricing Plans
2. Click "Edit" on any plan
3. You'll see:
   - **Available Applications**: Checkboxes to select which apps this tier can access
   - **Tokens Limit**: Set the token limit for this tier
   - **Decisions Limit**: Set the decisions limit for this tier
   - **Trial Preview**: Shows what trial users will get (half of plan limits)

### Client Dashboard
- Users only see applications configured for their tier
- If no apps are configured, all apps are shown (backward compatibility)
- Applications are filtered based on user's subscription plan

### Free Trial Limits
- When a user signs up, they get a trial subscription
- Trial limits are automatically set to **half** of the plan's limits
- Example:
  - Plan: 500 tokens, 300 decisions
  - Trial: 250 tokens, 150 decisions

### When User Upgrades
- After successful payment, subscription is updated with **full** plan limits
- Limits are fetched from `pricing_plans` table
- Trial limits are replaced with full plan limits

## Available Application Types
- `google_analytics` - Google Analytics 4
- `google_ads` - Google Ads
- `shopify` - Shopify
- `instagram_page` - Instagram Page
- `instagram_ads` - Instagram Ads
- `quickbooks` - QuickBooks
- `hubspot` - HubSpot
- `zendesk` - Zendesk
- `youtube_ads` - YouTube Ads
- `tiktok_ads` - TikTok Ads
- `facebook_ads` - Facebook Ads

## Default Configuration
After running the SQL scripts:
- **Starter**: Google Analytics, Google Ads, Shopify (250 tokens, 150 decisions)
- **Pro**: Google Analytics, Google Ads, Shopify, Instagram Page, Instagram Ads (5000 tokens, 5000 decisions)
- **Enterprise**: All applications (999999 tokens, 999999 decisions)

## Important Notes
1. **Always run both SQL scripts** before using the feature
2. **Trial limits are calculated automatically** - you don't need to set them manually
3. **When you change plan limits**, existing trial users keep their current limits until they upgrade
4. **New signups** will get the updated trial limits (half of current plan limits)
5. **Paystack integration** is already configured and working for payments

