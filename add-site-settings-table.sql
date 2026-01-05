-- Add site_settings table for logo and other site configurations
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type TEXT DEFAULT 'text', -- 'text', 'url', 'json'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Allow public read site settings" ON site_settings;
CREATE POLICY "Allow public read site settings" ON site_settings
  FOR SELECT
  TO anon
  USING (true);

-- Allow service role full access
DROP POLICY IF EXISTS "Allow service role full access site settings" ON site_settings;
CREATE POLICY "Allow service role full access site settings" ON site_settings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon full access for admin dashboard
DROP POLICY IF EXISTS "Allow anon full access site settings" ON site_settings;
CREATE POLICY "Allow anon full access site settings" ON site_settings
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Insert default logo setting (using current logo path)
INSERT INTO site_settings (setting_key, setting_value, setting_type, description)
VALUES
  (
    'logo_url',
    '/icon.svg',
    'url',
    'URL to the site logo. Can be a relative path (e.g., /logo.svg) or full URL (e.g., https://example.com/logo.png)'
  ),
  (
    'logo_text',
    'mySmartly',
    'text',
    'Text to display with the logo (optional)'
  ),
  (
    'favicon_url',
    '/icon.svg',
    'url',
    'URL to the site favicon'
  )
ON CONFLICT (setting_key) DO NOTHING;

