import React, { useRef, useState } from 'react'
import { useTouchInteractions, TouchInteractionCallbacks } from '@/hooks/use-touch-interactions'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'

interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  hapticFeedback?: boolean
  longPressDelay?: number
  onLongPress?: () => void
  children: React.ReactNode
}

export function TouchButton({
  variant = 'primary',
  size = 'md',
  hapticFeedback = true,
  longPressDelay = 500,
  onLongPress,
  className,
  children,
  ...props
}: TouchButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isPressed, setIsPressed] = useState(false)

  // Haptic feedback function (if available)
  const triggerHapticFeedback = () => {
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }

  const handleTouchStart = () => {
    setIsPressed(true)
    triggerHapticFeedback()
  }

  const handleTouchEnd = () => {
    setIsPressed(false)
  }

  useTouchInteractions(
    buttonRef,
    { enableLongPress: !!onLongPress, longPressDelay },
    {
      onLongPress: () => {
        onLongPress?.()
        triggerHapticFeedback()
      }
    }
  )

  const sizeClasses = {
    sm: 'h-10 px-4 text-sm min-w-[44px]',
    md: 'h-12 px-6 text-base min-w-[48px]',
    lg: 'h-14 px-8 text-lg min-w-[56px]'
  }

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 active:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent active:bg-accent/80'
  }

  return (
    <button
      ref={buttonRef}
      className={cn(
        'rounded-lg font-medium transition-all duration-150 ease-out',
        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'active:scale-95 select-none',
        'touch-manipulation', // Optimize for touch
        sizeClasses[size],
        variantClasses[variant],
        isPressed && 'scale-95',
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      {...props}
    >
      {children}
    </button>
  )
}

interface SwipeableCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  className?: string
  threshold?: number
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className,
  threshold = 50
}: SwipeableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useTouchInteractions(
    cardRef,
    { enableSwipe: true, swipeThreshold: threshold },
    {
      onSwipe: (gesture) => {
        switch (gesture.direction) {
          case 'left':
            onSwipeLeft?.()
            break
          case 'right':
            onSwipeRight?.()
            break
          case 'up':
            onSwipeUp?.()
            break
          case 'down':
            onSwipeDown?.()
            break
        }
      }
    }
  )

  return (
    <Card
      ref={cardRef}
      className={cn(
        'touch-pan-x select-none', // Allow horizontal panning
        className
      )}
    >
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  )
}

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  isRefreshing?: boolean
  pullThreshold?: number
  children: React.ReactNode
  className?: string
}

export function PullToRefresh({
  onRefresh,
  isRefreshing = false,
  pullThreshold = 80,
  children,
  className
}: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pullDistance, setPullDistance] = useState(0)
  const [startY, setStartY] = useState(0)
  const [isPulling, setIsPulling] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isRefreshing) return
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isRefreshing || !startY) return

    const currentY = e.touches[0].clientY
    const distance = currentY - startY

    // Only allow pulling down from the top
    if (distance > 0 && window.scrollY === 0) {
      e.preventDefault()
      setPullDistance(Math.min(distance * 0.5, pullThreshold * 2))
      setIsPulling(true)
    }
  }

  const handleTouchEnd = async () => {
    if (isRefreshing || !isPulling) return

    if (pullDistance >= pullThreshold) {
      await onRefresh()
    }

    setPullDistance(0)
    setIsPulling(false)
    setStartY(0)
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      {(isPulling || isRefreshing) && (
        <div
          className="absolute top-0 left-0 right-0 z-10 flex items-center justify-center bg-background border-b transition-transform duration-200"
          style={{
            transform: `translateY(${Math.max(-40, pullDistance - 40)}px)`,
            height: '40px'
          }}
        >
          <RefreshCw
            className={cn(
              'h-5 w-5 transition-transform',
              isRefreshing && 'animate-spin'
            )}
          />
          <span className="ml-2 text-sm">
            {isRefreshing ? 'Refreshing...' : pullDistance >= pullThreshold ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      )}

      {/* Content */}
      <div
        style={{
          transform: `translateY(${isPulling ? pullDistance : 0}px)`,
          transition: isPulling ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  )
}

interface TouchCarouselProps {
  items: React.ReactNode[]
  onSlideChange?: (index: number) => void
  showDots?: boolean
  showArrows?: boolean
  className?: string
}

export function TouchCarousel({
  items,
  onSlideChange,
  showDots = true,
  showArrows = true,
  className
}: TouchCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const goToSlide = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1))
    setCurrentIndex(clampedIndex)
    onSlideChange?.(clampedIndex)
  }

  const nextSlide = () => goToSlide(currentIndex + 1)
  const prevSlide = () => goToSlide(currentIndex - 1)

  useTouchInteractions(
    carouselRef,
    { enableSwipe: true, swipeThreshold: 50 },
    {
      onSwipe: (gesture) => {
        if (gesture.direction === 'left') {
          nextSlide()
        } else if (gesture.direction === 'right') {
          prevSlide()
        }
      }
    }
  )

  return (
    <div
      ref={carouselRef}
      className={cn('relative overflow-hidden touch-pan-x', className)}
    >
      {/* Slides */}
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="flex-shrink-0 w-full">
            {item}
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {showArrows && (
        <>
          <TouchButton
            variant="outline"
            size="sm"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
            onClick={prevSlide}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </TouchButton>
          <TouchButton
            variant="outline"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
            onClick={nextSlide}
            disabled={currentIndex === items.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </TouchButton>
        </>
      )}

      {/* Dots indicator */}
      {showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={cn(
                'w-2 h-2 rounded-full transition-all touch-manipulation',
                index === currentIndex
                  ? 'bg-primary scale-125'
                  : 'bg-muted-foreground/50 hover:bg-muted-foreground'
              )}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface PinchZoomProps {
  children: React.ReactNode
  onZoom?: (scale: number) => void
  onPan?: (x: number, y: number) => void
  maxScale?: number
  minScale?: number
  className?: string
}

export function PinchZoom({
  children,
  onZoom,
  onPan,
  maxScale = 3,
  minScale = 0.5,
  className
}: PinchZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  useTouchInteractions(
    containerRef,
    { enablePinch: true },
    {
      onPinch: (gesture) => {
        const newScale = Math.max(minScale, Math.min(maxScale, gesture.scale))
        setScale(newScale)
        onZoom?.(newScale)
      }
    }
  )

  return (
    <div
      ref={containerRef}
      className={cn('overflow-hidden touch-pinch-zoom', className)}
    >
      <div
        style={{
          transform: `scale(${scale}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: 'center center',
          transition: 'transform 0.1s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  )
}

interface TouchRippleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  rippleColor?: string
  duration?: number
}

export function TouchRipple({
  children,
  rippleColor = 'rgba(255, 255, 255, 0.3)',
  duration = 600,
  className,
  onClick,
  ...props
}: TouchRippleProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; size: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    }

    setRipples(prev => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, duration)

    onClick?.(e)
  }

  return (
    <button
      className={cn('relative overflow-hidden', className)}
      onClick={handleClick}
      {...props}
    >
      {children}

      {/* Ripples */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: rippleColor,
            animationDuration: `${duration}ms`
          }}
        />
      ))}
    </button>
  )
}
