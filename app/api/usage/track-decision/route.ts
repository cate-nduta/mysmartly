import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * Track a decision (when user clicks "Approve All" or "Review" button)
 * Each click = 1 decision
 */
export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Fetch or create usage tracking for current month
    const { data: existingUsage } = await supabase
      .from('usage_tracking')
      .select('*')
      .eq('user_id', userId)
      .eq('period_start', startOfMonth.toISOString().split('T')[0])
      .maybeSingle()

    if (existingUsage) {
      // Update existing usage
      await supabase
        .from('usage_tracking')
        .update({
          decisions_count: (existingUsage.decisions_count || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUsage.id)
    } else {
      // Create new usage tracking for this month
      await supabase
        .from('usage_tracking')
        .insert({
          user_id: userId,
          period_start: startOfMonth.toISOString().split('T')[0],
          decisions_count: 1,
          tokens_used: 0,
        })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error tracking decision:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to track decision' },
      { status: 500 }
    )
  }
}

