import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'

interface CartElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function CartElement({ element, onUpdate, viewMode, style, children }: CartElementProps) {
  const handleQuantityChange = (itemId: string, quantity: number) => {
    const updatedItems = element.props.items?.map((item: any) =>
      item.id === itemId ? { ...item, quantity } : item
    ) || []
    
    onUpdate(element.id, {
      props: {
        ...element.props,
        items: updatedItems
      }
    })
  }

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = element.props.items?.filter((item: any) => item.id !== itemId) || []
    
    onUpdate(element.id, {
      props: {
        ...element.props,
        items: updatedItems
      }
    })
  }

  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'sidebar':
        return 'fixed right-0 top-0 h-full w-96 bg-background border-l border-border z-50'
      case 'modal':
        return 'fixed inset-0 bg-black/50 flex items-center justify-center z-50'
      case 'page':
        return 'w-full max-w-4xl mx-auto'
      default:
        return 'w-full max-w-4xl mx-auto'
    }
  }

  const items = element.props.items || [
    {
      id: '1',
      name: 'Product Name',
      price: 29.99,
      quantity: 2,
      image: '/placeholder-product.jpg'
    },
    {
      id: '2',
      name: 'Another Product',
      price: 19.99,
      quantity: 1,
      image: '/placeholder-product.jpg'
    }
  ]

  const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08
  const shipping = subtotal > 50 ? 0 : 9.99
  const total = subtotal + tax + shipping

  return (
    <div
      className={cn(
        'p-6',
        getVariantClass()
      )}
      style={style}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Shopping Cart</h2>
        <div className="text-sm text-muted-foreground">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {items.map((item: any) => (
          <div key={item.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
            {/* Product Image */}
            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{item.name}</h3>
              <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Item Total */}
            <div className="text-right">
              <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => handleRemoveItem(item.id)}
              className="p-1 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="border-t border-border pt-6">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-border pt-3">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button className="w-full py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium mb-4">
          Proceed to Checkout
        </button>

        {/* Continue Shopping */}
        <button className="w-full py-2 border border-border rounded-md hover:bg-muted transition-colors">
          Continue Shopping
        </button>
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground mb-6">Add some items to get started</p>
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Start Shopping
          </button>
        </div>
      )}
    </div>
  )
}
