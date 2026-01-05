# Google Analytics & Tag Manager Setup

## Google Analytics 4 (GA4) Setup

1. **Create a GA4 Property:**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Create a new GA4 property for your website
   - Copy your Measurement ID (format: G-XXXXXXXXXX)

2. **Add to Environment Variables:**
   Add to your `.env.local` file:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

3. **Verify Installation:**
   - Deploy your site or run `npm run dev`
   - Visit your website
   - Check Google Analytics Real-Time reports to see if events are being tracked

## Google Tag Manager (GTM) Setup

1. **Create a GTM Container:**
   - Go to [Google Tag Manager](https://tagmanager.google.com/)
   - Create a new container for your website
   - Copy your Container ID (format: GTM-XXXXXXX)

2. **Add to Environment Variables:**
   Add to your `.env.local` file:
   ```
   NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
   ```

3. **Optional: Use GTM Instead of Direct GA4:**
   - If using GTM, you can remove the GA4 ID
   - Configure GA4 through GTM instead
   - This gives you more flexibility for managing tags

## Both Environment Variables

Your `.env.local` should include:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

**Note:** You can use either GA4 directly, GTM, or both. If using GTM, you typically configure GA4 inside GTM rather than using both IDs directly.

## Conversion Tracking

To track conversions (signups, trial starts, etc.), add events in your components:

```typescript
// Track conversion event
if (typeof window !== 'undefined' && window.gtag) {
  window.gtag('event', 'conversion', {
    'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
    'value': 1.0,
    'currency': 'USD'
  })
}
```

Or use GTM triggers to fire conversion events based on page views or user interactions.

