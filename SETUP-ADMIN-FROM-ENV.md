# Set Admin Password from .env File

## Simple Setup:

### Step 1: Add to `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_USERNAME=whooptydoo
ADMIN_PASSWORD=@MyCK!254
```

**Get Service Role Key:**
- Supabase Dashboard → Settings → API → **service_role** key

### Step 2: Run Setup Script
```bash
node setup-admin-password.js
```

That's it! The script will:
1. Read username and password from `.env.local`
2. Find your admin user in the database
3. Set the password automatically

### Step 3: Login
Go to `/admin` and login with:
- Username: `whooptydoo` (from ADMIN_USERNAME)
- Password: `@MyCK!254` (from ADMIN_PASSWORD)

---

**Note:** Make sure your admin user exists in the `admin_users` table first. If not, create it via SQL or signup.

