'use client'

import { motion } from 'framer-motion'

const comparisons = [
  {
    feature: 'What to Do Next',
    mysmartly: '✅ Prescribes actions',
    competitors: '❌ Just shows data',
  },
  {
    feature: 'Time to Insight',
    mysmartly: 'Minutes',
    competitors: 'Days/weeks',
  },
  {
    feature: 'Implementation Help',
    mysmartly: '✅ One-click execution',
    competitors: '❌ Manual work',
  },
  {
    feature: 'Learning Curve',
    mysmartly: '30 minutes',
    competitors: '30+ hours',
  },
]

export default function FeatureComparison() {
  return (
    <section className="py-20 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary text-center mb-16"
        >
          Why mySmartly Beats Your Current Stack
        </motion.h2>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-accent">mySmartly</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-text-secondary">Competitors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comparisons.map((comp, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-primary">{comp.feature}</td>
                    <td className="px-6 py-4 text-center text-sm text-accent font-medium">{comp.mysmartly}</td>
                    <td className="px-6 py-4 text-center text-sm text-text-secondary">{comp.competitors}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

