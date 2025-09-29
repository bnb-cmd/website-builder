'use client'

import React, { createContext, useContext, useRef, useState, useCallback } from 'react'
import { useTouchInteractions } from '@/hooks/use-touch-interactions'
import { cn } from '@/lib/utils'

interface GestureContextType {
  registerElement: (id: string, element: HTMLElement, options?: any) => () => void
  unregisterElement: (id: string) => void
  triggerHapticFeedback: (pattern?: number | number[]) => void
  isTouchDevice: boolean
}

const GestureContext = createContext<GestureContextType | null>(null)

export function useGestureContext() {
  const context = useContext(GestureContext)
  if (!context) {
    throw new Error('useGestureContext must be used within a GestureProvider')
  }
  return context
}

interface GestureProviderProps {
  children: React.ReactNode
  enableHapticFeedback?: boolean
}

export function GestureProvider({
  children,
  enableHapticFeedback = true
}: GestureProviderProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const registeredElements = useRef<Map<string, { element: HTMLElement; cleanup: () => void }>>(new Map())

  React.useEffect(() => {
    // Detect touch device
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    setIsTouchDevice(hasTouch)
  }, [])

  const triggerHapticFeedback = useCallback((pattern: number | number[] = 50) => {
    if (!enableHapticFeedback || !isTouchDevice) return

    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }, [enableHapticFeedback, isTouchDevice])

  const registerElement = useCallback((id: string, element: HTMLElement, options?: any) => {
    // Clean up existing registration
    unregisterElement(id)

    // Register new element with touch interactions
    const cleanup = () => {
      // This would be implemented with specific gesture handling
      console.log(`Registered element ${id} for gestures`)
    }

    registeredElements.current.set(id, { element, cleanup })

    return () => unregisterElement(id)
  }, [])

  const unregisterElement = useCallback((id: string) => {
    const registration = registeredElements.current.get(id)
    if (registration) {
      registration.cleanup()
      registeredElements.current.delete(id)
    }
  }, [])

  const contextValue: GestureContextType = {
    registerElement,
    unregisterElement,
    triggerHapticFeedback,
    isTouchDevice
  }

  return (
    <GestureContext.Provider value={contextValue}>
      {children}
    </GestureContext.Provider>
  )
}

interface GestureZoneProps {
  id?: string
  children: React.ReactNode
  className?: string
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void
  onPinch?: (scale: number, center: { x: number; y: number }) => void
  onLongPress?: () => void
  onDoubleTap?: () => void
  swipeThreshold?: number
  enableHapticFeedback?: boolean
}

export function GestureZone({
  id,
  children,
  className,
  onSwipe,
  onPinch,
  onLongPress,
  onDoubleTap,
  swipeThreshold = 50,
  enableHapticFeedback = true
}: GestureZoneProps) {
  const zoneRef = useRef<HTMLDivElement>(null)
  const { triggerHapticFeedback: contextHapticFeedback } = useGestureContext()

  const triggerHaptic = useCallback(() => {
    if (enableHapticFeedback) {
      contextHapticFeedback()
    }
  }, [enableHapticFeedback, contextHapticFeedback])

  useTouchInteractions(
    zoneRef,
    {
      enableSwipe: !!onSwipe,
      enablePinch: !!onPinch,
      enableLongPress: !!onLongPress,
      enableDoubleTap: !!onDoubleTap,
      swipeThreshold
    },
    {
      onSwipe: (gesture) => {
        onSwipe?.(gesture.direction)
        triggerHaptic()
      },
      onPinch: (pinch) => {
        onPinch?.(pinch.scale, pinch.center)
        triggerHaptic()
      },
      onLongPress: () => {
        onLongPress?.()
        triggerHaptic()
      },
      onDoubleTap: () => {
        onDoubleTap?.()
        triggerHaptic()
      }
    }
  )

  return (
    <div
      ref={zoneRef}
      className={cn(
        'touch-manipulation', // Optimize for touch interactions
        className
      )}
      data-gesture-zone={id}
    >
      {children}
    </div>
  )
}

