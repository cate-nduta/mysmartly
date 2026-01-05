'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { signInWithEmail } from '@/lib/supabase-auth'
import Header from '@/components/Header'
import AdminDashboard from '@/components/admin/AdminDashboard'
import { useSessionTimeout } from '@/hooks/useSessionTimeout'

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Enable session timeout (1 hour inactivity) - only when logged in
  useSessionTimeout()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser) {
        setLoading(false)
        return
      }

      setUser(currentUser)

      // Check if user is admin (REQUIRED for /admin page)
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('is_active', true)
        .single()

      if (adminError || !adminData) {
        // User is authenticated but not in admin_users table
        setError('Access denied. You do not have admin privileges.')
        setLoading(false)
        return
      }

      // Admin authenticated
      setIsAdmin(true)
    } catch (error) {
      console.error('Error checking auth:', error)
      setError('Failed to verify authentication')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setError(null)

    try {
      if (!username || !password) {
        setError('Please enter both username/email and password')
        setLoginLoading(false)
        return
      }

      const loginValue = username.toLowerCase().trim()
      const isEmail = loginValue.includes('@')

      // Lookup admin user by username OR email
      let adminUser = null
      let lookupError = null

      if (isEmail) {
        // Try to find by email
        const { data, error } = await supabase
          .from('admin_users')
          .select('email, username, is_active')
          .eq('email', loginValue)
          .eq('is_active', true)
          .single()
        adminUser = data
        lookupError = error
      } else {
        // Try to find by username
        const { data, error } = await supabase
          .from('admin_users')
          .select('email, username, is_active')
          .eq('username', loginValue)
          .eq('is_active', true)
          .single()
        adminUser = data
        lookupError = error
      }

      if (lookupError || !adminUser) {
        console.error('Lookup error:', lookupError)
        setError('Invalid username/email or password. Please check your credentials and try again.')
        setLoginLoading(false)
        return
      }

      // Use the email from admin_users table for Supabase auth
      const signInData = await signInWithEmail(adminUser.email, password)
      if (signInData.error) {
        console.error('Sign in error:', signInData.error)
        if (signInData.error.message?.includes('Invalid login credentials')) {
          setError('Invalid password. Please check your password and try again.')
        } else {
          setError(signInData.error.message || 'Invalid username/email or password. Please check your credentials and try again.')
        }
        setLoginLoading(false)
        return
      }

      if (signInData.data?.user) {
        // Check if user is admin (REQUIRED for /admin page)
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', signInData.data.user.id)
          .eq('is_active', true)
          .single()

        if (adminError || !adminData) {
          console.error('Admin check error:', adminError)
          setError('Admin account not found. Please contact the system administrator.')
          setLoginLoading(false)
          await supabase.auth.signOut()
          return
        }

        // Admin authenticated - update state to show dashboard
        console.log('✅ Login successful, redirecting to dashboard...')
        setUsername('')
        setPassword('')
        setError(null)
        setLoginLoading(false)
        
        // Set user and admin state - this will trigger dashboard display
        setUser(signInData.data.user)
        setIsAdmin(true)
        setLoading(false)
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Failed to sign in')
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      // Clear state immediately
      setUser(null)
      setIsAdmin(false)
      setUsername('')
      setPassword('')
      setError(null)
      
      // Clear any session/local storage
      if (typeof window !== 'undefined') {
        sessionStorage.clear()
        localStorage.removeItem('supabase.auth.token')
      }
      
      // Sign out from Supabase
      await supabase.auth.signOut()
      
      // Small delay to ensure signOut completes
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Force full page reload to reset everything
      window.location.href = '/admin'
    } catch (error) {
      console.error('Logout error:', error)
      // Even if there's an error, still redirect and clear storage
      if (typeof window !== 'undefined') {
        sessionStorage.clear()
        window.location.href = '/admin'
      }
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

  // Show login if not authenticated or not admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center px-4 py-12 min-h-[calc(100vh-80px)]">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-primary mb-2 text-center">
              Admin Login
            </h1>
            <p className="text-text-secondary mb-6 text-center">
              Admin access only. Use your admin credentials to sign in.
            </p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-primary mb-2">
                  Username or Email
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Enter your username or email"
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full px-4 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return <AdminDashboard onLogout={handleLogout} />
}
