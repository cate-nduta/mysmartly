'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

const defaultContent = `
<section>
  <h2 className="text-2xl font-bold text-primary mb-4">1. Agreement to Terms</h2>
  <div className="space-y-4 text-text-secondary leading-relaxed">
    <p>
      These Terms of Service ("Terms") govern your access to and use of the mySmartly AI business analyst platform ("Service") provided by mySmartly Inc. ("Company," "we," "our," or "us").
    </p>
    <p>
      By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part, you may not access the Service.
    </p>
  </div>
</section>
`

export default function TermsPage() {
  const [content, setContent] = useState<string>('')
  const [title, setTitle] = useState('Terms of Service')
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
        .eq('page_type', 'terms')
        .single()

      if (error) {
        console.error('Error fetching terms page:', error)
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
            <p className="text-text-secondary text-lg mb-4">
              Last Updated: {lastUpdated}
            </p>
            <p className="text-text-secondary bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <strong>Important:</strong> These Terms constitute a legally binding agreement. By using mySmartly, you agree to these terms.
            </p>
          </header>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-10">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
