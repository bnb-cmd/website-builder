'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface ImageHotspotProps {
  image: string
  hotspots: Array<{
    id: string
    x: number // percentage
    y: number // percentage
    title: string
    description: string
    color?: string
    size?: 'sm' | 'md' | 'lg'
  }>
  hotspotColor?: string
  showTooltip?: boolean
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  imageAlt?: string
}

export const ImageHotspot: React.FC<ImageHotspotProps> = ({
  image = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  hotspots = [
    { id: '1', x: 30, y: 40, title: 'Feature 1', description: 'This is the first feature' },
    { id: '2', x: 70, y: 60, title: 'Feature 2', description: 'This is the second feature' }
  ],
  hotspotColor = '#3B82F6',
  showTooltip = true,
  tooltipPosition = 'top',
  imageAlt = 'Interactive image with hotspots'
}) => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const handleHotspotClick = (hotspotId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setActiveHotspot(activeHotspot === hotspotId ? null : hotspotId)
    
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect()
      setTooltipPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      })
    }
  }

  const handleImageClick = () => {
    setActiveHotspot(null)
  }

  const getTooltipClasses = (position: string) => {
    const baseClasses = 'absolute z-10 bg-black text-white px-3 py-2 rounded-lg text-sm max-w-xs shadow-lg'
    
    switch (position) {
      case 'top':
        return `${baseClasses} -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full`
      case 'bottom':
        return `${baseClasses} -bottom-2 left-1/2 transform -translate-x-1/2 translate-y-full`
      case 'left':
        return `${baseClasses} -left-2 top-1/2 transform -translate-x-full -translate-y-1/2`
      case 'right':
        return `${baseClasses} -right-2 top-1/2 transform translate-x-full -translate-y-1/2`
      default:
        return baseClasses
    }
  }

  return (
    <div className="relative w-full">
      <div
        ref={imageRef}
        className="relative w-full cursor-pointer"
        onClick={handleImageClick}
        style={{ aspectRatio: '16/9' }}
      >
        {/* Main Image */}
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover rounded-lg"
        />

        {/* Hotspots */}
        {hotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            className="absolute group cursor-pointer"
            style={{
              left: `${hotspot.x}%`,
              top: `${hotspot.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={(e) => handleHotspotClick(hotspot.id, e)}
          >
            {/* Hotspot Button */}
            <div
              className={cn(
                'rounded-full border-2 border-white shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center',
                sizeClasses[hotspot.size || 'md'],
                activeHotspot === hotspot.id && 'ring-4 ring-blue-300'
              )}
              style={{
                backgroundColor: hotspot.color || hotspotColor
              }}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>

            {/* Tooltip */}
            {showTooltip && activeHotspot === hotspot.id && (
              <div className={getTooltipClasses(tooltipPosition)}>
                <div className="font-semibold mb-1">{hotspot.title}</div>
                <div className="text-gray-200">{hotspot.description}</div>
                
                {/* Tooltip Arrow */}
                <div
                  className={cn(
                    'absolute w-2 h-2 bg-black transform rotate-45',
                    tooltipPosition === 'top' && 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
                    tooltipPosition === 'bottom' && 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
                    tooltipPosition === 'left' && 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2',
                    tooltipPosition === 'right' && 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2'
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-2 text-center text-sm text-gray-600">
        Click on the dots to learn more
      </div>
    </div>
  )
}

// Component configuration for editor
export const ImageHotspotConfig = {
  id: 'image-hotspot',
  name: 'Image Hotspot',
  description: 'Interactive image with clickable hotspots and tooltips',
  category: 'interactive' as const,
  icon: 'map-pin',
  defaultProps: {
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    hotspots: [
      { id: '1', x: 30, y: 40, title: 'Feature 1', description: 'This is the first feature' },
      { id: '2', x: 70, y: 60, title: 'Feature 2', description: 'This is the second feature' }
    ],
    hotspotColor: '#3B82F6',
    showTooltip: true,
    tooltipPosition: 'top',
    imageAlt: 'Interactive image with hotspots'
  },
  defaultSize: { width: 100, height: 400 },
  editableFields: [
    'image',
    'hotspots',
    'hotspotColor',
    'showTooltip',
    'tooltipPosition',
    'imageAlt'
  ]
}
