'use client'

import { Element } from '@/types/editor'
import { ImageIcon, X, ChevronLeft, ChevronRight, Grid, Columns, Square } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface GalleryElementProps {
  element: Element
  isSelected: boolean
  onSelect: () => void
}

interface GalleryImage {
  id: string
  src: string
  alt: string
  caption?: string
}

export function GalleryElement({ element, isSelected, onSelect }: GalleryElementProps) {
  const { 
    images = [],
    layout = 'grid',
    columns = 3,
    gap = 16,
    showCaptions = true,
    enableLightbox = true,
    aspectRatio = 'square'
  } = element.props

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const defaultImages: GalleryImage[] = images.length > 0 ? images : [
    { id: '1', src: 'https://via.placeholder.com/400x400', alt: 'Gallery Image 1', caption: 'Beautiful landscape' },
    { id: '2', src: 'https://via.placeholder.com/400x400', alt: 'Gallery Image 2', caption: 'City skyline' },
    { id: '3', src: 'https://via.placeholder.com/400x400', alt: 'Gallery Image 3', caption: 'Nature photography' },
    { id: '4', src: 'https://via.placeholder.com/400x400', alt: 'Gallery Image 4', caption: 'Architecture' },
    { id: '5', src: 'https://via.placeholder.com/400x400', alt: 'Gallery Image 5', caption: 'Portrait' },
    { id: '6', src: 'https://via.placeholder.com/400x400', alt: 'Gallery Image 6', caption: 'Abstract art' },
  ]

  const openLightbox = (index: number) => {
    if (enableLightbox) {
      setLightboxIndex(index)
    }
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (lightboxIndex === null) return
    
    const newIndex = direction === 'next' 
      ? (lightboxIndex + 1) % defaultImages.length
      : (lightboxIndex - 1 + defaultImages.length) % defaultImages.length
    
    setLightboxIndex(newIndex)
  }

  const getLayoutClass = () => {
    switch (layout) {
      case 'grid':
        return `grid grid-cols-${columns} gap-${gap}px`
      case 'masonry':
        return 'columns-3 gap-4'
      case 'carousel':
        return 'flex overflow-x-auto gap-4 snap-x'
      default:
        return 'grid grid-cols-3 gap-4'
    }
  }

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square'
      case 'video':
        return 'aspect-video'
      case 'portrait':
        return 'aspect-[3/4]'
      default:
        return ''
    }
  }

  return (
    <>
      <div
        onClick={onSelect}
        className={`
          p-6 cursor-pointer transition-all
          ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
        `}
      >
        <div className={layout === 'masonry' ? 'columns-2 md:columns-3 gap-4' : layout === 'carousel' ? 'overflow-hidden' : `grid grid-cols-2 md:grid-cols-${columns} gap-4`}>
          {defaultImages.map((image, index) => (
            <div
              key={image.id}
              className={`
                group relative overflow-hidden rounded-lg cursor-pointer
                ${layout === 'masonry' ? 'mb-4 break-inside-avoid' : ''}
                ${layout === 'carousel' ? 'flex-shrink-0 w-80 snap-center' : ''}
              `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={(e) => {
                e.stopPropagation()
                openLightbox(index)
              }}
            >
              <div className={`relative ${layout !== 'masonry' ? getAspectRatioClass() : ''}`}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Hover Overlay */}
                <div className={`
                  absolute inset-0 bg-black/50 transition-opacity duration-300
                  ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'}
                `}>
                  <div className="flex items-center justify-center h-full">
                    <div className="text-white text-center">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Click to view</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {showCaptions && image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-sm">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {defaultImages.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-muted-foreground/50 rounded-lg">
            <ImageIcon className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Add images to create a gallery
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-white/80 transition-colors"
            onClick={closeLightbox}
          >
            <X className="h-8 w-8" />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-white/80 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              navigateLightbox('prev')
            }}
          >
            <ChevronLeft className="h-12 w-12" />
          </button>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-white/80 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              navigateLightbox('next')
            }}
          >
            <ChevronRight className="h-12 w-12" />
          </button>

          <div className="max-w-4xl max-h-[90vh] mx-auto p-4">
            <img
              src={defaultImages[lightboxIndex].src}
              alt={defaultImages[lightboxIndex].alt}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {defaultImages[lightboxIndex].caption && (
              <p className="text-white text-center mt-4">
                {defaultImages[lightboxIndex].caption}
              </p>
            )}
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {defaultImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxIndex(index)
                }}
                className={`
                  w-2 h-2 rounded-full transition-all
                  ${index === lightboxIndex 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/70'
                  }
                `}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
