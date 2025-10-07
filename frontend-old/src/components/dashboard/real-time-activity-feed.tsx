'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Activity,
  Globe,
  Edit,
  Trash2,
  Eye,
  Users,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'website_created' | 'website_updated' | 'website_published' | 'website_deleted' | 'page_created' | 'page_updated' | 'ai_generated' | 'user_login' | 'payment_received' | 'domain_connected'
  message: string
  timestamp: string
  user?: {
    name: string
    avatar?: string
  }
  metadata?: {
    websiteName?: string
    pageName?: string
    amount?: number
    domain?: string
  }
  status?: 'success' | 'warning' | 'error' | 'info'
}

interface RealTimeActivityFeedProps {
  maxItems?: number
  showHeader?: boolean
  compact?: boolean
  userId?: string
}

export function RealTimeActivityFeed({ 
  maxItems = 10, 
  showHeader = true, 
  compact = false,
  userId 
}: RealTimeActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadActivities()
    // Set up real-time updates (in a real app, this would be WebSocket or SSE)
    const interval = setInterval(loadActivities, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [userId])

  const loadActivities = async () => {
    try {
      // Mock data for now - in a real app, this would fetch from API
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'website_created',
          message: 'Created new website "My Business Site"',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          user: { name: 'John Doe', avatar: '/avatars/john.jpg' },
          metadata: { websiteName: 'My Business Site' },
          status: 'success'
        },
        {
          id: '2',
          type: 'ai_generated',
          message: 'AI generated content for homepage',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          user: { name: 'John Doe', avatar: '/avatars/john.jpg' },
          metadata: { websiteName: 'My Business Site' },
          status: 'info'
        },
        {
          id: '3',
          type: 'website_published',
          message: 'Published website "Portfolio Site"',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          user: { name: 'John Doe', avatar: '/avatars/john.jpg' },
          metadata: { websiteName: 'Portfolio Site' },
          status: 'success'
        },
        {
          id: '4',
          type: 'page_created',
          message: 'Added new page "About Us"',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          user: { name: 'John Doe', avatar: '/avatars/john.jpg' },
          metadata: { websiteName: 'My Business Site', pageName: 'About Us' },
          status: 'success'
        },
        {
          id: '5',
          type: 'domain_connected',
          message: 'Connected custom domain "mybusiness.com"',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          user: { name: 'John Doe', avatar: '/avatars/john.jpg' },
          metadata: { websiteName: 'My Business Site', domain: 'mybusiness.com' },
          status: 'success'
        },
        {
          id: '6',
          type: 'payment_received',
          message: 'Received payment of Rs 2,999',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user: { name: 'John Doe', avatar: '/avatars/john.jpg' },
          metadata: { amount: 2999 },
          status: 'success'
        },
        {
          id: '7',
          type: 'website_updated',
          message: 'Updated website "E-commerce Store"',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          user: { name: 'John Doe', avatar: '/avatars/john.jpg' },
          metadata: { websiteName: 'E-commerce Store' },
          status: 'info'
        },
        {
          id: '8',
          type: 'user_login',
          message: 'Logged in successfully',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          user: { name: 'John Doe', avatar: '/avatars/john.jpg' },
          status: 'info'
        }
      ]

      setActivities(mockActivities.slice(0, maxItems))
    } catch (error) {
      console.error('Failed to load activities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'website_created':
      case 'website_updated':
      case 'website_published':
        return Globe
      case 'website_deleted':
        return Trash2
      case 'page_created':
      case 'page_updated':
        return Edit
      case 'ai_generated':
        return Zap
      case 'user_login':
        return Users
      case 'payment_received':
        return CheckCircle
      case 'domain_connected':
        return Globe
      default:
        return Activity
    }
  }

  const getStatusIcon = (status?: ActivityItem['status']) => {
    switch (status) {
      case 'success':
        return CheckCircle
      case 'warning':
        return AlertCircle
      case 'error':
        return AlertCircle
      case 'info':
        return Info
      default:
        return Activity
    }
  }

  const getStatusColor = (status?: ActivityItem['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'error':
        return 'text-red-600'
      case 'info':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (isLoading) {
    return (
      <Card className={compact ? 'p-4' : ''}>
        {showHeader && (
          <CardHeader className={compact ? 'p-0 pb-4' : ''}>
            <CardTitle className={compact ? 'text-base' : ''}>Activity Feed</CardTitle>
          </CardHeader>
        )}
        <CardContent className={compact ? 'p-0' : ''}>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={compact ? 'p-4' : ''}>
      {showHeader && (
        <CardHeader className={compact ? 'p-0 pb-4' : ''}>
          <CardTitle className={`flex items-center space-x-2 ${compact ? 'text-base' : ''}`}>
            <Activity className="h-5 w-5" />
            <span>Activity Feed</span>
            <Badge variant="secondary" className="ml-auto">
              {activities.length}
            </Badge>
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={compact ? 'p-0' : ''}>
        <ScrollArea className={compact ? 'h-64' : 'h-80'}>
          <div className="space-y-3">
            {activities.map((activity) => {
              const ActivityIcon = getActivityIcon(activity.type)
              const StatusIcon = getStatusIcon(activity.status)
              
              return (
                <div
                  key={activity.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors hover:bg-accent/50 ${
                    compact ? 'p-2' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.status === 'success' ? 'bg-green-100' :
                      activity.status === 'warning' ? 'bg-yellow-100' :
                      activity.status === 'error' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      <ActivityIcon className={`h-4 w-4 ${
                        activity.status === 'success' ? 'text-green-600' :
                        activity.status === 'warning' ? 'text-yellow-600' :
                        activity.status === 'error' ? 'text-red-600' :
                        'text-blue-600'
                      }`} />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${compact ? 'text-xs' : ''}`}>
                          {activity.message}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimestamp(activity.timestamp)}</span>
                          </div>
                          {activity.user && (
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span>{activity.user.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 ml-2">
                        <StatusIcon className={`h-4 w-4 ${getStatusColor(activity.status)}`} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}