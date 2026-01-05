'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface LogoProps {
  className?: string
  textColor?: string
  showText?: boolean
}

export default function Logo({ className = '', textColor = 'inherit', showText = true }: LogoProps) {
  const [logoUrl, setLogoUrl] = useState<string>('/icon.svg')
  const [logoText, setLogoText] = useState<string>('mySmartly')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogoSettings()
  }, [])

  const fetchLogoSettings = async () => {
    try {
      // Fetch logo URL
      const { data: logoData } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'logo_url')
        .single()

      if (logoData?.setting_value) {
        setLogoUrl(logoData.setting_value)
      }

      // Fetch logo text
      const { data: textData } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'logo_text')
        .single()

      if (textData?.setting_value) {
        setLogoText(textData.setting_value)
      }
    } catch (error) {
      console.error('Error fetching logo settings:', error)
      // Use defaults if error
    } finally {
      setLoading(false)
    }
  }

  // Render logo as image (supports SVG, PNG, JPG, and external URLs)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={logoUrl}
        alt={logoText}
        className="h-8 w-auto object-contain"
        onError={(e) => {
          // Fallback to default icon if image fails to load
          const target = e.target as HTMLImageElement
          if (target.src !== '/icon.svg') {
            target.src = '/icon.svg'
          }
        }}
      />
      {showText && (
        <span className="text-xl font-bold" style={{ color: textColor }}>
          {logoText}
        </span>
      )}
    </div>
  )
}
