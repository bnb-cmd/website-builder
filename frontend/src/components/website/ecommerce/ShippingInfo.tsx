import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Truck, MapPin, Clock, Package } from 'lucide-react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const ShippingInfoConfig: ComponentConfig = {
  id: 'shipping-info',
  name: 'Shipping Info',
  category: 'ecommerce',
  icon: 'Truck',
  description: 'Shipping address and options',
  defaultProps: { 
    title: 'Shipping Information',
    subtitle: 'Where should we deliver your order?',
    shippingOptions: [
      { name: 'Standard Shipping', price: '$9.99', days: '5-7 business days' },
      { name: 'Express Shipping', price: '$19.99', days: '2-3 business days' },
      { name: 'Overnight Shipping', price: '$39.99', days: 'Next business day' }
    ],
    selectedOption: 'Standard Shipping',
    showShippingOptions: true,
    showTracking: true
  },
  defaultSize: { width: 450, height: 500 },
  editableFields: ['title', 'subtitle', 'shippingOptions', 'selectedOption', 'showShippingOptions', 'showTracking']
}

interface ShippingOption {
  name: string
  price: string
  days: string
}

interface ShippingInfoProps extends WebsiteComponentProps {
  title: string
  subtitle: string
  shippingOptions: ShippingOption[]
  selectedOption: string
  showShippingOptions: boolean
  showTracking: boolean
}

export const WebsiteShippingInfo: React.FC<ShippingInfoProps> = ({ 
  title, 
  subtitle, 
  shippingOptions, 
  selectedOption, 
  showShippingOptions, 
  showTracking,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const padding = getResponsivePadding('p-6', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-sm', deviceMode)
  const labelSize = getResponsiveTextSize('text-sm', deviceMode)
  const optionSize = getResponsiveTextSize('text-sm', deviceMode)

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
        
        {/* Shipping Address */}
        <div className="space-y-4">
          <h3 className={cn("font-semibold", labelSize)}>Shipping Address</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="First Name" readOnly />
              <Input placeholder="Last Name" readOnly />
            </div>
            <Input placeholder="Street Address" readOnly />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="City" readOnly />
              <Input placeholder="ZIP Code" readOnly />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="State" readOnly />
              <Input placeholder="Country" readOnly />
            </div>
            <Input placeholder="Phone Number" readOnly />
          </div>
        </div>
        
        {/* Shipping Options */}
        {showShippingOptions && (
          <div className="space-y-3">
            <h3 className={cn("font-semibold", labelSize)}>Shipping Options</h3>
            <div className="space-y-2">
              {shippingOptions.map((option, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors",
                    option.name === selectedOption 
                      ? "border-primary bg-primary/5" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={option.name === selectedOption}
                      readOnly
                      className="text-primary"
                    />
                    <div>
                      <div 
                        className={cn("font-medium", optionSize)}
                        onDoubleClick={onTextDoubleClick}
                      >
                        {option.name}
                      </div>
                      <div 
                        className={cn("text-gray-500", subtitleSize)}
                        onDoubleClick={onTextDoubleClick}
                      >
                        {option.days}
                      </div>
                    </div>
                  </div>
                  <div 
                    className={cn("font-semibold text-primary", optionSize)}
                    onDoubleClick={onTextDoubleClick}
                  >
                    {option.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Special Instructions */}
        <div className="space-y-2">
          <Label className={labelSize}>Special Instructions (Optional)</Label>
          <textarea 
            placeholder="Any special delivery instructions..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none"
            rows={3}
            readOnly
          />
        </div>
        
        {/* Tracking Information */}
        {showTracking && (
          <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-blue-600" />
              <span className={cn("font-medium text-blue-800", labelSize)}>
                Tracking Information
              </span>
            </div>
            <p className={cn("text-blue-700", subtitleSize)}>
              You'll receive tracking information via email once your order ships.
            </p>
          </div>
        )}
        
        {/* Continue Button */}
        <Button className="w-full" size="lg">
          <Truck className="w-4 h-4 mr-2" />
          Continue to Payment
        </Button>
      </div>
    </div>
  )
}

export { WebsiteShippingInfo as ShippingInfo }
