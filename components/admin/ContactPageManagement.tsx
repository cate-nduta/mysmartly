'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface ContactContent {
  id: string
  section_type: string
  title: string | null
  description: string | null
  content: any
  is_active: boolean
  updated_at: string
}

export default function ContactPageManagement() {
  const [sections, setSections] = useState<ContactContent[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<ContactContent | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: {} as any,
  })

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_page_content')
        .select('*')
        .order('section_type', { ascending: true })

      if (error) throw error
      setSections(data || [])
    } catch (error: any) {
      console.error('Error fetching contact content:', error)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (section: ContactContent) => {
    setEditingSection(section)
    setFormData({
      title: section.title || '',
      description: section.description || '',
      content: section.content || {},
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSection) return

    setMessage(null)

    try {
      const { error } = await supabase
        .from('contact_page_content')
        .update({
          title: formData.title,
          description: formData.description,
          content: formData.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingSection.id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Contact page content updated successfully!' })
      setEditingSection(null)
      await fetchSections()
    } catch (error: any) {
      console.error('Error saving contact content:', error)
      setMessage({ type: 'error', text: error.message })
    }
  }

  const getSectionFields = (sectionType: string) => {
    switch (sectionType) {
      case 'hero':
        return [
          { key: 'subtitle', label: 'Subtitle', type: 'text' },
        ]
      case 'office_info':
        return [
          { key: 'address', label: 'Address (e.g., 123 Smartly Lane, Innovation City, IC 12345)', type: 'text' },
          { key: 'email', label: 'Email', type: 'email' },
          { key: 'phone', label: 'Phone', type: 'text' },
        ]
      case 'support_info':
        return [
          { key: 'support_email', label: 'Support Email', type: 'email' },
          { key: 'sales_email', label: 'Sales Email (optional)', type: 'email' },
        ]
      default:
        return []
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading contact page content...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-primary">Contact Page Management</h2>
          <p className="text-text-secondary mt-2">Edit the content displayed on the Contact page</p>
        </div>
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

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} className="bg-white border border-gray-200 rounded-xl p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-primary capitalize mb-2">
                  {section.section_type.replace('_', ' ')}
                </h3>
                {editingSection?.id !== section.id && (
                  <p className="text-text-secondary">
                    {section.title && <strong>{section.title}</strong>}
                    {section.description && ` - ${section.description}`}
                  </p>
                )}
              </div>
              {editingSection?.id !== section.id && (
                <button
                  onClick={() => handleEdit(section)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded font-medium hover:bg-blue-200 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>

            {editingSection?.id === section.id && (
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-4">Content Fields</label>
                  <div className="space-y-4">
                    {getSectionFields(section.section_type).map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-primary mb-2">{field.label}</label>
                        {field.type === 'text' || field.type === 'email' ? (
                          <input
                            type={field.type}
                            value={formData.content[field.key] || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                content: { ...formData.content, [field.key]: e.target.value },
                              })
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        ) : (
                          <textarea
                            value={formData.content[field.key] || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                content: { ...formData.content, [field.key]: e.target.value },
                              })
                            }
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingSection(null)}
                    className="px-6 py-3 bg-gray-200 text-primary rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

