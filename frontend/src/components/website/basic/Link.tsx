import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { ExternalLink } from '@/lib/icons'
import { getResponsiveTextSize } from '../renderer'

export const LinkConfig: ComponentConfig = {
  id: 'link',
  name: 'Link',
  category: 'basic',
  icon: 'ExternalLink',
  description: 'Clickable links with external link indicator',
  defaultProps: { 
    text: 'Learn More',
    url: 'https://example.com',
    showIcon: true,
    variant: 'default'
  },
  defaultSize: { width: 120, height: 40 },
  editableFields: ['text', 'url', 'showIcon', 'variant']
}

interface LinkProps extends WebsiteComponentProps {
  text: string
  url: string
  showIcon: boolean
  variant: 'default' | 'primary' | 'secondary' | 'underline'
}

export const WebsiteLink: React.FC<LinkProps> = ({ 
  text, 
  url, 
  showIcon, 
  variant,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'text-primary hover:text-primary/80 font-medium'
      case 'secondary': return 'text-secondary hover:text-secondary/80'
      case 'underline': return 'text-blue-600 hover:text-blue-800 underline'
      default: return 'text-blue-600 hover:text-blue-800'
    }
  }

  const textSize = getResponsiveTextSize('text-base', deviceMode)

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 ${getVariantClass()} ${textSize} transition-colors`}
      onDoubleClick={onTextDoubleClick}
    >
      {text}
      {showIcon && <ExternalLink className="w-3 h-3" />}
    </a>
  )
}
