# Quick Setup: Admin Password from .env

## Add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_USERNAME=whooptydoo
ADMIN_PASSWORD=@MyCK!254
```

## Run:

```bash
npm run setup-admin
```

Or:

```bash
node setup-admin-password.js
```

## Done!

Login at `/admin` with:
- Username: `whooptydoo`
- Password: `@MyCK!254`

---

**Get Service Role Key:** Supabase Dashboard → Settings → API → service_role key

