# Fix Upload Error - Increase Limit to 500MB

## Problem
Your video file (202.96 MB) is failing to upload with error: "The object exceeded the maximum allowed size"

## Solution
The Supabase storage bucket still has a 100MB limit. You need to update it to 500MB.

## Step-by-Step Fix:

### 1. Open Supabase Dashboard
- Go to https://supabase.com/dashboard
- Select your project

### 2. Open SQL Editor
- Click "SQL Editor" in the left sidebar
- Click "New query"

### 3. Run This SQL:
```sql
-- Update demo-videos bucket file size limit to 500MB
UPDATE storage.buckets
SET file_size_limit = 524288000  -- 500MB in bytes (500 * 1024 * 1024)
WHERE id = 'demo-videos';
```

### 4. Verify It Worked:
Run this query to check:
```sql
SELECT id, name, file_size_limit 
FROM storage.buckets 
WHERE id = 'demo-videos';
```

You should see: `file_size_limit = 524288000`

### 5. Try Uploading Again
Your 202.96 MB video should now upload successfully!

---

**Your file (202.96 MB) is under the 500MB limit, so once you update the bucket, it will work!**

