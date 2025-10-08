import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'

export const SpacerConfig: ComponentConfig = {
  id: 'spacer',
  name: 'Spacer',
  category: 'basic',
  icon: 'Minus',
  description: 'Add vertical or horizontal spacing',
  defaultProps: { 
    direction: 'vertical',
    size: 'medium'
  },
  defaultSize: { width: 200, height: 40 },
  editableFields: ['direction', 'size']
}

interface SpacerProps extends WebsiteComponentProps {
  direction: 'vertical' | 'horizontal'
  size: 'small' | 'medium' | 'large' | 'xl'
}

export const Spacer: React.FC<SpacerProps> = ({ 
  direction, 
  size,
  deviceMode = 'desktop'
}) => {
  const getSizeClass = () => {
    const sizes = {
      small: 'h-4',
      medium: 'h-8',
      large: 'h-16',
      xl: 'h-24'
    }
    return sizes[size] || sizes.medium
  }

  const getWidthClass = () => {
    const sizes = {
      small: 'w-4',
      medium: 'w-8',
      large: 'w-16',
      xl: 'w-24'
    }
    return sizes[size] || sizes.medium
  }

  if (direction === 'horizontal') {
    return <div className={`${getWidthClass()} h-full bg-transparent`} />
  }

  return <div className={`w-full ${getSizeClass()} bg-transparent`} />
}
