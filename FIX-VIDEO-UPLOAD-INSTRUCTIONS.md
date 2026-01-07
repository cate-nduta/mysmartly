# Fix Video Upload - 250MB Limit

## Problem
You cannot upload videos below 250MB. The error says "exceeded the maximum allowed size" even though your file is under 250MB.

## Root Cause
The Supabase storage bucket `demo-videos` still has a **100MB limit** instead of **250MB**.

## Solution

### Step 1: Run the SQL Fix
1. Go to your **Supabase Dashboard**
2. Click on **SQL Editor** (in the left sidebar)
3. Open the file `FIX-500MB-VIDEO-UPLOAD.sql` from this project
4. Copy the **ENTIRE** SQL script
5. Paste it into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)

### Step 2: Verify It Worked
After running the SQL, run this verification query:

```sql
SELECT 
  id, 
  name, 
  file_size_limit, 
  file_size_limit / 1024 / 1024 as size_limit_mb
FROM storage.buckets 
WHERE id = 'demo-videos';
```

**Expected Result:**
- `file_size_limit` should be `262144000`
- `size_limit_mb` should be `250`

If you see `104857600` (100MB), the update didn't work. Try running the SQL again.

### Step 3: Upload Your Video
1. Refresh your admin page
2. Go to Demo Video Management
3. Click "Add New Video"
4. Select your video file (must be under 250MB)
5. Fill in title and description
6. Click "Upload Video"

## Supported Video Formats
- MP4 (recommended)
- WebM
- OGG
- QuickTime (MOV)
- AVI
- MKV

## File Size Limit
- **Maximum:** 250MB (262,144,000 bytes)
- **Recommended:** Under 200MB for faster uploads

## Troubleshooting

### Still Getting "Size Limit Exceeded" Error?
1. **Double-check the bucket limit:**
   ```sql
   SELECT file_size_limit FROM storage.buckets WHERE id = 'demo-videos';
   ```
   Must show: `262144000`

2. **Check your file size:**
   - Right-click your video file → Properties
   - Check the actual file size
   - Must be under 250MB

3. **Clear browser cache and refresh:**
   - Press Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Try uploading again

4. **Check you're logged in as admin:**
   - Make sure you're authenticated
   - You should see your email in the admin dashboard

### Upload is Slow or Timing Out?
- Large files (200MB+) may take several minutes
- Be patient and don't close the browser
- The progress bar will show upload status
- If it fails, try again - network issues can cause temporary failures

### Video Not Showing on Demo Page?
1. Make sure the video is marked as **Active** (green badge)
2. Only **one** video can be active at a time
3. Check the demo page: `/demo`
4. If still not showing, check browser console for errors

## Need Help?
If you've followed all steps and it still doesn't work:
1. Check the browser console (F12) for error messages
2. Check Supabase logs in the Dashboard
3. Verify your file is actually a video file (not an image)
4. Try a smaller test file first (under 50MB) to confirm upload works

