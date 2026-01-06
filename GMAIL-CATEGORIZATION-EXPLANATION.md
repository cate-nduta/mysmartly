# Why Emails Go to Primary vs Promotions (Gmail)

Gmail uses a sophisticated algorithm to categorize emails. Different recipients may see the same email in different tabs based on multiple factors.

## Why This Happens

### 1. **Individual User Behavior (Most Important)**
- **User's email history**: Gmail learns from each user's behavior
- **Previous engagement**: If a user previously opened/replied to your emails, they're more likely to go to Primary
- **Manual categorization**: Users who manually move emails between tabs teach Gmail their preferences
- **Contact list**: Emails from contacts are more likely to go to Primary

### 2. **Email Content Analysis**
Gmail analyzes:
- **Keywords**: Words like "priority", "access", "join", "early group" can trigger Promotions
- **HTML structure**: Complex HTML with lots of styling can signal promotions
- **Links**: Too many links or promotional-style links
- **Images**: Image-heavy emails often go to Promotions

### 3. **Domain and Sender Reputation**
- **New domains**: Fresh domains start with lower reputation
- **Authentication**: SPF, DKIM, DMARC setup affects categorization
- **Sending volume**: Sudden spikes or irregular patterns
- **Bounce/complaint rates**: High rates push emails to Promotions/Spam

### 4. **Recipient's Gmail Settings**
- Each user has different filtering rules
- Filters and labels they've created
- Promotions tab enabled/disabled

## What We Can Control (Code Level)

✅ **Already implemented:**
- Clean, simple HTML structure
- Personal tone (not promotional)
- Minimal links
- Proper email headers
- Text version included
- Proper from name (Catherine.K)

## What You Need to Do (Domain Level)

### 1. **Set Up Email Authentication (CRITICAL)**
You must configure DNS records:
- **SPF Record**: Authorizes your sending server
- **DKIM Record**: Cryptographic signature
- **DMARC Record**: Policy for email authentication

See `EMAIL-DELIVERABILITY-GUIDE.md` for step-by-step instructions.

### 2. **Warm Up Your Domain** (if new)
- Start with small volumes
- Send to engaged users first
- Gradually increase volume over weeks

### 3. **Encourage User Engagement**
In your welcome email, you can add:
- "To ensure you receive updates, add hello@mysmartly.app to your contacts"
- "If this email went to Promotions, please move it to Primary to help Gmail learn"

## Best Practices for Better Categorization

### Email Content
- ✅ Personal, conversational tone (you have this)
- ✅ Simple HTML (you have this)
- ✅ One clear call-to-action (you have this)
- ✅ Minimal promotional language
- ❌ Avoid: "FREE", "LIMITED TIME", "URGENT", "BUY NOW"

### Sending Patterns
- ✅ Consistent sending schedule
- ✅ Send to engaged users
- ✅ Allow users to set preferences
- ❌ Avoid: High bounce rates, spam complaints

### User Engagement
The more users:
- Open your emails
- Reply to them
- Mark them as important
- Move them from Promotions to Primary

...the more Gmail learns that your emails belong in Primary for that user.

## Reality Check

**Even with perfect setup:**
- Gmail's algorithm is complex and constantly changing
- Individual user behavior is the biggest factor
- Some users will always see promotional emails in Promotions
- This is normal and expected behavior

## What You Can Do Right Now

1. **Set up DNS records** (SPF, DKIM, DMARC) - This is the #1 thing you can do
2. **Monitor engagement** - Track open rates, replies
3. **Add a note in emails** - Ask users to add you to contacts or move to Primary
4. **Accept it's not 100% controllable** - Gmail's algorithm will vary by user

## Testing

- Send test emails to different Gmail accounts
- Check where they land
- Note that different accounts may categorize differently
- This is normal behavior

## Summary

**Why some go to Primary, others to Promotions:**
- Individual user behavior and history
- Gmail's machine learning per user
- Domain reputation (improves with authentication)
- Email content and structure
- User's email settings and filters

**What matters most:**
1. Email authentication (SPF/DKIM/DMARC) - **Do this first**
2. User engagement over time
3. Clean, personal email content (you already have this)

