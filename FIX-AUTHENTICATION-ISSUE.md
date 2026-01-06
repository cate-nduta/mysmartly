# Fix: Authentication Still Failing for Waitlist Emails

## Problem
- Test endpoint (`/api/test-email`) works ✅
- Waitlist endpoint (`/api/waitlist`) fails with "535 Authentication Failed" ❌
- Both use the same `lib/email.ts` function now

## Debug Steps

1. **RESTART DEV SERVER COMPLETELY**
   ```bash
   # Stop the server (Ctrl+C)
   # Delete .next folder (cached build)
   rm -rf .next
   # Or on Windows:
   rmdir /s .next
   
   # Restart
   npm run dev
   ```

2. **Check Environment Variables**
   - Open `.env.local`
   - Verify `ZOHO_SMTP_PASS` is set correctly
   - Check for any extra spaces or quotes
   - Password should NOT be in quotes: `ZOHO_SMTP_PASS=yourpassword`
   - NOT: `ZOHO_SMTP_PASS="yourpassword"` (quotes can cause issues)

3. **Test Both Endpoints**
   - First: Visit `http://localhost:3000/api/test-email` (should work)
   - Then: Submit a waitlist entry (should also work)
   - Check console logs for `[EMAIL] Environment check:` output
   - Compare the logs between both calls

4. **Check Logs for Differences**
   When submitting waitlist, look for:
   ```
   [EMAIL] Environment check: {
     hasHost: true/false,
     hasUser: true/false,
     hasPass: true/false,
     passLength: <number>,
     ...
   }
   ```
   
   Compare this to when test endpoint runs.

## Possible Causes

1. **Next.js Module Caching** - Old code still loaded
   - Solution: Restart server, delete `.next` folder

2. **Environment Variable Not Loaded** - Different loading in POST vs GET
   - Solution: Check `.env.local` syntax, restart server

3. **Password Has Special Characters** - Needs escaping
   - Solution: Check password doesn't have unescaped special chars

4. **Race Condition** - Variables loaded at different times
   - Solution: Ensure both use same function (they do now)

## Quick Test

After restarting, test the test endpoint first:
```
http://localhost:3000/api/test-email
```

If that works, then test waitlist. Both should show the same `[EMAIL] Environment check:` output in logs.

