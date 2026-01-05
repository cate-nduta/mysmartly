'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import FinalCTA from '@/components/FinalCTA'
import { supabase } from '@/lib/supabase'

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'Contact', href: '/contact' },
]

interface ContactContent {
  section_type: string
  title: string | null
  description: string | null
  content: any
}

export default function ContactPage() {
  const [contactContent, setContactContent] = useState<ContactContent[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchContactContent()
  }, [])

  const fetchContactContent = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_page_content')
        .select('*')
        .eq('is_active', true)
        .order('section_type', { ascending: true })

      if (error) throw error
      setContactContent(data || [])
    } catch (error) {
      console.error('Error fetching contact content:', error)
    } finally {
      setLoading(false)
    }
  }

  const heroContent = contactContent.find(c => c.section_type === 'hero')
  const officeContent = contactContent.find(c => c.section_type === 'office_info')
  const supportContent = contactContent.find(c => c.section_type === 'support_info')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitMessage(null)

    try {
      // Here you would typically send the form data to your backend/API
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      setSubmitMessage({ type: 'success', text: 'Thank you for your message! We\'ll get back to you soon.' })
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Failed to send message. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Header />
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-blue-50/50 via-white to-burgundy-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              {heroContent?.title || 'Get in Touch'}
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed">
              {heroContent?.description || 'Have questions? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.'}
            </p>
            {heroContent?.content?.subtitle && (
              <p className="text-lg text-text-secondary">{heroContent.content.subtitle}</p>
            )}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-white to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Send us a Message</h2>
              {submitMessage && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    submitMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-primary mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-primary mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-accent text-white rounded-lg font-semibold text-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Contact Information</h2>
              
              {officeContent && (
                <div className="bg-gray-50 p-8 rounded-xl mb-6">
                  <h3 className="text-xl font-semibold text-primary mb-4">
                    {officeContent.title || 'Office'}
                  </h3>
                  {officeContent.content && (
                    <div className="space-y-4 text-text-secondary">
                      {officeContent.content.address && (
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-accent mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <div>{officeContent.content.address}</div>
                            {officeContent.content.city && <div>{officeContent.content.city}</div>}
                          </div>
                        </div>
                      )}
                      {officeContent.content.email && (
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-accent mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <a href={`mailto:${officeContent.content.email}`} className="text-accent hover:underline">
                            {officeContent.content.email}
                          </a>
                        </div>
                      )}
                      {officeContent.content.phone && (
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-accent mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a href={`tel:${officeContent.content.phone}`} className="text-accent hover:underline">
                            {officeContent.content.phone}
                          </a>
                        </div>
                      )}
                      {officeContent.content.hours && (
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-accent mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>{officeContent.content.hours}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {supportContent && supportContent.content && (
                <div className="bg-gray-50 p-8 rounded-xl">
                  <h3 className="text-xl font-semibold text-primary mb-4">
                    {supportContent.title || 'Support'}
                  </h3>
                  <div className="space-y-4 text-text-secondary">
                    {supportContent.content.support_email && (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-accent mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <div>
                          <div>Support: <a href={`mailto:${supportContent.content.support_email}`} className="text-accent hover:underline">{supportContent.content.support_email}</a></div>
                          {supportContent.content.support_hours && (
                            <div className="text-sm">{supportContent.content.support_hours}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </main>
  )
}

