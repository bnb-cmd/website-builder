'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CarouselProps {
  items: Array<{
    id?: string
    image?: string
    title?: string
    description?: string
    link?: string
    linkText?: string
  }>
  autoplay?: boolean
  interval?: number // milliseconds
  showArrows?: boolean
  showDots?: boolean
  height?: number
  objectFit?: 'cover' | 'contain' | 'fill'
  transition?: 'slide' | 'fade'
}

export const Carousel: React.FC<CarouselProps> = ({
  items = [
    { image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop', title: 'Slide 1', description: 'Beautiful slide description' },
    { image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop', title: 'Slide 2', description: 'Amazing content here' },
    { image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=600&fit=crop', title: 'Slide 3', description: 'Explore more' }
  ],
  autoplay = true,
  interval = 5000,
  showArrows = true,
  showDots = true,
  height = 600,
  objectFit = 'cover',
  transition = 'slide'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // Autoplay logic
  useEffect(() => {
    if (autoplay && !isHovered && items.length > 1) {
      const timer = setInterval(nextSlide, interval)
      return () => clearInterval(timer)
    }
  }, [autoplay, isHovered, interval, nextSlide, items.length])

  if (!items || items.length === 0) {
    return (
      <div className="w-full bg-gray-100 flex items-center justify-center" style={{ height }}>
        <p className="text-gray-400">No slides to display</p>
      </div>
    )
  }

  return (
    <div 
      className="relative w-full overflow-hidden group"
      style={{ height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            className={cn(
              'absolute inset-0 transition-all duration-500',
              transition === 'fade' ? 'opacity-0' : 'translate-x-full',
              index === currentIndex && (transition === 'fade' ? 'opacity-100' : 'translate-x-0'),
              index < currentIndex && (transition === 'slide' && '-translate-x-full')
            )}
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.title || `Slide ${index + 1}`}
                className="w-full h-full"
                style={{ objectFit }}
              />
            )}
            
            {/* Overlay content */}
            {(item.title || item.description) && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-8 text-white max-w-2xl">
                  {item.title && (
                    <h3 className="text-3xl font-bold mb-2">{item.title}</h3>
                  )}
                  {item.description && (
                    <p className="text-lg mb-4">{item.description}</p>
                  )}
                  {item.link && item.linkText && (
                    <a
                      href={item.link}
                      className="inline-block px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                      {item.linkText}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'w-3 h-3 rounded-full transition-all',
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/75'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Component configuration for editor
export const CarouselConfig = {
  id: 'carousel',
  name: 'Carousel',
  description: 'Image/content carousel slider with autoplay',
  category: 'interactive' as const,
  icon: 'images',
  defaultProps: {
    items: [
      { image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop', title: 'Slide 1', description: 'Beautiful slide description' },
      { image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop', title: 'Slide 2', description: 'Amazing content here' },
      { image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=600&fit=crop', title: 'Slide 3', description: 'Explore more' }
    ],
    autoplay: true,
    interval: 5000,
    showArrows: true,
    showDots: true,
    height: 600,
    objectFit: 'cover',
    transition: 'slide'
  },
  defaultSize: { width: 100, height: 600 },
  editableFields: [
    'items',
    'autoplay',
    'interval',
    'showArrows',
    'showDots',
    'height',
    'objectFit',
    'transition'
  ]
}

