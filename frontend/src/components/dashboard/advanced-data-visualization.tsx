'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MousePointer,
  Globe,
  Smartphone,
  Monitor,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }[]
}

interface AnalyticsData {
  overview: {
    totalVisitors: number
    totalPageViews: number
    bounceRate: number
    avgSessionDuration: string
    conversionRate: number
    newVisitors: number
    returningVisitors: number
  }
  traffic: {
    daily: ChartData
    weekly: ChartData
    monthly: ChartData
  }
  devices: {
    desktop: number
    mobile: number
    tablet: number
  }
  sources: {
    direct: number
    search: number
    social: number
    referral: number
  }
  topPages: Array<{
    page: string
    views: number
    bounceRate: number
  }>
  countries: Array<{
    country: string
    visitors: number
    percentage: number
  }>
}

interface AdvancedDataVisualizationProps {
  compact?: boolean
  websiteId?: string
}

export function AdvancedDataVisualization({ compact = false, websiteId }: AdvancedDataVisualizationProps) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadAnalyticsData()
  }, [websiteId, timeRange])

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true)
      
      // Mock data for demonstration
      const mockData: AnalyticsData = {
        overview: {
          totalVisitors: 1234,
          totalPageViews: 5678,
          bounceRate: 34.5,
          avgSessionDuration: '2m 34s',
          conversionRate: 3.2,
          newVisitors: 856,
          returningVisitors: 378
        },
        traffic: {
          daily: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
              {
                label: 'Visitors',
                data: [120, 150, 180, 200, 190, 160, 140],
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 1)'
              },
              {
                label: 'Page Views',
                data: [450, 520, 680, 750, 720, 580, 490],
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: 'rgba(16, 185, 129, 1)'
              }
            ]
          },
          weekly: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
              {
                label: 'Visitors',
                data: [800, 950, 1100, 1234],
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 1)'
              }
            ]
          },
          monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
              {
                label: 'Visitors',
                data: [3200, 3800, 4200, 4500, 4800, 5200],
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 1)'
              }
            ]
          }
        },
        devices: {
          desktop: 45,
          mobile: 40,
          tablet: 15
        },
        sources: {
          direct: 35,
          search: 40,
          social: 15,
          referral: 10
        },
        topPages: [
          { page: '/', views: 1200, bounceRate: 25 },
          { page: '/about', views: 800, bounceRate: 30 },
          { page: '/products', views: 600, bounceRate: 45 },
          { page: '/contact', views: 400, bounceRate: 20 },
          { page: '/blog', views: 300, bounceRate: 60 }
        ],
        countries: [
          { country: 'Pakistan', visitors: 800, percentage: 65 },
          { country: 'India', visitors: 200, percentage: 16 },
          { country: 'USA', visitors: 100, percentage: 8 },
          { country: 'UK', visitors: 80, percentage: 6 },
          { country: 'Canada', visitors: 54, percentage: 4 }
        ]
      }

      setData(mockData)
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTrendIcon = (value: number, threshold: number = 0) => {
    if (value > threshold) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (value < threshold) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <TrendingUp className="h-4 w-4 text-gray-500" />
  }

  const getTrendColor = (value: number, threshold: number = 0) => {
    if (value > threshold) return 'text-green-600'
    if (value < threshold) return 'text-red-600'
    return 'text-gray-600'
  }

  const renderSimpleChart = (data: ChartData, height: string = 'h-64') => {
    const maxValue = Math.max(...data.datasets[0].data)
    
    return (
      <div className={`${height} flex items-end justify-between space-x-2 p-4`}>
        {data.datasets[0].data.map((value, index) => {
          const heightPercentage = (value / maxValue) * 100
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="bg-blue-500 rounded-t w-full transition-all duration-500 hover:bg-blue-600"
                style={{ height: `${heightPercentage}%` }}
                title={`${data.labels[index]}: ${value}`}
              />
              <span className="text-xs text-muted-foreground mt-2 text-center">
                {data.labels[index]}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  const renderDonutChart = (data: Record<string, number>, colors: Record<string, string>) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0)
    let cumulativePercentage = 0

    return (
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          {Object.entries(data).map(([key, value], index) => {
            const percentage = (value / total) * 100
            const circumference = 2 * Math.PI * 40 // radius = 40
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
            const strokeDashoffset = -((cumulativePercentage / 100) * circumference)
            
            cumulativePercentage += percentage
            
            return (
              <circle
                key={key}
                cx="50%"
                cy="50%"
                r="40"
                fill="none"
                stroke={colors[key] || '#e5e7eb'}
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold">{total}</span>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <Card className={compact ? 'p-4' : ''}>
        <CardContent className={compact ? 'p-0' : ''}>
          <div className="space-y-4">
            <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
            <div className="h-64 bg-muted animate-pulse rounded" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className={compact ? 'p-4' : ''}>
        <CardContent className={compact ? 'p-0' : ''}>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No analytics data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (compact) {
    return (
      <Card className="p-4">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-base flex items-center justify-between">
            <span>Analytics Overview</span>
            <Badge variant="secondary">{timeRange}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{data.overview.totalVisitors}</div>
              <div className="text-xs text-gray-600">Visitors</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{data.overview.totalPageViews}</div>
              <div className="text-xs text-gray-600">Page Views</div>
            </div>
          </div>
          {renderSimpleChart(data.traffic.daily, 'h-32')}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6" />
            <span>Analytics Dashboard</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={loadAnalyticsData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Visitors</p>
                      <p className="text-2xl font-bold">{data.overview.totalVisitors.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(12)}
                    <span className={`text-sm ml-1 ${getTrendColor(12)}`}>+12%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Page Views</p>
                      <p className="text-2xl font-bold">{data.overview.totalPageViews.toLocaleString()}</p>
                    </div>
                    <Eye className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(8)}
                    <span className={`text-sm ml-1 ${getTrendColor(8)}`}>+8%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Bounce Rate</p>
                      <p className="text-2xl font-bold">{data.overview.bounceRate}%</p>
                    </div>
                    <MousePointer className="h-8 w-8 text-orange-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(-5, 0)}
                    <span className={`text-sm ml-1 ${getTrendColor(-5, 0)}`}>-5%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      <p className="text-2xl font-bold">{data.overview.conversionRate}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="flex items-center mt-2">
                    {getTrendIcon(2)}
                    <span className={`text-sm ml-1 ${getTrendColor(2)}`}>+2%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Traffic Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {renderSimpleChart(data.traffic.daily)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Traffic Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderDonutChart(data.sources, {
                    direct: '#3b82f6',
                    search: '#10b981',
                    social: '#f59e0b',
                    referral: '#ef4444'
                  })}
                  <div className="mt-4 space-y-2">
                    {Object.entries(data.sources).map(([source, value]) => (
                      <div key={source} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{source}</span>
                        <span className="text-sm font-medium">{value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Device Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Device Types</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderDonutChart(data.devices, {
                    desktop: '#3b82f6',
                    mobile: '#10b981',
                    tablet: '#f59e0b'
                  })}
                  <div className="mt-4 space-y-2">
                    {Object.entries(data.devices).map(([device, value]) => (
                      <div key={device} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {device === 'desktop' && <Monitor className="h-4 w-4" />}
                          {device === 'mobile' && <Smartphone className="h-4 w-4" />}
                          {device === 'tablet' && <Monitor className="h-4 w-4" />}
                          <span className="text-sm capitalize">{device}</span>
                        </div>
                        <span className="text-sm font-medium">{value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.countries.map((country, index) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium w-6">{index + 1}</span>
                        <span className="text-sm">{country.country}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${country.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {country.visitors}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.topPages.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium w-6">{index + 1}</span>
                        <span className="text-sm">{page.page}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-muted-foreground">
                          {page.bounceRate}% bounce
                        </span>
                        <span className="text-sm font-medium">
                          {page.views.toLocaleString()} views
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}