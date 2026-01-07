-- ============================================
-- COMPLETE FIX FOR 250MB VIDEO UPLOAD
-- ============================================
-- Run this ENTIRE script in Supabase SQL Editor
-- This ensures the bucket is properly configured for 250MB uploads

-- Step 1: Update the bucket file size limit to 250MB (262144000 bytes)
UPDATE storage.buckets
SET file_size_limit = 262144000
WHERE id = 'demo-videos';

-- Step 2: Verify the bucket exists and has correct settings
-- If bucket doesn't exist, create it
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'demo-videos',
  'demo-videos',
  true,
  262144000, -- 250MB in bytes
  ARRAY[
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 
    'video/x-msvideo', 'video/x-matroska',
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 262144000,
  allowed_mime_types = ARRAY[
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 
    'video/x-msvideo', 'video/x-matroska',
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'
  ];

-- Step 3: Verify the update worked
SELECT 
  id, 
  name, 
  file_size_limit, 
  file_size_limit / 1024 / 1024 as size_limit_mb,
  public,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'demo-videos';

-- Expected result: file_size_limit should be 262144000 (250MB)
-- If you see 104857600 (100MB), the update didn't work - try again

-- Step 4: Ensure storage policies allow uploads
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

DROP POLICY IF EXISTS "Allow public read demo videos" ON storage.objects;
CREATE POLICY "Allow public read demo videos" ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'demo-videos');

-- Step 5: Final verification
-- Run this to confirm everything is set correctly:
SELECT 
  'Bucket Configuration' as check_type,
  CASE 
    WHEN file_size_limit = 262144000 THEN '✅ CORRECT (250MB)'
    ELSE '❌ WRONG - Still ' || (file_size_limit / 1024 / 1024) || 'MB'
  END as status
FROM storage.buckets 
WHERE id = 'demo-videos';

