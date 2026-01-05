-- Add team_members table for About page
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  email TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active team members
DROP POLICY IF EXISTS "Allow public read active team members" ON team_members;
CREATE POLICY "Allow public read active team members" ON team_members
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Allow service role full access
DROP POLICY IF EXISTS "Allow service role full access team members" ON team_members;
CREATE POLICY "Allow service role full access team members" ON team_members
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon full access for admin dashboard
DROP POLICY IF EXISTS "Allow anon full access team members" ON team_members;
CREATE POLICY "Allow anon full access team members" ON team_members
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Add contact_page_content table for Contact page
CREATE TABLE IF NOT EXISTS contact_page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_type TEXT NOT NULL UNIQUE, -- 'hero', 'contact_form', 'office_info', etc.
  title TEXT,
  description TEXT,
  content JSONB, -- Flexible JSON content for different sections
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE contact_page_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Allow public read contact content" ON contact_page_content;
CREATE POLICY "Allow public read contact content" ON contact_page_content
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Allow service role full access
DROP POLICY IF EXISTS "Allow service role full access contact content" ON contact_page_content;
CREATE POLICY "Allow service role full access contact content" ON contact_page_content
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon full access for admin dashboard
DROP POLICY IF EXISTS "Allow anon full access contact content" ON contact_page_content;
CREATE POLICY "Allow anon full access contact content" ON contact_page_content
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Insert default contact page content
INSERT INTO contact_page_content (section_type, title, description, content)
VALUES
  (
    'hero',
    'Get in Touch',
    'Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.',
    '{"subtitle": "We're here to help"}'
  ),
  (
    'office_info',
    'Office Information',
    'Our office details',
    '{
      "address": "Your Office Address",
      "city": "City, State ZIP",
      "email": "hello@mysmartly.app",
      "phone": "+1 (555) 123-4567",
      "hours": "Monday - Friday, 9am - 5pm EST"
    }'
  ),
  (
    'support_info',
    'Support',
    'Support options',
    '{
      "support_email": "support@mysmartly.app",
      "support_hours": "24/7 email support"
    }'
  )
ON CONFLICT (section_type) DO NOTHING;

-- Insert default team member (you)
INSERT INTO team_members (name, role, bio, display_order, is_active)
VALUES
  (
    'Your Name',
    'Founder & Developer',
    'Building mySmartly to help businesses make data-driven decisions.',
    1,
    true
  )
ON CONFLICT DO NOTHING;

