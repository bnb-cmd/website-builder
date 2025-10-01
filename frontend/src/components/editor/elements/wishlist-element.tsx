import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Heart, ShoppingCart, Eye, Trash2 } from 'lucide-react'

interface WishlistElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function WishlistElement({ element, onUpdate, viewMode, style, children }: WishlistElementProps) {
  const handleRemoveItem = (itemId: string) => {
    const updatedItems = element.props.items?.filter((item: any) => item.id !== itemId) || []
    
    onUpdate(element.id, {
      props: {
        ...element.props,
        items: updatedItems
      }
    })
  }

  const handleMoveToCart = (itemId: string) => {
    // This would typically move the item from wishlist to cart
    console.log('Move to cart:', itemId)
  }

  const getLayoutClass = () => {
    switch (element.props.layout) {
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      case 'list':
        return 'space-y-4'
      case 'table':
        return 'space-y-2'
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    }
  }

  const items = element.props.items || [
    {
      id: '1',
      name: 'Product Name',
      price: 29.99,
      originalPrice: 39.99,
      image: '/placeholder-product.jpg',
      inStock: true,
      addedDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Another Product',
      price: 19.99,
      originalPrice: 19.99,
      image: '/placeholder-product.jpg',
      inStock: false,
      addedDate: '2024-01-10'
    }
  ]

  return (
    <div
      className="w-full"
      style={style}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-muted-foreground">
          {items.length} item{items.length !== 1 ? 's' : ''} in your wishlist
        </p>
      </div>

      {/* Wishlist Items */}
      <div className={getLayoutClass()}>
        {items.map((item: any) => (
          <div key={item.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {/* Product Image */}
            <div className="relative aspect-square bg-muted">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              
              {/* Stock Status */}
              {!item.inStock && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                  Out of Stock
                </div>
              )}
              
              {/* Quick Actions */}
              <div className="absolute top-2 right-2 flex flex-col space-y-2">
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                {item.name}
              </h3>
              
              {/* Price */}
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-semibold text-primary">
                  ${item.price.toFixed(2)}
                </span>
                {item.originalPrice > item.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${item.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleMoveToCart(item.id)}
                  disabled={!item.inStock}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-1',
                    item.inStock
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  )}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>{item.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                </button>
                
                <button className="p-2 border border-border rounded-md hover:bg-muted transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
              </div>

              {/* Added Date */}
              <div className="mt-2 text-xs text-muted-foreground">
                Added {new Date(item.addedDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-6">Add items you love to your wishlist</p>
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Start Shopping
          </button>
        </div>
      )}

      {/* Bulk Actions */}
      {items.length > 0 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
              Select All
            </button>
            <button className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
              Add Selected to Cart
            </button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Total Value: ${items.reduce((sum: number, item: any) => sum + item.price, 0).toFixed(2)}
          </div>
        </div>
      )}
    </div>
  )
}
