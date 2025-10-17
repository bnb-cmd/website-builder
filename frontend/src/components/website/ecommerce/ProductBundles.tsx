'use client'

import React, { useState } from 'react'
import { Star, Heart, ShoppingCart, Eye, Share2, CheckCircle, Truck, Shield, RotateCcw } from '@/lib/icons'
import { cn } from '@/lib/utils'

export interface ProductBundlesProps {
  bundles: Array<{
    id: string
    name: string
    description: string
    image: string
    originalPrice: number
    bundlePrice: number
    savings: number
    products: Array<{
      id: string
      name: string
      price: number
      image: string
      quantity: number
    }>
    inStock: boolean
    stockCount?: number
    badge?: string
    category?: string
    tags?: string[]
  }>
  onAddToCart: (bundleId: string, quantity: number) => void
  onAddToWishlist?: (bundleId: string) => void
  onQuickView?: (bundleId: string) => void
  onProductClick?: (productId: string) => void
  showWishlist?: boolean
  showQuickView?: boolean
  showStock?: boolean
  showBadge?: boolean
  showDescription?: boolean
  showCategory?: boolean
  showTags?: boolean
  showSavings?: boolean
  layout?: 'grid' | 'list' | 'carousel' | 'compact'
  columns?: 2 | 3 | 4 | 5 | 6
  maxBundles?: number
  showViewAll?: boolean
  viewAllText?: string
  onViewAll?: () => void
}

