'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import RichTextEditor from './RichTextEditor'

interface CaseStudy {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  author: string
  published_date: string
  read_time: string
  category: string
  company_name: string | null
  industry: string | null
  results: any
  is_published: boolean
  created_at: string
  updated_at: string
}

export default function CaseStudiesManagement() {
  const [studies, setStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingStudy, setEditingStudy] = useState<CaseStudy | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    author: 'mySmartly Team',
    published_date: new Date().toISOString().split('T')[0],
    read_time: '10 min read',
    category: 'Case Study',
    company_name: '',
    industry: '',
    results: '{}',
    is_published: true,
  })

  useEffect(() => {
    fetchStudies()
  }, [])

  const fetchStudies = async () => {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('published_date', { ascending: false })

      if (error) throw error
      setStudies(data || [])
    } catch (error: any) {
      console.error('Error fetching case studies:', error)
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
    setEditingStudy(null)
    setFormData({
      slug: '',
      title: '',
      excerpt: '',
      content: '',
      author: 'mySmartly Team',
      published_date: new Date().toISOString().split('T')[0],
      read_time: '10 min read',
      category: 'Case Study',
      company_name: '',
      industry: '',
      results: '{}',
      is_published: true,
    })
    setShowForm(true)
    setMessage(null)
  }

  const handleEdit = (study: CaseStudy) => {
    setEditingStudy(study)
    setFormData({
      slug: study.slug,
      title: study.title,
      excerpt: study.excerpt || '',
      content: study.content,
      author: study.author,
      published_date: study.published_date,
      read_time: study.read_time,
      category: study.category,
      company_name: study.company_name || '',
      industry: study.industry || '',
      results: JSON.stringify(study.results || {}, null, 2),
      is_published: study.is_published,
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

      let resultsJson
      try {
        resultsJson = JSON.parse(formData.results)
      } catch {
        setMessage({ type: 'error', text: 'Results must be valid JSON' })
        return
      }

      const studyData = {
        ...formData,
        slug: finalSlug,
        company_name: formData.company_name || null,
        industry: formData.industry || null,
        results: resultsJson,
        updated_at: new Date().toISOString(),
      }

      if (editingStudy) {
        const { error } = await supabase
          .from('case_studies')
          .update(studyData)
          .eq('id', editingStudy.id)

        if (error) throw error
        setMessage({ type: 'success', text: 'Case study updated successfully!' })
      } else {
        const { error } = await supabase
          .from('case_studies')
          .insert([studyData])

        if (error) throw error
        setMessage({ type: 'success', text: 'Case study created successfully!' })
      }

      setShowForm(false)
      await fetchStudies()
    } catch (error: any) {
      console.error('Error saving case study:', error)
      setMessage({ type: 'error', text: error.message })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case study?')) return

    try {
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Case study deleted successfully!' })
      await fetchStudies()
    } catch (error: any) {
      console.error('Error deleting case study:', error)
      setMessage({ type: 'error', text: error.message })
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading case studies...</div>
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Case Studies</h2>
          <p className="text-text-secondary mt-2">Manage your case studies</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
        >
          + New Case Study
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
            {editingStudy ? 'Edit Case Study' : 'Create New Case Study'}
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
                    if (!editingStudy && !formData.slug) {
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

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Company XYZ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="SaaS, E-commerce, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Content *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Start writing your case study..."
              />
              <p className="text-xs text-text-secondary mt-2">
                Use the toolbar above to format your text (bold, italic, headings, lists, etc.)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Results (JSON) *
              </label>
              <textarea
                value={formData.results}
                onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent font-mono text-sm"
                rows={6}
                required
                placeholder='{"profit_increase": "34%", "time_saved": "40%", "churn_reduction": "25%"}'
              />
              <p className="text-xs text-text-secondary mt-2">
                Enter results as JSON object (e.g., {`{"profit_increase": "34%", "time_saved": "40%"}`})
              </p>
            </div>

            <div className="grid grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Published Date
                </label>
                <input
                  type="date"
                  value={formData.published_date}
                  onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Read Time
                </label>
                <input
                  type="text"
                  value={formData.read_time}
                  onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 text-accent rounded focus:ring-accent"
                />
                <span className="text-sm font-medium text-primary">Published</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
              >
                {editingStudy ? 'Update Case Study' : 'Create Case Study'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingStudy(null)
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Company</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Published Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-text-secondary">
                    No case studies found. Create your first case study!
                  </td>
                </tr>
              ) : (
                studies.map((study) => (
                  <tr key={study.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-primary">{study.title}</div>
                      <div className="text-sm text-text-secondary">{study.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{study.company_name || '-'}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {new Date(study.published_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          study.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {study.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(study)}
                          className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded font-medium hover:bg-blue-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(study.id)}
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

