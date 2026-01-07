import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import FinalCTA from '@/components/FinalCTA'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Guide {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  author: string
  published_date: string
  read_time: string
  category: string
  is_published: boolean
  created_at: string
  updated_at: string
}

async function getGuide(slug: string): Promise<Guide | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    const { data, error } = await supabase
      .from('guides')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error) {
      console.error('Error fetching guide:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Unexpected error fetching guide:', err)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const guide = await getGuide(params.slug)

  if (!guide) {
    return {
      title: 'Guide Not Found | mySmartly',
      description: 'The guide you are looking for could not be found.',
    }
  }

  return {
    title: `${guide.title} | mySmartly Guides`,
    description: guide.excerpt || guide.title,
    keywords: `business guide, ${guide.category}, ${guide.title}`,
    openGraph: {
      title: guide.title,
      description: guide.excerpt || guide.title,
      type: 'article',
      url: `https://mysmartly.app/resources/guides/${guide.slug}`,
      publishedTime: guide.published_date,
      authors: [guide.author],
    },
    alternates: {
      canonical: `https://mysmartly.app/resources/guides/${guide.slug}`,
    },
  }
}

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Resources', href: '/resources' },
  { label: 'Guides', href: '/resources/guides' },
]

export default async function GuidePage({ params }: { params: { slug: string } }) {
  const guide = await getGuide(params.slug)

  if (!guide) {
    notFound()
  }

  // Add breadcrumb for this specific guide
  const guideBreadcrumbs = [
    ...breadcrumbItems,
    { label: guide.title, href: `/resources/guides/${guide.slug}` },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Breadcrumb items={guideBreadcrumbs} />
      
      <article className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <header className="mb-8">
            <div className="mb-4">
              <Link
                href="/resources/guides"
                className="inline-flex items-center text-accent hover:text-emerald-600 transition-colors text-sm font-medium mb-4"
              >
                ← Back to Guides
              </Link>
            </div>
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {guide.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              {guide.title}
            </h1>
            {guide.excerpt && (
              <p className="text-xl text-text-secondary mb-6">
                {guide.excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-text-secondary border-b border-gray-200 pb-6">
              <span>By {guide.author}</span>
              <span>•</span>
              <time dateTime={guide.published_date}>
                {new Date(guide.published_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>•</span>
              <span>{guide.read_time}</span>
            </div>
          </header>

          {/* Content */}
          <div 
            className="guide-content ql-editor"
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/resources/guides"
              className="inline-flex items-center text-accent hover:text-emerald-600 transition-colors font-medium"
            >
              ← Back to All Guides
            </Link>
          </footer>
        </div>
      </article>

      <FinalCTA />
      <Footer />
    </main>
  )
}

