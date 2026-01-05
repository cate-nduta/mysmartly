# Netlify Deployment Guide for mySmartly

## Critical Steps to Match Localhost on Production

### 1. Environment Variables in Netlify

Go to your Netlify dashboard → Site settings → Environment variables and add ALL of these:

#### Required Variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://mysmartly.app
```

#### Admin Variables:
```
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password
```

#### Email/SMTP Variables:
```
ZOHO_SMTP_HOST=smtp.zoho.com
ZOHO_SMTP_PORT=465
ZOHO_SMTP_USER=hello@mysmartly.app
ZOHO_SMTP_PASS=your_zoho_app_password
ZOHO_FROM_EMAIL=hello@mysmartly.app
EMAIL_FROM_NAME=mySmartly
```

#### Paystack Variables:
```
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret
```

#### Supabase Service Role (for API routes):
```
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Build Settings in Netlify

In Netlify dashboard → Site settings → Build & deploy:

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: `18` (or higher)

### 3. Deploy Settings

1. **Framework preset**: Next.js (auto-detected)
2. **Base directory**: (leave empty unless your Next.js app is in a subfolder)
3. **Install command**: `npm install`

### 4. Important: Clear Build Cache

After setting environment variables:
1. Go to Deploys tab
2. Click "Trigger deploy" → "Clear cache and deploy site"

### 5. Check These Common Issues

#### Issue: Pages not loading / 404 errors
**Solution**: The `netlify.toml` file has been created with proper redirects.

#### Issue: API routes not working
**Solution**: 
- Ensure `@netlify/plugin-nextjs` is installed: `npm install --save-dev @netlify/plugin-nextjs`
- Check that environment variables are set correctly
- Verify API routes are in `app/api/` directory

#### Issue: Supabase connection failing
**Solution**:
- Double-check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Netlify
- Ensure these match your local `.env.local` values exactly
- No trailing slashes in URLs

#### Issue: Images/assets not loading
**Solution**:
- Check that `public/` folder is being deployed
- Verify image paths are relative (not absolute localhost paths)

#### Issue: Environment variables not working
**Solution**:
- Variables must start with `NEXT_PUBLIC_` to be available in browser
- Server-side variables (like `SUPABASE_SERVICE_ROLE_KEY`) don't need `NEXT_PUBLIC_`
- After adding variables, trigger a new deploy

### 6. Verify Deployment

After deployment, check:
1. ✅ Homepage loads correctly
2. ✅ All pages are accessible
3. ✅ Admin dashboard works (`/admin`)
4. ✅ Client dashboard works (`/dashboard`)
5. ✅ API routes respond correctly
6. ✅ Database connections work
7. ✅ Images/assets load properly

### 7. Debugging

If something doesn't match localhost:

1. **Check Netlify Function Logs**:
   - Go to Functions tab in Netlify dashboard
   - Check for errors in API routes

2. **Check Build Logs**:
   - Go to Deploys tab
   - Click on latest deploy
   - Review build output for errors

3. **Compare Environment Variables**:
   - Export your local `.env.local` variables
   - Compare with Netlify environment variables
   - Ensure they match exactly

4. **Test API Routes**:
   - Visit `https://mysmartly.app/api/waitlist` (should return JSON)
   - Check browser console for errors

### 8. Quick Fixes

**If build fails:**
```bash
# Clear Netlify cache and rebuild
# In Netlify dashboard: Deploys → Trigger deploy → Clear cache and deploy
```

**If pages are blank:**
- Check browser console for JavaScript errors
- Verify all environment variables are set
- Check that `NEXT_PUBLIC_SITE_URL` is set to `https://mysmartly.app`

**If database queries fail:**
- Verify Supabase URL and keys are correct
- Check Supabase dashboard for connection issues
- Ensure RLS policies allow public access where needed

## Next Steps

1. Set all environment variables in Netlify
2. Trigger a new deploy with cache cleared
3. Test all pages and functionality
4. Compare with localhost to ensure everything matches

