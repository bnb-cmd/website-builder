import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { getResponsiveTextSize } from '../renderer'

export const TextConfig: ComponentConfig = {
  id: 'text',
  name: 'Text',
  category: 'basic',
  icon: 'AlignLeft',
  description: 'Add text content',
  defaultProps: { text: 'Your text content goes here. Click to edit this text and make it your own.' },
  defaultSize: { width: 400, height: 80 },
  editableFields: ['text']
}

interface TextProps extends WebsiteComponentProps {
  text: string
}

export const Text: React.FC<TextProps> = ({ 
  text, 
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const textSize = getResponsiveTextSize('text-base', deviceMode)
  
  return (
    <p 
      className={textSize}
      onDoubleClick={onTextDoubleClick}
    >
      {text}
    </p>
  )
}
