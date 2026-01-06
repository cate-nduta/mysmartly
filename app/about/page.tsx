import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Breadcrumb from '@/components/Breadcrumb'
import FinalCTA from '@/components/FinalCTA'
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'About Us | mySmartly Team',
  description: 'Meet the team behind mySmartly. Learn about our mission to help businesses make data-driven decisions.',
  keywords: 'about mySmartly, team, company story, mission, values',
  openGraph: {
    title: 'About Us | mySmartly Team',
    description: 'Meet the team behind mySmartly. Learn about our mission to help businesses make data-driven decisions.',
    type: 'website',
    url: 'https://mysmartly.app/about',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | mySmartly Team',
    description: 'Meet the team behind mySmartly.',
  },
  alternates: {
    canonical: 'https://mysmartly.app/about',
  },
}

const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
]

async function getTeamMembers() {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching team members:', error)
    return []
  }
}

export default async function AboutPage() {
  const teamMembers = await getTeamMembers()

  return (
    <main className="min-h-screen">
      <Header />
      <Breadcrumb items={breadcrumbItems} />

      {/* Hero Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-blue-50/50 via-white to-burgundy-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
              About mySmartly
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed">
              We&apos;re building the future of business intelligence, one decision at a time.
            </p>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
              At mySmartly, we believe that every business should have access to AI-powered insights that drive real growth. Our mission is to make data-driven decision making accessible to businesses of all sizes, without the complexity and cost of traditional analytics platforms.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-white to-blue-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-text-secondary mb-6 leading-relaxed">
                We&apos;re on a mission to democratize business intelligence. Too many businesses are drowning in data but starving for insights. We&apos;re changing that by making AI-powered recommendations accessible, actionable, and affordable.
              </p>
              <p className="text-lg text-text-secondary leading-relaxed">
                Our platform turns complex data into clear, prioritized actions. No data science degree required, just connect your tools and start making better decisions today.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-semibold text-primary mb-4">Our Values</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <strong className="text-primary">Simplicity First</strong>
                    <p className="text-text-secondary">Complex problems deserve simple solutions</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <strong className="text-primary">Data-Driven</strong>
                    <p className="text-text-secondary">We practice what we preach, every decision is backed by data</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-accent mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <strong className="text-primary">Customer Success</strong>
                    <p className="text-text-secondary">Your growth is our success metric</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-burgundy-50/40 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Meet the Team
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              The people behind mySmartly
            </p>
          </div>

          {teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary">Team information coming soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-xl p-8 text-center border border-gray-200">
                  {member.photo_url && (
                    <img
                      src={member.photo_url}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                    />
                  )}
                  <h3 className="text-2xl font-bold text-primary mb-2">{member.name}</h3>
                  <p className="text-accent font-medium mb-4">{member.role}</p>
                  {member.bio && (
                    <p className="text-text-secondary mb-6 leading-relaxed">{member.bio}</p>
                  )}
                  <div className="flex justify-center gap-4">
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    )}
                    {member.twitter_url && (
                      <a
                        href={member.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                        aria-label={`${member.name} Twitter`}
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="text-gray-400 hover:text-accent transition-colors"
                        aria-label={`Email ${member.name}`}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </main>
  )
}

