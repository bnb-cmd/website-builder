'use client'

import React, { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from '@/lib/icons'
import { cn } from '@/lib/utils'

export interface LightboxProps {
  images: Array<{
    src: string
    alt: string
    caption?: string
    downloadUrl?: string
  }>
  thumbnails?: boolean
  zoom?: boolean
  showCaptions?: boolean
  showDownload?: boolean
  autoplay?: boolean
  interval?: number
  startIndex?: number
}

export const Lightbox: React.FC<LightboxProps> = ({
  images = [
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop', alt: 'Mountain landscape', caption: 'Beautiful mountain view' },
    { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop', alt: 'Forest path', caption: 'Peaceful forest trail' },
    { src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=800&fit=crop', alt: 'Lake reflection', caption: 'Calm lake waters' }
  ],
  thumbnails = true,
  zoom = true,
  showCaptions = true,
  showDownload = true,
  autoplay = false,
  interval = 3000,
  startIndex = 0
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(startIndex)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isAutoplaying, setIsAutoplaying] = useState(autoplay)

  const currentImage = images[currentIndex] ?? images[0]
  
  // Early return if no images
  if (!currentImage) {
    return null
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
    setZoomLevel(1)
  }

  const closeLightbox = () => {
    setIsOpen(false)
    setIsAutoplaying(false)
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setZoomLevel(1)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setZoomLevel(1)
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5))
  }

  const handleDownload = () => {
    if (!currentImage) return;
    if (!currentImage.downloadUrl && !currentImage.src) return;
    
    const link = document.createElement('a')
    link.href = currentImage.downloadUrl || currentImage.src
    link.download = currentImage.alt || 'image'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          closeLightbox()
          break
        case 'ArrowLeft':
          prevImage()
          break
        case 'ArrowRight':
          nextImage()
          break
        case '+':
        case '=':
          handleZoomIn()
          break
        case '-':
          handleZoomOut()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Autoplay
  useEffect(() => {
    if (!isAutoplaying || images.length <= 1) return

    const timer = setInterval(nextImage, interval)
    return () => clearInterval(timer)
  }, [isAutoplaying, interval, images.length])

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!images || images.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No images to display
      </div>
    )
  }

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-lg"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-32 object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-white text-sm truncate">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 text-white hover:bg-white/20 rounded-full transition"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white hover:bg-white/20 rounded-full transition"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white hover:bg-white/20 rounded-full transition"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Zoom Controls */}
          {zoom && (
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <button
                onClick={handleZoomOut}
                className="p-2 text-white hover:bg-white/20 rounded-full transition"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={handleZoomIn}
                className="p-2 text-white hover:bg-white/20 rounded-full transition"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Download Button */}
          {showDownload && (currentImage.downloadUrl || currentImage.src) && (
            <button
              onClick={handleDownload}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-10 p-2 text-white hover:bg-white/20 rounded-full transition"
              aria-label="Download image"
            >
              <Download className="w-5 h-5" />
            </button>
          )}

          {/* Main Image */}
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className="max-w-full max-h-full object-contain transition-transform"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>

          {/* Caption */}
          {showCaptions && currentImage.caption && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-center max-w-[80vw]">
              <p className="text-lg font-medium">{currentImage.caption}</p>
            </div>
          )}

          {/* Thumbnail Strip */}
          {thumbnails && images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition',
                    index === currentIndex
                      ? 'border-white'
                      : 'border-transparent hover:border-white/50'
                  )}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute top-4 right-16 text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  )
}

// Component configuration for editor
export const LightboxConfig = {
  id: 'lightbox',
  name: 'Lightbox Gallery',
  description: 'Full-screen image gallery with zoom and navigation',
  category: 'interactive' as const,
  icon: 'image',
  defaultProps: {
    images: [
      { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop', alt: 'Mountain landscape', caption: 'Beautiful mountain view' },
      { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop', alt: 'Forest path', caption: 'Peaceful forest trail' },
      { src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=800&fit=crop', alt: 'Lake reflection', caption: 'Calm lake waters' }
    ],
    thumbnails: true,
    zoom: true,
    showCaptions: true,
    showDownload: true,
    autoplay: false,
    interval: 3000,
    startIndex: 0
  },
  defaultSize: { width: 100, height: 400 },
  editableFields: [
    'images',
    'thumbnails',
    'zoom',
    'showCaptions',
    'showDownload',
    'autoplay',
    'interval',
    'startIndex'
  ]
}
