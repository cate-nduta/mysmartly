import type { Metadata } from 'next'
import './globals.css'
import Analytics from '@/components/Analytics'
import { supabase } from '@/lib/supabase'

async function getSiteSettings() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['favicon_url', 'logo_url'])

    if (error) throw error
    
    const settings: Record<string, string> = {}
    data?.forEach((item) => {
      if (item.setting_value) {
        settings[item.setting_key] = item.setting_value
      }
    })
    
    return settings
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return {}
  }
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSiteSettings()
    const faviconUrl = settings.favicon_url || '/icon.svg'
    const logoUrl = settings.logo_url || '/icon.svg'
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mysmartly.app'

    return {
      metadataBase: new URL(siteUrl),
      title: 'mysmartly - AI Driven Business Solutions',
      description: 'Transform Data into Automated Business Decisions',
      keywords: 'business intelligence, decision automation, data analytics, AI business insights, automated decisions',
      icons: {
        icon: [
          { url: faviconUrl, sizes: 'any' },
          { url: faviconUrl, type: 'image/svg+xml' },
        ],
        apple: faviconUrl,
        shortcut: faviconUrl,
      },
      openGraph: {
        title: 'mysmartly - AI Driven Business Solutions',
        description: 'Transform Data into Automated Business Decisions',
        type: 'website',
        url: siteUrl,
        images: [
          {
            url: logoUrl,
            width: 512,
            height: 512,
            alt: 'mySmartly Logo',
          },
        ],
      },
    }
  } catch (error) {
        // Fallback to default metadata if there's an error
        return {
          title: 'mysmartly - AI Driven Business Solutions',
          description: 'Transform Data into Automated Business Decisions',
      keywords: 'business intelligence, decision automation, data analytics, AI business insights, automated decisions',
      icons: {
        icon: '/icon.svg',
        apple: '/icon.svg',
        shortcut: '/icon.svg',
      },
      openGraph: {
        title: 'mysmartly - AI Driven Business Solutions',
        description: 'Transform Data into Automated Business Decisions',
        type: 'website',
      },
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/icon.svg" />
        <meta name="theme-color" content="#0F4C5C" />
        <meta name="google-site-verification" content="EPBxhseB7zMxvTVwEirhzTjvh7oTL1cR_ChHd21A06s" />
      </head>
      <body>
        {children}
        <Analytics gaId={gaId} gtmId={gtmId} />
      </body>
    </html>
  )
}
