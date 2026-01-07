import { NextRequest, NextResponse } from 'next/server'
import { generateRecommendations } from '@/lib/recommendation-engine'
import { createClient } from '@supabase/supabase-js'

/**
 * API route to generate recommendations for a user
 * Can be called manually or via scheduled job
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Use service role for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verify user exists
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Generate recommendations
    const recommendations = await generateRecommendations(userId)

    // Track decisions (recommendations generated)
    if (recommendations.length > 0) {
      try {
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        // Fetch or create usage tracking for current month
        const { data: existingUsage } = await supabaseAdmin
          .from('usage_tracking')
          .select('*')
          .eq('user_id', userId)
          .eq('period_start', startOfMonth.toISOString().split('T')[0])
          .single()

        if (existingUsage) {
          // Update existing usage
          await supabaseAdmin
            .from('usage_tracking')
            .update({
              decisions_count: (existingUsage.decisions_count || 0) + recommendations.length,
            })
            .eq('id', existingUsage.id)
        } else {
          // Create new usage record
          await supabaseAdmin
            .from('usage_tracking')
            .insert({
              user_id: userId,
              period_start: startOfMonth.toISOString().split('T')[0],
              period_end: endOfMonth.toISOString().split('T')[0],
              decisions_count: recommendations.length,
              tokens_used: 0,
              connections_count: 0,
            })
        }
      } catch (error) {
        console.error('Error tracking decisions usage:', error)
        // Don't fail the request if usage tracking fails
      }
    }

    return NextResponse.json({
      success: true,
      count: recommendations.length,
      recommendations,
    })
  } catch (error: any) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}

/**
 * GET endpoint to trigger recommendation generation for current user
 * Useful for manual refresh
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use service role for admin operations
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Extract user ID from token (simplified - in production, verify JWT)
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const recommendations = await generateRecommendations(user.id)

    return NextResponse.json({
      success: true,
      count: recommendations.length,
      recommendations,
    })
  } catch (error: any) {
    console.error('Error generating recommendations:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}

