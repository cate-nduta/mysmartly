import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import FinalCTA from '@/components/FinalCTA'
import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
  title: 'Data-Driven Decision Making Blog | mySmartly Insights',
  description: 'Read insights, tips, and strategies for data-driven decision making, business analytics, and AI-powered business intelligence.',
  keywords: 'business blog, data-driven decisions, business analytics blog, AI business insights, business intelligence articles',
  openGraph: {
    title: 'Data-Driven Decision Making Blog | mySmartly Insights',
    description: 'Read insights, tips, and strategies for data-driven decision making.',
    type: 'website',
    url: 'https://mysmartly.app/resources/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Data-Driven Decision Making Blog | mySmartly Insights',
    description: 'Read insights, tips, and strategies for data-driven decision making.',
  },
  alternates: {
    canonical: 'https://mysmartly.app/resources/blog',
  },
}

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Resources', href: '/resources' },
  { label: 'Blog', href: '/resources/blog' },
]

async function getBlogPosts() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_date', { ascending: false })

  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }

  return data || []
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts()

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
              Blog
            </h1>
            <p className="text-lg md:text-xl text-text-secondary">
              Insights, tips, and strategies for data-driven decision making
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {blogPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-text-secondary text-lg">No blog posts available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <article key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <div className="mb-3">
                      <span className="inline-block px-2.5 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-primary mb-2 hover:text-accent transition-colors line-clamp-2">
                      <Link href={`/resources/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt && (
                      <p className="text-text-secondary text-sm mb-4 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-xs text-text-secondary mb-4 pt-3 border-t border-gray-100">
                      <span>{post.author}</span>
                      <span>{post.read_time}</span>
                    </div>
                    <div className="text-xs text-text-secondary mb-4">
                      {new Date(post.published_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <Link
                      href={`/resources/blog/${post.slug}`}
                      className="inline-block text-accent font-semibold text-sm hover:underline"
                    >
                      Read more →
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
