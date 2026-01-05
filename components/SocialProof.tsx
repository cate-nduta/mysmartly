'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    quote: 'Smartly has transformed how we analyze our business data. The insights are always relevant and actionable.',
    author: 'Sarah Chen',
    role: 'CEO, TechStart Inc.',
  },
  {
    quote: 'Finally, an AI assistant that understands our business context. It\'s like having a data scientist on demand.',
    author: 'Michael Rodriguez',
    role: 'VP of Strategy, GrowthCo',
  },
  {
    quote: 'The best investment we\'ve made this year. Smartly has helped us identify opportunities we would have missed.',
    author: 'Emily Watson',
    role: 'Founder, InnovateLab',
  },
]

const testimonialAccents = [
  { bg: 'bg-secondary/20', border: 'border-secondary/30' },
  { bg: 'bg-accent/10', border: 'border-accent/30' },
  { bg: 'bg-feminine-accent/20', border: 'border-feminine-accent/30' },
]

export default function SocialProof() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-surface relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-feminine-accent/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <span className="inline-block px-4 py-2 bg-feminine-accent/20 text-[#8B1538] rounded-full text-sm font-medium mb-4">
            Testimonials
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary text-center mb-16"
        >
          Trusted by Forward-Thinking Businesses
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-surface p-8 rounded-lg shadow-md border-2 ${testimonialAccents[index].border} hover:shadow-lg transition-all duration-300`}
            >
              <div className={`w-12 h-12 ${testimonialAccents[index].bg} rounded-full flex items-center justify-center mb-6`}>
                <svg className="w-6 h-6 text-text-primary opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>
              <p className="text-text-secondary mb-6 leading-relaxed italic">
                &quot;{testimonial.quote}&quot;
              </p>
              <div>
                <p className="font-medium text-text-primary">{testimonial.author}</p>
                <p className="text-sm text-text-secondary">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

