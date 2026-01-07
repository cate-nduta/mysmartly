'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [showCropModal, setShowCropModal] = useState(false)
  const [cropImage, setCropImage] = useState<string>('')
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 200 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, corner: '' })
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    fetchMembers()
  }, [])

  // Global mouse event handlers for dragging/resizing
  useEffect(() => {
    if (!isDragging && !isResizing) return
    
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!imageRef.current || !containerRef.current) return
      
      const img = imageRef.current
      const imgRect = img.getBoundingClientRect()
      const displayWidth = img.width
      const displayHeight = img.height
      
      if (isDragging) {
        let newX = e.clientX - imgRect.left - dragStart.x
        let newY = e.clientY - imgRect.top - dragStart.y
        
        setCropArea(prev => {
          // Constrain to image bounds
          const constrainedX = Math.max(0, Math.min(newX, displayWidth - prev.width))
          const constrainedY = Math.max(0, Math.min(newY, displayHeight - prev.height))
          return { ...prev, x: constrainedX, y: constrainedY }
        })
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y
        
        setCropArea(prev => {
          let newWidth = prev.width
          let newHeight = prev.height
          let newX = prev.x
          let newY = prev.y
          
          if (resizeStart.corner.includes('e')) {
            newWidth = Math.max(150, Math.min(prev.width + deltaX, displayWidth - prev.x))
          }
          if (resizeStart.corner.includes('w')) {
            const change = Math.max(-prev.width + 150, Math.min(deltaX, prev.x))
            newWidth = prev.width - change
            newX = prev.x + change
          }
          if (resizeStart.corner.includes('s')) {
            newHeight = Math.max(150, Math.min(prev.height + deltaY, displayHeight - prev.y))
          }
          if (resizeStart.corner.includes('n')) {
            const change = Math.max(-prev.height + 150, Math.min(deltaY, prev.y))
            newHeight = prev.height - change
            newY = prev.y + change
          }
          
          // Keep square aspect ratio
          const size = Math.min(newWidth, newHeight)
          
          // Adjust position if needed
          if (resizeStart.corner.includes('w') || resizeStart.corner.includes('n')) {
            if (newWidth !== size) {
              newX = prev.x + (prev.width - size)
            }
            if (newHeight !== size) {
              newY = prev.y + (prev.height - size)
            }
          }
          
          // Final bounds check
          newX = Math.max(0, Math.min(newX, displayWidth - size))
          newY = Math.max(0, Math.min(newY, displayHeight - size))
          
          return { x: newX, y: newY, width: size, height: size }
        })
        
        setResizeStart(prev => ({ ...prev, x: e.clientX, y: e.clientY }))
      }
    }
    
    const handleGlobalMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }
    
    document.addEventListener('mousemove', handleGlobalMouseMove)
    document.addEventListener('mouseup', handleGlobalMouseUp)
    
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging, isResizing, dragStart, resizeStart])

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
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageUrl = reader.result as string
        setCropImage(imageUrl)
        setPhotoPreview(imageUrl)
        setShowCropModal(true)
        setImageLoaded(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const initializeCropArea = () => {
    if (imageRef.current) {
      const img = imageRef.current
      const displayWidth = img.width
      const displayHeight = img.height
      // Make crop area larger - 85% of the smaller dimension, but ensure it fits
      const maxSize = Math.min(displayWidth, displayHeight)
      const size = Math.min(maxSize * 0.85, maxSize - 20) // 85% or leave 10px margin on each side
      setCropArea({
        x: (displayWidth - size) / 2,
        y: (displayHeight - size) / 2,
        width: size,
        height: size
      })
      setImageLoaded(true)
    }
  }

  // Handle crop area dragging - work in displayed pixels
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('crop-area') || target.classList.contains('crop-handle')) {
      if (target.classList.contains('crop-handle')) {
        // Resizing
        setIsResizing(true)
        setResizeStart({ 
          x: e.clientX, 
          y: e.clientY, 
          corner: target.dataset.corner || '' 
        })
      } else {
        // Dragging
        setIsDragging(true)
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect && imageRef.current) {
          const img = imageRef.current
          const imgRect = img.getBoundingClientRect()
          setDragStart({
            x: e.clientX - (imgRect.left + cropArea.x),
            y: e.clientY - (imgRect.top + cropArea.y)
          })
        }
      }
      e.preventDefault()
    }
  }

  // Mouse move handler is now in useEffect for global handling

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  // Apply crop and convert to file
  const applyCrop = () => {
    if (!imageRef.current || !cropImage) return

    const img = imageRef.current
    const canvas = document.createElement('canvas')
    canvas.width = 400 // Output size for team photos (square)
    canvas.height = 400
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return

    // Calculate scale from displayed size to natural size
    const scaleX = img.naturalWidth / img.width
    const scaleY = img.naturalHeight / img.height
    
    // Convert displayed crop coordinates to natural image coordinates
    const sourceX = cropArea.x * scaleX
    const sourceY = cropArea.y * scaleY
    const sourceWidth = cropArea.width * scaleX
    const sourceHeight = cropArea.height * scaleY
    
    // Draw cropped image to canvas
    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      400,
      400
    )

    // Convert to blob then file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'team-photo.jpg', { type: 'image/jpeg' })
        setPhotoFile(file)
        setPhotoPreview(canvas.toDataURL('image/jpeg'))
        setShowCropModal(false)
        setCropImage('')
      }
    }, 'image/jpeg', 0.9)
  }

  const cancelCrop = () => {
    setShowCropModal(false)
    setCropImage('')
    setPhotoFile(null)
    setPhotoPreview('')
    const fileInput = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement
    if (fileInput) fileInput.value = ''
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
        is_active: formData.is_active ?? true, // Ensure is_active is set
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
        // Ensure is_active is true for new members
        const newMemberData = {
          ...dataToSave,
          is_active: true, // Always set to true for new members
        }
        const { error } = await supabase
          .from('team_members')
          .insert([newMemberData])

        if (error) throw error
        setMessage({ type: 'success', text: 'Team member added successfully! It will appear on the About page immediately.' })
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
      setMessage({ type: 'success', text: 'Team member deleted successfully! It will be removed from the About page immediately.' })
      await fetchMembers()
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000)
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

      {/* Image Crop Modal */}
      {showCropModal && cropImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-6xl w-full max-h-[95vh] overflow-auto">
            <h3 className="text-xl font-bold text-primary mb-4">Crop Team Photo</h3>
            <p className="text-sm text-gray-600 mb-4">
              Drag the crop area to position it, or drag the corners to resize. The photo will be cropped to a square.
            </p>
            
            <div 
              ref={containerRef}
              className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100 mb-4 flex items-center justify-center"
              style={{ minHeight: '500px', maxHeight: '75vh' }}
              onMouseDown={handleMouseDown}
            >
              <img
                ref={imageRef}
                src={cropImage}
                alt="Crop preview"
                className="max-w-full max-h-[75vh] w-auto h-auto block"
                style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain' }}
                onLoad={initializeCropArea}
              />
              
              {imageLoaded && imageRef.current && (
                <>
                  {/* Crop overlay - positioned in displayed pixels */}
                  <div
                    className="absolute border-2 border-accent bg-accent/10 crop-area"
                    style={{
                      left: `${cropArea.x}px`,
                      top: `${cropArea.y}px`,
                      width: `${cropArea.width}px`,
                      height: `${cropArea.height}px`,
                      cursor: isDragging ? 'grabbing' : 'grab',
                    }}
                  >
                    {/* Resize handles */}
                    <div
                      className="absolute -top-2 -left-2 w-4 h-4 bg-accent border-2 border-white rounded-full cursor-nwse-resize crop-handle z-10"
                      data-corner="nw"
                      onMouseDown={(e) => {
                        e.stopPropagation()
                        setIsResizing(true)
                        setResizeStart({ x: e.clientX, y: e.clientY, corner: 'nw' })
                      }}
                    />
                    <div
                      className="absolute -top-2 -right-2 w-4 h-4 bg-accent border-2 border-white rounded-full cursor-nesw-resize crop-handle z-10"
                      data-corner="ne"
                      onMouseDown={(e) => {
                        e.stopPropagation()
                        setIsResizing(true)
                        setResizeStart({ x: e.clientX, y: e.clientY, corner: 'ne' })
                      }}
                    />
                    <div
                      className="absolute -bottom-2 -left-2 w-4 h-4 bg-accent border-2 border-white rounded-full cursor-nesw-resize crop-handle z-10"
                      data-corner="sw"
                      onMouseDown={(e) => {
                        e.stopPropagation()
                        setIsResizing(true)
                        setResizeStart({ x: e.clientX, y: e.clientY, corner: 'sw' })
                      }}
                    />
                    <div
                      className="absolute -bottom-2 -right-2 w-4 h-4 bg-accent border-2 border-white rounded-full cursor-nwse-resize crop-handle z-10"
                      data-corner="se"
                      onMouseDown={(e) => {
                        e.stopPropagation()
                        setIsResizing(true)
                        setResizeStart({ x: e.clientX, y: e.clientY, corner: 'se' })
                      }}
                    />
                  </div>
                  
                  {/* Dark overlay outside crop area */}
                  <div 
                    className="absolute inset-0 pointer-events-none" 
                    style={{
                      background: `linear-gradient(to right, 
                        rgba(0,0,0,0.6) 0%, 
                        rgba(0,0,0,0.6) ${(cropArea.x / imageRef.current.width) * 100}%,
                        transparent ${(cropArea.x / imageRef.current.width) * 100}%,
                        transparent ${((cropArea.x + cropArea.width) / imageRef.current.width) * 100}%,
                        rgba(0,0,0,0.6) ${((cropArea.x + cropArea.width) / imageRef.current.width) * 100}%,
                        rgba(0,0,0,0.6) 100%
                      ),
                      linear-gradient(to bottom,
                        rgba(0,0,0,0.6) 0%,
                        rgba(0,0,0,0.6) ${(cropArea.y / imageRef.current.height) * 100}%,
                        transparent ${(cropArea.y / imageRef.current.height) * 100}%,
                        transparent ${((cropArea.y + cropArea.height) / imageRef.current.height) * 100}%,
                        rgba(0,0,0,0.6) ${((cropArea.y + cropArea.height) / imageRef.current.height) * 100}%,
                        rgba(0,0,0,0.6) 100%
                      )`
                    }} 
                  />
                </>
              )}
            </div>
            
            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={cancelCrop}
                className="px-6 py-2 bg-gray-200 text-primary rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCrop}
                className="px-6 py-2 bg-accent text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
              >
                Apply Crop
              </button>
            </div>
          </div>
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

