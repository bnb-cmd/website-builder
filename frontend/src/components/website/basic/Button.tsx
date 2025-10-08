import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Button } from '../../ui/button'
import { getResponsiveTextSize } from '../renderer'

export const ButtonConfig: ComponentConfig = {
  id: 'button',
  name: 'Button',
  category: 'basic',
  icon: 'Square',
  description: 'Add clickable buttons',
  defaultProps: { text: 'Click Me', variant: 'default' },
  defaultSize: { width: 120, height: 40 },
  editableFields: ['text', 'variant']
}

interface ButtonProps extends WebsiteComponentProps {
  text: string
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

export const WebsiteButton: React.FC<ButtonProps> = ({ 
  text, 
  variant = 'default',
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const textSize = getResponsiveTextSize('text-base', deviceMode)
  
  return (
    <Button 
      variant={variant} 
      className={textSize}
      onDoubleClick={onTextDoubleClick}
    >
      {text}
    </Button>
  )
}
