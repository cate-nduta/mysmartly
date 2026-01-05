'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface UpgradeNotificationProps {
  limitType: 'connections' | 'recommendations'
  currentCount: number
  limit: number
  planName: string
}

export default function UpgradeNotification({ 
  limitType, 
  currentCount, 
  limit,
  planName 
}: UpgradeNotificationProps) {
  const router = useRouter()
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const handleUpgrade = () => {
    router.push('/pricing')
  }

  const limitText = limitType === 'connections' 
    ? 'data connections' 
    : 'recommendations per month'

  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-accent to-emerald-600 rounded-xl shadow-lg text-white">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-bold">You&apos;ve reached your {planName} plan limit</h3>
          </div>
          <p className="mb-4 opacity-90">
            You&apos;ve used {currentCount} of {limit} {limitText}. Upgrade to a higher plan to continue using mySmartly without limits.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleUpgrade}
              className="px-6 py-3 bg-white text-accent rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Upgrade Plan
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="px-4 py-3 text-white hover:bg-white/20 rounded-lg font-medium transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="ml-4 text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}

