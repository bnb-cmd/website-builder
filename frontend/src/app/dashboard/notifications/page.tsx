'use client'

import React, { useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Bell, 
  Settings, 
  BarChart3, 
  Mail, 
  Smartphone, 
  Globe,
  CheckCircle,
  AlertCircle,
  Clock,
  X,
  Filter,
  Search
} from 'lucide-react'

export default function NotificationsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('center')

  const notifications = [
    {
      id: 1,
      title: 'Website Published',
      message: 'Your website "My Business" has been successfully published.',
      type: 'success',
      timestamp: '2024-01-15T10:30:00Z',
      read: false
    },
    {
      id: 2,
      title: 'Payment Received',
      message: 'Payment of $29.99 has been received for your premium subscription.',
      type: 'success',
      timestamp: '2024-01-15T09:15:00Z',
      read: true
    },
    {
      id: 3,
      title: 'Template Update',
      message: 'New templates have been added to your library.',
      type: 'info',
      timestamp: '2024-01-14T16:45:00Z',
      read: false
    },
    {
      id: 4,
      title: 'Security Alert',
      message: 'Unusual login activity detected from a new device.',
      type: 'warning',
      timestamp: '2024-01-14T14:20:00Z',
      read: true
    }
  ]

  const preferences = [
    {
      category: 'Website Updates',
      description: 'Notifications about your website status and changes',
      email: true,
      push: true,
      inApp: true
    },
    {
      category: 'Payments & Billing',
      description: 'Payment confirmations and billing reminders',
      email: true,
      push: false,
      inApp: true
    },
    {
      category: 'New Features',
      description: 'Updates about new features and improvements',
      email: false,
      push: true,
      inApp: true
    },
    {
      category: 'Security',
      description: 'Security alerts and account activity',
      email: true,
      push: true,
      inApp: true
    }
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-500" />
            Notifications
          </h1>
          <p className="text-muted-foreground">
            Manage your notifications and preferences
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="center">Notification Center</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="center" className="space-y-6">
          {/* Notification Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unread</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {notifications.filter(n => !n.read).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  New notifications
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notifications.length}</div>
                <p className="text-xs text-muted-foreground">
                  All notifications
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Recent notifications
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Notifications</h3>
            {notifications.map((notification) => (
              <Card key={notification.id} className={!notification.read ? 'border-blue-200 bg-blue-50/50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <Badge variant="default" className="text-xs">New</Badge>
                          )}
                          <Button variant="ghost" size="sm">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {preferences.map((pref, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{pref.category}</h4>
                    <p className="text-sm text-muted-foreground">{pref.description}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Switch checked={pref.email} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <Switch checked={pref.push} />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <Switch checked={pref.inApp} />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="text-center py-16 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Notification Analytics</h3>
            <p>Detailed analytics about your notification engagement coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
