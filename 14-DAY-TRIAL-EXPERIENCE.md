# 14-Day Free Trial Experience Guide

## What Customers Get During the 14-Day Trial

When a customer signs up for mySmartly, they automatically receive a **14-day free trial** with access to the **Starter plan features**. Here's what they can do:

---

## Trial Plan Features (Starter Plan)

### 1. **Data Connections** (Up to 3 connections)
- Connect up to **3 data sources** from:
  - Google Analytics
  - Shopify
  - Stripe
  - Facebook Ads
  - QuickBooks
  - Salesforce
  - HubSpot
  - Microsoft Dynamics 365
  - Oracle Cloud
  - SAP
  - Tableau
  - Zendesk
- Each connection syncs data automatically
- View connection status and last sync time
- Disconnect and reconnect as needed

### 2. **AI-Powered Recommendations** (500 decisions/month)
- Receive **up to 500 AI-generated recommendations** per month
- Recommendations appear in the **Decision Feed** with:
  - Priority levels (High, Medium, Low)
  - Projected impact and ROI
  - Implementation steps
  - Status tracking (Pending, Approved, Rejected, Implemented)
- Filter recommendations by status
- Approve or reject recommendations
- Mark approved recommendations as implemented

### 3. **Decision Feed Dashboard**
- Personalized recommendations based on:
  - Business name
  - Business role
  - Goals for the year
  - How they want mySmartly to help
- View all recommendations in one place
- Track which recommendations have been implemented
- See projected impact and ROI for each recommendation

### 4. **AI Chatbot**
- Ask questions about:
  - Business decisions
  - Data insights
  - Recommendations
  - How to use mySmartly features
- Get instant answers beyond the recommendations
- Available 24/7 during the trial

### 5. **Data History** (7 days)
- View data from connected sources for the **last 7 days**
- Historical analysis and trends
- Data visualization

### 6. **Email Support**
- Access to email support during the trial
- Get help with:
  - Setting up connections
  - Understanding recommendations
  - Technical issues
  - Feature questions

---

## What Customers Will Do During the 14 Days

### **Day 1: Sign Up & Onboarding**
1. Create account (email/password or Google OAuth)
2. Complete onboarding questionnaire:
   - Business name
   - Business role
   - Goals for the year
   - Specific goals
   - How they want mySmartly to help
3. Access dashboard for the first time
4. See welcome message and trial countdown

### **Days 2-3: Connect Data Sources**
1. Connect first data source (e.g., Google Analytics)
2. Authorize connection via OAuth
3. Wait for initial data sync (usually within hours)
4. Connect 2-3 more data sources
5. View connection status and sync times

### **Days 4-7: Receive First Recommendations**
1. AI analyzes connected data
2. First recommendations appear in Decision Feed
3. Review recommendations with:
   - Priority levels
   - Projected impact
   - Implementation steps
4. Approve or reject recommendations
5. Start implementing approved recommendations

### **Days 8-10: Active Usage**
1. Continue receiving daily recommendations
2. Track implementation progress
3. Use AI Chatbot for questions
4. Monitor data connections and sync status
5. Review historical data (7-day window)

### **Days 11-13: Evaluation & Decision**
1. Review trial experience
2. Check recommendation quality and relevance
3. Evaluate ROI of recommendations
4. Consider upgrading if:
   - They need more than 3 connections
   - They need more than 500 recommendations/month
   - They need longer data history (90 days)
   - They need priority support

### **Day 14: Trial End**
1. Receive trial expiration reminder
2. See upgrade prompts if they hit limits
3. Choose to:
   - **Upgrade** to Starter ($149/month), Pro ($399/month), or Enterprise ($1,299/month)
   - **Cancel** (access ends after trial)

---

## Trial Limitations & Upgrade Triggers

### **Connection Limit (3 connections)**
- When they try to connect a 4th source, they'll see:
  - Upgrade notification
  - Message: "You've reached your Starter plan limit"
  - Option to upgrade to Pro (10 connections) or Enterprise (unlimited)

### **Recommendations Limit (500/month)**
- When they reach 500 recommendations in a month:
  - Upgrade notification appears
  - Message: "You've used 500 of 500 recommendations per month"
  - Option to upgrade to Pro (5,000/month) or Enterprise (unlimited)

### **Data History Limit (7 days)**
- Can only view data from the last 7 days
- To see 90 days of history, upgrade to Pro
- Enterprise has unlimited history

### **Support Level**
- Email support only during trial
- Pro plan includes Priority support
- Enterprise includes 24/7 phone support

---

## Trial Dashboard Features

### **Subscription Status Card**
- Shows: "Free Trial - X days remaining"
- Displays countdown timer
- "Upgrade Now" button
- Yellow/amber styling to indicate trial status

### **Upgrade Notifications**
- Appear when limits are reached
- Prominent call-to-action to upgrade
- Can be dismissed but will reappear if limits are hit again

### **Welcome Section**
- Personalized greeting with business name
- Overview of dashboard features
- Quick links to key sections

---

## Post-Trial Options

### **Option 1: Upgrade to Starter Plan ($149/month)**
- Keep current limits (3 connections, 500 decisions/month)
- Continue with email support
- 7-day data history

### **Option 2: Upgrade to Pro Plan ($399/month)**
- 10 data connections
- 5,000 decisions/month
- Priority support
- 90-day data history
- Team collaboration (3 seats)

### **Option 3: Upgrade to Enterprise Plan ($1,299/month)**
- Unlimited connections
- Unlimited decisions
- 24/7 phone support
- Custom AI models
- Dedicated Customer Success Manager
- SOC 2 reports
- Unlimited team seats

### **Option 4: Cancel**
- Access ends when trial expires
- No charges (trial is free)
- Can sign up again later

---

## Key Value Propositions During Trial

1. **No Credit Card Required** - Start immediately
2. **Full Feature Access** - Experience all Starter plan features
3. **Real Recommendations** - Get actual AI-powered insights
4. **Personalized Experience** - Based on onboarding questionnaire
5. **Easy Upgrade** - One-click upgrade when ready
6. **No Commitment** - Cancel anytime during trial

---

## Technical Implementation

- Trial subscription created automatically on signup
- Status: `'trial'` in `user_subscriptions` table
- Trial end date: 14 days from signup
- Plan name: `'Starter'` during trial
- All Starter plan limits apply during trial
- Upgrade notifications appear when limits are reached

---

## Customer Success Tips

1. **Connect data early** - The sooner they connect, the sooner they get recommendations
2. **Review recommendations daily** - Check Decision Feed regularly
3. **Implement approved recommendations** - See real results
4. **Use AI Chatbot** - Get answers to questions
5. **Monitor trial countdown** - Know when trial ends
6. **Upgrade before trial ends** - Avoid service interruption

---

This trial experience gives customers a complete taste of mySmartly's value proposition while encouraging upgrades for businesses that need more connections, recommendations, or advanced features.

