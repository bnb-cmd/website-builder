"use client";

import React, { useEffect } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Link, useRouter } from '../lib/router'
import { useAuthStore, useWebsiteStore } from '../lib/store'
import { formatDate } from '../lib/utils'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { 
  Plus, 
  Globe, 
  BarChart3, 
  Users, 
  Eye,
  Edit,
  MoreVertical,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu'

const stats = [
  {
    title: 'Total Websites',
    value: '3',
    change: '+1 this month',
    icon: Globe,
    trend: 'up'
  },
  {
    title: 'Total Visitors',
    value: '2,847',
    change: '+18% from last month',
    icon: Users,
    trend: 'up'
  },
  {
    title: 'Page Views',
    value: '8,429',
    change: '+23% from last month',
    icon: Eye,
    trend: 'up'
  },
  {
    title: 'Conversion Rate',
    value: '3.2%',
    change: '+0.5% from last month',
    icon: TrendingUp,
    trend: 'up'
  }
]

const quickActions = [
  {
    title: 'Create New Website',
    description: 'Start building a new website from scratch',
    icon: Plus,
    href: '/dashboard/websites/new',
    primary: true
  },
  {
    title: 'Browse Templates',
    description: 'Choose from hundreds of professional templates',
    icon: Globe,
    href: '/dashboard/templates',
    primary: false
  },
  {
    title: 'AI Website Builder',
    description: 'Let AI create your website in minutes',
    icon: Zap,
    href: '/onboarding',
    primary: false
  }
]

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore()
  const { websites, fetchWebsites, isLoading } = useWebsiteStore()
  const { navigate } = useRouter()

  useEffect(() => {
    fetchWebsites()
  }, [fetchWebsites])

  const recentWebsites = websites.slice(0, 3)

  const planUsage = {
    websites: { used: websites.length, limit: user?.plan === 'free' ? 3 : 999 },
    storage: { used: 2.1, limit: user?.plan === 'free' ? 5 : 100 },
    bandwidth: { used: 45, limit: user?.plan === 'free' ? 100 : 1000 }
  }

  return (
    <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Welcome back, {user?.name?.split(' ')[0]}</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your websites today.
            </p>
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/dashboard/websites/new">
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Create Website
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold mb-1">{stat.value}</div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <p className="text-xs text-green-600">
                      {stat.change}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Card key={action.title} className="cursor-pointer hover:shadow-md transition-shadow duration-200">
                  <Link href={action.href} className="block">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium mb-1">
                            {action.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Websites */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-medium">Recent Websites</CardTitle>
                  <CardDescription>
                    Your latest website projects
                  </CardDescription>
                </div>
                <Link href="/dashboard/websites">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="w-16 h-12 bg-muted rounded animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded animate-pulse" />
                          <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentWebsites.length === 0 ? (
                  <div className="text-center py-8">
                    <Globe className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium mb-2">No websites yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create your first website to get started
                    </p>
                    <Link href="/dashboard/websites/new">
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Website
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentWebsites.map((website) => (
                      <div key={website.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="relative">
                          <ImageWithFallback
                            src={website.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'}
                            alt={website.name}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <Badge 
                            variant={website.status === 'PUBLISHED' ? 'default' : 'secondary'}
                            className="absolute -top-1 -right-1 text-xs px-1"
                          >
                            {website.status}
                          </Badge>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{website.name}</h4>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Updated {formatDate(website.lastModified)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => navigate(`/dashboard/websites/${website.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Globe className="mr-2 h-4 w-4" />
                                Settings
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Plan Usage */}
          <div>
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Plan Usage</CardTitle>
                <CardDescription>
                  <Badge variant={user?.plan === 'free' ? 'secondary' : 'default'}>
                    {user?.plan === 'free' ? 'Free Plan' : `${user?.plan} Plan`}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Websites */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Websites</span>
                    <span className="text-sm text-muted-foreground">
                      {planUsage.websites.used}/{planUsage.websites.limit}
                    </span>
                  </div>
                  <Progress 
                    value={(planUsage.websites.used / planUsage.websites.limit) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Storage */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Storage</span>
                    <span className="text-sm text-muted-foreground">
                      {planUsage.storage.used}GB/{planUsage.storage.limit}GB
                    </span>
                  </div>
                  <Progress 
                    value={(planUsage.storage.used / planUsage.storage.limit) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Bandwidth */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Bandwidth</span>
                    <span className="text-sm text-muted-foreground">
                      {planUsage.bandwidth.used}GB/{planUsage.bandwidth.limit}GB
                    </span>
                  </div>
                  <Progress 
                    value={(planUsage.bandwidth.used / planUsage.bandwidth.limit) * 100} 
                    className="h-2"
                  />
                </div>

                {user?.plan === 'free' && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground mb-3">
                      Upgrade to unlock unlimited websites and premium features
                    </p>
                    <Link href="/dashboard/billing">
                      <Button className="w-full" size="sm">
                        Upgrade Plan
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}

export default DashboardPage