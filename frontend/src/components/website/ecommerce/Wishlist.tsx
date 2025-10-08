import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { Button } from '../../ui/button'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const WishlistConfig: ComponentConfig = {
  id: 'wishlist',
  name: 'Wishlist',
  category: 'ecommerce',
  icon: 'Heart',
  description: 'Display saved wishlist items',
  defaultProps: { 
    title: 'My Wishlist',
    subtitle: 'Items you\'ve saved for later',
    items: [
      {
        name: 'Wireless Headphones',
        price: '$99.99',
        image: '',
        inStock: true
      },
      {
        name: 'Smart Watch',
        price: '$299.99',
        image: '',
        inStock: false
      },
      {
        name: 'Bluetooth Speaker',
        price: '$79.99',
        image: '',
        inStock: true
      }
    ],
    showMoveToCart: true,
    showRemove: true
  },
  defaultSize: { width: 400, height: 500 },
  editableFields: ['title', 'subtitle', 'items', 'showMoveToCart', 'showRemove']
}

interface WishlistItem {
  name: string
  price: string
  image: string
  inStock: boolean
}

interface WishlistProps extends WebsiteComponentProps {
  title: string
  subtitle: string
  items: WishlistItem[]
  showMoveToCart: boolean
  showRemove: boolean
}

export const WebsiteWishlist: React.FC<WishlistProps> = ({ 
  title, 
  subtitle, 
  items, 
  showMoveToCart, 
  showRemove,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const padding = getResponsivePadding('p-6', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-sm', deviceMode)
  const itemNameSize = getResponsiveTextSize('text-base', deviceMode)
  const priceSize = getResponsiveTextSize('text-lg', deviceMode)
  const stockSize = getResponsiveTextSize('text-xs', deviceMode)

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
        
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
              {/* Product Image */}
              <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                ) : (
                  <Heart className="w-6 h-6 text-gray-400" />
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
                  className={cn("font-bold text-primary", priceSize)}
                  onDoubleClick={onTextDoubleClick}
                >
                  {item.price}
                </div>
                <div className={cn(
                  "font-medium",
                  item.inStock ? "text-green-600" : "text-red-600",
                  stockSize
                )}>
                  {item.inStock ? "In Stock" : "Out of Stock"}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-col space-y-2">
                {showMoveToCart && item.inStock && (
                  <Button size="sm" variant="outline">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                )}
                {showRemove && (
                  <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {items.length === 0 && (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Your wishlist is empty</p>
          </div>
        )}
      </div>
    </div>
  )
}
