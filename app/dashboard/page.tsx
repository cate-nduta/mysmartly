'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DataConnections from '@/components/dashboard/DataConnections'
import DecisionFeed from '@/components/dashboard/DecisionFeed'
import SubscriptionStatus from '@/components/dashboard/SubscriptionStatus'
import UpgradeNotification from '@/components/dashboard/UpgradeNotification'
import AIChatbot from '@/components/dashboard/AIChatbot'
import UsageSection from '@/components/dashboard/UsageSection'
import SpendingSection from '@/components/dashboard/SpendingSection'
import BillingSection from '@/components/dashboard/BillingSection'
import { getPlanLimits } from '@/lib/planLimits'
import { useSessionTimeout } from '@/hooks/useSessionTimeout'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<any>(null)
  const [plan, setPlan] = useState<any>(null)
  const [connectionsCount, setConnectionsCount] = useState(0)
  const [recommendationsCount, setRecommendationsCount] = useState(0)
  const [onboardingData, setOnboardingData] = useState<any>(null)
  const [activeSection, setActiveSection] = useState<'dashboard' | 'usage' | 'spending' | 'billing'>('dashboard')

  // Enable session timeout (1 hour inactivity)
  useSessionTimeout()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser) {
        router.push('/auth/login')
        return
      }

      setUser(currentUser)

      // Fetch subscription
      const { data: subData } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', currentUser.id)
        .single()

      setSubscription(subData)

      // Fetch plan details if subscription exists
      if (subData?.plan_name) {
        const { data: planData } = await supabase
          .from('pricing_plans')
          .select('*')
          .eq('name', subData.plan_name)
          .single()

        if (planData) {
          setPlan(planData)
        }
      }

      // Fetch connections count
      const { count: connectionsCountData } = await supabase
        .from('data_connections')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUser.id)

      setConnectionsCount(connectionsCountData || 0)

      // Fetch recommendations count for current month
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      
      const { count: recommendationsCountData } = await supabase
        .from('recommendations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUser.id)
        .gte('created_at', startOfMonth.toISOString())

      setRecommendationsCount(recommendationsCountData || 0)

      // Fetch onboarding data for personalized recommendations
      const { data: onboardingData } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', currentUser.id)
        .single()

      setOnboardingData(onboardingData)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // Ensure page starts at top when dashboard loads or section changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeSection])

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

  // Determine if user should see upgrade button
  const shouldShowUpgrade = () => {
    if (!subscription) return true // Free trial users
    if (subscription.status === 'trial') return true // Still on trial
    if (plan?.name === 'Starter') return true // Starter plan users can upgrade
    return false
  }

  const getNextPlan = () => {
    if (!plan) return 'Pro'
    if (plan.name === 'Starter') return 'Pro'
    if (plan.name === 'Pro') return 'Enterprise'
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Dashboard Navigation Bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {shouldShowUpgrade() && (
                <Link
                  href="/dashboard/upgrade"
                  className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                >
                  Upgrade
                </Link>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/settings"
                className="text-text-secondary hover:text-primary transition-colors"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 text-primary rounded-lg hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50" style={{ minHeight: 'calc(100vh - 200px)' }}>
          {activeSection === 'dashboard' && (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
              {/* Welcome Section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">
                  Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}
                </h1>
                <p className="text-text-secondary">Here&apos;s your business intelligence dashboard</p>
              </div>

              {/* Subscription Status */}
              {subscription && (
                <div className="mb-8">
                  <SubscriptionStatus subscription={subscription} />
                </div>
              )}

              {/* Upgrade Notifications */}
              {subscription && plan && (() => {
                const limits = getPlanLimits(plan.features || [])
                const showConnectionsWarning = limits.connections !== null && connectionsCount >= limits.connections
                const showRecommendationsWarning = limits.recommendations !== null && recommendationsCount >= limits.recommendations

                if (!showConnectionsWarning && !showRecommendationsWarning) {
                  return null
                }

                return (
                  <>
                    {showConnectionsWarning && limits.connections !== null && (
                      <div className="mb-8">
                        <UpgradeNotification
                          limitType="connections"
                          currentCount={connectionsCount}
                          limit={limits.connections}
                          planName={plan.name}
                        />
                      </div>
                    )}
                    {showRecommendationsWarning && limits.recommendations !== null && (
                      <div className="mb-8">
                        <UpgradeNotification
                          limitType="recommendations"
                          currentCount={recommendationsCount}
                          limit={limits.recommendations}
                          planName={plan.name}
                        />
                      </div>
                    )}
                  </>
                )
              })()}

              {/* Data Connections */}
              <div className="mb-8">
                <DataConnections userId={user.id} />
              </div>

              {/* Decision Feed */}
              <div className="mb-8">
                <DecisionFeed userId={user.id} onboardingData={onboardingData} />
              </div>

              {/* AI Chatbot */}
              <div>
                <AIChatbot userName={user.user_metadata?.full_name || user.email?.split('@')[0] || 'there'} />
              </div>
            </div>
          )}

          {activeSection === 'usage' && (
            <UsageSection userId={user.id} plan={plan} subscription={subscription} />
          )}

          {activeSection === 'spending' && (
            <SpendingSection userId={user.id} />
          )}

          {activeSection === 'billing' && (
            <BillingSection userId={user.id} subscription={subscription} />
          )}
        </main>
      </div>
      
      <Footer />
    </div>
  )
}
