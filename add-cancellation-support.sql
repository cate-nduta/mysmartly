-- Add cancellation support to user_subscriptions table
-- Run this if the columns don't exist

ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS cancel_reason TEXT;

-- Update RLS policies to allow users to update their own subscription
DROP POLICY IF EXISTS "Allow authenticated update own subscription" ON user_subscriptions;
CREATE POLICY "Allow authenticated update own subscription" ON user_subscriptions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

