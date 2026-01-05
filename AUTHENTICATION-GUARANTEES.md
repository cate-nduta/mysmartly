# 🔐 Authentication Guarantees

## ✅ What's Guaranteed

### 1. **Password Storage**
- ✅ Passwords are **NEVER stored in plain text**
- ✅ Supabase automatically hashes passwords using **bcrypt** (industry standard)
- ✅ Passwords are stored securely in Supabase's `auth.users` table
- ✅ You **CANNOT** retrieve the original password - only reset it

### 2. **One-Time Signup**
- ✅ **Email addresses are unique** - Supabase prevents duplicate accounts
- ✅ If you try to sign up with an existing email, you'll get a clear error message
- ✅ You'll be directed to sign in instead or reset your password
- ✅ **No duplicate accounts can be created**

### 3. **Login with Stored Credentials**
- ✅ Login uses the **exact email and password** you set during signup
- ✅ Passwords are verified securely using bcrypt comparison
- ✅ Your credentials are stored permanently until you change them
- ✅ You can log in anytime with your original email and password

### 4. **Password Reset**
- ✅ If you forget your password, use "Forgot password?" link
- ✅ You'll receive an email with a secure reset link
- ✅ The reset link expires after 24 hours for security
- ✅ After resetting, your **new password** becomes your login password
- ✅ Your old password is immediately invalidated

## 🔒 Security Features

### Password Requirements
- Minimum 8 characters (enforced on both signup and reset)
- Passwords are hashed with bcrypt (one-way encryption)
- Password strength validation on client and server

### Account Protection
- Email addresses must be unique (enforced by Supabase)
- Email confirmation can be enabled/disabled in Supabase settings
- Session management handled securely by Supabase
- Automatic logout on password change

## 📋 How It Works

### Signup Flow
1. User enters email and password
2. System checks if email already exists
3. If exists → Show error: "Account already exists, please sign in"
4. If new → Create account, hash password, store in database
5. User data is saved permanently

### Login Flow
1. User enters email and password
2. System looks up user by email
3. Compares provided password with stored hash (bcrypt)
4. If match → Create session, redirect to dashboard
5. If no match → Show error: "Invalid email or password"

### Password Reset Flow
1. User clicks "Forgot password?"
2. Enters email address
3. Receives secure reset link via email
4. Clicks link (valid for 24 hours)
5. Enters new password
6. New password is hashed and stored
7. Old password is immediately invalidated

## ⚠️ Important Notes

### For Users
- **You only sign up ONCE** - your account is permanent
- **Use the same email and password** to log in every time
- **If you forget your password**, use "Forgot password?" - don't create a new account
- **Your password is secure** - even admins cannot see it

### For Admins
- **Passwords are hashed** - you cannot see user passwords
- **Duplicate accounts are prevented** - Supabase enforces email uniqueness
- **Password reset** is the only way to change a password
- **All authentication** is handled securely by Supabase

## 🛠️ Technical Details

### Password Hashing
- Algorithm: **bcrypt**
- Salt rounds: 10 (Supabase default)
- One-way encryption: Cannot be reversed
- Comparison: Done server-side securely

### Database Storage
- Table: `auth.users` (Supabase managed)
- Password field: `encrypted_password` (hashed)
- Email field: `email` (unique, indexed)
- Never stored: Plain text passwords

### Error Handling
- Duplicate email: "Account already exists, please sign in"
- Invalid credentials: "Invalid email or password"
- Email not confirmed: "Please confirm your email first"
- All errors are user-friendly and actionable

## ✅ Verification

To verify your account is stored correctly:

1. **Sign up** with your email and password
2. **Sign out**
3. **Sign in** with the same email and password
4. ✅ If it works, your credentials are stored correctly!

If you have issues:
- Check if email confirmation is required
- Verify you're using the correct email (case-sensitive)
- Use "Forgot password?" if you're unsure of your password
- **DO NOT** create a new account with the same email

