import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const ProductCardConfig: ComponentConfig = {
  id: 'product-card',
  name: 'Product Card',
  category: 'ecommerce',
  icon: 'ShoppingCart',
  description: 'Display product information',
  defaultProps: { 
    name: 'Premium Product',
    description: 'High-quality product with excellent features',
    price: '$99.99',
    originalPrice: '$129.99',
    image: '',
    rating: 4.5,
    reviewCount: 24,
    badge: 'Sale',
    showBadge: true,
    showRating: true,
    showWishlist: true
  },
  defaultSize: { width: 280, height: 400 },
  editableFields: ['name', 'description', 'price', 'originalPrice', 'image', 'rating', 'reviewCount', 'badge', 'showBadge', 'showRating', 'showWishlist']
}

interface ProductCardProps extends WebsiteComponentProps {
  name: string
  description: string
  price: string
  originalPrice: string
  image: string
  rating: number
  reviewCount: number
  badge: string
  showBadge: boolean
  showRating: boolean
  showWishlist: boolean
}

export const WebsiteProductCard: React.FC<ProductCardProps> = ({ 
  name, 
  description, 
  price, 
  originalPrice, 
  image, 
  rating, 
  reviewCount, 
  badge, 
  showBadge, 
  showRating, 
  showWishlist,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={cn(
          "w-3 h-3",
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        )} 
      />
    ))
  }

  const padding = getResponsivePadding('p-4', deviceMode)
  const nameSize = getResponsiveTextSize('text-base', deviceMode)
  const descriptionSize = getResponsiveTextSize('text-sm', deviceMode)
  const priceSize = getResponsiveTextSize('text-lg', deviceMode)
  const originalPriceSize = getResponsiveTextSize('text-sm', deviceMode)
  const ratingSize = getResponsiveTextSize('text-xs', deviceMode)

  return (
    <div className={cn("w-full h-full bg-white border border-gray-200 rounded-lg overflow-hidden group", padding)}>
      <div className="space-y-3">
        {/* Product Image */}
        <div className="relative">
          <div className="w-full h-48 bg-gray-200 rounded-md overflow-hidden">
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ShoppingCart className="w-12 h-12" />
              </div>
            )}
          </div>
          
          {showBadge && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              {badge}
            </Badge>
          )}
          
          {showWishlist && (
            <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
              <Heart className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
        
        {/* Product Info */}
        <div className="space-y-2">
          <h3 
            className={cn("font-semibold line-clamp-2", nameSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {name}
          </h3>
          
          <p 
            className={cn("text-gray-600 line-clamp-2", descriptionSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {description}
          </p>
          
          {showRating && (
            <div className="flex items-center space-x-1">
              <div className="flex">
                {renderStars(rating)}
              </div>
              <span className={cn("text-gray-500", ratingSize)}>
                ({reviewCount})
              </span>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <span 
              className={cn("font-bold text-primary", priceSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {price}
            </span>
            {originalPrice && (
              <span 
                className={cn("text-gray-500 line-through", originalPriceSize)}
                onDoubleClick={onTextDoubleClick}
              >
                {originalPrice}
              </span>
            )}
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <Button className="w-full" size="sm">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
