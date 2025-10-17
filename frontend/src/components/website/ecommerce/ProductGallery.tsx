'use client'

import React, { useState } from 'react'
import { Star, Heart, ShoppingCart, Eye, Share2, CheckCircle, Truck, Shield, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProductGalleryProps {
  product: {
    id: string
    name: string
    images: string[]
    videos?: string[]
    thumbnails?: string[]
  }
  onImageClick?: (imageIndex: number) => void
  onVideoClick?: (videoIndex: number) => void
  showThumbnails?: boolean
  showVideos?: boolean
  showZoom?: boolean
  showFullscreen?: boolean
  showShare?: boolean
  showDownload?: boolean
  layout?: 'grid' | 'carousel' | 'masonry' | 'compact'
  columns?: 2 | 3 | 4 | 5 | 6
  maxImages?: number
  showImageCount?: boolean
  showImageNavigation?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  product = {
    id: '1',
    name: 'Premium Wireless Headphones',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop'
    ],
    videos: [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    ],
    thumbnails: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=100&h=100&fit=crop'
    ]
  },
  onImageClick,
  onVideoClick,
  showThumbnails = true,
  showVideos = true,
  showZoom = true,
  showFullscreen = true,
  showShare = true,
  showDownload = true,
  layout = 'carousel',
  columns = 3,
  maxImages = 10,
  showImageCount = true,
  showImageNavigation = true,
  autoPlay = false,
  autoPlayInterval = 3000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  const allMedia = [
    ...product.images.map((img, index) => ({ type: 'image', src: img, index })),
    ...(product.videos || []).map((video, index) => ({ type: 'video', src: video, index }))
  ]

  const displayedMedia = allMedia.slice(0, maxImages)

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayedMedia.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayedMedia.length) % displayedMedia.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  const handleImageClick = (index: number) => {
    if (showFullscreen) {
      setIsFullscreen(true)
    }
    onImageClick?.(index)
  }

  const handleVideoClick = (index: number) => {
    if (showFullscreen) {
      setIsFullscreen(true)
    }
    onVideoClick?.(index)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this ${product.name}`,
        url: window.location.href
      })
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = displayedMedia[currentIndex].src
    link.download = `${product.name}-${currentIndex + 1}.jpg`
    link.click()
  }

  const getGridCols = () => {
    switch (columns) {
      case 2: return 'grid-cols-1 md:grid-cols-2'
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      case 5: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      case 6: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  const MediaItem = ({ media, index }: { media: any; index: number }) => (
    <div className="relative group">
      {media.type === 'image' ? (
        <img
          src={media.src}
          alt={`${product.name} ${index + 1}`}
          className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
          onClick={() => handleImageClick(index)}
        />
      ) : (
        <video
          src={media.src}
          className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
          onClick={() => handleVideoClick(index)}
          controls
        />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
        {showZoom && (
          <button
            onClick={() => setIsZoomed(true)}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
        {showFullscreen && (
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )

  const CarouselView = () => (
    <div className="relative">
      {/* Main Image/Video */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
        {displayedMedia[currentIndex]?.type === 'image' ? (
          <img
            src={displayedMedia[currentIndex].src}
            alt={`${product.name} ${currentIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => handleImageClick(currentIndex)}
          />
        ) : (
          <video
            src={displayedMedia[currentIndex].src}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => handleVideoClick(currentIndex)}
            controls
          />
        )}

        {/* Navigation */}
        {showImageNavigation && displayedMedia.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image Count */}
        {showImageCount && displayedMedia.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {currentIndex + 1} / {displayedMedia.length}
          </div>
        )}

        {/* Actions */}
        <div className="absolute bottom-2 right-2 flex gap-2">
          {showShare && (
            <button
              onClick={handleShare}
              className="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition"
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}
          {showDownload && (
            <button
              onClick={handleDownload}
              className="p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && displayedMedia.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {displayedMedia.map((media, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={cn(
                'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition',
                currentIndex === index ? 'border-blue-500' : 'border-gray-200'
              )}
            >
              {media.type === 'image' ? (
                <img
                  src={media.src}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 5v10l8-5-8-5z" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  const GridView = () => (
    <div className={cn('gap-4', getGridCols())}>
      {displayedMedia.map((media, index) => (
        <MediaItem key={index} media={media} index={index} />
      ))}
    </div>
  )

  const MasonryView = () => (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
      {displayedMedia.map((media, index) => (
        <div key={index} className="break-inside-avoid mb-4">
          <MediaItem media={media} index={index} />
        </div>
      ))}
    </div>
  )

  const CompactView = () => (
    <div className="flex gap-2 overflow-x-auto">
      {displayedMedia.map((media, index) => (
        <div key={index} className="flex-shrink-0 w-24 h-24">
          <MediaItem media={media} index={index} />
        </div>
      ))}
    </div>
  )

  const FullscreenModal = () => {
    if (!isFullscreen) return null

    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="max-w-4xl max-h-full p-4">
          {displayedMedia[currentIndex]?.type === 'image' ? (
            <img
              src={displayedMedia[currentIndex].src}
              alt={`${product.name} ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <video
              src={displayedMedia[currentIndex].src}
              className="max-w-full max-h-full"
              controls
              autoPlay
            />
          )}
        </div>

        {/* Navigation in fullscreen */}
        {displayedMedia.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-white/20 rounded-full transition"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2 hover:bg-white/20 rounded-full transition"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {layout === 'grid' && <GridView />}
      {layout === 'carousel' && <CarouselView />}
      {layout === 'masonry' && <MasonryView />}
      {layout === 'compact' && <CompactView />}
      
      <FullscreenModal />
    </div>
  )
}

// Component configuration for editor
export const ProductGalleryConfig = {
  id: 'product-gallery',
  name: 'Product Gallery',
  description: 'Product image and video gallery with multiple layouts',
  category: 'ecommerce' as const,
  icon: 'image',
  defaultProps: {
    product: {
      id: '1',
      name: 'Premium Wireless Headphones',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop'
      ],
      thumbnails: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=100&h=100&fit=crop',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop'
      ]
    },
    showThumbnails: true,
    showVideos: true,
    showZoom: true,
    showFullscreen: true,
    showShare: true,
    showDownload: true,
    layout: 'carousel',
    columns: 3,
    maxImages: 10,
    showImageCount: true,
    showImageNavigation: true,
    autoPlay: false,
    autoPlayInterval: 3000
  },
  defaultSize: { width: 100, height: 500 },
  editableFields: [
    'product',
    'showThumbnails',
    'showVideos',
    'showZoom',
    'showFullscreen',
    'showShare',
    'showDownload',
    'layout',
    'columns',
    'maxImages',
    'showImageCount',
    'showImageNavigation',
    'autoPlay',
    'autoPlayInterval'
  ]
}
