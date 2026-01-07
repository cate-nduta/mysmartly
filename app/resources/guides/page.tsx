import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import FinalCTA from '@/components/FinalCTA'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Free Business Guides & Templates | mySmartly',
  description: 'Download free business guides, templates, and frameworks to help you make better data-driven decisions.',
  keywords: 'business guides, templates, frameworks, business resources',
  openGraph: {
    title: 'Free Business Guides & Templates | mySmartly',
    description: 'Download free business guides, templates, and frameworks.',
    type: 'website',
    url: 'https://mysmartly.app/resources/guides',
  },
  alternates: {
    canonical: 'https://mysmartly.app/resources/guides',
  },
}

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Resources', href: '/resources' },
  { label: 'Guides', href: '/resources/guides' },
]

async function getGuides() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    const { data, error } = await supabase
      .from('guides')
      .select('*')
      .eq('is_published', true)
      .order('published_date', { ascending: false })

    if (error) {
      console.error('Error fetching guides:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return []
    }

    console.log('Fetched guides:', data?.length || 0, 'guides')
    return data || []
  } catch (err) {
    console.error('Unexpected error fetching guides:', err)
    return []
  }
}

export default async function GuidesPage() {
  const guides = await getGuides()

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      
      <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
              Guides & Templates
            </h1>
            <p className="text-lg md:text-xl text-text-secondary">
              Free business guides and templates to help you make better decisions
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {guides.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-text-secondary text-lg">No guides available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <article key={guide.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <div className="mb-3">
                      <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {guide.category}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-primary mb-2 hover:text-accent transition-colors line-clamp-2">
                      <Link href={`/resources/guides/${guide.slug}`}>
                        {guide.title}
                      </Link>
                    </h2>
                    {guide.excerpt && (
                      <p className="text-text-secondary text-sm mb-4 leading-relaxed line-clamp-3">
                        {guide.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-text-secondary mb-4 pt-3 border-t border-gray-100">
                      <span>{guide.author}</span>
                      <span>{guide.read_time}</span>
                    </div>
                    <Link
                      href={`/resources/guides/${guide.slug}`}
                      className="inline-block text-accent font-semibold text-sm hover:underline"
                    >
                      View guide →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </main>
  )
}
