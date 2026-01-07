-- Create analytics_data table to store Google Analytics data
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS analytics_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connection_id UUID NOT NULL REFERENCES data_connections(id) ON DELETE CASCADE,
  property_id TEXT NOT NULL,
  data JSONB NOT NULL,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, connection_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_analytics_data_user_id ON analytics_data(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_data_connection_id ON analytics_data(connection_id);
CREATE INDEX IF NOT EXISTS idx_analytics_data_property_id ON analytics_data(property_id);
CREATE INDEX IF NOT EXISTS idx_analytics_data_synced_at ON analytics_data(synced_at DESC);

-- Enable Row Level Security
ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own analytics data
DROP POLICY IF EXISTS "Users can view own analytics data" ON analytics_data;
CREATE POLICY "Users can view own analytics data" ON analytics_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Service role can do everything
DROP POLICY IF EXISTS "Service role full access analytics_data" ON analytics_data;
CREATE POLICY "Service role full access analytics_data" ON analytics_data
  FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

