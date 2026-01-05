-- Update contact page content defaults to use hello@mysmartly.app instead of support@mysmartly.app
-- Run this SQL script in your Supabase SQL Editor

-- Update support_info section to use hello@mysmartly.app
UPDATE contact_page_content
SET content = jsonb_set(
  jsonb_set(
    content,
    '{support_email}',
    '"hello@mysmartly.app"'
  ),
  '{sales_email}',
  '"hello@mysmartly.app"'
)
WHERE section_type = 'support_info';

-- Verify the update
SELECT section_type, content FROM contact_page_content WHERE section_type = 'support_info';

