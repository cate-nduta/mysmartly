-- Add tables for managing blogs, case studies, guides, and webinars from admin

-- Blog Posts Table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Case Studies Table
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'mySmartly Team',
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  read_time TEXT DEFAULT '10 min read',
  category TEXT NOT NULL DEFAULT 'Case Study',
  company_name TEXT,
  industry TEXT,
  results JSONB, -- Flexible JSON for metrics like {"profit_increase": "34%", "time_saved": "40%"}
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Guides Table
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
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Webinars Table
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
  status TEXT NOT NULL DEFAULT 'upcoming', -- 'upcoming', 'live', 'recorded', 'cancelled'
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts
DROP POLICY IF EXISTS "Allow public read published blog posts" ON blog_posts;
CREATE POLICY "Allow public read published blog posts" ON blog_posts
  FOR SELECT
  TO anon
  USING (is_published = true);

DROP POLICY IF EXISTS "Allow service role full access blog posts" ON blog_posts;
CREATE POLICY "Allow service role full access blog posts" ON blog_posts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon full access blog posts" ON blog_posts;
CREATE POLICY "Allow anon full access blog posts" ON blog_posts
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for case_studies
DROP POLICY IF EXISTS "Allow public read published case studies" ON case_studies;
CREATE POLICY "Allow public read published case studies" ON case_studies
  FOR SELECT
  TO anon
  USING (is_published = true);

DROP POLICY IF EXISTS "Allow service role full access case studies" ON case_studies;
CREATE POLICY "Allow service role full access case studies" ON case_studies
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon full access case studies" ON case_studies;
CREATE POLICY "Allow anon full access case studies" ON case_studies
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for guides
DROP POLICY IF EXISTS "Allow public read published guides" ON guides;
CREATE POLICY "Allow public read published guides" ON guides
  FOR SELECT
  TO anon
  USING (is_published = true);

DROP POLICY IF EXISTS "Allow service role full access guides" ON guides;
CREATE POLICY "Allow service role full access guides" ON guides
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon full access guides" ON guides;
CREATE POLICY "Allow anon full access guides" ON guides
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for webinars
DROP POLICY IF EXISTS "Allow public read webinars" ON webinars;
CREATE POLICY "Allow public read webinars" ON webinars
  FOR SELECT
  TO anon
  USING (status != 'cancelled');

