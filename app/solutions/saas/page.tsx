import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import FinalCTA from '@/components/FinalCTA'

export const metadata: Metadata = {
  title: 'SaaS Growth Platform | Churn Prediction & Feature Adoption',
  description: 'Predict churn, optimize feature adoption, and maximize customer lifetime value for your SaaS business with AI-powered insights.',
  keywords: 'SaaS analytics, churn prediction, feature adoption, SaaS growth, customer LTV, SaaS metrics',
  openGraph: {
    title: 'SaaS Growth Platform | Churn Prediction & Feature Adoption',
    description: 'Predict churn, optimize feature adoption, and maximize customer lifetime value for your SaaS business.',
    type: 'website',
    url: 'https://mysmartly.app/solutions/saas',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaS Growth Platform | Churn Prediction & Feature Adoption',
    description: 'Predict churn, optimize feature adoption, and maximize customer lifetime value.',
  },
  alternates: {
    canonical: 'https://mysmartly.app/solutions/saas',
  },
}

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'SaaS Growth Platform', href: '/solutions/saas' },
]

export default function SaaSolutionPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-blue-50/50 via-white to-burgundy-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              SaaS Growth Platform: Churn Prediction & Feature Adoption
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed">
              Predict churn, optimize feature adoption, and maximize customer lifetime value with AI-powered insights designed for SaaS companies.
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
              <h3 className="text-2xl font-semibold text-primary mb-4">Churn Prediction</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Identify at-risk customers before they churn with AI-powered predictions based on usage patterns, engagement metrics, and behavioral signals.
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Early warning system for at-risk customers
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Personalized retention strategies
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Reduce churn by up to 40%
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-primary mb-4">Feature Adoption</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Understand which features drive value and optimize onboarding to increase feature adoption rates.
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Identify high-value features
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Optimize onboarding flows
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Increase activation rates
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-primary mb-4">Customer LTV Optimization</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Maximize customer lifetime value through data-driven upsell, cross-sell, and expansion strategies.
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Identify expansion opportunities
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Optimize pricing strategies
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Increase average revenue per user
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-primary mb-4">Growth Metrics</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Track and optimize key SaaS metrics including MRR, ARR, CAC, and payback period.
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time revenue tracking
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  CAC optimization recommendations
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Growth forecasting
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
            Real Results for SaaS Companies
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">40%</div>
              <div className="text-text-secondary">Reduction in Churn</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">32%</div>
              <div className="text-text-secondary">Increase in Feature Adoption</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">28%</div>
              <div className="text-text-secondary">Increase in Customer LTV</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">25%</div>
              <div className="text-text-secondary">Reduction in CAC</div>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </main>
  )
}

