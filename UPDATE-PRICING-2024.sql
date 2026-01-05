-- Update pricing plans with new pricing structure
-- Run this SQL in your Supabase SQL Editor

-- Update Starter Plan
UPDATE pricing_plans 
SET 
  price = '$149',
  period = '/month',
  description = 'Perfect for small businesses getting started',
  features = ARRAY['3 data connections', '500 decisions/month', 'Email support', '7-day data history'],
  is_popular = false,
  updated_at = NOW()
WHERE name = 'Starter';

-- Update Pro Plan
UPDATE pricing_plans 
SET 
  price = '$399',
  period = '/month',
  description = 'For growing businesses',
  features = ARRAY['10 data connections', '5,000 decisions/month', 'Priority support', '90-day data history', 'Team collaboration (3 seats)'],
  is_popular = true,
  updated_at = NOW()
WHERE name = 'Pro';

-- Update Enterprise Plan
UPDATE pricing_plans 
SET 
  price = '$1,299',
  period = '/month',
  description = 'For large organizations',
  features = ARRAY['Unlimited connections', 'Unlimited decisions', '24/7 phone support', 'Custom models', 'Dedicated CSM', 'SOC 2 reports', 'Unlimited seats'],
  is_popular = false,
  updated_at = NOW()
WHERE name = 'Enterprise';

-- If plans don't exist, insert them
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

