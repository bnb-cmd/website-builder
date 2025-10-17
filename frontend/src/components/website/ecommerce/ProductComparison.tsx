'use client'

import React, { useState } from 'react'
import { Star, Heart, ShoppingCart, Eye, Share2, CheckCircle, Truck, Shield, RotateCcw } from '@/lib/icons'
import { cn } from '@/lib/utils'

export interface ProductComparisonProps {
  products: Array<{
    id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    rating: number
    reviewCount: number
    inStock: boolean
    stockCount?: number
    badge?: string
    description?: string
    features?: string[]
    specifications?: Record<string, string>
    warranty?: string
    shipping?: string
    returnPolicy?: string
  }>
  onAddToCart: (productId: string, quantity: number) => void
  onAddToWishlist?: (productId: string) => void
  onQuickView?: (productId: string) => void
  onRemove?: (productId: string) => void
  showFeatures?: boolean
  showSpecifications?: boolean
  showWarranty?: boolean
  showShipping?: boolean
  showReturnPolicy?: boolean
  showWishlist?: boolean
  showQuickView?: boolean
  showRating?: boolean
  showStock?: boolean
  showBadge?: boolean
  maxProducts?: number
  layout?: 'table' | 'cards' | 'compact'
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({
  products = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 15000,
      originalPrice: 20000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      rating: 4.5,
      reviewCount: 128,
      inStock: true,
      stockCount: 15,
      badge: 'Sale',
      description: 'High-quality wireless headphones with noise cancellation.',
      features: ['Noise Cancellation', '30-hour Battery', 'Quick Charge', 'Premium Materials'],
      specifications: {
        'Driver Size': '40mm',
        'Frequency Response': '20Hz - 20kHz',
        'Impedance': '32 Ohms',
        'Battery Life': '30 hours',
        'Charging Time': '2 hours',
        'Weight': '250g',
        'Connectivity': 'Bluetooth 5.0'
      },
      warranty: '1 Year Manufacturer Warranty',
      shipping: 'Free shipping on orders over PKR 5,000',
      returnPolicy: '30-day return policy'
    },
    {
      id: '2',
      name: 'Budget Wireless Headphones',
      price: 8000,
      image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200&h=200&fit=crop',
      rating: 4.2,
      reviewCount: 89,
      inStock: true,
      stockCount: 25,
      description: 'Affordable wireless headphones with good sound quality.',
      features: ['Wireless', '12-hour Battery', 'Comfortable Fit'],
      specifications: {
        'Driver Size': '32mm',
        'Frequency Response': '20Hz - 18kHz',
        'Impedance': '32 Ohms',
        'Battery Life': '12 hours',
        'Charging Time': '3 hours',
        'Weight': '200g',
        'Connectivity': 'Bluetooth 4.2'
      },
      warranty: '6 Months Warranty',
      shipping: 'Free shipping on orders over PKR 3,000',
      returnPolicy: '15-day return policy'
    },
    {
      id: '3',
      name: 'Professional Studio Headphones',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop',
      rating: 4.8,
      reviewCount: 45,
      inStock: false,
      badge: 'Out of Stock',
      description: 'Professional-grade studio headphones for audio professionals.',
      features: ['Studio Quality', 'Detachable Cable', 'Foldable Design', 'Professional Grade'],
      specifications: {
        'Driver Size': '50mm',
        'Frequency Response': '5Hz - 40kHz',
        'Impedance': '250 Ohms',
        'Battery Life': 'N/A (Wired)',
        'Charging Time': 'N/A',
        'Weight': '350g',
        'Connectivity': '3.5mm Jack'
      },
      warranty: '2 Years Manufacturer Warranty',
      shipping: 'Free shipping on all orders',
      returnPolicy: '60-day return policy'
    }
  ],
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  onRemove,
  showFeatures = true,
  showSpecifications = true,
  showWarranty = true,
  showShipping = true,
  showReturnPolicy = true,
  showWishlist = true,
  showQuickView = true,
  showRating = true,
  showStock = true,
  showBadge = true,
  maxProducts = 4,
  layout = 'table'
}) => {
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null)
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set())

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

  const handleWishlistToggle = (productId: string) => {
    setWishlistItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
    onAddToWishlist?.(productId)
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

  const getSpecificationKeys = () => {
    const allKeys = new Set<string>()
    products.forEach(product => {
      if (product.specifications) {
        Object.keys(product.specifications).forEach(key => allKeys.add(key))
      }
    })
    return Array.from(allKeys)
  }

  const ProductCard = ({ product }: { product: any }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="relative mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg"
        />
        
        {showBadge && product.badge && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {product.badge}
          </div>
        )}

        {onRemove && (
          <button
            onClick={() => onRemove(product.id)}
            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
          >
            ×
          </button>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
        
        {showRating && (
          <div className="flex items-center gap-1">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-xs text-gray-600">({product.reviewCount})</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {showStock && (
          <div className="text-sm">
            {product.inStock ? (
              <span className="text-green-600">✓ In Stock</span>
            ) : (
              <span className="text-red-600">✗ Out of Stock</span>
            )}
          </div>
        )}

        {showFeatures && product.features && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {product.features.slice(0, 3).map((feature: string, index: number) => (
                <li key={index}>• {feature}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => handleAddToCart(product.id)}
            disabled={!product.inStock || isAddingToCart === product.id}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition',
              product.inStock
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            )}
          >
            <ShoppingCart className="w-4 h-4" />
            {isAddingToCart === product.id ? 'Adding...' : 'Add to Cart'}
          </button>

          {showWishlist && (
            <button
              onClick={() => handleWishlistToggle(product.id)}
              className={cn(
                'p-2 border rounded-md transition',
                wishlistItems.has(product.id)
                  ? 'border-red-300 bg-red-50 text-red-600'
                  : 'border-gray-300 hover:border-gray-400'
              )}
            >
              <Heart className={cn('w-4 h-4', wishlistItems.has(product.id) && 'fill-current')} />
            </button>
          )}
        </div>
      </div>
    </div>
  )

  const ComparisonTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-4 font-semibold text-gray-900">Product</th>
            {products.map((product) => (
              <th key={product.id} className="text-center p-4 min-w-[200px]">
                <div className="space-y-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded mx-auto"
                  />
                  <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                  <div className="font-bold text-gray-900">{formatPrice(product.price)}</div>
                  {onRemove && (
                    <button
                      onClick={() => onRemove(product.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody>
          {/* Rating */}
          {showRating && (
            <tr className="border-b border-gray-100">
              <td className="p-4 font-medium text-gray-700">Rating</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  <div className="flex justify-center gap-1 mb-1">
                    {renderStars(product.rating)}
                  </div>
                  <div className="text-sm text-gray-600">({product.reviewCount})</div>
                </td>
              ))}
            </tr>
          )}

          {/* Stock Status */}
          {showStock && (
            <tr className="border-b border-gray-100">
              <td className="p-4 font-medium text-gray-700">Availability</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center">
                  {product.inStock ? (
                    <span className="text-green-600">✓ In Stock</span>
                  ) : (
                    <span className="text-red-600">✗ Out of Stock</span>
                  )}
                </td>
              ))}
            </tr>
          )}

          {/* Features */}
          {showFeatures && (
            <tr className="border-b border-gray-100">
              <td className="p-4 font-medium text-gray-700">Key Features</td>
              {products.map((product) => (
                <td key={product.id} className="p-4">
                  <ul className="text-sm text-gray-600 space-y-1">
                    {product.features?.slice(0, 3).map((feature: string, index: number) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          )}

          {/* Specifications */}
          {showSpecifications && getSpecificationKeys().map((specKey) => (
            <tr key={specKey} className="border-b border-gray-100">
              <td className="p-4 font-medium text-gray-700">{specKey}</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center text-sm text-gray-600">
                  {product.specifications?.[specKey] || '-'}
                </td>
              ))}
            </tr>
          ))}

          {/* Warranty */}
          {showWarranty && (
            <tr className="border-b border-gray-100">
              <td className="p-4 font-medium text-gray-700">Warranty</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center text-sm text-gray-600">
                  {product.warranty || '-'}
                </td>
              ))}
            </tr>
          )}

          {/* Shipping */}
          {showShipping && (
            <tr className="border-b border-gray-100">
              <td className="p-4 font-medium text-gray-700">Shipping</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center text-sm text-gray-600">
                  {product.shipping || '-'}
                </td>
              ))}
            </tr>
          )}

          {/* Return Policy */}
          {showReturnPolicy && (
            <tr className="border-b border-gray-100">
              <td className="p-4 font-medium text-gray-700">Return Policy</td>
              {products.map((product) => (
                <td key={product.id} className="p-4 text-center text-sm text-gray-600">
                  {product.returnPolicy || '-'}
                </td>
              ))}
            </tr>
          )}

          {/* Actions */}
          <tr>
            <td className="p-4 font-medium text-gray-700">Actions</td>
            {products.map((product) => (
              <td key={product.id} className="p-4">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={!product.inStock || isAddingToCart === product.id}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition',
                      product.inStock
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    )}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {isAddingToCart === product.id ? 'Adding...' : 'Add to Cart'}
                  </button>
                  
                  {showWishlist && (
                    <button
                      onClick={() => handleWishlistToggle(product.id)}
                      className={cn(
                        'p-2 border rounded-md transition',
                        wishlistItems.has(product.id)
                          ? 'border-red-300 bg-red-50 text-red-600'
                          : 'border-gray-300 hover:border-gray-400'
                      )}
                    >
                      <Heart className={cn('w-4 h-4', wishlistItems.has(product.id) && 'fill-current')} />
                    </button>
                  )}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )

  if (layout === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    )
  }

  if (layout === 'compact') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="text-xs text-gray-600">({product.reviewCount})</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddToCart(product.id)}
                disabled={!product.inStock}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition',
                  product.inStock
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                )}
              >
                Add to Cart
              </button>
              {onRemove && (
                <button
                  onClick={() => onRemove(product.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <span className="text-sm">Remove</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Table layout (default)
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <ComparisonTable />
    </div>
  )
}

// Component configuration for editor
export const ProductComparisonConfig = {
  id: 'product-comparison',
  name: 'Product Comparison',
  description: 'Product comparison table with specifications and features',
  category: 'ecommerce' as const,
  icon: 'git-compare',
  defaultProps: {
    products: [
      {
        id: '1',
        name: 'Premium Wireless Headphones',
        price: 15000,
        originalPrice: 20000,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
        rating: 4.5,
        reviewCount: 128,
        inStock: true,
        stockCount: 15,
        badge: 'Sale',
        features: ['Noise Cancellation', '30-hour Battery', 'Quick Charge'],
        specifications: {
          'Driver Size': '40mm',
          'Battery Life': '30 hours',
          'Weight': '250g'
        },
        warranty: '1 Year Manufacturer Warranty',
        shipping: 'Free shipping on orders over PKR 5,000',
        returnPolicy: '30-day return policy'
      }
    ],
    showFeatures: true,
    showSpecifications: true,
    showWarranty: true,
    showShipping: true,
    showReturnPolicy: true,
    showWishlist: true,
    showQuickView: true,
    showRating: true,
    showStock: true,
    showBadge: true,
    maxProducts: 4,
    layout: 'table'
  },
  defaultSize: { width: 100, height: 600 },
  editableFields: [
    'products',
    'showFeatures',
    'showSpecifications',
    'showWarranty',
    'showShipping',
    'showReturnPolicy',
    'showWishlist',
    'showQuickView',
    'showRating',
    'showStock',
    'showBadge',
    'maxProducts',
    'layout'
  ]
}