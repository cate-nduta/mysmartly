'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { signInWithEmail, signUpWithEmail } from '@/lib/supabase-auth'
import Header from '@/components/Header'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

      // ============================================
      // ADMIN PAGE - ONLY CHECK ADMIN STATUS
      // This page is ONLY for admins
      // Users must be in admin_users table
      // ============================================
      
      // Check if user is admin (REQUIRED for /admin page)
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', currentUser.id)
        .eq('is_active', true)
        .single()

      if (adminError || !adminData) {
        // User is authenticated but not in admin_users table
        // This is an admin-only page - show access denied
        setError('Access denied. You do not have admin privileges. Please contact the system administrator to be added as an admin user.')
        setLoading(false)
        return
      }

      // Admin authenticated - user is in admin_users table
      setIsAdmin(true)
    } catch (error) {
      console.error('Error checking auth:', error)
      setError('Failed to verify authentication')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setError(null)

    try {
      let data: any
      
      if (isSignup) {
        // ============================================
        // ADMIN SIGNUP - Only on /admin page
        // ============================================
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          setLoginLoading(false)
          return
        }
        
        if (password.length < 8) {
          setError('Password must be at least 8 characters')
          setLoginLoading(false)
          return
        }

        const signUpData = await signUpWithEmail(email, password)
        if (signUpData.error) throw signUpData.error
        data = signUpData.data

        if (data.user) {
          // Update user metadata with full name
          await supabase.auth.updateUser({
            data: { full_name: fullName }
          })

          // Create user preferences
          await supabase
            .from('user_preferences')
            .insert([{ user_id: data.user.id }])

          // Add user to admin_users table (REQUIRED for admin access)
          const { error: adminError } = await supabase
            .from('admin_users')
            .insert([{
              user_id: data.user.id,
              email: email,
              is_active: true
            }])

          if (adminError) {
            console.error('Error adding admin user:', adminError)
            // Continue anyway - might already exist
          }

          // Admin authenticated - ALWAYS redirect to /admin dashboard
          window.location.reload()
          return
        }
      } else {
        // ============================================
        // ADMIN LOGIN - Only on /admin page
        // MUST check admin status
        // ALWAYS redirect to /admin dashboard
        // ============================================
        const signInData = await signInWithEmail(email, password)
        if (signInData.error) throw signInData.error
        data = signInData.data

        if (data.user) {
          // Check if user is admin (REQUIRED for /admin page)
          const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', data.user.id)
            .eq('is_active', true)
            .single()

          if (adminError || !adminData) {
            setError('Access denied. You do not have admin privileges. Please contact the system administrator to be added as an admin user.')
            setLoginLoading(false)
            // Sign out the user since they're not admin
            await supabase.auth.signOut()
            return
          }

          // Admin authenticated - ALWAYS redirect to /admin dashboard
          window.location.reload()
        }
      }
    } catch (err: any) {
      setError(err.message || (isSignup ? 'Failed to create account' : 'Failed to sign in'))
      setLoginLoading(false)
    }
  }



  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
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
              {isSignup ? 'Admin Sign Up' : 'Admin Login'}
            </h1>
            <p className="text-text-secondary mb-6 text-center">
              {isSignup 
                ? 'Create an admin account to access the admin dashboard'
                : 'Admin access only. Use your admin credentials to sign in.'}
            </p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4">
              {isSignup && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-primary mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Your full name"
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="admin@example.com"
                  required
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
                  placeholder={isSignup ? "Min. 8 characters" : "Enter your password"}
                  minLength={isSignup ? 8 : undefined}
                  required
                />
              </div>

              {isSignup && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full px-4 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading 
                  ? (isSignup ? 'Creating account...' : 'Signing in...') 
                  : (isSignup ? 'Sign Up' : 'Sign In')}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <button
                onClick={() => {
                  setIsSignup(!isSignup)
                  setError(null)
                  setPassword('')
                  setConfirmPassword('')
                  setFullName('')
                }}
                className="text-accent hover:underline font-medium"
              >
                {isSignup 
                  ? 'Already have an admin account? Sign in' 
                  : "Don't have an admin account? Sign up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <AdminDashboard onLogout={handleLogout} />
}
