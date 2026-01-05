import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import FinalCTA from '@/components/FinalCTA'

export const metadata: Metadata = {
  title: 'Operations Efficiency | Cost Reduction & Process Optimization',
  description: 'Reduce costs, optimize processes, and improve operational performance with AI-powered insights for operations teams.',
  keywords: 'operations efficiency, cost reduction, process optimization, operational analytics, supply chain optimization',
  openGraph: {
    title: 'Operations Efficiency | Cost Reduction & Process Optimization',
    description: 'Reduce costs, optimize processes, and improve operational performance with AI-powered insights.',
    type: 'website',
    url: 'https://mysmartly.app/solutions/operations',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Operations Efficiency | Cost Reduction & Process Optimization',
    description: 'Reduce costs, optimize processes, and improve operational performance.',
  },
  alternates: {
    canonical: 'https://mysmartly.app/solutions/operations',
  },
}

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Operations Efficiency', href: '/solutions/operations' },
]

export default function OperationsSolutionPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-blue-50/50 via-white to-burgundy-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Operations Efficiency: Cost Reduction & Process Optimization
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed">
              Reduce costs, optimize processes, and improve operational performance with AI-powered insights designed for operations teams.
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
              <h3 className="text-2xl font-semibold text-primary mb-4">Cost Reduction</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Identify cost-saving opportunities across operations, supply chain, and resource utilization.
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Identify waste and inefficiencies
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Optimize vendor relationships
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Reduce operational overhead
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-primary mb-4">Process Optimization</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Streamline workflows, eliminate bottlenecks, and improve process efficiency with data-driven recommendations.
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Bottleneck identification
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Workflow automation opportunities
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Process efficiency improvements
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-primary mb-4">Resource Allocation</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Optimize resource allocation across teams, projects, and operational areas for maximum efficiency.
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Capacity planning
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Team utilization optimization
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Demand forecasting
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-primary mb-4">Performance Metrics</h3>
              <p className="text-text-secondary mb-4 leading-relaxed">
                Track and improve key operational metrics including efficiency, productivity, and quality.
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time performance dashboards
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  KPI tracking and alerts
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-accent mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Benchmark comparisons
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
            Real Results for Operations Teams
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">22%</div>
              <div className="text-text-secondary">Reduction in Operational Costs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">35%</div>
              <div className="text-text-secondary">Improvement in Process Efficiency</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">28%</div>
              <div className="text-text-secondary">Increase in Productivity</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">30%</div>
              <div className="text-text-secondary">Reduction in Waste</div>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </main>
  )
}

