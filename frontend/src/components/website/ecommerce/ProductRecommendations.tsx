'use client'

import React, { useState } from 'react'
import { Star, Heart, ShoppingCart, Eye, Share2, CheckCircle, Truck, Shield, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProductRecommendationsProps {
  products: Array<{
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
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
  title?: string
  subtitle?: string
  showWishlist?: boolean
  showQuickView?: boolean
  showRating?: boolean
  showStock?: boolean
  showBadge?: boolean
  showDescription?: boolean
  showCategory?: boolean
  showBrand?: boolean
  layout?: 'grid' | 'list' | 'carousel' | 'compact'
  columns?: 2 | 3 | 4 | 5 | 6
  maxProducts?: number
  showViewAll?: boolean
  viewAllText?: string
  onViewAll?: () => void
}

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  products = [
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
    },
    {
      id: '4',
      name: 'Wireless Mouse',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
      rating: 4.3,
      reviewCount: 67,
      inStock: true,
      stockCount: 30,
      category: 'Accessories',
      brand: 'TechPro',
      tags: ['wireless', 'ergonomic', 'gaming']
    }
  ],
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  onProductClick,
  title = 'Recommended for You',
  subtitle = 'Products you might like based on your preferences',
  showWishlist = true,
  showQuickView = true,
  showRating = true,
  showStock = true,
  showBadge = true,
  showDescription = false,
  showCategory = false,
  showBrand = false,
  layout = 'grid',
  columns = 4,
  maxProducts = 8,
  showViewAll = true,
  viewAllText = 'View All',
  onViewAll
}) => {
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
              <Eye className="w-4 h-4" />
            </div>
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        
        {showCategory && product.category && (
          <div className="text-xs text-blue-600 mb-1">{product.category}</div>
        )}
        
        {showBrand && product.brand && (
          <div className="text-xs text-gray-600 mb-1">by {product.brand}</div>
        )}
        
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

        {showDescription && product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        )}

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
          
          {showCategory && product.category && (
            <div className="text-xs text-blue-600 mb-1">{product.category}</div>
          )}
          
          {showBrand && product.brand && (
            <div className="text-xs text-gray-600 mb-1">by {product.brand}</div>
          )}
          
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

          {showDescription && product.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
          )}

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

  const CompactProduct = ({ product }: { product: any }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
      <div className="flex gap-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 object-cover rounded"
        />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">{product.name}</h3>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900 text-sm">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {showRating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-xs text-gray-600">({product.reviewCount})</span>
            </div>
          )}

          {showStock && (
            <div className="text-xs mb-2">
              {product.inStock ? (
                <span className="text-green-600">In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          )}

          <button
            onClick={() => handleAddToCart(product.id)}
            disabled={!product.inStock}
            className={cn(
              'w-full py-1 rounded text-xs font-medium transition',
              product.inStock
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            )}
          >
            {isAddingToCart === product.id ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )

  const displayedProducts = products.slice(0, maxProducts)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        
        {showViewAll && onViewAll && (
          <button
            onClick={onViewAll}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {viewAllText} →
          </button>
        )}
      </div>

      {/* Products */}
      {layout === 'list' && (
        <div className="space-y-4">
          {displayedProducts.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </div>
      )}

      {layout === 'compact' && (
        <div className="space-y-3">
          {displayedProducts.map((product) => (
            <CompactProduct key={product.id} product={product} />
          ))}
        </div>
      )}

      {layout === 'carousel' && (
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4">
            {displayedProducts.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-64">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}

      {layout === 'grid' && (
        <div className={cn('gap-4', getGridCols())}>
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

// Component configuration for editor
export const ProductRecommendationsConfig = {
  id: 'product-recommendations',
  name: 'Product Recommendations',
  description: 'Product recommendations based on user preferences',
  category: 'ecommerce' as const,
  icon: 'thumbs-up',
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
    title: 'Recommended for You',
    subtitle: 'Products you might like based on your preferences',
    showWishlist: true,
    showQuickView: true,
    showRating: true,
    showStock: true,
    showBadge: true,
    showDescription: false,
    showCategory: false,
    showBrand: false,
    layout: 'grid',
    columns: 4,
    maxProducts: 8,
    showViewAll: true,
    viewAllText: 'View All'
  },
  defaultSize: { width: 100, height: 600 },
  editableFields: [
    'products',
    'title',
    'subtitle',
    'showWishlist',
    'showQuickView',
    'showRating',
    'showStock',
    'showBadge',
    'showDescription',
    'showCategory',
    'showBrand',
    'layout',
    'columns',
    'maxProducts',
    'showViewAll',
    'viewAllText'
  ]
}
