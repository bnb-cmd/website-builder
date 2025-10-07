'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    question: 'Do I need any technical knowledge to use Pakistan Builder?',
    answer: 'No technical knowledge is required! Our drag-and-drop editor makes it easy for anyone to create a professional website. We also provide AI-powered content generation to help you write compelling copy.'
  },
  {
    question: 'Can I use my own domain name?',
    answer: 'Yes! All paid plans include custom domain support. You can connect your existing domain or purchase a new one through our platform. We support .pk domains and all popular domain extensions.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major Pakistani payment methods including JazzCash, EasyPaisa, bank transfers, and international cards. All transactions are secure and processed through our trusted payment partners.'
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes! Our free plan allows you to create one website with basic features. You can upgrade anytime to unlock premium features like custom domains, AI content generation, and e-commerce functionality.'
  },
  {
    question: 'Can I switch between plans?',
    answer: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing differences.'
  },
  {
    question: 'Do you provide customer support in Urdu?',
    answer: 'Yes! Our support team is fluent in both Urdu and English. We provide 24/7 support through chat, email, and phone to help you succeed with your website.'
  },
  {
    question: 'Can I export my website if I want to leave?',
    answer: 'Yes, you can export your website content and data at any time. We believe in giving you full control over your content and make it easy to migrate if needed.'
  },
  {
    question: 'Is my website optimized for mobile devices?',
    answer: 'All websites created with Pakistan Builder are automatically mobile-responsive. Your site will look great and function perfectly on all devices, from smartphones to tablets to desktops.'
  },
  {
    question: 'Do you offer white-label solutions?',
    answer: 'Yes! Our Pro plan includes white-label features, allowing agencies and resellers to offer website building services under their own brand.'
  },
  {
    question: 'How does the AI content generation work?',
    answer: 'Our AI analyzes your business type, industry, and preferences to generate relevant content in both English and Urdu. You can customize the tone, style, and specific requirements for your content.'
  }
]

export function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    )
  }

  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions? We've got answers. If you can't find what you're looking for, 
            feel free to contact our support team.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleItem(index)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-left text-lg">
                    {faq.question}
                  </CardTitle>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              
              {openItems.includes(index) && (
                <CardContent className="pt-0">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Still have questions?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@pakistanbuilder.com"
              className="inline-flex items-center justify-center px-6 py-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors"
            >
              Contact Support
            </a>
            <a 
              href="/help"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium transition-colors"
            >
              Visit Help Center
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
