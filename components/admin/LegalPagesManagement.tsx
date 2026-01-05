'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RichTextEditor from './RichTextEditor'

interface LegalPage {
  id: string
  page_type: string
  title: string
  content: string
  last_updated: string
  updated_at: string
}

export default function LegalPagesManagement() {
  const [pages, setPages] = useState<LegalPage[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPage, setEditingPage] = useState<LegalPage | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_pages')
        .select('*')
        .order('page_type')

      if (error) throw error
      setPages(data || [])
    } catch (err: any) {
      console.error('Error fetching legal pages:', err)
      setMessage({ type: 'error', text: err.message || 'Failed to load legal pages' })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (page: LegalPage) => {
    setEditingPage(page)
    setMessage(null)
  }

  const handleCancel = () => {
    setEditingPage(null)
    setMessage(null)
  }

  const handleSave = async () => {
    if (!editingPage) return

    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase
        .from('legal_pages')
        .update({
          title: editingPage.title,
          content: editingPage.content,
          last_updated: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingPage.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Page updated successfully!' })
      setEditingPage(null)
      fetchPages()
    } catch (err: any) {
      console.error('Error saving legal page:', err)
      setMessage({ type: 'error', text: err.message || 'Failed to save page' })
    } finally {
      setSaving(false)
    }
  }

  const getPageTypeLabel = (pageType: string) => {
    switch (pageType) {
      case 'privacy':
        return 'Privacy Policy'
      case 'terms':
        return 'Terms of Service'
      case 'security':
        return 'Security & Compliance'
      default:
        return pageType
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-text-secondary">Loading legal pages...</p>
        </div>
      </div>
    )
  }

  if (editingPage) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <button
            onClick={handleCancel}
            className="mb-4 px-4 py-2 bg-gray-100 text-primary rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to List
          </button>
          <h2 className="text-2xl font-bold text-primary">
            Edit {getPageTypeLabel(editingPage.page_type)}
          </h2>
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

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Page Title
            </label>
            <input
              type="text"
              value={editingPage.title}
              onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Content (HTML)
            </label>
            <div className="border border-gray-300 rounded-lg">
              <RichTextEditor
                value={editingPage.content}
                onChange={(content) => setEditingPage({ ...editingPage, content })}
              />
            </div>
            <p className="mt-2 text-sm text-text-secondary">
              Use the rich text editor above to format your content. The content will be displayed on the {getPageTypeLabel(editingPage.page_type)} page. You can use HTML tags for advanced formatting if needed.
            </p>
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-accent hover:underline">View/Edit Raw HTML</summary>
              <textarea
                value={editingPage.content}
                onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm min-h-[200px] focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Enter HTML content here..."
              />
            </details>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-6 py-2 bg-gray-100 text-primary rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">Legal Pages Management</h2>
        <p className="text-text-secondary mt-1">
          Edit the content of your Privacy Policy, Terms of Service, and Security pages
        </p>
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

      <div className="grid gap-6">
        {pages.map((page) => (
          <div key={page.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {getPageTypeLabel(page.page_type)}
                </h3>
                <p className="text-text-secondary mb-2">
                  <strong>Title:</strong> {page.title}
                </p>
                <p className="text-sm text-text-secondary">
                  Last Updated: {new Date(page.last_updated).toLocaleDateString()}
                </p>
                <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-text-secondary max-h-32 overflow-y-auto">
                  <div className="line-clamp-3">
                    {page.content.replace(/<[^>]*>/g, '').substring(0, 200)}
                    {page.content.replace(/<[^>]*>/g, '').length > 200 && '...'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleEdit(page)}
                className="ml-4 px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors whitespace-nowrap"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

