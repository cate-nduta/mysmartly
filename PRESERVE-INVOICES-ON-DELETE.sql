-- Update invoices table to preserve invoices when user account is deleted
-- This ensures unpaid invoices remain even after account deletion
-- When user signs up again with same email, invoices can be reattached

-- First, drop the existing foreign key constraint
ALTER TABLE invoices 
  DROP CONSTRAINT IF EXISTS invoices_user_id_fkey;

-- Recreate the foreign key with ON DELETE SET NULL instead of CASCADE
-- This preserves invoices by setting user_id to NULL when user is deleted
ALTER TABLE invoices
  ADD CONSTRAINT invoices_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL;

-- Add index for invoices with null user_id (for reattaching later)
CREATE INDEX IF NOT EXISTS idx_invoices_null_user ON invoices(user_id) WHERE user_id IS NULL;

-- Add email column to invoices table to help reattach invoices when user signs up again
-- This allows matching invoices by email even if user_id is null
ALTER TABLE invoices 
  ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_invoices_user_email ON invoices(user_email);

-- Update existing invoices to have user_email
UPDATE invoices i
SET user_email = u.email
FROM auth.users u
WHERE i.user_id = u.id AND i.user_email IS NULL;

-- Note: When deleting a user account, the deletion process should:
-- 1. Update invoices to set user_id = NULL and preserve user_email
-- 2. Delete the user from auth.users
-- 3. When user signs up again, match invoices by email and reattach user_id

