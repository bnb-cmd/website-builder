"use client";

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  Users,
  Zap,
  Globe
} from 'lucide-react'
import { SubscriptionPlan } from '@/components/billing/SubscriptionPlan'
import { PaymentMethodForm } from '@/components/billing/PaymentMethodForm'
import { BillingHistory } from '@/components/billing/BillingHistory'
import { apiHelpers } from '@/lib/api'
import { toast } from 'sonner'

interface BillingDashboardProps {
  userId?: string
}

export function BillingDashboard({ userId }: BillingDashboardProps) {
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [currentSubscription, setCurrentSubscription] = useState<any>(null)
  const [userLimits, setUserLimits] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)

  useEffect(() => {
    loadBillingData()
  }, [])

  const loadBillingData = async () => {
    try {
      setLoading(true)
      const [subscriptionsRes, defaultSubRes, limitsRes] = await Promise.all([
        apiHelpers.getSubscriptions(),
        apiHelpers.getDefaultSubscription(),
        apiHelpers.getUserLimits(userId || 'current-user')
      ])

      setSubscriptions(subscriptionsRes.data || [])
      setCurrentSubscription(defaultSubRes.data || subscriptionsRes.data?.[0] || null)
      setUserLimits(limitsRes.data || null)
    } catch (error) {
      console.error('Failed to load billing data:', error)
      toast.error('Failed to load billing information')
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (subscriptionId: string) => {
    try {
      setUpgrading(subscriptionId)
      
      const result = await apiHelpers.upgradeSubscription({
        userId: userId || 'current-user',
        subscriptionId,
        paymentGateway: 'STRIPE',
        customerEmail: 'user@example.com' // Replace with actual user email
      })

      if (result.success) {
        if (result.data.redirectUrl) {
          window.location.href = result.data.redirectUrl
        } else if (result.data.clientSecret) {
          toast.success('Redirecting to payment...')
        }
      } else {
        toast.error(result.error || 'Failed to upgrade subscription')
      }
    } catch (error) {
      console.error('Upgrade failed:', error)
      toast.error('Failed to upgrade subscription')
    } finally {
      setUpgrading(null)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: currency === 'PKR' ? 'PKR' : 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Billing Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentSubscription?.name || 'Free Plan'}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentSubscription ? 
                `${formatPrice(currentSubscription.price, currentSubscription.currency)}/${currentSubscription.interval.toLowerCase()}` :
                'No active subscription'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userLimits?.websitesCount || 0}/{currentSubscription?.maxWebsites || 1}
            </div>
            <p className="text-xs text-muted-foreground">
              Websites used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Quota</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userLimits?.aiQuotaRemaining || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Generations remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {userLimits && (
        <div className="space-y-4">
          {!userLimits.canCreateWebsite && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You've reached your website limit. <Button variant="link" className="p-0 h-auto" onClick={() => handleUpgrade('pro')}>Upgrade your plan</Button> to create more websites.
              </AlertDescription>
            </Alert>
          )}
          
          {userLimits.aiQuotaRemaining < 5 && userLimits.aiQuotaRemaining > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You're running low on AI generations. Consider upgrading to get more AI quota.
              </AlertDescription>
            </Alert>
          )}

          {userLimits.aiQuotaRemaining === 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You've used all your AI generations for this month. Upgrade your plan to get more AI quota.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Main Billing Interface */}
      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {subscriptions.map((subscription) => (
              <SubscriptionPlan
                key={subscription.id}
                subscription={subscription}
                isCurrentPlan={subscription.id === currentSubscription?.id}
                onUpgrade={handleUpgrade}
                upgrading={upgrading === subscription.id}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <PaymentMethodForm
            onAddMethod={(method) => {
              toast.success('Payment method added successfully')
            }}
            onRemoveMethod={(methodId) => {
              toast.success('Payment method removed')
            }}
            onSetDefault={(methodId) => {
              toast.success('Default payment method updated')
            }}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <BillingHistory userId={userId} />
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          {userLimits && (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Overview</CardTitle>
                  <CardDescription>
                    Your current usage against plan limits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <span className="text-sm font-medium">Websites</span>
                      </div>
                      <div className="text-2xl font-bold">
                        {userLimits.websitesCount}/{currentSubscription?.maxWebsites || '∞'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        <span className="text-sm font-medium">AI Generations</span>
                      </div>
                      <div className="text-2xl font-bold">
                        {userLimits.aiQuotaRemaining}/{currentSubscription?.aiMonthlyQuota || 0}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Feature Access</h4>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="flex items-center gap-2">
                        {userLimits.canUseCustomDomain ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">Custom Domain</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {userLimits.canUsePaymentIntegration ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">Payment Integration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {userLimits.canUseAdvancedAnalytics ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">Advanced Analytics</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
