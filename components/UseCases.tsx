'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const useCases = [
  {
    id: 'ecommerce',
    label: 'E-commerce',
    title: 'Sarah increased her store\'s profitability by 34% in 90 days',
    description: 'by following mySmartly\'s inventory and pricing recommendations.',
  },
  {
    id: 'saas',
    label: 'SaaS',
    title: 'Tech startup reduced customer acquisition cost by 41%',
    description: 'by reallocating budget based on mySmartly\'s channel analysis.',
  },
  {
    id: 'agency',
    label: 'Agency',
    title: 'Marketing agency proved 28% higher ROI for clients',
    description: 'using mySmartly\'s performance tracking and recommendations.',
  },
]

export default function UseCases() {
  const [activeTab, setActiveTab] = useState('ecommerce')

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary text-center mb-16"
        >
          See mySmartly in Action
        </motion.h2>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {useCases.map((useCase) => (
            <button
              key={useCase.id}
              onClick={() => setActiveTab(useCase.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === useCase.id
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
              }`}
            >
              {useCase.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {useCases
            .filter((useCase) => useCase.id === activeTab)
            .map((useCase) => (
              <motion.div
                key={useCase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-12 text-center border-2 border-accent/20"
              >
                <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                  {useCase.title}
                </h3>
                <p className="text-xl text-text-secondary">
                  {useCase.description}
                </p>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </section>
  )
}

