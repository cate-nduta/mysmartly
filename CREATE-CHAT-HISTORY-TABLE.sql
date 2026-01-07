-- Create chat_history table for storing chatbot conversations
-- Run this SQL in your Supabase SQL Editor

-- Create chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  session_id TEXT, -- Optional: group messages by conversation session
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_history_session_id ON chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_created ON chat_history(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own chat history
DROP POLICY IF EXISTS "Users can view own chat history" ON chat_history;
CREATE POLICY "Users can view own chat history" ON chat_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own messages
DROP POLICY IF EXISTS "Users can insert own messages" ON chat_history;
CREATE POLICY "Users can insert own messages" ON chat_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Service role has full access (for cleanup operations)
DROP POLICY IF EXISTS "Service role full access chat_history" ON chat_history;
CREATE POLICY "Service role full access chat_history" ON chat_history
  FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- Add data_history_days column to pricing_plans table
ALTER TABLE pricing_plans
ADD COLUMN IF NOT EXISTS data_history_days INTEGER;

-- Update existing plans with data history limits
UPDATE pricing_plans
SET data_history_days = 7
WHERE name = 'Starter' AND (data_history_days IS NULL OR data_history_days != 7);

UPDATE pricing_plans
SET data_history_days = 90
WHERE name = 'Pro' AND (data_history_days IS NULL OR data_history_days != 90);

UPDATE pricing_plans
SET data_history_days = NULL -- NULL means unlimited for Enterprise
WHERE name = 'Enterprise' AND data_history_days IS NOT NULL;

-- Function to clean up old chat history based on user's plan
CREATE OR REPLACE FUNCTION cleanup_old_chat_history()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record RECORD;
  history_days INTEGER;
  cutoff_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Loop through all users with subscriptions
  FOR user_record IN
    SELECT DISTINCT us.user_id, us.plan_name, pp.data_history_days
    FROM user_subscriptions us
    LEFT JOIN pricing_plans pp ON us.plan_name = pp.name
    WHERE us.status IN ('active', 'trial')
  LOOP
    -- Get history limit for this user's plan
    history_days := user_record.data_history_days;
    
    -- If NULL (Enterprise/unlimited), skip cleanup for this user
    IF history_days IS NULL THEN
      CONTINUE;
    END IF;
    
    -- Calculate cutoff date
    cutoff_date := NOW() - (history_days || ' days')::INTERVAL;
    
    -- Delete messages older than the limit
    DELETE FROM chat_history
    WHERE user_id = user_record.user_id
      AND created_at < cutoff_date;
  END LOOP;
END;
$$;

-- Create a scheduled job (if using pg_cron extension)
-- Note: This requires pg_cron extension to be enabled in Supabase
-- Uncomment if you have pg_cron enabled:
-- SELECT cron.schedule(
--   'cleanup-chat-history',
--   '0 2 * * *', -- Run daily at 2 AM
--   $$SELECT cleanup_old_chat_history();$$
-- );

