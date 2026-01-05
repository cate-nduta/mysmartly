'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface EmailLog {
  id: string
  application_id: string | null
  recipient_email: string
  recipient_name: string | null
  email_type: string
  subject: string
  status: string
  error_message: string | null
  sent_at: string
  job_applications?: {
    full_name: string
    jobs?: {
      title: string
    }
  }
}

export default function EmailLogs() {
  const [logs, setLogs] = useState<EmailLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchLogs()
  }, [filter])

  const fetchLogs = async () => {
    try {
      let query = supabase
        .from('email_logs')
        .select(`
          *,
          job_applications (
            full_name,
            jobs (
              title
            )
          )
        `)
        .order('sent_at', { ascending: false })
        .limit(100)

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error } = await query
      if (error) throw error
      setLogs(data || [])
    } catch (error: any) {
      console.error('Error fetching email logs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading email logs...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary mb-2">Email Logs</h2>
        <p className="text-text-secondary">Track all emails sent to applicants</p>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-accent text-white'
              : 'bg-gray-100 text-primary hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('sent')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'sent'
              ? 'bg-accent text-white'
              : 'bg-gray-100 text-primary hover:bg-gray-200'
          }`}
        >
          Sent
        </button>
        <button
          onClick={() => setFilter('failed')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'failed'
              ? 'bg-accent text-white'
              : 'bg-gray-100 text-primary hover:bg-gray-200'
          }`}
        >
          Failed
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Sent At</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Recipient</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Subject</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Application</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-secondary">
                    No email logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {new Date(log.sent_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-primary">{log.recipient_name || 'N/A'}</div>
                        <div className="text-text-secondary">{log.recipient_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary capitalize">
                      {log.email_type.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      <div className="max-w-xs truncate" title={log.subject}>
                        {log.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          log.status === 'sent'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {log.status}
                      </span>
                      {log.error_message && (
                        <div className="text-xs text-red-600 mt-1 max-w-xs truncate" title={log.error_message}>
                          {log.error_message}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {log.job_applications?.full_name && (
                        <div>
                          <div>{log.job_applications.full_name}</div>
                          {log.job_applications.jobs?.title && (
                            <div className="text-xs text-gray-500">{log.job_applications.jobs.title}</div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

