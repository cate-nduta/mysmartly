import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import FinalCTA from '@/components/FinalCTA'

export const metadata: Metadata = {
  title: 'E-commerce Optimization | Inventory & Pricing AI',
  description: 'Optimize inventory, pricing, and marketing campaigns for your e-commerce store with AI-powered insights from mySmartly.',
  keywords: 'e-commerce optimization, inventory management AI, dynamic pricing, e-commerce analytics, online store optimization',
  openGraph: {
    title: 'E-commerce Optimization | Inventory & Pricing AI',
    description: 'Optimize inventory, pricing, and marketing campaigns for your e-commerce store with AI-powered insights.',
    type: 'website',
    url: 'https://mysmartly.app/solutions/ecommerce',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-commerce Optimization | Inventory & Pricing AI',
    description: 'Optimize inventory, pricing, and marketing campaigns for your e-commerce store.',
  },
  alternates: {
    canonical: 'https://mysmartly.app/solutions/ecommerce',
  },
}

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'E-commerce Optimization', href: '/solutions/ecommerce' },
]

export default function EcommerceSolutionPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-blue-50/50 via-white to-burgundy-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              E-commerce Optimization: Inventory & Pricing AI
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed">
              Transform your e-commerce store with AI-powered recommendations for inventory management, dynamic pricing, and marketing optimization.
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
              <h3 className="text-2xl font-semibold text-primary mb-4">Inventory Management</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Get AI-powered recommendations for stock levels, reorder points, and inventory allocation across channels.
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Optimize stock levels to reduce holding costs
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Predict demand and prevent stockouts
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Identify slow-moving inventory
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-primary mb-4">Dynamic Pricing</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Maximize revenue with AI-driven pricing recommendations based on demand, competition, and market conditions.
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Optimize prices for maximum revenue
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Track competitor pricing automatically
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Implement promotional pricing strategies
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-primary mb-4">Marketing ROI</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Optimize your marketing spend across channels and campaigns to maximize return on investment.
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Allocate budget to highest-performing channels
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Identify best-performing product categories
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Optimize customer acquisition costs
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-primary mb-4">Customer Segmentation</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Identify high-value customer segments and tailor your marketing and product strategies accordingly.
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Segment customers by value and behavior
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Personalize product recommendations
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Target high-LTV customer segments
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
            Real Results for E-commerce Stores
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">28%</div>
              <div className="text-text-secondary">Increase in Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">42%</div>
              <div className="text-text-secondary">Reduction in Inventory Costs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">35%</div>
              <div className="text-text-secondary">Improvement in Marketing ROI</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">19%</div>
              <div className="text-text-secondary">Increase in Conversion Rate</div>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </main>
  )
}

