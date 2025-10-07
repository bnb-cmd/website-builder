'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Bell,
  Eye,
  MousePointer,
  Clock,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { api } from '@/lib/api'

interface NotificationAnalytics {
  totalSent: number
  totalRead: number
  totalClicked: number
  openRate: number
  clickRate: number
  channelBreakdown: { [key: string]: number }
  typeBreakdown: { [key: string]: number }
}

interface NotificationAnalyticsProps {
  userId: string
}

const channelIcons = {
  IN_APP: Bell,
  EMAIL: Mail,
  SMS: MessageSquare,
  WHATSAPP: MessageSquare,
  PUSH: Smartphone,
  WEBHOOK: Bell,
  SLACK: MessageSquare
}

const channelColors = {
  IN_APP: 'bg-blue-900',
  EMAIL: 'bg-green-500',
  SMS: 'bg-yellow-500',
  WHATSAPP: 'bg-green-600',
  PUSH: 'bg-purple-500',
  WEBHOOK: 'bg-gray-500',
  SLACK: 'bg-indigo-500'
}

export function NotificationAnalytics({ userId }: NotificationAnalyticsProps) {
  const [analytics, setAnalytics] = useState<NotificationAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [timeRange, setTimeRange] = useState(30)

  useEffect(() => {
    loadAnalytics()
  }, [userId, timeRange])

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      const response = await api.notifications.getAnalytics(userId, { days: timeRange })
      setAnalytics(response.data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getChannelIcon = (channel: string) => {
    const Icon = channelIcons[channel as keyof typeof channelIcons] || Bell
    return <Icon className="w-4 h-4" />
  }

  const getChannelColor = (channel: string) => {
    return channelColors[channel as keyof typeof channelColors] || 'bg-gray-500'
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">Failed to load analytics</p>
          <Button onClick={loadAnalytics} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notification Analytics</h2>
          <p className="text-gray-600">Track your notification performance and engagement</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange.toString()} onValueChange={(value) => setTimeRange(Number(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={loadAnalytics} variant="outline">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSent}</div>
            <p className="text-xs text-muted-foreground">
              Notifications sent in {timeRange} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.openRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalRead} of {analytics.totalSent} opened
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.clickRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalClicked} clicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.openRate > analytics.clickRate ? (
                <TrendingUp className="w-6 h-6 text-green-500" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.openRate > analytics.clickRate ? 'Growing' : 'Declining'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Channel Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Channels</CardTitle>
          <p className="text-sm text-gray-600">Notifications sent by channel</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(analytics.channelBreakdown).map(([channel, count]) => {
              const percentage = analytics.totalSent > 0 ? (count / analytics.totalSent) * 100 : 0
              const Icon = channelIcons[channel as keyof typeof channelIcons] || Bell
              
              return (
                <div key={channel} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full ${getChannelColor(channel)} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{channel.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-500">{count} notifications</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{percentage.toFixed(1)}%</p>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getChannelColor(channel)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <p className="text-sm text-gray-600">Most common notification types</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(analytics.typeBreakdown)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 10)
              .map(([type, count]) => {
                const percentage = analytics.totalSent > 0 ? (count / analytics.totalSent) * 100 : 0
                
                return (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                        <Bell className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{type.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-500">{count} notifications</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{percentage.toFixed(1)}%</p>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-900"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.openRate > 50 ? (
              <div className="flex items-center space-x-2 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <p>Great open rate! Your notifications are engaging users effectively.</p>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-yellow-600">
                <TrendingDown className="w-4 h-4" />
                <p>Consider improving notification titles and timing to increase open rates.</p>
              </div>
            )}

            {analytics.clickRate > 10 ? (
              <div className="flex items-center space-x-2 text-green-600">
                <MousePointer className="w-4 h-4" />
                <p>Excellent click rate! Users are taking action on your notifications.</p>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-yellow-600">
                <MousePointer className="w-4 h-4" />
                <p>Try adding more compelling call-to-action buttons to increase clicks.</p>
              </div>
            )}

            {analytics.totalSent < 10 && (
              <div className="flex items-center space-x-2 text-blue-900">
                <Bell className="w-4 h-4" />
                <p>You're just getting started! Send more notifications to gather meaningful data.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
