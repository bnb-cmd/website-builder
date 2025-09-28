'use client'

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NotificationCenter } from '@/components/notifications/notification-center'
import { NotificationPreferences } from '@/components/notifications/notification-preferences'
import { NotificationAnalytics } from '@/components/notifications/notification-analytics'

export default function NotificationsPage() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId') || ''
  const [activeTab, setActiveTab] = useState('center')

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            User ID Required
          </h2>
          <p className="text-gray-500">
            Please provide a user ID to access notifications.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="center">Notification Center</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="center">
          <NotificationCenter userId={userId} />
        </TabsContent>

        <TabsContent value="preferences">
          <NotificationPreferences userId={userId} />
        </TabsContent>

        <TabsContent value="analytics">
          <NotificationAnalytics userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
