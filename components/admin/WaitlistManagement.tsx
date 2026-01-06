'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface WaitlistEntry {
  id: string
  email: string
  created_at: string
  features?: string[] | null
  integration_wish?: string | null
  custom_feature?: string | null
}

const featureLabels: Record<string, string> = {
  'cashflow': 'Predictive Cash Flow Alerts',
  'competitor': 'Competitor Price Monitoring',
  'profit-optimization': 'Profit Margin Optimization',
  'team-reports': 'Automated Team Performance Reports',
  'customer-health': 'Customer Health & Churn Predictor',
}

export default function WaitlistManagement() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [exporting, setExporting] = useState(false)
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setEntries(data || [])
    } catch (err: any) {
      console.error('Error fetching waitlist:', err)
      setError(err.message || 'Failed to load waitlist entries')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} from the waitlist?`)) {
      return
    }

    try {
      const { error: deleteError } = await supabase
        .from('waitlist')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      fetchEntries()
    } catch (err: any) {
      alert(err.message || 'Failed to delete entry')
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const csvContent = [
        ['Email', 'Date Joined', 'Features', 'Integration Wish', 'Custom Feature'].join(','),
        ...entries.map(entry => [
          entry.email,
          new Date(entry.created_at).toLocaleDateString(),
          entry.features?.join('; ') || '',
          entry.integration_wish || '',
          (entry.custom_feature || '').replace(/"/g, '""') // Escape quotes for CSV
        ].map(field => `"${field}"`).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `waitlist-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      alert('Failed to export CSV')
    } finally {
      setExporting(false)
    }
  }

  const filteredEntries = entries.filter(entry =>
    entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.integration_wish?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.custom_feature?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const hasFeedback = (entry: WaitlistEntry) => {
    return (entry.features && entry.features.length > 0) ||
           entry.integration_wish ||
           entry.custom_feature
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-text-secondary">Loading waitlist...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Waitlist Management</h2>
          <p className="text-text-secondary mt-1">
            {entries.length} {entries.length === 1 ? 'person' : 'people'} on the waitlist
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || entries.length === 0}
          className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by email, integration, or feedback..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                  Date Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider">
                  Feedback
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-primary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-secondary">
                    {searchTerm ? 'No entries found matching your search.' : 'No waitlist entries yet.'}
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <>
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-primary">{entry.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text-secondary">
                          {new Date(entry.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {hasFeedback(entry) ? (
                          <button
                            onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                            className="text-accent hover:text-emerald-600 text-sm font-medium flex items-center gap-1"
                          >
                            {expandedEntry === entry.id ? (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                                Hide Details
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                View Details
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-text-secondary text-sm">No feedback</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(entry.id, entry.email)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                    {expandedEntry === entry.id && hasFeedback(entry) && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            {entry.features && entry.features.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-primary mb-2">Features Selected:</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  {entry.features.map((feature, idx) => (
                                    <li key={idx} className="text-sm text-text-secondary">
                                      {featureLabels[feature] || feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {entry.integration_wish && (
                              <div>
                                <h4 className="font-semibold text-primary mb-1">Integration Wish:</h4>
                                <p className="text-sm text-text-secondary">{entry.integration_wish}</p>
                              </div>
                            )}
                            {entry.custom_feature && (
                              <div>
                                <h4 className="font-semibold text-primary mb-1">Custom Feature Request:</h4>
                                <p className="text-sm text-text-secondary whitespace-pre-wrap">{entry.custom_feature}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
