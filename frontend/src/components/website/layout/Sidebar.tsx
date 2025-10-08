import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const SidebarConfig: ComponentConfig = {
  id: 'sidebar',
  name: 'Sidebar',
  category: 'layout',
  icon: 'Layout',
  description: 'Create sidebar navigation layouts',
  defaultProps: { 
    title: 'Navigation',
    items: ['Home', 'About', 'Services', 'Contact'],
    position: 'left',
    width: 'medium'
  },
  defaultSize: { width: 250, height: 400 },
  editableFields: ['title', 'items', 'position', 'width']
}

interface SidebarProps extends WebsiteComponentProps {
  title: string
  items: string[]
  position: 'left' | 'right'
  width: 'small' | 'medium' | 'large'
}

export const WebsiteSidebar: React.FC<SidebarProps> = ({ 
  title, 
  items, 
  position, 
  width,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const getWidthClass = () => {
    switch (width) {
      case 'small': return 'w-48'
      case 'large': return 'w-80'
      default: return 'w-64'
    }
  }

  const padding = getResponsivePadding('p-6', deviceMode)
  const titleSize = getResponsiveTextSize('text-lg', deviceMode)
  const itemSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <aside className={cn("h-full bg-gray-100 border-r border-gray-200", getWidthClass())}>
      <div className={padding}>
        <h3 
          className={cn("font-semibold mb-4 text-gray-800", titleSize)}
          onDoubleClick={onTextDoubleClick}
        >
          {title}
        </h3>
        <nav>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index}>
                <a 
                  href="#"
                  className={cn(
                    "block py-2 px-3 rounded-md hover:bg-gray-200 transition-colors",
                    itemSize
                  )}
                  onDoubleClick={onTextDoubleClick}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
