'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const SESSION_TIMEOUT_MS = 60 * 60 * 1000 // 1 hour in milliseconds

export function useSessionTimeout() {
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef<number>(Date.now())
  const routerRef = useRef(router)

  // Keep router ref updated
  useEffect(() => {
    routerRef.current = router
  }, [router])

  useEffect(() => {
    const resetTimeout = () => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Update last activity time
      lastActivityRef.current = Date.now()

      // Set new timeout
      timeoutRef.current = setTimeout(async () => {
        // Check if user is still inactive
        const timeSinceLastActivity = Date.now() - lastActivityRef.current
        
        if (timeSinceLastActivity >= SESSION_TIMEOUT_MS) {
          // User has been inactive for 1 hour - log them out
          try {
            await supabase.auth.signOut()
            
            // Redirect to login page
            const currentPath = window.location.pathname
            if (currentPath.startsWith('/admin')) {
              routerRef.current.push('/admin')
            } else {
              routerRef.current.push('/auth/login?timeout=true')
            }
          } catch (error) {
            console.error('Error during auto-logout:', error)
          }
        }
      }, SESSION_TIMEOUT_MS)
    }

    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    const handleActivity = () => {
      resetTimeout()
    }

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // Initialize timeout
    resetTimeout()

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, []) // Empty dependency array - only run once on mount

  // Return reset function for manual reset if needed
  return {
    resetTimeout: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      lastActivityRef.current = Date.now()
    }
  }
}

