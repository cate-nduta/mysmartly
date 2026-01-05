'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Connect Your Data',
    description: 'Securely integrate your business data sources. We support all major platforms and formats.',
    bg: 'bg-primary/10',
    border: 'border-primary/30',
  },
  {
    number: '02',
    title: 'AI Analysis',
    description: 'Our intelligent assistant analyzes your data using advanced algorithms tailored to your industry.',
    bg: 'bg-accent/10',
    border: 'border-accent/30',
  },
  {
    number: '03',
    title: 'Get Insights',
    description: 'Receive clear, actionable insights and recommendations delivered when and where you need them.',
    bg: 'bg-secondary/20',
    border: 'border-secondary/40',
  },
  {
    number: '04',
    title: 'Take Action',
    description: 'Make informed decisions with confidence, backed by comprehensive data analysis.',
    bg: 'bg-feminine-accent/20',
    border: 'border-feminine-accent/30',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-surface via-secondary/5 to-accent/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Simple Process
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary text-center mb-16"
        >
          How It Works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              <div className={`${step.bg} bg-surface p-6 rounded-lg h-full border-2 ${step.border} hover:shadow-lg transition-all duration-300`}>
                <div className="text-4xl font-bold text-primary mb-4 opacity-30 group-hover:opacity-50 transition-opacity">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-accent opacity-40 group-hover:opacity-60 transition-opacity z-20">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
