import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FinalCTA from '@/components/FinalCTA'

export const metadata: Metadata = {
  title: 'mySmartly Solutions | Industry-Specific AI Business Analyst',
  description: 'mySmartly solutions for e-commerce, SaaS, agencies, and operations. Get tailored recommendations for your business type.',
  keywords: 'e-commerce optimization, SaaS analytics, agency analytics, operations efficiency, industry-specific business intelligence',
  openGraph: {
    title: 'mySmartly Solutions | Industry-Specific AI Business Analyst',
    description: 'mySmartly solutions for e-commerce, SaaS, agencies, and operations. Get tailored recommendations for your business type.',
    type: 'website',
    url: 'https://mysmartly.app/solutions',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mySmartly Solutions | Industry-Specific AI Business Analyst',
    description: 'mySmartly solutions for e-commerce, SaaS, agencies, and operations.',
  },
  alternates: {
    canonical: 'https://mysmartly.app/solutions',
  },
}

const solutions = [
  {
    title: 'E-commerce Optimization',
    description: 'Optimize inventory, pricing, and marketing campaigns with AI-powered insights.',
    href: '/solutions/ecommerce',
    features: ['Inventory management', 'Dynamic pricing', 'Marketing ROI', 'Customer segmentation'],
    icon: (
      <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    title: 'SaaS Growth Platform',
    description: 'Predict churn, optimize feature adoption, and maximize customer lifetime value.',
    href: '/solutions/saas',
    features: ['Churn prediction', 'Feature adoption', 'Customer LTV', 'Growth metrics'],
    icon: (
      <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Agency Analytics',
    description: 'Track client ROI, optimize campaigns, and demonstrate value with data-driven insights.',
    href: '/solutions/agencies',
    features: ['Client ROI tracking', 'Campaign optimization', 'Performance reporting', 'Resource allocation'],
    icon: (
      <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Operations Efficiency',
    description: 'Reduce costs, optimize processes, and improve operational performance.',
    href: '/solutions/operations',
    features: ['Cost reduction', 'Process optimization', 'Resource allocation', 'Performance metrics'],
    icon: (
      <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

export default function SolutionsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Breadcrumb Navigation */}
      <nav className="bg-gray-50 py-4" aria-label="Breadcrumb">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <ol className="flex items-center space-x-2 text-sm text-text-secondary">
            <li><Link href="/" className="hover:text-primary">Home</Link></li>
            <li>/</li>
            <li className="text-primary font-medium">Solutions</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-blue-50/50 via-white to-burgundy-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Solutions Built for Your Business
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed">
              Get tailored AI-powered recommendations designed specifically for your industry and business model.
            </p>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Whether you run an e-commerce store, a SaaS company, a marketing agency, or manage operations, mySmartly adapts to your unique challenges and delivers industry-specific insights that drive real results.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-white to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <Link
                key={index}
                href={solution.href}
                className="group bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-accent hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    {solution.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                      {solution.title}
                    </h2>
                    <p className="text-text-secondary mb-4 leading-relaxed">
                      {solution.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-text-secondary">
                          <svg className="w-5 h-5 text-accent mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="text-accent font-semibold group-hover:underline">
                      Learn more →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-emerald-50/40 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Start your 14-day free trial and see how mySmartly can transform your business decisions.
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

