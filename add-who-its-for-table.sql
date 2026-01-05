-- Create who_its_for_content table for managing the "Who It's For" section
CREATE TABLE IF NOT EXISTS who_its_for_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_type TEXT NOT NULL UNIQUE, -- 'positive' or 'negative'
  title TEXT NOT NULL,
  items JSONB NOT NULL, -- Array of strings for the list items
  description TEXT, -- The paragraph text below the list
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for who_its_for_content
ALTER TABLE who_its_for_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for who_its_for_content
CREATE POLICY "Allow public read who its for content" ON who_its_for_content
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Allow service role full access who its for content" ON who_its_for_content
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon full access who its for content" ON who_its_for_content
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Insert default data
INSERT INTO who_its_for_content (section_type, title, items, description, is_active)
VALUES
  (
    'positive',
    'You''ll Love mySmartly If You''re:',
    '["E-commerce founder doing $500K-$50M/year", "SaaS CEO with 10-200 employees", "Marketing Director managing $50K+/month in ad spend", "Operations manager optimizing inventory/costs", "Agency owner tracking client ROI"]'::jsonb,
    'If you''re making critical business decisions daily and need data-backed recommendations without the complexity, mySmartly transforms your scattered analytics into a clear action plan.',
    true
  ),
  (
    'negative',
    'You Might Not Need mySmartly If:',
    '["You''re a solo freelancer with one income stream", "You prefer gut-feel decisions over data", "You already have a full data science team"]'::jsonb,
    'mySmartly is built for teams that need to scale decision-making. If your business runs on intuition alone or you have dedicated analysts, you may not need automated recommendations.',
    true
  )
ON CONFLICT (section_type) DO NOTHING;

