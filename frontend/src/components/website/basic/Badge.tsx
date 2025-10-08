import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Badge } from '../../ui/badge'
import { getResponsiveTextSize } from '../renderer'

export const BadgeConfig: ComponentConfig = {
  id: 'badge',
  name: 'Badge',
  category: 'basic',
  icon: 'Star',
  description: 'Display badges and labels',
  defaultProps: { 
    text: 'New',
    variant: 'default',
    size: 'default'
  },
  defaultSize: { width: 60, height: 24 },
  editableFields: ['text', 'variant', 'size']
}

interface BadgeProps extends WebsiteComponentProps {
  text: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  size: 'sm' | 'default' | 'lg'
}

export const WebsiteBadge: React.FC<BadgeProps> = ({ 
  text, 
  variant, 
  size,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'text-xs px-2 py-1'
      case 'lg': return 'text-base px-4 py-2'
      default: return 'text-sm px-3 py-1'
    }
  }

  const textSize = getResponsiveTextSize(getSizeClass(), deviceMode)

  return (
    <Badge 
      variant={variant}
      className={`${textSize} cursor-default`}
      onDoubleClick={onTextDoubleClick}
    >
      {text}
    </Badge>
  )
}
