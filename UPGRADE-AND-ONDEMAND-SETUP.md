# Upgrade & On-Demand Usage System Setup

## Overview
This system implements:
1. **Upgrade Page**: Users can choose which tier to upgrade to
2. **Early Renewal Prevention**: Users cannot renew their current plan early
3. **On-Demand Usage**: When users exceed limits mid-month, they can use on-demand budget
4. **Automatic Invoice Emails**: 5 days before renewal, users receive email invoices for on-demand charges

## Features

### 1. Upgrade Page (`/dashboard/upgrade`)
- Shows all available plans
- Highlights current plan
- Only allows upgrades to higher tiers (not downgrades)
- Prevents selecting the same plan

### 2. Early Renewal Prevention
- Users cannot pay for the same plan before their billing period ends
- If they try, they see: "You cannot renew your current plan early. Please wait until your billing period ends, or upgrade to a higher tier."

### 3. On-Demand Usage Flow
When a user exceeds their plan limits mid-month:
1. System checks if they have on-demand budget set
2. If yes, usage continues and charges are tracked
3. If no budget, they must either:
   - Set an on-demand budget
   - Upgrade to a higher tier

### 4. Automatic Invoice System
- 5 days before subscription renewal:
  - System checks for on-demand spending
  - Creates invoice for all on-demand charges
  - Sends email notification to user
  - User must pay invoice before subscription can renew

## API Routes

### `/api/check-usage-limits`
**Purpose**: Check if user has exceeded plan limits
**Method**: POST
**Body**: `{ userId }`
**Returns**: 
```json
{
  "canProceed": true/false,
  "reason": "limit_exceeded",
  "usage": { ... },
  "onDemand": { ... }
}
```

### `/api/send-ondemand-invoice`
**Purpose**: Send email invoice for on-demand charges
**Method**: POST
**Body**: `{ userId, invoiceId }`
**Returns**: `{ success: true }`

### `/api/check-ondemand-invoices`
**Purpose**: Cron job to check and create invoices 5 days before renewal
**Method**: POST
**Returns**: `{ invoicesProcessed: number, results: [...] }`

## Database Tables

All tables are created in `add-dashboard-tables.sql`:
- `usage_tracking`: Tracks monthly usage
- `spending_limits`: Stores on-demand budgets
- `invoices`: Stores all invoices (subscription + on-demand)

## Cron Job Setup

You need to set up a daily cron job to check for invoices that need to be sent.

### Option 1: Vercel Cron (Recommended)
Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/check-ondemand-invoices",
    "schedule": "0 9 * * *"
  }]
}
```

### Option 2: External Cron Service
Use a service like:
- **cron-job.org**
- **EasyCron**
- **Cronitor**

Set it to call: `https://yourdomain.com/api/check-ondemand-invoices` daily at 9 AM.

### Option 3: Server Cron (if self-hosted)
```bash
# Add to crontab
0 9 * * * curl -X POST https://yourdomain.com/api/check-ondemand-invoices
```

## Email Configuration

Ensure these environment variables are set:
```
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465
ZOHO_SMTP_USER=hello@mysmartly.app
ZOHO_SMTP_PASS=your_app_password
ZOHO_FROM_EMAIL=hello@mysmartly.app
EMAIL_FROM_NAME=mySmartly
NEXT_PUBLIC_SITE_URL=https://mysmartly.app
```

## Workflow Example

### Scenario: User on Starter Plan
1. **Feb 1**: User subscribes to Starter ($149/month)
   - Billing period: Feb 1 - Mar 1
   - Limit: 500 decisions/month

2. **Feb 15**: User exceeds 500 decisions
   - System checks: No on-demand budget set
   - User sees: "Plan limit exceeded. Please upgrade or set on-demand budget."
   - User sets $50 on-demand budget
   - Usage continues, charges tracked

3. **Feb 24** (5 days before renewal):
   - Cron job runs
   - Checks: User has $30 in on-demand charges
   - Creates invoice: $30
   - Sends email: "Payment Required: On-Demand Usage Invoice"
   - Invoice due: Mar 1 (same day as renewal)

4. **Feb 25-28**: User pays invoice
   - Invoice status: "paid"
   - Subscription can renew on Mar 1

5. **Mar 1**: Subscription renews
   - New billing period starts
   - On-demand spending resets to $0
   - Budget remains set for future use

## Testing

1. **Test Upgrade Page**:
   - Go to `/dashboard/upgrade`
   - Verify current plan is highlighted
   - Try to select same plan (should be disabled)
   - Try to select lower tier (should be disabled)

2. **Test Early Renewal Prevention**:
   - Try to checkout with same plan before period ends
   - Should see error message

3. **Test On-Demand Invoice**:
   - Set on-demand budget
   - Exceed plan limits
   - Manually trigger cron job: `POST /api/check-ondemand-invoices`
   - Check email for invoice notification

4. **Test Invoice Payment**:
   - View pending invoice in Billing section
   - Click "Pay Invoice Now"
   - Complete payment
   - Verify invoice status updates

## Important Notes

- Users **cannot** renew their current plan early
- On-demand invoices **must** be paid before subscription renewal
- If invoice is not paid, subscription renewal may be blocked
- On-demand spending resets each billing period
- Budget amount persists but spending resets

## Troubleshooting

**Issue**: Invoices not being created
- Check cron job is running
- Verify `check-ondemand-invoices` API route is accessible
- Check server logs for errors

**Issue**: Emails not sending
- Verify Zoho SMTP credentials
- Check email_logs table for errors
- Test email sending manually

**Issue**: Users can still renew early
- Verify checkout page has early renewal check
- Check subscription.current_period_end is being validated

