CREATE TABLE IF NOT EXISTS legal_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_type TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read legal pages" ON legal_pages;
CREATE POLICY "Allow public read legal pages" ON legal_pages
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access legal pages" ON legal_pages;
CREATE POLICY "Allow authenticated full access legal pages" ON legal_pages
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role full access legal pages" ON legal_pages;
CREATE POLICY "Allow service role full access legal pages" ON legal_pages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

INSERT INTO legal_pages (page_type, title, content, last_updated)
VALUES
  ('privacy', 'Privacy Policy', 'Default privacy policy content - This will be replaced when you edit from admin.', '2026-01-05'),
  ('terms', 'Terms of Service', 'Default terms of service content - This will be replaced when you edit from admin.', '2026-01-05'),
  ('security', 'Security & Compliance', 'Default security content - This will be replaced when you edit from admin.', '2026-01-05')
ON CONFLICT (page_type) DO NOTHING;

