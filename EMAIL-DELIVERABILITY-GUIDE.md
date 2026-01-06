# Email Deliverability Guide - Primary Inbox Placement

## Code-Level Improvements (Already Implemented)

The waitlist welcome email has been optimized with:
- ✅ Clean "From" name (just "Cate" - personal, not corporate)
- ✅ Proper reply-to address
- ✅ List-Unsubscribe header (compliance)
- ✅ Unique Message-ID
- ✅ Clean HTML structure
- ✅ Text version included
- ✅ Minimal links (only one)
- ✅ Personal, conversational tone

## DNS-Level Configuration (REQUIRED for Best Results)

To ensure emails land in the **Primary inbox** instead of Promotions/Spam, you **must** configure DNS records for your domain:

### 1. SPF Record (Sender Policy Framework)
Add this TXT record to your DNS:

```
Type: TXT
Name: @ (or mysmartly.app)
Value: v=spf1 include:zoho.com ~all
TTL: 3600
```

This tells email providers that Zoho Mail is authorized to send emails from your domain.

### 2. DKIM Record (DomainKeys Identified Mail)
Zoho Mail provides DKIM keys. To get them:

1. Log into your Zoho Mail account
2. Go to **Control Panel** → **Mail Administration** → **Domain Keys**
3. Copy the DKIM public key
4. Add it as a TXT record:

```
Type: TXT
Name: zmail._domainkey (or whatever Zoho provides)
Value: [the DKIM public key from Zoho]
TTL: 3600
```

### 3. DMARC Record (Domain-based Message Authentication)
Add this TXT record:

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:hello@mysmartly.app
TTL: 3600
```

Start with `p=none` (monitoring only), then change to `p=quarantine` after monitoring shows good results, and finally `p=reject` for maximum security.

### 4. Verify Your Setup

Use these tools to verify your DNS records are correct:
- **SPF Checker**: https://mxtoolbox.com/spf.aspx
- **DKIM Checker**: https://mxtoolbox.com/dkim.aspx
- **DMARC Checker**: https://mxtoolbox.com/dmarc.aspx
- **All-in-one**: https://www.mail-tester.com/ (send a test email and get a score)

## Additional Best Practices

1. **Warm up your domain**: If this is a new domain/email, send a few test emails to yourself first and mark them as "Not Spam" in Gmail.

2. **Ask recipients to add you to contacts**: In the email, you can include: "To ensure you receive future updates, please add hello@mysmartly.app to your contacts."

3. **Monitor engagement**: Reply rates, open rates, and user engagement all help with sender reputation over time.

4. **Avoid spam trigger words**: Already done - your email uses conversational, personal language.

## Testing

After configuring DNS records:
1. Wait 24-48 hours for DNS propagation
2. Send a test email to a Gmail account
3. Check which tab it lands in (Primary, Promotions, or Spam)
4. If it goes to Promotions, right-click → "Move to Primary" → "Yes" to train Gmail
5. Use https://www.mail-tester.com/ for a detailed deliverability score

## Important Notes

- DNS changes can take 24-48 hours to propagate globally
- Even with perfect DNS setup, Gmail may still categorize emails based on user behavior
- The first few emails are most critical - encourage early recipients to move messages to Primary if needed
- Consistent sending and good engagement will improve your sender reputation over time

