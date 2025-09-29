'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Activity,
  Globe,
  Zap,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  RefreshCw
} from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'
import { apiHelpers } from '@/lib/api'

interface ActivityItem {
  id: string
  type: 'website_published' | 'website_created' | 'visitor_increase' | 'conversion' | 'error' | 'system_update'
  title: string
  description: string
  timestamp: Date
  priority: 'low' | 'medium' | 'high' | 'urgent'
  metadata?: {
    websiteId?: string
    websiteName?: string
    value?: number
    change?: number
    url?: string
  }
  actions?: Array<{
    label: string
    action: () => void
    primary?: boolean
  }>
}

interface RealTimeActivityFeedProps {
  maxItems?: number
  showHeader?: boolean
  compact?: boolean
}

export function RealTimeActivityFeed({
  maxItems = 10,
  showHeader = true,
  compact = false
}: RealTimeActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  useEffect(() => {
    loadInitialActivities()
    connectToRealtimeFeed()
  }, [])

  const loadInitialActivities = async () => {
    try {
      // In a real app, this would fetch from your API
      // For now, we'll generate mock data
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'website_published',
          title: 'Website Published',
          description: 'Your restaurant website has been successfully published',
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          priority: 'high',
          metadata: {
            websiteId: 'website-1',
            websiteName: 'My Restaurant'
          },
          actions: [
            {
              label: 'View Site',
              action: () => window.open('https://example.com', '_blank'),
              primary: true
            }
          ]
        },
        {
          id: '2',
          type: 'visitor_increase',
          title: 'Traffic Spike',
          description: 'Visitor count increased by 45% in the last hour',
          timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          priority: 'medium',
          metadata: {
            value: 234,
            change: 45
          }
        },
        {
          id: '3',
          type: 'conversion',
          title: 'New Lead',
          description: 'Someone submitted your contact form',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          priority: 'high',
          metadata: {
            websiteName: 'Business Website'
          },
          actions: [
            {
              label: 'View Details',
              action: () => console.log('View lead details')
            }
          ]
        },
        {
          id: '4',
          type: 'system_update',
          title: 'AI Content Generated',
          description: 'New blog post created using AI assistant',
          timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
          priority: 'low',
          metadata: {
            websiteName: 'Blog Site'
          }
        },
        {
          id: '5',
          type: 'error',
          title: 'SSL Certificate Expiring',
          description: 'SSL certificate for your domain expires in 7 days',
          timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
          priority: 'urgent',
          metadata: {
            url: 'https://example.com'
          },
          actions: [
            {
              label: 'Renew Now',
              action: () => console.log('Renew SSL'),
              primary: true
            }
          ]
        }
      ]

      setActivities(mockActivities)
    } catch (error) {
      console.error('Failed to load activities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const connectToRealtimeFeed = () => {
    // Simulate WebSocket connection
    setTimeout(() => {
      setIsConnected(true)
    }, 1000)

    // Mock real-time updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new activity
        addNewActivity()
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }

  const addNewActivity = () => {
    const newActivities: ActivityItem[] = [
      {
        id: Date.now().toString(),
        type: 'visitor_increase',
        title: 'New Visitor',
        description: 'Someone is browsing your website right now',
        timestamp: new Date(),
        priority: 'low',
        metadata: {
          websiteName: 'Portfolio Site'
        }
      },
      {
        id: Date.now().toString(),
        type: 'system_update',
        title: 'Backup Completed',
        description: 'Automatic backup of your websites completed successfully',
        timestamp: new Date(),
        priority: 'low'
      }
    ]

    const randomActivity = newActivities[Math.floor(Math.random() * newActivities.length)]

    setActivities(prev => [randomActivity, ...prev.slice(0, maxItems - 1)])
  }

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'website_published':
        return CheckCircle
      case 'website_created':
        return Globe
      case 'visitor_increase':
        return Users
      case 'conversion':
        return TrendingUp
      case 'error':
        return AlertCircle
      case 'system_update':
        return Zap
      default:
        return Activity
    }
  }

  const getPriorityColor = (priority: ActivityItem['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500'
      case 'high':
        return 'bg-orange-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const refreshActivities = () => {
    setIsLoading(true)
    loadInitialActivities()
  }

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Recent Activity</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <Button variant="ghost" size="sm" onClick={refreshActivities}>
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity) => {
                const Icon = getActivityIcon(activity.type)
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-accent/50">
                    <div className={`p-1 rounded-full ${getPriorityColor(activity.priority)}`}>
                      <Icon className="h-3 w-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Activity Feed</span>
              <Badge variant="outline" className="ml-2">
                Live
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`flex items-center space-x-1 text-xs ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <Button variant="outline" size="sm" onClick={refreshActivities}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      )}

      <CardContent>
        <ScrollArea className="h-96" ref={scrollAreaRef}>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-4 p-4">
                  <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                    <div className="h-3 bg-muted animate-pulse rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = getActivityIcon(activity.type)
                return (
                  <div
                    key={activity.id}
                    className={`flex items-start space-x-4 p-4 rounded-lg border-l-4 ${
                      activity.priority === 'urgent'
                        ? 'border-l-red-500 bg-red-50 dark:bg-red-950/20'
                        : activity.priority === 'high'
                        ? 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20'
                        : activity.priority === 'medium'
                        ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                        : 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${getPriorityColor(activity.priority)}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.description}
                          </p>

                          {activity.metadata?.websiteName && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {activity.metadata.websiteName}
                            </Badge>
                          )}

                          <div className="flex items-center space-x-2 mt-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(activity.timestamp)}
                            </span>
                          </div>
                        </div>

                        {activity.actions && activity.actions.length > 0 && (
                          <div className="flex space-x-2 ml-4">
                            {activity.actions.map((action, index) => (
                              <Button
                                key={index}
                                variant={action.primary ? "default" : "outline"}
                                size="sm"
                                onClick={action.action}
                                className="text-xs"
                              >
                                {action.label}
                                {action.primary && <ExternalLink className="h-3 w-3 ml-1" />}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        {activities.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
            <p className="text-muted-foreground text-sm">
              Activity from your websites will appear here as it happens.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
