# Onboarding Flow - Complete Guide

## How It Works

### For All New Signups (Email or Google):

1. **User Signs Up**
   - Email signup: `/auth/signup` → Creates account → Shows onboarding
   - Google signup: `/auth/signup` → Clicks "Continue with Google" → OAuth flow → Callback

2. **OAuth Callback Handler** (`/auth/callback`)
   - Sets user session from OAuth tokens
   - Creates user preferences record
   - Creates trial subscription (if new user)
   - **Checks if onboarding is complete**
   - **If NOT complete → Redirects to `/auth/onboarding`**
   - **If complete → Redirects to `/dashboard`**

3. **Onboarding Page** (`/auth/onboarding`)
   - Shows onboarding questionnaire
   - User completes onboarding
   - Creates `user_onboarding` record
   - Redirects to `/dashboard`

### For Existing Users Signing In:

1. **User Signs In**
   - Email login: `/auth/login` → Signs in → Checks onboarding → Goes to dashboard
   - Google login: `/auth/login` → OAuth → Callback → Checks onboarding → Dashboard

2. **Onboarding Check**
   - If onboarding complete → Go to dashboard
   - If NOT complete → Go to onboarding (shouldn't happen, but safety check)

## Key Points:

✅ **ALL new signups** (email or Google) go through onboarding
✅ **Onboarding is checked** in both callback handlers
✅ **Trial subscription** is created automatically for new users
✅ **User preferences** are created automatically
✅ **Google signup** from signup page uses `type=signup` parameter
✅ **Google login** from login page is for existing users

## Flow Diagram:

```
New User Signup (Google)
├── Click "Continue with Google" on /auth/signup
├── OAuth redirect
├── /auth/callback?type=signup
├── Create session
├── Create preferences & subscription
├── Check onboarding status
├── ❌ NOT complete → /auth/onboarding
│   └── Complete questionnaire
│   └── Create user_onboarding record
│   └── ✅ /dashboard
└── ✅ Complete → /dashboard

New User Signup (Email)
├── Fill form on /auth/signup
├── Create account
├── Create preferences & subscription
├── Show OnboardingQuestionnaire component
├── Complete questionnaire
├── Create user_onboarding record
└── ✅ /dashboard
```

---

**All signups now properly go through onboarding!** 🎉

