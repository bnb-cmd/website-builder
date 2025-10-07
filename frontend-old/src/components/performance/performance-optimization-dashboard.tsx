'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Zap,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Image,
  Code,
  Globe,
  Clock,
  Upload,
  Download,
  CheckCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  Play,
  Settings,
  Target,
  Activity,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react'
import { apiHelpers } from '@/lib/api'
import { cn } from '@/lib/utils'

interface PerformanceOptimizationDashboardProps {
  websiteId: string
}

export function PerformanceOptimizationDashboard({ websiteId }: PerformanceOptimizationDashboardProps) {
  const [performanceData, setPerformanceData] = useState<any>(null)
  const [coreWebVitals, setCoreWebVitals] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any>(null)
  const [bundleAnalysis, setBundleAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [optimizationResults, setOptimizationResults] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [codeInput, setCodeInput] = useState('')
  const [minificationResult, setMinificationResult] = useState<any>(null)

  useEffect(() => {
    loadPerformanceData()
  }, [websiteId])

  const loadPerformanceData = async () => {
    try {
      setIsLoading(true)
      const [vitals, recs, bundle] = await Promise.all([
        apiHelpers.getCoreWebVitals(websiteId),
        apiHelpers.getPerformanceRecommendations(websiteId),
        apiHelpers.getBundleAnalysis(websiteId)
      ])

      setCoreWebVitals(vitals.data)
      setRecommendations(recs.data)
      setBundleAnalysis(bundle.data)
    } catch (error) {
      console.error('Failed to load performance data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageOptimization = async () => {
    if (!selectedImage) return

    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('image', selectedImage)

      const response = await fetch('/api/optimize-image', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)

        // Download optimized image
        const a = document.createElement('a')
        a.href = url
        a.download = `optimized_${selectedImage.name}`
        a.click()

        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Image optimization failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeMinification = async (type: 'javascript' | 'css') => {
    if (!codeInput.trim()) return

    try {
      setIsLoading(true)
      const endpoint = type === 'javascript' ? '/api/minify/javascript' : '/api/minify/css'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [type === 'javascript' ? 'code' : 'css']: codeInput })
      })

      const result = await response.json()
      setMinificationResult(result.data)
    } catch (error) {
      console.error('Code minification failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAutomatedOptimization = async () => {
    try {
      setIsLoading(true)
      const response = await apiHelpers.runAutomatedOptimization(websiteId)
      setOptimizationResults(response.data)
    } catch (error) {
      console.error('Automated optimization failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getVitalsColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600'
      case 'needs-improvement': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Optimization</h1>
          <p className="text-muted-foreground">
            Optimize your website for speed, performance, and user experience
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={loadPerformanceData}
            disabled={isLoading}
            variant="outline"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            onClick={handleAutomatedOptimization}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            <Zap className="h-4 w-4 mr-2" />
            Auto Optimize
          </Button>
        </div>
      </div>

      {/* Performance Score */}
      {recommendations && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Performance Score</h3>
                <p className="text-sm text-muted-foreground">
                  Overall website performance rating
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">
                  {recommendations.score}/100
                </div>
                <Badge
                  className={cn(
                    "text-lg px-3 py-1",
                    recommendations.grade === 'A' && "bg-green-100 text-green-800",
                    recommendations.grade === 'B' && "bg-blue-100 text-blue-800",
                    recommendations.grade === 'C' && "bg-yellow-100 text-yellow-800",
                    recommendations.grade === 'D' && "bg-orange-100 text-orange-800",
                    recommendations.grade === 'F' && "bg-red-100 text-red-800"
                  )}
                >
                  Grade {recommendations.grade}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="web-vitals">Web Vitals</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Core Web Vitals Overview */}
          {coreWebVitals && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Largest Contentful Paint</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{coreWebVitals.lcp.value}s</div>
                  <p className={cn("text-xs", getVitalsColor(coreWebVitals.lcp.rating))}>
                    {coreWebVitals.lcp.rating.replace('-', ' ')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">First Input Delay</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{coreWebVitals.fid.value}ms</div>
                  <p className={cn("text-xs", getVitalsColor(coreWebVitals.fid.rating))}>
                    {coreWebVitals.fid.rating.replace('-', ' ')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cumulative Layout Shift</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{coreWebVitals.cls.value}</div>
                  <p className={cn("text-xs", getVitalsColor(coreWebVitals.cls.rating))}>
                    {coreWebVitals.cls.rating.replace('-', ' ')}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recommendations */}
          {recommendations && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Recommendations</CardTitle>
                <CardDescription>
                  Actionable improvements to boost your website performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.recommendations.map((rec: any, index: number) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {rec.implemented ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">{rec.title}</h4>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Impact: +{rec.impact}%</span>
                        <span>Effort: {rec.effort}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Bundle Analysis */}
          {bundleAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle>Bundle Analysis</CardTitle>
                <CardDescription>
                  Breakdown of your website's JavaScript and CSS bundles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{formatBytes(bundleAnalysis.totalSize)}</div>
                    <p className="text-xs text-muted-foreground">Total Bundle Size</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formatBytes(bundleAnalysis.gzipSize)}</div>
                    <p className="text-xs text-muted-foreground">Gzip Compressed</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Bundle Breakdown</h4>
                  {bundleAnalysis.chunks.map((chunk: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm font-medium">{chunk.name}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatBytes(chunk.size)}</div>
                        <div className="text-xs text-muted-foreground">
                          {chunk.gzipSize ? formatBytes(chunk.gzipSize) + ' gzipped' : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {bundleAnalysis.recommendations && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Recommendations:</strong>
                      <ul className="mt-2 space-y-1">
                        {bundleAnalysis.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-xs">• {rec}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="web-vitals" className="space-y-6">
          {coreWebVitals && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Core Web Vitals Trend</CardTitle>
                  <CardDescription>
                    Performance metrics over the last 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">LCP (Largest Contentful Paint)</span>
                        <span className="text-sm text-muted-foreground">
                          Current: {coreWebVitals.lcp.value}s
                        </span>
                      </div>
                      <div className="h-32 bg-muted rounded flex items-end justify-between p-4">
                        {coreWebVitals.trend.lcp.map((value: number, index: number) => (
                          <div
                            key={index}
                            className="bg-blue-500 rounded w-6"
                            style={{
                              height: `${(value / Math.max(...coreWebVitals.trend.lcp)) * 100}%`,
                              minHeight: '4px'
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">FID (First Input Delay)</span>
                        <span className="text-sm text-muted-foreground">
                          Current: {coreWebVitals.fid.value}ms
                        </span>
                      </div>
                      <div className="h-32 bg-muted rounded flex items-end justify-between p-4">
                        {coreWebVitals.trend.fid.map((value: number, index: number) => (
                          <div
                            key={index}
                            className="bg-green-500 rounded w-6"
                            style={{
                              height: `${(value / Math.max(...coreWebVitals.trend.fid)) * 100}%`,
                              minHeight: '4px'
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">CLS (Cumulative Layout Shift)</span>
                        <span className="text-sm text-muted-foreground">
                          Current: {coreWebVitals.cls.value}
                        </span>
                      </div>
                      <div className="h-32 bg-muted rounded flex items-end justify-between p-4">
                        {coreWebVitals.trend.cls.map((value: number, index: number) => (
                          <div
                            key={index}
                            className="bg-yellow-500 rounded w-6"
                            style={{
                              height: `${(value / Math.max(...coreWebVitals.trend.cls)) * 100}%`,
                              minHeight: '4px'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          {/* Automated Optimization Results */}
          {optimizationResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Optimization Complete</span>
                </CardTitle>
                <CardDescription>
                  Performance improvements applied to your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      +{optimizationResults.improvements}%
                    </div>
                    <p className="text-sm text-muted-foreground">Performance Improvement</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {optimizationResults.beforeScore} → {optimizationResults.afterScore}
                    </div>
                    <p className="text-sm text-muted-foreground">Score Improvement</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Applied Optimizations</h4>
                  {optimizationResults.optimizations.map((opt: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Manual Optimization Tools */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resource Hints</CardTitle>
                <CardDescription>
                  Optimize resource loading with preload, prefetch, and DNS prefetch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Resource Hints
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lazy Loading</CardTitle>
                <CardDescription>
                  Implement lazy loading for images and other assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Enable Lazy Loading
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Critical CSS</CardTitle>
                <CardDescription>
                  Extract and inline critical CSS for faster rendering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <Code className="h-4 w-4 mr-2" />
                  Generate Critical CSS
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Monitoring</CardTitle>
                <CardDescription>
                  Set up continuous performance monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  Setup Monitoring
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Image Optimization</CardTitle>
              <CardDescription>
                Convert images to modern formats and generate responsive variants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="image-upload">Upload Image</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                  className="mt-1"
                />
              </div>

              {selectedImage && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded">
                    <p className="text-sm font-medium">{selectedImage.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Size: {formatBytes(selectedImage.size)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handleImageOptimization}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      {isLoading ? 'Optimizing...' : 'Optimize Image'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Minification</CardTitle>
              <CardDescription>
                Compress JavaScript and CSS to reduce file sizes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="code-input">Code to Minify</Label>
                <textarea
                  id="code-input"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  placeholder="Paste your JavaScript or CSS code here..."
                  className="w-full h-32 p-3 border rounded-md font-mono text-sm resize-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleCodeMinification('javascript')}
                  disabled={isLoading || !codeInput.trim()}
                  variant="outline"
                  className="flex-1"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Minify JavaScript
                </Button>
                <Button
                  onClick={() => handleCodeMinification('css')}
                  disabled={isLoading || !codeInput.trim()}
                  variant="outline"
                  className="flex-1"
                >
                  <Code className="h-4 w-4 mr-2" />
                  Minify CSS
                </Button>
              </div>

              {minificationResult && (
                <div className="p-4 bg-muted rounded space-y-2">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Original:</span>
                      <span className="ml-2">{formatBytes(minificationResult.originalSize)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Minified:</span>
                      <span className="ml-2">{formatBytes(minificationResult.minifiedSize)}</span>
                    </div>
                    <div>
                      <span className="font-medium">Savings:</span>
                      <span className="ml-2 text-green-600">{minificationResult.compressionRatio}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Minified Code</Label>
                    <textarea
                      value={minificationResult.code}
                      readOnly
                      className="w-full h-24 p-2 border rounded font-mono text-xs bg-white resize-none"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
