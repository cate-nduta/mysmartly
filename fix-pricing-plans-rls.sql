-- Fix RLS policies for pricing_plans to allow authenticated users (admins) to read
-- This allows admins to view and manage pricing plans in the admin dashboard

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read pricing" ON pricing_plans;
DROP POLICY IF EXISTS "Allow authenticated read pricing" ON pricing_plans;
DROP POLICY IF EXISTS "Allow authenticated full access pricing" ON pricing_plans;
DROP POLICY IF EXISTS "Allow service role full access pricing" ON pricing_plans;

-- Allow anonymous users to read (for public pricing page)
CREATE POLICY "Allow public read pricing" ON pricing_plans
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users (admins) to read pricing plans
CREATE POLICY "Allow authenticated read pricing" ON pricing_plans
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users (admins) to update pricing plans
CREATE POLICY "Allow authenticated update pricing" ON pricing_plans
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow service role full access (for backend operations)
CREATE POLICY "Allow service role full access pricing" ON pricing_plans
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Insert default pricing plans if they don't exist
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

-- Verify the pricing plans were inserted/updated
SELECT 
  id,
  name,
  price,
  period,
  description,
  is_popular,
  cta_text,
  created_at,
  updated_at
FROM pricing_plans
ORDER BY 
  CASE name
    WHEN 'Starter' THEN 1
    WHEN 'Pro' THEN 2
    WHEN 'Enterprise' THEN 3
    ELSE 4
  END;

