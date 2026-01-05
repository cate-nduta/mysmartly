'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Job {
  id: string
  title: string
  department: string
}

export default function JobApplicationForm({ jobId }: { jobId: string }) {
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    cover_letter: '',
    resume: null as File | null,
  })

  useEffect(() => {
    fetchJob()
  }, [jobId])

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, department')
        .eq('id', jobId)
        .single()

      if (error) throw error
      setJob(data)
    } catch (error) {
      console.error('Error fetching job:', error)
      setMessage({ type: 'error', text: 'Job not found' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)

    try {
      let resumeUrl = null

      // Upload resume if provided
      if (formData.resume) {
        const fileExt = formData.resume.name.split('.').pop()
        const fileName = `${jobId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, formData.resume, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        // Get the public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from('resumes')
          .getPublicUrl(fileName)

        resumeUrl = urlData.publicUrl
      }

      // Submit application
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone || null,
          cover_letter: formData.cover_letter || null,
          resume_url: resumeUrl,
        })

      if (error) throw error

      setMessage({ type: 'success', text: 'Application submitted successfully! We\'ll be in touch soon.' })
      setTimeout(() => {
        router.push('/careers')
      }, 2000)
    } catch (error: any) {
      console.error('Error submitting application:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to submit application. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!job) {
    return <div className="text-center py-12 text-red-600">Job not found</div>
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 md:p-12">
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-primary mb-2">{job.title}</h2>
        <p className="text-text-secondary">{job.department}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-primary mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="full_name"
            required
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-primary mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-primary mb-2">
            Resume/CV * (PDF, DOC, DOCX - Max 5MB)
          </label>
          <input
            type="file"
            id="resume"
            required
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file && file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB')
                return
              }
              setFormData({ ...formData, resume: file || null })
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="cover_letter" className="block text-sm font-medium text-primary mb-2">
            Cover Letter
          </label>
          <textarea
            id="cover_letter"
            rows={6}
            value={formData.cover_letter}
            onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Tell us why you're interested in this position and what makes you a great fit..."
          />
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 bg-gray-100 text-primary rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
