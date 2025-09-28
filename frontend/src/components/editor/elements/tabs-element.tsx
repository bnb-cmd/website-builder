'use client'

import { Element } from '@/types/editor'
import { useState } from 'react'

interface TabsElementProps {
  element: Element
  isSelected: boolean
  onSelect: () => void
}

export function TabsElement({ element, isSelected, onSelect }: TabsElementProps) {
  const { tabs = [], defaultTab = 0 } = element.props
  const [activeTab, setActiveTab] = useState(defaultTab)

  const defaultTabs = tabs.length > 0 ? tabs : [
    { label: 'Features', content: 'Discover amazing features that will transform your workflow.' },
    { label: 'Pricing', content: 'Simple, transparent pricing that scales with your business.' },
    { label: 'Support', content: '24/7 customer support to help you succeed.' },
  ]

  return (
    <div
      onClick={onSelect}
      className={`
        p-6 cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
    >
      {/* Tab Headers */}
      <div className="flex space-x-1 mb-6 border-b border-border">
        {defaultTabs.map((tab, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation()
              setActiveTab(index)
            }}
            className={`
              px-4 py-2 font-medium transition-all relative
              ${activeTab === index 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            {tab.label}
            {activeTab === index && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="min-h-[100px]">
        {defaultTabs.map((tab, index) => (
          <div
            key={index}
            className={`
              transition-opacity duration-300
              ${activeTab === index ? 'opacity-100' : 'opacity-0 hidden'}
            `}
          >
            <p className="text-muted-foreground">{tab.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
