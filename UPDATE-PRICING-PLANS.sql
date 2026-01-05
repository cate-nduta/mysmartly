-- Update pricing plans to match current requirements
-- Run this SQL in your Supabase SQL Editor

-- Update Starter plan
UPDATE pricing_plans
SET 
  price = '$59',
  period = '/month',
  description = 'For solo founders & small teams',
  features = ARRAY['3 data connections', '50 recommendations/month', 'Basic reporting', 'Email support'],
  is_popular = false,
  cta_text = 'Start Free Trial',
  updated_at = NOW()
WHERE name = 'Starter';

-- Update Pro plan
UPDATE pricing_plans
SET 
  price = '$299',
  period = '/month',
  description = 'For growing businesses',
  features = ARRAY['10 data connections', '500 recommendations/month', 'Advanced analytics', 'Priority support', 'Team collaboration'],
  is_popular = true,
  cta_text = 'Start Free Trial',
  updated_at = NOW()
WHERE name = 'Pro';

-- Update Enterprise plan
UPDATE pricing_plans
SET 
  price = 'Custom',
  period = ' pricing',
  description = 'For large organizations',
  features = ARRAY['Unlimited connections', 'Everything in Pro', 'Custom models', 'Dedicated CSM', 'SLA & security compliance'],
  is_popular = false,
  cta_text = 'Contact Sales',
  updated_at = NOW()
WHERE name = 'Enterprise';

-- If plans don't exist, insert them
INSERT INTO pricing_plans (name, price, period, description, features, is_popular, cta_text)
VALUES 
  ('Starter', '$59', '/month', 'For solo founders & small teams', ARRAY['3 data connections', '50 recommendations/month', 'Basic reporting', 'Email support'], false, 'Start Free Trial'),
  ('Pro', '$299', '/month', 'For growing businesses', ARRAY['10 data connections', '500 recommendations/month', 'Advanced analytics', 'Priority support', 'Team collaboration'], true, 'Start Free Trial'),
  ('Enterprise', 'Custom', ' pricing', 'For large organizations', ARRAY['Unlimited connections', 'Everything in Pro', 'Custom models', 'Dedicated CSM', 'SLA & security compliance'], false, 'Contact Sales')
ON CONFLICT (name) DO UPDATE SET
  price = EXCLUDED.price,
  period = EXCLUDED.period,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  is_popular = EXCLUDED.is_popular,
  cta_text = EXCLUDED.cta_text,
  updated_at = NOW();


