/**
 * ⚠️ DEPRECATED - DO NOT USE THIS FILE
 * 
 * This is a backup of the old dashboard page before the UI/UX improvements.
 * 
 * ✅ USE INSTEAD: /app/dashboard/page.tsx (the new enhanced version)
 * 
 * This file is kept for reference only and will be deleted in the next cleanup.
 * 
 * Changes in the new version:
 * - Uses new StatCard component instead of plain Card components
 * - Uses SkeletonDashboard for loading states
 * - Fixed all syntax errors and missing function definitions
 * - Enhanced with glass-morphism effects
 * - Better animations and transitions
 * 
 * Date deprecated: 2025-10-01
 */

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
  }, [isAuthenticated, isLoading, router, searchParams])

  const handleUpgrade = (subscriptionId: string, paymentGateway: string) => {
    if (loading) {
      return (
        <div className="p-6">
          <SkeletonDashboard />
          {/* Dashboard Stats Loading */}
{{ ... }}
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
                  {/* Thumbnail Preview */}
                  <div className="relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-32">
                    <div className="w-full h-full flex items-center justify-center">
                      <Globe className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                  </div>

                  {/* Stats */}
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

                  {/* Action Buttons */}
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
          userRole="beginner" // This could be determined from user profile
        />
      </div>
    </div>
  )
}
