'use client'

import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Building, Globe, Calendar, Clock, CheckCircle, Star, DollarSign, CreditCard, MessageSquare, FileText, Shield, Lock, Heart, ThumbsUp, Share2, Bookmark, Play, Pause, Volume2, VolumeX, Music, Mic, MicOff, Headphones } from '@/lib/icons'
import { cn } from '@/lib/utils'

export interface AudioPlayerProps {
  src: string
  title?: string
  artist?: string
  album?: string
  cover?: string
  duration?: number
  showControls?: boolean
  showTitle?: boolean
  showArtist?: boolean
  showAlbum?: boolean
  showCover?: boolean
  showProgress?: boolean
  showVolume?: boolean
  showPlaylist?: boolean
  showLyrics?: boolean
  showDownload?: boolean
  showShare?: boolean
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  preload?: 'none' | 'metadata' | 'auto'
  layout?: 'default' | 'minimal' | 'compact' | 'card'
  theme?: 'light' | 'dark' | 'colored'
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onTimeUpdate?: (currentTime: number) => void
  onVolumeChange?: (volume: number) => void
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  title = 'Audio Title',
  artist = 'Artist Name',
  album = 'Album Name',
  cover = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
  duration = 0,
  showControls = true,
  showTitle = true,
  showArtist = true,
  showAlbum = true,
  showCover = true,
  showProgress = true,
  showVolume = true,
  showPlaylist = false,
  showLyrics = false,
  showDownload = false,
  showShare = false,
  autoplay = false,
  loop = false,
  muted = false,
  preload = 'metadata',
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
  const [isShuffled, setIsShuffled] = useState(false)
  const [isRepeated, setIsRepeated] = useState(false)
  const [showLyricsPanel, setShowLyricsPanel] = useState(false)

