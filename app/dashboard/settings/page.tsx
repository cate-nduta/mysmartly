'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Logo from '@/components/Logo'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [preferences, setPreferences] = useState<any>(null)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [twoFactorSecret, setTwoFactorSecret] = useState<string | null>(null)
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    checkUser()
    fetchPreferences()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser) {
        router.push('/auth/login')
        return
      }

      setUser(currentUser)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchPreferences = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) return

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', currentUser.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      
      setPreferences(data)
      setTwoFactorEnabled(data?.two_factor_enabled || false)
    } catch (error) {
      console.error('Error fetching preferences:', error)
    }
  }

  const handleEnable2FA = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) return

      // Generate TOTP secret (in production, use a secure library)
      const { data: factorData, error: factorError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      })

      if (factorError) throw factorError

      setTwoFactorSecret(factorData.totp?.secret || null)
      setShowTwoFactorSetup(true)
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to enable 2FA' })
    }
  }

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) return

      // Verify TOTP code
      const { error: verifyError } = await supabase.auth.mfa.challenge({
        factorId: twoFactorSecret!,
      })

      if (verifyError) throw verifyError

      // Update preferences
      const { error: updateError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: currentUser.id,
          two_factor_enabled: true,
          two_factor_secret: twoFactorSecret,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        })

      if (updateError) throw updateError

      setTwoFactorEnabled(true)
      setShowTwoFactorSetup(false)
      setTwoFactorSecret(null)
      setMessage({ type: 'success', text: 'Two-factor authentication enabled successfully' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to verify 2FA code' })
    }
  }

  const handleDisable2FA = async () => {
    if (!confirm('Are you sure you want to disable two-factor authentication? This reduces your account security.')) {
      return
    }

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) return

      const { error } = await supabase
        .from('user_preferences')
        .update({
          two_factor_enabled: false,
          two_factor_secret: null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', currentUser.id)

      if (error) throw error

      setTwoFactorEnabled(false)
      setMessage({ type: 'success', text: 'Two-factor authentication disabled' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to disable 2FA' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Dashboard Navigation Bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-primary">
              <Logo textColor="#1F2937" />
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-100 text-primary rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8">
        <h1 className="text-3xl font-bold text-primary mb-8">Settings</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Account Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-primary mb-4">Account</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Email</label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-text-secondary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Name</label>
              <input
                type="text"
                value={user.user_metadata?.full_name || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-text-secondary"
              />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-primary mb-4">Security</h2>
          
          {/* Two-Factor Authentication */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-primary mb-1">Two-Factor Authentication (2FA)</h3>
                <p className="text-sm text-text-secondary">
                  Add an extra layer of security to your account
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  twoFactorEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            {showTwoFactorSetup && twoFactorSecret && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.):
                </p>
                <p className="text-xs text-blue-600 mb-4 font-mono break-all">{twoFactorSecret}</p>
                <form onSubmit={handleVerify2FA} className="space-y-3">
                  <input
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                    >
                      Verify & Enable
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTwoFactorSetup(false)
                        setTwoFactorSecret(null)
                      }}
                      className="px-4 py-2 bg-gray-100 text-primary rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {!showTwoFactorSetup && (
              <div className="flex gap-2">
                {!twoFactorEnabled ? (
                  <button
                    onClick={handleEnable2FA}
                    className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                  >
                    Enable 2FA
                  </button>
                ) : (
                  <button
                    onClick={handleDisable2FA}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Disable 2FA
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Billing Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-primary mb-4">Billing</h2>
          <Link
            href="/dashboard/checkout"
            className="inline-block px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            Manage Subscription
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}


