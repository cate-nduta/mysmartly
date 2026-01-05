'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Application {
  id: string
  job_id: string
  full_name: string
  email: string
  phone: string | null
  cover_letter: string | null
  resume_url: string | null
  status: string
  created_at: string
  jobs?: {
    title: string
    department: string
  }
}

export default function ApplicationsManagement() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sendingEmail, setSendingEmail] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [filter])

  const fetchApplications = async () => {
    try {
      let query = supabase
        .from('job_applications')
        .select(`
          *,
          jobs (
            title,
            department
          )
        `)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data, error: fetchError } = await query
      if (fetchError) {
        if (fetchError.message?.includes('Invalid API key') || fetchError.message?.includes('JWT')) {
          setError('Supabase is not configured correctly. Please check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local file.')
        } else {
          throw fetchError
        }
        return
      }
      
      setApplications(data || [])
    } catch (error: any) {
      console.error('Error fetching applications:', error)
      if (error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
        setError('Failed to connect to Supabase. Please check your configuration and restart the server.')
      } else {
        setError(error.message || 'Failed to load applications. Please check your Supabase configuration.')
      }
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Status updated successfully' })
      fetchApplications()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  const sendInterviewInvitation = async (application: Application) => {
    if (!confirm(`Send interview invitation email to ${application.full_name}?`)) return

    setSendingEmail(application.id)
    setMessage(null)
    
    try {
      const jobTitle = application.jobs?.title || 'Position'

      // Send email via API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: application.id,
          emailType: 'interview_invitation',
          recipientEmail: application.email,
          recipientName: application.full_name,
          jobTitle: jobTitle,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email')
      }

      // Update status to reviewed
      await updateStatus(application.id, 'reviewed')
      setMessage({ type: 'success', text: `Interview invitation email sent successfully to ${application.email}` })
    } catch (error: any) {
      console.error('Error sending interview invitation:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to send interview invitation email' })
    } finally {
      setSendingEmail(null)
    }
  }

  const sendRejectionEmail = async (application: Application) => {
    if (!confirm('Send rejection email to this applicant?')) return

    setSendingEmail(application.id)
    try {
      const jobTitle = application.jobs?.title || 'the position'
      const subject = `Update on Your Application - ${jobTitle} at mySmartly`
      const body = `Dear ${application.full_name},

Thank you for your interest in the ${jobTitle} position at mySmartly and for taking the time to apply.

After careful consideration, we are sorry to inform you that we have decided to move forward with other candidates whose qualifications more closely match our current needs.

We appreciate your interest in mySmartly and encourage you to apply for future positions that may be a better fit for your skills and experience.

We wish you the best in your job search.

Best regards,
mySmartly Team`

      // Open email client with pre-filled email
      const mailtoLink = `mailto:${application.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.open(mailtoLink)

      // Update status to rejected
      await updateStatus(application.id, 'rejected')
      setMessage({ type: 'success', text: 'Rejection email opened in your email client' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to send rejection email' })
    } finally {
      setSendingEmail(null)
    }
  }

  const getResumeDownloadUrl = async (resumeUrl: string | null) => {
    if (!resumeUrl) return null
    
    try {
      // If it's already a full URL, check if it's a Supabase storage URL
      if (resumeUrl.startsWith('http')) {
        // Extract the file path from the URL
        // Format: https://project.supabase.co/storage/v1/object/public/resumes/path/to/file.pdf
        // Or: https://project.supabase.co/storage/v1/object/sign/resumes/path/to/file.pdf
        const urlParts = resumeUrl.split('/resumes/')
        if (urlParts.length > 1) {
          const filePath = urlParts[1]
          // Get a signed URL that works for private buckets, or use public URL for public buckets
          const { data, error } = await supabase.storage
            .from('resumes')
            .createSignedUrl(filePath, 3600) // Valid for 1 hour
          
          if (error) {
            // If signed URL fails, try public URL
            const { data: publicData } = supabase.storage
              .from('resumes')
              .getPublicUrl(filePath)
            return publicData.publicUrl
          }
          
          return data?.signedUrl || resumeUrl
        }
        return resumeUrl
      }
      
      // If it's just a path, get the URL
      const { data: publicData } = supabase.storage
        .from('resumes')
        .getPublicUrl(resumeUrl)
      
      return publicData.publicUrl
    } catch (error) {
      console.error('Error getting resume URL:', error)
      return resumeUrl // Fallback to original URL
    }
  }

  const handleViewResume = async (resumeUrl: string | null) => {
    if (!resumeUrl) return
    
    const url = await getResumeDownloadUrl(resumeUrl)
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      setMessage({ type: 'error', text: 'Unable to load resume. Please check storage configuration.' })
    }
  }

  if (loading) return <div>Loading...</div>

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Configuration Error</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <p className="text-sm text-red-600 mb-2">
          Make sure you have:
        </p>
        <ul className="text-sm text-red-600 list-disc list-inside mb-4">
          <li>Created a <code className="bg-red-100 px-2 py-1 rounded">.env.local</code> file with your Supabase credentials</li>
          <li>Restarted your development server after creating/updating .env.local</li>
        </ul>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Job Applications</h2>
        <div className="flex gap-2">
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
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'pending'
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-primary hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('reviewed')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'reviewed'
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-primary hover:bg-gray-200'
            }`}
          >
            Reviewed
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === 'rejected'
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-primary hover:bg-gray-200'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {applications.map((application) => (
          <div key={application.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary mb-2">{application.full_name}</h3>
                <p className="text-text-secondary mb-2">
                  {application.jobs?.title} • {application.jobs?.department}
                </p>
                <div className="space-y-1 text-sm text-text-secondary">
                  <p>Email: {application.email}</p>
                  {application.phone && <p>Phone: {application.phone}</p>}
                  <p>Applied: {new Date(application.created_at).toLocaleDateString()}</p>
                </div>
                {application.cover_letter && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-primary mb-2">Cover Letter:</p>
                    <p className="text-sm text-text-secondary whitespace-pre-wrap">{application.cover_letter}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
                {application.resume_url && (
                  <button
                    onClick={() => handleViewResume(application.resume_url)}
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
                  >
                    View Resume
                  </button>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => sendInterviewInvitation(application)}
                    disabled={sendingEmail === application.id}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingEmail === application.id ? 'Sending...' : 'Send Interview Invitation'}
                  </button>
                  <button
                    onClick={() => sendRejectionEmail(application)}
                    disabled={sendingEmail === application.id}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingEmail === application.id ? 'Sending...' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {applications.length === 0 && (
          <div className="text-center py-12 text-text-secondary">
            No applications found
          </div>
        )}
      </div>
    </div>
  )
}
