import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import FinalCTA from '@/components/FinalCTA'

export const metadata: Metadata = {
  title: 'Agency Analytics | Client ROI & Campaign Optimization',
  description: 'Track client ROI, optimize campaigns, and demonstrate value with data-driven insights designed for marketing agencies.',
  keywords: 'agency analytics, client ROI, campaign optimization, agency reporting, marketing agency tools',
  openGraph: {
    title: 'Agency Analytics | Client ROI & Campaign Optimization',
    description: 'Track client ROI, optimize campaigns, and demonstrate value with data-driven insights.',
    type: 'website',
    url: 'https://mysmartly.app/solutions/agencies',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agency Analytics | Client ROI & Campaign Optimization',
    description: 'Track client ROI, optimize campaigns, and demonstrate value.',
  },
  alternates: {
    canonical: 'https://mysmartly.app/solutions/agencies',
  },
}

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Agency Analytics', href: '/solutions/agencies' },
]

export default function AgenciesSolutionPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-blue-50/50 via-white to-burgundy-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Agency Analytics: Client ROI & Campaign Optimization
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed">
              Track client ROI, optimize campaigns, and demonstrate value with data-driven insights designed for marketing agencies.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-white to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
            Key Use Cases
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-primary mb-4">Client ROI Tracking</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Demonstrate clear ROI for each client with comprehensive reporting that shows the impact of your campaigns.
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Multi-client dashboard views
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Automated ROI calculations
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Client-ready reports
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-primary mb-4">Campaign Optimization</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Get AI-powered recommendations to optimize campaign performance across all channels and clients.
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Cross-channel optimization
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Budget reallocation suggestions
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Performance forecasting
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-primary mb-4">Performance Reporting</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Create professional, client-ready reports that clearly demonstrate value and results.
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Automated report generation
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Customizable dashboards
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  White-label reporting
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-primary mb-4">Resource Allocation</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Optimize team resources and time allocation based on client value and opportunity.
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Client profitability analysis
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Time tracking insights
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Capacity planning
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-emerald-50/40 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12 text-center">
            Real Results for Agencies
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">35%</div>
              <div className="text-text-secondary">Increase in Client ROI</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">50%</div>
              <div className="text-text-secondary">Time Saved on Reporting</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">42%</div>
              <div className="text-text-secondary">Improvement in Campaign Performance</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">28%</div>
              <div className="text-text-secondary">Increase in Client Retention</div>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </main>
  )
}

