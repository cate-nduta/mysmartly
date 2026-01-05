import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import FinalCTA from '@/components/FinalCTA'

export const metadata: Metadata = {
  title: 'Resources | Data-Driven Decision Making Guides & Insights',
  description: 'Access free guides, case studies, blog posts, and webinars on data-driven decision making, business analytics, and AI-powered insights.',
  keywords: 'business guides, data-driven decision making, business analytics resources, case studies, webinars, business intelligence guides',
  openGraph: {
    title: 'Resources | Data-Driven Decision Making Guides & Insights',
    description: 'Access free guides, case studies, blog posts, and webinars on data-driven decision making.',
    type: 'website',
    url: 'https://mysmartly.app/resources',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resources | Data-Driven Decision Making Guides & Insights',
    description: 'Access free guides, case studies, blog posts, and webinars.',
  },
  alternates: {
    canonical: 'https://mysmartly.app/resources',
  },
}

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Resources', href: '/resources' },
]

const resourceCategories = [
  {
    title: 'Blog',
    description: 'Insights, tips, and strategies for data-driven decision making',
    href: '/resources/blog',
    icon: (
      <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    features: ['Latest articles', 'Industry insights', 'Best practices', 'Trending topics'],
  },
  {
    title: 'Case Studies',
    description: 'Real success stories from businesses using mySmartly',
    href: '/resources/case-studies',
    icon: (
      <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    features: ['Customer success stories', 'ROI examples', 'Industry benchmarks', 'Implementation guides'],
  },
  {
    title: 'Guides',
    description: 'Free business guides and templates to help you succeed',
    href: '/resources/guides',
    icon: (
      <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    features: ['Step-by-step guides', 'Downloadable templates', 'Checklists', 'Frameworks'],
  },
  {
    title: 'Webinars',
    description: 'Live demos and expert sessions on business intelligence',
    href: '/resources/webinars',
    icon: (
      <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    features: ['Live demos', 'Expert Q&A', 'Product tutorials', 'Industry discussions'],
  },
]

export default function ResourcesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-blue-50/50 via-white to-burgundy-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Resources
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed">
              Learn how to make better business decisions with our guides, case studies, blog posts, and webinars.
            </p>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Access free resources designed to help you leverage data-driven insights, optimize your operations, and drive real business growth.
            </p>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-white to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {resourceCategories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="group bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-accent hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                      {category.title}
                    </h2>
                    <p className="text-text-secondary mb-4 leading-relaxed">
                      {category.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {category.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-text-secondary">
                          <svg className="w-5 h-5 text-accent mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="text-accent font-semibold group-hover:underline">
                      Explore {category.title.toLowerCase()} →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Start your 14-day free trial and experience the power of AI-driven business insights.
            </p>
            <Link
              href="/auth/signup"
              className="inline-block px-8 py-4 bg-accent text-white rounded-lg font-semibold text-lg hover:bg-emerald-600 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </main>
  )
}

