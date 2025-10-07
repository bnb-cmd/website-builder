'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Star } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: 0,
    currency: 'PKR',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '1 Website',
      '5 Pages',
      'Basic Templates',
      'Mobile Responsive',
      'Basic Support',
      'Pakistan Builder Branding'
    ],
    limitations: [
      'Limited AI Generations',
      'No Custom Domain',
      'Basic Analytics'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    name: 'Business',
    price: 2500,
    currency: 'PKR',
    period: 'month',
    description: 'Perfect for growing businesses',
    features: [
      '10 Websites',
      '50 Pages',
      'Premium Templates',
      'Custom Domain',
      'AI Content Generation',
      'E-commerce Features',
      'Advanced Analytics',
      'Priority Support',
      'Remove Branding'
    ],
    limitations: [],
    cta: 'Start Business Plan',
    popular: true
  },
  {
    name: 'Pro',
    price: 5000,
    currency: 'PKR',
    period: 'month',
    description: 'For agencies and large businesses',
    features: [
      'Unlimited Websites',
      'Unlimited Pages',
      'All Premium Templates',
      'Multiple Custom Domains',
      'Advanced AI Features',
      'Full E-commerce Suite',
      'White-label Solution',
      'API Access',
      'Dedicated Support',
      'Custom Integrations'
    ],
    limitations: [],
    cta: 'Start Pro Plan',
    popular: false
  }
]

export function Pricing() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your business. All plans include our core features 
            with no hidden fees. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold">
                    {plan.price === 0 ? 'Free' : `${plan.currency} ${plan.price.toLocaleString()}`}
                  </div>
                  {plan.price > 0 && (
                    <div className="text-muted-foreground">per {plan.period}</div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/register" className="block">
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All plans include 30-day money-back guarantee
          </p>
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
