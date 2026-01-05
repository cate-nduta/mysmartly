'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50/50 via-white to-burgundy-50/30 pt-12 pb-10 lg:pt-16 lg:pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              Smart Decisions,{' '}
              <span className="text-accent">AI-Validated. Every Time.</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-4 leading-relaxed">
              mySmartly analyzes your data and tells you exactly what to do next. Get clear, actionable recommendations that drive real growth.
            </p>
            <p className="text-base md:text-lg text-text-secondary mb-6 leading-relaxed">
              Most businesses have access to more data than ever before, but struggle to turn that information into action. While you&apos;re spending hours analyzing spreadsheets, your competitors are making faster decisions and capturing opportunities. mySmartly bridges that gap by transforming your data into a clear, prioritized action plan.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link
                href="/pricing"
                data-cta="hero-primary"
                className="inline-flex items-center justify-center px-8 py-4 bg-accent text-white rounded-lg font-medium text-lg hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-xl"
              >
                Start Free Trial
              </Link>
              <button
                data-cta="hero-secondary"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary border-2 border-gray-300 rounded-lg font-medium text-lg hover:border-accent hover:text-accent transition-colors"
              >
                Watch Demo (2 min)
              </button>
            </div>
            <p className="text-sm text-text-secondary">
              No credit card required • 14-day free trial • Setup in under 30 minutes
            </p>
          </motion.div>

          {/* Right Column - Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h3 className="font-semibold text-primary">Decision Feed</h3>
                <span className="text-sm text-text-secondary">Today</span>
              </div>

              {/* Recommendation Cards */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-emerald-50 border-l-4 border-accent p-4 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold text-primary">Increase Ad Budget by 15%</span>
                    <span className="text-xs bg-accent text-white px-2 py-1 rounded">High Impact</span>
                  </div>
                  <p className="text-sm text-text-secondary">Projected revenue: +$18,750</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold text-primary">Lower Inventory for Product X</span>
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Cost Save</span>
                  </div>
                  <p className="text-sm text-text-secondary">Reduce holding costs by $4,200/month</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-semibold text-primary">Focus Retention on At-Risk Customers</span>
                    <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded">Urgent</span>
                  </div>
                  <p className="text-sm text-text-secondary">Save $22,500 in potential churn</p>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-accent text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
                  Approve All
                </button>
                <button className="flex-1 bg-gray-100 text-primary py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Review
                </button>
              </div>
            </div>

            {/* Decorative gradient behind */}
            <div className="absolute -z-10 top-4 left-4 w-full h-full bg-gradient-to-br from-accent/20 to-blue-500/20 rounded-xl blur-2xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
