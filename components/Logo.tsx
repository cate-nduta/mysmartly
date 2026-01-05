'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface LogoProps {
  className?: string
  textColor?: string
  showText?: boolean
}

// Cache logo settings to avoid repeated queries
let logoCache: { url: string; text: string; timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export default function Logo({ className = '', textColor = 'inherit', showText = true }: LogoProps) {
  const [logoUrl, setLogoUrl] = useState<string>('/icon.svg')
  const [logoText, setLogoText] = useState<string>('mySmartly')
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    // Check cache first
    const now = Date.now()
    if (logoCache && (now - logoCache.timestamp) < CACHE_DURATION) {
      setLogoUrl(logoCache.url)
      setLogoText(logoCache.text)
      return
    }

    // Fetch logo settings (combined query for efficiency)
    const fetchLogoSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_key, setting_value')
          .in('setting_key', ['logo_url', 'logo_text'])

        if (error) throw error

        let url = '/icon.svg'
        let text = 'mySmartly'

        data?.forEach((item) => {
          if (item.setting_key === 'logo_url' && item.setting_value) {
            url = item.setting_value
          } else if (item.setting_key === 'logo_text' && item.setting_value) {
            text = item.setting_value
          }
        })

        // Update cache
        logoCache = { url, text, timestamp: now }
        setLogoUrl(url)
        setLogoText(text)
      } catch (error) {
        console.error('Error fetching logo settings:', error)
        // Use defaults if error
      }
    }

    fetchLogoSettings()
  }, [])

  // Preload logo image for faster rendering
  useEffect(() => {
    if (logoUrl && logoUrl !== '/icon.svg' && typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = logoUrl
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link)
        }
      }
    }
  }, [logoUrl])

  // Determine if URL is external
  const isExternal = useMemo(() => {
    return logoUrl.startsWith('http://') || logoUrl.startsWith('https://')
  }, [logoUrl])

  const displayUrl = imageError ? '/icon.svg' : logoUrl

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {isExternal ? (
        <img
          src={displayUrl}
          alt={logoText}
          className="h-8 w-auto object-contain"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onError={() => {
            if (!imageError) {
              setImageError(true)
            }
          }}
        />
      ) : (
        <Image
          src={displayUrl}
          alt={logoText}
          width={32}
          height={32}
          className="h-8 w-auto object-contain"
          priority
          loading="eager"
          quality={90}
          onError={() => {
            if (!imageError) {
              setImageError(true)
            }
          }}
        />
      )}
      {showText && (
        <span className="text-xl font-bold" style={{ color: textColor }}>
          {logoText}
        </span>
      )}
    </div>
  )
}
