import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HowItWorksThreeSteps from '@/components/HowItWorksThreeSteps'
import DecisionFeedShowcase from '@/components/DecisionFeedShowcase'
import UseCases from '@/components/UseCases'
import FeatureComparison from '@/components/FeatureComparison'
import FinalCTA from '@/components/FinalCTA'

export const metadata: Metadata = {
  title: 'How mySmartly Works | From Data to Action in 3 Steps',
  description: 'See how mySmartly transforms business data into actionable recommendations in minutes. Connect, analyze, execute. Start your 14-day free trial.',
  keywords: 'how mySmartly works, business data analysis, automated recommendations, data-driven decisions, business intelligence process',
  openGraph: {
    title: 'How mySmartly Works | From Data to Action in 3 Steps',
    description: 'See how mySmartly transforms business data into actionable recommendations in minutes. Connect, analyze, execute.',
    type: 'website',
    url: 'https://mysmartly.app/how-it-works',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How mySmartly Works | From Data to Action in 3 Steps',
    description: 'See how mySmartly transforms business data into actionable recommendations in minutes.',
  },
  alternates: {
    canonical: 'https://mysmartly.app/how-it-works',
  },
}

// FAQ Schema for How It Works page
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does mySmartly analyze business data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'mySmartly connects to your existing business tools (Google Analytics, Shopify, Stripe, etc.), analyzes patterns across billions of data points, and uses AI to generate actionable recommendations tailored to your business goals.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to set up mySmartly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Setup takes less than 5 minutes. Simply connect your data sources, and mySmartly begins analyzing immediately. You\'ll receive your first recommendations within hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'What data sources can I connect?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'mySmartly connects to over 50+ data sources including Google Analytics, Shopify, Stripe, Facebook Ads, QuickBooks, Salesforce, HubSpot, and many more. We support all major business tools.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data secure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, mySmartly uses enterprise-grade security with encryption in transit and at rest. We\'re SOC 2 compliant and never share your data with third parties.',
      },
    },
  ],
}

export default function HowItWorksPage() {
  return (
    <>
      {/* FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <main className="min-h-screen">
        <Header />
        {/* Hero Section */}
        <section className="py-12 lg:py-16 bg-gradient-to-br from-blue-50/50 via-white to-burgundy-50/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
                From Data Overload to Clear Action in Minutes
              </h1>
              <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed">
                See how mySmartly transforms your business data into actionable recommendations in minutes. Connect, analyze, execute.
              </p>
              <p className="text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
                Unlike traditional analytics tools that require extensive setup and technical expertise, mySmartly provides actionable business recommendations from day one. Our platform connects to your existing tools, analyzes patterns across billions of data points, and delivers prioritized actions that drive measurable results.
              </p>
            </div>
          </div>
        </section>

        <HowItWorksThreeSteps />
        <DecisionFeedShowcase />
        
        {/* Additional Context Section */}
        <section className="py-12 lg:py-16 bg-gradient-to-br from-white to-blue-50/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                  Why Traditional Analytics Fall Short
                </h2>
                <p className="text-lg text-text-secondary mb-6 leading-relaxed">
                  Most analytics platforms show you charts and graphs but leave you asking &quot;What should I do about this?&quot; They tell you what happened in the past, but don&apos;t guide you toward future success.
                </p>
                <p className="text-lg text-text-secondary leading-relaxed">
                  mySmartly takes a fundamentally different approach. Instead of just visualizing your data, we analyze it through the lens of business outcomes. Every recommendation includes projected impact, implementation difficulty, and expected ROI, so you can prioritize actions that matter most.
                </p>
              </div>
              <div className="bg-gray-50 p-8 rounded-xl">
                <h3 className="text-2xl font-semibold text-primary mb-4">Key Differentiators</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <strong className="text-primary">Actionable, not just analytical</strong>
                      <p className="text-text-secondary">Get specific recommendations, not just insights</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <strong className="text-primary">Fast setup, immediate value</strong>
                      <p className="text-text-secondary">Start getting recommendations in hours, not weeks</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <strong className="text-primary">ROI-focused recommendations</strong>
                      <p className="text-text-secondary">Every suggestion includes projected impact and ROI</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <UseCases />
        <FeatureComparison />
        <FinalCTA />
        <Footer />
      </main>
    </>
  )
}
