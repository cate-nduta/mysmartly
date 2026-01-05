'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    quote: "We went from reactive to proactive. mySmartly pays for itself every quarter.",
    author: 'Maria Chen',
    role: 'CEO of Bloom Cosmetics',
    results: ['34% profit margin increase', '22% faster decision time'],
  },
  {
    quote: "Finally, a tool that speaks business, not data science.",
    author: 'David Park',
    role: 'CMO of SprintScale SaaS',
    results: ['41% lower CAC', '3x faster decisions'],
  },
  {
    quote: "Hired my first 'AI analyst' for less than our coffee budget.",
    author: 'Samantha Reed',
    role: 'Founder of GrowthLabs Agency',
    results: ['Saved $85k in analyst costs', '27% higher client ROI'],
  },
]

export default function TestimonialsWithResults() {
  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-emerald-50/50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Don&apos;t Take Our Word For It
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Business leaders across industries use mySmartly to make faster, better decisions. See how they&apos;ve transformed their operations.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-text-secondary mb-6 leading-relaxed italic text-lg">
                &quot;{testimonial.quote}&quot;
              </p>
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="font-semibold text-primary">{testimonial.author}</p>
                <p className="text-sm text-text-secondary">{testimonial.role}</p>
              </div>
              <div className="space-y-2">
                {testimonial.results.map((result, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="font-medium text-primary">{result}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            These results are based on real customer outcomes. Individual results may vary based on business size, industry, and implementation. All metrics verified through customer interviews and case studies.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
