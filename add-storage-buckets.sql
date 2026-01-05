-- Create storage bucket for team photos, logos, and favicons
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for site-assets (public read, authenticated write)
DROP POLICY IF EXISTS "Allow public read site-assets" ON storage.objects;
CREATE POLICY "Allow public read site-assets" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Allow authenticated upload site-assets" ON storage.objects;
CREATE POLICY "Allow authenticated upload site-assets" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Allow authenticated update site-assets" ON storage.objects;
CREATE POLICY "Allow authenticated update site-assets" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-assets')
  WITH CHECK (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Allow authenticated delete site-assets" ON storage.objects;
CREATE POLICY "Allow authenticated delete site-assets" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-assets');

-- Also allow anon for admin dashboard (if using service role key)
DROP POLICY IF EXISTS "Allow anon upload site-assets" ON storage.objects;
CREATE POLICY "Allow anon upload site-assets" ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Allow anon update site-assets" ON storage.objects;
CREATE POLICY "Allow anon update site-assets" ON storage.objects
  FOR UPDATE
  TO anon
  USING (bucket_id = 'site-assets')
  WITH CHECK (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Allow anon delete site-assets" ON storage.objects;
CREATE POLICY "Allow anon delete site-assets" ON storage.objects
  FOR DELETE
  TO anon
  USING (bucket_id = 'site-assets');

