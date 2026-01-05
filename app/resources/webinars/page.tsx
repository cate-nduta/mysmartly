import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import FinalCTA from '@/components/FinalCTA'
import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: 'Live Demos & Expert Sessions | mySmartly Webinars',
  description: 'Join live demos and expert sessions on business intelligence, data-driven decision making, and AI-powered insights.',
  keywords: 'webinars, live demos, expert sessions, business intelligence webinars',
  openGraph: {
    title: 'Live Demos & Expert Sessions | mySmartly Webinars',
    description: 'Join live demos and expert sessions on business intelligence.',
    type: 'website',
    url: 'https://mysmartly.app/resources/webinars',
  },
  alternates: {
    canonical: 'https://mysmartly.app/resources/webinars',
  },
}

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Resources', href: '/resources' },
  { label: 'Webinars', href: '/resources/webinars' },
]

async function getWebinars() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from('webinars')
    .select('*')
    .neq('status', 'cancelled')
    .order('scheduled_date', { ascending: true })

  if (error) {
    console.error('Error fetching webinars:', error)
    return []
  }

  return data || []
}

function formatDateTime(date: string, time: string) {
  const dateObj = new Date(`${date}T${time}`)
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default async function WebinarsPage() {
  const webinars = await getWebinars()
  
  const upcoming = webinars.filter(w => w.status === 'upcoming' || w.status === 'live')
  const recorded = webinars.filter(w => w.status === 'recorded')

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      
      <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
              Webinars
            </h1>
            <p className="text-lg md:text-xl text-text-secondary">
              Live demos and expert sessions on business intelligence
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {webinars.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-text-secondary text-lg">No webinars scheduled yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Upcoming Webinars */}
              {upcoming.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6">Upcoming & Live</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {upcoming.map((webinar) => (
                      <article key={webinar.id} className={`bg-white border-2 rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                        webinar.is_featured ? 'border-accent' : 'border-gray-200'
                      }`}>
                        <div className="p-5">
                          {webinar.is_featured && (
                            <div className="mb-3">
                              <span className="inline-block px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                                Featured
                              </span>
                            </div>
                          )}
                          <div className="mb-2">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                              webinar.status === 'live'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {webinar.status === 'live' ? 'Live Now' : 'Upcoming'}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-primary mb-2 hover:text-accent transition-colors">
                            {webinar.title}
                          </h3>
                          {webinar.description && (
                            <p className="text-text-secondary text-sm mb-4 leading-relaxed line-clamp-2">
                              {webinar.description}
                            </p>
                          )}
                          <div className="space-y-2 text-sm text-text-secondary mb-4 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span>{webinar.presenter}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{formatDateTime(webinar.scheduled_date, webinar.scheduled_time)} ({webinar.timezone})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{webinar.duration_minutes} minutes</span>
                            </div>
                          </div>
                          {webinar.registration_url && (
                            <a
                              href={webinar.registration_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block w-full text-center px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors text-sm"
                            >
                              Register Now
                            </a>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Recorded Webinars */}
              {recorded.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-6">Recorded Sessions</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recorded.map((webinar) => (
                      <article key={webinar.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-primary mb-2 hover:text-accent transition-colors line-clamp-2">
                            {webinar.title}
                          </h3>
                          {webinar.description && (
                            <p className="text-text-secondary text-sm mb-3 leading-relaxed line-clamp-2">
                              {webinar.description}
                            </p>
                          )}
                          <div className="text-xs text-text-secondary mb-4 pt-3 border-t border-gray-100 space-y-1">
                            <div>Presenter: {webinar.presenter}</div>
                            <div>{formatDateTime(webinar.scheduled_date, webinar.scheduled_time)}</div>
                          </div>
                          {webinar.recording_url ? (
                            <a
                              href={webinar.recording_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block text-accent font-semibold text-sm hover:underline"
                            >
                              Watch Recording →
                            </a>
                          ) : (
                            <span className="text-text-secondary text-sm">Recording coming soon</span>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </main>
  )
}
