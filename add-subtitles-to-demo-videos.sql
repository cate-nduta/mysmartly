-- Add subtitle URL columns to demo_videos table
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE demo_videos 
ADD COLUMN IF NOT EXISTS subtitles_url TEXT,
ADD COLUMN IF NOT EXISTS subtitles_fr_url TEXT;

COMMENT ON COLUMN demo_videos.subtitles_url IS 'URL to WebVTT subtitle file for English (or default language)';
COMMENT ON COLUMN demo_videos.subtitles_fr_url IS 'URL to WebVTT subtitle file for French';

