import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { getResponsiveTextSize } from '../renderer'

export const HighlightConfig: ComponentConfig = {
  id: 'highlight',
  name: 'Highlight',
  category: 'basic',
  icon: 'Highlighter',
  description: 'Highlight important text with background colors',
  defaultProps: { 
    text: 'This is highlighted text',
    color: 'yellow',
    weight: 'normal'
  },
  defaultSize: { width: 250, height: 40 },
  editableFields: ['text', 'color', 'weight']
}

interface HighlightProps extends WebsiteComponentProps {
  text: string
  color: 'yellow' | 'green' | 'blue' | 'pink' | 'purple'
  weight: 'normal' | 'bold'
}

export const WebsiteHighlight: React.FC<HighlightProps> = ({ 
  text, 
  color, 
  weight,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'yellow': return 'bg-yellow-200 text-yellow-900'
      case 'green': return 'bg-green-200 text-green-900'
      case 'blue': return 'bg-blue-200 text-blue-900'
      case 'pink': return 'bg-pink-200 text-pink-900'
      case 'purple': return 'bg-purple-200 text-purple-900'
      default: return 'bg-yellow-200 text-yellow-900'
    }
  }

  const textSize = getResponsiveTextSize('text-base', deviceMode)
  const weightClass = weight === 'bold' ? 'font-bold' : 'font-normal'

  return (
    <span 
      className={`${textSize} ${getColorClass()} ${weightClass} px-2 py-1 rounded`}
      onDoubleClick={onTextDoubleClick}
    >
      {text}
    </span>
  )
}
