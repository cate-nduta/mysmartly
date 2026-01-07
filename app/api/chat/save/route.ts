import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * Save chat messages to database
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, messages, sessionId } = await req.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Insert messages into chat_history
    const messagesToInsert = messages.map((msg: any) => ({
      user_id: userId,
      role: msg.role,
      content: msg.content,
      session_id: sessionId || null,
    }))

    const { error } = await supabase
      .from('chat_history')
      .insert(messagesToInsert)

    if (error) {
      console.error('Error saving chat history:', error)
      return NextResponse.json(
        { error: 'Failed to save chat history' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in save chat route:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save chat history' },
      { status: 500 }
    )
  }
}

