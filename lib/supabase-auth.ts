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
  return await supabase.auth.signUp({
    email,
    password,
  })
}

export const signInWithGoogle = async (admin: boolean = false) => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: admin 
        ? `${window.location.origin}/auth/callback?admin=true`
        : `${window.location.origin}/auth/callback`,
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


