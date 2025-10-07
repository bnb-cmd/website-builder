import React, { useState } from 'react'
import { usePWA } from '@/hooks/use-pwa'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Download,
  Wifi,
  WifiOff,
  Bell,
  BellOff,
  Trash2,
  RefreshCw,
  Smartphone,
  Monitor,
  Cloud,
  CloudOff,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface PWAManagerProps {
  className?: string
  compact?: boolean
}

export function PWAManager({ className, compact = false }: PWAManagerProps) {
  const {
    status,
    installPrompt,
    cacheSize,
    pushSubscription,
    installPWA,
    requestPushPermission,
    sendNotification,
    clearCache,
    updateCacheSize
  } = usePWA()

  const [isOpen, setIsOpen] = useState(false)
  const [isClearingCache, setIsClearingCache] = useState(false)

  const formatCacheSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const handleInstall = async () => {
    const success = await installPWA()
    if (success) {
      toast.success('Pakistan Website Builder installed successfully!')
    } else {
      toast.error('Installation cancelled or failed')
    }
  }

  const handlePushPermission = async () => {
    const granted = await requestPushPermission()
    if (granted) {
      toast.success('Push notifications enabled!')
    } else {
      toast.error('Push notifications denied')
    }
  }

  const handleTestNotification = async () => {
    const success = await sendNotification({
      title: 'Test Notification',
      body: 'This is a test push notification from Pakistan Website Builder!',
      icon: '/favicon-192x192.png',
      badge: '/favicon-32x32.png',
      actions: [
        { action: 'view', title: 'View' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    })

    if (success) {
      toast.success('Test notification sent!')
    } else {
      toast.error('Failed to send test notification')
    }
  }

  const handleClearCache = async () => {
    setIsClearingCache(true)
    try {
      await clearCache()
      await updateCacheSize()
      toast.success('Cache cleared successfully!')
    } catch (error) {
      toast.error('Failed to clear cache')
    } finally {
      setIsClearingCache(false)
    }
  }

  if (compact) {
    return (
      <div className={cn("relative", className)}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2"
        >
          {status.isOffline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
          <span>PWA</span>
        </Button>

        {isOpen && (
          <Card className="absolute top-full right-0 mt-2 w-80 z-50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center">
                <Cloud className="h-4 w-4 mr-2" />
                PWA Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Installation */}
              {status.isInstallable && !status.isInstalled && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span className="text-sm">Install App</span>
                  </div>
                  <Button size="sm" onClick={handleInstall}>
                    Install
                  </Button>
                </div>
              )}

              {status.isInstalled && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">App Installed</span>
                </div>
              )}

              {/* Connection Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {status.isOffline ? <WifiOff className="h-4 w-4 text-red-500" /> : <Wifi className="h-4 w-4 text-green-500" />}
                  <span className="text-sm">Connection</span>
                </div>
                <Badge variant={status.isOffline ? "destructive" : "default"}>
                  {status.isOffline ? 'Offline' : 'Online'}
                </Badge>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {status.pushStatus === 'granted' ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                  <span className="text-sm">Notifications</span>
                </div>
                {status.pushStatus === 'supported' && (
                  <Button size="sm" variant="outline" onClick={handlePushPermission}>
                    Enable
                  </Button>
                )}
                {status.pushStatus === 'granted' && (
                  <Badge variant="default">Enabled</Badge>
                )}
              </div>

              {/* Cache Size */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cloud className="h-4 w-4" />
                  <span className="text-sm">Cache</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatCacheSize(cacheSize)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <Card className={cn("w-full max-w-2xl", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Cloud className="h-5 w-5" />
          <span>Progressive Web App</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="install">Install</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="cache">Cache</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Connection Status */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {status.isOffline ? (
                        <WifiOff className="h-8 w-8 text-red-500" />
                      ) : (
                        <Wifi className="h-8 w-8 text-green-500" />
                      )}
                      <div>
                        <h3 className="font-semibold">Connection</h3>
                        <p className="text-sm text-muted-foreground">
                          {status.isOffline ? 'Offline' : 'Online'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={status.isOffline ? "destructive" : "default"}>
                      {status.isOffline ? 'Offline' : 'Online'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Service Worker Status */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Cloud className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-semibold">Service Worker</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {status.serviceWorkerStatus.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        status.serviceWorkerStatus === 'registered' ? "default" :
                        status.serviceWorkerStatus === 'failed' ? "destructive" :
                        "secondary"
                      }
                    >
                      {status.serviceWorkerStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Installation Status */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {status.isInstalled ? (
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      ) : (
                        <Download className="h-8 w-8 text-gray-500" />
                      )}
                      <div>
                        <h3 className="font-semibold">Installation</h3>
                        <p className="text-sm text-muted-foreground">
                          {status.isInstalled ? 'Installed' : status.isInstallable ? 'Available' : 'Not available'}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        status.isInstalled ? "default" :
                        status.isInstallable ? "secondary" : "outline"
                      }
                    >
                      {status.isInstalled ? 'Installed' : status.isInstallable ? 'Available' : 'N/A'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Push Notifications */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {status.pushStatus === 'granted' ? (
                        <Bell className="h-8 w-8 text-green-500" />
                      ) : (
                        <BellOff className="h-8 w-8 text-gray-500" />
                      )}
                      <div>
                        <h3 className="font-semibold">Notifications</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {status.pushStatus.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        status.pushStatus === 'granted' ? "default" :
                        status.pushStatus === 'denied' ? "destructive" :
                        status.pushStatus === 'supported' ? "secondary" : "outline"
                      }
                    >
                      {status.pushStatus}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Offline Capabilities */}
            {status.isOffline && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You're currently offline. All changes will be synced when your connection is restored.
                  You can continue editing and your work will be saved locally.
                </AlertDescription>
              </Alert>
            )}

            {!status.isOffline && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  You're online and connected. All features are available and changes sync in real-time.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="install" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Install Pakistan Website Builder</h3>

              {status.isInstalled ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Pakistan Website Builder is already installed on your device!
                  </AlertDescription>
                </Alert>
              ) : status.isInstallable ? (
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Install Pakistan Website Builder as an app for the best experience.
                      You'll get offline access, faster loading, and native app-like functionality.
                    </AlertDescription>
                  </Alert>

                  <div className="flex items-center space-x-4">
                    <Monitor className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <h4 className="font-medium">Desktop Installation</h4>
                      <p className="text-sm text-muted-foreground">
                        Click the install button or use your browser's install prompt.
                      </p>
                    </div>
                    <Button onClick={handleInstall}>
                      <Download className="h-4 w-4 mr-2" />
                      Install
                    </Button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Smartphone className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <h4 className="font-medium">Mobile Installation</h4>
                      <p className="text-sm text-muted-foreground">
                        Tap "Add to Home Screen" in your mobile browser.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    PWA installation is not available in your current browser.
                    Try using Chrome, Edge, or Safari for the best experience.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Push Notifications</h3>

              {status.pushStatus === 'not-supported' ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Push notifications are not supported in your browser.
                  </AlertDescription>
                </Alert>
              ) : status.pushStatus === 'denied' ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Push notifications are blocked. Please enable them in your browser settings.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {status.pushStatus === 'supported' && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Enable push notifications to stay updated with your website changes and collaboration invites.
                      </AlertDescription>
                    </Alert>
                  )}

                  {status.pushStatus === 'supported' && (
                    <Button onClick={handlePushPermission}>
                      <Bell className="h-4 w-4 mr-2" />
                      Enable Notifications
                    </Button>
                  )}

                  {status.pushStatus === 'granted' && (
                    <div className="space-y-4">
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Push notifications are enabled! You'll receive updates about your websites and collaborations.
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-2">
                        <h4 className="font-medium">Test Notification</h4>
                        <Button variant="outline" onClick={handleTestNotification}>
                          Send Test Notification
                        </Button>
                      </div>

                      {pushSubscription && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Subscription Details</h4>
                          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                            Endpoint: {pushSubscription.endpoint.slice(-20)}...
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="cache" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cache Management</h3>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Pakistan Website Builder caches content for offline use and faster loading.
                  You can clear the cache if you experience issues or want to free up space.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Cache Size</h4>
                        <p className="text-2xl font-bold">{formatCacheSize(cacheSize)}</p>
                      </div>
                      <Cloud className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Cache Status</h4>
                        <p className="text-sm capitalize">{status.cacheStatus}</p>
                      </div>
                      <Badge variant={status.cacheStatus === 'available' ? "default" : "secondary"}>
                        {status.cacheStatus}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => updateCacheSize()}
                  disabled={status.cacheStatus === 'checking'}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Size
                </Button>

                <Button
                  variant="destructive"
                  onClick={handleClearCache}
                  disabled={isClearingCache || cacheSize === 0}
                >
                  {isClearingCache ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Clear Cache
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>• Templates and components are cached for offline use</p>
                <p>• Your website data is stored locally when editing offline</p>
                <p>• Changes sync automatically when connection is restored</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
