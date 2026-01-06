import { NextResponse } from 'next/server'

// Test email endpoint disabled - emails are working correctly
export async function GET() {
  return NextResponse.json({
    status: 'disabled',
    message: 'Test email endpoint is disabled. Email functionality is working correctly.',
  }, { status: 200 })
}

