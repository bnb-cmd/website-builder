'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface LazyLoadProps {
  children: React.ReactNode
  threshold?: number // 0-1, percentage of element visible
  placeholder?: React.ReactNode
  rootMargin?: string // CSS margin for intersection observer
  once?: boolean // Load only once
  className?: string
}

export const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  threshold = 0.1,
  placeholder = <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>,
  rootMargin = '50px',
  once = true,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            setHasLoaded(true)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [threshold, rootMargin, once])

  const shouldShowContent = once ? hasLoaded : isVisible

  return (
    <div ref={elementRef} className={cn('w-full', className)}>
      {shouldShowContent ? children : placeholder}
    </div>
  )
}

// Component configuration for editor
export const LazyLoadConfig = {
  id: 'lazy-load',
  name: 'Lazy Load',
  description: 'Lazy loading wrapper for performance optimization',
  category: 'interactive' as const,
  icon: 'eye',
  defaultProps: {
    children: '<div class="p-8 text-center"><h3 class="text-2xl font-bold">Lazy Loaded Content</h3><p class="mt-4">This content loads when scrolled into view</p></div>',
    threshold: 0.1,
    placeholder: '<div class="w-full h-64 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center"><div class="text-gray-400">Loading...</div></div>',
    rootMargin: '50px',
    once: true
  },
  defaultSize: { width: 100, height: 200 },
  editableFields: [
    'children',
    'threshold',
    'placeholder',
    'rootMargin',
    'once'
  ]
}
