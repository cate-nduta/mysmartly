'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { signInWithEmail, signInWithGoogle } from '@/lib/supabase-auth'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [session, setSession] = useState<any>(null)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await signInWithEmail(email, password)
      
      if (signInError) {
        // Provide helpful error messages
        const errorMessage = signInError.message?.toLowerCase() || ''
        
        // Check if account exists - Supabase returns specific error for non-existent users
        if (errorMessage.includes('invalid login') || errorMessage.includes('invalid credentials')) {
          // Check if user exists by calling an API endpoint that checks email
          try {
            const checkResponse = await fetch('/api/auth/check-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email }),
            })
            
            const checkData = await checkResponse.json()
            
            if (!checkData.exists) {
              setError(`No account created with ${email}. Please sign up to create an account.`)
            } else {
              setError('Invalid email or password. Please check your credentials and try again. If you forgot your password, use "Forgot password?" to reset it.')
            }
          } catch (checkError) {
            // Fallback: assume password is wrong
            setError('Invalid email or password. Please check your credentials and try again. If you forgot your password, use "Forgot password?" to reset it.')
          }
        } else if (errorMessage.includes('email not confirmed') || errorMessage.includes('email not verified')) {
          setError('Please check your email and confirm your account before signing in. Check your spam folder if you don\'t see the confirmation email.')
        } else {
          setError(signInError.message || 'Failed to sign in. Please try again.')
        }
        setLoading(false)
        return
      }

      if (data.session && data.user) {
        // ============================================
        // CLIENT LOGIN PAGE - NEVER CHECK ADMIN STATUS
        // This page is ONLY for clients
        // ALWAYS redirect to /dashboard
        // ============================================
        
        // Check if user has 2FA enabled
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('two_factor_enabled')
          .eq('user_id', data.user.id)
          .single()

        if (preferences?.two_factor_enabled) {
          setSession(data.session)
          setShowTwoFactor(true)
          return
        }

        // Client user - For EXISTING users signing in, check if onboarding already completed
        // If they already completed onboarding, skip it. Otherwise, they must complete it.
        // This is different from new signups which ALWAYS go through onboarding
        const { data: onboardingData } = await supabase
          .from('user_onboarding')
          .select('id')
          .eq('user_id', data.user.id)
          .single()

        // Check for timeout message
        const urlParams = new URLSearchParams(window.location.search)
        if (urlParams.get('timeout') === 'true') {
          // Show timeout message
          setError('Your session has expired due to inactivity. Please sign in again.')
        }

        // For existing users signing in:
        // - If onboarding already completed → go to dashboard
        // - If onboarding not completed → redirect to onboarding (legacy users or edge cases)
        // New signups are handled in signup page and will always go through onboarding
        if (!onboardingData) {
          // Existing user without onboarding - must complete it before dashboard access
          window.location.href = '/auth/onboarding'
          return
        }
        
        // Onboarding already completed - go directly to dashboard (skip onboarding)
        window.location.href = '/dashboard'
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      // For login page, use regular sign in (not signup flow)
      // Pass admin=false explicitly to ensure client dashboard redirect
      const { error: oauthError } = await signInWithGoogle(false)
      if (oauthError) throw oauthError
      // Note: redirect will happen automatically via callback
      // The callback will check if user has completed onboarding
      // - If yes: redirect to /dashboard
      // - If no: redirect to /auth/onboarding
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google')
      setLoading(false)
    }
  }

  const handleTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // For TOTP, we need to verify with the user's email
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) {
        throw new Error('User email not found')
      }
      
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        token: twoFactorCode,
        type: 'email',
        email: user.email,
      })

      if (verifyError) throw verifyError

      if (data.session && data.user) {
        // ============================================
        // CLIENT LOGIN PAGE - NEVER CHECK ADMIN STATUS
        // This page is ONLY for clients
        // ALWAYS redirect to /dashboard
        // ============================================
        window.location.href = '/dashboard'
      }
    } catch (err: any) {
      setError(err.message || 'Invalid verification code')
      setLoading(false)
    }
  }

  if (showTwoFactor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center px-4 py-12 min-h-[calc(100vh-80px)]">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-primary mb-2">Two-Factor Authentication</h1>
            <p className="text-text-secondary mb-6">Enter the verification code from your authenticator app</p>
            
            <form onSubmit={handleTwoFactor} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-primary mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setShowTwoFactor(false)
                setTwoFactorCode('')
                setSession(null)
              }}
              className="w-full px-4 py-3 bg-gray-100 text-primary rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center px-4 py-12 min-h-[calc(100vh-80px)]">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
            <p className="text-text-secondary">Sign in to your mySmartly account</p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-text-secondary">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="mt-4 w-full px-4 py-3 border border-gray-300 rounded-lg font-medium text-primary hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-text-secondary">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-accent hover:underline font-medium">
                Sign up
              </Link>
            </p>
            <p className="mt-2">
              <Link href="/auth/forgot-password" className="text-accent hover:underline text-sm">
                Forgot password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

