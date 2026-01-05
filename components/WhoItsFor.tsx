'use client'

import { motion } from 'framer-motion'

const audiences = [
  {
    title: 'Growing Startups',
    description: 'Scale your business with data-driven insights that help you make informed decisions at every stage of growth.',
    gradient: 'from-primary/10 to-secondary/20',
    borderHover: 'hover:border-primary/30',
    accentBg: 'bg-primary/20',
    accentDot: 'bg-primary',
  },
  {
    title: 'Established Businesses',
    description: 'Optimize operations and discover new opportunities through comprehensive analysis of your business metrics.',
    gradient: 'from-accent/10 to-feminine-accent/20',
    borderHover: 'hover:border-accent/30',
    accentBg: 'bg-accent/20',
    accentDot: 'bg-accent',
  },
  {
    title: 'Decision Makers',
    description: 'Get the insights you need when you need them, without the complexity of traditional analytics tools.',
    gradient: 'from-feminine-accent/10 to-secondary/20',
    borderHover: 'hover:border-feminine-accent/30',
    accentBg: 'bg-feminine-accent/20',
    accentDot: 'bg-feminine-accent',
  },
]

export default function WhoItsFor() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-surface via-secondary/5 to-accent/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Perfect For
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary text-center mb-16"
        >
          Who It&apos;s For
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {audiences.map((audience, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`bg-gradient-to-br ${audience.gradient} p-8 rounded-lg h-full border-2 border-transparent ${audience.borderHover} transition-all duration-300 group`}>
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full ${audience.accentBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <div className={`w-8 h-8 rounded-full ${audience.accentDot}`}></div>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">
                  {audience.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {audience.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
