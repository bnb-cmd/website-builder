'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export interface TabItem {
  id: string
  label: string
  content: React.ReactNode
  disabled?: boolean
}

export interface TabsProps {
  tabs: TabItem[]
  defaultTab?: string
  orientation?: 'horizontal' | 'vertical'
  variant?: 'default' | 'pills' | 'underline' | 'cards'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export const Tabs: React.FC<TabsProps> = ({
  tabs = [
    { id: 'tab1', label: 'Tab 1', content: <div className="p-4">Content for Tab 1</div> },
    { id: 'tab2', label: 'Tab 2', content: <div className="p-4">Content for Tab 2</div> },
    { id: 'tab3', label: 'Tab 3', content: <div className="p-4">Content for Tab 3</div> }
  ],
  defaultTab,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  fullWidth = false
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '')

  const sizeClasses = {
    sm: 'text-sm px-3 py-2',
    md: 'text-base px-4 py-3',
    lg: 'text-lg px-6 py-4'
  }

  const getTabClasses = (tabId: string) => {
    const isActive = activeTab === tabId
    const baseClasses = cn(
      'transition-all duration-200 font-medium',
      sizeClasses[size],
      fullWidth && 'flex-1 text-center'
    )

    switch (variant) {
      case 'pills':
        return cn(
          baseClasses,
          'rounded-full',
          isActive
            ? 'bg-blue-500 text-white'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        )
      
      case 'underline':
        return cn(
          baseClasses,
          'border-b-2 pb-2',
          isActive
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
        )
      
      case 'cards':
        return cn(
          baseClasses,
          'border rounded-lg',
          isActive
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300'
        )
      
      default:
        return cn(
          baseClasses,
          isActive
            ? 'text-blue-600 border-b-2 border-blue-500'
            : 'text-gray-600 hover:text-gray-900'
        )
    }
  }

  const getContainerClasses = () => {
    if (orientation === 'vertical') {
      return 'flex'
    }
    
    switch (variant) {
      case 'pills':
        return 'flex gap-2 p-1 bg-gray-100 rounded-lg'
      case 'cards':
        return 'flex gap-2'
      default:
        return 'flex border-b border-gray-200'
    }
  }

  const getContentClasses = () => {
    if (orientation === 'vertical') {
      return 'flex-1 ml-6'
    }
    return 'mt-4'
  }

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  if (!tabs || tabs.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No tabs to display
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className={getContainerClasses()}>
        {tabs.map((tab) => {
          const isDisabled = 'disabled' in tab ? tab.disabled : false
          return (
          <button
            key={tab.id}
            onClick={() => !isDisabled && setActiveTab(tab.id)}
            disabled={isDisabled}
            className={cn(
              getTabClasses(tab.id),
              isDisabled && 'opacity-50 cursor-not-allowed'
            )}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
          >
            {tab.label}
          </button>
          )
        })}
      </div>
      
      <div 
        className={getContentClasses()}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTabContent}
      </div>
    </div>
  )
}

// Component configuration for editor
export const TabsConfig = {
  id: 'tabs',
  name: 'Tabs',
  description: 'Tabbed content sections with multiple variants',
  category: 'interactive' as const,
  icon: 'layers',
  defaultProps: {
    tabs: [
      { id: 'tab1', label: 'Overview', content: '<div class="p-4">Overview content goes here</div>' },
      { id: 'tab2', label: 'Features', content: '<div class="p-4">Features content goes here</div>' },
      { id: 'tab3', label: 'Pricing', content: '<div class="p-4">Pricing content goes here</div>' }
    ],
    defaultTab: 'tab1',
    orientation: 'horizontal',
    variant: 'default',
    size: 'md',
    fullWidth: false
  },
  defaultSize: { width: 100, height: 300 },
  editableFields: [
    'tabs',
    'defaultTab',
    'orientation',
    'variant',
    'size',
    'fullWidth'
  ]
}
