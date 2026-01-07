-- Update user_onboarding table schema for new onboarding questions
-- Run this SQL in your Supabase SQL Editor

-- Add new columns for the new onboarding structure
ALTER TABLE user_onboarding
ADD COLUMN IF NOT EXISTS business_type TEXT,
ADD COLUMN IF NOT EXISTS business_type_other TEXT,
ADD COLUMN IF NOT EXISTS business_stage TEXT,
ADD COLUMN IF NOT EXISTS monthly_revenue TEXT,
ADD COLUMN IF NOT EXISTS tools_used TEXT[],
ADD COLUMN IF NOT EXISTS tools_other TEXT,
ADD COLUMN IF NOT EXISTS improvement_goals TEXT[],
ADD COLUMN IF NOT EXISTS recommendation_delivery TEXT,
ADD COLUMN IF NOT EXISTS ai_comfort_level TEXT;

-- Note: Existing columns (business_name, business_role, other_role, goals_year, specific_goals, how_mysmartly_helps, additional_info)
-- will remain for backward compatibility but new onboarding will use the new structure
-- Old columns can be set to NULL for new users going through the new onboarding flow

