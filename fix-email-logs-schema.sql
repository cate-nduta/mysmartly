-- Fix email_logs table schema to match waitlist email logging
-- This is OPTIONAL - only needed if you want to track email status in the database
-- Email sending will work fine without this table

-- First, check if table exists and add missing columns if needed
ALTER TABLE email_logs 
ADD COLUMN IF NOT EXISTS to_email TEXT,
ADD COLUMN IF NOT EXISTS error_details TEXT;

-- Update the table to handle waitlist welcome emails
-- This ensures the schema matches what the code expects

-- Note: The email_logs table is completely optional
-- Email sending uses SMTP and doesn't require any database tables
-- This table is only for tracking/logging email status

