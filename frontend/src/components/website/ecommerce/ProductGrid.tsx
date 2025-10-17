'use client'

import React, { useState } from 'react'
import { Search, Filter, Grid, List, SlidersHorizontal, Star, Heart, ShoppingCart } from '@/lib/icons'
import { cn } from '@/lib/utils'

export interface ProductGridProps {
  products: Array<{
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    images?: string[]
    rating: number
    reviewCount: number
    inStock: boolean
    stockCount?: number
    badge?: string
    description?: string
    category?: string
    brand?: string
    tags?: string[]
  }>
  onAddToCart: (productId: string, quantity: number) => void
  onAddToWishlist?: (productId: string) => void
  onQuickView?: (productId: string) => void
  onProductClick?: (productId: string) => void
  showFilters?: boolean
  showSearch?: boolean
  showSort?: boolean
  showViewToggle?: boolean
  showWishlist?: boolean
  showQuickView?: boolean
  showRating?: boolean
  showStock?: boolean
  showBadge?: boolean
  layout?: 'grid' | 'list' | 'masonry'
  columns?: 2 | 3 | 4 | 5 | 6
  itemsPerPage?: number
  showPagination?: boolean
  searchPlaceholder?: string
  sortOptions?: Array<{
    value: string
    label: string
  }>
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 15000,
      originalPrice: 20000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop'
      ],
      rating: 4.5,
      reviewCount: 128,
      inStock: true,
      stockCount: 15,
      badge: 'Sale',
      description: 'High-quality wireless headphones with noise cancellation.',
      category: 'Electronics',
      brand: 'TechBrand',
      tags: ['wireless', 'noise-cancelling', 'premium']
    },
    {
      id: '2',
      name: 'Smartphone Case',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300&h=300&fit=crop',
      rating: 4.2,
      reviewCount: 45,
      inStock: true,
      stockCount: 50,
      category: 'Accessories',
      brand: 'CasePro',
      tags: ['protective', 'clear', 'durable']
    },
    {
      id: '3',
      name: 'Bluetooth Speaker',
      price: 8000,
      originalPrice: 12000,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
      rating: 4.7,
      reviewCount: 89,
      inStock: false,
      badge: 'Out of Stock',
      category: 'Electronics',
      brand: 'SoundMax',
      tags: ['portable', 'bluetooth', 'waterproof']
    }
  ],
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  onProductClick,
  showFilters = true,
  showSearch = true,
  showSort = true,
  showViewToggle = true,
  showWishlist = true,
  showQuickView = true,
  showRating = true,
  showStock = true,
  showBadge = true,
  layout = 'grid',
  columns = 4,
  itemsPerPage = 12,
  showPagination = true,
  searchPlaceholder = 'Search products...',
  sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' }
  ]
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null)
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set())

  const handleAddToCart = async (productId: string) => {
    setIsAddingToCart(productId)
    try {
      await onAddToCart(productId, 1)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(null)
    }
  }

  const handleWishlistToggle = (productId: string) => {
    setWishlistItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
    onAddToWishlist?.(productId)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'w-3 h-3',
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        )}
      />
    ))
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  // Filter and sort products
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return b.id.localeCompare(a.id)
      case 'popular':
        return b.reviewCount - a.reviewCount
      default:
        return 0
    }
  })

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage)

  const ProductCard = ({ product }: { product: any }) => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        
        {showBadge && product.badge && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        {showWishlist && (
          <button
            onClick={() => handleWishlistToggle(product.id)}
            className={cn(
              'absolute top-2 right-2 p-2 rounded-full shadow-lg transition',
              wishlistItems.has(product.id)
                ? 'bg-red-500 text-white'
                : 'bg-white hover:bg-gray-50'
            )}
          >
            <Heart className={cn('w-4 h-4', wishlistItems.has(product.id) && 'fill-current')} />
          </button>
        )}

        {/* Quick View Button */}
        {showQuickView && (
          <button
            onClick={() => onQuickView?.(product.id)}
            className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition flex items-center justify-center"
          >
            <div className="bg-white rounded-full p-2">
              <Search className="w-4 h-4" />
            </div>
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        
        {showRating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-xs text-gray-600">({product.reviewCount})</span>
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {showStock && (
          <div className="text-sm text-gray-600 mb-3">
            {product.inStock ? (
              <span className="text-green-600">✓ In Stock</span>
            ) : (
              <span className="text-red-600">✗ Out of Stock</span>
            )}
          </div>
        )}

        <button
          onClick={() => handleAddToCart(product.id)}
          disabled={!product.inStock || isAddingToCart === product.id}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2 rounded-md font-medium transition',
            product.inStock
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          )}
        >
          <ShoppingCart className="w-4 h-4" />
          {isAddingToCart === product.id ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )

  const ProductListItem = ({ product }: { product: any }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex gap-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
          
          {showRating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-xs text-gray-600">({product.reviewCount})</span>
            </div>
          )}

          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {showStock && (
            <div className="text-sm text-gray-600 mb-3">
              {product.inStock ? (
                <span className="text-green-600">✓ In Stock</span>
              ) : (
                <span className="text-red-600">✗ Out of Stock</span>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => handleAddToCart(product.id)}
              disabled={!product.inStock || isAddingToCart === product.id}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition',
                product.inStock
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              {isAddingToCart === product.id ? 'Adding...' : 'Add to Cart'}
            </button>

            {showWishlist && (
              <button
                onClick={() => handleWishlistToggle(product.id)}
                className={cn(
                  'p-2 border rounded-md transition',
                  wishlistItems.has(product.id)
                    ? 'border-red-300 bg-red-50 text-red-600'
                    : 'border-gray-300 hover:border-gray-400'
                )}
              >
                <Heart className={cn('w-4 h-4', wishlistItems.has(product.id) && 'fill-current')} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const getGridCols = () => {
    switch (columns) {
      case 2: return 'grid-cols-1 md:grid-cols-2'
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      case 5: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      case 6: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          {showSearch && (
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Sort */}
          {showSort && (
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* View Toggle */}
          {showViewToggle && (
            <div className="flex gap-1 border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 transition',
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 transition',
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid/List */}
      <div className={cn(
        viewMode === 'grid' ? getGridCols() : 'space-y-4',
        'gap-4'
      )}>
        {paginatedProducts.map((product) => (
          viewMode === 'list' ? (
            <ProductListItem key={product.id} product={product} />
          ) : (
            <ProductCard key={product.id} product={product} />
          )
        ))}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  'px-3 py-2 border rounded-md transition',
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                )}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-center text-gray-600">
        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedProducts.length)} of {sortedProducts.length} products
      </div>
    </div>
  )
}

// Component configuration for editor
export const ProductGridConfig = {
  id: 'product-grid',
  name: 'Product Grid',
  description: 'Product grid with search, filters, and pagination',
  category: 'ecommerce' as const,
  icon: 'grid',
  defaultProps: {
    products: [
      {
        id: '1',
        name: 'Premium Wireless Headphones',
        price: 15000,
        originalPrice: 20000,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
        rating: 4.5,
        reviewCount: 128,
        inStock: true,
        stockCount: 15,
        badge: 'Sale',
        category: 'Electronics',
        brand: 'TechBrand'
      }
    ],
    showFilters: true,
    showSearch: true,
    showSort: true,
    showViewToggle: true,
    showWishlist: true,
    showQuickView: true,
    showRating: true,
    showStock: true,
    showBadge: true,
    layout: 'grid',
    columns: 4,
    itemsPerPage: 12,
    showPagination: true,
    searchPlaceholder: 'Search products...'
  },
  defaultSize: { width: 100, height: 800 },
  editableFields: [
    'products',
    'showFilters',
    'showSearch',
    'showSort',
    'showViewToggle',
    'showWishlist',
    'showQuickView',
    'showRating',
    'showStock',
    'showBadge',
    'layout',
    'columns',
    'itemsPerPage',
    'showPagination',
    'searchPlaceholder',
    'sortOptions'
  ]
}