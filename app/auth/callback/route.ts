import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type') // 'signup', 'recovery', 'invite', etc.
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get the user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // ============================================
        // AUTHENTICATION CALLBACK ROUTE
        // Separation: Use URL parameter to determine destination
        // admin=true -> /admin (admin flow)
        // No admin param -> /dashboard (client flow)
        // ============================================
        
        const isAdminLogin = requestUrl.searchParams.get('admin') === 'true'
        
        if (isAdminLogin) {
          // ============================================
          // ADMIN FLOW - Only when admin=true param is present
          // ============================================
          // Create user preferences if they don't exist
          await supabase
            .from('user_preferences')
            .upsert({ user_id: user.id }, { onConflict: 'user_id' })

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
          return NextResponse.redirect(new URL('/admin', request.url))
        }

        // ============================================
        // CLIENT FLOW - Default when no admin param
        // NEVER check admin status here
        // ALWAYS redirect to /dashboard
        // ============================================
        // Create user preferences if they don't exist
        await supabase
          .from('user_preferences')
          .upsert({ user_id: user.id }, { onConflict: 'user_id' })

        // Create trial subscription if they don't have one (for new signups)
        if (type === 'signup' || !type) {
          const { data: existingSubscription } = await supabase
            .from('user_subscriptions')
            .select('id')
            .eq('user_id', user.id)
            .single()

          if (!existingSubscription) {
            const trialEnd = new Date()
            trialEnd.setDate(trialEnd.getDate() + 14)

            await supabase
              .from('user_subscriptions')
              .insert([{
                user_id: user.id,
                plan_name: 'Starter',
                status: 'trial',
                current_period_start: new Date().toISOString(),
                current_period_end: trialEnd.toISOString(),
                trial_end: trialEnd.toISOString(),
              }])
          }

          // Check if onboarding is complete
          const { data: onboardingData } = await supabase
            .from('user_onboarding')
            .select('id')
            .eq('user_id', user.id)
            .single()

          // If onboarding not complete, redirect to onboarding
          if (!onboardingData) {
            return NextResponse.redirect(new URL('/auth/onboarding', request.url))
          }
        }

        // Regular user - redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  // Fallback: redirect to dashboard (or specified next URL)
  return NextResponse.redirect(new URL(next, request.url))
}

