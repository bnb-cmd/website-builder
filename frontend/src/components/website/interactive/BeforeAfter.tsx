'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface BeforeAfterProps {
  beforeImage: string
  afterImage: string
  defaultPosition?: number // 0-100 percentage
  orientation?: 'horizontal' | 'vertical'
  showLabels?: boolean
  beforeLabel?: string
  afterLabel?: string
  handleColor?: string
  lineColor?: string
}

export const BeforeAfter: React.FC<BeforeAfterProps> = ({
  beforeImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  afterImage = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  defaultPosition = 50,
  orientation = 'horizontal',
  showLabels = true,
  beforeLabel = 'Before',
  afterLabel = 'After',
  handleColor = '#3B82F6',
  lineColor = '#FFFFFF'
}) => {
  const [position, setPosition] = useState(defaultPosition)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    updatePosition(e)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updatePosition(e)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const updatePosition = (e: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    let newPosition: number

    if (orientation === 'horizontal') {
      newPosition = ((e.clientX - rect.left) / rect.width) * 100
    } else {
      newPosition = ((e.clientY - rect.top) / rect.height) * 100
    }

    newPosition = Math.max(0, Math.min(100, newPosition))
    setPosition(newPosition)
  }

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    updatePositionTouch(e)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      e.preventDefault()
      updatePositionTouch(e)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const updatePositionTouch = (e: React.TouchEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    let newPosition: number

    if (orientation === 'horizontal') {
      newPosition = ((touch.clientX - rect.left) / rect.width) * 100
    } else {
      newPosition = ((touch.clientY - rect.top) / rect.height) * 100
    }

    newPosition = Math.max(0, Math.min(100, newPosition))
    setPosition(newPosition)
  }

  // Global mouse events
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        let newPosition: number

        if (orientation === 'horizontal') {
          newPosition = ((e.clientX - rect.left) / rect.width) * 100
        } else {
          newPosition = ((e.clientY - rect.top) / rect.height) * 100
        }

        newPosition = Math.max(0, Math.min(100, newPosition))
        setPosition(newPosition)
      }
    }

    const handleGlobalMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging, orientation])

  const containerClasses = cn(
    'relative overflow-hidden rounded-lg cursor-col-resize select-none',
    orientation === 'vertical' && 'cursor-row-resize'
  )

  const clipPath = orientation === 'horizontal' 
    ? `inset(0 ${100 - position}% 0 0)`
    : `inset(${100 - position}% 0 0 0)`

  const handlePosition = orientation === 'horizontal' 
    ? { left: `${position}%` }
    : { top: `${position}%` }

  const handleClasses = cn(
    'absolute w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing',
    orientation === 'vertical' && 'transform -translate-x-1/2 -translate-y-1/2'
  )

  const lineClasses = cn(
    'absolute bg-white shadow-sm',
    orientation === 'horizontal' 
      ? 'w-px h-full top-0'
      : 'h-px w-full left-0'
  )

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className={containerClasses}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ aspectRatio: '16/9' }}
      >
        {/* Before Image */}
        <div className="absolute inset-0">
          <img
            src={beforeImage}
            alt="Before"
            className="w-full h-full object-cover"
          />
        </div>

        {/* After Image */}
        <div 
          className="absolute inset-0"
          style={{ clipPath }}
        >
          <img
            src={afterImage}
            alt="After"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Divider Line */}
        <div
          className={lineClasses}
          style={{
            ...handlePosition,
            backgroundColor: lineColor
          }}
        />

        {/* Handle */}
        <div
          className={handleClasses}
          style={{
            ...handlePosition,
            borderColor: handleColor
          }}
        >
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: handleColor }}
          />
        </div>

        {/* Labels */}
        {showLabels && (
          <>
            <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-sm font-medium">
              {beforeLabel}
            </div>
            <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-sm font-medium">
              {afterLabel}
            </div>
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-2 text-center text-sm text-gray-600">
        {orientation === 'horizontal' 
          ? 'Drag left or right to compare images'
          : 'Drag up or down to compare images'
        }
      </div>
    </div>
  )
}

// Component configuration for editor
export const BeforeAfterConfig = {
  id: 'before-after',
  name: 'Before/After Comparison',
  description: 'Interactive image comparison slider',
  category: 'interactive' as const,
  icon: 'arrow-left-right',
  defaultProps: {
    beforeImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    defaultPosition: 50,
    orientation: 'horizontal',
    showLabels: true,
    beforeLabel: 'Before',
    afterLabel: 'After',
    handleColor: '#3B82F6',
    lineColor: '#FFFFFF'
  },
  defaultSize: { width: 100, height: 400 },
  editableFields: [
    'beforeImage',
    'afterImage',
    'defaultPosition',
    'orientation',
    'showLabels',
    'beforeLabel',
    'afterLabel',
    'handleColor',
    'lineColor'
  ]
}
