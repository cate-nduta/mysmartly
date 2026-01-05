# Authentication Flow Separation

## Client Authentication Flow
- **Login Page**: `/auth/login`
  - NEVER checks admin status
  - ALWAYS redirects to `/dashboard`
  - Used only by clients

- **Signup Page**: `/auth/signup`
  - NEVER checks admin status
  - ALWAYS redirects to client onboarding or `/dashboard`
  - Used only by clients

- **Callback Route**: `/auth/callback`
  - Only redirects to `/dashboard` (unless `admin=true` param)
  - Used for OAuth callbacks from client login

## Admin Authentication Flow
- **Admin Page**: `/admin`
  - ONLY checks admin status
  - ALWAYS redirects to `/admin` dashboard
  - Used only by admins
  - Requires user to be in `admin_users` table

- **Callback Route**: `/auth/callback?admin=true`
  - Only redirects to `/admin` when `admin=true` param is present
  - Used for OAuth callbacks from admin login

## Rules
1. Client login pages NEVER check admin status
2. Admin login pages ONLY check admin status
3. Callback route uses URL parameter to determine destination
4. No cross-references between client and admin flows

