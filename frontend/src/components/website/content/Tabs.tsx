import React, { useState } from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const TabsConfig: ComponentConfig = {
  id: 'tabs',
  name: 'Tabs',
  category: 'content',
  icon: 'Layout',
  description: 'Organize content in tabbed interface',
  defaultProps: { 
    tabs: [
      { label: 'Tab 1', content: 'Content for tab 1' },
      { label: 'Tab 2', content: 'Content for tab 2' },
      { label: 'Tab 3', content: 'Content for tab 3' }
    ],
    variant: 'default'
  },
  defaultSize: { width: 500, height: 300 },
  editableFields: ['tabs', 'variant']
}

interface Tab {
  label: string
  content: string
}

interface TabsProps extends WebsiteComponentProps {
  tabs: Tab[]
  variant: 'default' | 'pills' | 'underline'
}

export const WebsiteTabs: React.FC<TabsProps> = ({ 
  tabs, 
  variant,
  deviceMode = 'desktop'
}) => {
  const [activeTab, setActiveTab] = useState(0)

  const getVariantClass = () => {
    switch (variant) {
      case 'pills': return 'bg-gray-100 rounded-lg p-1'
      case 'underline': return 'border-b border-gray-200'
      default: return 'bg-white'
    }
  }

  const getTabClass = (isActive: boolean) => {
    switch (variant) {
      case 'pills': 
        return cn(
          "px-4 py-2 rounded-md transition-colors",
          isActive ? "bg-white shadow-sm" : "hover:bg-gray-200"
        )
      case 'underline':
        return cn(
          "px-4 py-2 border-b-2 transition-colors",
          isActive ? "border-primary text-primary" : "border-transparent hover:border-gray-300"
        )
      default:
        return cn(
          "px-4 py-2 border-b-2 transition-colors",
          isActive ? "border-primary text-primary" : "border-transparent hover:border-gray-300"
        )
    }
  }

  const padding = getResponsivePadding('p-4', deviceMode)
  const tabSize = getResponsiveTextSize('text-sm', deviceMode)
  const contentSize = getResponsiveTextSize('text-base', deviceMode)

  return (
    <div className={cn("w-full h-full", padding)}>
      <div className={getVariantClass()}>
        <div className="flex">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={cn(getTabClass(index === activeTab), tabSize)}
              onClick={() => setActiveTab(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-4">
        <div className={cn("p-4 bg-gray-50 rounded-lg", contentSize)}>
          {tabs[activeTab]?.content}
        </div>
      </div>
    </div>
  )
}
