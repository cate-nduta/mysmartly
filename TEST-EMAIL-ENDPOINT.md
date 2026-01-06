# Test Email Configuration Endpoint

I've created a test endpoint to diagnose the email issue.

## How to Use

1. **Deploy this change** (push to GitHub or redeploy)
2. **Visit this URL on your deployed site:**
   ```
   https://your-site.netlify.app/api/test-email
   ```
   (Replace `your-site` with your actual Netlify site name)

3. **Check what it returns:**

### If Variables Are Missing:
```json
{
  "status": "error",
  "message": "SMTP configuration incomplete",
  "missing": {
    "host": false,
    "user": true,
    "pass": false
  }
}
```
→ Shows which variables are missing

### If Connection Fails:
```json
{
  "status": "error",
  "message": "SMTP connection verification failed",
  "error": {
    "code": "EAUTH",
    "message": "Invalid login credentials"
  }
}
```
→ Shows the exact error (authentication, timeout, etc.)

### If Everything Works:
```json
{
  "status": "success",
  "message": "SMTP configuration is valid and connection verified"
}
```
→ Configuration is correct!

## What This Will Tell Us

This endpoint will reveal:
- ✅ Are environment variables being read by Netlify functions?
- ✅ Is the SMTP connection working?
- ✅ What's the exact error if it's failing?

## Next Steps

1. **Deploy the new `/api/test-email` endpoint**
2. **Visit it in your browser**
3. **Share the JSON response you see**
4. **We'll fix the exact issue based on what it shows**

---

This is much easier than checking function logs and will show us exactly what's wrong!

