import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { CreditCard, Lock, ArrowRight } from '@/lib/icons'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const CheckoutConfig: ComponentConfig = {
  id: 'checkout',
  name: 'Checkout',
  category: 'ecommerce',
  icon: 'CreditCard',
  description: 'Complete purchase process',
  defaultProps: { 
    title: 'Checkout',
    subtitle: 'Complete your purchase',
    items: [
      { name: 'Product 1', quantity: 2, price: '$29.99' },
      { name: 'Product 2', quantity: 1, price: '$49.99' }
    ],
    subtotal: '$109.97',
    shipping: '$9.99',
    tax: '$8.40',
    total: '$128.36',
    showPromoCode: true,
    showBillingInfo: true
  },
  defaultSize: { width: 500, height: 600 },
  editableFields: ['title', 'subtitle', 'items', 'subtotal', 'shipping', 'tax', 'total', 'showPromoCode', 'showBillingInfo']
}

interface CheckoutItem {
  name: string
  quantity: number
  price: string
}

interface CheckoutProps extends WebsiteComponentProps {
  title: string
  subtitle: string
  items: CheckoutItem[]
  subtotal: string
  shipping: string
  tax: string
  total: string
  showPromoCode: boolean
  showBillingInfo: boolean
}

export const WebsiteCheckout: React.FC<CheckoutProps> = ({ 
  title, 
  subtitle, 
  items, 
  subtotal, 
  shipping, 
  tax, 
  total, 
  showPromoCode, 
  showBillingInfo,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const padding = getResponsivePadding('p-6', deviceMode)
  const titleSize = getResponsiveTextSize('text-2xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-sm', deviceMode)
  const itemSize = getResponsiveTextSize('text-sm', deviceMode)
  const totalSize = getResponsiveTextSize('text-lg', deviceMode)
  const labelSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <div className={cn("w-full h-full bg-white border border-gray-200 rounded-lg", padding)}>
      <div className="space-y-6">
        <div className="text-center">
          <h2 
            className={cn("font-bold mb-2", titleSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {title}
          </h2>
          <p 
            className={cn("text-gray-600", subtitleSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {subtitle}
          </p>
        </div>
        
        {/* Order Summary */}
        <div className="space-y-3">
          <h3 className={cn("font-semibold", labelSize)}>Order Summary</h3>
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <span 
                  className={cn("font-medium", itemSize)}
                  onDoubleClick={onTextDoubleClick}
                >
                  {item.name}
                </span>
                <span className={cn("text-gray-500 ml-2", itemSize)}>
                  x{item.quantity}
                </span>
              </div>
              <span 
                className={cn("font-medium", itemSize)}
                onDoubleClick={onTextDoubleClick}
              >
                {item.price}
              </span>
            </div>
          ))}
          
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between">
              <span className={cn("text-gray-600", itemSize)}>Subtotal</span>
              <span 
                className={cn("font-medium", itemSize)}
                onDoubleClick={onTextDoubleClick}
              >
                {subtotal}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={cn("text-gray-600", itemSize)}>Shipping</span>
              <span 
                className={cn("font-medium", itemSize)}
                onDoubleClick={onTextDoubleClick}
              >
                {shipping}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={cn("text-gray-600", itemSize)}>Tax</span>
              <span 
                className={cn("font-medium", itemSize)}
                onDoubleClick={onTextDoubleClick}
              >
                {tax}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className={cn("font-bold", totalSize)}>Total</span>
              <span 
                className={cn("font-bold", totalSize)}
                onDoubleClick={onTextDoubleClick}
              >
                {total}
              </span>
            </div>
          </div>
        </div>
        
        {/* Promo Code */}
        {showPromoCode && (
          <div className="space-y-2">
            <Label className={labelSize}>Promo Code</Label>
            <div className="flex space-x-2">
              <Input 
                placeholder="Enter promo code"
                className="flex-1"
                readOnly
              />
              <Button variant="outline">Apply</Button>
            </div>
          </div>
        )}
        
        {/* Billing Info */}
        {showBillingInfo && (
          <div className="space-y-3">
            <h3 className={cn("font-semibold", labelSize)}>Billing Information</h3>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="First Name" readOnly />
              <Input placeholder="Last Name" readOnly />
              <Input placeholder="Email" className="col-span-2" readOnly />
              <Input placeholder="Address" className="col-span-2" readOnly />
              <Input placeholder="City" readOnly />
              <Input placeholder="ZIP Code" readOnly />
            </div>
          </div>
        )}
        
        {/* Payment */}
        <div className="space-y-3">
          <h3 className={cn("font-semibold", labelSize)}>Payment</h3>
          <div className="space-y-2">
            <Input placeholder="Card Number" readOnly />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="MM/YY" readOnly />
              <Input placeholder="CVV" readOnly />
            </div>
          </div>
        </div>
        
        {/* Complete Order Button */}
        <Button className="w-full" size="lg">
          <Lock className="w-4 h-4 mr-2" />
          Complete Order
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
