'use client'

import React, { useState, useEffect, Suspense, lazy } from 'react'
import { useProgressiveEnhancement } from '@/hooks/use-progressive-enhancement'
import { cn } from '@/lib/utils'
import { Loader2, Wifi, WifiOff, Smartphone, Monitor, Battery } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface ProgressiveEnhancerProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

interface EnhancementStatus {
  loadedComponents: string[]
  loadingComponents: string[]
  failedComponents: string[]
  progress: number
}

export function ProgressiveEnhancer({
  children,
  fallback,
  className
}: ProgressiveEnhancerProps) {
  const { capabilities, features, loadingPriority, isInitialized } = useProgressiveEnhancement()
  const [enhancementStatus, setEnhancementStatus] = useState<EnhancementStatus>({
    loadedComponents: [],
    loadingComponents: [],
    failedComponents: [],
    progress: 0
  })

  const [showDebugInfo, setShowDebugInfo] = useState(false)

  // Track component loading progress
  useEffect(() => {
    if (!isInitialized) return

    const totalComponents = [
      ...loadingPriority.critical,
      ...loadingPriority.high,
      ...loadingPriority.medium,
      ...loadingPriority.low
    ].length

    let loaded = loadingPriority.critical.length + loadingPriority.high.length
    let loading: string[] = []
    let failed: string[] = []

    // Simulate loading progress (in real implementation, this would come from actual loading events)
    const interval = setInterval(() => {
      if (loaded < totalComponents) {
        loaded += Math.random() > 0.8 ? 2 : 1 // Sometimes load 2 components at once
        const progress = Math.min((loaded / totalComponents) * 100, 100)
        setEnhancementStatus(prev => ({
          ...prev,
          loadedComponents: totalComponents.slice(0, loaded),
          progress
        }))
      } else {
        clearInterval(interval)
      }
    }, 500)

    return () => clearInterval(interval)
  }, [isInitialized, loadingPriority])

  const getCapabilityIcon = () => {
    switch (capabilities.deviceType) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'tablet':
        return <Smartphone className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getConnectionIcon = () => {
    return capabilities.connection === 'slow' ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />
  }

  if (!isInitialized) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Optimizing for your device...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      {/* Debug Info Panel */}
      {showDebugInfo && (
        <Card className="fixed top-4 right-4 w-80 z-50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Progressive Enhancement</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDebugInfo(false)}
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Device:</span>
                <div className="flex items-center space-x-1">
                  {getCapabilityIcon()}
                  <span className="capitalize">{capabilities.deviceType}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Screen:</span>
                <span className="capitalize">{capabilities.screenSize}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Connection:</span>
                <div className="flex items-center space-x-1">
                  {getConnectionIcon()}
                  <span className="capitalize">{capabilities.connection || 'unknown'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Features:</span>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(features).map(([key, enabled]) => (
                    enabled && <Badge key={key} variant="secondary" className="text-xs px-1">✓</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Loading Progress</span>
                <span>{Math.round(enhancementStatus.progress)}%</span>
              </div>
              <Progress value={enhancementStatus.progress} className="h-2" />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-medium">Loaded Components:</div>
              <div className="flex flex-wrap gap-1">
                {enhancementStatus.loadedComponents.slice(0, 5).map(component => (
                  <Badge key={component} variant="outline" className="text-xs">
                    {component}
                  </Badge>
                ))}
                {enhancementStatus.loadedComponents.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{enhancementStatus.loadedComponents.length - 5}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhancement Status Indicator */}
      <div className="fixed bottom-4 left-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDebugInfo(!showDebugInfo)}
          className="shadow-lg"
        >
          <Battery className="h-4 w-4 mr-2" />
          Enhanced
        </Button>
      </div>

      {/* Main Content */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading enhanced features...</p>
              <Progress value={enhancementStatus.progress} className="w-48 mx-auto" />
            </div>
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  )
}

// Higher-order component for progressive enhancement
export function withProgressiveEnhancement<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    priority?: 'critical' | 'high' | 'medium' | 'low'
    fallback?: React.ReactNode
  }
) {
  const { priority = 'medium', fallback } = options || {}

  return function ProgressiveComponent(props: P) {
    const { features, loadingPriority, lazyLoadComponent } = useProgressiveEnhancement()
    const [LoadedComponent, setLoadedComponent] = useState<React.ComponentType<P> | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const loadComponent = async () => {
        try {
          // Simulate component loading based on priority
          const componentName = Component.name.toLowerCase()
          if (loadingPriority[priority].includes(componentName) || priority === 'critical') {
            await new Promise(resolve => setTimeout(resolve, Math.random() * 1000))
          }
          setLoadedComponent(() => Component)
        } catch (error) {
          console.error('Failed to load component:', error)
        } finally {
          setIsLoading(false)
        }
      }

      loadComponent()
    }, [priority, loadingPriority])

    if (isLoading) {
      return fallback || (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )
    }

    return LoadedComponent ? <LoadedComponent {...props} /> : null
  }
}

// Hook for conditional feature rendering
export function useFeature(feature: keyof ProgressiveFeatures) {
  const { features, capabilities } = useProgressiveEnhancement()
  return features[feature] && capabilities
}

// Component for conditional rendering based on features
interface FeatureGateProps {
  feature: keyof ProgressiveFeatures
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { features } = useProgressiveEnhancement()

  if (!features[feature]) {
    return fallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}
