'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface StickyHeaderProps {
  children: React.ReactNode
  offset?: number
  shadow?: boolean
  backgroundColor?: string
  zIndex?: number
  className?: string
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({
  children,
  offset = 0,
  shadow = true,
  backgroundColor = '#FFFFFF',
  zIndex = 50,
  className
}) => {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      setIsSticky(scrollTop > offset)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [offset])

  return (
    <div
      className={cn(
        'transition-all duration-300',
        isSticky ? 'fixed top-0 left-0 right-0' : 'relative',
        shadow && isSticky && 'shadow-lg'
      )}
      style={{
        backgroundColor: isSticky ? backgroundColor : 'transparent',
        zIndex: isSticky ? zIndex : 'auto'
      }}
    >
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </div>
  )
}

// Component configuration for editor
export const StickyHeaderConfig = {
  id: 'sticky-header',
  name: 'Sticky Header',
  description: 'Header that sticks to top when scrolling',
  category: 'interactive' as const,
  icon: 'move',
  defaultProps: {
    children: '<div class="p-4 text-center bg-white">Sticky Header Content</div>',
    offset: 0,
    shadow: true,
    backgroundColor: '#FFFFFF',
    zIndex: 50
  },
  defaultSize: { width: 100, height: 80 },
  editableFields: [
    'children',
    'offset',
    'shadow',
    'backgroundColor',
    'zIndex'
  ]
}
