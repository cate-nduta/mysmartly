CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert" ON waitlist;
CREATE POLICY "Allow public insert" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role read" ON waitlist;
CREATE POLICY "Allow service role read" ON waitlist
  FOR SELECT
  TO service_role
  USING (true);

CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT[],
  salary NUMERIC,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  cover_letter TEXT,
  resume_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  price TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  cta_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  two_factor_enabled BOOLEAN DEFAULT false,
  email_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'trial',
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS data_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  connection_type TEXT NOT NULL,
  connection_config JSONB,
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  action_type TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_onboarding (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  business_name TEXT,
  business_role TEXT,
  goals_year INTEGER,
  specific_goals TEXT[],
  how_mysmartly_helps TEXT,
  additional_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

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

CREATE TABLE IF NOT EXISTS contact_page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_type TEXT NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  content JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  setting_type TEXT DEFAULT 'text',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'mySmartly Team',
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  read_time TEXT DEFAULT '5 min read',
  category TEXT NOT NULL DEFAULT 'General',
  is_published BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS case_studies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  company_name TEXT NOT NULL,
  industry TEXT,
  challenge TEXT,
  solution TEXT,
  results JSONB,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS guides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'mySmartly Team',
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  read_time TEXT DEFAULT '8 min read',
  category TEXT NOT NULL DEFAULT 'Guide',
  download_url TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS webinars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  presenter TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  duration_minutes INTEGER DEFAULT 60,
  registration_url TEXT,
  recording_url TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS who_its_for_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_type TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  items JSONB NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES job_applications(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  email_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE who_its_for_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read active jobs" ON jobs;
DROP POLICY IF EXISTS "Allow authenticated full access jobs" ON jobs;
DROP POLICY IF EXISTS "Allow service role full access jobs" ON jobs;

CREATE POLICY "Allow public read active jobs" ON jobs
  FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Allow authenticated full access jobs" ON jobs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role full access jobs" ON jobs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert applications" ON job_applications;
DROP POLICY IF EXISTS "Allow authenticated full access applications" ON job_applications;
DROP POLICY IF EXISTS "Allow service role full access applications" ON job_applications;

CREATE POLICY "Allow public insert applications" ON job_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated full access applications" ON job_applications
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role full access applications" ON job_applications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read pricing" ON pricing_plans;
DROP POLICY IF EXISTS "Allow authenticated read pricing" ON pricing_plans;
DROP POLICY IF EXISTS "Allow authenticated update pricing" ON pricing_plans;
DROP POLICY IF EXISTS "Allow service role full access pricing" ON pricing_plans;

CREATE POLICY "Allow public read pricing" ON pricing_plans
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read pricing" ON pricing_plans
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated update pricing" ON pricing_plans
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role full access pricing" ON pricing_plans
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Allow authenticated update own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Allow service role full access preferences" ON user_preferences;

CREATE POLICY "Allow authenticated read own preferences" ON user_preferences
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow authenticated update own preferences" ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow service role full access preferences" ON user_preferences
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read own subscriptions" ON user_subscriptions;
DROP POLICY IF EXISTS "Allow service role full access subscriptions" ON user_subscriptions;

CREATE POLICY "Allow authenticated read own subscriptions" ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow service role full access subscriptions" ON user_subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read own connections" ON data_connections;
DROP POLICY IF EXISTS "Allow authenticated manage own connections" ON data_connections;
DROP POLICY IF EXISTS "Allow service role full access connections" ON data_connections;

CREATE POLICY "Allow authenticated read own connections" ON data_connections
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow authenticated manage own connections" ON data_connections
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow service role full access connections" ON data_connections
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read own recommendations" ON recommendations;
DROP POLICY IF EXISTS "Allow service role full access recommendations" ON recommendations;

CREATE POLICY "Allow authenticated read own recommendations" ON recommendations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow service role full access recommendations" ON recommendations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read own onboarding" ON user_onboarding;
DROP POLICY IF EXISTS "Allow authenticated insert own onboarding" ON user_onboarding;
DROP POLICY IF EXISTS "Allow authenticated update own onboarding" ON user_onboarding;
DROP POLICY IF EXISTS "Allow service role full access onboarding" ON user_onboarding;

CREATE POLICY "Allow authenticated read own onboarding" ON user_onboarding
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow authenticated insert own onboarding" ON user_onboarding
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow authenticated update own onboarding" ON user_onboarding
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow service role full access onboarding" ON user_onboarding
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read own admin status" ON admin_users;
DROP POLICY IF EXISTS "Allow service role full access admin users" ON admin_users;

CREATE POLICY "Allow authenticated read own admin status" ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow service role full access admin users" ON admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read team members" ON team_members;
DROP POLICY IF EXISTS "Allow authenticated full access team members" ON team_members;
DROP POLICY IF EXISTS "Allow service role full access team members" ON team_members;

CREATE POLICY "Allow public read team members" ON team_members
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated full access team members" ON team_members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role full access team members" ON team_members
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read contact page content" ON contact_page_content;
DROP POLICY IF EXISTS "Allow authenticated full access contact page content" ON contact_page_content;
DROP POLICY IF EXISTS "Allow service role full access contact page content" ON contact_page_content;

CREATE POLICY "Allow public read contact page content" ON contact_page_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated full access contact page content" ON contact_page_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role full access contact page content" ON contact_page_content
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read site settings" ON site_settings;
DROP POLICY IF EXISTS "Allow authenticated full access site settings" ON site_settings;
DROP POLICY IF EXISTS "Allow service role full access site settings" ON site_settings;

CREATE POLICY "Allow public read site settings" ON site_settings
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access site settings" ON site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role full access site settings" ON site_settings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated full access blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow service role full access blog posts" ON blog_posts;

CREATE POLICY "Allow public read published blog posts" ON blog_posts
  FOR SELECT
  TO anon
  USING (is_published = true);

CREATE POLICY "Allow authenticated full access blog posts" ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role full access blog posts" ON blog_posts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read published case studies" ON case_studies;
DROP POLICY IF EXISTS "Allow authenticated full access case studies" ON case_studies;
DROP POLICY IF EXISTS "Allow service role full access case studies" ON case_studies;

CREATE POLICY "Allow public read published case studies" ON case_studies
  FOR SELECT
  TO anon
  USING (is_published = true);

CREATE POLICY "Allow authenticated full access case studies" ON case_studies
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role full access case studies" ON case_studies
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read published guides" ON guides;
DROP POLICY IF EXISTS "Allow authenticated full access guides" ON guides;
DROP POLICY IF EXISTS "Allow service role full access guides" ON guides;

CREATE POLICY "Allow public read published guides" ON guides
  FOR SELECT
  TO anon
  USING (is_published = true);

CREATE POLICY "Allow authenticated full access guides" ON guides
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role full access guides" ON guides
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read webinars" ON webinars;
DROP POLICY IF EXISTS "Allow authenticated full access webinars" ON webinars;
DROP POLICY IF EXISTS "Allow service role full access webinars" ON webinars;

CREATE POLICY "Allow public read webinars" ON webinars
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated full access webinars" ON webinars
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role full access webinars" ON webinars
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read who its for content" ON who_its_for_content;
DROP POLICY IF EXISTS "Allow authenticated full access who its for content" ON who_its_for_content;
DROP POLICY IF EXISTS "Allow service role full access who its for content" ON who_its_for_content;

CREATE POLICY "Allow public read who its for content" ON who_its_for_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated full access who its for content" ON who_its_for_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role full access who its for content" ON who_its_for_content
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read email logs" ON email_logs;
DROP POLICY IF EXISTS "Allow service role full access email logs" ON email_logs;

CREATE POLICY "Allow authenticated read email logs" ON email_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service role full access email logs" ON email_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow public upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow service role full access resumes" ON storage.objects;

CREATE POLICY "Allow public upload resumes" ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Allow public read resumes" ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'resumes');

CREATE POLICY "Allow service role full access resumes" ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'resumes')
  WITH CHECK (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Allow authenticated upload team photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload favicons" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read site assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update team photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete team photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow service role full access site assets" ON storage.objects;

CREATE POLICY "Allow authenticated upload team photos" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets' AND name LIKE 'team-photos/%');

CREATE POLICY "Allow authenticated upload logos" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets' AND name LIKE 'logos/%');

CREATE POLICY "Allow authenticated upload favicons" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets' AND name LIKE 'favicons/%');

CREATE POLICY "Allow public read site assets" ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'site-assets');

CREATE POLICY "Allow authenticated update team photos" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-assets' AND name LIKE 'team-photos/%')
  WITH CHECK (bucket_id = 'site-assets' AND name LIKE 'team-photos/%');

CREATE POLICY "Allow authenticated delete team photos" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-assets' AND name LIKE 'team-photos/%');

CREATE POLICY "Allow service role full access site assets" ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'site-assets')
  WITH CHECK (bucket_id = 'site-assets');

