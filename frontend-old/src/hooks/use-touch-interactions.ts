import { useState, useEffect, useCallback, useRef } from 'react'

export interface TouchPoint {
  id: number
  x: number
  y: number
  timestamp: number
}

export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down'
  distance: number
  velocity: number
  duration: number
}

export interface PinchGesture {
  scale: number
  center: { x: number; y: number }
  rotation: number
}

export interface TouchInteractionOptions {
  enableSwipe?: boolean
  enablePinch?: boolean
  enableLongPress?: boolean
  enableDoubleTap?: boolean
  swipeThreshold?: number
  longPressDelay?: number
  doubleTapDelay?: number
}

export interface TouchInteractionCallbacks {
  onSwipe?: (gesture: SwipeGesture) => void
  onPinch?: (gesture: PinchGesture) => void
  onLongPress?: (point: TouchPoint) => void
  onDoubleTap?: (point: TouchPoint) => void
  onTouchStart?: (points: TouchPoint[]) => void
  onTouchMove?: (points: TouchPoint[]) => void
  onTouchEnd?: (points: TouchPoint[]) => void
}

export function useTouchInteractions(
  elementRef: React.RefObject<HTMLElement>,
  options: TouchInteractionOptions = {},
  callbacks: TouchInteractionCallbacks = {}
) {
  const {
    enableSwipe = true,
    enablePinch = true,
    enableLongPress = true,
    enableDoubleTap = true,
    swipeThreshold = 50,
    longPressDelay = 500,
    doubleTapDelay = 300
  } = options

  const [isTouching, setIsTouching] = useState(false)
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([])
  const [lastTap, setLastTap] = useState<TouchPoint | null>(null)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const initialPinchDistanceRef = useRef<number | null>(null)
  const initialPinchAngleRef = useRef<number | null>(null)

  // Convert TouchList to TouchPoint array
  const touchesToPoints = useCallback((touches: TouchList): TouchPoint[] => {
    return Array.from(touches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    }))
  }, [])

  // Calculate distance between two points
  const getDistance = useCallback((p1: TouchPoint, p2: TouchPoint): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
  }, [])

  // Calculate angle between two points
  const getAngle = useCallback((p1: TouchPoint, p2: TouchPoint): number => {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x)
  }, [])

  // Detect swipe gesture
  const detectSwipe = useCallback((start: TouchPoint, end: TouchPoint): SwipeGesture | null => {
    const deltaX = end.x - start.x
    const deltaY = end.y - start.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const duration = end.timestamp - start.timestamp
    const velocity = distance / duration

    if (distance < swipeThreshold) return null

    let direction: SwipeGesture['direction']
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left'
    } else {
      direction = deltaY > 0 ? 'down' : 'up'
    }

    return { direction, distance, velocity, duration }
  }, [swipeThreshold])

  // Detect pinch gesture
  const detectPinch = useCallback((points: TouchPoint[]): PinchGesture | null => {
    if (points.length !== 2) return null

    const [p1, p2] = points
    const distance = getDistance(p1, p2)
    const angle = getAngle(p1, p2)
    const center = {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2
    }

    if (initialPinchDistanceRef.current === null) {
      initialPinchDistanceRef.current = distance
      initialPinchAngleRef.current = angle
      return null
    }

    const scale = distance / initialPinchDistanceRef.current
    const rotation = angle - (initialPinchAngleRef.current || 0)

    return { scale, center, rotation }
  }, [getDistance, getAngle])

  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    const points = touchesToPoints(e.touches)
    setTouchPoints(points)
    setIsTouching(true)

    // Reset pinch detection
    initialPinchDistanceRef.current = null
    initialPinchAngleRef.current = null

    // Store touch start position for swipe detection
    if (points.length === 1) {
      touchStartRef.current = {
        x: points[0].x,
        y: points[0].y,
        time: Date.now()
      }
    }

    callbacks.onTouchStart?.(points)

    // Handle double tap detection
    if (enableDoubleTap && points.length === 1) {
      const currentTap = points[0]
      if (lastTap) {
        const timeDiff = currentTap.timestamp - lastTap.timestamp
        const distance = getDistance(currentTap, lastTap)

        if (timeDiff < doubleTapDelay && distance < 30) {
          callbacks.onDoubleTap?.(currentTap)
          setLastTap(null)
          return
        }
      }
      setLastTap(currentTap)
    }

    // Handle long press detection
    if (enableLongPress && points.length === 1) {
      const timer = setTimeout(() => {
        callbacks.onLongPress?.(points[0])
      }, longPressDelay)
      setLongPressTimer(timer)
    }
  }, [touchesToPoints, callbacks, enableDoubleTap, enableLongPress, lastTap, doubleTapDelay, getDistance, longPressDelay])

  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    const points = touchesToPoints(e.touches)
    setTouchPoints(points)

    callbacks.onTouchMove?.(points)

    // Clear long press timer on move
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }

    // Handle pinch gesture
    if (enablePinch && points.length === 2) {
      const pinch = detectPinch(points)
      if (pinch) {
        callbacks.onPinch?.(pinch)
      }
    }
  }, [touchesToPoints, callbacks, longPressTimer, enablePinch, detectPinch])

  // Handle touch end
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const remainingPoints = touchesToPoints(e.touches)

    // Clear timers
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }

    // Handle swipe gesture
    if (enableSwipe && touchStartRef.current && remainingPoints.length === 0 && touchPoints.length === 1) {
      const endPoint: TouchPoint = {
        id: touchPoints[0].id,
        x: touchPoints[0].x,
        y: touchPoints[0].y,
        timestamp: Date.now()
      }

      const startPoint: TouchPoint = {
        id: touchPoints[0].id,
        x: touchStartRef.current.x,
        y: touchStartRef.current.y,
        timestamp: touchStartRef.current.time
      }

      const swipe = detectSwipe(startPoint, endPoint)
      if (swipe) {
        callbacks.onSwipe?.(swipe)
      }
    }

    setTouchPoints(remainingPoints)
    if (remainingPoints.length === 0) {
      setIsTouching(false)
    }

    callbacks.onTouchEnd?.(remainingPoints)
  }, [touchesToPoints, callbacks, longPressTimer, enableSwipe, touchStartRef, touchPoints, detectSwipe, enablePinch])

  // Set up event listeners
  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [elementRef, handleTouchStart, handleTouchMove, handleTouchEnd])

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer)
      }
    }
  }, [longPressTimer])

  return {
    isTouching,
    touchPoints,
    // Utility functions for manual gesture detection
    detectSwipe,
    detectPinch,
    getDistance,
    getAngle
  }
}
