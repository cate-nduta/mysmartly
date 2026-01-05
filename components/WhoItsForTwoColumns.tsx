'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

interface WhoItsForContent {
  id: string
  section_type: 'positive' | 'negative'
  title: string
  items: string[]
  description: string
  is_active: boolean
}

export default function WhoItsForTwoColumns() {
  const [positiveContent, setPositiveContent] = useState<WhoItsForContent | null>(null)
  const [negativeContent, setNegativeContent] = useState<WhoItsForContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('who_its_for_content')
        .select('*')
        .eq('is_active', true)

      if (error) throw error

      // Parse JSONB items array
      const parsedData = (data || []).map(item => ({
        ...item,
        items: typeof item.items === 'string' ? JSON.parse(item.items) : item.items,
      }))

      const positive = parsedData.find(item => item.section_type === 'positive')
      const negative = parsedData.find(item => item.section_type === 'negative')

      setPositiveContent(positive || null)
      setNegativeContent(negative || null)
    } catch (error) {
      console.error('Error fetching who its for content:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fallback to default content if database content is not available
  const defaultPositive = {
    title: "You'll Love mySmartly If You're:",
    items: [
      'E-commerce founder doing $500K-$50M/year',
      'SaaS CEO with 10-200 employees',
      'Marketing Director managing $50K+/month in ad spend',
      'Operations manager optimizing inventory/costs',
      'Agency owner tracking client ROI',
    ],
    description: 'If you\'re making critical business decisions daily and need data-backed recommendations without the complexity, mySmartly transforms your scattered analytics into a clear action plan.',
  }

  const defaultNegative = {
    title: 'You Might Not Need mySmartly If:',
    items: [
      "You're a solo freelancer with one income stream",
      'You prefer gut-feel decisions over data',
      'You already have a full data science team',
    ],
    description: 'mySmartly is built for teams that need to scale decision-making. If your business runs on intuition alone or you have dedicated analysts, you may not need automated recommendations.',
  }

  const positive = positiveContent || defaultPositive
  const negative = negativeContent || defaultNegative

  if (loading) {
    return (
      <section className="py-12 lg:py-16 bg-gradient-to-br from-white to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-white to-blue-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Built for Decision-Makers Who Value Results Over Reports
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            mySmartly is designed for business leaders who need answers fast, not data scientists who enjoy exploring datasets for hours.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-emerald-50 border-2 border-accent/30 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-primary mb-6">
              {positive.title}
            </h3>
            <ul className="space-y-4">
              {positive.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-text-primary leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-8 border-t border-accent/20">
              <p className="text-text-secondary leading-relaxed">
                {positive.description}
              </p>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-primary mb-6">
              {negative.title}
            </h3>
            <ul className="space-y-4">
              {negative.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-text-primary leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-text-secondary leading-relaxed">
                {negative.description}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
