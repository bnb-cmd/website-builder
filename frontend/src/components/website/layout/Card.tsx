import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'
import { cn } from '@/lib/utils'

export const CardConfig: ComponentConfig = {
  id: 'card',
  name: 'Card',
  category: 'layout',
  icon: 'Square',
  description: 'Display content in card format',
  defaultProps: { 
    title: 'Card Title',
    description: 'This is a card description',
    content: 'Card content goes here',
    variant: 'default'
  },
  defaultSize: { width: 300, height: 200 },
  editableFields: ['title', 'description', 'content', 'variant']
}

interface CardProps extends WebsiteComponentProps {
  title: string
  description: string
  content: string
  variant: 'default' | 'outlined' | 'elevated'
}

export const WebsiteCard: React.FC<CardProps> = ({ 
  title, 
  description, 
  content, 
  variant,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'outlined': return 'border-2'
      case 'elevated': return 'shadow-lg'
      default: return 'shadow-sm'
    }
  }

  const padding = getResponsivePadding('p-6', deviceMode)
  const titleSize = getResponsiveTextSize('text-lg', deviceMode)
  const descriptionSize = getResponsiveTextSize('text-sm', deviceMode)
  const contentSize = getResponsiveTextSize('text-base', deviceMode)

  return (
    <Card className={cn("w-full h-full", getVariantClass())}>
      <CardHeader className={padding}>
        <CardTitle 
          className={titleSize}
          onDoubleClick={onTextDoubleClick}
        >
          {title}
        </CardTitle>
        <CardDescription 
          className={descriptionSize}
          onDoubleClick={onTextDoubleClick}
        >
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className={padding}>
        <p 
          className={contentSize}
          onDoubleClick={onTextDoubleClick}
        >
          {content}
        </p>
      </CardContent>
    </Card>
  )
}
