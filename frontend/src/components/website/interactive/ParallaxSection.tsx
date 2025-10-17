'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface ParallaxSectionProps {
  backgroundImage: string
  speed?: number // 0-1, where 0 = no movement, 1 = full movement
  children: React.ReactNode
  height?: number
  overlay?: boolean
  overlayColor?: string
  overlayOpacity?: number
  className?: string
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  backgroundImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
  speed = 0.5,
  children = <div className="text-center text-white"><h2 className="text-4xl font-bold">Parallax Section</h2><p className="text-xl mt-4">Scroll to see the parallax effect</p></div>,
  height = 600,
  overlay = true,
  overlayColor = '#000000',
  overlayOpacity = 0.4,
  className
}) => {
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return

      const scrolled = window.pageYOffset
      const rate = scrolled * -speed
      
      parallaxRef.current.style.transform = `translateY(${rate}px)`
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ height: `${height}px` }}
    >
      {/* Background Image */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          height: `${height + height * speed}px`,
          top: `-${height * speed / 2}px`
        }}
      />

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

// Component configuration for editor
export const ParallaxSectionConfig = {
  id: 'parallax-section',
  name: 'Parallax Section',
  description: 'Section with parallax scrolling background effect',
  category: 'interactive' as const,
  icon: 'layers',
  defaultProps: {
    backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
    speed: 0.5,
    children: '<div class="text-center text-white"><h2 class="text-4xl font-bold">Parallax Section</h2><p class="text-xl mt-4">Scroll to see the parallax effect</p></div>',
    height: 600,
    overlay: true,
    overlayColor: '#000000',
    overlayOpacity: 0.4
  },
  defaultSize: { width: 100, height: 600 },
  editableFields: [
    'backgroundImage',
    'speed',
    'children',
    'height',
    'overlay',
    'overlayColor',
    'overlayOpacity'
  ]
}
