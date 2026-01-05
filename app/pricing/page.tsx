import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Pricing from '@/components/Pricing'
import FAQ from '@/components/FAQ'
import FinalCTA from '@/components/FinalCTA'

export const metadata: Metadata = {
  title: 'mySmartly Pricing | Simple Plans for Every Business Size',
  description: 'Transparent pricing starting at $149/month. 14-day free trial, no credit card required. Average 427% ROI in first year.',
  keywords: 'mySmartly pricing, business analytics pricing, AI business analyst cost, automated decision making pricing, business intelligence pricing',
  openGraph: {
    title: 'mySmartly Pricing | Simple Plans for Every Business Size',
    description: 'Transparent pricing starting at $149/month. 14-day free trial, no credit card required.',
    type: 'website',
    url: 'https://mysmartly.app/pricing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mySmartly Pricing | Simple Plans for Every Business Size',
    description: 'Transparent pricing starting at $149/month. 14-day free trial, no credit card required.',
  },
  alternates: {
    canonical: 'https://mysmartly.app/pricing',
  },
}

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-blue-50/50 via-white to-burgundy-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed">
              Get your automated business analyst. Choose the plan that fits your business needs.
            </p>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
              Every plan includes our core decision automation features. Scale up as your business grows and you need more data connections, recommendations, and advanced analytics. All plans come with a 14-day free trial—no credit card required.
            </p>
          </div>
        </div>
      </section>

      <Pricing />

      {/* Value Proposition Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-white to-blue-50/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              What&apos;s Included in Every Plan
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              All mySmartly plans include the essential features you need to automate business decisions and drive growth.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold text-primary mb-4">AI-Powered Recommendations</h3>
              <p className="text-text-secondary leading-relaxed">
                Get actionable business recommendations based on your data. Each suggestion includes projected impact and implementation steps.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold text-primary mb-4">50+ Data Source Connections</h3>
              <p className="text-text-secondary leading-relaxed">
                Connect to all your business tools including Google Analytics, Shopify, Stripe, Facebook Ads, QuickBooks, Salesforce, and more.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200">
              <h3 className="text-xl font-semibold text-primary mb-4">Priority Support</h3>
              <p className="text-text-secondary leading-relaxed">
                Get help when you need it with email support, comprehensive documentation, and dedicated customer success resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="bg-gradient-to-r from-accent to-burgundy-600 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Average ROI: 427% in First Year
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Our customers typically see a 427% return on investment in their first year. Calculate your potential savings and revenue growth.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-4xl font-bold mb-2">$50K+</div>
                <div className="text-lg opacity-90">Average Annual Savings</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">15 hrs</div>
                <div className="text-lg opacity-90">Saved Per Week</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">34%</div>
                <div className="text-lg opacity-90">Average Profit Increase</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  )
}
