'use client'

import React, { useState } from 'react'
import { ShoppingCart, Heart, Eye, Star, Trash2, Plus, Minus } from '@/lib/icons'
import { cn } from '@/lib/utils'

export interface CartItemProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    variant?: string
    size?: string
    color?: string
  }
  quantity: number
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  onMoveToWishlist?: (productId: string) => void
  showWishlist?: boolean
  showRemove?: boolean
  layout?: 'horizontal' | 'vertical' | 'compact'
}

export const CartItem: React.FC<CartItemProps> = ({
  product = {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
    variant: 'Black',
    size: 'M',
    color: 'Black'
  },
  quantity = 1,
  onUpdateQuantity,
  onRemove,
  onMoveToWishlist,
  showWishlist = true,
  showRemove = true,
  layout = 'horizontal'
}) => {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return
    
    setIsUpdating(true)
    try {
      await onUpdateQuantity(product.id, newQuantity)
    } catch (error) {
      console.error('Error updating quantity:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  const totalPrice = product.price * quantity

  if (layout === 'compact') {
    return (
      <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-12 h-12 object-cover rounded"
        />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{formatPrice(product.price)}</span>
            <span>×</span>
            <span>{quantity}</span>
            <span>=</span>
            <span className="font-medium">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={isUpdating}
            className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isUpdating}
            className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {showRemove && (
          <button
            onClick={() => onRemove(product.id)}
            className="p-1 text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    )
  }

  if (layout === 'vertical') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex gap-4 mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
          
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
            <div className="text-lg font-semibold text-gray-900 mb-2">
              {formatPrice(product.price)}
            </div>
            
            {/* Variant info */}
            {(product.variant || product.size || product.color) && (
              <div className="text-sm text-gray-600 space-y-1">
                {product.variant && <div>Variant: {product.variant}</div>}
                {product.size && <div>Size: {product.size}</div>}
                {product.color && <div>Color: {product.color}</div>}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={isUpdating}
              className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={isUpdating}
              className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold text-gray-900">
              {formatPrice(totalPrice)}
            </div>
            
            {showWishlist && onMoveToWishlist && (
              <button
                onClick={() => onMoveToWishlist(product.id)}
                className="p-2 text-gray-600 hover:text-red-600 transition"
              >
                <Heart className="w-4 h-4" />
              </button>
            )}
            
            {showRemove && (
              <button
                onClick={() => onRemove(product.id)}
                className="p-2 text-gray-600 hover:text-red-600 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Horizontal layout (default)
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
      <img
        src={product.image}
        alt={product.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
        
        {/* Variant info */}
        {(product.variant || product.size || product.color) && (
          <div className="text-sm text-gray-600 space-x-2">
            {product.variant && <span>Variant: {product.variant}</span>}
            {product.size && <span>Size: {product.size}</span>}
            {product.color && <span>Color: {product.color}</span>}
          </div>
        )}
      </div>

      <div className="text-right">
        <div className="text-lg font-semibold text-gray-900 mb-2">
          {formatPrice(product.price)}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={isUpdating}
            className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isUpdating}
            className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-right">
        <div className="text-lg font-semibold text-gray-900 mb-2">
          {formatPrice(totalPrice)}
        </div>
        
        <div className="flex items-center gap-2">
          {showWishlist && onMoveToWishlist && (
            <button
              onClick={() => onMoveToWishlist(product.id)}
              className="p-2 text-gray-600 hover:text-red-600 transition"
              title="Move to Wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>
          )}
          
          {showRemove && (
            <button
              onClick={() => onRemove(product.id)}
              className="p-2 text-gray-600 hover:text-red-600 transition"
              title="Remove Item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Component configuration for editor
export const CartItemConfig = {
  id: 'cart-item',
  name: 'Cart Item',
  description: 'Individual cart item with quantity controls and actions',
  category: 'ecommerce' as const,
  icon: 'shopping-cart',
  defaultProps: {
    product: {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      variant: 'Black',
      size: 'M',
      color: 'Black'
    },
    quantity: 1,
    showWishlist: true,
    showRemove: true,
    layout: 'horizontal'
  },
  defaultSize: { width: 100, height: 120 },
  editableFields: [
    'product',
    'quantity',
    'showWishlist',
    'showRemove',
    'layout'
  ]
}
