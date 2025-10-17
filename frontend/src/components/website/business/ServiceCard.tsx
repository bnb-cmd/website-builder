import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { CheckCircle, ArrowRight } from '@/lib/icons'
import { Button } from '../../ui/button'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const ServiceCardConfig: ComponentConfig = {
  id: 'service-card',
  name: 'Service Card',
  category: 'business',
  icon: 'CheckCircle',
  description: 'Display service offerings',
  defaultProps: { 
    title: 'Web Development',
    description: 'Custom web applications built with modern technologies.',
    features: ['Responsive Design', 'Fast Performance', 'SEO Optimized'],
    price: '$99/month',
    buttonText: 'Get Started',
    showFeatures: true,
    showPrice: true
  },
  defaultSize: { width: 300, height: 400 },
  editableFields: ['title', 'description', 'features', 'price', 'buttonText', 'showFeatures', 'showPrice']
}

interface ServiceCardProps extends WebsiteComponentProps {
  title: string
  description: string
  features: string[]
  price: string
  buttonText: string
  showFeatures: boolean
  showPrice: boolean
}

export const WebsiteServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  description, 
  features, 
  price, 
  buttonText, 
  showFeatures, 
  showPrice,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const padding = getResponsivePadding('p-6', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const descriptionSize = getResponsiveTextSize('text-sm', deviceMode)
  const featureSize = getResponsiveTextSize('text-sm', deviceMode)
  const priceSize = getResponsiveTextSize('text-2xl', deviceMode)

  return (
    <div className={cn("w-full h-full bg-white border border-gray-200 rounded-lg", padding)}>
      <div className="space-y-4">
        <div className="text-center">
          <h3 
            className={cn("font-bold mb-2", titleSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {title}
          </h3>
          <p 
            className={cn("text-gray-600", descriptionSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {description}
          </p>
        </div>
        
        {showPrice && (
          <div className="text-center">
            <div 
              className={cn("font-bold text-primary", priceSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {price}
            </div>
          </div>
        )}
        
        {showFeatures && (
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span 
                  className={cn("text-gray-700", featureSize)}
                  onDoubleClick={onTextDoubleClick}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        )}
        
        <div className="pt-4">
          <Button className="w-full">
            {buttonText}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
