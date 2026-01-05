-- Update pricing plans to include tokens in features
-- This ensures decisions and tokens are pulled from the pricing_plans table

UPDATE pricing_plans
SET features = ARRAY[
  '3 data connections',
  '300 decisions/month',
  '500 tokens/month',
  'Email support',
  '7-day data history'
]
WHERE name = 'Starter';

UPDATE pricing_plans
SET features = ARRAY[
  '10 data connections',
  '1000 decisions/month',
  '1500 tokens/month',
  'Priority support',
  '90-day data history',
  'Team collaboration (3 seats)'
]
WHERE name = 'Pro';

UPDATE pricing_plans
SET features = ARRAY[
  'Unlimited connections',
  'Unlimited decisions',
  'Unlimited tokens',
  '24/7 phone support',
  'Custom models',
  'Dedicated CSM',
  'SOC 2 reports',
  'Unlimited seats'
]
WHERE name = 'Enterprise';

