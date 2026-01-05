'use client'

import { useState, useEffect } from 'react'
import Logo from './Logo'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Header() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check user once on mount, but don't show loading state to prevent twitching
    const checkUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        setUser(currentUser)
      } catch (error) {
        setUser(null)
      }
    }
    
    checkUser()
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-primary"
          >
            <Logo textColor="#1F2937" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/how-it-works"
              className={`transition-colors ${
                isActive('/how-it-works')
                  ? 'text-accent font-medium'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              How It Works
            </Link>
            <Link
              href="/solutions"
              className={`transition-colors ${
                pathname?.startsWith('/solutions')
                  ? 'text-accent font-medium'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              Solutions
            </Link>
            <Link
              href="/pricing"
              className={`transition-colors ${
                isActive('/pricing')
                  ? 'text-accent font-medium'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/resources"
              className={`transition-colors ${
                pathname?.startsWith('/resources')
                  ? 'text-accent font-medium'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              Resources
            </Link>
            <Link
              href="/about"
              className={`transition-colors ${
                isActive('/about')
                  ? 'text-accent font-medium'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`transition-colors ${
                isActive('/contact')
                  ? 'text-accent font-medium'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              Contact
            </Link>
            <Link
              href="/auth/login"
              className="p-2 text-text-secondary hover:text-primary transition-colors rounded-full hover:bg-gray-100"
              title={user ? 'Account' : 'Sign In / Sign Up'}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
          {/* Mobile menu button */}
          <button className="md:hidden text-text-secondary hover:text-primary">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  )
}
