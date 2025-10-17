'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface ScrollProgressProps {
  position?: 'top' | 'bottom'
  color?: string
  height?: number
  backgroundColor?: string
  showPercentage?: boolean
  zIndex?: number
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  position = 'top',
  color = '#3B82F6',
  height = 4,
  backgroundColor = '#E5E7EB',
  showPercentage = false,
  zIndex = 1000
}) => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setScrollProgress(scrollPercent)
    }

    window.addEventListener('scroll', updateScrollProgress)
    return () => window.removeEventListener('scroll', updateScrollProgress)
  }, [])

  const positionClasses = {
    top: 'top-0',
    bottom: 'bottom-0'
  }

  return (
    <>
      {/* Progress Bar */}
      <div
        className={cn(
          'fixed left-0 right-0 z-50',
          positionClasses[position]
        )}
        style={{
          height: `${height}px`,
          backgroundColor,
          zIndex
        }}
      >
        <div
          className="h-full transition-all duration-150 ease-out"
          style={{
            width: `${scrollProgress}%`,
            backgroundColor: color
          }}
        />
      </div>

      {/* Percentage Display */}
      {showPercentage && (
        <div
          className={cn(
            'fixed z-50 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium',
            position === 'top' ? 'top-6 right-4' : 'bottom-6 right-4'
          )}
          style={{ zIndex: zIndex + 1 }}
        >
          {Math.round(scrollProgress)}%
        </div>
      )}
    </>
  )
}

// Component configuration for editor
export const ScrollProgressConfig = {
  id: 'scroll-progress',
  name: 'Scroll Progress',
  description: 'Reading progress indicator bar',
  category: 'interactive' as const,
  icon: 'bar-chart-3',
  defaultProps: {
    position: 'top',
    color: '#3B82F6',
    height: 4,
    backgroundColor: '#E5E7EB',
    showPercentage: false,
    zIndex: 1000
  },
  defaultSize: { width: 100, height: 4 },
  editableFields: [
    'position',
    'color',
    'height',
    'backgroundColor',
    'showPercentage',
    'zIndex'
  ]
}
