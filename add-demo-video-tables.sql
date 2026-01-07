-- Create demo_videos table for storing demo video metadata
CREATE TABLE IF NOT EXISTS demo_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_demo_videos_is_active ON demo_videos(is_active);
CREATE INDEX IF NOT EXISTS idx_demo_videos_created_at ON demo_videos(created_at);

-- Enable RLS
ALTER TABLE demo_videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for demo_videos
-- Allow public read for active videos
CREATE POLICY "Allow public read active demo videos" ON demo_videos
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Allow service role full access
CREATE POLICY "Allow service role full access demo videos" ON demo_videos
  FOR ALL
  TO service_role
  USING (true);

-- Allow authenticated users (admins) to manage videos
CREATE POLICY "Allow authenticated manage demo videos" ON demo_videos
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for demo videos (allows both videos and thumbnail images)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'demo-videos',
  'demo-videos',
  true,
  262144000, -- 250MB limit
  ARRAY[
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska',
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 262144000,
  allowed_mime_types = ARRAY[
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska',
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'
  ];

-- Storage policies for demo videos bucket
DROP POLICY IF EXISTS "Allow public read demo videos" ON storage.objects;
CREATE POLICY "Allow public read demo videos" ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'demo-videos');

DROP POLICY IF EXISTS "Allow authenticated upload demo videos" ON storage.objects;
CREATE POLICY "Allow authenticated upload demo videos" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'demo-videos');

DROP POLICY IF EXISTS "Allow authenticated update demo videos" ON storage.objects;
CREATE POLICY "Allow authenticated update demo videos" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'demo-videos');

DROP POLICY IF EXISTS "Allow authenticated delete demo videos" ON storage.objects;
CREATE POLICY "Allow authenticated delete demo videos" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'demo-videos');

DROP POLICY IF EXISTS "Allow service role full access demo videos" ON storage.objects;
CREATE POLICY "Allow service role full access demo videos" ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'demo-videos');

