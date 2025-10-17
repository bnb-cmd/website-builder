import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { ShoppingCart, Plus, Minus, Trash2 } from '@/lib/icons'
import { Button } from '../../ui/button'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const CartSummaryConfig: ComponentConfig = {
  id: 'cart-summary',
  name: 'Cart Summary',
  category: 'ecommerce',
  icon: 'ShoppingCart',
  description: 'Shopping cart with items and totals',
  defaultProps: { 
    title: 'Shopping Cart',
    subtitle: 'Review your items',
    items: [
      {
        name: 'Wireless Headphones',
        price: '$99.99',
        quantity: 1,
        image: ''
      },
      {
        name: 'Phone Case',
        price: '$19.99',
        quantity: 2,
        image: ''
      },
      {
        name: 'Screen Protector',
        price: '$8.99',
        quantity: 1,
        image: ''
      }
    ],
    subtotal: '$147.96',
    shipping: '$9.99',
    tax: '$11.84',
    total: '$169.79',
    showQuantityControls: true,
    showRemoveButton: true,
    showPromoCode: true
  },
  defaultSize: { width: 400, height: 500 },
  editableFields: ['title', 'subtitle', 'items', 'subtotal', 'shipping', 'tax', 'total', 'showQuantityControls', 'showRemoveButton', 'showPromoCode']
}

interface CartItem {
  name: string
  price: string
  quantity: number
  image: string
}

interface CartSummaryProps extends WebsiteComponentProps {
  title: string
  subtitle: string
  items: CartItem[]
  subtotal: string
  shipping: string
  tax: string
  total: string
  showQuantityControls: boolean
  showRemoveButton: boolean
  showPromoCode: boolean
}

export const WebsiteCartSummary: React.FC<CartSummaryProps> = ({ 
  title, 
  subtitle, 
  items, 
  subtotal, 
  shipping, 
  tax, 
  total, 
  showQuantityControls, 
  showRemoveButton, 
  showPromoCode,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const padding = getResponsivePadding('p-6', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-sm', deviceMode)
  const itemNameSize = getResponsiveTextSize('text-sm', deviceMode)
  const priceSize = getResponsiveTextSize('text-sm', deviceMode)
  const totalSize = getResponsiveTextSize('text-lg', deviceMode)

  return (
    <div className={cn("w-full h-full bg-white border border-gray-200 rounded-lg", padding)}>
      <div className="space-y-4">
        <div className="text-center">
          <h2 
            className={cn("font-bold mb-2", titleSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {title}
          </h2>
          <p 
            className={cn("text-gray-600", subtitleSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {subtitle}
          </p>
        </div>
        
        {/* Cart Items */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
              {/* Product Image */}
              <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                ) : (
                  <ShoppingCart className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 
                  className={cn("font-medium truncate", itemNameSize)}
                  onDoubleClick={onTextDoubleClick}
                >
                  {item.name}
                </h3>
                <div 
                  className={cn("font-semibold text-primary", priceSize)}
                  onDoubleClick={onTextDoubleClick}
                >
                  {item.price}
                </div>
              </div>
              
              {/* Quantity Controls */}
              {showQuantityControls && (
                <div className="flex items-center space-x-2">
                  <button className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className={cn("font-medium", priceSize)}>{item.quantity}</span>
                  <button className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {/* Remove Button */}
              {showRemoveButton && (
                <button className="w-6 h-6 text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        
        {/* Promo Code */}
        {showPromoCode && (
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input 
                type="text"
                placeholder="Promo code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                readOnly
              />
              <Button variant="outline" size="sm">
                Apply
              </Button>
            </div>
          </div>
        )}
        
        {/* Order Summary */}
        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between">
            <span className={cn("text-gray-600", priceSize)}>Subtotal</span>
            <span 
              className={cn("font-medium", priceSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {subtotal}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={cn("text-gray-600", priceSize)}>Shipping</span>
            <span 
              className={cn("font-medium", priceSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {shipping}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={cn("text-gray-600", priceSize)}>Tax</span>
            <span 
              className={cn("font-medium", priceSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {tax}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className={cn("font-bold", totalSize)}>Total</span>
            <span 
              className={cn("font-bold", totalSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {total}
            </span>
          </div>
        </div>
        
        {/* Checkout Button */}
        <Button className="w-full" size="lg">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Proceed to Checkout
        </Button>
        
        {/* Continue Shopping */}
        <div className="text-center">
          <Button variant="ghost" size="sm">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  )
}
