# mySmartly - AI-Powered Business Insights

A modern landing page for mySmartly.app built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

- Clean, professional design
- Fully responsive
- Smooth animations with Framer Motion
- Waitlist email capture with Supabase
- Careers page with job listings
- Admin dashboard for managing pricing and jobs
- Job application system with resume upload
- Deploy-ready for Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase:

   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Go to SQL Editor and run the SQL from `supabase-setup.sql` to create all necessary tables
   
   c. Go to Settings > API and copy your:
      - Project URL
      - Anon (public) key

3. Create environment variables:

   Copy `.env.local.example` to `.env.local` and fill in your credentials:
```bash
cp .env.local.example .env.local
```

   Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

Run the SQL script in `supabase-setup.sql` in your Supabase SQL Editor. This creates:
- `waitlist` table for email capture
- `jobs` table for job listings
- `job_applications` table for applications
- `pricing_plans` table for pricing management
- Storage bucket for resume uploads

## Admin Dashboard

Access the admin dashboard at `/admin` (default password: `admin123`).

The admin dashboard allows you to:
- Manage pricing plans (edit prices, features, descriptions)
- Add/edit/remove job listings
- View and manage job applications
- Update application statuses

**Important**: Change the admin password in production by setting `NEXT_PUBLIC_ADMIN_PASSWORD` in your environment variables.

## Project Structure

```
├── app/
│   ├── admin/
│   │   └── page.tsx                 # Admin dashboard
│   ├── api/
│   │   └── waitlist/
│   │       └── route.ts             # API route for waitlist submissions
│   ├── careers/
│   │   ├── page.tsx                 # Careers listing page
│   │   └── apply/
│   │       └── [id]/
│   │           └── page.tsx         # Job application page
│   ├── how-it-works/
│   │   └── page.tsx                 # How it works page
│   ├── pricing/
│   │   └── page.tsx                 # Pricing page
│   ├── globals.css                  # Global styles and Tailwind imports
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Main landing page
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.tsx       # Admin dashboard layout
│   │   ├── ApplicationsManagement.tsx # Job applications management
│   │   ├── JobsManagement.tsx       # Job listings management
│   │   └── PricingManagement.tsx    # Pricing plans management
│   ├── careers/
│   │   ├── JobApplicationForm.tsx   # Job application form
│   │   └── JobsList.tsx             # Jobs listing component
│   └── ... (other components)
├── lib/
│   └── supabase.ts                  # Supabase client configuration
└── supabase-setup.sql               # SQL script for database setup
```

## Design System

- **Primary Color**: #1F2937 (Slate/Dark Gray)
- **Accent Color**: #10B981 (Emerald Green)
- **Font**: Inter (Regular, Medium, SemiBold, Bold)
- **Border Radius**: 8-12px
- **Base Text Size**: 14-16px

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_ADMIN_PASSWORD`
4. Deploy!

The project is configured for Vercel with `vercel.json`.

## License

© 2026 Catherine Kuria. All Rights Reserved.

This source code is proprietary and confidential. Unauthorized copying, reproduction, or use of this code is strictly prohibited without express written permission from the author.
