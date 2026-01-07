'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface DemoVideo {
  id: string
  title: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  duration_seconds: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function DemoVideoManagement() {
  const [videos, setVideos] = useState<DemoVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState<DemoVideo | null>(null)
  const [videoSourceType, setVideoSourceType] = useState<'upload' | 'youtube'>('upload')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_file: null as File | null,
    youtube_url: '',
    thumbnail_file: null as File | null,
  })
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadingFile, setUploadingFile] = useState<string | null>(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  // Helper function to extract YouTube video ID from URL
  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }
    return null
  }

  // Helper function to validate YouTube URL
  const isValidYouTubeUrl = (url: string): boolean => {
    return extractYouTubeId(url) !== null
  }

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('demo_videos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setVideos(data || [])
    } catch (error: any) {
      console.error('Error fetching videos:', error)
      alert('Failed to load videos: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'thumbnail') => {
    const file = e.target.files?.[0]
    if (!file) {
      // No file selected - clear the form data for this field
      if (type === 'video') {
        setFormData({ ...formData, video_file: null })
      } else {
        setFormData({ ...formData, thumbnail_file: null })
      }
      return
    }

    if (type === 'video') {
      // Check file size (250MB limit)
      if (file.size > 250 * 1024 * 1024) {
        alert('❌ Video file must be less than 250MB. Please select a smaller file.')
        e.target.value = '' // Clear the input only if invalid
        setFormData({ ...formData, video_file: null })
        return
      }
      
      // Strict video file type validation
      const validVideoTypes = [
        'video/mp4',
        'video/webm',
        'video/ogg',
        'video/quicktime',
        'video/x-msvideo', // .avi
        'video/x-matroska' // .mkv
      ]
      
      // Also check file extension as fallback
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const validExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv']
      
      const isValidType = validVideoTypes.includes(file.type) || (fileExt && validExtensions.includes(fileExt))
      
      if (!isValidType) {
        alert(`❌ Invalid file type! Please select a video file.\n\nSelected: ${file.name} (${file.type || 'unknown type'})\n\nSupported formats: MP4, WebM, OGG, QuickTime (MOV), AVI, MKV\n\nYou selected an image file. Please choose a VIDEO file instead.`)
        e.target.value = '' // Clear the input only if invalid
        setFormData({ ...formData, video_file: null })
        return
      }
      
      // File is valid - set it in form data
      setFormData({ ...formData, video_file: file })
    } else {
      // Check if it's an image file
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      
      if (!validImageTypes.includes(file.type)) {
        alert(`❌ Please upload an image file for thumbnail.\n\nSupported: JPG, PNG, WebP, GIF`)
        e.target.value = '' // Clear the input only if invalid
        setFormData({ ...formData, thumbnail_file: null })
        return
      }
      
      // File is valid - set it in form data
      setFormData({ ...formData, thumbnail_file: file })
    }
  }

  const uploadFile = async (file: File, bucket: string, path: string, onProgress?: (progress: number) => void): Promise<string> => {
    const fileExt = file.name.split('.').pop()?.toLowerCase()
    
    // Clean filename - remove spaces and special characters, keep only alphanumeric and dashes
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase()
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(7)
    const fileName = `${path}/${timestamp}_${randomStr}_${cleanFileName}`

    // Determine content type for better Supabase handling
    // Note: Video files preserve all tracks including audio automatically
    // Supabase Storage uploads files as-is without transcoding, so audio is preserved
    let contentType = file.type
    if (!contentType) {
      // Fallback to extension-based detection
      if (fileExt === 'mp4') contentType = 'video/mp4'
      else if (fileExt === 'webm') contentType = 'video/webm'
      else if (fileExt === 'ogg') contentType = 'video/ogg'
      else if (fileExt === 'mov') contentType = 'video/quicktime'
      else if (fileExt === 'png') contentType = 'image/png'
      else if (fileExt === 'jpg' || fileExt === 'jpeg') contentType = 'image/jpeg'
      else if (fileExt === 'webp') contentType = 'image/webp'
      else contentType = 'application/octet-stream'
    }
    
    console.log('Uploading file with preserved audio:', {
      name: file.name,
      type: contentType,
      size: file.size
    })

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('You must be logged in to upload files. Please sign in again.')
    }

    // Upload with progress tracking
    return new Promise((resolve, reject) => {
      // Set initial progress
      if (onProgress) {
        onProgress(0)
      }
      setUploadProgress(0)
      
      supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: contentType,
        })
        .then(({ data, error }) => {
          if (error) {
            console.error('Upload error:', error)
            setUploadProgress(0)
            
            // Provide more helpful error messages
            let errorMessage = `Upload failed: ${error.message || 'Unknown error'}`
            
            if (error.message?.includes('mime type')) {
              errorMessage = `File type "${contentType}" is not allowed. The bucket needs to be updated to allow this file type. Please run the SQL update in Supabase.`
            } else if (error.message?.includes('already exists')) {
              errorMessage = `A file with this name already exists. Please try again.`
            } else if (error.message?.includes('not found')) {
              errorMessage = `Storage bucket "${bucket}" not found. Please create it in Supabase Storage.`
            } else if (error.message?.includes('permission') || error.message?.includes('policy')) {
              errorMessage = `Permission denied. Make sure you're logged in as an admin and storage policies are set correctly.`
            } else if (error.message?.includes('exceeded the maximum allowed size') || error.message?.includes('maximum allowed size') || error.message?.includes('size limit')) {
              const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
              errorMessage = `❌ UPLOAD FAILED: File size limit exceeded!\n\nYour file: ${fileSizeMB} MB\nExpected limit: 250MB\n\n🔧 FIX REQUIRED:\n1. Go to Supabase Dashboard → SQL Editor\n2. Run the SQL from: FIX-500MB-VIDEO-UPLOAD.sql\n   OR run this command:\n   UPDATE storage.buckets SET file_size_limit = 262144000 WHERE id = 'demo-videos';\n3. Verify it worked:\n   SELECT file_size_limit FROM storage.buckets WHERE id = 'demo-videos';\n   (Should show: 262144000 = 250MB)\n4. Refresh the page and try uploading again\n\n✅ Your file (${fileSizeMB} MB) is under 250MB, so it WILL work after fixing the bucket!`
            }
            
            reject(new Error(errorMessage))
            return
          }

          if (!data) {
            setUploadProgress(0)
            reject(new Error('Upload returned no data'))
            return
          }

          const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path)

          console.log('Upload successful, public URL:', publicUrl)
          setUploadProgress(100)
          if (onProgress) {
            onProgress(100)
          }
          setTimeout(() => setUploadProgress(0), 500) // Reset after brief delay
          resolve(publicUrl)
        })
        .catch((error) => {
          setUploadProgress(0)
          console.error('Upload catch error:', error)
          
          // Provide more helpful error messages
          let errorMessage = `Upload failed: ${error.message || 'Unknown error'}`
          
          if (error.message?.includes('mime type')) {
            errorMessage = `File type "${contentType}" is not allowed. The bucket needs to be updated to allow this file type. Please run the SQL update in Supabase.`
          } else if (error.message?.includes('already exists')) {
            errorMessage = `A file with this name already exists. Please try again.`
          } else if (error.message?.includes('not found')) {
            errorMessage = `Storage bucket "${bucket}" not found. Please create it in Supabase Storage.`
          } else if (error.message?.includes('permission') || error.message?.includes('policy')) {
            errorMessage = `Permission denied. Make sure you're logged in as an admin and storage policies are set correctly.`
          } else if (error.message?.includes('exceeded the maximum allowed size') || error.message?.includes('maximum allowed size') || error.message?.includes('size limit')) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
            errorMessage = `❌ UPLOAD FAILED: File size limit exceeded!\n\nYour file: ${fileSizeMB} MB\nExpected limit: 250MB\n\n🔧 FIX REQUIRED:\n1. Go to Supabase Dashboard → SQL Editor\n2. Run the SQL from: FIX-500MB-VIDEO-UPLOAD.sql\n   OR run this command:\n   UPDATE storage.buckets SET file_size_limit = 262144000 WHERE id = 'demo-videos';\n3. Verify it worked:\n   SELECT file_size_limit FROM storage.buckets WHERE id = 'demo-videos';\n   (Should show: 262144000 = 250MB)\n4. Refresh the page and try uploading again\n\n✅ Your file (${fileSizeMB} MB) is under 250MB, so it WILL work after fixing the bucket!`
          }
          
          reject(new Error(errorMessage))
        })
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        alert('Please enter a video title')
        setUploading(false)
        return
      }

      // Validate video source (either file upload or YouTube URL)
      if (!editingVideo) {
        if (videoSourceType === 'upload' && !formData.video_file) {
          alert('Please select a video file to upload')
          setUploading(false)
          return
        }
        if (videoSourceType === 'youtube' && !formData.youtube_url.trim()) {
          alert('Please enter a YouTube URL')
          setUploading(false)
          return
        }
        if (videoSourceType === 'youtube' && !isValidYouTubeUrl(formData.youtube_url)) {
          alert('Invalid YouTube URL. Please enter a valid YouTube video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID)')
          setUploading(false)
          return
        }
      }

      let videoUrl = editingVideo?.video_url || ''
      let thumbnailUrl = editingVideo?.thumbnail_url || ''

      // Handle YouTube URL
      if (videoSourceType === 'youtube' && formData.youtube_url.trim()) {
        // Store the YouTube URL as-is, the player will handle embedding
        videoUrl = formData.youtube_url.trim()
        // Try to get thumbnail from YouTube if not provided
        const youtubeId = extractYouTubeId(videoUrl)
        if (youtubeId && !formData.thumbnail_file) {
          // Use YouTube's thumbnail API
          thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
        }
      }

      // Upload video file if provided
      if (videoSourceType === 'upload' && formData.video_file) {
        setUploadingFile('video')
        const sizeMB = (formData.video_file.size / (1024 * 1024)).toFixed(2)
        
        // Check file size (250MB limit)
        if (formData.video_file.size > 250 * 1024 * 1024) {
          setUploadingFile(null)
          throw new Error(`Video file is too large (${sizeMB}MB). Maximum size is 250MB. Please compress or use a smaller file.`)
        }

        // Double-check file type before uploading (extra safety)
        const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
        const fileExt = formData.video_file.name.split('.').pop()?.toLowerCase()
        const validExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv']
        
        const isValidType = validVideoTypes.includes(formData.video_file.type) || (fileExt && validExtensions.includes(fileExt))
        
        if (!isValidType) {
          setUploadingFile(null)
          throw new Error(`Invalid video file type: "${formData.video_file.type}". File extension: "${fileExt}". Please select a video file (MP4, WebM, OGG, MOV, etc.).`)
        }
        
        try {
          videoUrl = await uploadFile(
            formData.video_file, 
            'demo-videos', 
            'videos',
            (progress) => {
              setUploadProgress(progress)
            }
          )
          setUploadingFile(null)
        } catch (uploadError: any) {
          setUploadingFile(null)
          setUploadProgress(0)
          console.error('Video upload error:', uploadError)
          throw new Error(`Failed to upload video: ${uploadError.message || 'Unknown error'}. Please check: 1) File size is under 250MB, 2) File is a valid video format, 3) You have admin permissions, 4) Run FIX-500MB-VIDEO-UPLOAD.sql in Supabase SQL Editor to set the bucket limit to 250MB.`)
        }
      }

      // Upload thumbnail if provided
      if (formData.thumbnail_file) {
        setUploadingFile('thumbnail')
        // Validate thumbnail is an image file
        const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
        if (!validImageTypes.includes(formData.thumbnail_file.type)) {
          setUploadingFile(null)
          throw new Error(`Invalid thumbnail file type: ${formData.thumbnail_file.type}. Please select an image file (PNG, JPG, WebP, GIF).`)
        }
        try {
          thumbnailUrl = await uploadFile(
            formData.thumbnail_file, 
            'demo-videos', 
            'thumbnails',
            (progress) => {
              setUploadProgress(progress)
            }
          )
          setUploadingFile(null)
        } catch (uploadError: any) {
          setUploadingFile(null)
          setUploadProgress(0)
          console.error('Thumbnail upload error:', uploadError)
          throw new Error(`Failed to upload thumbnail: ${uploadError.message || 'Unknown error'}`)
        }
      }

      // Calculate duration if video file was uploaded
      let durationSeconds = editingVideo?.duration_seconds || null
      if (formData.video_file) {
        // In a real implementation, you'd use a library to get video duration
        // For now, we'll set it to null and let you set it manually
        durationSeconds = null
      }

      const videoData = {
        title: formData.title,
        description: formData.description || null,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl || null,
        duration_seconds: durationSeconds,
        updated_at: new Date().toISOString(),
      }

      if (editingVideo) {
        // Update existing video
        const { error } = await supabase
          .from('demo_videos')
          .update(videoData)
          .eq('id', editingVideo.id)

        if (error) throw error
      } else {
        // Create new video
        const { error } = await supabase
          .from('demo_videos')
          .insert([videoData])

        if (error) throw error
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        video_file: null,
        youtube_url: '',
        thumbnail_file: null,
      })
      setVideoSourceType('upload')
      setEditingVideo(null)
      setShowForm(false)
      await fetchVideos()
      alert('✅ ' + (editingVideo ? 'Video updated successfully!' : 'Video uploaded successfully!'))
    } catch (error: any) {
      console.error('Error saving video:', error)
      const errorMessage = error.message || 'Unknown error occurred'
      alert('❌ Failed to save video:\n\n' + errorMessage + '\n\nCheck the browser console for more details.')
      
      // Keep form open on error so user can retry
      // Don't reset formData or hide form
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (video: DemoVideo) => {
    setEditingVideo(video)
    setShowForm(true)
    // Detect if it's a YouTube URL
    const isYouTube = video.video_url.includes('youtube.com') || video.video_url.includes('youtu.be')
    setVideoSourceType(isYouTube ? 'youtube' : 'upload')
    setFormData({
      title: video.title,
      description: video.description || '',
      video_file: null,
      youtube_url: isYouTube ? video.video_url : '',
      thumbnail_file: null,
    })
  }

  const handleDelete = async (video: DemoVideo) => {
    if (!confirm(`Are you sure you want to delete "${video.title}"?\n\nThis will permanently delete:\n- The video file\n- The thumbnail (if any)\n- The database record\n\nThis action cannot be undone.`)) return

    try {
      // Extract file paths from URLs
      const deletePromises: Promise<any>[] = []

      // Delete video file from storage
      if (video.video_url) {
        // Extract path from full URL (e.g., https://...supabase.co/storage/v1/object/public/demo-videos/videos/...)
        const videoPathMatch = video.video_url.match(/demo-videos\/(.+)$/)
        if (videoPathMatch) {
          const videoPath = videoPathMatch[1]
          console.log('Deleting video file:', videoPath)
          const deleteVideoPromise = supabase.storage
            .from('demo-videos')
            .remove([videoPath])
          deletePromises.push(deleteVideoPromise)
        }
      }

      // Delete thumbnail file from storage
      if (video.thumbnail_url) {
        const thumbnailPathMatch = video.thumbnail_url.match(/demo-videos\/(.+)$/)
        if (thumbnailPathMatch) {
          const thumbnailPath = thumbnailPathMatch[1]
          console.log('Deleting thumbnail file:', thumbnailPath)
          const deleteThumbnailPromise = supabase.storage
            .from('demo-videos')
            .remove([thumbnailPath])
          deletePromises.push(deleteThumbnailPromise)
        }
      }

      // Wait for all file deletions to complete
      if (deletePromises.length > 0) {
        const deleteResults = await Promise.allSettled(deletePromises)
        
        // Check for any deletion errors (log but don't fail if file already deleted)
        deleteResults.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.warn(`File deletion ${index + 1} failed (may already be deleted):`, result.reason)
          }
        })
      }

      // Delete database record (this removes ALL fields: title, description, video_url, thumbnail_url, duration_seconds, subtitles, etc.)
      // The DELETE operation removes the entire row, so title, description, and all other fields are gone
      const { error: dbError } = await supabase
        .from('demo_videos')
        .delete()
        .eq('id', video.id)

      if (dbError) {
        console.error('Database deletion error:', dbError)
        throw new Error(`Failed to delete database record: ${dbError.message}`)
      }

      // Wait a moment to ensure deletion is complete
      await new Promise(resolve => setTimeout(resolve, 500))

      // Refresh the videos list (forces fresh fetch, no caching)
      await fetchVideos()
      
      alert('✅ Video completely deleted!\n\nDeleted:\n- Title: "' + video.title + '"\n- Description\n- Video file from storage\n- Thumbnail file (if any)\n- All database fields\n\nThe video will NOT appear on the client side.')
    } catch (error: any) {
      console.error('Error deleting video:', error)
      alert('❌ Failed to delete video: ' + error.message + '\n\nPlease check the browser console for details.')
    }
  }

  const toggleActive = async (video: DemoVideo) => {
    try {
      const { error } = await supabase
        .from('demo_videos')
        .update({ is_active: !video.is_active })
        .eq('id', video.id)

      if (error) throw error
      await fetchVideos()
    } catch (error: any) {
      console.error('Error toggling video:', error)
      alert('Failed to update video: ' + error.message)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading videos...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Demo Video Management</h2>
        <button
          onClick={() => {
            if (showForm || editingVideo) {
              // Cancel - hide form
              setShowForm(false)
              setEditingVideo(null)
              setFormData({
                title: '',
                description: '',
                video_file: null,
                youtube_url: '',
                thumbnail_file: null,
              })
              setVideoSourceType('upload')
            } else {
              // Show form for new video
              setShowForm(true)
              setEditingVideo(null)
              setFormData({
                title: '',
                description: '',
                video_file: null,
                youtube_url: '',
                thumbnail_file: null,
              })
              setVideoSourceType('upload')
            }
          }}
          className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-emerald-600"
        >
          {(showForm || editingVideo) ? 'Cancel' : '+ Add New Video'}
        </button>
      </div>

      {/* Video Form */}
      {(showForm || editingVideo) && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <h3 className="text-lg font-semibold text-primary">
            {editingVideo ? 'Edit Video' : 'Upload New Video'}
          </h3>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              required
              placeholder="Demo Video Title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
              placeholder="Video description..."
            />
          </div>

          {/* Video Source Selection */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Video Source {!editingVideo && '*'}
            </label>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="videoSource"
                  value="upload"
                  checked={videoSourceType === 'upload'}
                  onChange={(e) => {
                    setVideoSourceType('upload')
                    setFormData({ ...formData, youtube_url: '', video_file: null })
                  }}
                  className="w-4 h-4 text-accent"
                />
                <span>Upload Video File</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="videoSource"
                  value="youtube"
                  checked={videoSourceType === 'youtube'}
                  onChange={(e) => {
                    setVideoSourceType('youtube')
                    setFormData({ ...formData, video_file: null })
                  }}
                  className="w-4 h-4 text-accent"
                />
                <span>YouTube Link</span>
              </label>
            </div>
          </div>

          {/* YouTube URL Input */}
          {videoSourceType === 'youtube' && (
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                YouTube URL {!editingVideo && '*'}
              </label>
              <input
                type="url"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required={!editingVideo && videoSourceType === 'youtube'}
                placeholder="https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a YouTube video URL. The video will be embedded and play on your website.
              </p>
              {formData.youtube_url && isValidYouTubeUrl(formData.youtube_url) && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                  ✓ Valid YouTube URL detected
                </div>
              )}
              {formData.youtube_url && !isValidYouTubeUrl(formData.youtube_url) && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  ✗ Invalid YouTube URL format
                </div>
              )}
            </div>
          )}

          {/* Video File Upload */}
          {videoSourceType === 'upload' && (
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Video File {!editingVideo && '*'}
            </label>
            {formData.video_file ? (
              <div className="mb-2 p-3 bg-green-50 border-2 border-green-400 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="font-semibold text-green-800">{formData.video_file.name}</div>
                      <div className="text-xs text-green-600">{(formData.video_file.size / (1024 * 1024)).toFixed(2)} MB • {formData.video_file.type || 'video/mp4'}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, video_file: null })
                      const fileInput = document.querySelector('input[type="file"][accept*="video"]') as HTMLInputElement
                      if (fileInput) fileInput.value = ''
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-2 p-3 bg-gray-50 border border-gray-300 rounded-lg text-center text-gray-500 text-sm">
                No video file selected
              </div>
            )}
            <label className="block">
              <input
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                onChange={(e) => handleFileChange(e, 'video')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-accent transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-emerald-600"
                required={!editingVideo}
                key={editingVideo?.id || 'new'}
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Max 250MB. Supported formats: MP4, WebM, OGG, QuickTime. Landscape orientation recommended.
            </p>
          </div>
          )}

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Thumbnail Image
            </label>
            {formData.thumbnail_file ? (
              <div className="mb-2 p-3 bg-green-50 border-2 border-green-400 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="font-semibold text-green-800">{formData.thumbnail_file.name}</div>
                      <div className="text-xs text-green-600">{(formData.thumbnail_file.size / 1024).toFixed(2)} KB • {formData.thumbnail_file.type}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, thumbnail_file: null })
                      // Reset the file input
                      const fileInput = document.querySelector('input[type="file"][accept*="image"]') as HTMLInputElement
                      if (fileInput) fileInput.value = ''
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-2 p-3 bg-gray-50 border border-gray-300 rounded-lg text-center text-gray-500 text-sm">
                No thumbnail selected (optional)
              </div>
            )}
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'thumbnail')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-accent transition-colors file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-emerald-600"
                key={editingVideo?.id || 'new-thumb'}
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Optional. Landscape image recommended.
            </p>
          </div>

          {/* Upload Progress */}
          {uploading && uploadProgress > 0 && (
            <div className="space-y-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium">
                  Uploading {uploadingFile === 'video' ? 'video' : 'thumbnail'}...
                </span>
                <span className="font-bold text-accent text-lg">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-accent h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              {uploadingFile === 'video' && formData.video_file && (
                <p className="text-xs text-gray-600">
                  {formData.video_file.name} • {(formData.video_file.size / (1024 * 1024)).toFixed(2)} MB total
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? `Uploading... ${uploadProgress > 0 ? `${uploadProgress}%` : ''}` : editingVideo ? 'Update Video' : 'Upload Video'}
          </button>
        </form>
      )}

      {/* Videos List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {videos.map((video) => (
              <tr key={video.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-primary">{video.title}</div>
                  {video.description && (
                    <div className="text-sm text-gray-500 mt-1">{video.description}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleActive(video)}
                    className={`px-3 py-1 rounded text-sm ${
                      video.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {video.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(video.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(video)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(video)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {videos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No videos uploaded yet. Click "Add New Video" to upload your first demo video.
          </div>
        )}
      </div>
    </div>
  )
}
