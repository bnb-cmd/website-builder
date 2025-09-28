'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types/ecommerce'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  viewMode: 'grid' | 'list'
  onClick?: () => void
  onAddToCart?: (quantity: number) => void
  onAddToWishlist?: () => void
  showQuickView?: boolean
}

export function ProductCard({
  product,
  viewMode,
  onClick,
  onAddToCart,
  onAddToWishlist,
  showQuickView = true
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onAddToCart) {
      setIsLoading(true)
      await onAddToCart(quantity)
      setIsLoading(false)
    }
  }

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToWishlist?.()
  }

  const isOnSale = product.comparePrice && product.comparePrice > product.price
  const discountPercentage = isOnSale 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  const isOutOfStock = product.inventory.track && product.inventory.quantity <= 0

  if (viewMode === 'list') {
    return (
      <Card 
        className="cursor-pointer hover:shadow-lg transition-all duration-300"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-4">
          <div className="flex space-x-4">
            {/* Image */}
            <div className="relative w-24 h-24 flex-shrink-0">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground text-xs">No Image</span>
                </div>
              )}
              
              {isOnSale && (
                <Badge className="absolute -top-2 -right-2 bg-red-500">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-3 w-3',
                        i < 4 ? 'text-yellow-400 fill-current' : 'text-muted-foreground'
                      )}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground">(4.5)</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold">
                  PKR {product.price.toLocaleString()}
                </span>
                {isOnSale && (
                  <span className="text-sm text-muted-foreground line-through">
                    PKR {product.comparePrice!.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              {isOutOfStock ? (
                <Badge variant="destructive">Out of Stock</Badge>
              ) : product.inventory.track && product.inventory.quantity <= 5 ? (
                <Badge variant="secondary">
                  Only {product.inventory.quantity} left
                </Badge>
              ) : null}
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-2 justify-center">
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isLoading}
                className="whitespace-nowrap"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              
              {onAddToWishlist && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddToWishlist}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No Image</span>
          </div>
        )}
        
        {isOnSale && (
          <Badge className="absolute top-2 left-2 bg-red-500">
            -{discountPercentage}%
          </Badge>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive" className="text-white">
              Out of Stock
            </Badge>
          </div>
        )}

        {/* Hover Actions */}
        {isHovered && !isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {showQuickView && (
              <Button size="sm" variant="secondary">
                <Eye className="h-4 w-4 mr-2" />
                Quick View
              </Button>
            )}
            {onAddToWishlist && (
              <Button size="sm" variant="secondary" onClick={handleAddToWishlist}>
                <Heart className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <CardHeader className="pb-2">
        <div className="space-y-1">
          <h3 className="font-semibold line-clamp-2 text-sm">{product.name}</h3>
          <p className="text-muted-foreground text-xs line-clamp-2">
            {product.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="py-2">
        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-3 w-3',
                i < 4 ? 'text-yellow-400 fill-current' : 'text-muted-foreground'
              )}
            />
          ))}
          <span className="text-xs text-muted-foreground">(4.5)</span>
        </div>

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">
              PKR {product.price.toLocaleString()}
            </span>
            {isOnSale && (
              <span className="text-sm text-muted-foreground line-through">
                PKR {product.comparePrice!.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {!isOutOfStock && product.inventory.track && product.inventory.quantity <= 5 && (
            <p className="text-xs text-orange-600">
              Only {product.inventory.quantity} left
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          className="w-full"
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading}
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isLoading ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  )
}