INSERT INTO pricing_plans (name, price, period, description, features, is_popular, cta_text, created_at)
VALUES 
  ('Starter', '$149', '/month', 'Perfect for small businesses getting started', ARRAY['3 data connections', '500 decisions/month', 'Email support', '7-day data history'], false, 'Start Free Trial', '2026-01-01 00:00:00+00'),
  ('Pro', '$399', '/month', 'For growing businesses', ARRAY['10 data connections', '5,000 decisions/month', 'Priority support', '90-day data history', 'Team collaboration (3 seats)'], true, 'Start Free Trial', '2026-01-01 00:00:00+00'),
  ('Enterprise', '$1,299', '/month', 'For large organizations', ARRAY['Unlimited connections', 'Unlimited decisions', '24/7 phone support', 'Custom models', 'Dedicated CSM', 'SOC 2 reports', 'Unlimited seats'], false, 'Contact Sales', '2026-01-01 00:00:00+00')
ON CONFLICT (name) DO UPDATE SET
  price = EXCLUDED.price,
  period = EXCLUDED.period,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  is_popular = EXCLUDED.is_popular,
  cta_text = EXCLUDED.cta_text,
  updated_at = NOW();

INSERT INTO site_settings (setting_key, setting_value, setting_type, description)
VALUES
  ('logo_url', '/icon.svg', 'url', 'URL to the site logo'),
  ('logo_text', 'mySmartly', 'text', 'Text to display with the logo'),
  ('favicon_url', '/icon.svg', 'url', 'URL to the site favicon')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO contact_page_content (section_type, title, description, content, is_active)
