# SQL Setup Instructions

## Quick Setup (Recommended)

**Run this single script to set up everything:**
1. Go to your Supabase Dashboard
2. Open the SQL Editor
3. Copy and paste the entire contents of `MASTER-SETUP-SQL.sql`
4. Click "Run"

This single script includes:
- ✅ All database tables
- ✅ All RLS (Row Level Security) policies
- ✅ Storage buckets and policies
- ✅ Default data (pricing plans, site settings, contact info, etc.)

## What Gets Created

### Core Tables
- `waitlist` - Email waitlist
- `jobs` - Job listings
- `job_applications` - Job applications
- `pricing_plans` - Pricing plans

### User Management Tables
- `user_preferences` - User preferences (2FA, notifications)
- `user_subscriptions` - User subscriptions and trials
- `data_connections` - User data connections (Google Analytics, Shopify, etc.)
- `recommendations` - AI recommendations for users
- `user_onboarding` - Onboarding questionnaire responses
- `admin_users` - Admin user management

### Admin Content Management Tables
- `team_members` - Team member bios and photos
- `contact_page_content` - Contact page content
- `site_settings` - Site-wide settings (logo, favicon)
- `blog_posts` - Blog posts
- `case_studies` - Case studies
- `guides` - Guides
- `webinars` - Webinars
- `who_its_for_content` - "Who It's For" section content
- `email_logs` - Email sending logs

### Storage Buckets
- `resumes` - For job application resumes
- `site-assets` - For logos, team photos, favicons

## After Running the Script

1. **Create your admin account:**
   - Go to `/admin`
   - Click "Sign Up"
   - Enter your details
   - You'll be automatically added as an admin

2. **Verify everything works:**
   - Check `/admin` - You should see pricing plans, jobs, etc.
   - Check `/pricing` - Pricing plans should display
   - Check `/dashboard` - Should work for clients

## Troubleshooting

**If you see "table not found" errors:**
- Make sure you ran the entire `MASTER-SETUP-SQL.sql` script
- Check that all tables were created in Supabase Dashboard > Table Editor

**If you see RLS policy errors:**
- The script includes all RLS policies
- Make sure you ran the complete script
- Check Supabase Dashboard > Authentication > Policies

**If admin can't see pricing plans/blogs:**
- Run `fix-all-admin-rls-policies.sql` to ensure admin access is correct
- Or re-run `MASTER-SETUP-SQL.sql` (it's idempotent - safe to run multiple times)

## Alternative: Step-by-Step Setup

If you prefer to run scripts separately:

1. **Basic setup:**
   - Run `supabase-setup.sql` (basic tables)

2. **Extended schema:**
   - Run `database-schema-extended.sql` (user management tables)

3. **Admin tables:**
   - Run `COMPLETE-ADMIN-TABLES-SETUP.sql` (admin content management)

4. **RLS policies:**
   - Run `fix-all-admin-rls-policies.sql` (fix admin access)

5. **Storage:**
   - Run `add-storage-buckets.sql` (storage buckets)

**However, we recommend using `MASTER-SETUP-SQL.sql` as it includes everything in the correct order.**

