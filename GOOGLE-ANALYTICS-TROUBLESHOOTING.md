# Google Analytics Troubleshooting - "blocked:other" Error

## What "blocked:other" Means

The "blocked:other" error means the Google Analytics script is being blocked, usually by:
1. **Ad blockers** (most common) - uBlock Origin, AdBlock Plus, Privacy Badger, etc.
2. **Browser privacy settings** - Enhanced tracking protection
3. **Browser extensions** - Privacy-focused extensions
4. **Network/firewall** - Corporate networks blocking analytics

## Solutions

### Solution 1: Disable Ad Blockers (For Testing)

**To test if it's an ad blocker:**
1. Disable all browser extensions temporarily
2. Or use an incognito/private window (extensions are usually disabled)
3. Refresh the page and check if the script loads

**Common ad blockers to check:**
- uBlock Origin
- AdBlock Plus
- Privacy Badger
- Ghostery
- Brave Browser's built-in blocker

### Solution 2: Verify Environment Variable

Make sure your `.env.local` file has:
```env
NEXT_PUBLIC_GA_ID=G-5NN7FKHX6E
```

**Important:**
- Restart your dev server after adding/changing environment variables
- The variable name must be `NEXT_PUBLIC_GA_ID` (not `GA_ID` or `GOOGLE_ANALYTICS_ID`)
- No spaces around the `=` sign

### Solution 3: Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Look for any errors related to Google Analytics
4. Check if `window.gtag` is defined:
   ```javascript
   console.log(window.gtag)
   ```
   Should show a function, not `undefined`

### Solution 4: Verify Script is Loading

In DevTools Network tab:
1. Filter by "gtag" or "googletagmanager"
2. Look for: `googletagmanager.com/gtag/js?id=G-5NN7FKHX6E`
3. Check the status:
   - ✅ **200 OK** = Script loaded successfully (but may be blocked by ad blocker)
   - ❌ **blocked:other** = Ad blocker or privacy extension blocking it
   - ❌ **404** = Wrong ID or script URL issue
   - ❌ **CORS error** = Cross-origin issue

### Solution 5: Test in Different Browser

Try a different browser to rule out browser-specific issues:
- Chrome
- Firefox
- Edge
- Safari

### Solution 6: Check if Analytics Component is Rendering

Add a temporary console log to verify the component is loading:

```tsx
// In components/Analytics.tsx
useEffect(() => {
  console.log('Analytics component loaded, GA ID:', gaId)
}, [gaId])
```

## Expected Behavior

### ✅ Working Correctly:
- Script loads with status 200
- `window.gtag` function exists
- `window.dataLayer` array exists
- No console errors

### ❌ Blocked by Ad Blocker:
- Script shows "blocked:other" in Network tab
- `window.gtag` is undefined
- This is **normal** for users with ad blockers
- Analytics will still work for users without ad blockers

## Important Notes

1. **This is normal**: Many users have ad blockers that block Google Analytics
2. **It will work in production**: Most users won't have ad blockers on your actual website
3. **Testing**: Use incognito mode or disable extensions to test
4. **Real users**: Analytics will track users who don't have ad blockers

## Verify It's Working (When Not Blocked)

1. Disable ad blockers
2. Visit your site
3. Open DevTools Console
4. Run: `window.gtag('event', 'test', { event_category: 'test' })`
5. Should see no errors

## Production Deployment

When you deploy:
1. Add `NEXT_PUBLIC_GA_ID=G-5NN7FKHX6E` to your hosting platform's environment variables
2. Analytics will work for all users without ad blockers
3. Users with ad blockers won't be tracked (this is expected and normal)

