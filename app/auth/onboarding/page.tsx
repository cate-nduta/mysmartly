'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import OnboardingQuestionnaire from '@/components/OnboardingQuestionnaire'
import { supabase } from '@/lib/supabase'

export default function OnboardingPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [alreadyCompleted, setAlreadyCompleted] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Check if onboarding is already completed
      const { data: onboardingData } = await supabase
        .from('user_onboarding')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (onboardingData) {
        setAlreadyCompleted(true)
        // Redirect to dashboard after a moment
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
        return
      }

      setUserId(user.id)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = () => {
    router.push('/dashboard')
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

  if (alreadyCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary">You&apos;ve already completed onboarding. Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  if (!userId) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <OnboardingQuestionnaire userId={userId} onComplete={handleComplete} />
    </div>
  )
}

