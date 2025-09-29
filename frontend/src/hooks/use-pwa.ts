import { useState, useEffect, useCallback } from 'react'

export interface PWAInstallPrompt extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export interface PushSubscriptionData {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export interface PWANotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: any
  actions?: NotificationAction[]
  requireInteraction?: boolean
  silent?: boolean
}

export interface PWAStatus {
  isInstallable: boolean
  isInstalled: boolean
  isOffline: boolean
  serviceWorkerStatus: 'registering' | 'registered' | 'failed' | 'not-supported'
  cacheStatus: 'checking' | 'available' | 'unavailable'
  pushStatus: 'supported' | 'denied' | 'granted' | 'not-supported'
  backgroundSyncStatus: 'supported' | 'not-supported'
}

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null)
  const [status, setStatus] = useState<PWAStatus>({
    isInstallable: false,
    isInstalled: false,
    isOffline: !navigator.onLine,
    serviceWorkerStatus: 'not-supported',
    cacheStatus: 'checking',
    pushStatus: 'not-supported',
    backgroundSyncStatus: 'not-supported'
  })

  const [cacheSize, setCacheSize] = useState<number>(0)
  const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null)

  // Check if PWA features are supported
  const checkSupport = useCallback(() => {
    const newStatus: Partial<PWAStatus> = {}

    // Service Worker support
    newStatus.serviceWorkerStatus = 'serviceWorker' in navigator ? 'registering' : 'not-supported'

    // Push notifications support
    if ('Notification' in window) {
      newStatus.pushStatus = Notification.permission === 'granted' ? 'granted' :
                            Notification.permission === 'denied' ? 'denied' : 'supported'
    }

    // Background sync support
    newStatus.backgroundSyncStatus = 'serviceWorker' in navigator &&
                                    'sync' in (window as any).ServiceWorkerRegistration.prototype
                                    ? 'supported' : 'not-supported'

    // Check if already installed
    newStatus.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                           (window.navigator as any).standalone === true

    setStatus(prev => ({ ...prev, ...newStatus }))
  }, [])

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      setStatus(prev => ({ ...prev, serviceWorkerStatus: 'not-supported' }))
      return
    }

    try {
      setStatus(prev => ({ ...prev, serviceWorkerStatus: 'registering' }))

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              console.log('New service worker version available')
            }
          })
        }
      })

      // Check for updates periodically
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000) // Check every hour

      setStatus(prev => ({ ...prev, serviceWorkerStatus: 'registered' }))

      // Get cache size
      updateCacheSize()

      return registration
    } catch (error) {
      console.error('Service worker registration failed:', error)
      setStatus(prev => ({ ...prev, serviceWorkerStatus: 'failed' }))
    }
  }, [])

  // Update cache size
  const updateCacheSize = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return

    try {
      const registration = await navigator.serviceWorker.ready
      const messageChannel = new MessageChannel()

      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          setCacheSize(event.data.cacheSize || 0)
          setStatus(prev => ({ ...prev, cacheStatus: 'available' }))
          resolve(event.data.cacheSize)
        }

        registration.active?.postMessage(
          { type: 'GET_CACHE_SIZE' },
          [messageChannel.port2]
        )
      })
    } catch (error) {
      console.error('Failed to get cache size:', error)
      setStatus(prev => ({ ...prev, cacheStatus: 'unavailable' }))
    }
  }, [])

  // Clear all caches
  const clearCache = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return

    try {
      const registration = await navigator.serviceWorker.ready
      const messageChannel = new MessageChannel()

      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          setCacheSize(0)
          resolve(event.data.cleared)
        }

        registration.active?.postMessage(
          { type: 'CLEAR_CACHE' },
          [messageChannel.port2]
        )
      })
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
  }, [])

  // Handle install prompt
  const handleInstallPrompt = useCallback((e: Event) => {
    e.preventDefault()
    setInstallPrompt(e as PWAInstallPrompt)
    setStatus(prev => ({ ...prev, isInstallable: true }))
  }, [])

  // Install PWA
  const installPWA = useCallback(async () => {
    if (!installPrompt) return false

    try {
      await installPrompt.prompt()
      const choice = await installPrompt.userChoice

      if (choice.outcome === 'accepted') {
        setStatus(prev => ({ ...prev, isInstalled: true, isInstallable: false }))
        return true
      }

      return false
    } catch (error) {
      console.error('PWA installation failed:', error)
      return false
    }
  }, [installPrompt])

  // Request push notification permission
  const requestPushPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      setStatus(prev => ({ ...prev, pushStatus: 'not-supported' }))
      return false
    }

    try {
      const permission = await Notification.requestPermission()

      setStatus(prev => ({
        ...prev,
        pushStatus: permission === 'granted' ? 'granted' :
                   permission === 'denied' ? 'denied' : 'supported'
      }))

      return permission === 'granted'
    } catch (error) {
      console.error('Push permission request failed:', error)
      return false
    }
  }, [])

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async (vapidPublicKey?: string) => {
    if (!('serviceWorker' in navigator) || status.pushStatus !== 'granted') {
      return null
    }

    try {
      const registration = await navigator.serviceWorker.ready

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey ? urlBase64ToUint8Array(vapidPublicKey) : undefined
      })

      setPushSubscription(subscription)
      return subscription
    } catch (error) {
      console.error('Push subscription failed:', error)
      return null
    }
  }, [status.pushStatus])

  // Send push notification (for testing)
  const sendNotification = useCallback(async (payload: PWANotificationPayload) => {
    if (!('serviceWorker' in navigator) || status.pushStatus !== 'granted') {
      return false
    }

    try {
      const registration = await navigator.serviceWorker.ready

      await registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/favicon-192x192.png',
        badge: payload.badge || '/favicon-32x32.png',
        data: payload.data || {},
        actions: payload.actions || [],
        requireInteraction: payload.requireInteraction || false,
        silent: payload.silent || false
      })

      return true
    } catch (error) {
      console.error('Failed to send notification:', error)
      return false
    }
  }, [status.pushStatus])

  // Check online/offline status
  const handleOnlineStatus = useCallback(() => {
    setStatus(prev => ({ ...prev, isOffline: !navigator.onLine }))
  }, [])

  // Initialize PWA
  useEffect(() => {
    checkSupport()
    registerServiceWorker()

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', handleInstallPrompt)

    // Listen for online/offline events
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)

    // Check if already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          (window.navigator as any).standalone === true
      setStatus(prev => ({ ...prev, isInstalled: isStandalone }))
    }

    checkInstalled()
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    }
  }, [checkSupport, registerServiceWorker, handleInstallPrompt, handleOnlineStatus])

  // Utility function to convert VAPID key
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  return {
    status,
    installPrompt,
    cacheSize,
    pushSubscription,
    installPWA,
    requestPushPermission,
    subscribeToPush,
    sendNotification,
    clearCache,
    updateCacheSize
  }
}
