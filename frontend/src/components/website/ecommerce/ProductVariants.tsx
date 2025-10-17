'use client'

import React, { useState } from 'react'
import { Star, Heart, ShoppingCart, Eye, Share2, CheckCircle, Truck, Shield, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProductVariantsProps {
  product: {
    id: string
    name: string
    basePrice: number
    image: string
    variants: Array<{
      id: string
      name: string
      type: 'size' | 'color' | 'material' | 'style'
      value: string
      price?: number
      image?: string
      inStock: boolean
      stockCount?: number
    }>
    selectedVariants: Record<string, string>
  }
  onVariantChange: (variantId: string, value: string) => void
  onAddToCart: (productId: string, quantity: number, variants: Record<string, string>) => void
  onAddToWishlist?: (productId: string) => void
  onQuickView?: (productId: string) => void
  showWishlist?: boolean
  showQuickView?: boolean
  showStock?: boolean
  showPrice?: boolean
  showImages?: boolean
  layout?: 'horizontal' | 'vertical' | 'compact'
  maxVariants?: number
}

export const ProductVariants: React.FC<ProductVariantsProps> = ({
  product = {
    id: '1',
    name: 'Premium Wireless Headphones',
    basePrice: 15000,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    variants: [
      {
        id: 'color-black',
        name: 'Color',
        type: 'color',
        value: 'Black',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
        inStock: true,
        stockCount: 15
      },
      {
        id: 'color-white',
        name: 'Color',
        type: 'color',
        value: 'White',
        price: 15000,
        image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=100&h=100&fit=crop',
        inStock: true,
        stockCount: 10
      },
      {
        id: 'size-s',
        name: 'Size',
        type: 'size',
        value: 'S',
        price: 15000,
        inStock: true,
        stockCount: 5
      },
      {
        id: 'size-m',
        name: 'Size',
        type: 'size',
        value: 'M',
        price: 15000,
        inStock: true,
        stockCount: 20
      },
      {
        id: 'size-l',
        name: 'Size',
        type: 'size',
        value: 'L',
        price: 15000,
        inStock: false,
        stockCount: 0
      },
      {
        id: 'material-leather',
        name: 'Material',
        type: 'material',
        value: 'Leather',
        price: 18000,
        inStock: true,
        stockCount: 8
      },
      {
        id: 'material-fabric',
        name: 'Material',
        type: 'material',
        value: 'Fabric',
        price: 15000,
        inStock: true,
        stockCount: 12
      }
    ],
    selectedVariants: {
      'color-black': 'Black',
      'size-m': 'M',
      'material-leather': 'Leather'
    }
  },
  onVariantChange,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  showWishlist = true,
  showQuickView = true,
  showStock = true,
  showPrice = true,
  showImages = true,
  layout = 'horizontal',
  maxVariants = 10
}) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)

  const handleVariantChange = (variantId: string, value: string) => {
    onVariantChange(variantId, value)
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      await onAddToCart(product.id, 1, product.selectedVariants)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist)
    onAddToWishlist?.(product.id)
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  const getVariantGroups = () => {
    const groups: Record<string, any[]> = {}
    product.variants.forEach(variant => {
      if (!groups[variant.name]) {
        groups[variant.name] = []
      }
      groups[variant.name].push(variant)
    })
    return groups
  }

  const getCurrentPrice = () => {
    let totalPrice = product.basePrice
    product.variants.forEach(variant => {
      if (product.selectedVariants[variant.id] === variant.value && variant.price) {
        totalPrice += variant.price - product.basePrice
      }
    })
    return totalPrice
  }

  const getCurrentImage = () => {
    const selectedVariant = product.variants.find(variant => 
      product.selectedVariants[variant.id] === variant.value && variant.image
    )
    return selectedVariant?.image || product.image
  }

  const getCurrentStock = () => {
    const selectedVariant = product.variants.find(variant => 
      product.selectedVariants[variant.id] === variant.value
    )
    return selectedVariant?.inStock || false
  }

  const getCurrentStockCount = () => {
    const selectedVariant = product.variants.find(variant => 
      product.selectedVariants[variant.id] === variant.value
    )
    return selectedVariant?.stockCount || 0
  }

  const VariantGroup = ({ groupName, variants }: { groupName: string; variants: any[] }) => (
    <div className="mb-4">
      <h4 className="font-medium text-gray-900 mb-2">{groupName}:</h4>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => handleVariantChange(variant.id, variant.value)}
            disabled={!variant.inStock}
            className={cn(
              'px-3 py-2 border rounded-md text-sm font-medium transition',
              product.selectedVariants[variant.id] === variant.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400',
              !variant.inStock && 'opacity-50 cursor-not-allowed'
            )}
          >
            {variant.value}
            {showPrice && variant.price && variant.price !== product.basePrice && (
              <span className="ml-1 text-xs">
                ({variant.price > product.basePrice ? '+' : ''}{formatPrice(variant.price - product.basePrice)})
              </span>
            )}
          </button>
        ))}
      </div>
      
      {showStock && (
        <div className="mt-2 text-sm text-gray-600">
          {variants.some(v => product.selectedVariants[v.id] === v.value && v.inStock) ? (
            <span className="text-green-600">
              ✓ In Stock ({getCurrentStockCount()} available)
            </span>
          ) : (
            <span className="text-red-600">✗ Out of Stock</span>
          )}
        </div>
      )}
    </div>
  )

  const ColorVariantGroup = ({ groupName, variants }: { groupName: string; variants: any[] }) => (
    <div className="mb-4">
      <h4 className="font-medium text-gray-900 mb-2">{groupName}:</h4>
      <div className="flex gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => handleVariantChange(variant.id, variant.value)}
            disabled={!variant.inStock}
            className={cn(
              'w-10 h-10 rounded-full border-2 transition',
              product.selectedVariants[variant.id] === variant.value
                ? 'border-blue-500'
                : 'border-gray-300 hover:border-gray-400',
              !variant.inStock && 'opacity-50 cursor-not-allowed'
            )}
            style={{
              backgroundColor: variant.value.toLowerCase(),
              backgroundImage: variant.image ? `url(${variant.image})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
            title={variant.value}
          />
        ))}
      </div>
      
      {showStock && (
        <div className="mt-2 text-sm text-gray-600">
          {variants.some(v => product.selectedVariants[v.id] === v.value && v.inStock) ? (
            <span className="text-green-600">
              ✓ In Stock ({getCurrentStockCount()} available)
            </span>
          ) : (
            <span className="text-red-600">✗ Out of Stock</span>
          )}
        </div>
      )}
    </div>
  )

  const ImageVariantGroup = ({ groupName, variants }: { groupName: string; variants: any[] }) => (
    <div className="mb-4">
      <h4 className="font-medium text-gray-900 mb-2">{groupName}:</h4>
      <div className="flex gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => handleVariantChange(variant.id, variant.value)}
            disabled={!variant.inStock}
            className={cn(
              'w-16 h-16 rounded-lg border-2 overflow-hidden transition',
              product.selectedVariants[variant.id] === variant.value
                ? 'border-blue-500'
                : 'border-gray-300 hover:border-gray-400',
              !variant.inStock && 'opacity-50 cursor-not-allowed'
            )}
          >
            <img
              src={variant.image || product.image}
              alt={variant.value}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
      
      {showStock && (
        <div className="mt-2 text-sm text-gray-600">
          {variants.some(v => product.selectedVariants[v.id] === v.value && v.inStock) ? (
            <span className="text-green-600">
              ✓ In Stock ({getCurrentStockCount()} available)
            </span>
          ) : (
            <span className="text-red-600">✗ Out of Stock</span>
          )}
        </div>
      )}
    </div>
  )

  const variantGroups = getVariantGroups()
  const displayedGroups = Object.entries(variantGroups).slice(0, maxVariants)

  if (layout === 'vertical') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex gap-6">
          {/* Product Image */}
          <div className="w-64">
            <img
              src={getCurrentImage()}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          {/* Variants */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-4">{product.name}</h3>
            
            {showPrice && (
              <div className="text-2xl font-bold text-gray-900 mb-4">
                {formatPrice(getCurrentPrice())}
              </div>
            )}

            {displayedGroups.map(([groupName, variants]) => {
              if (variants[0].type === 'color') {
                return <ColorVariantGroup key={groupName} groupName={groupName} variants={variants} />
              } else if (variants[0].type === 'material' && variants.some(v => v.image)) {
                return <ImageVariantGroup key={groupName} groupName={groupName} variants={variants} />
              } else {
                return <VariantGroup key={groupName} groupName={groupName} variants={variants} />
              }
            })}

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddToCart}
                disabled={!getCurrentStock() || isAddingToCart}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition',
                  getCurrentStock()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                )}
              >
                <ShoppingCart className="w-5 h-5" />
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              
              {showWishlist && (
                <button
                  onClick={handleWishlistToggle}
                  className={cn(
                    'p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition',
                    isInWishlist
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-gray-300 hover:border-gray-400'
                  )}
                >
                  <Heart className={cn('w-5 h-5', isInWishlist && 'fill-current')} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (layout === 'compact') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex gap-4">
          <img
            src={getCurrentImage()}
            alt={product.name}
            className="w-20 h-20 object-cover rounded"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
            
            {showPrice && (
              <div className="text-lg font-bold text-gray-900 mb-2">
                {formatPrice(getCurrentPrice())}
              </div>
            )}

            {displayedGroups.map(([groupName, variants]) => (
              <div key={groupName} className="mb-2">
                <span className="text-sm font-medium text-gray-700">{groupName}: </span>
                <span className="text-sm text-gray-900">
                  {variants.find(v => product.selectedVariants[v.id] === v.value)?.value || 'Not selected'}
                </span>
              </div>
            ))}

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleAddToCart}
                disabled={!getCurrentStock() || isAddingToCart}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition',
                  getCurrentStock()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                )}
              >
                <ShoppingCart className="w-4 h-4" />
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>

              {showWishlist && (
                <button
                  onClick={handleWishlistToggle}
                  className={cn(
                    'p-2 border rounded-md transition',
                    isInWishlist
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-gray-300 hover:border-gray-400'
                  )}
                >
                  <Heart className={cn('w-4 h-4', isInWishlist && 'fill-current')} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Horizontal layout (default)
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="space-y-6">
        {/* Product Header */}
        <div className="flex gap-6">
          <img
            src={getCurrentImage()}
            alt={product.name}
            className="w-32 h-32 object-cover rounded-lg"
          />
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
            
            {showPrice && (
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {formatPrice(getCurrentPrice())}
              </div>
            )}

            {showStock && (
              <div className="text-sm text-gray-600">
                {getCurrentStock() ? (
                  <span className="text-green-600">✓ In Stock ({getCurrentStockCount()} available)</span>
                ) : (
                  <span className="text-red-600">✗ Out of Stock</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-4">
          {displayedGroups.map(([groupName, variants]) => {
            if (variants[0].type === 'color') {
              return <ColorVariantGroup key={groupName} groupName={groupName} variants={variants} />
            } else if (variants[0].type === 'material' && variants.some(v => v.image)) {
              return <ImageVariantGroup key={groupName} groupName={groupName} variants={variants} />
            } else {
              return <VariantGroup key={groupName} groupName={groupName} variants={variants} />
            }
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={!getCurrentStock() || isAddingToCart}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition',
              getCurrentStock()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            )}
          >
            <ShoppingCart className="w-5 h-5" />
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
          
          {showWishlist && (
            <button
              onClick={handleWishlistToggle}
              className={cn(
                'p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition',
                isInWishlist
                  ? 'border-red-300 bg-red-50 text-red-600'
                  : 'border-gray-300 hover:border-gray-400'
              )}
            >
              <Heart className={cn('w-5 h-5', isInWishlist && 'fill-current')} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Component configuration for editor
export const ProductVariantsConfig = {
  id: 'product-variants',
  name: 'Product Variants',
  description: 'Product variants selector with size, color, and material options',
  category: 'ecommerce' as const,
  icon: 'layers',
  defaultProps: {
    product: {
      id: '1',
      name: 'Premium Wireless Headphones',
      basePrice: 15000,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      variants: [
        {
          id: 'color-black',
          name: 'Color',
          type: 'color',
          value: 'Black',
          price: 15000,
          inStock: true,
          stockCount: 15
        },
        {
          id: 'size-m',
          name: 'Size',
          type: 'size',
          value: 'M',
          price: 15000,
          inStock: true,
          stockCount: 20
        }
      ],
      selectedVariants: {
        'color-black': 'Black',
        'size-m': 'M'
      }
    },
    showWishlist: true,
    showQuickView: true,
    showStock: true,
    showPrice: true,
    showImages: true,
    layout: 'horizontal',
    maxVariants: 10
  },
  defaultSize: { width: 100, height: 400 },
  editableFields: [
    'product',
    'showWishlist',
    'showQuickView',
    'showStock',
    'showPrice',
    'showImages',
    'layout',
    'maxVariants'
  ]
}
