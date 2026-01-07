'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

interface AdAccount {
  id: string
  name: string
  account_id: string
}

export default function SelectAdAccountPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'dashboard' | 'usage' | 'spending' | 'billing'>('dashboard')

  useEffect(() => {
    if (!userId) {
      router.push('/dashboard?error=missing_user_id')
      return
    }

    fetchAdAccounts()
  }, [userId, router])

  const fetchAdAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('data_connections')
        .select('connection_config')
        .eq('user_id', userId)
        .eq('connection_type', 'instagram_ads')
        .eq('status', 'pending_account_selection')
        .single()

      if (error) throw error

      if (data?.connection_config?.ad_accounts) {
        setAdAccounts(data.connection_config.ad_accounts)
      } else {
        setError('No ad accounts found. Please try connecting again.')
      }
    } catch (err: any) {
      console.error('Error fetching ad accounts:', err)
      setError(err.message || 'Failed to load ad accounts')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAccountId || !userId) return

    setSaving(true)
    setError(null)

    try {
      // Update the connection with the selected ad account
      const { data: connectionData, error: fetchError } = await supabase
        .from('data_connections')
        .select('connection_config')
        .eq('user_id', userId)
        .eq('connection_type', 'instagram_ads')
        .eq('status', 'pending_account_selection')
        .single()

      if (fetchError) throw fetchError

      const selectedAccount = adAccounts.find(acc => acc.id === selectedAccountId)
      if (!selectedAccount) {
        throw new Error('Selected account not found')
      }

      // Update connection with selected account
      const { error: updateError } = await supabase
        .from('data_connections')
        .update({
          status: 'connected',
          connection_config: {
            ...connectionData.connection_config,
            selected_account_id: selectedAccountId,
            selected_account_name: selectedAccount.name,
            account_id: selectedAccount.account_id,
          },
          last_sync_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('connection_type', 'instagram_ads')
        .eq('status', 'pending_account_selection')

      if (updateError) throw updateError

      // Redirect back to dashboard
      router.push('/dashboard?connected=instagram_ads')

    } catch (err: any) {
      console.error('Error saving ad account selection:', err)
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
              <p className="text-text-secondary">Loading ad accounts...</p>
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
            <h1 className="text-3xl font-bold text-primary mb-2">Select Ad Account</h1>
            <p className="text-text-secondary mb-8">
              Choose which Instagram Ads account you want to connect to mySmartly
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {error}
              </div>
            )}

            {adAccounts.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <p className="text-text-secondary mb-4">No ad accounts found.</p>
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
                  {adAccounts.map((account) => (
                    <label
                      key={account.id}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedAccountId === account.id
                          ? 'border-accent bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="adAccount"
                        value={account.id}
                        checked={selectedAccountId === account.id}
                        onChange={(e) => setSelectedAccountId(e.target.value)}
                        className="mr-4 w-5 h-5 text-accent focus:ring-accent"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-primary">{account.name || 'Unnamed Account'}</div>
                        <div className="text-sm text-text-secondary">Account ID: {account.account_id}</div>
                        <div className="text-xs text-text-secondary mt-1">ID: {account.id}</div>
                      </div>
                    </label>
                  ))}
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
                    disabled={!selectedAccountId || saving}
                    className="flex-1 px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Connecting...' : 'Connect Account'}
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

