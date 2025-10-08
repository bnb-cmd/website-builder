import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const PricingCardConfig: ComponentConfig = {
  id: 'pricing-card',
  name: 'Pricing Card',
  category: 'ecommerce',
  icon: 'CreditCard',
  description: 'Display pricing plans',
  defaultProps: {},
  defaultSize: { width: 300, height: 400 },
  editableFields: []
}

interface PricingCardProps extends WebsiteComponentProps {}

export const PricingCard: React.FC<PricingCardProps> = ({ deviceMode = 'desktop' }) => {
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const priceSize = getResponsiveTextSize('text-4xl', deviceMode)
  const textSize = getResponsiveTextSize('text-base', deviceMode)
  const padding = getResponsivePadding('p-6', deviceMode)
  
  return (
    <Card className={`w-full h-full text-center flex flex-col justify-center ${padding}`}>
      <h3 className={`font-semibold mb-2 ${titleSize}`}>Basic Plan</h3>
      <p className={`font-bold mb-4 ${priceSize}`}>$9</p>
      <p className={`text-muted-foreground mb-6 ${textSize}`}>per month</p>
      <ul className={`text-left mx-auto mb-6 space-y-2 ${textSize}`}>
        <li>✅ Feature 1</li>
        <li>✅ Feature 2</li>
        <li>❌ Feature 3</li>
      </ul>
      <Button className="w-full">Choose Plan</Button>
    </Card>
  )
}