export const ProductBundles: React.FC<ProductBundlesProps> = ({
  bundles = [
    {
      id: '1',
      name: 'Tech Starter Pack',
      description: 'Complete tech setup for beginners',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
      originalPrice: 25000,
      bundlePrice: 20000,
      savings: 5000,
      products: [
        {
          id: '1',
          name: 'Wireless Headphones',
          price: 15000,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
          quantity: 1
        },
        {
          id: '2',
          name: 'Smartphone Case',
          price: 2500,
          image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=100&h=100&fit=crop',
          quantity: 1
        },
        {
          id: '3',
          name: 'Bluetooth Speaker',
          price: 8000,
          image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop',
          quantity: 1
        }
      ],
      inStock: true,
      stockCount: 10,
      badge: 'Best Value',
      category: 'Electronics',
      tags: ['tech', 'starter', 'bundle']
    },
    {
      id: '2',
      name: 'Home Office Essentials',
      description: 'Everything you need for a productive home office',
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
      originalPrice: 18000,
      bundlePrice: 15000,
      savings: 3000,
      products: [
        {
          id: '4',
          name: 'Wireless Mouse',
          price: 3500,
          image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop',
          quantity: 1
        },
        {
          id: '5',
          name: 'Keyboard',
          price: 8000,
          image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=100&h=100&fit=crop',
          quantity: 1
        },
        {
          id: '6',
          name: 'Monitor Stand',
          price: 6500,
          image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100&h=100&fit=crop',
          quantity: 1
        }
      ],
      inStock: true,
      stockCount: 5,
      category: 'Office',
      tags: ['office', 'productivity', 'bundle']
    }
  ],
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  onProductClick,
  showWishlist = true,
  showQuickView = true,
  showStock = true,
  showBadge = true,
  showDescription = true,
  showCategory = false,
  showTags = false,
  showSavings = true,
  layout = 'grid',
  columns = 3,
  maxBundles = 6,
  showViewAll = true,
  viewAllText = 'View All Bundles',
  onViewAll
}) => {
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null)
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set())

  const handleAddToCart = async (bundleId: string) => {
    setIsAddingToCart(bundleId)
    try {
      await onAddToCart(bundleId, 1)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(null)
    }
  }

  const handleWishlistToggle = (bundleId: string) => {
    setWishlistItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(bundleId)) {
        newSet.delete(bundleId)
      } else {
        newSet.add(bundleId)
      }
      return newSet
    })
    onAddToWishlist?.(bundleId)
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  const getGridCols = () => {
    switch (columns) {
      case 2: return 'grid-cols-1 md:grid-cols-2'
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      case 5: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      case 6: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  const BundleCard = ({ bundle }: { bundle: any }) => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
      <div className="relative">
        <img
          src={bundle.image}
          alt={bundle.name}
          className="w-full h-48 object-cover"
        />
        
        {showBadge && bundle.badge && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            {bundle.badge}
          </div>
        )}

        {showSavings && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Save {formatPrice(bundle.savings)}
          </div>
        )}

        {/* Wishlist Button */}
        {showWishlist && (
          <button
            onClick={() => handleWishlistToggle(bundle.id)}
            className={cn(
              'absolute bottom-2 right-2 p-2 rounded-full shadow-lg transition',
              wishlistItems.has(bundle.id)
                ? 'bg-red-500 text-white'
                : 'bg-white hover:bg-gray-50'
            )}
          >
            <Heart className={cn('w-4 h-4', wishlistItems.has(bundle.id) && 'fill-current')} />
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{bundle.name}</h3>
        
        {showCategory && bundle.category && (
          <div className="text-xs text-blue-600 mb-1">{bundle.category}</div>
        )}
        
        {showDescription && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{bundle.description}</p>
        )}

        {/* Products in Bundle */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Includes:</h4>
          <div className="space-y-2">
            {bundle.products.slice(0, 3).map((product: any) => (
              <div key={product.id} className="flex items-center gap-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-8 h-8 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">× {product.quantity}</p>
                </div>
                <span className="text-xs font-medium text-gray-900">
                  {formatPrice(product.price)}
                </span>
              </div>
            ))}
            {bundle.products.length > 3 && (
              <div className="text-xs text-gray-500">
                +{bundle.products.length - 3} more items
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-gray-900">{formatPrice(bundle.bundlePrice)}</span>
            <span className="text-sm text-gray-500 line-through">{formatPrice(bundle.originalPrice)}</span>
          </div>
          {showSavings && (
            <div className="text-sm text-green-600 font-medium">
              You save {formatPrice(bundle.savings)} ({Math.round((bundle.savings / bundle.originalPrice) * 100)}%)
            </div>
          )}
        </div>

        {showStock && (
          <div className="text-sm text-gray-600 mb-3">
            {bundle.inStock ? (
              <span className="text-green-600">✓ In Stock</span>
            ) : (
              <span className="text-red-600">✗ Out of Stock</span>
            )}
          </div>
        )}

        {showTags && bundle.tags && (
          <div className="flex flex-wrap gap-1 mb-3">
            {bundle.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => handleAddToCart(bundle.id)}
          disabled={!bundle.inStock || isAddingToCart === bundle.id}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2 rounded-md font-medium transition',
            bundle.inStock
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          )}
        >
          <ShoppingCart className="w-4 h-4" />
          {isAddingToCart === bundle.id ? 'Adding...' : 'Add Bundle to Cart'}
        </button>
      </div>
    </div>
  )

  const BundleListItem = ({ bundle }: { bundle: any }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex gap-4">
        <img
          src={bundle.image}
          alt={bundle.name}
          className="w-32 h-32 object-cover rounded-lg"
        />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">{bundle.name}</h3>
          
          {showCategory && bundle.category && (
            <div className="text-xs text-blue-600 mb-1">{bundle.category}</div>
          )}
          
          {showDescription && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{bundle.description}</p>
          )}

          {/* Products in Bundle */}
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-900 mb-1">Includes:</h4>
            <div className="flex flex-wrap gap-2">
              {bundle.products.slice(0, 4).map((product: any) => (
                <div key={product.id} className="flex items-center gap-1">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-6 h-6 object-cover rounded"
                  />
                  <span className="text-xs text-gray-700">{product.name}</span>
                </div>
              ))}
              {bundle.products.length > 4 && (
                <span className="text-xs text-gray-500">
                  +{bundle.products.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-gray-900">{formatPrice(bundle.bundlePrice)}</span>
            <span className="text-sm text-gray-500 line-through">{formatPrice(bundle.originalPrice)}</span>
            {showSavings && (
              <span className="text-sm text-green-600 font-medium">
                Save {formatPrice(bundle.savings)}
              </span>
            )}
          </div>

          {showStock && (
            <div className="text-sm text-gray-600 mb-3">
              {bundle.inStock ? (
                <span className="text-green-600">✓ In Stock</span>
              ) : (
                <span className="text-red-600">✗ Out of Stock</span>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => handleAddToCart(bundle.id)}
              disabled={!bundle.inStock || isAddingToCart === bundle.id}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition',
                bundle.inStock
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              {isAddingToCart === bundle.id ? 'Adding...' : 'Add Bundle'}
            </button>

            {showWishlist && (
              <button
                onClick={() => handleWishlistToggle(bundle.id)}
                className={cn(
                  'p-2 border rounded-md transition',
                  wishlistItems.has(bundle.id)
                    ? 'border-red-300 bg-red-50 text-red-600'
                    : 'border-gray-300 hover:border-gray-400'
                )}
              >
                <Heart className={cn('w-4 h-4', wishlistItems.has(bundle.id) && 'fill-current')} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const displayedBundles = bundles.slice(0, maxBundles)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Bundles</h2>
          <p className="text-gray-600 mt-1">Save more when you buy together</p>
        </div>
        
        {showViewAll && onViewAll && (
          <button
            onClick={onViewAll}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {viewAllText} →
          </button>
        )}
      </div>

      {/* Bundles */}
      {layout === 'list' && (
        <div className="space-y-4">
          {displayedBundles.map((bundle) => (
            <BundleListItem key={bundle.id} bundle={bundle} />
          ))}
        </div>
      )}

      {layout === 'carousel' && (
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4">
            {displayedBundles.map((bundle) => (
              <div key={bundle.id} className="flex-shrink-0 w-80">
                <BundleCard bundle={bundle} />
              </div>
            ))}
          </div>
        </div>
      )}

      {layout === 'grid' && (
        <div className={cn('gap-4', getGridCols())}>
          {displayedBundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      )}
    </div>
  )
}

// Component configuration for editor
export const ProductBundlesConfig = {
  id: 'product-bundles',
  name: 'Product Bundles',
  description: 'Product bundles with savings and multiple items',
  category: 'ecommerce' as const,
  icon: 'package',
  defaultProps: {
    bundles: [
      {
        id: '1',
        name: 'Tech Starter Pack',
        description: 'Complete tech setup for beginners',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        originalPrice: 25000,
        bundlePrice: 20000,
        savings: 5000,
        products: [
          {
            id: '1',
            name: 'Wireless Headphones',
            price: 15000,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
            quantity: 1
          }
        ],
        inStock: true,
        stockCount: 10,
        badge: 'Best Value',
        category: 'Electronics',
        tags: ['tech', 'starter', 'bundle']
      }
    ],
    showWishlist: true,
    showQuickView: true,
    showStock: true,
    showBadge: true,
    showDescription: true,
    showCategory: false,
    showTags: false,
    showSavings: true,
    layout: 'grid',
    columns: 3,
    maxBundles: 6,
    showViewAll: true,
    viewAllText: 'View All Bundles'
  },
  defaultSize: { width: 100, height: 600 },
  editableFields: [
    'bundles',
    'showWishlist',
    'showQuickView',
    'showStock',
    'showBadge',
    'showDescription',
    'showCategory',
    'showTags',
    'showSavings',
    'layout',
    'columns',
    'maxBundles',
    'showViewAll',
    'viewAllText'
  ]
}
