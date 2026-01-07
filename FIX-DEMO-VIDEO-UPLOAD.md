# Fix Demo Video Upload Error

## Problem
Error: "mime type image/png is not supported"

## Root Cause
The `demo-videos` storage bucket in Supabase was configured to only accept video MIME types, but thumbnails are image files (PNG, JPG, etc.).

## Solution Applied

### 1. Updated Storage Bucket Configuration
Updated `add-demo-video-tables.sql` to allow both video AND image MIME types:
- Videos: `video/mp4`, `video/webm`, `video/ogg`, `video/quicktime`, etc.
- Images: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

### 2. Improved Upload Function
- Added explicit `contentType` parameter when uploading
- Better error messages
- Validates file types before upload

### 3. Enhanced Validation
- Client-side validation before upload
- Double-checks file types in the submit handler
- Clear error messages for users

## How to Apply the Fix

### Option 1: Update Existing Bucket (Recommended)
Run this SQL in Supabase SQL Editor:

```sql
-- Update the demo-videos bucket to allow both video and image files
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska',
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'
]
WHERE id = 'demo-videos';
```

### Option 2: Run Full Script
If the bucket doesn't exist yet, run the updated `add-demo-video-tables.sql` script.

## Testing

1. Upload a video file (MP4, WebM, etc.) → Should work ✅
2. Upload a thumbnail image (PNG, JPG) → Should work ✅
3. Try uploading wrong file type → Clear error message ✅

## File Structure
```
demo-videos/
├── videos/
│   └── [video files: .mp4, .webm, etc.]
└── thumbnails/
    └── [image files: .png, .jpg, etc.]
```

---

**The upload should now work without errors!** 🎉

