-- Add fields to pricing_plans table for tier-specific applications and limits
-- This allows admin to configure which apps each tier can access

-- Add available_applications column (array of connection types)
ALTER TABLE pricing_plans 
  ADD COLUMN IF NOT EXISTS available_applications TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add tokens_limit column (integer)
ALTER TABLE pricing_plans 
  ADD COLUMN IF NOT EXISTS tokens_limit INTEGER DEFAULT 250;

-- Add decisions_limit column (integer)
ALTER TABLE pricing_plans 
  ADD COLUMN IF NOT EXISTS decisions_limit INTEGER DEFAULT 150;

-- Update existing plans with default applications and limits
-- Starter: 3 apps, 250 tokens, 150 decisions
UPDATE pricing_plans 
SET 
  available_applications = ARRAY['google_analytics', 'google_ads', 'shopify'],
  tokens_limit = 250,
  decisions_limit = 150
WHERE name = 'Starter';

-- Pro: 5 apps, 5000 tokens, 5000 decisions
UPDATE pricing_plans 
SET 
  available_applications = ARRAY['google_analytics', 'google_ads', 'shopify', 'instagram_page', 'instagram_ads'],
  tokens_limit = 5000,
  decisions_limit = 5000
WHERE name = 'Pro';

-- Enterprise: All apps (unlimited), unlimited tokens/decisions
UPDATE pricing_plans 
SET 
  available_applications = ARRAY['google_analytics', 'google_ads', 'shopify', 'instagram_page', 'instagram_ads', 'quickbooks', 'hubspot', 'zendesk', 'youtube_ads', 'tiktok_ads', 'facebook_ads'],
  tokens_limit = 999999,
  decisions_limit = 999999
WHERE name = 'Enterprise';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pricing_plans_name ON pricing_plans(name);

