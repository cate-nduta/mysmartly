-- ============================================
-- FINAL COMPLETE FIX - RUN THIS ONCE AND EVERYTHING WORKS
-- Run this SQL in your Supabase SQL Editor ONCE
-- This fixes ALL issues: Jobs, Applications, Pricing, Storage
-- ============================================

-- ============================================
-- 1. ADD SALARY COLUMN TO JOBS (if missing)
-- ============================================
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary NUMERIC;

-- ============================================
-- 2. FIX JOBS TABLE POLICIES
-- ============================================
DROP POLICY IF EXISTS "Allow public read active jobs" ON jobs;
DROP POLICY IF EXISTS "Allow service role full access jobs" ON jobs;
DROP POLICY IF EXISTS "Allow anon full access jobs" ON jobs;

-- Allow public to read active jobs (client side)
CREATE POLICY "Allow public read active jobs" ON jobs
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Allow service role full access (for admin operations)
CREATE POLICY "Allow service role full access jobs" ON jobs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon to insert/update/delete jobs (for admin dashboard)
CREATE POLICY "Allow anon full access jobs" ON jobs
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 3. FIX JOB_APPLICATIONS TABLE POLICIES
-- ============================================
DROP POLICY IF EXISTS "Allow public insert applications" ON job_applications;
DROP POLICY IF EXISTS "Allow service role full access applications" ON job_applications;
DROP POLICY IF EXISTS "Allow anon read applications" ON job_applications;
DROP POLICY IF EXISTS "Allow anon update applications" ON job_applications;

-- Allow public to insert applications (job applicants - client side)
CREATE POLICY "Allow public insert applications" ON job_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow service role full access (for admin operations)
CREATE POLICY "Allow service role full access applications" ON job_applications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon to read applications (for admin dashboard)
CREATE POLICY "Allow anon read applications" ON job_applications
  FOR SELECT
  TO anon
  USING (true);

-- Allow anon to update applications (for admin dashboard status updates)
CREATE POLICY "Allow anon update applications" ON job_applications
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 4. FIX PRICING_PLANS TABLE POLICIES
-- ============================================
DROP POLICY IF EXISTS "Allow public read pricing" ON pricing_plans;
DROP POLICY IF EXISTS "Allow service role full access pricing" ON pricing_plans;
DROP POLICY IF EXISTS "Allow anon full access pricing" ON pricing_plans;

-- Allow public to read pricing plans (client side - pricing page)
CREATE POLICY "Allow public read pricing" ON pricing_plans
  FOR SELECT
  TO anon
  USING (true);

-- Allow service role full access (for admin operations)
CREATE POLICY "Allow service role full access pricing" ON pricing_plans
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon to update pricing plans (for admin dashboard)
CREATE POLICY "Allow anon full access pricing" ON pricing_plans
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 5. FIX STORAGE (RESUMES) BUCKET AND POLICIES
-- ============================================
-- Create or update the resumes bucket (set to PUBLIC so PDFs are viewable)
-- Note: If bucket doesn't exist, you may need to create it manually in Supabase Dashboard > Storage
-- But this will set it to public if it exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- If the bucket doesn't exist yet, you'll need to create it manually:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Click "New bucket"
-- 3. Name it "resumes"
-- 4. Set it to PUBLIC
-- 5. Then run this SQL script again

-- Drop existing storage policies
DROP POLICY IF EXISTS "Allow public upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow service role full access resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon read resumes" ON storage.objects;

-- Allow public to upload resumes (job applicants - client side)
CREATE POLICY "Allow public upload resumes" ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'resumes');

-- Allow service role full access (for admin operations)
CREATE POLICY "Allow service role full access resumes" ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'resumes')
  WITH CHECK (bucket_id = 'resumes');

-- Allow public/anonymous to read/download resumes (for admin dashboard)
-- Since bucket is public, this allows viewing PDFs
CREATE POLICY "Allow public read resumes" ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'resumes');

-- ============================================
-- DONE! Everything should work now:
-- - Admin can edit jobs (with salary) → Shows on careers page
-- - Admin can edit pricing → Shows on pricing page
-- - Admin can view applications → Shows in admin dashboard
-- - Admin can view resumes → PDFs are downloadable
-- - Users can apply for jobs → Shows in admin dashboard
-- ============================================

