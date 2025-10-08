import React, { useState, useEffect, useCallback } from 'react'
import { Search, Filter, X, Download, Heart, Star, Grid, List } from 'lucide-react'

interface ImageLibraryItem {
  id: string
  name: string
  category: string
  tags: string[]
  url: string
  thumbnail: string
  width: number
  height: number
  source: string
  license: string
  isPremium: boolean
  downloadCount: number
}

interface ImagePickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (image: ImageLibraryItem) => void
  category?: string
  title?: string
}

interface SearchFilters {
  category?: string
  tags?: string[]
  isPremium?: boolean
  source?: string
  orientation?: 'landscape' | 'portrait' | 'square'
  color?: string
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  category,
  title = 'Choose Image'
}) => {
  const [images, setImages] = useState<ImageLibraryItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedImage, setSelectedImage] = useState<ImageLibraryItem | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Fetch images from API
  const fetchImages = useCallback(async (query?: string, newFilters?: SearchFilters, pageNum = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      if (query) {
        params.append('q', query)
      }
      
      if (newFilters?.category) {
        params.append('category', newFilters.category)
      }
      
      if (newFilters?.tags?.length) {
        params.append('tags', newFilters.tags.join(','))
      }
      
      if (newFilters?.isPremium !== undefined) {
        params.append('isPremium', newFilters.isPremium.toString())
      }
      
      if (newFilters?.source) {
        params.append('source', newFilters.source)
      }
      
      if (newFilters?.orientation) {
        params.append('orientation', newFilters.orientation)
      }
      
      if (newFilters?.color) {
        params.append('color', newFilters.color)
      }
      
      params.append('page', pageNum.toString())
      params.append('limit', '20')

      const endpoint = query 
        ? `/api/v1/image-library/search?${params}`
        : `/api/v1/image-library?${params}`
      
      const response = await fetch(endpoint)
      const data = await response.json()
      
      if (data.success) {
        if (pageNum === 1) {
          setImages(data.data.images)
        } else {
          setImages(prev => [...prev, ...data.data.images])
        }
        setHasMore(data.data.hasMore)
      }
    } catch (error) {
      console.error('Failed to fetch images:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/image-library/categories')
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }, [])

  // Load more images
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchImages(searchQuery, filters, nextPage)
    }
  }, [loading, hasMore, page, searchQuery, filters, fetchImages])

  // Handle search
  const handleSearch = useCallback(() => {
    setPage(1)
    fetchImages(searchQuery, filters, 1)
  }, [searchQuery, filters, fetchImages])

  // Handle filter change
  const handleFilterChange = useCallback((newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    setPage(1)
    fetchImages(searchQuery, updatedFilters, 1)
  }, [filters, searchQuery, fetchImages])

  // Handle image selection
  const handleImageSelect = useCallback((image: ImageLibraryItem) => {
    setSelectedImage(image)
    onSelect(image)
    
    // Track download
    fetch(`/api/v1/image-library/${image.id}/download`, {
      method: 'POST'
    }).catch(console.error)
  }, [onSelect])

  // Initialize
  useEffect(() => {
    if (isOpen) {
      fetchCategories()
      const initialFilters = category ? { category } : {}
      setFilters(initialFilters)
      fetchImages('', initialFilters, 1)
    }
  }, [isOpen, category, fetchCategories, fetchImages])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange({ category: e.target.value || undefined })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={filters.source || ''}
                onChange={(e) => handleFilterChange({ source: e.target.value || undefined })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Sources</option>
                <option value="unsplash">Unsplash</option>
                <option value="pexels">Pexels</option>
                <option value="pixabay">Pixabay</option>
                <option value="custom">Custom</option>
              </select>

              <select
                value={filters.orientation || ''}
                onChange={(e) => handleFilterChange({ orientation: e.target.value as any || undefined })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Orientations</option>
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
                <option value="square">Square</option>
              </select>

              <button
                onClick={() => handleFilterChange({ isPremium: !filters.isPremium })}
                className={`px-3 py-2 border rounded-lg transition-colors ${
                  filters.isPremium 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Star className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {loading && images.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading images...</p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-6">
              {images.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No images found</p>
                  <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className={`${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' 
                    : 'space-y-4'
                }`}>
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className={`group cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:border-blue-500 ${
                        selectedImage?.id === image.id ? 'border-blue-500' : 'border-gray-200'
                      } ${viewMode === 'list' ? 'flex' : ''}`}
                      onClick={() => handleImageSelect(image)}
                    >
                      <div className={`${viewMode === 'list' ? 'w-32 h-24' : 'aspect-square'} relative`}>
                        <img
                          src={image.thumbnail}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                        {image.isPremium && (
                          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                            <Star className="w-3 h-3 inline mr-1" />
                            Premium
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                              <Heart className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {viewMode === 'list' && (
                        <div className="flex-1 p-4">
                          <h3 className="font-medium text-gray-900 truncate">{image.name}</h3>
                          <p className="text-sm text-gray-500 capitalize">{image.category}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-400">{image.width} × {image.height}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-400 capitalize">{image.source}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-400">{image.downloadCount} downloads</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Load More */}
              {hasMore && images.length > 0 && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {images.length} images found
              {filters.category && ` in ${filters.category}`}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedImage && handleImageSelect(selectedImage)}
                disabled={!selectedImage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Use Selected Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImagePicker
