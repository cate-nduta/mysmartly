# 🚀 QUICK ADMIN SETUP - 2 STEPS!

## Step 1: Run SQL (ONE TIME ONLY)
1. Open your Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `create-admin-table.sql`
4. Click "Run"

## Step 2: Run Setup Script
```bash
npm run setup-admin
```

**THAT'S IT!** 🎉

The script will:
- ✅ Create your admin user in Supabase Auth
- ✅ Add you to admin_users table
- ✅ Set your password from .env.local
- ✅ Everything ready to login!

## Your .env.local should have:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
ADMIN_USERNAME=whooptydoo          # Optional (default: whooptydoo)
ADMIN_PASSWORD=@MyCK!254           # Optional (default: @MyCK!254)
ADMIN_EMAIL=whooptydoo@mysmartly.app  # Optional (default: username@mysmartly.app)
```

## Login at:
http://localhost:3000/admin

**Username:** (from ADMIN_USERNAME in .env.local)  
**Password:** (from ADMIN_PASSWORD in .env.local)

