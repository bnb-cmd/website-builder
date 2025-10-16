import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { getResponsiveTextSize } from '../renderer'

export const TypographyConfig: ComponentConfig = {
  id: 'typography',
  name: 'Typography',
  category: 'basic',
  icon: 'Type',
  description: 'Advanced typography with multiple styles',
  defaultProps: { 
    text: 'Beautiful Typography',
    variant: 'h2',
    color: 'text-gray-900',
    weight: 'font-semibold',
    align: 'text-left'
  },
  defaultSize: { width: 400, height: 80 },
  editableFields: ['text', 'variant', 'color', 'weight', 'align']
}

interface TypographyProps extends WebsiteComponentProps {
  text: string
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  color: string
  weight: string
  align: string
}

export const Typography: React.FC<TypographyProps> = ({ 
  text, 
  variant, 
  color, 
  weight, 
  align,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const getVariantSize = () => {
    switch (variant) {
      case 'h1': return 'text-4xl'
      case 'h2': return 'text-3xl'
      case 'h3': return 'text-2xl'
      case 'h4': return 'text-xl'
      case 'h5': return 'text-lg'
      case 'h6': return 'text-base'
      default: return 'text-base'
    }
  }

  const textSize = getResponsiveTextSize(getVariantSize(), deviceMode)
  const Tag = variant as keyof React.JSX.IntrinsicElements

  return (
    <Tag 
      className={`${textSize} ${color} ${weight} ${align}`}
      onDoubleClick={onTextDoubleClick}
    >
      {text}
    </Tag>
  )
}
