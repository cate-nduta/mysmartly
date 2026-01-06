# Dashboard Sidebar & Billing System Setup

## Overview
This update adds a comprehensive dashboard sidebar with Usage, Spending, and Billing sections, plus an always-visible Upgrade button for eligible users.

## Features Added

### 1. Collapsible Sidebar
- **Dashboard**: Main dashboard view with connections, decision feed, and AI chatbot
- **Usage**: Track decisions and connections based on plan limits
- **Spending**: Manage on-demand budget for exceeding plan limits
- **Billing & Invoices**: View payment history and upcoming invoices

### 2. Upgrade Button
- Always visible in the header for:
  - Free trial users
  - Users still on trial
  - Starter plan users (can upgrade to Pro)
- Automatically suggests the next tier plan

### 3. Usage Tracking
- Tracks decisions made per billing period
- Tracks data connections used
- Shows progress bars with color coding (green/yellow/red)
- Displays remaining usage for the current period

### 4. On-Demand Spending
- Set a budget for on-demand usage
- Charges are automatically deducted when plan limits are exceeded
- Visual progress indicator for budget usage
- Automatic Paystack charging when budget is depleted

### 5. Billing & Invoices
- View all past invoices and receipts
- See upcoming invoice details (due date, amount)
- Filter by invoice type (subscription vs on-demand)
- Download receipts via Paystack links

## Database Setup

Run the SQL script to create the necessary tables:

```bash
# In Supabase SQL Editor, run:
add-dashboard-tables.sql
```

This creates:
- `usage_tracking`: Tracks monthly usage per user
- `spending_limits`: Stores on-demand budgets
- `invoices`: Stores all payment invoices

## Paystack Webhook Configuration

1. **Set up webhook URL in Paystack Dashboard:**
   - Go to Settings > Webhooks
   - Add webhook URL: `https://mysmartly.app/api/paystack-webhook`
   - Select events:
     - `charge.success`
     - `transaction.success`
     - `subscription.create`
     - `subscription.update`
     - `invoice.create`
     - `invoice.update`

2. **Environment Variables:**
   Ensure these are set in your `.env.local`:
   ```
   PAYSTACK_SECRET_KEY=your_secret_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## API Routes Created

### `/api/paystack-webhook`
- Handles Paystack webhook events
- Automatically creates invoices on successful payments
- Updates subscription status
- Tracks on-demand spending

### `/api/charge-on-demand`
- Charges users for on-demand usage
- Creates pending invoices
- Returns Paystack authorization URL for payment

### Updated `/api/verify-payment`
- Now creates invoice records when payments are verified
- Links invoices to subscriptions

## Components Created

1. **DashboardSidebar.tsx**: Collapsible sidebar navigation
2. **UsageSection.tsx**: Usage tracking and limits display
3. **SpendingSection.tsx**: On-demand budget management
4. **BillingSection.tsx**: Invoice history and upcoming payments

## How It Works

### Usage Tracking
- When users make decisions or add connections, the system tracks usage
- Usage is tracked per billing period (monthly)
- Progress bars show how close users are to their limits

### On-Demand Spending
1. User sets a budget in the Spending section
2. When plan limits are exceeded:
   - System checks if on-demand budget is available
   - If budget exists, usage continues
   - Charges are tracked against the budget
3. When budget is depleted:
   - System calls `/api/charge-on-demand`
   - User is redirected to Paystack to add more funds
   - New budget is added to their account

### Invoice Management
- All payments (subscription and on-demand) create invoice records
- Paystack webhook automatically updates invoice status
- Users can view and download receipts
- Upcoming invoices show next billing date

## Testing

1. **Test Usage Tracking:**
   - Create a recommendation or connection
   - Check Usage section to see count update

2. **Test On-Demand Budget:**
   - Set a budget in Spending section
   - Exceed plan limits
   - Verify charges are tracked

3. **Test Invoices:**
   - Make a payment
   - Check Billing section for invoice
   - Verify webhook creates invoice automatically

## Notes

- The sidebar is collapsible - click the arrow icon to toggle
- Upgrade button only shows for eligible users
- All financial data is stored securely in Supabase
- Paystack webhooks ensure invoices are always up-to-date
- On-demand charges require user to have a payment method on file

