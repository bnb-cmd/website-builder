'use client'

import { Element } from '@/types/editor'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PricingElementProps {
  element: Element
  isSelected: boolean
  onSelect: () => void
}

export function PricingElement({ element, isSelected, onSelect }: PricingElementProps) {
  const { 
    plans = [],
    currency = 'PKR',
    billingPeriod = 'monthly'
  } = element.props

  const defaultPlans = plans.length > 0 ? plans : [
    {
      name: 'Starter',
      price: 999,
      description: 'Perfect for getting started',
      features: [
        { text: '1 Website', included: true },
        { text: 'Basic Templates', included: true },
        { text: 'SSL Certificate', included: true },
        { text: 'Email Support', included: true },
        { text: 'Custom Domain', included: false },
        { text: 'Priority Support', included: false }
      ],
      highlighted: false
    },
    {
      name: 'Professional',
      price: 2499,
      description: 'Everything you need to grow',
      features: [
        { text: '5 Websites', included: true },
        { text: 'Premium Templates', included: true },
        { text: 'SSL Certificate', included: true },
        { text: 'Priority Support', included: true },
        { text: 'Custom Domain', included: true },
        { text: 'E-commerce Features', included: true }
      ],
      highlighted: true
    },
    {
      name: 'Business',
      price: 4999,
      description: 'Advanced features for teams',
      features: [
        { text: 'Unlimited Websites', included: true },
        { text: 'All Templates', included: true },
        { text: 'SSL Certificate', included: true },
        { text: '24/7 Phone Support', included: true },
        { text: 'Custom Domain', included: true },
        { text: 'White Label Option', included: true }
      ],
      highlighted: false
    }
  ]

  return (
    <div
      onClick={onSelect}
      className={`
        p-8 cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Choose Your Plan</h2>
        <p className="text-muted-foreground">Start free, upgrade anytime</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {defaultPlans.map((plan: any, index: number) => (
          <div
            key={index}
            className={`
              relative rounded-lg border p-6
              ${plan.highlighted 
                ? 'border-primary shadow-lg scale-105' 
                : 'border-border'
              }
            `}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">{currency} {plan.price}</span>
                <span className="text-muted-foreground">/{billingPeriod}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature: any, featureIndex: number) => (
                <li key={featureIndex} className="flex items-center gap-2">
                  {feature.included ? (
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${
                    feature.included ? '' : 'text-muted-foreground line-through'
                  }`}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <Button 
              className="w-full"
              variant={plan.highlighted ? 'default' : 'outline'}
              onClick={(e) => e.stopPropagation()}
            >
              Get Started
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
