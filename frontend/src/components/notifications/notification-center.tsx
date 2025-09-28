'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Filter, 
  Search, 
  Settings, 
  MoreVertical,
  ExternalLink,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  Zap,
  Mail,
  MessageSquare,
  Smartphone,
  BarChart3,
  Loader2,
  X,
  Users,
  Package,
  AlertTriangle,
  Globe,
  Brain,
  UserPlus,
  Shield,
  Activity,
  Database,
  TrendingUp
} from 'lucide-react'
import { api } from '@/lib/api'

interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  channel: string
  status: string
  priority: string
  read: boolean
  readAt?: string
  clickedAt?: string
  createdAt: string
  updatedAt: string
  actions?: NotificationAction[]
  imageUrl?: string
}

interface NotificationAction {
  label: string
  action: string
  style: 'primary' | 'secondary' | 'danger' | 'success'
  url?: string
}

interface NotificationCenterProps {
  userId: string
  onClose?: () => void
}

const notificationTypes = {
  INFO: { icon: Info, color: 'bg-blue-500', label: 'Info' },
  SUCCESS: { icon: CheckCircle, color: 'bg-green-500', label: 'Success' },
  WARNING: { icon: AlertCircle, color: 'bg-yellow-500', label: 'Warning' },
  ERROR: { icon: XCircle, color: 'bg-red-500', label: 'Error' },
  PAYMENT: { icon: Zap, color: 'bg-purple-500', label: 'Payment' },
  SUBSCRIPTION: { icon: Bell, color: 'bg-indigo-500', label: 'Subscription' },
  WEBSITE: { icon: ExternalLink, color: 'bg-cyan-500', label: 'Website' },
  TEAM: { icon: Users, color: 'bg-pink-500', label: 'Team' },
  ORDER_STATUS: { icon: Package, color: 'bg-orange-500', label: 'Order' },
  INVENTORY_LOW: { icon: AlertTriangle, color: 'bg-red-600', label: 'Inventory' },
  DOMAIN_EXPIRY: { icon: Globe, color: 'bg-blue-600', label: 'Domain' },
  AI_GENERATION_COMPLETE: { icon: Brain, color: 'bg-purple-600', label: 'AI' },
  COLLABORATION_INVITE: { icon: UserPlus, color: 'bg-green-600', label: 'Collaboration' },
  SECURITY_ALERT: { icon: Shield, color: 'bg-red-700', label: 'Security' },
  PERFORMANCE_ISSUE: { icon: Activity, color: 'bg-yellow-600', label: 'Performance' },
  BACKUP_COMPLETE: { icon: Database, color: 'bg-green-700', label: 'Backup' },
  INTEGRATION_ERROR: { icon: AlertCircle, color: 'bg-red-600', label: 'Integration' },
  CAMPAIGN_RESULTS: { icon: BarChart3, color: 'bg-blue-700', label: 'Campaign' },
  ANALYTICS_INSIGHT: { icon: TrendingUp, color: 'bg-purple-700', label: 'Analytics' }
}

const channelIcons = {
  IN_APP: Bell,
  EMAIL: Mail,
  SMS: MessageSquare,
  WHATSAPP: MessageSquare,
  PUSH: Smartphone,
  WEBHOOK: ExternalLink,
  SLACK: MessageSquare
}

export function NotificationCenter({ userId, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    loadNotifications()
    setupWebSocket()
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [userId])

  useEffect(() => {
    filterNotifications()
  }, [notifications, activeTab, searchQuery, selectedType])

  const loadNotifications = async () => {
    try {
      setIsLoading(true)
      const response = await api.notifications.getNotifications(userId, {
        limit: 100,
        unreadOnly: activeTab === 'unread'
      })
      setNotifications(response.data || [])
      setUnreadCount(response.data?.filter((n: Notification) => !n.read).length || 0)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const setupWebSocket = () => {
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'}/v1/notifications/ws/${userId}`
    wsRef.current = new WebSocket(wsUrl)

    wsRef.current.onopen = () => {
      console.log('WebSocket connected')
    }

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'notification') {
          setNotifications(prev => [data.data, ...prev])
          if (!data.data.read) {
            setUnreadCount(prev => prev + 1)
          }
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected')
      // Reconnect after 5 seconds
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CLOSED) {
          setupWebSocket()
        }
      }, 5000)
    }
  }

  const filterNotifications = () => {
    let filtered = notifications

    // Filter by tab
    if (activeTab === 'unread') {
      filtered = filtered.filter(n => !n.read)
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(n => n.type === selectedType)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredNotifications(filtered)
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await api.notifications.markAsRead(notificationId)
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, read: true, readAt: new Date().toISOString() }
            : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.notifications.markAllAsRead(userId)
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true, readAt: new Date().toISOString() }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const handleActionClick = async (notificationId: string, action: NotificationAction) => {
    try {
      // Mark as read first
      await markAsRead(notificationId)
      
      // Handle action
      if (action.url) {
        window.open(action.url, '_blank')
      } else {
        // Handle custom actions
        console.log('Action clicked:', action.action)
      }
    } catch (error) {
      console.error('Failed to handle action:', error)
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="w-4 h-4 mr-1" />
              Mark All Read
            </Button>
            <Button size="sm" variant="outline">
              <Settings className="w-4 h-4" />
            </Button>
            {onClose && (
              <Button size="sm" variant="ghost" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Types</option>
            {Object.entries(notificationTypes).map(([type, config]) => (
              <option key={type} value={type}>{config.label}</option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="p-0">
            <ScrollArea className="h-96">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <Bell className="w-8 h-8 mb-2" />
                  <p>No notifications found</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotifications.map((notification) => {
                    const typeConfig = notificationTypes[notification.type as keyof typeof notificationTypes]
                    const Icon = typeConfig?.icon || Bell
                    const ChannelIcon = channelIcons[notification.channel as keyof typeof channelIcons] || Bell

                    return (
                      <div
                        key={notification.id}
                        className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full ${typeConfig?.color || 'bg-gray-500'} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <ChannelIcon className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {getTimeAgo(notification.createdAt)}
                                </span>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>

                            {/* Actions */}
                            {notification.actions && notification.actions.length > 0 && (
                              <div className="flex items-center space-x-2 mt-2">
                                {notification.actions.map((action, index) => (
                                  <Button
                                    key={index}
                                    size="sm"
                                    variant={action.style === 'primary' ? 'default' : 'outline'}
                                    className="h-6 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleActionClick(notification.id, action)
                                    }}
                                  >
                                    {action.label}
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
          </TabsContent>

          <TabsContent value="unread" className="p-0">
            <ScrollArea className="h-96">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <CheckCircle className="w-8 h-8 mb-2" />
                  <p>No unread notifications</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotifications.map((notification) => {
                    const typeConfig = notificationTypes[notification.type as keyof typeof notificationTypes]
                    const Icon = typeConfig?.icon || Bell

                    return (
                      <div
                        key={notification.id}
                        className="p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors bg-blue-50 border-l-4 border-l-blue-500"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full ${typeConfig?.color || 'bg-gray-500'} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {getTimeAgo(notification.createdAt)}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markAsRead(notification.id)
                                }}
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Mark Read
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
              <p className="text-gray-600">Notification preferences will be implemented here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
