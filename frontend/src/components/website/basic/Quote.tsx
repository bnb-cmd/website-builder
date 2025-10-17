import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Quote as QuoteIcon } from '@/lib/icons'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const QuoteConfig: ComponentConfig = {
  id: 'quote',
  name: 'Quote',
  category: 'basic',
  icon: 'Quote',
  description: 'Display inspirational quotes and testimonials',
  defaultProps: { 
    text: 'The best way to predict the future is to create it.',
    author: 'Peter Drucker',
    style: 'default'
  },
  defaultSize: { width: 400, height: 120 },
  editableFields: ['text', 'author', 'style']
}

interface QuoteProps extends WebsiteComponentProps {
  text: string
  author: string
  style: 'default' | 'minimal' | 'elegant'
}

export const WebsiteQuote: React.FC<QuoteProps> = ({ 
  text, 
  author, 
  style,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const textSize = getResponsiveTextSize('text-lg', deviceMode)
  const authorSize = getResponsiveTextSize('text-sm', deviceMode)
  const padding = getResponsivePadding('p-6', deviceMode)

  const getStyleClass = () => {
    switch (style) {
      case 'minimal': return 'border-l-4 border-primary bg-gray-50'
      case 'elegant': return 'bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20'
      default: return 'bg-gray-100 border border-gray-200'
    }
  }

  return (
    <div className={`w-full h-full ${getStyleClass()} rounded-lg ${padding} flex flex-col justify-center`}>
      <div className="flex items-start gap-3">
        <QuoteIcon className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
        <div className="flex-1">
          <blockquote 
            className={`${textSize} italic text-gray-700 mb-3`}
            onDoubleClick={onTextDoubleClick}
          >
            "{text}"
          </blockquote>
          <cite 
            className={`${authorSize} text-gray-600 font-medium`}
            onDoubleClick={onTextDoubleClick}
          >
            — {author}
          </cite>
        </div>
      </div>
    </div>
  )
}
