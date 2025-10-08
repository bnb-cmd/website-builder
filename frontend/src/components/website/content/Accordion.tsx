import React, { useState } from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const AccordionConfig: ComponentConfig = {
  id: 'accordion',
  name: 'Accordion',
  category: 'content',
  icon: 'ChevronDown',
  description: 'Collapsible content sections',
  defaultProps: { 
    items: [
      { title: 'Section 1', content: 'Content for section 1' },
      { title: 'Section 2', content: 'Content for section 2' },
      { title: 'Section 3', content: 'Content for section 3' }
    ],
    allowMultiple: false
  },
  defaultSize: { width: 400, height: 300 },
  editableFields: ['items', 'allowMultiple']
}

interface AccordionItem {
  title: string
  content: string
}

interface AccordionProps extends WebsiteComponentProps {
  items: AccordionItem[]
  allowMultiple: boolean
}

export const WebsiteAccordion: React.FC<AccordionProps> = ({ 
  items, 
  allowMultiple,
  deviceMode = 'desktop'
}) => {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenItems(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      )
    } else {
      setOpenItems(prev => 
        prev.includes(index) ? [] : [index]
      )
    }
  }

  const padding = getResponsivePadding('p-4', deviceMode)
  const titleSize = getResponsiveTextSize('text-base', deviceMode)
  const contentSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <div className={cn("w-full h-full", padding)}>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              className={cn(
                "w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors",
                titleSize
              )}
              onClick={() => toggleItem(index)}
            >
              <span className="font-medium">{item.title}</span>
              {openItems.includes(index) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {openItems.includes(index) && (
              <div className={cn("px-4 pb-4", contentSize)}>
                <p className="text-gray-600">{item.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
