# Quick Set Password - No Email Needed!

## Simple Steps:

### Step 1: Get Your Service Role Key
1. Go to **Supabase Dashboard**
2. Click **Settings** → **API**
3. Copy the **service_role** key (it's secret, keep it safe!)

### Step 2: Add to `.env.local`
Add this line to your `.env.local` file:
```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 3: Set Password via API
Open your browser console on your site (F12) and run:

```javascript
fetch('/api/admin/set-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'whooptydoo',
    newPassword: '@MyCK!254'
  })
})
.then(r => r.json())
.then(data => {
  if (data.success) {
    console.log('✅ Password set! Login with:', data.username)
  } else {
    console.error('❌ Error:', data.error)
  }
})
```

### Step 4: Login!
Go to `/admin` and login with:
- Username: `whooptydoo`
- Password: `@MyCK!254`

---

**That's it! No email needed!** 🎉

