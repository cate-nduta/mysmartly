'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface SiteSetting {
  id: string
  setting_key: string
  setting_value: string | null
  setting_type: string
  description: string | null
  updated_at: string
}

export default function SiteSettings() {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSetting, setEditingSetting] = useState<SiteSetting | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [formValue, setFormValue] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('setting_key', { ascending: true })

      if (error) throw error
      setSettings(data || [])
      
      // Set preview for logo
      const logoSetting = data?.find(s => s.setting_key === 'logo_url')
      if (logoSetting?.setting_value) {
        setLogoPreview(logoSetting.setting_value)
      }
    } catch (error: any) {
      console.error('Error fetching site settings:', error)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (setting: SiteSetting) => {
    setEditingSetting(setting)
    setFormValue(setting.setting_value || '')
    setImageFile(null)
    
    // Update preview if it's the logo or favicon
    if (setting.setting_key === 'logo_url' || setting.setting_key === 'favicon_url') {
      setLogoPreview(setting.setting_value || '')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSetting) return

    setMessage(null)
    setUploading(true)

    try {
      let finalValue = formValue

      // Upload image if a file was selected (for logo or favicon)
      if (imageFile && (editingSetting.setting_key === 'logo_url' || editingSetting.setting_key === 'favicon_url')) {
        const fileExt = imageFile.name.split('.').pop()
        const folder = editingSetting.setting_key === 'logo_url' ? 'logos' : 'favicons'
        const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

        // Delete old file if it exists in storage
        if (editingSetting.setting_value && editingSetting.setting_value.includes('site-assets')) {
          const oldFileName = editingSetting.setting_value.split('/').pop()?.split('?')[0]
          if (oldFileName) {
            await supabase.storage.from('site-assets').remove([`${folder}/${oldFileName}`])
          }
        }

        const { error: uploadError } = await supabase.storage
          .from('site-assets')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: true
          })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('site-assets')
          .getPublicUrl(fileName)

        finalValue = urlData.publicUrl
      }

      const { error } = await supabase
        .from('site_settings')
        .update({
          setting_value: finalValue || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingSetting.id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Setting updated successfully!' })
      setEditingSetting(null)
      setImageFile(null)
      setFormValue('')
      
      // Update preview if it's the logo or favicon
      if (editingSetting.setting_key === 'logo_url' || editingSetting.setting_key === 'favicon_url') {
        setLogoPreview(finalValue || '')
      }
      
      await fetchSettings()
    } catch (error: any) {
      console.error('Error saving setting:', error)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setUploading(false)
    }
  }

  const handleLogoPreview = (value: string) => {
    setFormValue(value)
    setLogoPreview(value)
  }

  if (loading) {
    return <div className="p-8 text-center">Loading site settings...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary">Site Settings</h2>
        <p className="text-text-secondary mt-2">Manage your site logo and other settings</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {settings.map((setting) => (
          <div key={setting.id} className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-primary capitalize mb-2">
                  {setting.setting_key.replace('_', ' ')}
                </h3>
                {setting.description && (
                  <p className="text-text-secondary mb-4">{setting.description}</p>
                )}
                {editingSetting?.id !== setting.id && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-primary mb-2">Current Value:</p>
                    <p className="text-text-secondary">
                      {setting.setting_key === 'logo_url' && setting.setting_value ? (
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-sm">{setting.setting_value}</span>
                          <img
                            src={setting.setting_value}
                            alt="Logo preview"
                            className="h-12 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        </div>
                      ) : setting.setting_key === 'favicon_url' && setting.setting_value ? (
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-sm">{setting.setting_value}</span>
                          <img
                            src={setting.setting_value}
                            alt="Favicon preview"
                            className="h-8 w-8 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        </div>
                      ) : (
                        <span className="font-mono text-sm">{setting.setting_value || '(not set)'}</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
              {editingSetting?.id !== setting.id && (
                <button
                  onClick={() => handleEdit(setting)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded font-medium hover:bg-blue-200 transition-colors ml-4"
                >
                  Edit
                </button>
              )}
            </div>

            {editingSetting?.id === setting.id && (
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    {setting.setting_key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                  {(setting.setting_key === 'logo_url' || setting.setting_key === 'favicon_url') ? (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      {logoPreview && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-primary mb-2">Preview:</p>
                          <div className={`bg-gray-50 p-4 rounded-lg border border-gray-200 ${setting.setting_key === 'favicon_url' ? 'inline-block' : ''}`}>
                            <img
                              src={logoPreview}
                              alt={`${setting.setting_key === 'logo_url' ? 'Logo' : 'Favicon'} preview`}
                              className={setting.setting_key === 'logo_url' ? 'h-16 object-contain' : 'h-8 w-8 object-contain'}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <input
                      type={setting.setting_type === 'url' ? 'url' : 'text'}
                      value={formValue}
                      onChange={(e) => setFormValue(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder={setting.description || 'Enter value...'}
                    />
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSetting(null)
                      setFormValue('')
                      setLogoPreview('')
                      setImageFile(null)
                    }}
                    className="px-6 py-3 bg-gray-200 text-primary rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}

