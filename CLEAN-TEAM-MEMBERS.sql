-- Clean up team members - Remove duplicates and invalid entries
-- Run this in Supabase SQL Editor

-- Step 1: Find and list duplicate team members (by name)
SELECT 
  name, 
  COUNT(*) as count,
  array_agg(id) as ids,
  array_agg(is_active) as active_statuses
FROM team_members
GROUP BY name
HAVING COUNT(*) > 1;

-- Step 2: Delete duplicate entries, keeping only the most recent active one
-- This will keep the newest active entry for each name, delete the rest
WITH duplicates AS (
  SELECT 
    id,
    name,
    is_active,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY name 
      ORDER BY is_active DESC, created_at DESC
    ) as rn
  FROM team_members
)
DELETE FROM team_members
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Step 3: Delete entries with empty or placeholder names
DELETE FROM team_members
WHERE name IS NULL 
   OR TRIM(name) = '' 
   OR LOWER(TRIM(name)) IN ('your name', 'name', 'test', 'placeholder');

-- Step 4: Set all remaining members to active (if you want them all visible)
-- Uncomment the line below if you want to activate all remaining members:
-- UPDATE team_members SET is_active = true WHERE is_active = false;

-- Step 5: Verify the cleanup
SELECT 
  id,
  name,
  role,
  is_active,
  created_at
FROM team_members
ORDER BY display_order, created_at;

