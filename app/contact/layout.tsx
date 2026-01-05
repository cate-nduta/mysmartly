import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Get in Touch with mySmartly',
  description: 'Get in touch with the mySmartly team. Send us a message or reach out via email or phone.',
  keywords: 'contact mySmartly, customer support, get in touch, support email',
  openGraph: {
    title: 'Contact Us | Get in Touch with mySmartly',
    description: 'Get in touch with the mySmartly team. Send us a message or reach out via email or phone.',
    type: 'website',
    url: 'https://mysmartly.app/contact',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Get in Touch with mySmartly',
    description: 'Get in touch with the mySmartly team.',
  },
  alternates: {
    canonical: 'https://mysmartly.app/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

