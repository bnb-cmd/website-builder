import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { ShoppingCart } from 'lucide-react'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const ShoppingCartConfig: ComponentConfig = {
  id: 'shopping-cart',
  name: 'Shopping Cart',
  category: 'ecommerce',
  icon: 'ShoppingCart',
  description: 'Shopping cart component',
  defaultProps: {},
  defaultSize: { width: 300, height: 200 },
  editableFields: []
}

interface ShoppingCartProps extends WebsiteComponentProps {}

export const WebsiteShoppingCart: React.FC<ShoppingCartProps> = ({ deviceMode = 'desktop' }) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  const padding = getResponsivePadding('p-4', deviceMode)
  
  return (
    <Card className={`w-full h-full flex flex-col justify-center items-center ${padding}`}>
      <ShoppingCart className="w-8 h-8 text-primary mb-4" />
      <p className={`text-center mb-4 ${textSize}`}>Your cart is empty</p>
      <Button size="sm">Add Items</Button>
    </Card>
  )
}
