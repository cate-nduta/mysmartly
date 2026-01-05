# Deployment Guide

## Pre-Deployment Checklist

### ✅ 1. Environment Variables
Make sure all required environment variables are set in your hosting platform:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for admin setup)

**Optional (with defaults):**
- `ADMIN_USERNAME` - Default: `whooptydoo`
- `ADMIN_PASSWORD` - Your admin password
- `ADMIN_EMAIL` - Default: `hello@mysmartly.app`
- `NEXT_PUBLIC_APP_URL` - Your production URL

### ✅ 2. Database Setup
1. Run `create-admin-table.sql` in Supabase SQL Editor (one-time setup)
2. Run `FIX-LOGIN-406-ERROR.sql` to enable admin login
3. Run `npm run setup-admin` (or use the setup script) to create admin user

### ✅ 3. Build Verification
```bash
npm run build
```
✅ Build completed successfully - all checks passed!

### ✅ 4. Linting
```bash
npm run lint
```
⚠️ Some warnings present (non-blocking):
- React Hook dependency warnings (cosmetic)
- Image optimization suggestions (performance optimization)

## Deployment Steps

### For Vercel:
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### For Netlify:
1. Connect your repository to Netlify
2. Add environment variables in Netlify dashboard
3. Build command: `npm run build`
4. Publish directory: `.next`

### For Other Platforms:
1. Set environment variables
2. Run: `npm install`
3. Run: `npm run build`
4. Run: `npm start` (production server)

## Post-Deployment

### 1. Verify Admin Access
- Navigate to `/admin`
- Login with your admin credentials
- Verify dashboard loads correctly

### 2. Test Key Features
- [ ] Homepage loads
- [ ] Waitlist form works
- [ ] Contact form works
- [ ] Admin dashboard accessible
- [ ] Pricing page displays correctly

### 3. Performance Check
- Check Lighthouse scores
- Verify images are optimized
- Check loading times

## Production Build Info

- **Build Status**: ✅ Success
- **Total Routes**: 46
- **Static Pages**: 32
- **Dynamic Routes**: 14
- **First Load JS**: ~87.5 kB (shared)
- **Build Time**: Optimized for production

## Troubleshooting

### Build Fails
- Check environment variables are set
- Verify Node.js version (18+ required)
- Check for TypeScript errors

### Admin Login Not Working
1. Verify RLS policy is set: Run `FIX-LOGIN-406-ERROR.sql`
2. Verify admin user exists: Run `npm run setup-admin`
3. Check environment variables are correct

### 404 Errors
- Verify all routes are accessible
- Check Next.js routing configuration
- Verify static generation completed

