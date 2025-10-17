'use client'

import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Building, Globe, Calendar, Clock, CheckCircle, Star, DollarSign, CreditCard, MessageSquare, FileText, Shield, Lock, Heart, ThumbsUp, Share2, Bookmark, Play, Pause, Volume2, VolumeX } from '@/lib/icons'
import { cn } from '@/lib/utils'

export interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  description?: string
  duration?: number
  showControls?: boolean
  showTitle?: boolean
  showDescription?: boolean
  showProgress?: boolean
  showVolume?: boolean
  showFullscreen?: boolean
  showPlaybackSpeed?: boolean
  showQuality?: boolean
  showSubtitles?: boolean
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  preload?: 'none' | 'metadata' | 'auto'
  aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9'
  layout?: 'default' | 'minimal' | 'cinema' | 'compact'
  theme?: 'light' | 'dark' | 'colored'
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onTimeUpdate?: (currentTime: number) => void
  onVolumeChange?: (volume: number) => void
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  title = 'Video Title',
  description = 'Video description goes here',
  duration = 0,
  showControls = true,
  showTitle = true,
  showDescription = true,
  showProgress = true,
  showVolume = true,
  showFullscreen = true,
  showPlaybackSpeed = true,
  showQuality = true,
  showSubtitles = true,
  autoplay = false,
  loop = false,
  muted = false,
  preload = 'metadata',
  aspectRatio = '16:9',
  layout = 'default',
  theme = 'light',
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onVolumeChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(muted)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  const videoRef = React.useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
      onPlay?.()
    }
  }

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
      onPause?.()
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime
      setCurrentTime(time)
      onTimeUpdate?.(time)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = parseFloat(e.target.value)
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      onVolumeChange?.(newVolume)
    }
  }

  const handleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate
      setPlaybackRate(rate)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case '16:9': return 'aspect-video'
      case '4:3': return 'aspect-[4/3]'
      case '1:1': return 'aspect-square'
      case '21:9': return 'aspect-[21/9]'
      default: return 'aspect-video'
    }
  }

  const containerClass = cn(
    'relative rounded-lg overflow-hidden',
    theme === 'dark' 
      ? 'bg-gray-900'
      : theme === 'colored'
      ? 'bg-gradient-to-br from-blue-50 to-purple-50'
      : 'bg-gray-100'
  )

  const controlsClass = cn(
    'absolute bottom-0 left-0 right-0 p-4 transition-opacity',
    theme === 'dark' 
      ? 'bg-gradient-to-t from-gray-900 to-transparent'
      : 'bg-gradient-to-t from-gray-900 to-transparent'
  )

  const buttonClass = cn(
    'p-2 rounded-full transition',
    theme === 'dark' 
      ? 'text-white hover:bg-gray-800'
      : 'text-white hover:bg-gray-800'
  )

  if (layout === 'minimal') {
    return (
      <div className={containerClass}>
        <div className={getAspectRatioClass()}>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => {
              setIsPlaying(false)
              onEnded?.()
            }}
            preload={preload}
            loop={loop}
            muted={muted}
            autoPlay={autoplay}
          />
          
          {/* Play/Pause Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center transition',
                theme === 'dark' 
                  ? 'bg-gray-800 bg-opacity-80 text-white hover:bg-opacity-100'
                  : 'bg-gray-800 bg-opacity-80 text-white hover:bg-opacity-100'
              )}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </button>
          </div>

          {/* Minimal Controls */}
          {showControls && (
            <div className={controlsClass}>
              <div className="flex items-center gap-2">
                <button
                  onClick={isPlaying ? handlePause : handlePlay}
                  className={buttonClass}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
                
                {showProgress && (
                  <div className="flex-1 mx-2">
                    <input
                      type="range"
                      min="0"
                      max={videoRef.current?.duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                )}
                
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(videoRef.current?.duration || 0)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (layout === 'cinema') {
    return (
      <div className={containerClass}>
        <div className={getAspectRatioClass()}>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => {
              setIsPlaying(false)
              onEnded?.()
            }}
            preload={preload}
            loop={loop}
            muted={muted}
            autoPlay={autoplay}
          />
          
          {/* Cinema Controls */}
          {showControls && (
            <div className={controlsClass}>
              <div className="space-y-4">
                {/* Progress Bar */}
                {showProgress && (
                  <div>
                    <input
                      type="range"
                      min="0"
                      max={videoRef.current?.duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                )}
                
                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={isPlaying ? handlePause : handlePlay}
                      className={buttonClass}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                    
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(videoRef.current?.duration || 0)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {showVolume && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleMute}
                          className={buttonClass}
                        >
                          {isMuted ? (
                            <VolumeX className="w-5 h-5" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                        </button>
                        
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    )}
                    
                    {showPlaybackSpeed && (
                      <div className="relative">
                        <button
                          onClick={() => setShowSettings(!showSettings)}
                          className={buttonClass}
                        >
                          <span className="text-sm font-medium">{playbackRate}x</span>
                        </button>
                        
                        {showSettings && (
                          <div className="absolute bottom-12 right-0 bg-gray-800 rounded-lg p-2 space-y-1">
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                              <button
                                key={rate}
                                onClick={() => {
                                  handlePlaybackRateChange(rate)
                                  setShowSettings(false)
                                }}
                                className={cn(
                                  'block w-full text-left px-3 py-1 rounded text-sm transition',
                                  playbackRate === rate
                                    ? 'bg-blue-600 text-white'
                                    : 'text-white hover:bg-gray-700'
                                )}
                              >
                                {rate}x
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {showFullscreen && (
                      <button
                        onClick={handleFullscreen}
                        className={buttonClass}
                      >
                        <span className="text-sm">⛶</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (layout === 'compact') {
    return (
      <div className={containerClass}>
        <div className="flex gap-4">
          <div className="w-32 h-20 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              className="w-full h-full object-cover"
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => {
                setIsPlaying(false)
                onEnded?.()
              }}
              preload={preload}
              loop={loop}
              muted={muted}
              autoPlay={autoplay}
            />
          </div>
          
          <div className="flex-1">
            {showTitle && (
              <h3 className={cn('font-medium mb-1', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
                {title}
              </h3>
            )}
            
            {showDescription && (
              <p className={cn('text-sm mb-2', theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                {description}
              </p>
            )}
            
            <div className="flex items-center gap-2">
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className={cn(
                  'p-1 rounded-full transition',
                  theme === 'dark' 
                    ? 'text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
              
              <span className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                {formatTime(currentTime)} / {formatTime(videoRef.current?.duration || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Default layout
  return (
    <div className={containerClass}>
      <div className={getAspectRatioClass()}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            setIsPlaying(false)
            onEnded?.()
          }}
          preload={preload}
          loop={loop}
          muted={muted}
          autoPlay={autoplay}
        />
        
        {/* Default Controls */}
        {showControls && (
          <div className={controlsClass}>
            <div className="space-y-4">
              {/* Progress Bar */}
              {showProgress && (
                <div>
                  <input
                    type="range"
                    min="0"
                    max={videoRef.current?.duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
              
              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={isPlaying ? handlePause : handlePlay}
                    className={buttonClass}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                  
                  <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(videoRef.current?.duration || 0)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  {showVolume && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleMute}
                        className={buttonClass}
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5" />
                        ) : (
                          <Volume2 className="w-5 h-5" />
                        )}
                      </button>
                      
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  )}
                  
                  {showPlaybackSpeed && (
                    <div className="relative">
                      <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={buttonClass}
                      >
                        <span className="text-sm font-medium">{playbackRate}x</span>
                      </button>
                      
                      {showSettings && (
                        <div className="absolute bottom-12 right-0 bg-gray-800 rounded-lg p-2 space-y-1">
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => {
                                handlePlaybackRateChange(rate)
                                setShowSettings(false)
                              }}
                              className={cn(
                                'block w-full text-left px-3 py-1 rounded text-sm transition',
                                playbackRate === rate
                                  ? 'bg-blue-600 text-white'
                                  : 'text-white hover:bg-gray-700'
                              )}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {showFullscreen && (
                    <button
                      onClick={handleFullscreen}
                      className={buttonClass}
                    >
                      <span className="text-sm">⛶</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Video Info */}
      {(showTitle || showDescription) && (
        <div className="p-4">
          {showTitle && (
            <h3 className={cn('font-semibold mb-2', theme === 'dark' ? 'text-white' : 'text-gray-900')}>
              {title}
            </h3>
          )}
          
          {showDescription && (
            <p className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// Component configuration for editor
export const VideoPlayerConfig = {
  id: 'video-player',
  name: 'Video Player',
  description: 'Customizable video player with controls and multiple layouts',
  category: 'media' as const,
  icon: 'play',
  defaultProps: {
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=450&fit=crop',
    title: 'Video Title',
    description: 'Video description goes here',
    duration: 0,
    showControls: true,
    showTitle: true,
    showDescription: true,
    showProgress: true,
    showVolume: true,
    showFullscreen: true,
    showPlaybackSpeed: true,
    showQuality: true,
    showSubtitles: true,
    autoplay: false,
    loop: false,
    muted: false,
    preload: 'metadata',
    aspectRatio: '16:9',
    layout: 'default',
    theme: 'light'
  },
  defaultSize: { width: 100, height: 400 },
  editableFields: [
    'src',
    'poster',
    'title',
    'description',
    'duration',
    'showControls',
    'showTitle',
    'showDescription',
    'showProgress',
    'showVolume',
    'showFullscreen',
    'showPlaybackSpeed',
    'showQuality',
    'showSubtitles',
    'autoplay',
    'loop',
    'muted',
    'preload',
    'aspectRatio',
    'layout',
    'theme'
  ]
}
