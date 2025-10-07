'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  Settings,
  X,
  GripVertical,
  BarChart3,
  Globe,
  Users,
  Zap,
  Palette,
  TrendingUp,
  Activity,
  DollarSign,
  Eye,
  MousePointer,
  Smartphone,
  Monitor
} from 'lucide-react'
import { RealTimeActivityFeed } from './real-time-activity-feed'
import { AdvancedDataVisualization } from './advanced-data-visualization'
import { useAuth } from '@/components/auth/auth-provider'
import { SmartSkeleton } from '@/components/ui/smart-skeleton'
import { apiHelpers } from '@/lib/api'

interface Widget {
  id: string
  type: string
  title: string
  description: string
  icon: any
  size: 'small' | 'medium' | 'large'
  category: 'analytics' | 'websites' | 'marketing' | 'performance'
  data?: any
}

interface PersonalizedWidgetsProps {
  userId: string
  userRole?: 'beginner' | 'marketer' | 'developer' | 'enterprise'
}

const availableWidgets: Widget[] = [
  // Analytics Widgets
  {
    id: 'traffic-overview',
    type: 'traffic-overview',
    title: 'Traffic Overview',
    description: 'Website visitors and page views',
    icon: BarChart3,
    size: 'medium',
    category: 'analytics'
  },
  {
    id: 'conversion-funnel',
    type: 'conversion-funnel',
    title: 'Conversion Funnel',
    description: 'Track user journey conversions',
    icon: TrendingUp,
    size: 'large',
    category: 'analytics'
  },
  {
    id: 'real-time-users',
    type: 'real-time-users',
    title: 'Real-time Users',
    description: 'Currently active visitors',
    icon: Users,
    size: 'small',
    category: 'analytics'
  },

  // Website Widgets
  {
    id: 'website-status',
    type: 'website-status',
    title: 'Website Status',
    description: 'Publishing status of your sites',
    icon: Globe,
    size: 'medium',
    category: 'websites'
  },
  {
    id: 'activity-feed',
    type: 'activity-feed',
    title: 'Activity Feed',
    description: 'Real-time updates and notifications',
    icon: Activity,
    size: 'large',
    category: 'websites'
  },

  // Marketing Widgets
  {
    id: 'campaign-performance',
    type: 'campaign-performance',
    title: 'Campaign Performance',
    description: 'Marketing campaign results',
    icon: Zap,
    size: 'large',
    category: 'marketing'
  },
  {
    id: 'data-visualization',
    type: 'data-visualization',
    title: 'Analytics Dashboard',
    description: 'Interactive charts and insights',
    icon: BarChart3,
    size: 'large',
    category: 'analytics'
  },
  {
    id: 'social-media',
    type: 'social-media',
    title: 'Social Media',
    description: 'Social media engagement',
    icon: Users,
    size: 'medium',
    category: 'marketing'
  },

  // Performance Widgets
  {
    id: 'page-speed',
    type: 'page-speed',
    title: 'Page Speed',
    description: 'Website loading performance',
    icon: Zap,
    size: 'small',
    category: 'performance'
  },
  {
    id: 'mobile-optimization',
    type: 'mobile-optimization',
    title: 'Mobile Optimization',
    description: 'Mobile responsiveness score',
    icon: Smartphone,
    size: 'small',
    category: 'performance'
  }
]

// Default widget layouts by user role
const defaultLayouts = {
  beginner: [
    'website-status',
    'traffic-overview',
    'activity-feed',
    'real-time-users'
  ],
  marketer: [
    'campaign-performance',
    'traffic-overview',
    'activity-feed',
    'social-media'
  ],
  developer: [
    'page-speed',
    'website-status',
    'activity-feed',
    'traffic-overview'
  ],
  enterprise: [
    'data-visualization',
    'conversion-funnel',
    'campaign-performance',
    'activity-feed'
  ]
}

