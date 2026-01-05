-- Fix pricing plans order to: Starter, Pro, Enterprise
-- Run this SQL in your Supabase SQL Editor

-- Update pricing plans with correct order by updating created_at timestamps
-- This ensures they appear in the correct order when sorted by created_at

UPDATE pricing_plans
SET created_at = '2026-01-01 00:00:00+00'
WHERE name = 'Starter';

UPDATE pricing_plans
SET created_at = '2026-01-02 00:00:00+00'
WHERE name = 'Pro';

UPDATE pricing_plans
SET created_at = '2026-01-03 00:00:00+00'
WHERE name = 'Enterprise';

-- Also update the pricing values to match requirements
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


