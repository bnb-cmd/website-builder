import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const NavigationConfig: ComponentConfig = {
  id: 'navigation',
  name: 'Navigation',
  category: 'layout',
  icon: 'Layout',
  description: 'Create navigation menus and breadcrumbs',
  defaultProps: { 
    items: ['Home', 'Products', 'About', 'Contact'],
    style: 'horizontal',
    activeItem: 'Home'
  },
  defaultSize: { width: 600, height: 60 },
  editableFields: ['items', 'style', 'activeItem']
}

interface NavigationProps extends WebsiteComponentProps {
  items: string[]
  style: 'horizontal' | 'vertical' | 'tabs'
  activeItem: string
}

export const WebsiteNavigation: React.FC<NavigationProps> = ({ 
  items, 
  style, 
  activeItem,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const getStyleClass = () => {
    switch (style) {
      case 'vertical': return 'flex-col space-y-2'
      case 'tabs': return 'border-b border-gray-200'
      default: return 'flex-row space-x-6'
    }
  }

  const getItemClass = () => {
    switch (style) {
      case 'tabs': return 'px-4 py-2 border-b-2 border-transparent hover:border-gray-300'
      default: return 'px-3 py-2 rounded-md hover:bg-gray-100'
    }
  }

  const getActiveClass = () => {
    switch (style) {
      case 'tabs': return 'border-primary text-primary'
      default: return 'bg-primary text-primary-foreground'
    }
  }

  const padding = getResponsivePadding('p-4', deviceMode)
  const textSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <nav className={cn("w-full h-full", padding)}>
      <ul className={cn("flex", getStyleClass())}>
        {items.map((item, index) => (
          <li key={index}>
            <a 
              href="#"
              className={cn(
                "transition-colors",
                textSize,
                getItemClass(),
                item === activeItem ? getActiveClass() : "text-gray-600 hover:text-gray-900"
              )}
              onDoubleClick={onTextDoubleClick}
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
