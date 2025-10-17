'use client'

import React, { useState } from 'react'
import { X, ShoppingCart, Heart, Eye, Star } from '@/lib/icons'
import { cn } from '@/lib/utils'

export interface ProductQuickViewProps {
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    images?: string[]
    description: string
    rating: number
    reviewCount: number
    inStock: boolean
    stockCount?: number
    variants?: Array<{
      id: string
      name: string
      value: string
      type: 'size' | 'color' | 'material'
    }>
    features?: string[]
  }
  onAddToCart: (productId: string, quantity: number, variants?: any) => void
  onClose: () => void
  onAddToWishlist?: (productId: string) => void
  showWishlist?: boolean
  showQuantity?: boolean
  maxQuantity?: number
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
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
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    stockCount: 15,
    variants: [
      { id: 'color-black', name: 'Color', value: 'Black', type: 'color' },
      { id: 'color-white', name: 'Color', value: 'White', type: 'color' },
      { id: 'size-s', name: 'Size', value: 'S', type: 'size' },
      { id: 'size-m', name: 'Size', value: 'M', type: 'size' }
    ],
    features: ['Noise Cancellation', '30-hour Battery', 'Quick Charge', 'Premium Materials']
  },
  onAddToCart,
  onClose,
  onAddToWishlist,
  showWishlist = true,
  showQuantity = true,
  maxQuantity = 10
}) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleVariantChange = (variantId: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantId]: value
    }))
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      await onAddToCart(product.id, quantity, selectedVariants)
      // Could show success message here
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'w-4 h-4',
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Images */}
          <div className="lg:w-1/2 p-6">
            <div className="aspect-square mb-4">
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'w-16 h-16 rounded-lg overflow-hidden border-2 transition',
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    )}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 p-6 flex flex-col">
            {/* Header */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-4">
                {product.inStock ? (
                  <span className="text-green-600 font-medium">
                    ✓ In Stock {product.stockCount && `(${product.stockCount} available)`}
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">✗ Out of Stock</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Features */}
            {product.features && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Key Features:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Variants */}
            {product.variants && (
              <div className="mb-6">
                {Object.entries(
                  product.variants.reduce((acc, variant) => {
                    if (!acc[variant.name]) acc[variant.name] = []
                    acc[variant.name]!.push(variant)
                    return acc
                  }, {} as Record<string, typeof product.variants>)
                ).map(([variantName, variants]) => (
                  <div key={variantName} className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">{variantName}:</h4>
                    <div className="flex gap-2">
                      {variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => handleVariantChange(variant.id, variant.value)}
                          className={cn(
                            'px-3 py-2 border rounded-md text-sm transition',
                            selectedVariants[variant.id] === variant.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          )}
                        >
                          {variant.value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            {showQuantity && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Quantity:</h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                    className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition',
                  product.inStock
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                )}
              >
                <ShoppingCart className="w-5 h-5" />
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              
              {showWishlist && onAddToWishlist && (
                <button
                  onClick={() => onAddToWishlist(product.id)}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <Heart className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Component configuration for editor
export const ProductQuickViewConfig = {
  id: 'product-quick-view',
  name: 'Product Quick View',
  description: 'Quick product preview modal with add to cart functionality',
  category: 'ecommerce' as const,
  icon: 'eye',
  defaultProps: {
    product: {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 15000,
      originalPrice: 20000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      description: 'High-quality wireless headphones with noise cancellation.',
      rating: 4.5,
      reviewCount: 128,
      inStock: true,
      stockCount: 15
    },
    showWishlist: true,
    showQuantity: true,
    maxQuantity: 10
  },
  defaultSize: { width: 100, height: 500 },
  editableFields: [
    'product',
    'showWishlist',
    'showQuantity',
    'maxQuantity'
  ]
}
