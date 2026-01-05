# Set Admin Password to @MyCK!254

## Option 1: Use API Route (Easiest)

1. **Add Service Role Key to `.env.local`**:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
   Get it from: Supabase Dashboard → Settings → API → **service_role** key (secret)

2. **Call the API** (use Postman, curl, or browser console):
   ```javascript
   fetch('/api/admin/set-password', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       username: 'whooptydoo',
       newPassword: '@MyCK!254'
     })
   }).then(r => r.json()).then(console.log)
   ```

## Option 2: Use Node Script

1. **Add to `.env.local`**:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

2. **Run the script**:
   ```bash
   node SET-PASSWORD-SCRIPT.js
   ```

## Option 3: Direct SQL + Supabase Function (If available)

If you have access to create Supabase functions, you can create a function to update passwords.

---

**Important**: The service role key has full access - keep it secret and never commit it to Git!

