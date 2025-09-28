'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, Zap, Upload, Eye, Edit, Trash2 } from 'lucide-react'

interface Activity {
  id: string
  type: string
  message: string
  timestamp: string
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'website_created':
      case 'website_published':
        return Globe
      case 'ai_generation':
        return Zap
      case 'file_upload':
        return Upload
      case 'website_viewed':
        return Eye
      case 'website_edited':
        return Edit
      case 'website_deleted':
        return Trash2
      default:
        return Globe
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'website_created':
        return 'bg-blue-500'
      case 'website_published':
        return 'bg-green-500'
      case 'ai_generation':
        return 'bg-purple-500'
      case 'file_upload':
        return 'bg-orange-500'
      case 'website_viewed':
        return 'bg-gray-500'
      case 'website_edited':
        return 'bg-yellow-500'
      case 'website_deleted':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-2">No recent activity</div>
            <p className="text-sm text-muted-foreground">
              Your activity will appear here as you use the platform
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getActivityIcon(activity.type)
              const colorClass = getActivityColor(activity.type)

              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${colorClass} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
