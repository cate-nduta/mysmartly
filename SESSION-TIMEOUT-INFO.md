# ⏱️ Session Timeout - 1 Hour Inactivity Auto-Logout

## ✅ What's Implemented

### Automatic Logout After 1 Hour of Inactivity

Both **admin** and **client** users are automatically logged out after **1 hour of inactivity**.

## 🔄 How It Works

1. **Activity Tracking**
   - System tracks user activity (mouse movements, clicks, keyboard input, scrolling)
   - Any activity resets the 1-hour timer

2. **Timeout Detection**
   - If no activity for 1 hour, user is automatically logged out
   - Session is cleared from Supabase
   - User is redirected to login page

3. **Redirect Behavior**
   - **Admin users**: Redirected to `/admin` login page
   - **Client users**: Redirected to `/auth/login?timeout=true` with timeout message

## 📋 User Experience

### When Session Expires

1. User sees login page
2. **Client users** see message: "Your session has expired due to inactivity. Please sign in again."
3. User must sign in again with their email and password
4. All unsaved work should be saved (users are warned before timeout)

## ⚙️ Technical Details

### Timeout Duration
- **1 hour (3600 seconds)** of inactivity
- Timer resets on any user activity

### Activity Events Tracked
- Mouse movements (`mousemove`)
- Mouse clicks (`click`, `mousedown`)
- Keyboard input (`keypress`)
- Scrolling (`scroll`)
- Touch events (`touchstart`)

### Implementation
- Uses `useSessionTimeout` hook
- Applied to:
  - `/dashboard` (client dashboard)
  - `/admin` (admin dashboard)
  - `AdminDashboard` component

## 🔒 Security Benefits

- ✅ Prevents unauthorized access if user leaves computer unattended
- ✅ Reduces risk of session hijacking
- ✅ Complies with security best practices
- ✅ Automatic cleanup of inactive sessions

## 📝 Notes

- **Active users are NOT logged out** - only inactive users
- Timer resets on **any activity** - even moving the mouse
- Works for both admin and client users
- No manual logout needed - automatic after 1 hour of inactivity

## 🛠️ Configuration

The timeout duration is set in `hooks/useSessionTimeout.ts`:

```typescript
const SESSION_TIMEOUT_MS = 60 * 60 * 1000 // 1 hour
```

To change the timeout duration, modify this constant.

