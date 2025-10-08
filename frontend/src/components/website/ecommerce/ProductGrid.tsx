import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const ProductGridConfig: ComponentConfig = {
  id: 'product-grid',
  name: 'Product Grid',
  category: 'ecommerce',
  icon: 'Grid3X3',
  description: 'Display products in a grid',
  defaultProps: {},
  defaultSize: { width: 500, height: 300 },
  editableFields: []
}

interface ProductGridProps extends WebsiteComponentProps {}

export const ProductGrid: React.FC<ProductGridProps> = ({ deviceMode = 'desktop' }) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  const padding = getResponsivePadding('p-4', deviceMode)
  
  return (
    <div className={`w-full h-full border-2 border-dashed border-muted-foreground rounded-lg bg-muted/20 ${padding}`}>
      <div className="grid grid-cols-2 gap-4 h-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/50 rounded border border-dashed border-gray-400 flex items-center justify-center">
            <p className={`text-muted-foreground ${textSize}`}>Product {i + 1}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
