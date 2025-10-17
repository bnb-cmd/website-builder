'use client'

import React, { useState } from 'react'
import { Star, Heart, ShoppingCart, Eye, Share2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProductCardProps {
  product: {
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
    features?: string[]
    variants?: Array<{
      id: string
      name: string
      value: string
      type: 'size' | 'color' | 'material'
    }>
  }
  onAddToCart: (productId: string, quantity: number) => void
  onAddToWishlist?: (productId: string) => void
  onQuickView?: (productId: string) => void
  onShare?: (productId: string) => void
  showWishlist?: boolean
  showQuickView?: boolean
  showShare?: boolean
  showRating?: boolean
  showStock?: boolean
  showBadge?: boolean
  layout?: 'grid' | 'list' | 'compact'
  size?: 'small' | 'medium' | 'large'
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product = {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 15000,
    originalPrice: 20000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    stockCount: 15,
    badge: 'Sale',
    description: 'High-quality wireless headphones with noise cancellation.',
    features: ['Noise Cancellation', '30-hour Battery', 'Quick Charge']
  },
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  onShare,
  showWishlist = true,
  showQuickView = true,
  showShare = true,
  showRating = true,
  showStock = true,
  showBadge = true,
  layout = 'grid',
  size = 'medium'
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      await onAddToCart(product.id, 1)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWishlistToggle = () => {
    if (onAddToWishlist) {
      setIsInWishlist(!isInWishlist)
      onAddToWishlist(product.id)
    }
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

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'w-48',
          image: 'h-32',
          title: 'text-sm',
          price: 'text-base'
        }
      case 'large':
        return {
          container: 'w-80',
          image: 'h-64',
          title: 'text-lg',
          price: 'text-xl'
        }
      default:
        return {
          container: 'w-64',
          image: 'h-48',
          title: 'text-base',
          price: 'text-lg'
        }
    }
  }

  const sizeClasses = getSizeClasses()

  if (layout === 'list') {
    return (
      <div className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
          {showBadge && product.badge && (
            <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {product.badge}
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className={`font-semibold text-gray-900 mb-1 ${sizeClasses.title}`}>
            {product.name}
          </h3>
          
          {showRating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-xs text-gray-600">
                ({product.reviewCount})
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 mb-2">
            <span className={`font-bold text-gray-900 ${sizeClasses.price}`}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {showStock && (
            <div className="text-sm text-gray-600 mb-3">
              {product.inStock 
                ? `In Stock (${product.stockCount || 'Available'})`
                : 'Out of Stock'
              }
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAddingToCart}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition',
                product.inStock
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>

            {showWishlist && (
              <button
                onClick={handleWishlistToggle}
                className={cn(
                  'p-2 border rounded-md transition',
                  isInWishlist
                    ? 'border-red-300 bg-red-50 text-red-600'
                    : 'border-gray-300 hover:border-gray-400'
                )}
              >
                <Heart className={cn('w-4 h-4', isInWishlist && 'fill-current')} />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (layout === 'compact') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
        <div className="relative mb-2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-24 object-cover rounded"
          />
          {showBadge && product.badge && (
            <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
              {product.badge}
            </div>
          )}
        </div>

        <h3 className="text-sm font-medium text-gray-900 mb-1 truncate">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {showRating && (
            <div className="flex items-center gap-1">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-xs text-gray-600">({product.reviewCount})</span>
            </div>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={cn(
            'w-full py-2 rounded-md text-sm font-medium transition',
            product.inStock
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          )}
        >
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    )
  }

  // Grid layout (default)
  return (
    <div 
      className={`${sizeClasses.container} bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full ${sizeClasses.image} object-cover`}
        />
        
        {showBadge && product.badge && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {product.badge}
          </div>
        )}

        {/* Hover Actions */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2">
            {showQuickView && (
              <button
                onClick={() => onQuickView?.(product.id)}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            {showShare && (
              <button
                onClick={() => onShare?.(product.id)}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Wishlist Button */}
        {showWishlist && (
          <button
            onClick={handleWishlistToggle}
            className={cn(
              'absolute top-2 right-2 p-2 rounded-full shadow-lg transition',
              isInWishlist
                ? 'bg-red-500 text-white'
                : 'bg-white hover:bg-gray-50'
            )}
          >
            <Heart className={cn('w-4 h-4', isInWishlist && 'fill-current')} />
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className={`font-semibold text-gray-900 mb-2 ${sizeClasses.title}`}>
          {product.name}
        </h3>

        {showRating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-xs text-gray-600">
              ({product.reviewCount})
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          <span className={`font-bold text-gray-900 ${sizeClasses.price}`}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="bg-red-100 text-red-800 px-1 py-0.5 rounded text-xs font-medium">
                {discountPercentage}% OFF
              </span>
            </>
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
          onClick={handleAddToCart}
          disabled={!product.inStock || isAddingToCart}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2 rounded-md font-medium transition',
            product.inStock
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          )}
        >
          <ShoppingCart className="w-4 h-4" />
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

// Component configuration for editor
export const ProductCardConfig = {
  id: 'product-card',
  name: 'Product Card',
  description: 'Product display card with add to cart and wishlist functionality',
  category: 'ecommerce' as const,
  icon: 'package',
  defaultProps: {
    product: {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 15000,
      originalPrice: 20000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      rating: 4.5,
      reviewCount: 128,
      inStock: true,
      stockCount: 15,
      badge: 'Sale'
    },
    showWishlist: true,
    showQuickView: true,
    showShare: true,
    showRating: true,
    showStock: true,
    showBadge: true,
    layout: 'grid',
    size: 'medium'
  },
  defaultSize: { width: 100, height: 400 },
  editableFields: [
    'product',
    'showWishlist',
    'showQuickView',
    'showShare',
    'showRating',
    'showStock',
    'showBadge',
    'layout',
    'size'
  ]
}