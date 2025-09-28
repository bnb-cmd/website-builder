'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Clock, 
  Globe, 
  Save,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { api } from '@/lib/api'

interface NotificationPreferences {
  id: string
  userId: string
  emailEnabled: boolean
  pushEnabled: boolean
  smsEnabled: boolean
  whatsappEnabled: boolean
  enabledTypes: string[]
  quietHoursStart?: string
  quietHoursEnd?: string
  timezone: string
  digestFrequency: string
  language: string
}

interface NotificationPreferencesProps {
  userId: string
}

const notificationTypes = [
  { value: 'INFO', label: 'General Information' },
  { value: 'SUCCESS', label: 'Success Messages' },
  { value: 'WARNING', label: 'Warnings' },
  { value: 'ERROR', label: 'Errors' },
  { value: 'PAYMENT', label: 'Payment Updates' },
  { value: 'SUBSCRIPTION', label: 'Subscription Changes' },
  { value: 'WEBSITE', label: 'Website Updates' },
  { value: 'TEAM', label: 'Team Activities' },
  { value: 'ORDER_STATUS', label: 'Order Status' },
  { value: 'INVENTORY_LOW', label: 'Low Inventory' },
  { value: 'DOMAIN_EXPIRY', label: 'Domain Expiry' },
  { value: 'AI_GENERATION_COMPLETE', label: 'AI Generation Complete' },
  { value: 'COLLABORATION_INVITE', label: 'Collaboration Invites' },
  { value: 'SECURITY_ALERT', label: 'Security Alerts' },
  { value: 'PERFORMANCE_ISSUE', label: 'Performance Issues' },
  { value: 'BACKUP_COMPLETE', label: 'Backup Complete' },
  { value: 'INTEGRATION_ERROR', label: 'Integration Errors' },
  { value: 'CAMPAIGN_RESULTS', label: 'Campaign Results' },
  { value: 'ANALYTICS_INSIGHT', label: 'Analytics Insights' }
]

const languages = [
  { value: 'en', label: 'English' },
  { value: 'ur', label: 'اردو (Urdu)' },
  { value: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { value: 'sd', label: 'سنڌي (Sindhi)' },
  { value: 'ps', label: 'پښتو (Pashto)' }
]

const timezones = [
  { value: 'Asia/Karachi', label: 'Karachi (PKT)' },
  { value: 'Asia/Lahore', label: 'Lahore (PKT)' },
  { value: 'Asia/Islamabad', label: 'Islamabad (PKT)' },
  { value: 'UTC', label: 'UTC' }
]

export function NotificationPreferences({ userId }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadPreferences()
  }, [userId])

  const loadPreferences = async () => {
    try {
      setIsLoading(true)
      const response = await api.notifications.getPreferences(userId)
      setPreferences(response.data)
    } catch (error) {
      console.error('Failed to load preferences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const savePreferences = async () => {
    if (!preferences) return

    try {
      setIsSaving(true)
      await api.notifications.updatePreferences(userId, preferences)
      // Show success message
    } catch (error) {
      console.error('Failed to save preferences:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    if (!preferences) return
    setPreferences(prev => prev ? { ...prev, [key]: value } : null)
  }

  const toggleNotificationType = (type: string) => {
    if (!preferences) return
    
    const enabledTypes = preferences.enabledTypes.includes(type)
      ? preferences.enabledTypes.filter(t => t !== type)
      : [...preferences.enabledTypes, type]
    
    updatePreference('enabledTypes', enabledTypes)
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

  if (!preferences) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">Failed to load notification preferences</p>
          <Button onClick={loadPreferences} className="mt-4">
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
          <h2 className="text-2xl font-bold">Notification Preferences</h2>
          <p className="text-gray-600">Customize how and when you receive notifications</p>
        </div>
        <Button onClick={savePreferences} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      {/* Channel Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Delivery Channels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <Label htmlFor="email-enabled">Email Notifications</Label>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              id="email-enabled"
              checked={preferences.emailEnabled}
              onCheckedChange={(checked) => updatePreference('emailEnabled', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-gray-600" />
              <div>
                <Label htmlFor="push-enabled">Push Notifications</Label>
                <p className="text-sm text-gray-500">Receive push notifications in browser</p>
              </div>
            </div>
            <Switch
              id="push-enabled"
              checked={preferences.pushEnabled}
              onCheckedChange={(checked) => updatePreference('pushEnabled', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <div>
                <Label htmlFor="sms-enabled">SMS Notifications</Label>
                <p className="text-sm text-gray-500">Receive SMS notifications (Pakistani numbers)</p>
              </div>
            </div>
            <Switch
              id="sms-enabled"
              checked={preferences.smsEnabled}
              onCheckedChange={(checked) => updatePreference('smsEnabled', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <div>
                <Label htmlFor="whatsapp-enabled">WhatsApp Notifications</Label>
                <p className="text-sm text-gray-500">Receive WhatsApp Business messages</p>
              </div>
            </div>
            <Switch
              id="whatsapp-enabled"
              checked={preferences.whatsappEnabled}
              onCheckedChange={(checked) => updatePreference('whatsappEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <p className="text-sm text-gray-600">Choose which types of notifications you want to receive</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notificationTypes.map((type) => (
              <div key={type.value} className="flex items-center space-x-3">
                <Switch
                  checked={preferences.enabledTypes.includes(type.value)}
                  onCheckedChange={() => toggleNotificationType(type.value)}
                />
                <Label className="text-sm">{type.label}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timing Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Timing Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quiet-hours-start">Quiet Hours Start</Label>
              <Select
                value={preferences.quietHoursStart || ''}
                onValueChange={(value) => updatePreference('quietHoursStart', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0')
                    return (
                      <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                        {hour}:00
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quiet-hours-end">Quiet Hours End</Label>
              <Select
                value={preferences.quietHoursEnd || ''}
                onValueChange={(value) => updatePreference('quietHoursEnd', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, '0')
                    return (
                      <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                        {hour}:00
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={preferences.timezone}
                onValueChange={(value) => updatePreference('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="digest-frequency">Digest Frequency</Label>
              <Select
                value={preferences.digestFrequency}
                onValueChange={(value) => updatePreference('digestFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INSTANT">Instant</SelectItem>
                  <SelectItem value="DAILY">Daily Digest</SelectItem>
                  <SelectItem value="WEEKLY">Weekly Digest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Language Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="language">Notification Language</Label>
            <Select
              value={preferences.language}
              onValueChange={(value) => updatePreference('language', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              Choose your preferred language for notifications
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
