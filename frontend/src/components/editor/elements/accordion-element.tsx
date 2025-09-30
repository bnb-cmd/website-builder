'use client'

import { Element } from '@/types/editor'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface AccordionElementProps {
  element: Element
  isSelected: boolean
  onSelect: () => void
}

export function AccordionElement({ element, isSelected, onSelect }: AccordionElementProps) {
  const { items = [], allowMultiple = false } = element.props
  const [openItems, setOpenItems] = useState<number[]>([0])

  const defaultItems = items.length > 0 ? items : [
    { title: 'What is your refund policy?', content: 'We offer a 30-day money-back guarantee on all our products.' },
    { title: 'How long does shipping take?', content: 'Standard shipping takes 5-7 business days. Express shipping is available.' },
    { title: 'Do you offer technical support?', content: 'Yes, we provide 24/7 technical support via email and live chat.' },
  ]

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

  return (
    <div
      onClick={onSelect}
      className={`
        p-6 cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
    >
      <div className="space-y-4">
        {defaultItems.map((item: any, index: number) => {
          const isOpen = openItems.includes(index)
          
          return (
            <div 
              key={index}
              className="border border-border rounded-lg overflow-hidden"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleItem(index)
                }}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium">{item.title}</span>
                <ChevronDown className={`
                  h-5 w-5 text-muted-foreground transition-transform duration-200
                  ${isOpen ? 'rotate-180' : ''}
                `} />
              </button>
              
              <div className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${isOpen ? 'max-h-96' : 'max-h-0'}
              `}>
                <div className="px-6 py-4 border-t border-border bg-muted/30">
                  <p className="text-muted-foreground">{item.content}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
