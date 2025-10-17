"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Input } from '../ui/input'
import { cn } from '../../lib/utils'
import { ShoppingCart as ShoppingCartIcon, Plus, Minus, Trash2, X } from '@/lib/icons'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  currency: string
  imageUrl: string
  quantity: number
}

export interface ShoppingCartProps {
  items: CartItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
  onClearCart: () => void
  onProceedToCheckout: () => void
  language: 'ENGLISH' | 'URDU'
  className?: string
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  language,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'PKR') {
      return `Rs. ${price.toLocaleString('en-PK')}`
    }
    return `${currency} ${price.toLocaleString()}`
  }

  const translations = {
    ENGLISH: {
      cart: 'Shopping Cart',
      empty: 'Your cart is empty',
      subtotal: 'Subtotal',
      total: 'Total',
      checkout: 'Proceed to Checkout',
      clear: 'Clear Cart',
      quantity: 'Qty',
      remove: 'Remove',
      close: 'Close'
    },
    URDU: {
      cart: 'خریداری کی ٹوکری',
      empty: 'آپ کی ٹوکری خالی ہے',
      subtotal: 'ذیلی کل',
      total: 'کل',
      checkout: 'خریداری مکمل کریں',
      clear: 'ٹوکری صاف کریں',
      quantity: 'مقدار',
      remove: 'ہٹائیں',
      close: 'بند کریں'
    }
  }

  const t = translations[language]

  // Auto-open cart when items are added
  useEffect(() => {
    if (items.length > 0) {
      setIsOpen(true)
    }
  }, [items.length])

  return (
    <>
      {/* Cart Toggle Button */}
      <Button
        variant="outline"
        size="lg"
        className="fixed top-4 right-4 z-50 bg-white shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <ShoppingCartIcon className="mr-2 h-5 w-5" />
        <span className="font-semibold">{t.cart}</span>
        {totalItems > 0 && (
          <Badge variant="destructive" className="ml-2">
            {totalItems}
          </Badge>
        )}
      </Button>

      {/* Cart Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsOpen(false)}>
          <Card 
            className={cn(
              "fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300",
              isOpen ? "translate-x-0" : "translate-x-full",
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold" dir={language === 'URDU' ? 'rtl' : 'ltr'}>
                {t.cart} ({totalItems})
              </CardTitle>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearCart}
                    className="text-red-600 hover:text-red-700"
                  >
                    {t.clear}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <ShoppingCartIcon className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg" dir={language === 'URDU' ? 'rtl' : 'ltr'}>
                    {t.empty}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center space-x-4 p-3 border rounded-lg">
                      {/* Product Image */}
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2" dir={language === 'URDU' ? 'rtl' : 'ltr'}>
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {formatPrice(item.price, item.currency)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.productId, Math.max(0, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const newQuantity = parseInt(e.target.value) || 1
                            onUpdateQuantity(item.productId, Math.max(1, newQuantity))
                          }}
                          className="w-12 h-8 text-center"
                        />
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        onClick={() => onRemoveItem(item.productId)}
                        title={t.remove}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>

            {/* Cart Footer */}
            {items.length > 0 && (
              <>
                <Separator />
                <div className="p-4 space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium" dir={language === 'URDU' ? 'rtl' : 'ltr'}>
                      {t.subtotal}:
                    </span>
                    <span className="text-sm">
                      {formatPrice(totalAmount, 'PKR')}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold" dir={language === 'URDU' ? 'rtl' : 'ltr'}>
                      {t.total}:
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(totalAmount, 'PKR')}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={onProceedToCheckout}
                    className="w-full"
                    size="lg"
                  >
                    {t.checkout}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </>
  )
}

export default ShoppingCart
