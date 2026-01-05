'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Webinar {
  id: string
  slug: string
  title: string
  description: string | null
  presenter: string
  scheduled_date: string
  scheduled_time: string
  timezone: string
  duration_minutes: number
  registration_url: string | null
  recording_url: string | null
  status: string
  is_featured: boolean
  created_at: string
  updated_at: string
}

export default function WebinarsManagement() {
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingWebinar, setEditingWebinar] = useState<Webinar | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    description: '',
    presenter: '',
    scheduled_date: new Date().toISOString().split('T')[0],
    scheduled_time: '14:00',
    timezone: 'UTC',
    duration_minutes: 60,
    registration_url: '',
    recording_url: '',
    status: 'upcoming',
    is_featured: false,
  })

  useEffect(() => {
    fetchWebinars()
  }, [])

  const fetchWebinars = async () => {
    try {
      const { data, error } = await supabase
        .from('webinars')
        .select('*')
        .order('scheduled_date', { ascending: false })

      if (error) throw error
      setWebinars(data || [])
    } catch (error: any) {
      console.error('Error fetching webinars:', error)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleCreateNew = () => {
    setEditingWebinar(null)
    setFormData({
      slug: '',
      title: '',
      description: '',
      presenter: '',
      scheduled_date: new Date().toISOString().split('T')[0],
      scheduled_time: '14:00',
      timezone: 'UTC',
      duration_minutes: 60,
      registration_url: '',
      recording_url: '',
      status: 'upcoming',
      is_featured: false,
    })
    setShowForm(true)
    setMessage(null)
  }

  const handleEdit = (webinar: Webinar) => {
    setEditingWebinar(webinar)
    setFormData({
      slug: webinar.slug,
      title: webinar.title,
      description: webinar.description || '',
      presenter: webinar.presenter,
      scheduled_date: webinar.scheduled_date,
      scheduled_time: webinar.scheduled_time,
      timezone: webinar.timezone,
      duration_minutes: webinar.duration_minutes,
      registration_url: webinar.registration_url || '',
      recording_url: webinar.recording_url || '',
      status: webinar.status,
      is_featured: webinar.is_featured,
    })
    setShowForm(true)
    setMessage(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    try {
      const finalSlug = formData.slug || generateSlug(formData.title)
      
      if (!finalSlug) {
        setMessage({ type: 'error', text: 'Slug is required' })
        return
      }

      const webinarData = {
        ...formData,
        slug: finalSlug,
        description: formData.description || null,
        registration_url: formData.registration_url || null,
        recording_url: formData.recording_url || null,
        updated_at: new Date().toISOString(),
      }

      if (editingWebinar) {
        const { error } = await supabase
          .from('webinars')
          .update(webinarData)
          .eq('id', editingWebinar.id)

        if (error) throw error
        setMessage({ type: 'success', text: 'Webinar updated successfully!' })
      } else {
        const { error } = await supabase
          .from('webinars')
          .insert([webinarData])

        if (error) throw error
        setMessage({ type: 'success', text: 'Webinar created successfully!' })
      }

      setShowForm(false)
      await fetchWebinars()
    } catch (error: any) {
      console.error('Error saving webinar:', error)
      setMessage({ type: 'error', text: error.message })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this webinar?')) return

    try {
      const { error } = await supabase
        .from('webinars')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Webinar deleted successfully!' })
      await fetchWebinars()
    } catch (error: any) {
      console.error('Error deleting webinar:', error)
      setMessage({ type: 'error', text: error.message })
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading webinars...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Webinars</h2>
          <p className="text-text-secondary mt-2">Manage your webinars and events</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
        >
          + New Webinar
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="mb-8 bg-white border border-gray-200 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-primary mb-6">
            {editingWebinar ? 'Edit Webinar' : 'Create New Webinar'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value })
                    if (!editingWebinar && !formData.slug) {
                      setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Presenter *
                </label>
                <input
                  type="text"
                  value={formData.presenter}
                  onChange={(e) => setFormData({ ...formData, presenter: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Scheduled Date *
                </label>
                <input
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Scheduled Time *
                </label>
                <input
                  type="time"
                  value={formData.scheduled_time}
                  onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Timezone
                </label>
                <input
                  type="text"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="UTC, America/New_York, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="recorded">Recorded</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Registration URL
                </label>
                <input
                  type="url"
                  value={formData.registration_url}
                  onChange={(e) => setFormData({ ...formData, registration_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Recording URL
                </label>
                <input
                  type="url"
                  value={formData.recording_url}
                  onChange={(e) => setFormData({ ...formData, recording_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 text-accent rounded focus:ring-accent"
                />
                <span className="text-sm font-medium text-primary">Featured</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
              >
                {editingWebinar ? 'Update Webinar' : 'Create Webinar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingWebinar(null)
                  setMessage(null)
                }}
                className="px-6 py-3 bg-gray-200 text-primary rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Presenter</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Date & Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {webinars.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-text-secondary">
                    No webinars found. Create your first webinar!
                  </td>
                </tr>
              ) : (
                webinars.map((webinar) => (
                  <tr key={webinar.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-primary">{webinar.title}</div>
                      {webinar.is_featured && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{webinar.presenter}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {new Date(webinar.scheduled_date).toLocaleDateString()} at {webinar.scheduled_time}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          webinar.status === 'upcoming'
                            ? 'bg-blue-100 text-blue-800'
                            : webinar.status === 'live'
                            ? 'bg-green-100 text-green-800'
                            : webinar.status === 'recorded'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {webinar.status.charAt(0).toUpperCase() + webinar.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(webinar)}
                          className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded font-medium hover:bg-blue-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(webinar.id)}
                          className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded font-medium hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
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

