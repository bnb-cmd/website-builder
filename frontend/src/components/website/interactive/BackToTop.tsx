'use client'

import React, { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BackToTopProps {
  showAfter?: number // pixels scrolled
  position?: 'left' | 'right'
  smooth?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: string
  backgroundColor?: string
  text?: string
  showText?: boolean
  icon?: React.ReactNode
}

export const BackToTop: React.FC<BackToTopProps> = ({
  showAfter = 300,
  position = 'right',
  smooth = true,
  size = 'md',
  color = '#FFFFFF',
  backgroundColor = '#3B82F6',
  text = 'Back to Top',
  showText = false,
  icon
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-14 h-14 text-lg'
  }

  const positionClasses = {
    left: 'left-6',
    right: 'right-6'
  }

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > showAfter) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [showAfter])

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } else {
      window.scrollTo(0, 0)
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-6 z-50 flex items-center justify-center rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110',
        sizeClasses[size],
        positionClasses[position],
        showText && 'px-4 py-2 rounded-full min-w-max'
      )}
      style={{
        backgroundColor,
        color
      }}
      aria-label="Back to top"
    >
      {icon || <ArrowUp className="w-5 h-5" />}
      {showText && (
        <span className="ml-2 font-medium">
          {text}
        </span>
      )}
    </button>
  )
}

// Component configuration for editor
export const BackToTopConfig = {
  id: 'back-to-top',
  name: 'Back to Top',
  description: 'Scroll-to-top button that appears after scrolling',
  category: 'interactive' as const,
  icon: 'arrow-up',
  defaultProps: {
    showAfter: 300,
    position: 'right',
    smooth: true,
    size: 'md',
    color: '#FFFFFF',
    backgroundColor: '#3B82F6',
    text: 'Back to Top',
    showText: false
  },
  defaultSize: { width: 50, height: 50 },
  editableFields: [
    'showAfter',
    'position',
    'smooth',
    'size',
    'color',
    'backgroundColor',
    'text',
    'showText'
  ]
}
