import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { CreditCard, Lock, Shield } from 'lucide-react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const PaymentFormConfig: ComponentConfig = {
  id: 'payment-form',
  name: 'Payment Form',
  category: 'ecommerce',
  icon: 'CreditCard',
  description: 'Secure payment processing form',
  defaultProps: { 
    title: 'Payment Information',
    subtitle: 'Secure payment powered by Stripe',
    cardTypes: ['Visa', 'Mastercard', 'American Express'],
    showCardTypes: true,
    showBillingAddress: true,
    showSaveCard: true,
    totalAmount: '$128.36'
  },
  defaultSize: { width: 400, height: 500 },
  editableFields: ['title', 'subtitle', 'cardTypes', 'showCardTypes', 'showBillingAddress', 'showSaveCard', 'totalAmount']
}

interface PaymentFormProps extends WebsiteComponentProps {
  title: string
  subtitle: string
  cardTypes: string[]
  showCardTypes: boolean
  showBillingAddress: boolean
  showSaveCard: boolean
  totalAmount: string
}

export const WebsitePaymentForm: React.FC<PaymentFormProps> = ({ 
  title, 
  subtitle, 
  cardTypes, 
  showCardTypes, 
  showBillingAddress, 
  showSaveCard, 
  totalAmount,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const padding = getResponsivePadding('p-6', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-sm', deviceMode)
  const labelSize = getResponsiveTextSize('text-sm', deviceMode)
  const totalSize = getResponsiveTextSize('text-lg', deviceMode)

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
        
        {/* Card Types */}
        {showCardTypes && (
          <div className="space-y-2">
            <Label className={labelSize}>Accepted Cards</Label>
            <div className="flex space-x-2">
              {cardTypes.map((cardType, index) => (
                <div key={index} className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded">
                  <CreditCard className="w-4 h-4 text-gray-600" />
                  <span className={cn("text-gray-600", subtitleSize)}>{cardType}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Card Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className={labelSize}>Card Number</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="1234 5678 9012 3456"
                className="pl-10"
                readOnly
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className={labelSize}>Expiry Date</Label>
              <Input placeholder="MM/YY" readOnly />
            </div>
            <div className="space-y-2">
              <Label className={labelSize}>CVV</Label>
              <Input placeholder="123" readOnly />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className={labelSize}>Cardholder Name</Label>
            <Input placeholder="John Doe" readOnly />
          </div>
        </div>
        
        {/* Billing Address */}
        {showBillingAddress && (
          <div className="space-y-4">
            <h3 className={cn("font-semibold", labelSize)}>Billing Address</h3>
            <div className="space-y-3">
              <Input placeholder="Street Address" readOnly />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="City" readOnly />
                <Input placeholder="ZIP Code" readOnly />
              </div>
              <Input placeholder="Country" readOnly />
            </div>
          </div>
        )}
        
        {/* Save Card Option */}
        {showSaveCard && (
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="save-card" className="rounded border-gray-300" />
            <Label htmlFor="save-card" className={cn("text-gray-600", subtitleSize)}>
              Save this card for future purchases
            </Label>
          </div>
        )}
        
        {/* Security Notice */}
        <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
          <Shield className="w-4 h-4 text-green-600" />
          <span className={cn("text-green-700", subtitleSize)}>
            Your payment information is encrypted and secure
          </span>
        </div>
        
        {/* Total and Pay Button */}
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className={cn("font-semibold", labelSize)}>Total Amount</span>
            <span 
              className={cn("font-bold text-primary", totalSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {totalAmount}
            </span>
          </div>
          
          <Button className="w-full" size="lg">
            <Lock className="w-4 h-4 mr-2" />
            Pay Securely
          </Button>
        </div>
      </div>
    </div>
  )
}
