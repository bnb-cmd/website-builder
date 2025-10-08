import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const HeaderConfig: ComponentConfig = {
  id: 'header',
  name: 'Header',
  category: 'layout',
  icon: 'Layout',
  description: 'Create page headers and navigation bars',
  defaultProps: { 
    logo: 'Logo',
    title: 'Website Title',
    navItems: ['Home', 'About', 'Services', 'Contact'],
    style: 'default'
  },
  defaultSize: { width: 800, height: 80 },
  editableFields: ['logo', 'title', 'navItems', 'style']
}

interface HeaderProps extends WebsiteComponentProps {
  logo: string
  title: string
  navItems: string[]
  style: 'default' | 'minimal' | 'centered'
}

export const WebsiteHeader: React.FC<HeaderProps> = ({ 
  logo, 
  title, 
  navItems, 
  style,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const getStyleClass = () => {
    switch (style) {
      case 'minimal': return 'bg-white border-b border-gray-200'
      case 'centered': return 'bg-gray-900 text-white'
      default: return 'bg-primary text-primary-foreground'
    }
  }

  const padding = getResponsivePadding('px-6 py-4', deviceMode)
  const logoSize = getResponsiveTextSize('text-xl', deviceMode)
  const titleSize = getResponsiveTextSize('text-lg', deviceMode)
  const navSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <header className={cn("w-full h-full", getStyleClass(), padding)}>
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center space-x-4">
          <div 
            className={cn("font-bold", logoSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {logo}
          </div>
          <h1 
            className={cn("font-semibold", titleSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {title}
          </h1>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item, index) => (
            <a 
              key={index}
              href="#"
              className={cn("hover:opacity-80 transition-opacity", navSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