interface SwipeActionProps {
  children: React.ReactNode
  leftAction?: {
    icon: React.ReactNode
    label: string
    onAction: () => void
    color?: string
  }
  rightAction?: {
    icon: React.ReactNode
    label: string
    onAction: () => void
    color?: string
  }
  threshold?: number
  className?: string
}

export function SwipeAction({
  children,
  leftAction,
  rightAction,
  threshold = 80,
  className
}: SwipeActionProps) {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useTouchInteractions(
    containerRef,
    { enableSwipe: true, swipeThreshold: 20 },
    {
      onTouchStart: () => {
        setIsDragging(true)
      },
      onTouchMove: (points) => {
        if (points.length === 1 && isDragging) {
          const deltaX = points[0].x - (containerRef.current?.getBoundingClientRect().left || 0)
          setSwipeOffset(Math.max(-threshold, Math.min(threshold, deltaX)))
        }
      },
      onTouchEnd: () => {
        setIsDragging(false)
        if (Math.abs(swipeOffset) > threshold / 2) {
          if (swipeOffset > 0 && leftAction) {
            leftAction.onAction()
          } else if (swipeOffset < 0 && rightAction) {
            rightAction.onAction()
          }
        }
        setSwipeOffset(0)
      }
    }
  )

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Action backgrounds */}
      {leftAction && (
        <div
          className="absolute inset-y-0 left-0 flex items-center justify-end pr-4"
          style={{
            backgroundColor: leftAction.color || '#10b981',
            width: Math.max(0, swipeOffset),
            transform: `translateX(${Math.min(0, swipeOffset - threshold)}px)`
          }}
        >
          <div className="flex items-center space-x-2 text-white">
            <span className="text-sm font-medium">{leftAction.label}</span>
            {leftAction.icon}
          </div>
        </div>
      )}

      {rightAction && (
        <div
          className="absolute inset-y-0 right-0 flex items-center justify-start pl-4"
          style={{
            backgroundColor: rightAction.color || '#ef4444',
            width: Math.max(0, -swipeOffset),
            transform: `translateX(${Math.max(0, swipeOffset + threshold)}px)`
          }}
        >
          <div className="flex items-center space-x-2 text-white">
            {rightAction.icon}
            <span className="text-sm font-medium">{rightAction.label}</span>
          </div>
        </div>
      )}

      {/* Main content */}
      <div
        ref={containerRef}
        className="relative bg-background transition-transform duration-200 ease-out touch-pan-x"
        style={{
          transform: `translateX(${swipeOffset}px)`
        }}
      >
        {children}
      </div>
    </div>
  )
}

interface LongPressMenuProps {
  children: React.ReactNode
  items: Array<{
    label: string
    icon?: React.ReactNode
    onClick: () => void
    destructive?: boolean
  }>
  className?: string
}

export function LongPressMenu({ children, items, className }: LongPressMenuProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleLongPress = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setMenuPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      })
      setShowMenu(true)
    }
  }, [])

  const handleMenuItemClick = useCallback((onClick: () => void) => {
    onClick()
    setShowMenu(false)
  }, [])

  useTouchInteractions(
    containerRef,
    { enableLongPress: true },
    {
      onLongPress: handleLongPress
    }
  )

  React.useEffect(() => {
    const handleClickOutside = () => setShowMenu(false)
    if (showMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showMenu])

  return (
    <>
      <div ref={containerRef} className={className}>
        {children}
      </div>

      {showMenu && (
        <div
          className="fixed z-50 bg-popover border rounded-lg shadow-lg p-2 min-w-[160px]"
          style={{
            left: menuPosition.x,
            top: menuPosition.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuItemClick(item.onClick)}
              className={cn(
                'w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors',
                'hover:bg-accent focus:bg-accent focus:outline-none',
                item.destructive && 'text-red-600 hover:bg-red-50 focus:bg-red-50'
              )}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </>
  )
}
