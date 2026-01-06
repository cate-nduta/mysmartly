# How to Get the Error Message from Netlify

## Step-by-Step Instructions

### Option 1: Function Logs (Best Way)

1. Go to: https://app.netlify.com
2. Click on your site
3. Click **"Functions"** in the top menu (next to "Deploys", "Plugins", etc.)
4. Find **`/api/waitlist`** in the list
5. Click on it
6. You'll see a log viewer
7. Submit a test waitlist entry on your website
8. Come back to the logs and look at the most recent entry
9. Look for any red text or error messages
10. Copy/paste what you see

### Option 2: Deploy Logs

1. Go to Netlify Dashboard → Your Site
2. Click **"Deploys"** tab
3. Click on the most recent deployment
4. Scroll down to see build logs
5. Look for any error messages

### Option 3: Browser Console

1. Open your deployed website
2. Open browser Developer Tools (F12)
3. Go to "Console" tab
4. Submit a waitlist entry
5. Look for any error messages in the console

## What to Look For

The code logs messages like:

- `[WAITLIST EMAIL] Attempting to send welcome email`
- `[WAITLIST EMAIL] SMTP not configured`
- `[WAITLIST EMAIL] Error sending welcome email`
- `Error code: EAUTH`
- `Error code: ETIMEDOUT`
- Any red error text

## If You Can't Find Logs

If you can't access the logs, let me know:
1. Can you see the "Functions" tab in Netlify?
2. Do you see `/api/waitlist` listed?
3. When you submit a waitlist entry, does the form say "success" or show an error?

## Alternative: Check if Data is Being Saved

If you can access your Supabase dashboard:
1. Go to Supabase → Your Project → Table Editor
2. Open the `waitlist` table
3. Submit a test entry
4. Check if the entry appears in the table

If the entry appears but no email is sent → Email sending is the issue
If the entry doesn't appear → API route might not be working

---

**The error message from the logs will tell us exactly what's wrong and how to fix it.**

