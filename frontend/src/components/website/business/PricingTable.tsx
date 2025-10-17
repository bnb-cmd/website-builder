import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Check, X } from '@/lib/icons'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const PricingTableConfig: ComponentConfig = {
  id: 'pricing-table',
  name: 'Pricing Table',
  category: 'business',
  icon: 'CreditCard',
  description: 'Compare pricing plans',
  defaultProps: { 
    title: 'Choose Your Plan',
    plans: [
      {
        name: 'Basic',
        price: '$29',
        period: 'month',
        features: ['5 Projects', '10GB Storage', 'Email Support'],
        buttonText: 'Get Started',
        popular: false
      },
      {
        name: 'Pro',
        price: '$99',
        period: 'month',
        features: ['Unlimited Projects', '100GB Storage', 'Priority Support', 'Advanced Analytics'],
        buttonText: 'Get Started',
        popular: true
      },
      {
        name: 'Enterprise',
        price: '$299',
        period: 'month',
        features: ['Everything in Pro', 'Custom Integrations', 'Dedicated Support', 'SLA Guarantee'],
        buttonText: 'Contact Sales',
        popular: false
      }
    ]
  },
  defaultSize: { width: 800, height: 500 },
  editableFields: ['title', 'plans']
}

interface PricingPlan {
  name: string
  price: string
  period: string
  features: string[]
  buttonText: string
  popular: boolean
}

interface PricingTableProps extends WebsiteComponentProps {
  title: string
  plans: PricingPlan[]
}

export const WebsitePricingTable: React.FC<PricingTableProps> = ({ 
  title, 
  plans,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const padding = getResponsivePadding('p-6', deviceMode)
  const titleSize = getResponsiveTextSize('text-2xl', deviceMode)
  const planNameSize = getResponsiveTextSize('text-lg', deviceMode)
  const priceSize = getResponsiveTextSize('text-3xl', deviceMode)
  const featureSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <div className={cn("w-full h-full", padding)}>
      <h2 
        className={cn("text-center font-bold mb-8", titleSize)}
        onDoubleClick={onTextDoubleClick}
      >
        {title}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div 
            key={index}
            className={cn(
              "relative bg-white border rounded-lg p-6",
              plan.popular ? "border-primary shadow-lg" : "border-gray-200"
            )}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                Most Popular
              </Badge>
            )}
            
            <div className="text-center mb-6">
              <h3 
                className={cn("font-bold mb-2", planNameSize)}
                onDoubleClick={onTextDoubleClick}
              >
                {plan.name}
              </h3>
              <div className="mb-2">
                <span 
                  className={cn("font-bold", priceSize)}
                  onDoubleClick={onTextDoubleClick}
                >
                  {plan.price}
                </span>
                <span className="text-gray-600">/{plan.period}</span>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span 
                    className={cn("text-gray-700", featureSize)}
                    onDoubleClick={onTextDoubleClick}
                  >
                    {feature}
                  </span>
                </div>
              ))}
            </div>
            
            <Button 
              className={cn(
                "w-full",
                plan.popular ? "bg-primary" : "bg-gray-900 hover:bg-gray-800"
              )}
            >
              {plan.buttonText}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
