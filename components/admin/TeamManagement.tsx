'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string | null
  photo_url: string | null
  linkedin_url: string | null
  twitter_url: string | null
  email: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    photo_url: '',
    linkedin_url: '',
    twitter_url: '',
    email: '',
    display_order: 0,
    is_active: true,
  })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setMembers(data || [])
    } catch (error: any) {
      console.error('Error fetching team members:', error)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      photo_url: member.photo_url || '',
      linkedin_url: member.linkedin_url || '',
      twitter_url: member.twitter_url || '',
      email: member.email || '',
      display_order: member.display_order,
      is_active: member.is_active,
    })
    setPhotoFile(null)
    setPhotoPreview(member.photo_url || '')
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingMember(null)
    setFormData({
      name: '',
      role: '',
      bio: '',
      photo_url: '',
      linkedin_url: '',
      twitter_url: '',
      email: '',
      display_order: members.length + 1,
      is_active: true,
    })
    setPhotoFile(null)
    setPhotoPreview('')
    setShowForm(true)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setUploadingPhoto(true)

    try {
      let finalPhotoUrl = formData.photo_url

      // Upload photo if a new file was selected
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop()
        const fileName = `team-photos/${editingMember?.id || Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        
        // Delete old photo if editing and it exists in storage
        if (editingMember?.photo_url && editingMember.photo_url.includes('site-assets')) {
          try {
            const urlParts = editingMember.photo_url.split('/team-photos/')
            if (urlParts.length > 1) {
              const oldFileName = urlParts[1].split('?')[0]
              if (oldFileName) {
                await supabase.storage.from('site-assets').remove([`team-photos/${oldFileName}`])
              }
            }
          } catch (deleteError) {
            // Ignore delete errors (file might not exist)
            console.warn('Could not delete old photo:', deleteError)
          }
        }

        const { error: uploadError } = await supabase.storage
          .from('site-assets')
          .upload(fileName, photoFile, {
            cacheControl: '3600',
            upsert: true
          })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('site-assets')
          .getPublicUrl(fileName)

        finalPhotoUrl = urlData.publicUrl
      }

      const dataToSave = {
        ...formData,
        photo_url: finalPhotoUrl || null,
        updated_at: new Date().toISOString(),
      }

      if (editingMember) {
        const { error } = await supabase
          .from('team_members')
          .update(dataToSave)
          .eq('id', editingMember.id)

        if (error) throw error
        setMessage({ type: 'success', text: 'Team member updated successfully!' })
      } else {
        const { error } = await supabase
          .from('team_members')
          .insert([dataToSave])

        if (error) throw error
        setMessage({ type: 'success', text: 'Team member added successfully!' })
      }

      setShowForm(false)
      setPhotoFile(null)
      setPhotoPreview('')
      await fetchMembers()
    } catch (error: any) {
      console.error('Error saving team member:', error)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id)

      if (error) throw error
      setMessage({ type: 'success', text: 'Team member deleted successfully!' })
      await fetchMembers()
    } catch (error: any) {
      console.error('Error deleting team member:', error)
      setMessage({ type: 'error', text: error.message })
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading team members...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-primary">Team Management</h2>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
        >
          Add Team Member
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
          <h3 className="text-2xl font-semibold text-primary mb-6">
            {editingMember ? 'Edit Team Member' : 'Add Team Member'}
          </h3>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Role *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g., Founder & Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
                {photoPreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-primary mb-2">Preview:</p>
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                )}
                {!photoPreview && editingMember?.photo_url && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-primary mb-2">Current Photo:</p>
                    <img
                      src={editingMember.photo_url}
                      alt="Current"
                      className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Twitter URL</label>
                <input
                  type="url"
                  value={formData.twitter_url}
                  onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-primary mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Team member bio..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 text-accent rounded focus:ring-2 focus:ring-accent"
                  />
                  <span className="ml-2 text-primary">Active (show on About page)</span>
                </label>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={uploadingPhoto}
                className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingPhoto ? 'Uploading...' : `${editingMember ? 'Update' : 'Add'} Team Member`}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setPhotoFile(null)
                  setPhotoPreview('')
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
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Order</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-primary">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {members.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-text-secondary">
                  No team members yet. Click &quot;Add Team Member&quot; to get started.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {member.photo_url && (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium text-primary">{member.name}</div>
                        {member.email && (
                          <div className="text-sm text-text-secondary">{member.email}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{member.role}</td>
                  <td className="px-6 py-4 text-text-secondary">{member.display_order}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {member.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded font-medium hover:bg-blue-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded font-medium hover:bg-red-200 transition-colors"
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
  )
}

