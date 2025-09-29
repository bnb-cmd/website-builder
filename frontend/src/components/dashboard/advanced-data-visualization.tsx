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
  Users,
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  ChevronDown,
  ChevronRight,
  Download,
  Share,
  Filter
} from 'lucide-react'
import { SmartSkeleton } from '@/components/ui/smart-skeleton'

interface DataPoint {
  date: string
  value: number
  label: string
  category?: string
}

interface ChartData {
  visitors: DataPoint[]
  pageViews: DataPoint[]
  bounceRate: DataPoint[]
  conversionRate: DataPoint[]
  devices: { name: string; value: number; color: string }[]
  topPages: { path: string; views: number; change: number }[]
  topSources: { source: string; visitors: number; percentage: number }[]
  realtime: { timestamp: string; visitors: number }[]
}

interface AdvancedDataVisualizationProps {
  websiteId?: string
  compact?: boolean
}

const timeRanges = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' }
]

const chartTypes = [
  { value: 'line', label: 'Line Chart' },
  { value: 'bar', label: 'Bar Chart' },
  { value: 'area', label: 'Area Chart' },
  { value: 'pie', label: 'Pie Chart' }
]

export function AdvancedDataVisualization({ websiteId, compact = false }: AdvancedDataVisualizationProps) {
  const [data, setData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d')
  const [selectedChartType, setSelectedChartType] = useState('line')
  const [drillDownLevel, setDrillDownLevel] = useState<'overview' | 'page' | 'source'>('overview')
  const [selectedDrillDown, setSelectedDrillDown] = useState<string | null>(null)

  useEffect(() => {
    loadAnalyticsData()
  }, [selectedTimeRange, websiteId])

  const loadAnalyticsData = async () => {
    setLoading(true)
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000))

      const mockData: ChartData = {
        visitors: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: Math.floor(Math.random() * 500) + 100,
          label: `Day ${i + 1}`
        })),
        pageViews: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: Math.floor(Math.random() * 1000) + 200,
          label: `Day ${i + 1}`
        })),
        bounceRate: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: Math.floor(Math.random() * 30) + 20,
          label: `Day ${i + 1}`
        })),
        conversionRate: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: Math.floor(Math.random() * 10) + 1,
          label: `Day ${i + 1}`
        })),
        devices: [
          { name: 'Desktop', value: 45, color: '#3b82f6' },
          { name: 'Mobile', value: 35, color: '#10b981' },
          { name: 'Tablet', value: 20, color: '#f59e0b' }
        ],
        topPages: [
          { path: '/home', views: 1250, change: 12 },
          { path: '/products', views: 890, change: -5 },
          { path: '/about', views: 650, change: 8 },
          { path: '/contact', views: 420, change: 15 },
          { path: '/blog', views: 380, change: -2 }
        ],
        topSources: [
          { source: 'Google', visitors: 450, percentage: 35 },
          { source: 'Direct', visitors: 320, percentage: 25 },
          { source: 'Facebook', visitors: 180, percentage: 14 },
          { source: 'Twitter', visitors: 120, percentage: 9 },
          { source: 'Other', visitors: 155, percentage: 12 }
        ],
        realtime: Array.from({ length: 60 }, (_, i) => ({
          timestamp: new Date(Date.now() - (59 - i) * 60 * 1000).toISOString(),
          visitors: Math.floor(Math.random() * 20) + 1
        }))
      }

      setData(mockData)
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDrillDown = (type: 'page' | 'source', value: string) => {
    setDrillDownLevel(type === 'page' ? 'page' : 'source')
    setSelectedDrillDown(value)
  }

  const handleDrillUp = () => {
    setDrillDownLevel('overview')
    setSelectedDrillDown(null)
  }

  const exportData = (format: 'csv' | 'pdf' | 'png') => {
    // Mock export functionality
    console.log(`Exporting data as ${format}`)
  }

  const renderChart = (chartData: DataPoint[], type: string) => {
    const maxValue = Math.max(...chartData.map(d => d.value))
    const minValue = Math.min(...chartData.map(d => d.value))

    return (
      <div className="h-64 bg-muted/30 rounded-lg p-4 flex items-end justify-between space-x-2">
        {chartData.slice(-14).map((point, index) => {
          const height = ((point.value - minValue) / (maxValue - minValue)) * 100
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={`w-full bg-primary rounded-t transition-all duration-300 hover:bg-primary/80 cursor-pointer ${
                  type === 'bar' ? 'rounded-b' : ''
                }`}
                style={{ height: `${Math.max(height, 5)}%` }}
                onClick={() => console.log('Drill down to:', point.date)}
              />
              <span className="text-xs text-muted-foreground mt-2 transform -rotate-45 origin-top-left">
                {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  const renderPieChart = (pieData: { name: string; value: number; color: string }[]) => {
    const total = pieData.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = -90 // Start from top

    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {pieData.map((item, index) => {
              const percentage = item.value / total
              const angle = percentage * 360
              const startAngle = currentAngle
              const endAngle = currentAngle + angle

              const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
              const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
              const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180)
              const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180)

              const largeArcFlag = angle > 180 ? 1 : 0

              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ')

              currentAngle = endAngle

              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => console.log('Selected:', item.name)}
                />
              )
            })}
          </svg>
        </div>
        <div className="ml-6 space-y-2">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium">{item.name}</span>
              <Badge variant="secondary">{item.value}%</Badge>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return <SmartSkeleton type="chart" />
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No data available</h3>
            <p className="text-muted-foreground">Unable to load analytics data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <span>Analytics Overview</span>
            <Badge variant="secondary">{selectedTimeRange}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {data.visitors.slice(-1)[0]?.value || 0}
                </div>
                <div className="text-xs text-muted-foreground">Visitors Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {data.pageViews.slice(-1)[0]?.value || 0}
                </div>
                <div className="text-xs text-muted-foreground">Page Views</div>
              </div>
            </div>
            {renderChart(data.visitors.slice(-7), 'bar')}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedChartType} onValueChange={setSelectedChartType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {chartTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => exportData('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      {drillDownLevel !== 'overview' && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" onClick={handleDrillUp}>
            Overview
          </Button>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">
            {drillDownLevel === 'page' ? 'Page Details' : 'Source Details'}: {selectedDrillDown}
          </span>
        </div>
      )}

      {/* Main Analytics Dashboard */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Total Visitors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.visitors.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +12% from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Page Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.pageViews.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +8% from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Bounce Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(data.bounceRate.reduce((sum, item) => sum + item.value, 0) / data.bounceRate.length)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  -3% from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Conversion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(data.conversionRate.reduce((sum, item) => sum + item.value, 0) / data.conversionRate.length)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +2% from last period
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Visitors Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {renderChart(data.visitors, selectedChartType)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {renderPieChart(data.devices)}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.topPages.map((page, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => handleDrillDown('page', page.path)}
                    >
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <div>
                          <div className="font-medium">{page.path}</div>
                          <div className="text-sm text-muted-foreground">
                            {page.views.toLocaleString()} views
                          </div>
                        </div>
                      </div>
                      <Badge variant={page.change > 0 ? "default" : "secondary"}>
                        {page.change > 0 ? '+' : ''}{page.change}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.topSources.map((source, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => handleDrillDown('source', source.source)}
                    >
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <div>
                          <div className="font-medium">{source.source}</div>
                          <div className="text-sm text-muted-foreground">
                            {source.visitors.toLocaleString()} visitors
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {source.percentage}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Flow Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>User flow visualization coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Real-time Visitors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">
                    {data.realtime.slice(-1)[0]?.visitors || 0}
                  </div>
                  <p className="text-muted-foreground">Active visitors right now</p>
                </div>
                <div className="h-32 bg-muted/30 rounded-lg p-4 flex items-end justify-between space-x-1">
                  {data.realtime.slice(-20).map((point, index) => (
                    <div
                      key={index}
                      className="bg-primary rounded-t flex-1"
                      style={{ height: `${(point.visitors / 20) * 100}%` }}
                    />
                  ))}
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Last 20 minutes activity
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
