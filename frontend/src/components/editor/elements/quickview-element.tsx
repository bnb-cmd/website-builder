import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { X, ShoppingCart, Heart, Share2, Star, Plus, Minus } from 'lucide-react'
import { useState } from 'react'

interface QuickviewElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function QuickviewElement({ element, onUpdate, viewMode, style, children }: QuickviewElementProps) {
  const [isOpen, setIsOpen] = useState(element.props.isOpen || false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const handleClose = () => {
    setIsOpen(false)
    onUpdate(element.id, {
      props: {
        ...element.props,
        isOpen: false
      }
    })
  }

  const handleAddToCart = () => {
    console.log('Add to cart:', element.props.product?.id, quantity)
  }

  const handleAddToWishlist = () => {
    console.log('Add to wishlist:', element.props.product?.id)
  }

  const product = element.props.product || {
    id: '1',
    name: 'Product Name',
    price: 29.99,
    originalPrice: 39.99,
    images: ['/placeholder-product.jpg', '/placeholder-product.jpg'],
    rating: 4.5,
    reviews: 128,
    inStock: true,
    description: 'This is a great product with amazing features and quality.',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    variants: {
      'Color': ['Blue', 'Red', 'Green'],
      'Size': ['S', 'M', 'L', 'XL']
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <button
          className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          Open Quick View
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold">Quick View</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'w-16 h-16 bg-muted rounded-lg overflow-hidden border-2 transition-colors',
                      selectedImage === index ? 'border-primary' : 'border-transparent'
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
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Features */}
            {product.features && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Features</h3>
                <ul className="space-y-1">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <div className="w-1 h-1 bg-primary rounded-full" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Variants */}
            {product.variants && Object.keys(product.variants).map((variantName) => (
              <div key={variantName}>
                <h3 className="font-semibold text-foreground mb-2">{variantName}</h3>
                <div className="flex space-x-2">
                  {product.variants[variantName].map((option: string) => (
                    <button
                      key={option}
                      className="px-3 py-1 border border-border rounded-md hover:bg-muted transition-colors text-sm"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-border rounded-md hover:bg-muted transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-border rounded-md hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleAddToWishlist}
                  className="flex-1 py-2 border border-border rounded-md hover:bg-muted transition-colors flex items-center justify-center space-x-2"
                >
                  <Heart className="h-4 w-4" />
                  <span>Wishlist</span>
                </button>
                <button className="flex-1 py-2 border border-border rounded-md hover:bg-muted transition-colors flex items-center justify-center space-x-2">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="text-sm">
              {product.inStock ? (
                <span className="text-green-600 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <span>In Stock</span>
                </span>
              ) : (
                <span className="text-red-600 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                  <span>Out of Stock</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
