'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter, useSearchParams } from 'next/navigation'
// import { DashboardLayout } from '@/components/dashboard/dashboard-layout' // Removed - now handled by layout.tsx
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentWebsites } from '@/components/dashboard/recent-websites'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { DashboardChecklist } from '@/components/dashboard/dashboard-checklist'
import { AIOnboardingWizard } from '@/components/ai/ai-onboarding-wizard'
import { UserJourneyMapping } from '@/components/dashboard/user-journey-mapping'
import { PersonalizedWidgets } from '@/components/dashboard/personalized-widgets'
import { SmartSkeleton } from '@/components/ui/smart-skeleton'
import { SubscriptionPlans } from '@/components/subscriptions/subscription-plans'
import { PaymentCheckout } from '@/components/payments/payment-checkout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Globe, Zap, Users, TrendingUp } from 'lucide-react'
import { apiHelpers } from '@/lib/api'

interface DashboardData {
  stats: {
    totalWebsites: number
    publishedWebsites: number
    totalVisitors: number
    conversionRate: number
  }
  recentWebsites: any[]
  activities: any[]
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'dashboard' | 'onboarding' | 'plans' | 'checkout'>('dashboard')
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [checkoutData, setCheckoutData] = useState<any>(null)

  useEffect(() => {
    // Check if user should be redirected to onboarding wizard
    const shouldStartOnboarding = searchParams.get('onboarding') === 'true'
    if (shouldStartOnboarding) {
      setCurrentView('onboarding')
      // Remove the query parameter from URL
      router.replace('/dashboard')
      return
    }

    // Bypass authentication for demo purposes
    // if (!isLoading && !isAuthenticated) {
    //   router.push('/login')
    //   return
    // }

    // if (isAuthenticated) {
      loadDashboardData()
    // }
  }, [isAuthenticated, isLoading, router, searchParams])

  const handleUpgrade = (subscriptionId: string, paymentGateway: string) => {
    setSelectedPlan({ subscriptionId, paymentGateway })
    setCurrentView('checkout')
  }

  const handleCheckoutSuccess = (paymentId: string) => {
    // Handle successful payment
    setCurrentView('dashboard')
    setSelectedPlan(null)
    setCheckoutData(null)
    // Reload dashboard data
    loadDashboardData()
  }

  const handleCheckoutCancel = () => {
    setCurrentView('plans')
    setSelectedPlan(null)
  }

  const handleStartOnboarding = () => {
    setCurrentView('onboarding')
  }

  const handleOnboardingComplete = () => {
    setCurrentView('dashboard')
    loadDashboardData()
  }

  const handleStepClick = (stepId: string) => {
    switch (stepId) {
      case 'first-website':
        router.push('/editor')
        break
      case 'customize-design':
        router.push('/editor')
        break
      case 'setup-domain':
        router.push('/domains')
        break
      case 'payment-setup':
        router.push('/payments')
        break
      default:
        console.log('Navigate to:', stepId)
    }
  }

  const loadDashboardData = async () => {
    try {
      const [websitesResponse, userProfile] = await Promise.all([
        apiHelpers.getWebsites({ limit: 5, sortBy: 'updatedAt' }),
        apiHelpers.getProfile().catch(() => null) // Get user profile, ignore if fails
      ])

      const websites = websitesResponse.data.data || []
      const publishedWebsites = websites.filter((w: any) => w.status === 'PUBLISHED')
      
      // Calculate real stats from actual data
      const realData: DashboardData = {
        stats: {
          totalWebsites: websites.length,
          publishedWebsites: publishedWebsites.length,
          totalVisitors: websites.reduce((sum: number, w: any) => sum + (w._count?.visitors || 0), 0),
          conversionRate: publishedWebsites.length > 0 ? (publishedWebsites.length / websites.length) * 100 : 0
        },
        recentWebsites: websites,
        activities: websites.slice(0, 3).map((website: any, index: number) => ({
          id: `activity-${website.id}`,
          type: website.status === 'PUBLISHED' ? 'website_published' : 'website_created',
          message: website.status === 'PUBLISHED' 
            ? `Published website "${website.name}"`
            : `Created new website "${website.name}"`,
          timestamp: website.updatedAt || website.createdAt
        }))
      }

      setDashboardData(realData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateWebsite = () => {
    router.push('/dashboard/websites/new')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* User Journey Loading */}
        <SmartSkeleton type="activity-feed" count={3} />

        {/* Dashboard Stats Loading */}
        <SmartSkeleton type="dashboard-stats" />

        {/* Widgets Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <SmartSkeleton type="activity-feed" count={1} className="col-span-1" />
          <SmartSkeleton type="activity-feed" count={1} className="col-span-1" />
          <SmartSkeleton type="activity-feed" count={1} className="col-span-1" />
          <SmartSkeleton type="activity-feed" count={1} className="col-span-1" />
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Failed to load dashboard</h2>
        <Button onClick={loadDashboardData}>Try Again</Button>
      </div>
    )
  }

  // Render different views based on currentView state
  if (currentView === 'onboarding') {
    return (
      <AIOnboardingWizard 
        userId={user?.id || 'demo-user'} 
        onComplete={handleOnboardingComplete}
      />
    )
  }

  if (currentView === 'plans') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Upgrade Your Plan</h1>
            <p className="text-muted-foreground">
              Choose the perfect plan for your business needs
            </p>
          </div>
          <Button variant="outline" onClick={() => setCurrentView('dashboard')}>
            Back to Dashboard
          </Button>
        </div>
        <SubscriptionPlans 
          currentSubscriptionId="free-plan"
          onUpgrade={handleUpgrade}
        />
      </div>
    )
  }

  if (currentView === 'checkout' && selectedPlan) {
    return (
      <PaymentCheckout
        subscriptionId={selectedPlan.subscriptionId}
        paymentGateway={selectedPlan.paymentGateway}
        amount={2999} // This should come from the selected plan
        currency="PKR"
        subscriptionName="Pro Plan"
        onSuccess={handleCheckoutSuccess}
        onCancel={handleCheckoutCancel}
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your websites today.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setCurrentView('plans')}>
            Upgrade Plan
          </Button>
          <Button onClick={handleCreateWebsite} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            New Website
          </Button>
        </div>
      </div>

      {/* User Journey Mapping */}
      <UserJourneyMapping
        userId={user?.id || 'demo-user'}
        compact={false}
      />

      {/* AI Onboarding Checklist */}
      <DashboardChecklist
        userId={user?.id || 'demo-user'}
        onStepClick={handleStepClick}
        onStartOnboarding={handleStartOnboarding}
      />

      {/* Personalized Dashboard Widgets */}
      <PersonalizedWidgets
        userId={user?.id || 'demo-user'}
        userRole="beginner" // This could be determined from user profile
      />
    </div>
  )
}
