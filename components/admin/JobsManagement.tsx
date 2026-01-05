'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string[]
  salary: number | null
  is_active: boolean
  created_at: string
}

export default function JobsManagement() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        if (fetchError.message?.includes('Invalid API key') || fetchError.message?.includes('JWT')) {
          setError('Supabase is not configured correctly. Please check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local file.')
        } else {
          throw fetchError
        }
        return
      }
      
      setJobs(data || [])
    } catch (error: any) {
      console.error('Error fetching jobs:', error)
      if (error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
        setError('Failed to connect to Supabase. Please check your configuration and restart the server.')
      } else {
        setError(error.message || 'Failed to load jobs. Please check your Supabase configuration.')
      }
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return

    try {
      const { error } = await supabase.from('jobs').delete().eq('id', id)
      if (error) throw error
      setMessage({ type: 'success', text: 'Job deleted successfully' })
      fetchJobs()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
    }
  }

  const handleSave = async (job: Partial<Job>) => {
    try {
      if (editingJob) {
        const { error } = await supabase
          .from('jobs')
          .update({ ...job, updated_at: new Date().toISOString() })
          .eq('id', editingJob.id)
        if (error) throw error
        setMessage({ type: 'success', text: 'Job updated successfully' })
      } else {
        const { error } = await supabase.from('jobs').insert([job])
        if (error) throw error
        setMessage({ type: 'success', text: 'Job created successfully' })
      }
      setShowForm(false)
      setEditingJob(null)
      fetchJobs()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message })
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
        <h2 className="text-2xl font-bold text-primary">Manage Job Listings</h2>
        <button
          onClick={() => {
            setEditingJob(null)
            setShowForm(true)
          }}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Add New Job
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <JobForm
          job={editingJob}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingJob(null)
          }}
        />
      )}

      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-primary">{job.title}</h3>
                  {!job.is_active && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Inactive</span>
                  )}
                </div>
                <p className="text-text-secondary mb-2">
                  {job.department} • {job.location} • {job.type}
                  {job.salary && (
                    <span> • ${job.salary.toLocaleString('en-US')}</span>
                  )}
                </p>
                <p className="text-text-secondary text-sm">{job.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingJob(job)
                    setShowForm(true)
                  }}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function JobForm({ job, onSave, onCancel }: { job: Job | null; onSave: (job: Partial<Job>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    department: job?.department || '',
    location: job?.location || '',
    type: job?.type || 'Full-time',
    description: job?.description || '',
    requirements: job?.requirements?.join('\n') || '',
    salary: job?.salary?.toString() || '',
    is_active: job?.is_active !== undefined ? job.is_active : true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      requirements: formData.requirements.split('\n').filter(r => r.trim() !== ''),
      salary: formData.salary ? parseFloat(formData.salary) : null,
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-xl font-bold text-primary mb-4">{job ? 'Edit Job' : 'Add New Job'}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Department *</label>
            <input
              type="text"
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Location *</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Type *</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Description *</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Salary (USD)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">$</span>
            <input
              type="number"
              min="0"
              step="1000"
              placeholder="e.g., 75000"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <p className="text-xs text-text-secondary mt-1">Optional - Annual salary in USD</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">Requirements (one per line)</label>
          <textarea
            rows={6}
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-accent focus:ring-accent"
            />
            <span className="text-sm font-medium text-primary">Active</span>
          </label>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            {job ? 'Update Job' : 'Create Job'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-100 text-primary rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
