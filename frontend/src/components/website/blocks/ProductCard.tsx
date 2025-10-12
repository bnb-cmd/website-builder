"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { cn } from '../../lib/utils'
import { ShoppingCart, ExternalLink, Heart } from 'lucide-react'

export interface ProductCardProps {
  id: string
  name: string
  description: string
  price: number
  currency: string
  imageUrl: string
  stock?: number
  socialLink?: string
  language: 'ENGLISH' | 'URDU'
  onAddToCart: (productId: string) => void
  className?: string
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  currency,
  imageUrl,
  stock = 0,
  socialLink,
  language,
  onAddToCart,
  className
}) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const isOutOfStock = stock === 0
  const isLowStock = stock > 0 && stock <= 5

  const handleAddToCart = async () => {
    if (isOutOfStock) return
    
    setIsAddingToCart(true)
    try {
      await onAddToCart(id)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'PKR') {
      return `Rs. ${price.toLocaleString('en-PK')}`
    }
    return `${currency} ${price.toLocaleString()}`
  }

  const translations = {
    ENGLISH: {
      addToCart: 'Add to Cart',
      outOfStock: 'Out of Stock',
      lowStock: 'Only {stock} left',
      viewOriginal: 'View Original',
      addToFavorites: 'Add to Favorites',
      removeFromFavorites: 'Remove from Favorites'
    },
    URDU: {
      addToCart: 'کارٹ میں شامل کریں',
      outOfStock: 'ختم',
      lowStock: 'صرف {stock} باقی',
      viewOriginal: 'اصل دیکھیں',
      addToFavorites: 'پسندیدہ میں شامل کریں',
      removeFromFavorites: 'پسندیدہ سے ہٹائیں'
    }
  }

  const t = translations[language]

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
      isOutOfStock && "opacity-75",
      className
    )}>
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          fallbackSrc="/placeholder-product.jpg"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Stock Badge */}
        {isOutOfStock && (
          <Badge 
            variant="destructive" 
            className="absolute top-2 left-2"
          >
            {t.outOfStock}
          </Badge>
        )}
        
        {isLowStock && !isOutOfStock && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 left-2 bg-orange-100 text-orange-800"
          >
            {t.lowStock.replace('{stock}', stock.toString())}
          </Badge>
        )}

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 bg-white/90 hover:bg-white"
            onClick={() => setIsFavorited(!isFavorited)}
            title={isFavorited ? t.removeFromFavorites : t.addToFavorites}
          >
            <Heart 
              className={cn(
                "h-4 w-4",
                isFavorited && "fill-red-500 text-red-500"
              )} 
            />
          </Button>
          
          {socialLink && (
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-white/90 hover:bg-white"
              onClick={() => window.open(socialLink, '_blank')}
              title={t.viewOriginal}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        {/* Product Name */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2" dir={language === 'URDU' ? 'rtl' : 'ltr'}>
          {name}
        </h3>

        {/* Product Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2" dir={language === 'URDU' ? 'rtl' : 'ltr'}>
            {description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-primary">
            {formatPrice(price, currency)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAddingToCart}
          className="w-full"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isAddingToCart ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {language === 'URDU' ? 'شامل کر رہے ہیں...' : 'Adding...'}
            </span>
          ) : (
            t.addToCart
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCard
