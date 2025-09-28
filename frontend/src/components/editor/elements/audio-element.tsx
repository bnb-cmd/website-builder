'use client'

import { Element } from '@/types/editor'
import { Music, Play, Pause, Volume2 } from 'lucide-react'
import { useRef, useState } from 'react'

interface AudioElementProps {
  element: Element
  isSelected: boolean
  onSelect: () => void
}

export function AudioElement({ element, isSelected, onSelect }: AudioElementProps) {
  const { 
    src = '', 
    title = 'Audio Player',
    artist = 'Unknown Artist',
    cover = '',
    autoplay = false,
    loop = false,
    showControls = true,
    showVisualization = false
  } = element.props

  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.volume = vol
      setVolume(vol)
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!src) {
    return (
      <div
        onClick={onSelect}
        className={`
          p-8 cursor-pointer transition-all border-2 border-dashed border-muted-foreground/50
          ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
        `}
      >
        <div className="text-center">
          <Music className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Add audio URL to display player
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={onSelect}
      className={`
        p-4 cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
    >
      <audio
        ref={audioRef}
        src={src}
        autoPlay={autoplay}
        loop={loop}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onLoadedMetadata={handleTimeUpdate}
        className="hidden"
      />

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-4">
          {/* Album Cover */}
          <div className="flex-shrink-0">
            {cover ? (
              <img
                src={cover}
                alt={title}
                className="w-16 h-16 rounded object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-primary/10 rounded flex items-center justify-center">
                <Music className="h-8 w-8 text-primary" />
              </div>
            )}
          </div>

          {/* Player Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{title}</h3>
            <p className="text-sm text-muted-foreground truncate">{artist}</p>
            
            {showControls && (
              <>
                {/* Progress Bar */}
                <div className="mt-2">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, hsl(var(--primary)) ${(currentTime / duration) * 100}%, hsl(var(--muted)) ${(currentTime / duration) * 100}%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePlayPause()
                    }}
                    className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </button>

                  {/* Volume Control */}
                  <div className="flex items-center gap-2 ml-auto">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      onClick={(e) => e.stopPropagation()}
                      className="w-20 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {showVisualization && (
          <div className="mt-4 h-16 bg-muted/50 rounded flex items-end justify-center gap-1 p-2">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-primary rounded-sm transition-all duration-300"
                style={{
                  height: `${isPlaying ? Math.random() * 100 : 20}%`,
                  opacity: isPlaying ? 1 : 0.3
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
