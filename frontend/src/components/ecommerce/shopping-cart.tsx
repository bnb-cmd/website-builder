'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CartItem, ShoppingCart as Cart } from '@/types/ecommerce'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ShoppingCartProps {
  cart: Cart
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onCheckout: () => void
  isOpen?: boolean
  onClose?: () => void
  loading?: boolean
}

interface CartItemRowProps {
  item: CartItem
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
}

function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return
    setIsUpdating(true)
    await onUpdateQuantity(newQuantity)
    setIsUpdating(false)
  }

  const itemTotal = item.price * item.quantity

  return (
    <div className="flex space-x-4 py-4">
      {/* Image */}
      <div className="w-16 h-16 relative flex-shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
            <span className="text-xs text-muted-foreground">No Image</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 space-y-2">
        <div>
          <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
          {item.options && Object.keys(item.options).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(item.options).map(([key, value]) => (
                <Badge key={key} variant="outline" className="text-xs">
                  {key}: {value}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || isUpdating}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              value={item.quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value)
                if (!isNaN(value) && value > 0) {
                  handleQuantityChange(value)
                }
              }}
              className="w-16 text-center h-8"
              min="1"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="font-semibold">
              PKR {itemTotal.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              PKR {item.price.toLocaleString()} each
            </div>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function ShoppingCart({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isOpen = true,
  onClose,
  loading = false
}: ShoppingCartProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    await onCheckout()
    setIsCheckingOut(false)
  }

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  if (!isOpen) {
    return null
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Shopping Cart</span>
            {itemCount > 0 && (
              <Badge variant="secondary">{itemCount}</Badge>
            )}
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {cart.items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground text-sm">
              Add some products to get started
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {cart.items.map((item, index) => (
              <div key={item.id}>
                <CartItemRow
                  item={item}
                  onUpdateQuantity={(quantity) => onUpdateQuantity(item.id, quantity)}
                  onRemove={() => onRemoveItem(item.id)}
                />
                {index < cart.items.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {cart.items.length > 0 && (
        <CardFooter className="flex flex-col space-y-4">
          {/* Order Summary */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>PKR {cart.subtotal.toLocaleString()}</span>
            </div>
            
            {cart.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-PKR {cart.discount.toLocaleString()}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>
                {cart.shipping === 0 ? 'Free' : `PKR ${cart.shipping.toLocaleString()}`}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>PKR {cart.tax.toLocaleString()}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>PKR {cart.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            className="w-full"
            onClick={handleCheckout}
            disabled={isCheckingOut || loading}
            size="lg"
          >
            {isCheckingOut ? (
              'Processing...'
            ) : (
              <>
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
