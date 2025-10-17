'use client'

import React, { useState } from 'react'
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, CreditCard } from '@/lib/icons'
import { cn } from '@/lib/utils'

export interface ShoppingCartProps {
  items: Array<{
    id: string
    name: string
    price: number
    image: string
    quantity: number
    variant?: string
    size?: string
    color?: string
    inStock: boolean
    maxQuantity?: number
  }>
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
  onClearCart: () => void
  onCheckout: () => void
  showVariant?: boolean
  showStock?: boolean
  showSubtotal?: boolean
  showTax?: boolean
  showShipping?: boolean
  showTotal?: boolean
  taxRate?: number
  shippingCost?: number
  freeShippingThreshold?: number
  layout?: 'sidebar' | 'full' | 'compact'
}

export const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
      quantity: 1,
      variant: 'Black',
      size: 'M',
      color: 'Black',
      inStock: true,
      maxQuantity: 10
    },
    {
      id: '2',
      name: 'Smartphone Case',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=100&h=100&fit=crop',
      quantity: 2,
      variant: 'Clear',
      size: 'iPhone 14',
      color: 'Transparent',
      inStock: true,
      maxQuantity: 5
    }
  ],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  showVariant = true,
  showStock = true,
  showSubtotal = true,
  showTax = true,
  showShipping = true,
  showTotal = true,
  taxRate = 0.17, // 17% GST
  shippingCost = 200,
  freeShippingThreshold = 5000,
  layout = 'full'
}) => {
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setIsUpdating(productId)
    try {
      await onUpdateQuantity(productId, newQuantity)
    } catch (error) {
      console.error('Error updating quantity:', error)
    } finally {
      setIsUpdating(null)
    }
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = showTax ? subtotal * taxRate : 0
  const shipping = showShipping ? (subtotal >= freeShippingThreshold ? 0 : shippingCost) : 0
  const total = subtotal + tax + shipping

  const CartItem = ({ item }: { item: any }) => (
    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg"
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
        
        {showVariant && (item.variant || item.size || item.color) && (
          <div className="text-sm text-gray-600 space-x-2">
            {item.variant && <span>Variant: {item.variant}</span>}
            {item.size && <span>Size: {item.size}</span>}
            {item.color && <span>Color: {item.color}</span>}
          </div>
        )}

        {showStock && (
          <div className="text-sm text-gray-600">
            {item.inStock ? (
              <span className="text-green-600">✓ In Stock</span>
            ) : (
              <span className="text-red-600">✗ Out of Stock</span>
            )}
          </div>
        )}

        <div className="text-lg font-semibold text-gray-900 mt-2">
          {formatPrice(item.price)}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
          disabled={isUpdating === item.id || item.quantity <= 1}
          className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-12 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
          disabled={isUpdating === item.id || item.quantity >= (item.maxQuantity || 10)}
          className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="text-right">
        <div className="text-lg font-semibold text-gray-900">
          {formatPrice(item.price * item.quantity)}
        </div>
        <button
          onClick={() => onRemoveItem(item.id)}
          className="mt-2 p-1 text-gray-600 hover:text-red-600 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  const CartSummary = () => (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3">
        {showSubtotal && (
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
        )}
        
        {showTax && (
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (GST)</span>
            <span className="font-medium">{formatPrice(tax)}</span>
          </div>
        )}
        
        {showShipping && (
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              {shipping === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                formatPrice(shipping)
              )}
            </span>
          </div>
        )}
        
        {subtotal < freeShippingThreshold && showShipping && (
          <div className="text-sm text-blue-600">
            Add {formatPrice(freeShippingThreshold - subtotal)} more for free shipping!
          </div>
        )}
        
        {showTotal && (
          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onCheckout}
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
      >
        <CreditCard className="w-5 h-5" />
        Proceed to Checkout
      </button>
    </div>
  )

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600 mb-6">Add some items to get started!</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
          Continue Shopping
        </button>
      </div>
    )
  }

  if (layout === 'sidebar') {
    return (
      <div className="w-80 bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Cart ({items.length})</h2>
          <button
            onClick={onClearCart}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear All
          </button>
        </div>
        
        <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <CartSummary />
      </div>
    )
  }

  if (layout === 'compact') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Shopping Cart ({items.length} items)</h2>
          <button
            onClick={onClearCart}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear All
          </button>
        </div>
        
        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                <div className="text-sm text-gray-600">{formatPrice(item.price)} × {item.quantity}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <CartSummary />
      </div>
    )
  }

  // Full layout (default)
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart ({items.length} items)</h1>
        <button
          onClick={onClearCart}
          className="text-red-600 hover:text-red-800 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  )
}

// Component configuration for editor
export const ShoppingCartConfig = {
  id: 'shopping-cart',
  name: 'Shopping Cart',
  description: 'Complete shopping cart with quantity controls and checkout',
  category: 'ecommerce' as const,
  icon: 'shopping-cart',
  defaultProps: {
    items: [
      {
        id: '1',
        name: 'Premium Wireless Headphones',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
        quantity: 1,
        variant: 'Black',
        size: 'M',
        color: 'Black',
        inStock: true,
        maxQuantity: 10
      }
    ],
    showVariant: true,
    showStock: true,
    showSubtotal: true,
    showTax: true,
    showShipping: true,
    showTotal: true,
    taxRate: 0.17,
    shippingCost: 200,
    freeShippingThreshold: 5000,
    layout: 'full'
  },
  defaultSize: { width: 100, height: 600 },
  editableFields: [
    'items',
    'showVariant',
    'showStock',
    'showSubtotal',
    'showTax',
    'showShipping',
    'showTotal',
    'taxRate',
    'shippingCost',
    'freeShippingThreshold',
    'layout'
  ]
}