  const audioRef = React.useRef<HTMLAudioElement>(null)

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
      onPlay?.()
    }
  }

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      onPause?.()
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime
      setCurrentTime(time)
      onTimeUpdate?.(time)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const time = parseFloat(e.target.value)
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
      onVolumeChange?.(newVolume)
    }
  }

  const handleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const handleShuffle = () => {
    setIsShuffled(!isShuffled)
  }

  const handleRepeat = () => {
    setIsRepeated(!isRepeated)
    if (audioRef.current) {
      audioRef.current.loop = !isRepeated
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const containerClass = cn(
    'rounded-lg border p-4',
    theme === 'dark' 
      ? 'bg-gray-900 border-gray-700'
      : theme === 'colored'
      ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
      : 'bg-white border-gray-200'
  )

  const buttonClass = cn(
    'p-2 rounded-full transition',
    theme === 'dark' 
      ? 'text-white hover:bg-gray-800'
      : 'text-gray-600 hover:bg-gray-100'
  )

  const activeButtonClass = cn(
    'p-2 rounded-full transition',
    theme === 'dark' 
      ? 'text-blue-400 bg-blue-900'
      : 'text-blue-600 bg-blue-100'
  )

  const textClass = cn(
    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
  )

  const secondaryTextClass = cn(
    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  )

  if (layout === 'minimal') {
    return (
      <div className={containerClass}>
        <div className="flex items-center gap-3">
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition',
              theme === 'dark' 
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
          
          <div className="flex-1">
            {showTitle && (
              <h4 className={cn('font-medium text-sm', textClass)}>{title}</h4>
            )}
            {showArtist && (
              <p className={cn('text-xs', secondaryTextClass)}>{artist}</p>
            )}
          </div>
          
          <span className={cn('text-xs', secondaryTextClass)}>
            {formatTime(currentTime)} / {formatTime(audioRef.current?.duration || 0)}
          </span>
        </div>
      </div>
    )
  }

  if (layout === 'compact') {
    return (
      <div className={containerClass}>
        <div className="flex items-center gap-4">
          {showCover && (
            <img
              src={cover}
              alt={title}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
          
          <div className="flex-1">
            {showTitle && (
              <h4 className={cn('font-medium text-sm', textClass)}>{title}</h4>
            )}
            {showArtist && (
              <p className={cn('text-xs', secondaryTextClass)}>{artist}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className={buttonClass}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
            
            {showVolume && (
              <button
                onClick={handleMute}
                className={buttonClass}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (layout === 'card') {
    return (
      <div className={containerClass}>
        <div className="text-center mb-4">
          {showCover && (
            <img
              src={cover}
              alt={title}
              className="w-32 h-32 rounded-lg object-cover mx-auto mb-4"
            />
          )}
          
          {showTitle && (
            <h3 className={cn('font-semibold text-lg mb-1', textClass)}>{title}</h3>
          )}
          
          {showArtist && (
            <p className={cn('text-sm mb-1', secondaryTextClass)}>{artist}</p>
          )}
          
          {showAlbum && (
            <p className={cn('text-xs', secondaryTextClass)}>{album}</p>
          )}
        </div>
        
        {showControls && (
          <div className="space-y-4">
            {/* Progress Bar */}
            {showProgress && (
              <div>
                <input
                  type="range"
                  min="0"
                  max={audioRef.current?.duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(audioRef.current?.duration || 0)}</span>
                </div>
              </div>
            )}
            
            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleShuffle}
                className={cn(
                  isShuffled ? activeButtonClass : buttonClass
                )}
              >
                <span className="text-sm">🔀</span>
              </button>
              
              <button
                onClick={handleRepeat}
                className={cn(
                  isRepeated ? activeButtonClass : buttonClass
                )}
              >
                <span className="text-sm">🔁</span>
              </button>
              
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center transition',
                  theme === 'dark' 
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" />
                )}
              </button>
              
              {showVolume && (
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
              )}
            </div>
            
            {/* Volume Slider */}
            {showVolume && (
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-gray-500" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-500">{Math.round(volume * 100)}%</span>
              </div>
            )}
            
            {/* Additional Actions */}
            <div className="flex items-center justify-center gap-4">
              {showLyrics && (
                <button
                  onClick={() => setShowLyricsPanel(!showLyricsPanel)}
                  className={buttonClass}
                >
                  <span className="text-sm">📝</span>
                </button>
              )}
              
              {showDownload && (
                <button className={buttonClass}>
                  <span className="text-sm">⬇️</span>
                </button>
              )}
              
              {showShare && (
                <button className={buttonClass}>
                  <Share2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Lyrics Panel */}
        {showLyricsPanel && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h4 className={cn('font-medium mb-2', textClass)}>Lyrics</h4>
            <p className={cn('text-sm', secondaryTextClass)}>
              Lyrics will be displayed here when available.
            </p>
          </div>
        )}
      </div>
    )
  }

  // Default layout
  return (
    <div className={containerClass}>
      <div className="flex items-center gap-4">
        {showCover && (
          <img
            src={cover}
            alt={title}
            className="w-16 h-16 rounded-lg object-cover"
          />
        )}
        
        <div className="flex-1">
          {showTitle && (
            <h4 className={cn('font-medium', textClass)}>{title}</h4>
          )}
          
          {showArtist && (
            <p className={cn('text-sm', secondaryTextClass)}>{artist}</p>
          )}
          
          {showAlbum && (
            <p className={cn('text-xs', secondaryTextClass)}>{album}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className={cn(
              isShuffled ? activeButtonClass : buttonClass
            )}
          >
            <span className="text-sm">🔀</span>
          </button>
          
          <button
            onClick={handleRepeat}
            className={cn(
              isRepeated ? activeButtonClass : buttonClass
            )}
          >
            <span className="text-sm">🔁</span>
          </button>
          
          <button
            onClick={isPlaying ? handlePause : handlePlay}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition',
              theme === 'dark' 
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
          
          {showVolume && (
            <button
              onClick={handleMute}
              className={buttonClass}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
      
      {showControls && (
        <div className="mt-4 space-y-3">
          {/* Progress Bar */}
          {showProgress && (
            <div>
              <input
                type="range"
                min="0"
                max={audioRef.current?.duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(audioRef.current?.duration || 0)}</span>
              </div>
            </div>
          )}
          
          {/* Volume Slider */}
          {showVolume && (
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-gray-500">{Math.round(volume * 100)}%</span>
            </div>
          )}
          
          {/* Additional Actions */}
          <div className="flex items-center justify-center gap-4">
            {showLyrics && (
              <button
                onClick={() => setShowLyricsPanel(!showLyricsPanel)}
                className={buttonClass}
              >
                <span className="text-sm">📝</span>
              </button>
            )}
            
            {showDownload && (
              <button className={buttonClass}>
                <span className="text-sm">⬇️</span>
              </button>
            )}
            
            {showShare && (
              <button className={buttonClass}>
                <Share2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Lyrics Panel */}
      {showLyricsPanel && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h4 className={cn('font-medium mb-2', textClass)}>Lyrics</h4>
          <p className={cn('text-sm', secondaryTextClass)}>
            Lyrics will be displayed here when available.
          </p>
        </div>
      )}
      
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={src}
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
  )
}

// Component configuration for editor
export const AudioPlayerConfig = {
  id: 'audio-player',
  name: 'Audio Player',
  description: 'Customizable audio player with controls and multiple layouts',
  category: 'media' as const,
  icon: 'music',
  defaultProps: {
    src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    title: 'Audio Title',
    artist: 'Artist Name',
    album: 'Album Name',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    duration: 0,
    showControls: true,
    showTitle: true,
    showArtist: true,
    showAlbum: true,
    showCover: true,
    showProgress: true,
    showVolume: true,
    showPlaylist: false,
    showLyrics: false,
    showDownload: false,
    showShare: false,
    autoplay: false,
    loop: false,
    muted: false,
    preload: 'metadata',
    layout: 'default',
    theme: 'light'
  },
  defaultSize: { width: 100, height: 200 },
  editableFields: [
    'src',
    'title',
    'artist',
    'album',
    'cover',
    'duration',
    'showControls',
    'showTitle',
    'showArtist',
    'showAlbum',
    'showCover',
    'showProgress',
    'showVolume',
    'showPlaylist',
    'showLyrics',
    'showDownload',
    'showShare',
    'autoplay',
    'loop',
    'muted',
    'preload',
    'layout',
    'theme'
  ]
}
