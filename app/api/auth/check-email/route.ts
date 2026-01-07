import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * Check if an email exists in the system
 * This is used to provide better error messages during login
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Use Supabase admin API to check if user exists
    // Note: This requires service role key or we can use a workaround
    // Since we can't use admin API from client, we'll use a workaround:
    // Try to sign in with a dummy password - if it returns "Invalid login credentials"
    // but doesn't say "user not found", the user exists
    
    // Better approach: Use the auth.users table via service role
    // For now, we'll use a simpler approach - check if we can send a password reset
    // If the email doesn't exist, Supabase will return an error
    
    // Actually, the best way is to use the admin API with service role key
    // But since we're in an API route, we can use the service role client
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!serviceRoleKey) {
      // Fallback: return unknown (assume exists to avoid false negatives)
      return NextResponse.json({ exists: true })
    }

    // Create admin client
    const { createClient } = require('@supabase/supabase-js')
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey
    )

    // Check if user exists by querying auth.users (admin only)
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers()
    
    if (error) {
      console.error('Error checking email:', error)
      return NextResponse.json({ exists: true }) // Default to exists to avoid false negatives
    }

    const userExists = users?.users?.some((u: any) => u.email === email) || false

    return NextResponse.json({ exists: userExists })
  } catch (error: any) {
    console.error('Error in check-email route:', error)
    // On error, assume user exists to avoid false negatives
    return NextResponse.json({ exists: true })
  }
}

