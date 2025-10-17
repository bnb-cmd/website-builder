import React, { useState } from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { ChevronDown, ChevronUp } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const FAQConfig: ComponentConfig = {
  id: 'faq',
  name: 'FAQ',
  category: 'content',
  icon: 'HelpCircle',
  description: 'Frequently asked questions section',
  defaultProps: { 
    title: 'Frequently Asked Questions',
    questions: [
      { question: 'What is your return policy?', answer: 'We offer a 30-day return policy for all products.' },
      { question: 'How long does shipping take?', answer: 'Standard shipping takes 3-5 business days.' },
      { question: 'Do you offer international shipping?', answer: 'Yes, we ship to over 50 countries worldwide.' }
    ]
  },
  defaultSize: { width: 500, height: 400 },
  editableFields: ['title', 'questions']
}

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps extends WebsiteComponentProps {
  title: string
  questions: FAQItem[]
}

export const WebsiteFAQ: React.FC<FAQProps> = ({ 
  title, 
  questions,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const padding = getResponsivePadding('p-6', deviceMode)
  const titleSize = getResponsiveTextSize('text-2xl', deviceMode)
  const questionSize = getResponsiveTextSize('text-base', deviceMode)
  const answerSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <div className={cn("w-full h-full", padding)}>
      <h2 
        className={cn("font-bold mb-6 text-center", titleSize)}
        onDoubleClick={onTextDoubleClick}
      >
        {title}
      </h2>
      
      <div className="space-y-4">
        {questions.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg">
            <button
              className={cn(
                "w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors",
                questionSize
              )}
              onClick={() => toggleItem(index)}
            >
              <span className="font-medium">{item.question}</span>
              {openItems.includes(index) ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            {openItems.includes(index) && (
              <div className={cn("px-4 pb-4", answerSize)}>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
