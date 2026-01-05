# Admin Dashboard Setup Guide

## Initial Setup

1. **Run the SQL script** in your Supabase SQL Editor (`supabase-setup.sql`)
   - This creates all necessary tables
   - Creates the storage bucket for resumes
   - Sets up default pricing plans

2. **Set Admin Password** in `.env.local`:
   ```
   NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password_here
   ```
   **Important**: Change the default password in production!

3. **Storage Bucket Setup** (if not created automatically):
   - Go to Supabase Dashboard > Storage
   - Create a new bucket named `resumes`
   - Set it to **Private** (not public)
   - Add the storage policies from the SQL script

## Using the Admin Dashboard

### Access
- Navigate to `/admin`
- Enter your admin password (set in environment variables)

### Pricing Management
- Edit any pricing plan's:
  - Price and period
  - Description
  - Features (one per line)
  - Most Popular badge
  - CTA button text
- Changes are saved immediately and appear on the pricing page

### Job Listings Management
- **Add New Job**: Click "Add New Job" button
- **Edit Job**: Click "Edit" on any job listing
- **Delete Job**: Click "Delete" (this will also delete associated applications)
- **Activate/Deactivate**: Toggle the "Active" checkbox

Job fields:
- Title
- Department
- Location
- Type (Full-time, Part-time, Contract, Remote)
- Description
- Requirements (one per line)

### Job Applications
- View all applications or filter by status (Pending, Reviewed, Rejected)
- Click "View Resume" to download applicant's CV
- Update application status
- View applicant details and cover letter

## Notes

- All changes are saved directly to Supabase
- The pricing component on the website fetches from the database
- Job applications are stored with resume URLs in Supabase Storage
- Make sure storage bucket policies are set correctly for uploads

