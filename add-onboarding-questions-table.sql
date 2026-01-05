-- Create user_onboarding table for storing onboarding questionnaire responses
CREATE TABLE IF NOT EXISTS user_onboarding (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  business_role TEXT, -- e.g., 'owner', 'social_media_manager', 'marketing_director', 'operations_manager', 'ceo', 'other'
  other_role TEXT, -- If role is 'other', store custom role here
  goals_year INTEGER, -- The year they're setting goals for (e.g., 2026)
  specific_goals TEXT[], -- Array of specific goals
  how_mysmartly_helps TEXT, -- How they want mySmartly to help
  additional_info TEXT, -- Any additional information they want to provide
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id)
);

-- Enable RLS for user_onboarding
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_onboarding
CREATE POLICY "Allow users to read their own onboarding data" ON user_onboarding
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own onboarding data" ON user_onboarding
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own onboarding data" ON user_onboarding
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow service role full access onboarding" ON user_onboarding
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

