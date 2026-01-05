'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface BillingSectionProps {
  userId: string
  subscription: any
}

export default function BillingSection({ userId, subscription }: BillingSectionProps) {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [upcomingInvoice, setUpcomingInvoice] = useState<any>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchInvoices()
    calculateUpcomingInvoice()
  }, [userId, subscription])

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Separate pending on-demand invoices
      const pendingOnDemand = (data || []).filter(
        inv => inv.invoice_type === 'on-demand' && inv.status === 'pending'
      )
      
      setInvoices(data || [])
      
      // If there are pending on-demand invoices, show them prominently
      if (pendingOnDemand.length > 0) {
        setUpcomingInvoice({
          ...pendingOnDemand[0],
          isOnDemand: true,
          requiresPayment: true,
        })
      }
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateUpcomingInvoice = () => {
    if (!subscription || !subscription.current_period_end) return

    const periodEnd = new Date(subscription.current_period_end)
    const now = new Date()

    if (periodEnd > now) {
      setUpcomingInvoice({
        due_date: periodEnd.toISOString().split('T')[0],
        amount: subscription.plan_price || 0,
        description: `Subscription renewal for ${subscription.plan_name} plan`,
      })
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleCancelSubscription = async () => {
    if (!subscription) return

    setCancelling(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)

      if (error) throw error

      setMessage({ 
        type: 'success', 
        text: 'Your subscription has been cancelled. You will continue to have access until the end of your current billing period.' 
      })
      setShowCancelModal(false)
      
      // Refresh the page after a short delay to show updated status
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error: any) {
      console.error('Error cancelling subscription:', error)
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to cancel subscription. Please try again or contact support.' 
      })
    } finally {
      setCancelling(false)
    }
  }

  const isActiveSubscription = subscription && (subscription.status === 'active' || subscription.status === 'trial')
  const isCancelled = subscription && subscription.status === 'cancelled'

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-text-secondary">Loading billing information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2">Billing & Invoices</h2>
          <p className="text-text-secondary">
            View your payment history and upcoming invoices
          </p>
        </div>
        {isActiveSubscription && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="px-4 py-2 text-red-600 border border-red-300 rounded-lg font-medium hover:bg-red-50 transition-colors"
          >
            Cancel Subscription
          </button>
        )}
        {isCancelled && (
          <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium">
            Subscription Cancelled
          </div>
        )}
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Upcoming Invoice / Pending On-Demand Invoice */}
      {upcomingInvoice && (
        <div className={`mb-6 rounded-lg p-6 ${
          upcomingInvoice.requiresPayment 
            ? 'bg-red-50 border-2 border-red-300' 
            : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">
              {upcomingInvoice.requiresPayment ? '⚠️ Payment Required' : 'Upcoming Invoice'}
            </h3>
            {upcomingInvoice.requiresPayment && (
              <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-medium">
                Action Required
              </span>
            )}
          </div>
          {upcomingInvoice.isOnDemand && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-sm text-yellow-900">
                <strong>On-Demand Invoice:</strong> This invoice must be paid before your subscription can renew. 
                Your subscription will not renew until this invoice is paid.
              </p>
            </div>
          )}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-text-secondary mb-1">Due Date</p>
              <p className="font-semibold text-primary">
                {upcomingInvoice.due_date 
                  ? new Date(upcomingInvoice.due_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Amount</p>
              <p className="font-semibold text-primary">{formatCurrency(upcomingInvoice.amount)}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Description</p>
              <p className="font-semibold text-primary">{upcomingInvoice.description}</p>
            </div>
          </div>
          {upcomingInvoice.requiresPayment && (
            <div className="mt-4">
              <Link
                href={`/dashboard/checkout?invoice=${upcomingInvoice.id || 'pending'}`}
                className="inline-block px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
              >
                Pay Invoice Now
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Invoices List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-primary">Payment History</h3>
        </div>

        {invoices.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-text-secondary">No invoices found</p>
            <p className="text-sm text-text-secondary mt-2">
              Your payment history will appear here once you make a payment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-primary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary">{invoice.invoice_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-secondary">
                        {new Date(invoice.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-primary">
                        {formatCurrency(invoice.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-secondary">
                        {invoice.invoice_type === 'subscription' ? 'Subscription' : 'On-Demand'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {invoice.receipt_url && (
                        <a
                          href={invoice.receipt_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-emerald-600 transition-colors"
                        >
                          View Receipt
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-text-secondary">
          <strong>Note:</strong> Invoices are automatically generated when payments are processed through Paystack. 
          If you need a copy of an invoice, you can download it from the receipt link above.
        </p>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-primary mb-4">Cancel Subscription</h3>
            <p className="text-text-secondary mb-6">
              Are you sure you want to cancel your subscription? You will continue to have access to all features until{' '}
              <strong>
                {subscription?.current_period_end 
                  ? new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'the end of your billing period'}
              </strong>.
            </p>
            <p className="text-sm text-text-secondary mb-6">
              After that date, your subscription will end and you will lose access to your account. You can reactivate your subscription at any time before the end date.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={cancelling}
                className="flex-1 px-4 py-3 bg-gray-100 text-primary rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Subscription'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

