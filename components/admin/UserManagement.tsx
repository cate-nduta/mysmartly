'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Invoice {
  id: string
  invoice_number: string
  amount: number
  currency: string
  status: string
  created_at: string
  paid_at: string | null
}

interface User {
  id: string
  email: string | null
  created_at: string
  user_metadata: {
    full_name?: string
  }
  onboarding_completed: boolean
  goals: string[] | null
  business_name: string | null
  business_role: string | null
  other_role: string | null
  goals_year: number | null
  subscription_status: string | null
  account_active: boolean
  unpaid_invoices_count: number
  paid_invoices_count: number
  invoices: Invoice[]
  trial_expired?: boolean
  days_since_signup?: number
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [sendingEmailTo, setSendingEmailTo] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      // Get current session for auth
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      // Fetch users via API route (requires admin access)
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const { users: usersWithData } = await response.json()
      setUsers(usersWithData)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendUpgradeEmail = async (userId: string, userEmail: string) => {
    setSendingEmailTo(userId)

    try {
      // Get current session for auth
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      // Send upgrade email via API route
      const response = await fetch('/api/admin/send-upgrade-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, userEmail }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send email')
      }

      alert('Upgrade email sent successfully!')
    } catch (error: any) {
      console.error('Error sending upgrade email:', error)
      alert(`Failed to send email: ${error.message}`)
    } finally {
      setSendingEmailTo(null)
    }
  }

  const handleDeleteAccount = async (userId: string, userEmail: string) => {
    if (deleteConfirm !== userEmail) {
      alert('Please type the email address to confirm deletion')
      return
    }

    if (!confirm(`⚠️ WARNING: This will permanently delete the account for ${userEmail}. All data will be deleted EXCEPT invoices. The user will need to sign up again. Are you absolutely sure?`)) {
      return
    }

    setDeletingUserId(userId)

    try {
      // Get current session for auth
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      // Delete user via API route (requires admin access)
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, userEmail }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete account')
      }

      // Refresh user list
      await fetchUsers()
      setDeleteConfirm(null)
      alert('Account deleted successfully. Invoices have been preserved.')
    } catch (error: any) {
      console.error('Error deleting account:', error)
      alert(`Failed to delete account: ${error.message}`)
    } finally {
      setDeletingUserId(null)
    }
  }

  const filteredUsers = users.filter(user => {
    const email = user.email?.toLowerCase() || ''
    const name = user.user_metadata?.full_name?.toLowerCase() || ''
    const search = searchTerm.toLowerCase()
    return email.includes(search) || name.includes(search)
  })

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-text-secondary">Loading users...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2">User Management</h2>
        <p className="text-text-secondary">Manage user accounts. Deleting an account will remove all data except unpaid invoices.</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by email or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goals</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Onboarding</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoices</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Signed Up</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <>
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary font-medium">
                      {user.email || 'No email'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {user.user_metadata?.full_name || user.business_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {user.goals && user.goals.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.goals.slice(0, 2).map((goal, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {goal}
                            </span>
                          ))}
                          {user.goals.length > 2 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              +{user.goals.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.onboarding_completed ? (
                        <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full">Completed</span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.account_active ? (
                        <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full">Active</span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {user.subscription_status ? (
                        <span className="capitalize">{user.subscription_status}</span>
                      ) : user.trial_expired ? (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Free Trial Expired</span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Free</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col gap-1">
                        {user.unpaid_invoices_count > 0 && (
                          <span className="text-red-600 font-medium">Unpaid: {user.unpaid_invoices_count}</span>
                        )}
                        {user.paid_invoices_count > 0 && (
                          <span className="text-emerald-600">Paid: {user.paid_invoices_count}</span>
                        )}
                        {user.unpaid_invoices_count === 0 && user.paid_invoices_count === 0 && (
                          <span className="text-gray-400">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          {expandedUser === user.id ? 'Hide' : 'View'}
                        </button>
                        {user.trial_expired && (
                          <button
                            onClick={() => handleSendUpgradeEmail(user.id, user.email || '')}
                            disabled={sendingEmailTo === user.id}
                            className="px-3 py-1 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {sendingEmailTo === user.id ? 'Sending...' : 'Send Upgrade Email'}
                          </button>
                        )}
                        {deletingUserId === user.id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Type email"
                              value={deleteConfirm || ''}
                              onChange={(e) => setDeleteConfirm(e.target.value)}
                              className="px-3 py-1 text-sm border border-gray-300 rounded"
                            />
                            <button
                              onClick={() => handleDeleteAccount(user.id, user.email || '')}
                              disabled={deleteConfirm !== user.email}
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Confirm
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeletingUserId(user.id)}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedUser === user.id && (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          {/* User Details */}
                          <div>
                            <h4 className="font-semibold text-primary mb-2">User Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Business Name:</span>{' '}
                                <span className="font-medium">{user.business_name || 'Not provided'}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Business Role:</span>{' '}
                                <span className="font-medium">
                                  {user.business_role === 'other' ? user.other_role : user.business_role || 'Not provided'}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Goals Year:</span>{' '}
                                <span className="font-medium">{user.goals_year || 'Not provided'}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Full Name:</span>{' '}
                                <span className="font-medium">{user.user_metadata?.full_name || 'Not provided'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Goals */}
                          {user.goals && user.goals.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-primary mb-2">Business Goals</h4>
                              <div className="flex flex-wrap gap-2">
                                {user.goals.map((goal, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm">
                                    {goal}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Invoices */}
                          {user.invoices && user.invoices.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-primary mb-2">Invoices ({user.invoices.length})</h4>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-4 py-2 text-left">Invoice #</th>
                                      <th className="px-4 py-2 text-left">Amount</th>
                                      <th className="px-4 py-2 text-left">Status</th>
                                      <th className="px-4 py-2 text-left">Created</th>
                                      <th className="px-4 py-2 text-left">Paid</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {user.invoices.map((invoice: Invoice) => (
                                      <tr key={invoice.id}>
                                        <td className="px-4 py-2">{invoice.invoice_number}</td>
                                        <td className="px-4 py-2">
                                          {invoice.currency} {invoice.amount.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2">
                                          {invoice.status === 'paid' ? (
                                            <span className="px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full">Paid</span>
                                          ) : invoice.status === 'pending' ? (
                                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                                          ) : (
                                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">{invoice.status}</span>
                                          )}
                                        </td>
                                        <td className="px-4 py-2">
                                          {new Date(invoice.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2">
                                          {invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString() : '-'}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-6 text-center text-text-secondary">
            {searchTerm ? 'No users found matching your search.' : 'No users found.'}
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ Important:</strong> Deleting an account will permanently remove all user data including:
          connections, recommendations, usage tracking, subscriptions, and preferences. However, <strong>unpaid invoices will be preserved</strong> and will be reattached if the user signs up again with the same email.
        </p>
      </div>
    </div>
  )
}

