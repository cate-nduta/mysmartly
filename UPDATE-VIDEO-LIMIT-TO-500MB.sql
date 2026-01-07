-- Update demo-videos bucket file size limit to 500MB
-- Run this SQL in your Supabase SQL Editor

UPDATE storage.buckets
SET file_size_limit = 524288000 -- 500MB in bytes
WHERE id = 'demo-videos';

