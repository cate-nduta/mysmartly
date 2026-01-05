-- Fix RLS Policies for Admin Access
-- This script ensures authenticated users (admins) can read and write to all admin-managed tables
-- Run this in your Supabase SQL Editor

-- ============================================
-- PRICING PLANS
-- ============================================
DROP POLICY IF EXISTS "Allow public read pricing" ON pricing_plans;
DROP POLICY IF EXISTS "Allow authenticated read pricing" ON pricing_plans;
DROP POLICY IF EXISTS "Allow authenticated update pricing" ON pricing_plans;
DROP POLICY IF EXISTS "Allow service role full access pricing" ON pricing_plans;

-- Allow anonymous users to read (for public pricing page)
CREATE POLICY "Allow public read pricing" ON pricing_plans
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users (admins) to read and update pricing plans
CREATE POLICY "Allow authenticated read pricing" ON pricing_plans
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated update pricing" ON pricing_plans
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access pricing" ON pricing_plans
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- BLOG POSTS
-- ============================================
DROP POLICY IF EXISTS "Allow public read published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated full access blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow service role full access blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow anon full access blog posts" ON blog_posts;

-- Allow anonymous users to read published posts (for public blog page)
CREATE POLICY "Allow public read published blog posts" ON blog_posts
  FOR SELECT
  TO anon
  USING (is_published = true);

-- Allow authenticated users (admins) full access to blog posts
CREATE POLICY "Allow authenticated full access blog posts" ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access blog posts" ON blog_posts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- CASE STUDIES
-- ============================================
DROP POLICY IF EXISTS "Allow public read published case studies" ON case_studies;
DROP POLICY IF EXISTS "Allow authenticated full access case studies" ON case_studies;
DROP POLICY IF EXISTS "Allow service role full access case studies" ON case_studies;
DROP POLICY IF EXISTS "Allow anon full access case studies" ON case_studies;

-- Allow anonymous users to read published case studies
CREATE POLICY "Allow public read published case studies" ON case_studies
  FOR SELECT
  TO anon
  USING (is_published = true);

-- Allow authenticated users (admins) full access
CREATE POLICY "Allow authenticated full access case studies" ON case_studies
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access case studies" ON case_studies
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- GUIDES
-- ============================================
DROP POLICY IF EXISTS "Allow public read published guides" ON guides;
DROP POLICY IF EXISTS "Allow authenticated full access guides" ON guides;
DROP POLICY IF EXISTS "Allow service role full access guides" ON guides;
DROP POLICY IF EXISTS "Allow anon full access guides" ON guides;

-- Allow anonymous users to read published guides
CREATE POLICY "Allow public read published guides" ON guides
  FOR SELECT
  TO anon
  USING (is_published = true);

-- Allow authenticated users (admins) full access
CREATE POLICY "Allow authenticated full access guides" ON guides
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access guides" ON guides
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- WEBINARS
-- ============================================
DROP POLICY IF EXISTS "Allow public read webinars" ON webinars;
DROP POLICY IF EXISTS "Allow authenticated full access webinars" ON webinars;
DROP POLICY IF EXISTS "Allow service role full access webinars" ON webinars;
DROP POLICY IF EXISTS "Allow anon full access webinars" ON webinars;

-- Allow anonymous users to read webinars
CREATE POLICY "Allow public read webinars" ON webinars
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users (admins) full access
CREATE POLICY "Allow authenticated full access webinars" ON webinars
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access webinars" ON webinars
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- JOBS
-- ============================================
DROP POLICY IF EXISTS "Allow public read active jobs" ON jobs;
DROP POLICY IF EXISTS "Allow authenticated full access jobs" ON jobs;
DROP POLICY IF EXISTS "Allow service role full access jobs" ON jobs;

-- Allow anonymous users to read active jobs
CREATE POLICY "Allow public read active jobs" ON jobs
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Allow authenticated users (admins) full access
CREATE POLICY "Allow authenticated full access jobs" ON jobs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access jobs" ON jobs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- JOB APPLICATIONS
-- ============================================
DROP POLICY IF EXISTS "Allow public insert applications" ON job_applications;
DROP POLICY IF EXISTS "Allow authenticated full access applications" ON job_applications;
DROP POLICY IF EXISTS "Allow service role full access applications" ON job_applications;

-- Allow anonymous users to insert applications
CREATE POLICY "Allow public insert applications" ON job_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users (admins) full access
CREATE POLICY "Allow authenticated full access applications" ON job_applications
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access applications" ON job_applications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- INSERT DEFAULT PRICING PLANS (if they don't exist)
-- ============================================
INSERT INTO pricing_plans (name, price, period, description, features, is_popular, cta_text, created_at)
VALUES 
  ('Starter', '$149', '/month', 'Perfect for small businesses getting started', ARRAY['3 data connections', '500 decisions/month', 'Email support', '7-day data history'], false, 'Start Free Trial', '2026-01-01 00:00:00+00'),
  ('Pro', '$399', '/month', 'For growing businesses', ARRAY['10 data connections', '5,000 decisions/month', 'Priority support', '90-day data history', 'Team collaboration (3 seats)'], true, 'Start Free Trial', '2026-01-01 00:00:00+00'),
  ('Enterprise', '$1,299', '/month', 'For large organizations', ARRAY['Unlimited connections', 'Unlimited decisions', '24/7 phone support', 'Custom models', 'Dedicated CSM', 'SOC 2 reports', 'Unlimited seats'], false, 'Contact Sales', '2026-01-01 00:00:00+00')
ON CONFLICT (name) DO UPDATE SET
  price = EXCLUDED.price,
  period = EXCLUDED.period,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  is_popular = EXCLUDED.is_popular,
  cta_text = EXCLUDED.cta_text,
  updated_at = NOW();

-- ============================================
-- VERIFY POLICIES
-- ============================================
-- Check pricing plans
SELECT 'Pricing Plans' as table_name, COUNT(*) as count FROM pricing_plans
UNION ALL
-- Check blog posts
SELECT 'Blog Posts' as table_name, COUNT(*) as count FROM blog_posts
UNION ALL
-- Check case studies
SELECT 'Case Studies' as table_name, COUNT(*) as count FROM case_studies
UNION ALL
-- Check guides
SELECT 'Guides' as table_name, COUNT(*) as count FROM guides
UNION ALL
-- Check webinars
SELECT 'Webinars' as table_name, COUNT(*) as count FROM webinars;

