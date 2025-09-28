'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useRouter } from 'next/navigation'
// import { DashboardLayout } from '@/components/dashboard/dashboard-layout' // Removed - now handled by layout.tsx
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentWebsites } from '@/components/dashboard/recent-websites'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
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
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Bypass authentication for demo purposes
    // if (!isLoading && !isAuthenticated) {
    //   router.push('/login')
    //   return
    // }

    // if (isAuthenticated) {
      loadDashboardData()
    // }
  }, [isAuthenticated, isLoading, router])

  const loadDashboardData = async () => {
    try {
      const [websitesResponse] = await Promise.all([
        apiHelpers.getWebsites({ limit: 5, sortBy: 'updatedAt' })
      ])

      const mockData: DashboardData = {
        stats: {
          totalWebsites: 12,
          publishedWebsites: 8,
          totalVisitors: 15420,
          conversionRate: 3.2
        },
        recentWebsites: websitesResponse.data.data || [],
        activities: [
          {
            id: '1',
            type: 'website_created',
            message: 'Created new website "Restaurant Menu"',
            timestamp: new Date().toISOString()
          },
          {
            id: '2',
            type: 'website_published',
            message: 'Published website "My Portfolio"',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '3',
            type: 'ai_generation',
            message: 'Generated content with AI for "About Us" section',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
          }
        ]
      }

      setDashboardData(mockData)
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
        {/* Loading skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your websites today.
          </p>
        </div>
        <Button onClick={handleCreateWebsite} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          New Website
        </Button>
      </div>

      {/* Stats Overview */}
      <DashboardStats stats={dashboardData.stats} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <RecentWebsites websites={dashboardData.recentWebsites} />
          <ActivityFeed activities={dashboardData.activities} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions />
          
          {/* Tips & Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Tips & Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Getting Started</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Choose a template that fits your business</li>
                  <li>• Use AI to generate compelling content</li>
                  <li>• Optimize for mobile devices</li>
                  <li>• Add your contact information</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Best Practices</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Keep your content fresh and updated</li>
                  <li>• Use high-quality images</li>
                  <li>• Enable SEO optimization</li>
                  <li>• Test on different devices</li>
                </ul>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                View All Tips
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
