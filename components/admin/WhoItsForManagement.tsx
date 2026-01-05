'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface WhoItsForContent {
  id: string
  section_type: 'positive' | 'negative'
  title: string
  items: string[]
  description: string
  is_active: boolean
}

export default function WhoItsForManagement() {
  const [content, setContent] = useState<WhoItsForContent[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSection, setEditingSection] = useState<WhoItsForContent | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('who_its_for_content')
        .select('*')
        .order('section_type', { ascending: true })

      if (fetchError) {
        if (fetchError.message?.includes('Invalid API key') || fetchError.message?.includes('JWT')) {
          setError('Supabase is not configured correctly. Please check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local file.')
        } else {
          throw fetchError
        }
        return
      }

      // Parse JSONB items array
      const parsedData = (data || []).map(item => ({
        ...item,
        items: typeof item.items === 'string' ? JSON.parse(item.items) : item.items,
      }))

      setContent(parsedData)
    } catch (error: any) {
      console.error('Error fetching who its for content:', error)
      if (error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
        setError('Failed to connect to Supabase. Please check your configuration and restart the server.')
      } else {
        setError(error.message || 'Failed to load content. Please check your Supabase configuration.')
      }
      setMessage({ type: 'error', text: error.message || 'Failed to load content' })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (section: WhoItsForContent) => {
    setEditingSection({ ...section })
    setMessage(null)
  }

  const handleSave = async () => {
    if (!editingSection) return

    try {
      const { error: updateError } = await supabase
        .from('who_its_for_content')
        .update({
          title: editingSection.title,
          items: editingSection.items, // Supabase will handle JSONB conversion
          description: editingSection.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingSection.id)

      if (updateError) throw updateError

      setMessage({ type: 'success', text: 'Content updated successfully' })
      setEditingSection(null)
      fetchContent()
    } catch (error: any) {
      console.error('Error updating content:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to update content' })
    }
  }

  const handleCancel = () => {
    setEditingSection(null)
    setMessage(null)
  }

  const handleAddItem = () => {
    if (!editingSection) return
    setEditingSection({
      ...editingSection,
      items: [...editingSection.items, ''],
    })
  }

  const handleRemoveItem = (index: number) => {
    if (!editingSection) return
    setEditingSection({
      ...editingSection,
      items: editingSection.items.filter((_, i) => i !== index),
    })
  }

  const handleItemChange = (index: number, value: string) => {
    if (!editingSection) return
    const newItems = [...editingSection.items]
    newItems[index] = value
    setEditingSection({
      ...editingSection,
      items: newItems,
    })
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
          <li>Run the SQL script <code className="bg-red-100 px-2 py-1 rounded">add-who-its-for-table.sql</code> in Supabase</li>
        </ul>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {content.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            {editingSection?.id === section.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingSection.title}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Items (one per line)
                  </label>
                  <div className="space-y-2">
                    {editingSection.items.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleItemChange(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                          placeholder={`Item ${index + 1}`}
                        />
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddItem}
                      className="w-full px-4 py-2 bg-gray-100 text-primary rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingSection.description}
                    onChange={(e) =>
                      setEditingSection({ ...editingSection, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-100 text-primary rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-primary mb-4">{section.title}</h3>
                <ul className="space-y-2 mb-4">
                  {section.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      <span className="text-text-primary">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-text-secondary text-sm mb-4">{section.description}</p>
                <button
                  onClick={() => handleEdit(section)}
                  className="px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

