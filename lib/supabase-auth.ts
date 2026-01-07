import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create Supabase client for server-side operations
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Client-side auth helpers
export const signInWithEmail = async (email: string, password: string) => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export const signUpWithEmail = async (email: string, password: string) => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mysmartly.app'
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback?type=signup`,
    },
  })
}

export const signInWithGoogle = async (admin: boolean = false, isSignup: boolean = false) => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  // Use production URL from environment, fallback to window.location.origin for development
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://mysmartly.app')
  
  // Build redirect URL with appropriate parameters
  let redirectUrl = `${siteUrl}/auth/callback`
  if (admin) {
    redirectUrl += '?admin=true'
  } else if (isSignup) {
    redirectUrl += '?type=signup'
  }
  // If neither admin nor signup, it's a login - no type parameter needed
  
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
}

export const signOut = async () => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  return await supabase.auth.signOut()
}

export const getCurrentUser = async () => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const { data: { user } } = await supabase.auth.getUser()
  return user
}


