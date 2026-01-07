-- Add tokens_limit and decisions_limit to user_subscriptions table
-- These will store the actual limits for the user (trial gets half of plan limits)

ALTER TABLE user_subscriptions 
  ADD COLUMN IF NOT EXISTS tokens_limit INTEGER;
  
ALTER TABLE user_subscriptions 
  ADD COLUMN IF NOT EXISTS decisions_limit INTEGER;

-- Update existing subscriptions with default limits if they're null
-- For trial subscriptions, set to half of plan defaults
UPDATE user_subscriptions
SET 
  tokens_limit = CASE 
    WHEN status = 'trial' THEN 125  -- Half of 250
    WHEN plan_name = 'Starter' THEN 250
    WHEN plan_name = 'Pro' THEN 5000
    WHEN plan_name = 'Enterprise' THEN 999999
    ELSE 250
  END,
  decisions_limit = CASE 
    WHEN status = 'trial' THEN 75  -- Half of 150
    WHEN plan_name = 'Starter' THEN 150
    WHEN plan_name = 'Pro' THEN 5000
    WHEN plan_name = 'Enterprise' THEN 999999
    ELSE 150
  END
WHERE tokens_limit IS NULL OR decisions_limit IS NULL;

