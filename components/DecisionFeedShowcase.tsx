'use client'

import { motion } from 'framer-motion'

const recommendations = [
  {
    title: 'Increase Google Ads budget by $2,500 for Q4',
    impact: '+$18,750 projected revenue | +12% ROAS',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-500',
    priority: 'High Impact',
  },
  {
    title: 'Raise prices on Product B by 8%',
    impact: '+$4,200/month profit | Minimal churn risk',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    priority: 'Cost Optimization',
  },
  {
    title: 'Focus retention efforts on 45 at-risk customers',
    impact: 'Save $22,500 in potential churn',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-500',
    priority: 'Revenue Protection',
  },
]

export default function DecisionFeedShowcase() {
  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-blue-50/50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Your Daily Action Plan, Automatically Generated
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed mb-4">
            Instead of spending hours analyzing data, mySmartly gives you a ranked list of what to do today.
          </p>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Each recommendation shows projected outcomes and how to implement it. You decide what to do, and the system learns from your choices to improve over time.
          </p>
        </motion.div>
        
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-primary">Decision Feed</h3>
                <span className="text-sm text-text-secondary">Today</span>
              </div>
              <p className="text-text-secondary mt-1">Personalized recommendations for today</p>
            </div>
            <span className="text-sm font-medium text-accent bg-emerald-50 px-4 py-2 rounded-lg">
              3 New Actions
            </span>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-lg"
            >
              <div className="mb-2">
                <h4 className="font-semibold text-primary mb-1">Increase Ad Budget by 15%</h4>
                <span className="text-xs text-text-secondary">High Impact</span>
              </div>
              <p className="text-sm font-medium text-primary">Projected revenue: +$18,750</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg"
            >
              <div className="mb-2">
                <h4 className="font-semibold text-primary mb-1">Lower Inventory for Product X</h4>
                <span className="text-xs text-text-secondary">Cost Save</span>
              </div>
              <p className="text-sm font-medium text-primary">Reduce holding costs by $4,200/month</p>
            </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg"
            >
              <div className="mb-2">
                <h4 className="font-semibold text-primary mb-1">Focus Retention on At-Risk Customers</h4>
                <span className="text-xs text-text-secondary">Urgent</span>
                    </div>
              <p className="text-sm font-medium text-primary">Save $22,500 in potential churn</p>
            </motion.div>
                  </div>

          <div className="mt-6 flex gap-3">
            <button className="flex-1 bg-accent text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
              Approve All
                    </button>
            <button className="flex-1 bg-gray-100 text-primary py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      Review
                    </button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-text-secondary text-center leading-relaxed">
              Recommendations are updated daily based on your latest data. The system prioritizes actions by potential impact and implementation difficulty, helping you focus on what matters most.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
