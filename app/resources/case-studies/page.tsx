import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import FinalCTA from '@/components/FinalCTA'
import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: 'Customer Success Stories | mySmartly Case Studies',
  description: 'Read real success stories from businesses using mySmartly to make data-driven decisions and drive growth.',
  keywords: 'case studies, customer success, business success stories, ROI examples',
  openGraph: {
    title: 'Customer Success Stories | mySmartly Case Studies',
    description: 'Read real success stories from businesses using mySmartly.',
    type: 'website',
    url: 'https://mysmartly.app/resources/case-studies',
  },
  alternates: {
    canonical: 'https://mysmartly.app/resources/case-studies',
  },
}

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Resources', href: '/resources' },
  { label: 'Case Studies', href: '/resources/case-studies' },
]

async function getCaseStudies() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('is_published', true)
    .order('published_date', { ascending: false })

  if (error) {
    console.error('Error fetching case studies:', error)
    return []
  }

  return data || []
}

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies()

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Breadcrumb items={breadcrumbItems} />
      
      <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
              Case Studies
            </h1>
            <p className="text-lg md:text-xl text-text-secondary">
              Real success stories from businesses using mySmartly
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {caseStudies.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-text-secondary text-lg">No case studies available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {caseStudies.map((study) => {
                const results = typeof study.results === 'object' ? study.results : {}
                const resultEntries = Object.entries(results || {})
                
                return (
                  <article key={study.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-5">
                      {study.company_name && (
                        <div className="mb-2">
                          <span className="text-xs font-semibold text-accent uppercase tracking-wide">
                            {study.company_name}
                          </span>
                          {study.industry && (
                            <span className="text-xs text-text-secondary ml-2">
                              • {study.industry}
                            </span>
                          )}
                        </div>
                      )}
                      <h2 className="text-xl font-bold text-primary mb-2 hover:text-accent transition-colors">
                        <Link href={`/resources/case-studies/${study.slug}`}>
                          {study.title}
                        </Link>
                      </h2>
                      {study.excerpt && (
                        <p className="text-text-secondary text-sm mb-4 leading-relaxed line-clamp-3">
                          {study.excerpt}
                        </p>
                      )}
                      {resultEntries.length > 0 && (
                        <div className="mb-4 pt-3 border-t border-gray-100">
                          <div className="flex flex-wrap gap-3">
                            {resultEntries.slice(0, 3).map(([key, value]) => (
                              <div key={key} className="bg-accent/10 px-3 py-1 rounded">
                                <div className="text-xs font-semibold text-accent">{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                                <div className="text-sm font-bold text-primary">{String(value)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs text-text-secondary mb-4 pt-3 border-t border-gray-100">
                        <span>{study.author}</span>
                        <span>{study.read_time}</span>
                      </div>
                      <Link
                        href={`/resources/case-studies/${study.slug}`}
                        className="inline-block text-accent font-semibold text-sm hover:underline"
                      >
                        Read case study →
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </main>
  )
}
