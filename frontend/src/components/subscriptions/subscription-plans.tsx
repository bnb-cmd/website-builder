'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Loader2, CreditCard, Globe, Zap, Crown } from 'lucide-react'

interface SubscriptionFeature {
  maxWebsites: number
  maxPages?: number
  maxProducts?: number
  maxStorage?: number
  customDomain: boolean
  aiGenerations?: number
  prioritySupport: boolean
  paymentIntegrations: boolean
  advancedAnalytics: boolean
  aiPrioritySupport: boolean
  aiMonthlyQuota?: number
  aiTokenAllowance?: number
  allowedLanguages: string[]
}

interface Subscription {
  id: string
  name: string
  description?: string
  slug: string
  tier: 'FREE' | 'PRO' | 'AGENCY'
  price: number
  currency: string
  interval: 'MONTHLY' | 'YEARLY' | 'LIFETIME'
  features: SubscriptionFeature
  isDefault: boolean
}

interface SubscriptionPlansProps {
  currentSubscriptionId?: string
  onUpgrade: (subscriptionId: string, paymentGateway: string) => void
  onCancel?: () => void
}

export function SubscriptionPlans({ currentSubscriptionId, onUpgrade, onCancel }: SubscriptionPlansProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [selectedGateway, setSelectedGateway] = useState<string>('JAZZCASH')

  useEffect(() => {
    loadSubscriptions()
  }, [])

  const loadSubscriptions = async () => {
    try {
      const response = await fetch('/api/v1/subscriptions')
      const result = await response.json()
      
      if (result.success) {
        setSubscriptions(result.data)
      }
    } catch (error) {
      console.error('Failed to load subscriptions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Free'
    return `₨${price.toLocaleString()}`
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'FREE':
        return <Globe className="w-6 h-6" />
      case 'PRO':
        return <Zap className="w-6 h-6" />
      case 'AGENCY':
        return <Crown className="w-6 h-6" />
      default:
        return <Globe className="w-6 h-6" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'FREE':
        return 'border-gray-200'
      case 'PRO':
        return 'border-blue-500'
      case 'AGENCY':
        return 'border-purple-500'
      default:
        return 'border-gray-200'
    }
  }

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'FREE':
        return 'bg-gray-100 text-gray-800'
      case 'PRO':
        return 'bg-blue-100 text-blue-800'
      case 'AGENCY':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleUpgrade = () => {
    if (selectedPlan) {
      onUpgrade(selectedPlan, selectedGateway)
    }
  }

  const paymentGateways = [
    { value: 'JAZZCASH', label: 'JazzCash', description: 'Mobile wallet payments' },
    { value: 'EASYPAISA', label: 'EasyPaisa', description: 'Mobile wallet payments' },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer', description: 'Direct bank transfer' },
    { value: 'STRIPE', label: 'Credit Card', description: 'International cards' }
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the perfect plan for your business needs. All plans include AI-powered website building 
          with support for Pakistani languages and payment methods.
        </p>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptions.map((subscription) => (
          <Card 
            key={subscription.id} 
            className={`relative transition-all hover:shadow-lg ${
              subscription.id === currentSubscriptionId ? 'ring-2 ring-blue-500' : ''
            } ${getTierColor(subscription.tier)}`}
          >
            {subscription.tier === 'PRO' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-2">
                <div className={`p-3 rounded-full ${getTierBadgeColor(subscription.tier)}`}>
                  {getTierIcon(subscription.tier)}
                </div>
              </div>
              <CardTitle className="text-xl">{subscription.name}</CardTitle>
              <CardDescription className="text-sm">{subscription.description}</CardDescription>
              <div className="mt-4">
                <div className="text-3xl font-bold">
                  {formatPrice(subscription.price, subscription.currency)}
                </div>
                {subscription.price > 0 && (
                  <div className="text-sm text-gray-500">
                    per {subscription.interval.toLowerCase()}
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Websites</span>
                  <span className="font-medium">{subscription.features.maxWebsites}</span>
                </div>
                
                {subscription.features.maxPages && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pages per Website</span>
                    <span className="font-medium">{subscription.features.maxPages}</span>
                  </div>
                )}
                
                {subscription.features.maxProducts && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Products</span>
                    <span className="font-medium">{subscription.features.maxProducts}</span>
                  </div>
                )}
                
                {subscription.features.maxStorage && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage</span>
                    <span className="font-medium">
                      {subscription.features.maxStorage >= 1000 
                        ? `${subscription.features.maxStorage / 1000}GB` 
                        : `${subscription.features.maxStorage}MB`
                      }
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Monthly Quota</span>
                  <span className="font-medium">
                    {subscription.features.aiMonthlyQuota || 'Unlimited'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Languages</span>
                  <span className="font-medium">
                    {subscription.features.allowedLanguages.length}
                  </span>
                </div>
              </div>

              {/* Feature List */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {subscription.features.customDomain ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm">Custom Domain</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {subscription.features.paymentIntegrations ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm">Payment Integration</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {subscription.features.advancedAnalytics ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm">Advanced Analytics</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {subscription.features.prioritySupport ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm">Priority Support</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {subscription.features.aiPrioritySupport ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm">AI Priority Support</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                {subscription.id === currentSubscriptionId ? (
                  <Button className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    className="w-full"
                    variant={subscription.tier === 'PRO' ? 'default' : 'outline'}
                    onClick={() => setSelectedPlan(subscription.id)}
                  >
                    {subscription.price === 0 ? 'Get Started' : 'Upgrade'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Gateway Selection */}
      {selectedPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Choose Payment Method</span>
            </CardTitle>
            <CardDescription>
              Select your preferred payment method for Pakistan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentGateways.map((gateway) => (
                <div
                  key={gateway.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedGateway === gateway.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedGateway(gateway.value)}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      checked={selectedGateway === gateway.value}
                      onChange={() => setSelectedGateway(gateway.value)}
                      className="text-blue-600"
                    />
                    <div>
                      <div className="font-medium">{gateway.label}</div>
                      <div className="text-sm text-gray-600">{gateway.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpgrade}>
                Proceed to Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
          <CardDescription>
            Compare all features across different plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Feature</th>
                  {subscriptions.map((sub) => (
                    <th key={sub.id} className="text-center p-2 font-medium">
                      {sub.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Websites</td>
                  {subscriptions.map((sub) => (
                    <td key={sub.id} className="text-center p-2">
                      {sub.features.maxWebsites}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2">Pages per Website</td>
                  {subscriptions.map((sub) => (
                    <td key={sub.id} className="text-center p-2">
                      {sub.features.maxPages || 'Unlimited'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2">AI Monthly Quota</td>
                  {subscriptions.map((sub) => (
                    <td key={sub.id} className="text-center p-2">
                      {sub.features.aiMonthlyQuota || 'Unlimited'}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2">Custom Domain</td>
                  {subscriptions.map((sub) => (
                    <td key={sub.id} className="text-center p-2">
                      {sub.features.customDomain ? (
                        <Check className="w-4 h-4 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2">Payment Integration</td>
                  {subscriptions.map((sub) => (
                    <td key={sub.id} className="text-center p-2">
                      {sub.features.paymentIntegrations ? (
                        <Check className="w-4 h-4 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-2">Priority Support</td>
                  {subscriptions.map((sub) => (
                    <td key={sub.id} className="text-center p-2">
                      {sub.features.prioritySupport ? (
                        <Check className="w-4 h-4 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
