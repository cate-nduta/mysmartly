-- Create waitlist table in Supabase
-- Run this SQL in your Supabase SQL Editor
-- This script is idempotent - safe to run multiple times

-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "Allow public insert" ON waitlist;
CREATE POLICY "Allow public insert" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role read" ON waitlist;
CREATE POLICY "Allow service role read" ON waitlist
  FOR SELECT
  TO service_role
  USING (true);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[],
  salary NUMERIC,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Job applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  cover_letter TEXT,
  resume_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Pricing table
CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  price TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  cta_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

-- Jobs policies
DROP POLICY IF EXISTS "Allow public read active jobs" ON jobs;
CREATE POLICY "Allow public read active jobs" ON jobs
  FOR SELECT
  TO anon
  USING (is_active = true);

DROP POLICY IF EXISTS "Allow service role full access jobs" ON jobs;
CREATE POLICY "Allow service role full access jobs" ON jobs
  FOR ALL
  TO service_role
  USING (true);

-- Job applications policies
DROP POLICY IF EXISTS "Allow public insert applications" ON job_applications;
CREATE POLICY "Allow public insert applications" ON job_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role full access applications" ON job_applications;
CREATE POLICY "Allow service role full access applications" ON job_applications
  FOR ALL
  TO service_role
  USING (true);

-- Pricing policies
DROP POLICY IF EXISTS "Allow public read pricing" ON pricing_plans;
CREATE POLICY "Allow public read pricing" ON pricing_plans
  FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "Allow service role full access pricing" ON pricing_plans;
CREATE POLICY "Allow service role full access pricing" ON pricing_plans
  FOR ALL
  TO service_role
  USING (true);

-- Insert default pricing plans (only if they don't exist)
INSERT INTO pricing_plans (name, price, period, description, features, is_popular, cta_text)
VALUES 
  ('Starter', '$149', '/month', 'Perfect for small businesses getting started', ARRAY['3 data connections', '500 decisions/month', 'Email support', '7-day data history'], false, 'Start Free Trial'),
  ('Pro', '$399', '/month', 'For growing businesses', ARRAY['10 data connections', '5,000 decisions/month', 'Priority support', '90-day data history', 'Team collaboration (3 seats)'], true, 'Start Free Trial'),
  ('Enterprise', '$1,299', '/month', 'For large organizations', ARRAY['Unlimited connections', 'Unlimited decisions', '24/7 phone support', 'Custom models', 'Dedicated CSM', 'SOC 2 reports', 'Unlimited seats'], false, 'Contact Sales')
ON CONFLICT (name) DO UPDATE SET
  price = EXCLUDED.price,
  period = EXCLUDED.period,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  is_popular = EXCLUDED.is_popular,
  updated_at = NOW();

-- Create storage bucket for resumes (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for resumes
DROP POLICY IF EXISTS "Allow public upload resumes" ON storage.objects;
CREATE POLICY "Allow public upload resumes" ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Allow service role full access resumes" ON storage.objects;
CREATE POLICY "Allow service role full access resumes" ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'resumes');