VALUES
  ('hero', 'Get in Touch', 'We''re here to help you make smarter business decisions. Reach out to us with any questions.', NULL, true),
  ('office_info', 'Our Office', NULL, '{"address": "123 Smartly Lane, Innovation City, IC 12345", "phone": "+1 (555) 123-4567", "email": "info@mysmartly.app"}', true),
  ('support_info', 'Support & Sales', NULL, '{"support_email": "hello@mysmartly.app", "sales_email": "hello@mysmartly.app", "support_phone": "+1 (555) 987-6543"}', true)
ON CONFLICT (section_type) DO NOTHING;

INSERT INTO who_its_for_content (section_type, title, items, description, is_active)
VALUES
  ('positive', 'You''ll Love mySmartly If You''re:', '["E-commerce founder doing $500K-$50M/year", "SaaS CEO with 10-200 employees", "Marketing Director managing $50K+/month in ad spend", "Operations manager optimizing inventory/costs", "Agency owner tracking client ROI"]'::jsonb, 'If you''re making critical business decisions daily and need data-backed recommendations without the complexity, mySmartly transforms your scattered analytics into a clear action plan.', true),
  ('negative', 'You Might Not Need mySmartly If:', '["You''re a solo freelancer with one income stream", "You prefer gut-feel decisions over data", "You already have a full data science team"]'::jsonb, 'mySmartly is built for teams that need to scale decision-making. If your business runs on intuition alone or you have dedicated analysts, you may not need automated recommendations.', true)
ON CONFLICT (section_type) DO NOTHING;

