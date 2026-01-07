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
              Transform Data into Automated Business Decisions
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-4 leading-relaxed">
              Growth, retention, cost savings. mySmartly cuts through the noise to show you what to do next, with recommendations backed by your actual data.
            </p>
            <p className="text-base md:text-lg text-text-secondary mb-6 leading-relaxed">
              Most businesses have more data than they know what to do with. You spend hours looking at spreadsheets while your competitors make decisions faster. mySmartly turns your data into a clear list of what to do next, ranked by what matters most.
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
              <Link
                href="/demo"
                data-cta="hero-secondary"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary border-2 border-gray-300 rounded-lg font-medium text-lg hover:border-accent hover:text-accent transition-colors"
              >
                Watch Demo
              </Link>
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
                <h3 className="font-semibold text-primary">Decision Feed — Today</h3>
              </div>

              {/* Recommendation Cards */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-emerald-50 border-l-4 border-accent p-4 rounded-lg"
                >
                  <div className="mb-2">
                    <h4 className="font-semibold text-primary mb-1">Increase Ad Budget by 15%</h4>
                    <span className="text-xs text-text-secondary">High Impact • Low Risk</span>
                  </div>
                  <p className="text-sm font-medium text-primary mb-1">Estimated impact: +$18,750 revenue</p>
                  <p className="text-xs text-text-secondary">Based on stable ROAS and capped spend over the last 60 days</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg"
                >
                  <div className="mb-2">
                    <h4 className="font-semibold text-primary mb-1">Lower Inventory for Product X</h4>
                    <span className="text-xs text-text-secondary">Cost Optimization</span>
                  </div>
                  <p className="text-sm font-medium text-primary mb-1">Estimated savings: $4,200/month</p>
                  <p className="text-xs text-text-secondary">Based on declining sell-through and excess stock levels</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg"
                >
                  <div className="mb-2">
                    <h4 className="font-semibold text-primary mb-1">Focus Retention on 45 At-Risk Customers</h4>
                    <span className="text-xs text-text-secondary">Urgent</span>
                  </div>
                  <p className="text-sm font-medium text-primary mb-1">Estimated churn prevention: $22,500</p>
                  <p className="text-xs text-text-secondary">Based on reduced engagement and historical churn patterns</p>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-3">
                <button className="flex-1 bg-accent text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
                  Approve All
                </button>
                <button className="flex-1 bg-gray-100 text-primary py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Review Individually
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
