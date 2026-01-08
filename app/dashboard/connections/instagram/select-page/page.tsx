'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

interface InstagramPage {
  page_id: string
  page_name: string
  page_access_token: string
  instagram_business_account_id: string
}

function SelectInstagramPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  const [pages, setPages] = useState<InstagramPage[]>([])
  const [selectedPageId, setSelectedPageId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageDetails, setPageDetails] = useState<Record<string, any>>({})
  const [activeSection, setActiveSection] = useState<'dashboard' | 'usage' | 'spending' | 'billing'>('dashboard')

  useEffect(() => {
    if (!userId) {
      router.push('/dashboard?error=missing_user_id')
      return
    }

    fetchInstagramPages()
  }, [userId, router])

  const fetchInstagramPages = async () => {
    try {
      const { data, error } = await supabase
        .from('data_connections')
        .select('connection_config')
        .eq('user_id', userId)
        .eq('connection_type', 'instagram_page')
        .eq('status', 'pending_page_selection')
        .single()

      if (error) throw error

      if (data?.connection_config?.pages) {
        setPages(data.connection_config.pages)
        
        // Fetch Instagram account details for each page
        for (const page of data.connection_config.pages) {
          try {
            const instagramResponse = await fetch(
              `https://graph.facebook.com/v18.0/${page.instagram_business_account_id}?fields=username,name,profile_picture_url&access_token=${page.page_access_token}`
            )
            if (instagramResponse.ok) {
              const instagramData = await instagramResponse.json()
              setPageDetails((prev) => ({
                ...prev,
                [page.page_id]: instagramData,
              }))
            }
          } catch (err) {
            console.error('Error fetching Instagram details:', err)
          }
        }
      } else {
        setError('No Instagram pages found. Please try connecting again.')
      }
    } catch (err: any) {
      console.error('Error fetching Instagram pages:', err)
      setError(err.message || 'Failed to load Instagram pages')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPageId || !userId) return

    setSaving(true)
    setError(null)

    try {
      // Get connection data
      const { data: connectionData, error: fetchError } = await supabase
        .from('data_connections')
        .select('connection_config')
        .eq('user_id', userId)
        .eq('connection_type', 'instagram_page')
        .eq('status', 'pending_page_selection')
        .single()

      if (fetchError) throw fetchError

      const selectedPage = pages.find(p => p.page_id === selectedPageId)
      if (!selectedPage) {
        throw new Error('Selected page not found')
      }

      const instagramDetails = pageDetails[selectedPageId] || {}

      // Update connection with selected page
      const { error: updateError } = await supabase
        .from('data_connections')
        .update({
          status: 'connected',
          connection_config: {
            ...connectionData.connection_config,
            selected_page_id: selectedPageId,
            selected_page_name: selectedPage.page_name,
            page_access_token: selectedPage.page_access_token,
            instagram_business_account_id: selectedPage.instagram_business_account_id,
            instagram_username: instagramDetails.username,
            instagram_name: instagramDetails.name,
            instagram_profile_picture: instagramDetails.profile_picture_url,
          },
          last_sync_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('connection_type', 'instagram_page')
        .eq('status', 'pending_page_selection')

      if (updateError) throw updateError

      // Redirect back to dashboard
      router.push('/dashboard?connected=instagram_page')

    } catch (err: any) {
      console.error('Error saving Instagram page selection:', err)
      setError(err.message || 'Failed to save selection')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          <div className="flex-1 p-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading Instagram pages...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-primary mb-2">Select Instagram Page</h1>
            <p className="text-text-secondary mb-8">
              Choose which Instagram business page you want to connect to mySmartly
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {error}
              </div>
            )}

            {pages.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-text-secondary mb-4">No Instagram pages found.</p>
                <p className="text-sm text-text-secondary mb-4">
                  Make sure your Facebook Page has an Instagram Business account connected.
                </p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="space-y-4 mb-6">
                  {pages.map((page) => {
                    const instagramDetails = pageDetails[page.page_id] || {}
                    return (
                      <label
                        key={page.page_id}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedPageId === page.page_id
                            ? 'border-accent bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="instagramPage"
                          value={page.page_id}
                          checked={selectedPageId === page.page_id}
                          onChange={(e) => setSelectedPageId(e.target.value)}
                          className="mr-4 w-5 h-5 text-accent focus:ring-accent"
                        />
                        <div className="flex items-center flex-1">
                          {instagramDetails.profile_picture_url && (
                            <img
                              src={instagramDetails.profile_picture_url}
                              alt={instagramDetails.name || page.page_name}
                              className="w-12 h-12 rounded-full mr-4"
                            />
                          )}
                          <div className="flex-1">
                            <div className="font-semibold text-primary">
                              {instagramDetails.name || page.page_name}
                            </div>
                            {instagramDetails.username && (
                              <div className="text-sm text-text-secondary">@{instagramDetails.username}</div>
                            )}
                            <div className="text-xs text-text-secondary mt-1">
                              Facebook Page: {page.page_name}
                            </div>
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gray-100 text-primary rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedPageId || saving}
                    className="flex-1 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Connecting...' : 'Connect Page'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function SelectInstagramPagePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <DashboardSidebar activeSection="dashboard" onSectionChange={() => {}} />
          <div className="flex-1 p-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <SelectInstagramPageContent />
    </Suspense>
  )
}

