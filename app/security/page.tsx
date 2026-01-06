'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

const defaultContent = `
<section className="text-center py-8 border-b border-gray-200">
  <div className="flex flex-wrap justify-center gap-3 mb-6">
    <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
      SOC 2 Type II Compliant
    </span>
    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
      GDPR Compliant
    </span>
  </div>
  <p className="text-text-secondary text-lg leading-relaxed max-w-3xl mx-auto">
    At mySmartly, security isn't an afterthought, it's foundational. We protect your business data with enterprise-grade security measures, regular audits, and transparent practices.
  </p>
</section>
`

export default function SecurityPage() {
  const [content, setContent] = useState<string>('')
  const [title, setTitle] = useState('Security & Compliance')
  const [lastUpdated, setLastUpdated] = useState('January 5, 2026')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setContent(defaultContent)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('legal_pages')
        .select('*')
        .eq('page_type', 'security')
        .single()

      if (error) {
        console.error('Error fetching security page:', error)
        setContent(defaultContent)
      } else if (data) {
        setContent(data.content)
        setTitle(data.title)
        setLastUpdated(new Date(data.last_updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))
      } else {
        setContent(defaultContent)
      }
    } catch (error) {
      console.error('Error:', error)
      setContent(defaultContent)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-burgundy-50/30">
        <Header />
        <main className="py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center">
              <p className="text-text-secondary">Loading...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/30">
      <Header />
      <main className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              {title}
            </h1>
            <p className="text-text-secondary text-lg mb-2">
              Last Updated: {lastUpdated}
            </p>
            <p className="text-text-secondary text-xl font-medium">
              Enterprise-grade security for your business data
            </p>
          </header>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-10">
            <div 
              className="legal-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
