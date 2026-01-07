'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'

interface DemoVideo {
  id: string
  title: string
  description: string | null
  video_url: string
  thumbnail_url: string | null
  duration_seconds: number | null
  subtitles_url?: string | null
  subtitles_fr_url?: string | null
}

export default function DemoVideoPlayer({ video }: { video: DemoVideo }) {
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [showCCMenu, setShowCCMenu] = useState(false)
  const [ccEnabled, setCcEnabled] = useState(false)
  const [ccLanguage, setCcLanguage] = useState<'en' | 'fr'>('en')
  const [quality, setQuality] = useState<string>('auto')
  const [videoStarted, setVideoStarted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const settingsRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const playbackRates = useMemo(() => [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2], [])
  const qualityOptions = useMemo(() => ['Auto', '1080p', '720p', '480p', '360p'], [])
  
  // Check if video URL is a YouTube URL
  const isYouTube = useMemo(() => {
    return video.video_url.includes('youtube.com') || video.video_url.includes('youtu.be')
  }, [video.video_url])
  
  // Extract YouTube video ID and create embed URL
  const youtubeEmbedUrl = useMemo(() => {
    if (!isYouTube) return null
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ]
    
    for (const pattern of patterns) {
      const match = video.video_url.match(pattern)
      if (match && match[1]) {
        // Parameters to hide channel info and prevent navigation to YouTube account:
        // rel=0: CRITICAL - Don't show related/suggested videos (prevents channel discovery)
        // modestbranding=1: CRITICAL - Minimal YouTube branding (hides YouTube logo where possible)
        // playsinline=1: Play inline on mobile
        // iv_load_policy=3: Don't show video annotations
        // cc_load_policy=0: Don't show captions by default
        // fs=1: Allow fullscreen
        // controls=1: Show player controls
        // disablekb=0: Allow keyboard controls
        // origin: Set origin for security
        // Note: YouTube embed will still show minimal branding, but channel info is minimized
        const origin = typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''
        return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&cc_load_policy=0&fs=1&controls=1&disablekb=0&enablejsapi=0${origin ? `&origin=${origin}` : ''}`
      }
    }
    return null
  }, [video.video_url, isYouTube])
  
  // Memoize video URL to prevent unnecessary re-renders (only for non-YouTube)
  const videoUrl = useMemo(() => {
    if (isYouTube) return ''
    return video.video_url + (video.video_url.includes('?') ? '&' : '?') + '_t=' + Date.now()
  }, [video.video_url, isYouTube])
  
  // Memoize thumbnail URL
  const thumbnailUrl = useMemo(() => {
    if (isYouTube && !video.thumbnail_url) {
      // Use YouTube thumbnail if no custom thumbnail
      const videoId = youtubeEmbedUrl?.match(/embed\/([^?]+)/)?.[1]
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      }
    }
    return video.thumbnail_url ? (video.thumbnail_url + (video.thumbnail_url.includes('?') ? '&' : '?') + '_t=' + Date.now()) : null
  }, [video.thumbnail_url, isYouTube, youtubeEmbedUrl])

  // Memoize togglePlay to prevent re-renders
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }, [playing])

  // Play video immediately when user clicks play - memoized to prevent re-renders
  const handlePlayClick = useCallback(async () => {
    if (!videoStarted && videoRef.current) {
      setVideoStarted(true)
      // Video is already preloaded, so it should play immediately
      try {
        await videoRef.current.play()
      } catch (error) {
        console.error('Error playing video:', error)
      }
    } else if (videoRef.current) {
      togglePlay()
    }
  }, [videoStarted, togglePlay])

  // Throttle timeupdate to reduce lag - only update every 100ms
  const timeUpdateRef = useRef<number | null>(null)
  const updateTime = useCallback(() => {
    if (timeUpdateRef.current) return
    timeUpdateRef.current = requestAnimationFrame(() => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime)
      }
      timeUpdateRef.current = null
    })
  }, [])

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    // Ensure audio is enabled by default
    videoElement.muted = false
    videoElement.volume = 1
    videoElement.playbackRate = playbackRate
    videoElement.preload = 'metadata' // Only load metadata initially to reduce lag

    // Check if video has audio tracks - only once
    const handleLoadedMetadata = () => {
      const video = videoElement as any // Type assertion for non-standard properties
      const hasAudio = video.mozHasAudio ||
                        (video.webkitAudioDecodedByteCount > 0) ||
                        (video.audioTracks && video.audioTracks.length > 0)
      
      if (hasAudio !== false) {
        videoElement.muted = false
        videoElement.volume = 1
      }
    }

    const updateDuration = () => setDuration(videoElement.duration)
    
    const handlePlay = () => setPlaying(true)
    const handlePause = () => setPlaying(false)

    videoElement.addEventListener('timeupdate', updateTime)
    videoElement.addEventListener('loadedmetadata', updateDuration)
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata)
    videoElement.addEventListener('play', handlePlay)
    videoElement.addEventListener('pause', handlePause)
    
    // Start loading video in background when component mounts
    if (videoElement.readyState === 0) {
      videoElement.load()
    }

    // Close settings when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false)
        setShowCCMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      videoElement.removeEventListener('timeupdate', updateTime)
      videoElement.removeEventListener('loadedmetadata', updateDuration)
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
      videoElement.removeEventListener('play', handlePlay)
      videoElement.removeEventListener('pause', handlePause)
      document.removeEventListener('mousedown', handleClickOutside)
      if (timeUpdateRef.current) {
        cancelAnimationFrame(timeUpdateRef.current)
      }
    }
  }, [playbackRate, updateTime, isYouTube])

  // Handle subtitle tracks
  useEffect(() => {
    // Skip subtitle setup for YouTube videos
    if (isYouTube) return
    
    const videoElement = videoRef.current
    if (!videoElement) return

    // Clear existing tracks
    const tracks = videoElement.querySelectorAll('track')
    tracks.forEach(track => track.remove())

    if (ccEnabled) {
      const track = document.createElement('track')
      track.kind = 'subtitles'
      track.label = ccLanguage === 'en' ? 'English' : 'Français'
      track.srclang = ccLanguage
      track.default = true
      
      if (ccLanguage === 'en' && video.subtitles_url) {
        track.src = video.subtitles_url
      } else if (ccLanguage === 'fr' && video.subtitles_fr_url) {
        track.src = video.subtitles_fr_url
      }
      
      if (track.src) {
        videoElement.appendChild(track)
        // Enable text tracks
        const textTracks = videoElement.textTracks
        for (let i = 0; i < textTracks.length; i++) {
          textTracks[i].mode = 'showing'
        }
      }
    } else {
      // Disable all text tracks
      const textTracks = videoElement.textTracks
      for (let i = 0; i < textTracks.length; i++) {
        textTracks[i].mode = 'hidden'
      }
    }
  }, [ccEnabled, ccLanguage, video.subtitles_url, video.subtitles_fr_url, isYouTube])

  const skip = useCallback((seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds))
    }
  }, [duration])

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  const handlePlaybackRate = useCallback((rate: number) => {
    setPlaybackRate(rate)
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
    }
    setShowSettings(false)
  }, [])

  const handleQuality = useCallback((qual: string) => {
    setQuality(qual)
    setShowSettings(false)
  }, [])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  const hasSubtitles = useMemo(() => video.subtitles_url || video.subtitles_fr_url, [video.subtitles_url, video.subtitles_fr_url])

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Video Container - Landscape */}
        <div ref={containerRef} className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
          {/* YouTube Embed - Direct iframe, no overlay needed */}
          {isYouTube && youtubeEmbedUrl ? (
            <iframe
              src={youtubeEmbedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title={video.title}
              style={{ border: 'none' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <>
              {/* Thumbnail - Always visible until video starts playing */}
              {!videoStarted && (
                <div className="absolute inset-0 w-full h-full z-10">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-contain"
                      loading="eager"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-white/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Video Element - Always in DOM, preloading metadata in background, hidden until started */}
              <video
                ref={videoRef}
                src={videoUrl}
                className={`w-full h-full object-contain ${videoStarted ? 'block' : 'hidden'}`}
                playsInline
                muted={false}
                preload="none"
                crossOrigin="anonymous"
                disablePictureInPicture
                controlsList="nodownload"
              />
              
              {/* Play Button Overlay - Show when not playing */}
              {!playing && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer hover:bg-black/30 transition-colors z-20"
                  onClick={handlePlayClick}
                >
                  <button className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                    <svg
                      className="w-10 h-10 text-primary ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Video Controls - Hide for YouTube videos */}
        {!isYouTube && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          {/* Progress Bar */}
          <div className="mb-3">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-1.5 bg-white rounded hover:bg-gray-100 transition-colors"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Skip Backward 5s */}
            <button
              onClick={() => skip(-5)}
              className="p-1.5 bg-white rounded hover:bg-gray-100 transition-colors"
              aria-label="Skip backward 5 seconds"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8zm-1.1 11h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09V16zm4.28-1.76c0 .32-.03.6-.1.82s-.17.42-.29.57-.28.26-.45.33-.37.1-.59.1-.41-.03-.59-.1-.33-.18-.46-.33-.23-.34-.3-.57-.11-.5-.11-.82v-.74c0-.32.03-.6.1-.82s.17-.42.29-.57.28-.26.45-.33.37-.1.59-.1.41.03.59.1.33.18.46.33.23.34.3.57.11.5.11.82v.74zm-.85-.86c0-.19-.01-.35-.04-.48s-.07-.23-.12-.31-.11-.14-.19-.17-.16-.05-.25-.05-.18.02-.25.05-.14.09-.19.17-.09.18-.12.31-.04.29-.04.48v.97c0 .19.01.35.04.48s.07.24.12.32.11.14.19.17.16.05.25.05.18-.02.25-.05.14-.09.19-.17.09-.19.12-.32.04-.29.04-.48v-.97z" />
              </svg>
            </button>

            {/* Skip Forward 5s */}
            <button
              onClick={() => skip(5)}
              className="p-1.5 bg-white rounded hover:bg-gray-100 transition-colors"
              aria-label="Skip forward 5 seconds"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.01 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8zm.85 11h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09V16zm4.28-1.76c0 .32-.03.6-.1.82s-.17.42-.29.57-.28.26-.45.33-.37.1-.59.1-.41-.03-.59-.1-.33-.18-.46-.33-.23-.34-.3-.57-.11-.5-.11-.82v-.74c0-.32.03-.6.1-.82s.17-.42.29-.57.28-.26.45-.33.37-.1.59-.1.41.03.59.1.33.18.46.33.23.34.3.57.11.5.11.82v.74zm-.85-.86c0-.19-.01-.35-.04-.48s-.07-.23-.12-.31-.11-.14-.19-.17-.16-.05-.25-.05-.18.02-.25.05-.14.09-.19.17-.09.18-.12.31-.04.29-.04.48v.97c0 .19.01.35.04.48s.07.24.12.32.11.14.19.17.16.05.25.05.18-.02.25-.05.14-.09.19-.17.09-.19.12-.32.04-.29.04-.48v-.97z" />
              </svg>
            </button>

            {/* Volume */}
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.muted = !muted
                  setMuted(!muted)
                }
              }}
              className="p-1.5 bg-white rounded hover:bg-gray-100 transition-colors"
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={muted ? 0 : volume}
              onChange={(e) => {
                const vol = parseFloat(e.target.value)
                setVolume(vol)
                if (videoRef.current) {
                  videoRef.current.volume = vol
                  videoRef.current.muted = vol === 0
                  setMuted(vol === 0)
                }
              }}
              className="w-20 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
              aria-label="Volume"
            />

            {/* CC Button */}
            {hasSubtitles && (
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={() => {
                    setShowCCMenu(!showCCMenu)
                    setShowSettings(false)
                  }}
                  className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${
                    ccEnabled ? 'bg-accent/20 text-accent' : 'bg-white'
                  }`}
                  aria-label="Subtitles"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V6h14v12zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
                  </svg>
                </button>
                {showCCMenu && (
                  <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[150px] z-10">
                    <button
                      onClick={() => {
                        setCcEnabled(false)
                        setShowCCMenu(false)
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        !ccEnabled ? 'font-semibold text-accent' : ''
                      }`}
                    >
                      Off
                    </button>
                    {video.subtitles_url && (
                      <button
                        onClick={() => {
                          setCcEnabled(true)
                          setCcLanguage('en')
                          setShowCCMenu(false)
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                          ccEnabled && ccLanguage === 'en' ? 'font-semibold text-accent' : ''
                        }`}
                      >
                        English
                      </button>
                    )}
                    {video.subtitles_fr_url && (
                      <button
                        onClick={() => {
                          setCcEnabled(true)
                          setCcLanguage('fr')
                          setShowCCMenu(false)
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                          ccEnabled && ccLanguage === 'fr' ? 'font-semibold text-accent' : ''
                        }`}
                      >
                        Français
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Settings Button */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => {
                  setShowSettings(!showSettings)
                  setShowCCMenu(false)
                }}
                className="p-1.5 bg-white rounded hover:bg-gray-100 transition-colors"
                aria-label="Settings"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                </svg>
              </button>
              {showSettings && (
                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-10">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <div className="text-xs font-semibold text-gray-500 uppercase">Playback Speed</div>
                  </div>
                  {playbackRates.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handlePlaybackRate(rate)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        playbackRate === rate ? 'font-semibold text-accent' : ''
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                  <div className="px-4 py-2 border-t border-gray-200 mt-2">
                    <div className="text-xs font-semibold text-gray-500 uppercase">Quality</div>
                  </div>
                  {qualityOptions.map((qual) => {
                    const isAuto = qual.toLowerCase() === 'auto'
                    return (
                      <button
                        key={qual}
                        onClick={() => handleQuality(qual.toLowerCase())}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                          quality === qual.toLowerCase() ? 'font-semibold text-accent' : ''
                        }`}
                        disabled={!isAuto}
                        title={!isAuto ? 'Multiple quality options require separate video files uploaded at different resolutions. Currently showing Auto (original quality).' : undefined}
                      >
                        {qual} {!isAuto && <span className="text-xs text-gray-400 ml-2">(Coming soon)</span>}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        )}

        {/* Video Title and Description */}
        <div className="p-6 pt-4">
          <h1 className="text-2xl font-bold text-primary mb-2">{video.title}</h1>
          {video.description && (
            <p className="text-text-secondary">{video.description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
