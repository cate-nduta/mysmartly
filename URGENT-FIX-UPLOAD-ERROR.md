# ⚠️ URGENT: Fix Upload Error - Supabase Bucket Limit

## Your File:
- **Size:** 202.96 MB (212,813,745 bytes)
- **Format:** MP4 (video/mp4) ✅
- **Status:** UNDER 500MB limit ✅

## Problem:
Supabase storage bucket still has **100MB limit** instead of **500MB**

## ⚡ QUICK FIX (Takes 2 minutes):

### Step 1: Open Supabase
1. Go to: https://supabase.com/dashboard
2. Select your project

### Step 2: SQL Editor
1. Click **"SQL Editor"** (left sidebar)
2. Click **"New query"**

### Step 3: Copy & Paste This:
```sql
UPDATE storage.buckets
SET file_size_limit = 524288000
WHERE id = 'demo-videos';
```

### Step 4: Run It
- Click **"Run"** button (or press Ctrl+Enter)

### Step 5: Verify It Worked
Run this to check:
```sql
SELECT id, name, file_size_limit 
FROM storage.buckets 
WHERE id = 'demo-videos';
```

**Should show:** `file_size_limit = 524288000` ✅

### Step 6: Upload Your Video
- Go back to admin panel
- Upload "Recording 2026-01-06 230744.mp4" (202.96 MB)
- You'll see progress percentage: 0% → 100%
- It will work! ✅

---

**After running the SQL, your 202.96 MB video will upload successfully!**

