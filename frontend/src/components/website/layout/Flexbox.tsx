import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const FlexboxConfig: ComponentConfig = {
  id: 'flexbox',
  name: 'Flexbox',
  category: 'layout',
  icon: 'Layout',
  description: 'Create flexible layouts with flexbox',
  defaultProps: { 
    direction: 'row',
    justify: 'center',
    align: 'center',
    gap: 'medium',
    items: ['Item 1', 'Item 2', 'Item 3']
  },
  defaultSize: { width: 500, height: 150 },
  editableFields: ['direction', 'justify', 'align', 'gap', 'items']
}

interface FlexboxProps extends WebsiteComponentProps {
  direction: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justify: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  align: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  gap: 'small' | 'medium' | 'large'
  items: string[]
}

export const WebsiteFlexbox: React.FC<FlexboxProps> = ({ 
  direction, 
  justify, 
  align, 
  gap, 
  items,
  deviceMode = 'desktop'
}) => {
  const getDirectionClass = () => {
    switch (direction) {
      case 'row': return 'flex-row'
      case 'column': return 'flex-col'
      case 'row-reverse': return 'flex-row-reverse'
      case 'column-reverse': return 'flex-col-reverse'
      default: return 'flex-row'
    }
  }

  const getJustifyClass = () => {
    switch (justify) {
      case 'start': return 'justify-start'
      case 'center': return 'justify-center'
      case 'end': return 'justify-end'
      case 'between': return 'justify-between'
      case 'around': return 'justify-around'
      case 'evenly': return 'justify-evenly'
      default: return 'justify-center'
    }
  }

  const getAlignClass = () => {
    switch (align) {
      case 'start': return 'items-start'
      case 'center': return 'items-center'
      case 'end': return 'items-end'
      case 'stretch': return 'items-stretch'
      case 'baseline': return 'items-baseline'
      default: return 'items-center'
    }
  }

  const getGapClass = () => {
    switch (gap) {
      case 'small': return 'gap-2'
      case 'large': return 'gap-8'
      default: return 'gap-4'
    }
  }

  const padding = getResponsivePadding('p-4', deviceMode)
  const textSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <div className={cn("w-full h-full", padding)}>
      <div className={cn(
        "flex",
        getDirectionClass(),
        getJustifyClass(),
        getAlignClass(),
        getGapClass()
      )}>
        {items.map((item, index) => (
          <div 
            key={index}
            className="bg-gray-100 border border-gray-200 rounded-lg p-3 min-w-0 flex-shrink-0"
          >
            <span className={textSize}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
