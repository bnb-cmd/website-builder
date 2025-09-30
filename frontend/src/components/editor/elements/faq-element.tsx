'use client'

import { Element } from '@/types/editor'
import { Plus } from 'lucide-react'
import { useState } from 'react'

interface FAQElementProps {
  element: Element
  isSelected: boolean
  onSelect: () => void
}

export function FAQElement({ element, isSelected, onSelect }: FAQElementProps) {
  const { 
    faqs = [],
    layout = 'accordion',
    showSearch = false
  } = element.props

  const defaultFAQs = faqs.length > 0 ? faqs : [
    {
      question: 'How do I get started with building my website?',
      answer: 'Getting started is easy! Simply sign up for a free account, choose a template that fits your needs, and start customizing it with our drag-and-drop editor.',
      category: 'Getting Started'
    },
    {
      question: 'Can I use my own domain name?',
      answer: 'Yes! You can connect your existing domain or purchase a new one directly through our platform. We support .pk, .com.pk, and international domains.',
      category: 'Domains'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, JazzCash, EasyPaisa, and bank transfers for Pakistani customers. International customers can use PayPal and Stripe.',
      category: 'Billing'
    },
    {
      question: 'Is there a free plan available?',
      answer: 'Yes, we offer a generous free plan that includes one website, basic templates, and essential features. You can upgrade anytime as your needs grow.',
      category: 'Pricing'
    },
    {
      question: 'Do you provide customer support in Urdu?',
      answer: 'Absolutely! Our support team is fluent in both English and Urdu. We also offer documentation and tutorials in both languages.',
      category: 'Support'
    },
    {
      question: 'Can I create an e-commerce website?',
      answer: 'Yes! Our platform includes full e-commerce functionality with product management, shopping cart, payment processing, and order management.',
      category: 'Features'
    }
  ]

  const [openItems, setOpenItems] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const filteredFAQs = searchTerm 
    ? defaultFAQs.filter((faq: any) => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : defaultFAQs

  const categories = [...new Set(defaultFAQs.map((faq: any) => faq.category))]

  return (
    <div
      onClick={onSelect}
      className={`
        p-8 cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Find answers to common questions</p>
        </div>

        {showSearch && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {layout === 'accordion' ? (
          <div className="space-y-4">
            {filteredFAQs.map((faq: any, index: number) => {
              const isOpen = openItems.includes(index)
              
              return (
                <div 
                  key={index}
                  className="border border-border rounded-lg"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleItem(index)
                    }}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 pr-4">
                      <div className="font-medium">{faq.question}</div>
                      {faq.category && (
                        <span className="text-xs text-primary mt-1">{faq.category}</span>
                      )}
                    </div>
                    <Plus className={`
                      h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0
                      ${isOpen ? 'rotate-45' : ''}
                    `} />
                  </button>
                  
                  <div className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isOpen ? 'max-h-96' : 'max-h-0'}
                  `}>
                    <div className="px-6 py-4 border-t border-border">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category as string}>
                <h3 className="font-semibold text-lg mb-4">{category as string}</h3>
                <div className="space-y-4">
                  {filteredFAQs
                    .filter((faq: any) => faq.category === category)
                    .map((faq: any, index: number) => (
                      <div key={index}>
                        <h4 className="font-medium mb-2">{faq.question}</h4>
                        <p className="text-muted-foreground text-sm">{faq.answer}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredFAQs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No FAQs found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
