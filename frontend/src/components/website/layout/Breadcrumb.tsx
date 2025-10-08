import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { ChevronRight, Home } from 'lucide-react'
import { getResponsiveTextSize } from '../renderer'

export const BreadcrumbConfig: ComponentConfig = {
  id: 'breadcrumb',
  name: 'Breadcrumb',
  category: 'layout',
  icon: 'ChevronRight',
  description: 'Show navigation breadcrumbs',
  defaultProps: { 
    items: ['Home', 'Products', 'Category', 'Current Page'],
    showHome: true,
    separator: 'chevron'
  },
  defaultSize: { width: 400, height: 40 },
  editableFields: ['items', 'showHome', 'separator']
}

interface BreadcrumbProps extends WebsiteComponentProps {
  items: string[]
  showHome: boolean
  separator: 'chevron' | 'slash' | 'arrow'
}

export const WebsiteBreadcrumb: React.FC<BreadcrumbProps> = ({ 
  items, 
  showHome, 
  separator,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const getSeparator = () => {
    switch (separator) {
      case 'slash': return '/'
      case 'arrow': return '→'
      default: return <ChevronRight className="w-3 h-3" />
    }
  }

  const textSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <nav className="w-full h-full flex items-center" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {showHome && (
          <>
            <li>
              <a 
                href="#"
                className={cn("text-gray-500 hover:text-gray-700", textSize)}
                onDoubleClick={onTextDoubleClick}
              >
                <Home className="w-4 h-4" />
              </a>
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">
                {getSeparator()}
              </span>
            </li>
          </>
        )}
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="text-gray-400 mx-2">
                {getSeparator()}
              </span>
            )}
            {index === items.length - 1 ? (
              <span 
                className={cn("text-gray-900 font-medium", textSize)}
                onDoubleClick={onTextDoubleClick}
              >
                {item}
              </span>
            ) : (
              <a 
                href="#"
                className={cn("text-gray-500 hover:text-gray-700", textSize)}
                onDoubleClick={onTextDoubleClick}
              >
                {item}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