DROP POLICY IF EXISTS "Allow service role full access webinars" ON webinars;
CREATE POLICY "Allow service role full access webinars" ON webinars
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon full access webinars" ON webinars;
CREATE POLICY "Allow anon full access webinars" ON webinars
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Insert default/migrate existing blog posts
INSERT INTO blog_posts (slug, title, excerpt, content, author, published_date, read_time, category, is_published)
VALUES
  (
    'real-cost-analysis-paralysis',
    'The Real Cost of Analysis Paralysis in Business',
    'Analysis paralysis costs businesses more than just time—it costs opportunities, revenue, and competitive advantage. Learn how to break free.',
    '<p>Analysis paralysis is one of the most costly business problems that rarely gets the attention it deserves. While most business leaders recognize the symptoms—endless meetings, delayed decisions, and teams stuck in planning mode—few realize the true cost of this condition.</p><h2>The Hidden Costs</h2><p>When businesses get stuck in analysis mode, they''re not just wasting time. They''re:</p><ul><li><strong>Missing opportunities:</strong> While you''re analyzing, competitors are moving. Market windows close fast.</li><li><strong>Burning resources:</strong> Time spent analyzing is time not spent executing or generating revenue.</li><li><strong>Losing momentum:</strong> Teams lose enthusiasm when decisions are delayed, leading to decreased productivity.</li><li><strong>Increasing costs:</strong> Extended analysis periods mean more meetings, more reports, more overhead.</li></ul><h2>The Data-Driven Solution</h2><p>The solution isn''t to stop analyzing—it''s to analyze faster and more effectively. Modern AI-powered analytics platforms can process data in minutes that would take teams weeks to analyze manually.</p><h2>Breaking Free</h2><p>Start by setting clear decision deadlines. Use data to inform decisions, not to delay them. And most importantly, remember that perfect data is the enemy of good decisions. In business, good decisions made quickly often beat perfect decisions made too late.</p>',
    'mySmartly Team',
    '2026-01-15',
    '5 min read',
    'Strategy',
    true
  ),
  (
    'calculate-marketing-roi',
    'How to Calculate Marketing ROI: A Simple Guide',
    'Marketing ROI isn''t just about revenue. Learn how to calculate true ROI including customer lifetime value, attribution, and indirect benefits.',
    '<p>Marketing ROI seems straightforward: revenue from marketing divided by marketing costs. But true ROI calculation is more nuanced than this simple formula suggests.</p><h2>The Basic Formula</h2><p>At its simplest, Marketing ROI = (Revenue from Marketing - Marketing Costs) / Marketing Costs × 100</p><p>But this basic formula misses several important factors.</p><h2>Including Customer Lifetime Value</h2><p>If you''re only counting immediate revenue, you''re underestimating your ROI. A customer acquired through marketing doesn''t just generate revenue once—they generate revenue over their lifetime.</p><p>Calculate LTV-based ROI: (LTV × Number of Customers - Marketing Costs) / Marketing Costs × 100</p><h2>Attribution Challenges</h2><p>Modern customers interact with multiple touchpoints before converting. Proper attribution ensures you''re crediting the right channels with the right value.</p><h2>Indirect Benefits</h2><p>Marketing also generates indirect benefits: brand awareness, customer education, and competitive positioning. While harder to measure, these shouldn''t be ignored.</p>',
    'mySmartly Team',
    '2026-01-10',
    '7 min read',
    'Marketing',
    true
  ),
  (
    'ecommerce-data-mistakes',
    '5 Data Mistakes E-commerce Stores Make (And How to Fix Them)',
    'Common data mistakes that cost e-commerce stores revenue and how to fix them with better analytics and decision-making.',
    '<p>E-commerce stores have access to more data than ever before, but many are making critical mistakes that cost them revenue and growth. Here are the five most common mistakes and how to fix them.</p><h2>1. Ignoring Customer Lifetime Value</h2><p>Many e-commerce stores optimize for immediate conversion while ignoring the long-term value of customers. Focus on metrics that matter for long-term growth.</p><h2>2. Not Tracking Abandoned Carts Properly</h2><p>Cart abandonment is a goldmine of opportunity. Track it, analyze it, and create targeted campaigns to recover those sales.</p><h2>3. Poor Inventory Management</h2><p>Too much inventory ties up capital; too little loses sales. Use data to predict demand and optimize stock levels.</p><h2>4. Neglecting Post-Purchase Data</h2><p>What happens after purchase matters. Return rates, repeat purchase behavior, and customer satisfaction all inform future strategies.</p><h2>5. Analysis Without Action</h2><p>Data is useless if it doesn''t lead to decisions. Implement systems that translate insights into actionable recommendations.</p>',
    'mySmartly Team',
    '2026-01-05',
    '6 min read',
    'E-commerce',
    true
  ),
  (
    'automated-decisions-2026',
    'Why 2026 is the Year of Automated Business Decisions',
    'Why automated decision-making is no longer a nice-to-have but a competitive necessity in 2026 and beyond.',
    '<p>2026 marks a turning point for business decision-making. The convergence of advanced AI, accessible analytics platforms, and economic pressures is making automated decision-making not just viable, but necessary.</p><h2>The Perfect Storm</h2><p>Several factors are converging to make 2026 the year of automated decisions:</p><ul><li><strong>AI Maturity:</strong> AI models have reached a level of sophistication where they can handle complex business scenarios.</li><li><strong>Data Accessibility:</strong> More business data is accessible than ever before, making automation feasible.</li><li><strong>Economic Pressure:</strong> Businesses need to do more with less, making efficiency critical.</li><li><strong>Competitive Necessity:</strong> Companies that don''t automate are falling behind those that do.</li></ul><h2>The Benefits</h2><p>Automated decision-making offers clear advantages: speed, consistency, scalability, and the ability to process more data than humans ever could.</p><h2>Getting Started</h2><p>Start small. Automate simple, high-frequency decisions first. As you build confidence and infrastructure, expand to more complex scenarios.</p>',
    'mySmartly Team',
    '2026-01-01',
    '8 min read',
    'Trends',
    true
  ),
  (
    'case-study-profit-increase',
    'Case Study: How a SaaS Company Increased Profits by 34% with Data Automation',
    'Real-world case study showing how one SaaS company transformed their decision-making process and saw dramatic results.',
    '<p>This case study examines how a mid-size SaaS company transformed their decision-making process and achieved dramatic results in just six months.</p><h2>The Challenge</h2><p>The company was drowning in data but starving for insights. Their team spent 60% of their time on data collection and analysis, leaving little time for execution.</p><h2>The Solution</h2><p>They implemented an AI-powered decision automation platform that:</p><ul><li>Connected to all their data sources automatically</li><li>Generated daily recommendations with clear action steps</li><li>Prioritized actions based on projected impact</li><li>Tracked outcomes to improve recommendations over time</li></ul><h2>The Results</h2><p>Within six months:</p><ul><li>34% increase in profits</li><li>40% reduction in time spent on analysis</li><li>28% improvement in decision speed</li><li>25% reduction in customer churn</li></ul><h2>Key Takeaways</h2><p>The success wasn''t just about the technology—it was about changing the decision-making culture. The platform enabled faster, data-driven decisions, but it was the team''s willingness to act on recommendations that drove the results.</p>',
    'mySmartly Team',
    '2025-12-20',
    '10 min read',
    'Case Study',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_date DESC);
CREATE INDEX IF NOT EXISTS idx_case_studies_published ON case_studies(is_published, published_date DESC);
CREATE INDEX IF NOT EXISTS idx_guides_published ON guides(is_published, published_date DESC);
CREATE INDEX IF NOT EXISTS idx_webinars_status_date ON webinars(status, scheduled_date DESC);

