-- Create the resumes storage bucket
-- Run this FIRST if you get "Bucket not found" errors
-- If this doesn't work, create the bucket manually in Supabase Dashboard > Storage

-- Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('resumes', 'resumes', true, 5242880, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies for resumes
DROP POLICY IF EXISTS "Allow public upload resumes" ON storage.objects;
CREATE POLICY "Allow public upload resumes" ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Allow service role full access resumes" ON storage.objects;
CREATE POLICY "Allow service role full access resumes" ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'resumes')
  WITH CHECK (bucket_id = 'resumes');

DROP POLICY IF EXISTS "Allow public read resumes" ON storage.objects;
CREATE POLICY "Allow public read resumes" ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'resumes');


