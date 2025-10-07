import React, { useState, useEffect } from 'react'
import { useProgressiveEnhancement } from '@/hooks/use-progressive-enhancement'
import { cn } from '@/lib/utils'
import {
  Zap,
  Cpu,
  HardDrive,
  Wifi,
  Monitor,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface PerformanceMonitorProps {
  className?: string
  showRecommendations?: boolean
}

interface PerformanceMetrics {
  loadTime: number
  memoryUsage: number
  networkLatency: number
  frameRate: number
  componentCount: number
  bundleSize: number
}

export function PerformanceMonitor({
  className,
  showRecommendations = true
}: PerformanceMonitorProps) {
  const { capabilities, features, loadingPriority } = useProgressiveEnhancement()
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
    frameRate: 60,
    componentCount: 0,
    bundleSize: 0
  })
  const [isVisible, setIsVisible] = useState(false)

  // Monitor performance metrics
  useEffect(() => {
    const updateMetrics = () => {
      // Load time (simulated)
      const loadTime = performance.now()

      // Memory usage (if available)
      let memoryUsage = 0
      if ('memory' in performance) {
        const memory = (performance as any).memory
        memoryUsage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      }

      // Network latency (simulated)
      const networkLatency = Math.random() * 100 + 20

      // Frame rate (simulated)
      const frameRate = 55 + Math.random() * 10

      // Component count (approximate)
      const componentCount = document.querySelectorAll('[data-component]').length

      // Bundle size (simulated)
      const bundleSize = Math.random() * 2 + 1 // MB

      setMetrics({
        loadTime,
        memoryUsage,
        networkLatency,
        frameRate,
        componentCount,
        bundleSize
      })
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, 5000)

    return () => clearInterval(interval)
  }, [])

  const getPerformanceScore = () => {
    const scores = [
      metrics.loadTime < 2000 ? 100 : metrics.loadTime < 4000 ? 75 : 50,
      metrics.memoryUsage < 70 ? 100 : metrics.memoryUsage < 85 ? 75 : 50,
      metrics.networkLatency < 50 ? 100 : metrics.networkLatency < 100 ? 75 : 50,
      metrics.frameRate > 50 ? 100 : metrics.frameRate > 30 ? 75 : 50,
      metrics.bundleSize < 2 ? 100 : metrics.bundleSize < 3 ? 75 : 50
    ]

    return Math.round(scores.reduce((a, b) => a + b) / scores.length)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRecommendations = () => {
    const recommendations = []

    if (capabilities.connection === 'slow') {
      recommendations.push('Consider reducing image sizes and enabling lazy loading')
    }

    if (capabilities.deviceType === 'mobile') {
      recommendations.push('Optimize for mobile with touch-friendly interfaces')
    }

    if (metrics.memoryUsage > 80) {
      recommendations.push('Consider reducing component complexity or implementing virtualization')
    }

    if (metrics.frameRate < 50) {
      recommendations.push('Reduce animations or optimize rendering performance')
    }

    if (metrics.bundleSize > 2.5) {
      recommendations.push('Consider code splitting or tree shaking to reduce bundle size')
    }

    return recommendations
  }

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className={cn("fixed bottom-16 left-4 z-40 shadow-lg", className)}
      >
        <TrendingUp className="h-4 w-4 mr-2" />
        Performance
      </Button>
    )
  }

  const performanceScore = getPerformanceScore()
  const recommendations = getRecommendations()

  return (
    <Card className={cn("fixed bottom-4 left-4 w-96 max-h-96 z-50 shadow-xl", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            Performance Monitor
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
          >
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="capabilities">Device</TabsTrigger>
            <TabsTrigger value="recommendations">Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Performance Score</span>
              <div className="flex items-center space-x-2">
                <span className={cn("text-lg font-bold", getScoreColor(performanceScore))}>
                  {performanceScore}
                </span>
                <Badge variant={performanceScore >= 80 ? "default" : performanceScore >= 60 ? "secondary" : "destructive"}>
                  {performanceScore >= 80 ? 'Excellent' : performanceScore >= 60 ? 'Good' : 'Needs Improvement'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span>Load Time</span>
                  <span>{Math.round(metrics.loadTime)}ms</span>
                </div>
                <Progress value={Math.min(metrics.loadTime / 40, 100)} className="h-1" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span>Memory</span>
                  <span>{Math.round(metrics.memoryUsage)}%</span>
                </div>
                <Progress value={metrics.memoryUsage} className="h-1" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span>Network</span>
                  <span>{Math.round(metrics.networkLatency)}ms</span>
                </div>
                <Progress value={Math.max(0, 100 - metrics.networkLatency)} className="h-1" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span>Frame Rate</span>
                  <span>{Math.round(metrics.frameRate)}fps</span>
                </div>
                <Progress value={(metrics.frameRate / 60) * 100} className="h-1" />
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Bundle Size: {metrics.bundleSize.toFixed(1)}MB • Components: {metrics.componentCount}
            </div>
          </TabsContent>

          <TabsContent value="capabilities" className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center space-x-2">
                {capabilities.deviceType === 'mobile' ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
                <span>{capabilities.deviceType}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Wifi className="h-3 w-3" />
                <span>{capabilities.connection || 'unknown'}</span>
              </div>

              <div>
                <span>Screen: {capabilities.screenSize}</span>
              </div>

              <div>
                <span>Touch: {capabilities.touchEnabled ? 'Yes' : 'No'}</span>
              </div>

              <div>
                <span>WebGL: {capabilities.supportsWebGL ? 'Yes' : 'No'}</span>
              </div>

              <div>
                <span>WebRTC: {capabilities.supportsWebRTC ? 'Yes' : 'No'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium">Enabled Features:</div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(features).map(([key, enabled]) => (
                  enabled ? (
                    <Badge key={key} variant="secondary" className="text-xs">
                      <CheckCircle className="h-2 w-2 mr-1" />
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </Badge>
                  ) : null
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-3">
            {recommendations.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center text-xs font-medium text-orange-600">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Optimization Suggestions
                </div>
                <div className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="text-xs p-2 bg-orange-50 dark:bg-orange-950 rounded border">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-green-600">All Optimized!</div>
                <div className="text-xs text-muted-foreground">
                  Your app is performing optimally for your device.
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="text-xs font-medium">Loading Priorities:</div>
              <div className="space-y-1">
                {Object.entries(loadingPriority).map(([priority, components]) => (
                  components.length > 0 && (
                    <div key={priority} className="text-xs">
                      <Badge variant="outline" className="text-xs mr-2 capitalize">
                        {priority}
                      </Badge>
                      {components.length} components
                    </div>
                  )
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
