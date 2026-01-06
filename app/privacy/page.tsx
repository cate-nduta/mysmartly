'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

const defaultContent = `
<section>
  <h2 className="text-2xl font-bold text-primary mb-4">1. Introduction</h2>
  <div className="space-y-4 text-text-secondary leading-relaxed">
    <p>
      mySmartly Inc. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI business analyst platform at mysmartly.app (the "Service").
    </p>
    <p>
      We process personal data as a data processor on behalf of our customers, who are data controllers. This policy applies to all users of our Service, including visitors to our website and customers using our platform.
    </p>
  </div>
</section>
`

export default function PrivacyPage() {
  const [content, setContent] = useState<string>('')
  const [title, setTitle] = useState('Privacy Policy')
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
        .eq('page_type', 'privacy')
        .single()

      if (error) {
        console.error('Error fetching privacy page:', error)
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
            <p className="text-text-secondary text-lg">
              Last Updated: {lastUpdated}
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
