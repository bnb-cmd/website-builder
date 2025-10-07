"use client";

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle, 
  Crown, 
  Star, 
  Users, 
  Globe, 
  FileText, 
  ShoppingCart,
  Zap,
  BarChart3,
  ArrowRight,
  RefreshCw
} from 'lucide-react'

interface SubscriptionPlanProps {
  subscription: {
    id: string
    name: string
    description: string
    slug: string
    tier: string
    price: number
    currency: string
    interval: string
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
    isDefault?: boolean
  }
  isCurrentPlan?: boolean
  onUpgrade?: (subscriptionId: string) => void
  upgrading?: boolean
}

export function SubscriptionPlan({ 
  subscription, 
  isCurrentPlan = false, 
  onUpgrade, 
  upgrading = false 
}: SubscriptionPlanProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: currency === 'PKR' ? 'PKR' : 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'FREE': return <Star className="h-5 w-5" />
      case 'PRO': return <Crown className="h-5 w-5" />
      case 'AGENCY': return <Users className="h-5 w-5" />
      default: return <Star className="h-5 w-5" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'FREE': return 'bg-gray-100 text-gray-800'
      case 'PRO': return 'bg-blue-100 text-blue-800'
      case 'AGENCY': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTierGradient = (tier: string) => {
    switch (tier) {
      case 'FREE': return 'from-gray-50 to-gray-100'
      case 'PRO': return 'from-blue-50 to-blue-100'
      case 'AGENCY': return 'from-purple-50 to-purple-100'
      default: return 'from-gray-50 to-gray-100'
    }
  }

  const features = [
    {
      icon: <Globe className="h-4 w-4" />,
      text: `${subscription.maxWebsites} websites`,
      included: true
    },
    {
      icon: <FileText className="h-4 w-4" />,
      text: subscription.maxPages ? `${subscription.maxPages} pages` : 'Unlimited pages',
      included: true
    },
    {
      icon: <ShoppingCart className="h-4 w-4" />,
      text: subscription.maxProducts ? `${subscription.maxProducts} products` : 'Unlimited products',
      included: true
    },
    {
      icon: <Zap className="h-4 w-4" />,
      text: `${subscription.aiMonthlyQuota || 0} AI generations`,
      included: true
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      text: 'Custom domain',
      included: subscription.customDomain
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      text: 'Payment integrations',
      included: subscription.paymentIntegrations
    },
    {
      icon: <BarChart3 className="h-4 w-4" />,
      text: 'Advanced analytics',
      included: subscription.advancedAnalytics
    },
    {
      icon: <CheckCircle className="h-4 w-4" />,
      text: 'Priority support',
      included: subscription.prioritySupport
    }
  ]

  return (
    <Card 
      className={`relative transition-all duration-200 hover:shadow-lg ${
        isCurrentPlan ? 'ring-2 ring-blue-500 shadow-lg' : ''
      }`}
    >
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-green-600 hover:bg-green-700">
            Current Plan
          </Badge>
        </div>
      )}
      
      <div className={`bg-gradient-to-br ${getTierGradient(subscription.tier)} p-1 rounded-t-lg`}>
        <CardHeader className="text-center pb-4">
          <div className={`mx-auto p-3 rounded-full ${getTierColor(subscription.tier)}`}>
            {getTierIcon(subscription.tier)}
          </div>
          <CardTitle className="text-xl">{subscription.name}</CardTitle>
          <CardDescription className="text-sm">
            {subscription.description}
          </CardDescription>
          <div className="mt-4">
            <div className="text-3xl font-bold">
              {formatPrice(subscription.price, subscription.currency)}
            </div>
            <div className="text-sm text-muted-foreground">
              per {subscription.interval.toLowerCase()}
            </div>
          </div>
        </CardHeader>
      </div>

      <CardContent className="space-y-4 pt-6">
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`flex-shrink-0 ${
                feature.included ? 'text-green-600' : 'text-gray-400'
              }`}>
                {feature.icon}
              </div>
              <span className={`text-sm ${
                feature.included ? 'text-foreground' : 'text-muted-foreground line-through'
              }`}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            Supported Languages:
          </div>
          <div className="flex flex-wrap gap-1">
            {subscription.allowedLanguages.map((language, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {language}
              </Badge>
            ))}
          </div>
        </div>

        <Button 
          className="w-full" 
          variant={isCurrentPlan ? "outline" : "default"}
          onClick={() => onUpgrade?.(subscription.id)}
          disabled={isCurrentPlan || upgrading}
          size="lg"
        >
          {upgrading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : isCurrentPlan ? (
            'Current Plan'
          ) : (
            <>
              {subscription.price === 0 ? 'Get Started' : 'Upgrade Now'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>

        {subscription.tier === 'AGENCY' && (
          <div className="text-center">
            <Badge variant="secondary" className="text-xs">
              Most Popular
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
