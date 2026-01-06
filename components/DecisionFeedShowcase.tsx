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
              <h3 className="text-2xl font-bold text-primary">Decision Feed</h3>
              <p className="text-text-secondary mt-1">Personalized recommendations for today</p>
            </div>
            <span className="text-sm font-medium text-accent bg-emerald-50 px-4 py-2 rounded-lg">
              3 New Actions
            </span>
          </div>

          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${rec.bgColor} border-l-4 ${rec.borderColor} p-6 rounded-lg hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-lg font-semibold text-primary">
                        {rec.title}
                      </h4>
                      <span className="text-xs font-medium text-primary bg-white/80 px-3 py-1 rounded">
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-text-secondary font-medium">
                      Impact: <span className="text-accent">{rec.impact}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
                      Approve
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-300 text-primary rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                      Review
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
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
