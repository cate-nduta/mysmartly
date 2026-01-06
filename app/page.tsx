import type { Metadata } from 'next'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ProblemStatement from '@/components/ProblemStatement'
import WhoItsForTwoColumns from '@/components/WhoItsForTwoColumns'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'mySmartly - AI Business Analyst | Automated Decision Making Platform',
  description: 'Transform Data into Automated Business Decisions. 14-day free trial.',
  keywords: 'AI business analyst, business decision automation, data-driven decisions, automated business insights, AI business intelligence, business analytics platform',
  openGraph: {
    title: 'mySmartly - AI Business Analyst | Automated Decision Making Platform',
    description: 'Transform Data into Automated Business Decisions',
    type: 'website',
    url: 'https://mysmartly.app',
    siteName: 'mySmartly',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'mySmartly - AI Business Analyst Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mySmartly - AI Business Analyst | Automated Decision Making Platform',
    description: 'Smart Decisions, AI-Validated. Every Time. mySmartly analyzes your business data and delivers actionable recommendations validated by AI.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://mysmartly.app',
  },
}

// Schema markup for homepage
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'mySmartly',
  url: 'https://mysmartly.app',
  logo: 'https://mysmartly.app/icon.svg',
  description: 'AI-powered business analyst platform that automates decision making',
  sameAs: [
    'https://twitter.com/mysmartly',
    'https://linkedin.com/company/mysmartly',
  ],
}

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'mySmartly',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '149',
    priceCurrency: 'USD',
    priceValidUntil: '2025-12-31',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '127',
  },
}

export default function Home() {
  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      <main className="min-h-screen">
        <Header />
        <Hero />
        <ProblemStatement />
        <WhoItsForTwoColumns />
        <FinalCTA />
        <Footer />
      </main>
    </>
  )
}
