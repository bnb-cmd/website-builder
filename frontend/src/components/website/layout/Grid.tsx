import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const GridConfig: ComponentConfig = {
  id: 'grid',
  name: 'Grid',
  category: 'layout',
  icon: 'Grid',
  description: 'Create responsive grid layouts',
  defaultProps: { 
    columns: 3,
    gap: 'medium',
    items: ['Item 1', 'Item 2', 'Item 3']
  },
  defaultSize: { width: 600, height: 200 },
  editableFields: ['columns', 'gap', 'items']
}

interface GridProps extends WebsiteComponentProps {
  columns: number
  gap: 'small' | 'medium' | 'large'
  items: string[]
}

export const WebsiteGrid: React.FC<GridProps> = ({ 
  columns, 
  gap, 
  items,
  deviceMode = 'desktop'
}) => {
  const getGapClass = () => {
    switch (gap) {
      case 'small': return 'gap-2'
      case 'large': return 'gap-8'
      default: return 'gap-4'
    }
  }

  const getColumnsClass = () => {
    const responsiveColumns = deviceMode === 'mobile' ? Math.min(columns, 2) : 
                             deviceMode === 'tablet' ? Math.min(columns, 3) : columns
    return `grid-cols-${responsiveColumns}`
  }

  const padding = getResponsivePadding('p-4', deviceMode)
  const textSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <div className={cn("w-full h-full", padding)}>
      <div className={cn("grid", getColumnsClass(), getGapClass())}>
        {items.map((item, index) => (
          <div 
            key={index}
            className="bg-gray-100 border border-gray-200 rounded-lg p-3 flex items-center justify-center"
          >
            <span className={textSize}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
