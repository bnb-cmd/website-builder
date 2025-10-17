import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { ShoppingCart, Heart, Star } from '@/lib/icons'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const RelatedProductsConfig: ComponentConfig = {
  id: 'related-products',
  name: 'Related Products',
  category: 'ecommerce',
  icon: 'Grid',
  description: 'Show related product suggestions',
  defaultProps: { 
    title: 'You Might Also Like',
    subtitle: 'Customers who bought this item also bought',
    products: [
      {
        name: 'Wireless Earbuds',
        price: '$79.99',
        originalPrice: '$99.99',
        image: '',
        rating: 4.5,
        badge: 'Sale'
      },
      {
        name: 'Phone Stand',
        price: '$24.99',
        originalPrice: '',
        image: '',
        rating: 4.2,
        badge: ''
      },
      {
        name: 'USB-C Cable',
        price: '$12.99',
        originalPrice: '',
        image: '',
        rating: 4.7,
        badge: ''
      },
      {
        name: 'Screen Protector',
        price: '$8.99',
        originalPrice: '$14.99',
        image: '',
        rating: 4.3,
        badge: 'Sale'
      }
    ],
    showRatings: true,
    showWishlist: true,
    showBadges: true
  },
  defaultSize: { width: 600, height: 400 },
  editableFields: ['title', 'subtitle', 'products', 'showRatings', 'showWishlist', 'showBadges']
}

interface RelatedProduct {
  name: string
  price: string
  originalPrice: string
  image: string
  rating: number
  badge: string
}

interface RelatedProductsProps extends WebsiteComponentProps {
  title: string
  subtitle: string
  products: RelatedProduct[]
  showRatings: boolean
  showWishlist: boolean
  showBadges: boolean
}

export const WebsiteRelatedProducts: React.FC<RelatedProductsProps> = ({ 
  title, 
  subtitle, 
  products, 
  showRatings, 
  showWishlist, 
  showBadges,
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

  const padding = getResponsivePadding('p-6', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-sm', deviceMode)
  const productNameSize = getResponsiveTextSize('text-sm', deviceMode)
  const priceSize = getResponsiveTextSize('text-base', deviceMode)
  const originalPriceSize = getResponsiveTextSize('text-xs', deviceMode)

  return (
    <div className={cn("w-full h-full", padding)}>
      <div className="space-y-6">
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
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden group">
              <div className="relative">
                <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                
                {showBadges && product.badge && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-xs">
                    {product.badge}
                  </Badge>
                )}
                
                {showWishlist && (
                  <button className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100">
                    <Heart className="w-3 h-3 text-gray-600" />
                  </button>
                )}
              </div>
              
              <div className="p-3 space-y-2">
                <h3 
                  className={cn("font-medium line-clamp-2", productNameSize)}
                  onDoubleClick={onTextDoubleClick}
                >
                  {product.name}
                </h3>
                
                {showRatings && (
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {renderStars(product.rating)}
                    </div>
                    <span className={cn("text-gray-500", originalPriceSize)}>
                      ({product.rating})
                    </span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <span 
                    className={cn("font-bold text-primary", priceSize)}
                    onDoubleClick={onTextDoubleClick}
                  >
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span 
                      className={cn("text-gray-500 line-through", originalPriceSize)}
                      onDoubleClick={onTextDoubleClick}
                    >
                      {product.originalPrice}
                    </span>
                  )}
                </div>
                
                <Button size="sm" className="w-full">
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="outline">
            View All Related Products
          </Button>
        </div>
      </div>
    </div>
  )
}

export { WebsiteRelatedProducts as RelatedProducts }
