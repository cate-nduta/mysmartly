'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Connect Your Data',
    description: 'Link your tools in minutes: Google Analytics, Shopify, Stripe, Facebook Ads, QuickBooks, Salesforce, etc.',
    details: 'Our integrations work with over 50 business tools. Just authorize access and we handle the rest. All connections use standard OAuth protocols for security.',
  },
  {
    number: '02',
    title: 'Get AI-Powered Analysis',
    description: 'Our engine processes billions of data points to find hidden opportunities and risks in your business.',
    details: 'Within hours of connecting your data, mySmartly starts analyzing patterns and finding opportunities. The system learns from your decisions to give better suggestions over time.',
  },
  {
    number: '03',
    title: 'Receive & Execute Actions',
    description: "Daily 'Decision Feed' with prioritized recommendations. One-click approvals to implement changes.",
    details: 'Each recommendation shows projected impact and how to implement it. You can approve actions directly, save them for later, or adjust them to fit your needs.',
  },
]

export default function HowItWorksThreeSteps() {
  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-white to-emerald-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            From Data Overload to Clear Action in 3 Steps
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Getting started with mySmartly takes less than 30 minutes. Most businesses see their first actionable recommendations within 24 hours.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              <div className="bg-gray-50 p-8 rounded-xl h-full border-2 border-gray-100 hover:border-accent/30 transition-colors group">
                <div className="text-5xl font-bold text-accent/20 mb-6 group-hover:text-accent/30 transition-colors">
                  {step.number}
                </div>
                <h3 className="text-2xl font-semibold text-primary mb-4">
                  {step.title}
                </h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  {step.description}
                </p>
                <p className="text-sm text-text-secondary leading-relaxed opacity-80">
                  {step.details}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-accent opacity-40 z-10">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-accent/10 rounded-xl p-8 border border-accent/20 text-center"
        >
          <p className="text-lg text-text-primary leading-relaxed max-w-3xl mx-auto">
            The whole process is fast. Unlike traditional analytics tools that need weeks of setup, mySmartly starts working on day one. Your first recommendations show up within 24 hours, and most users see results in the first month.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
