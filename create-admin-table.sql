-- ONE-TIME SETUP: Run this once in Supabase SQL Editor
-- Then run: npm run setup-admin
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  username TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow service role full access admin users" ON admin_users;
CREATE POLICY "Allow service role full access admin users" ON admin_users
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read own admin status" ON admin_users;
CREATE POLICY "Allow authenticated read own admin status" ON admin_users
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Allow anonymous users to read username and email for login (but not sensitive data)
DROP POLICY IF EXISTS "Allow anonymous read username for login" ON admin_users;
CREATE POLICY "Allow anonymous read username for login" ON admin_users
  FOR SELECT TO anon
  USING (is_active = true)
  WITH CHECK (false);

