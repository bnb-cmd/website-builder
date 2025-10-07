'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter, useSearchParams } from 'next/navigation'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentWebsites } from '@/components/dashboard/recent-websites'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { DashboardChecklist } from '@/components/dashboard/dashboard-checklist'
import { AIOnboardingWizard } from '@/components/ai/ai-onboarding-wizard'
import { UserJourneyMapping } from '@/components/dashboard/user-journey-mapping'
import { PersonalizedWidgets } from '@/components/dashboard/personalized-widgets'
import { SubscriptionPlans } from '@/components/subscriptions/subscription-plans'
import { PaymentCheckout } from '@/components/payments/payment-checkout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Globe, Zap, Users, TrendingUp, Sparkles, Eye, BarChart3, ArrowRight, Palette, Target } from 'lucide-react'
import { apiHelpers } from '@/lib/api'
import { StatCard, StatCardGrid } from '@/components/dashboard/stat-card'
import { SkeletonDashboard } from '@/components/ui/skeleton-loader'

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

  useEffect(() => {
    const shouldStartOnboarding = searchParams.get('onboarding') === 'true'
    if (shouldStartOnboarding) {
      // Redirect to dedicated onboarding page
      router.push('/onboarding')
      return
    }

    loadDashboardData()
  }, [isAuthenticated, isLoading, router, searchParams])

  const loadDashboardData = async () => {
    try {
      const [websitesResponse] = await Promise.all([
        apiHelpers.getWebsites({ limit: 5, sortBy: 'updatedAt' }),
      ])

      const websites = websitesResponse.data.data || []
      const publishedWebsites = websites.filter((w: any) => w.status === 'PUBLISHED')
      
      const realData: DashboardData = {
        stats: {
          totalWebsites: websites.length,
          publishedWebsites: publishedWebsites.length,
          totalVisitors: websites.reduce((sum: number, w: any) => sum + (w._count?.visitors || 0), 0),
          conversionRate: publishedWebsites.length > 0 ? (publishedWebsites.length / websites.length) * 100 : 0
        },
        recentWebsites: websites,
        activities: websites.slice(0, 3).map((website: any) => ({
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

  const handleUpgrade = (subscriptionId: string, paymentGateway: string) => {
    setSelectedPlan({ subscriptionId, paymentGateway })
    setCurrentView('checkout')
  }

  const handleCheckoutSuccess = () => {
    setCurrentView('dashboard')
    setSelectedPlan(null)
    loadDashboardData()
  }

  const handleCheckoutCancel = () => {
    setCurrentView('plans')
    setSelectedPlan(null)
  }

  const handleOnboardingComplete = () => {
    setCurrentView('dashboard')
    loadDashboardData()
  }

  const handleStepClick = (stepId: string) => {
    switch (stepId) {
      case 'first-website':
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

  const handleStartOnboarding = () => {
    setCurrentView('onboarding')
  }

  // Loading State
  if (loading) {
    return (
      <div className="p-6">
        <SkeletonDashboard />
      </div>
    )
  }

  // Error State
  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Failed to load dashboard</h2>
        <Button onClick={loadDashboardData}>Try Again</Button>
      </div>
    )
  }

  // Onboarding View
  if (currentView === 'onboarding') {
    return (
      <AIOnboardingWizard 
        userId={user?.id || 'demo-user'} 
        onComplete={handleOnboardingComplete}
      />
    )
  }

  // Plans View
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

  // Checkout View
  if (currentView === 'checkout' && selectedPlan) {
    return (
      <PaymentCheckout
        subscriptionId={selectedPlan.subscriptionId}
        paymentGateway={selectedPlan.paymentGateway}
        amount={2999}
        currency="PKR"
        subscriptionName="Pro Plan"
        onSuccess={handleCheckoutSuccess}
        onCancel={handleCheckoutCancel}
      />
    )
  }

  // Main Dashboard View
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Welcome back, {user?.name || 'User'}!
                </h1>
                <p className="text-gray-600">Ready to create something amazing?</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
              <Button 
                onClick={handleCreateWebsite} 
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Website
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Stats Overview - Using New StatCard Component */}
        <StatCardGrid>
          <StatCard
            title="Total Websites"
            value={dashboardData.stats.totalWebsites}
            change={12.5}
            changeLabel="vs last month"
            icon={Globe}
            trend="up"
            color="blue"
          />
          <StatCard
            title="Published Sites"
            value={dashboardData.stats.publishedWebsites}
            change={8.3}
            changeLabel="vs last month"
            icon={Eye}
            trend="up"
            color="green"
          />
          <StatCard
            title="Total Visitors"
            value={dashboardData.stats.totalVisitors.toLocaleString()}
            change={15.7}
            changeLabel="vs last month"
            icon={Users}
            trend="up"
            color="purple"
          />
          <StatCard
            title="Conversion Rate"
            value={`${dashboardData.stats.conversionRate.toFixed(1)}%`}
            change={-2.4}
            changeLabel="vs last month"
            icon={TrendingUp}
            trend="down"
            color="orange"
          />
        </StatCardGrid>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              <p className="text-gray-600">Get started with these powerful tools</p>
            </div>
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        AI Website Builder
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                        New
                      </Badge>
                    </div>
                    <CardDescription className="text-sm text-gray-600">
                      Create a website with AI assistance
                    </CardDescription>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-600">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Template Gallery
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      Browse professional templates
                    </CardDescription>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      Analytics Dashboard
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      View detailed website analytics
                    </CardDescription>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </CardContent>
            </Card>

            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-600">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      AI Marketing Tools
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      Optimize your marketing strategy
                    </CardDescription>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Websites */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Websites</h2>
              <p className="text-gray-600">Your latest website projects</p>
            </div>
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.recentWebsites.slice(0, 6).map((website) => (
              <Card key={website.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {website.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-500 mt-1">
                        Updated {new Date(website.updatedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={`text-xs font-medium ${
                      website.status === 'PUBLISHED' ? 'bg-green-100 text-green-800 border-green-200' :
                      website.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-gray-100 text-gray-800 border-gray-200'
                    }`}>
                      {website.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-32">
                    <div className="w-full h-full flex items-center justify-center">
                      <Globe className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Eye className="w-4 h-4 text-blue-600 mr-1" />
                        <span className="text-sm font-medium text-blue-900">
                          {website._count?.visitors || 0}
                        </span>
                      </div>
                      <p className="text-xs text-blue-700">Visitors</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-sm font-medium text-green-900">
                          {Math.round(Math.random() * 10)}%
                        </span>
                      </div>
                      <p className="text-xs text-green-700">Conversion</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                      onClick={() => router.push(`/dashboard/websites/${website.id}/edit`)}
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                      onClick={() => window.open(`/preview/${website.id}`, '_blank')}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700"
                      onClick={() => router.push('/dashboard/analytics')}
                    >
                      <BarChart3 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
          userRole="beginner"
        />
      </div>
    </div>
  )
}
