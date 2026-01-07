import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DemoVideoPlayer from '@/components/DemoVideoPlayer'

export const metadata: Metadata = {
  title: 'Watch Demo - mySmartly',
  description: 'Watch a demo of mySmartly in action. See how we transform data into automated business decisions.',
}

// Disable caching for this page to ensure fresh data
export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function DemoPage() {
  // Fetch the active demo video - NO CACHING
  // Force fresh fetch every time to ensure deleted videos don't show
  const { data: video, error } = await supabase
    .from('demo_videos')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
        {error || !video ? (
          <div className="text-center py-20">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-primary mb-4">Demo Video Coming Soon</h1>
              <p className="text-xl text-text-secondary mb-6">
                We're working on it
              </p>
              <p className="text-lg text-text-secondary mb-8">
                Our team is putting together an amazing demo video to show you exactly how mySmartly works. Check back soon to see it in action.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/pricing"
                  className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white rounded-lg font-medium text-lg hover:bg-emerald-600 transition-colors"
                >
                  Start Free Trial
                </a>
                <a
                  href="/waitlist"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary border-2 border-gray-300 rounded-lg font-medium text-lg hover:border-accent hover:text-accent transition-colors"
                >
                  Join Waitlist
                </a>
              </div>
            </div>
          </div>
        ) : (
          <DemoVideoPlayer video={video} />
        )}
      </main>
      <Footer />
    </div>
  )
}

