'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from URL hash or query params
        // Supabase OAuth may return code in hash fragment (#) or query params (?)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const queryCode = searchParams.get('code')
        const hashCode = hashParams.get('code')
        const code = queryCode || hashCode
        
        const error = hashParams.get('error') || searchParams.get('error')
        const errorDescription = hashParams.get('error_description') || searchParams.get('error_description')
        // type=signup means new signup, no type means login (existing user)
        const type = searchParams.get('type') || hashParams.get('type')
        const isAdmin = searchParams.get('admin') === 'true'
        const isNewSignup = type === 'signup'

        if (error) {
          console.error('OAuth error:', error, errorDescription)
          const signupUrl = `/auth/signup?error=${encodeURIComponent(error)}`
          if (errorDescription) {
            router.push(`${signupUrl}&error_description=${encodeURIComponent(errorDescription)}`)
          } else {
            router.push(signupUrl)
          }
          return
        }

        // If we have an access_token in hash, Supabase handles it automatically via session
        if (hashParams.get('access_token') && !code) {
          // Wait for Supabase to establish session
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()
          
          if (sessionError || !session?.user) {
            console.error('Session error:', sessionError)
            router.push('/auth/signup?error=session_failed')
            return
          }
          
          // Process the authenticated user
          await processAuthenticatedUser(session.user, isNewSignup, isAdmin)
          return
        }

        if (code) {
          // Exchange code for session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

          if (exchangeError) {
            console.error('Error exchanging code:', exchangeError)
            router.push(`/auth/signup?error=authentication_failed`)
            return
          }

          if (data.session && data.user) {
            await processAuthenticatedUser(data.user, isNewSignup, isAdmin)
          }
        } else {
          // No code found - redirect to signup
          router.push('/auth/signup')
        }
      } catch (error) {
        console.error('Callback error:', error)
        router.push('/auth/signup?error=authentication_failed')
      }
    }

    const processAuthenticatedUser = async (user: any, isNewSignup: boolean, isAdmin: boolean) => {
      try {
        // Create user preferences if they don't exist
        await supabase
          .from('user_preferences')
          .upsert({ user_id: user.id }, { onConflict: 'user_id' })

        // Handle admin login
        if (isAdmin) {
          // Check if user is already in admin_users table
          const { data: existingAdmin } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', user.id)
            .single()

          // If not in admin_users table, add them automatically
          if (!existingAdmin) {
            await supabase
              .from('admin_users')
              .insert([{
                user_id: user.id,
                email: user.email || '',
                is_active: true
              }])
          }
          
          // ALWAYS redirect to /admin for admin flow
          router.push('/admin')
          return
        }

        // Check onboarding status FIRST to determine if user exists
        const { data: onboardingData } = await supabase
          .from('user_onboarding')
          .select('id')
          .eq('user_id', user.id)
          .single()

        // Determine if this is truly a new signup or existing user
        // If onboarding exists, user already has an account (even if type=signup was passed)
        const userHasAccount = !!onboardingData

        // Check if user already has a subscription
        const { data: existingSubscription } = await supabase
          .from('user_subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .single()

        // Create trial subscription if this is a new signup and they don't have one
        if (isNewSignup && !existingSubscription && !userHasAccount) {
          const trialEnd = new Date()
          trialEnd.setDate(trialEnd.getDate() + 14)

          // Get plan limits to calculate trial limits (half of plan limits)
          const { data: planData } = await supabase
            .from('pricing_plans')
            .select('tokens_limit, decisions_limit')
            .eq('name', 'Starter')
            .single()

          const planTokensLimit = planData?.tokens_limit || 250
          const planDecisionsLimit = planData?.decisions_limit || 150
          
          // Trial gets half of plan limits
          const trialTokensLimit = Math.floor(planTokensLimit / 2)
          const trialDecisionsLimit = Math.floor(planDecisionsLimit / 2)

          await supabase
            .from('user_subscriptions')
            .insert([{
              user_id: user.id,
              plan_name: 'Starter',
              status: 'trial',
              current_period_start: new Date().toISOString(),
              current_period_end: trialEnd.toISOString(),
              trial_end: trialEnd.toISOString(),
              tokens_limit: trialTokensLimit,
              decisions_limit: trialDecisionsLimit,
            }])
          
          // Reattach any unpaid invoices from previous account (if user deleted and signed up again)
          if (user.email) {
            try {
              await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/api/users/reattach-invoices`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, userEmail: user.email }),
              })
            } catch (err) {
              console.error('Error reattaching invoices:', err)
              // Don't fail signup if invoice reattachment fails
            }
          }
        }

        // CRITICAL: Redirect logic
        // 1. If user has account (onboarding exists) → Dashboard (SIGN IN)
        // 2. If new signup (no onboarding) → Onboarding (SIGN UP)
        if (userHasAccount) {
          // User has an account - SIGN IN → Dashboard
          router.push('/dashboard')
        } else {
          // New user - SIGN UP → Onboarding
          router.push('/auth/onboarding')
        }
      } catch (error) {
        console.error('Error processing user:', error)
        router.push('/auth/signup?error=processing_failed')
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-text-secondary">Completing sign in...</p>
      </div>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  )
}
