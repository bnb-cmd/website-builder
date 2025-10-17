'use client'

import React, { useState } from 'react'
import { ShoppingCart, Heart, Eye, Star, Trash2, Plus, Minus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface WishlistProps {
  items: Array<{
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    rating: number
    reviewCount: number
    inStock: boolean
    variant?: string
    size?: string
    color?: string
  }>
  onAddToCart: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  onMoveToCart?: (productId: string) => void
  showRating?: boolean
  showStock?: boolean
  showVariant?: boolean
  showMoveToCart?: boolean
  layout?: 'grid' | 'list' | 'compact'
  emptyMessage?: string
}

export const Wishlist: React.FC<WishlistProps> = ({
  items = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 15000,
      originalPrice: 20000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      rating: 4.5,
      reviewCount: 128,
      inStock: true,
      variant: 'Black',
      size: 'M',
      color: 'Black'
    },
    {
      id: '2',
      name: 'Smartphone Case',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200&h=200&fit=crop',
      rating: 4.2,
      reviewCount: 45,
      inStock: false,
      variant: 'Clear',
      size: 'iPhone 14',
      color: 'Transparent'
    }
  ],
  onAddToCart,
  onRemove,
  onMoveToCart,
  showRating = true,
  showStock = true,
  showVariant = true,
  showMoveToCart = true,
  layout = 'grid',
  emptyMessage = 'Your wishlist is empty. Start adding items you love!'
}) => {
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null)

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

  const handleMoveToCart = async (productId: string) => {
    await handleAddToCart(productId)
    onRemove(productId)
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

  const WishlistItem = ({ item }: { item: any }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg"
        />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
          
          {showRating && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">{renderStars(item.rating)}</div>
              <span className="text-xs text-gray-600">({item.reviewCount})</span>
            </div>
          )}

          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900">{formatPrice(item.price)}</span>
            {item.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(item.originalPrice)}
              </span>
            )}
          </div>

          {showVariant && (item.variant || item.size || item.color) && (
            <div className="text-sm text-gray-600 mb-2">
              {item.variant && <span>Variant: {item.variant}</span>}
              {item.size && <span className="ml-2">Size: {item.size}</span>}
              {item.color && <span className="ml-2">Color: {item.color}</span>}
            </div>
          )}

          {showStock && (
            <div className="text-sm mb-3">
              {item.inStock ? (
                <span className="text-green-600">✓ In Stock</span>
              ) : (
                <span className="text-red-600">✗ Out of Stock</span>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => handleAddToCart(item.id)}
              disabled={!item.inStock || isAddingToCart === item.id}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition',
                item.inStock
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              {isAddingToCart === item.id ? 'Adding...' : 'Add to Cart'}
            </button>

            {showMoveToCart && (
              <button
                onClick={() => handleMoveToCart(item.id)}
                disabled={!item.inStock}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition"
              >
                Move to Cart
              </button>
            )}

            <button
              onClick={() => onRemove(item.id)}
              className="p-2 text-gray-600 hover:text-red-600 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const CompactItem = ({ item }: { item: any }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition">
      <div className="flex gap-3">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded"
        />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">
            {item.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900 text-sm">
              {formatPrice(item.price)}
            </span>
            {item.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(item.originalPrice)}
              </span>
            )}
          </div>

          {showStock && (
            <div className="text-xs mb-2">
              {item.inStock ? (
                <span className="text-green-600">In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          )}

          <div className="flex gap-1">
            <button
              onClick={() => handleAddToCart(item.id)}
              disabled={!item.inStock || isAddingToCart === item.id}
              className={cn(
                'flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium transition',
                item.inStock
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              )}
            >
              <ShoppingCart className="w-3 h-3" />
              Add
            </button>

            <button
              onClick={() => onRemove(item.id)}
              className="p-1 text-gray-600 hover:text-red-600 transition"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your Wishlist is Empty</h3>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    )
  }

  if (layout === 'compact') {
    return (
      <div className="space-y-3">
        {items.map((item) => (
          <CompactItem key={item.id} item={item} />
        ))}
      </div>
    )
  }

  if (layout === 'list') {
    return (
      <div className="space-y-4">
        {items.map((item) => (
          <WishlistItem key={item.id} item={item} />
        ))}
      </div>
    )
  }

  // Grid layout (default)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <WishlistItem key={item.id} item={item} />
      ))}
    </div>
  )
}

// Component configuration for editor
export const WishlistConfig = {
  id: 'wishlist',
  name: 'Wishlist',
  description: 'User wishlist with add to cart and remove functionality',
  category: 'ecommerce' as const,
  icon: 'heart',
  defaultProps: {
    items: [
      {
        id: '1',
        name: 'Premium Wireless Headphones',
        price: 15000,
        originalPrice: 20000,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
        rating: 4.5,
        reviewCount: 128,
        inStock: true,
        variant: 'Black',
        size: 'M',
        color: 'Black'
      }
    ],
    showRating: true,
    showStock: true,
    showVariant: true,
    showMoveToCart: true,
    layout: 'grid',
    emptyMessage: 'Your wishlist is empty. Start adding items you love!'
  },
  defaultSize: { width: 100, height: 400 },
  editableFields: [
    'items',
    'showRating',
    'showStock',
    'showVariant',
    'showMoveToCart',
    'layout',
    'emptyMessage'
  ]
}