export function PersonalizedWidgets({ userId, userRole = 'beginner' }: PersonalizedWidgetsProps) {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [availableWidgetList, setAvailableWidgetList] = useState<Widget[]>(availableWidgets)
  const [showWidgetPicker, setShowWidgetPicker] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadUserWidgets()
  }, [userId, userRole])

  const loadUserWidgets = async () => {
    try {
      // Load user's custom widget configuration
      const savedWidgets = localStorage.getItem(`widgets-${userId}`)
      let userWidgets: string[]

      if (savedWidgets) {
        userWidgets = JSON.parse(savedWidgets)
      } else {
        // Use default layout based on user role
        userWidgets = defaultLayouts[userRole] || defaultLayouts.beginner
      }

      // Convert widget IDs to full widget objects
      const fullWidgets = userWidgets
        .map(id => availableWidgets.find(w => w.id === id))
        .filter(Boolean) as Widget[]

      setWidgets(fullWidgets)

      // Update available widgets (exclude already selected ones)
      setAvailableWidgetList(availableWidgets.filter(w => !userWidgets.includes(w.id)))

    } catch (error) {
      console.error('Failed to load user widgets:', error)
      // Fallback to default
      const defaultWidgetIds = defaultLayouts[userRole] || defaultLayouts.beginner
      const defaultWidgets = defaultWidgetIds
        .map(id => availableWidgets.find(w => w.id === id))
        .filter(Boolean) as Widget[]
      setWidgets(defaultWidgets)
    } finally {
      setIsLoading(false)
    }
  }

  const saveWidgetConfiguration = (newWidgets: Widget[]) => {
    try {
      const widgetIds = newWidgets.map(w => w.id)
      localStorage.setItem(`widgets-${userId}`, JSON.stringify(widgetIds))
    } catch (error) {
      console.error('Failed to save widget configuration:', error)
    }
  }

  const addWidget = (widget: Widget) => {
    const newWidgets = [...widgets, widget]
    setWidgets(newWidgets)
    setAvailableWidgetList(prev => prev.filter(w => w.id !== widget.id))
    saveWidgetConfiguration(newWidgets)
  }

  const removeWidget = (widgetId: string) => {
    const newWidgets = widgets.filter(w => w.id !== widgetId)
    const removedWidget = widgets.find(w => w.id === widgetId)
    setWidgets(newWidgets)
    if (removedWidget) {
      setAvailableWidgetList(prev => [...prev, removedWidget])
    }
    saveWidgetConfiguration(newWidgets)
  }

  const renderWidget = (widget: Widget) => {
    // Mock data for different widget types
    const mockData = {
      'traffic-overview': {
        visitors: 1234,
        pageViews: 5678,
        bounceRate: 34.5,
        trend: '+12%'
      },
      'real-time-users': {
        activeUsers: 23,
        topPages: ['/home', '/products', '/about']
      },
      'website-status': {
        totalSites: 5,
        publishedSites: 4,
        draftSites: 1
      },
      'page-speed': {
        score: 85,
        loadTime: '2.3s',
        status: 'Good'
      }
    }

    const data = mockData[widget.type as keyof typeof mockData] || {}

    return (
      <Card key={widget.id} className="relative group">
        {isEditing && (
          <div className="absolute -top-2 -right-2 z-10 flex space-x-1">
            <Button
              size="sm"
              variant="destructive"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeWidget(widget.id)}
            >
              <X className="h-3 w-3" />
            </Button>
            <div className="bg-muted rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
              <GripVertical className="h-3 w-3" />
            </div>
          </div>
        )}

        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-base">
            <widget.icon className="h-4 w-4" />
            <span>{widget.title}</span>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {widget.type === 'traffic-overview' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Visitors</span>
                <span className="font-semibold">{(data as any).visitors?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Page Views</span>
                <span className="font-semibold">{(data as any).pageViews?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bounce Rate</span>
                <Badge variant={(data as any).bounceRate < 40 ? 'default' : 'secondary'}>
                  {(data as any).bounceRate}%
                </Badge>
              </div>
            </div>
          )}

          {widget.type === 'real-time-users' && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-green-500" />
                <span className="font-semibold">{(data as any).activeUsers} active now</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Top pages:</p>
                <div className="space-y-1">
                  {(data as any).topPages?.slice(0, 3).map((page: string, index: number) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="truncate">{page}</span>
                      <span className="text-muted-foreground">{Math.floor(Math.random() * 50) + 10}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {widget.type === 'website-status' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{(data as any).publishedSites}</div>
                  <div className="text-xs text-muted-foreground">Published</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{(data as any).draftSites}</div>
                  <div className="text-xs text-muted-foreground">Drafts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">{(data as any).totalSites}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>
            </div>
          )}

          {widget.type === 'page-speed' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Score</span>
                <Badge variant={(data as any).score > 80 ? 'default' : 'secondary'}>
                  {(data as any).score}/100
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Load Time</span>
                <span className="font-semibold">{(data as any).loadTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="outline">{(data as any).status}</Badge>
              </div>
            </div>
          )}

          {widget.type === 'activity-feed' && (
            <div className="h-80">
              <RealTimeActivityFeed
                maxItems={5}
                showHeader={false}
                compact={true}
              />
            </div>
          )}

          {widget.type === 'data-visualization' && (
            <div className="h-96">
              <AdvancedDataVisualization compact={true} />
            </div>
          )}

          {/* Default content for other widgets */}
          {!['traffic-overview', 'real-time-users', 'website-status', 'page-speed', 'activity-feed', 'data-visualization'].includes(widget.type) && (
            <div className="text-center py-8 text-muted-foreground">
              <widget.icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{widget.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Widget Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Dashboard Widgets</h2>
          <p className="text-sm text-muted-foreground">
            Customize your dashboard with widgets that matter to you
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {isEditing ? 'Done' : 'Edit'}
          </Button>
          <Button
            size="sm"
            onClick={() => setShowWidgetPicker(!showWidgetPicker)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
        </div>
      </div>

      {/* Widget Picker */}
      {showWidgetPicker && (
        <Card>
          <CardHeader>
            <CardTitle>Add Widgets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableWidgetList.map((widget) => (
                <div
                  key={widget.id}
                  className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => {
                    addWidget(widget)
                    setShowWidgetPicker(false)
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <widget.icon className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">{widget.title}</h4>
                      <p className="text-xs text-muted-foreground">{widget.description}</p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {widget.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {availableWidgetList.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Palette className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>All available widgets have been added!</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <SmartSkeleton type="dashboard-stats" />
      )}

      {/* Widgets Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {widgets.map((widget) => renderWidget(widget))}
        </div>
      )}

      {widgets.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No widgets yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add widgets to customize your dashboard and track what matters most to you.
            </p>
            <Button onClick={() => setShowWidgetPicker(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Widget
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
