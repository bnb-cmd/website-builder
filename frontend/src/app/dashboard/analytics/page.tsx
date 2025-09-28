'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Globe,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
  MousePointer,
  Target,
  ShoppingCart,
  Download
} from 'lucide-react'

// Demo analytics data
const analyticsData = {
  overview: {
    totalVisitors: 24567,
    totalPageViews: 89234,
    avgSessionDuration: '3m 24s',
    bounceRate: 42.3,
    conversionRate: 3.8,
    totalRevenue: 125000
  },
  timeRange: {
    visitors: [
      { date: '2024-09-21', visitors: 1234, pageViews: 4567 },
      { date: '2024-09-22', visitors: 1456, pageViews: 5123 },
      { date: '2024-09-23', visitors: 1123, pageViews: 3890 },
      { date: '2024-09-24', visitors: 1789, pageViews: 6234 },
      { date: '2024-09-25', visitors: 2011, pageViews: 7456 },
      { date: '2024-09-26', visitors: 1678, pageViews: 5789 },
      { date: '2024-09-27', visitors: 1890, pageViews: 6123 }
    ]
  },
  topPages: [
    { page: '/', views: 15678, bounceRate: 35.2, avgTime: '2m 45s' },
    { page: '/products', views: 12345, bounceRate: 28.7, avgTime: '4m 12s' },
    { page: '/about', views: 8901, bounceRate: 52.1, avgTime: '1m 56s' },
    { page: '/contact', views: 6789, bounceRate: 23.4, avgTime: '3m 33s' },
    { page: '/blog', views: 5432, bounceRate: 41.8, avgTime: '5m 21s' }
  ],
  referrers: [
    { source: 'Google Search', visitors: 12456, percentage: 50.7 },
    { source: 'Direct', visitors: 6123, percentage: 24.9 },
    { source: 'Facebook', visitors: 2890, percentage: 11.8 },
    { source: 'Instagram', visitors: 1567, percentage: 6.4 },
    { source: 'Email', visitors: 1531, percentage: 6.2 }
  ],
  devices: [
    { device: 'Desktop', visitors: 14567, percentage: 59.3 },
    { device: 'Mobile', visitors: 8901, percentage: 36.2 },
    { device: 'Tablet', visitors: 1099, percentage: 4.5 }
  ],
  locations: [
    { country: 'Pakistan', city: 'Karachi', visitors: 8901, percentage: 36.2 },
    { country: 'Pakistan', city: 'Lahore', visitors: 6234, percentage: 25.4 },
    { country: 'Pakistan', city: 'Islamabad', visitors: 3456, percentage: 14.1 },
    { country: 'UAE', city: 'Dubai', visitors: 2345, percentage: 9.5 },
    { country: 'USA', city: 'New York', visitors: 1890, percentage: 7.7 }
  ]
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedWebsite, setSelectedWebsite] = useState('all')

  const getGrowthPercentage = (current: number, previous: number) => {
    const growth = ((current - previous) / previous) * 100
    return growth.toFixed(1)
  }

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'desktop':
        return <Monitor className="h-4 w-4" />
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'tablet':
        return <Tablet className="h-4 w-4" />
      default:
        return <Globe className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your website performance and visitor insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedWebsite} onValueChange={setSelectedWebsite}>
            <SelectTrigger className="w-48">
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Websites</SelectItem>
              <SelectItem value="website-1">My Restaurant</SelectItem>
              <SelectItem value="website-2">Tech Solutions</SelectItem>
              <SelectItem value="website-3">Fashion Store</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Today</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalVisitors.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{getGrowthPercentage(analyticsData.overview.totalVisitors, 21000)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalPageViews.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{getGrowthPercentage(analyticsData.overview.totalPageViews, 76000)}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.avgSessionDuration}</div>
            <div className="flex items-center text-xs text-red-600">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              -2.3% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.conversionRate}%</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +0.8% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="acquisition">Acquisition</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Visitor Trend Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Visitor Trends</CardTitle>
              <CardDescription>
                Daily visitors and page views for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                  <p>Chart visualization would be here</p>
                  <p className="text-sm">Showing visitor trends over {timeRange}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Real-time Activity</CardTitle>
                <CardDescription>Current active users on your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active Users</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-lg font-bold">24</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Page Views (last hour)</span>
                  <span className="text-lg font-bold">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Top Active Page</span>
                  <span className="text-sm">/products</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Key metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Bounce Rate</span>
                  <Badge variant={analyticsData.overview.bounceRate < 40 ? 'default' : 'secondary'}>
                    {analyticsData.overview.bounceRate}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">New vs Returning</span>
                  <span className="text-sm">68% / 32%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Revenue</span>
                  <span className="text-lg font-bold text-green-600">
                    PKR {analyticsData.overview.totalRevenue.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Top Pages Tab */}
        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Pages</CardTitle>
              <CardDescription>
                Most visited pages and their performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">{page.page}</div>
                        <div className="text-sm text-muted-foreground">
                          {page.views.toLocaleString()} views
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{page.bounceRate}%</div>
                        <div className="text-muted-foreground">Bounce Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{page.avgTime}</div>
                        <div className="text-muted-foreground">Avg. Time</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
                <CardDescription>Visitor breakdown by device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.devices.map((device, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getDeviceIcon(device.device)}
                      <span className="font-medium">{device.device}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {device.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Geographic Data */}
            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
                <CardDescription>Visitors by geographic location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.locations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{location.city}</div>
                        <div className="text-sm text-muted-foreground">{location.country}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm">{location.visitors.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {location.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Acquisition Tab */}
        <TabsContent value="acquisition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>
                How visitors are finding your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsData.referrers.map((referrer, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{referrer.source}</div>
                      <div className="text-sm text-muted-foreground">
                        {referrer.visitors.toLocaleString()} visitors
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${referrer.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      {referrer.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavior Tab */}
        <TabsContent value="behavior" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Flow</CardTitle>
                <CardDescription>Common user journeys on your site</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MousePointer className="h-8 w-8 mx-auto mb-2" />
                    <p>User flow visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Site Search</CardTitle>
                <CardDescription>What visitors are searching for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">product reviews</span>
                    <span className="text-sm text-muted-foreground">234 searches</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">contact information</span>
                    <span className="text-sm text-muted-foreground">189 searches</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">pricing</span>
                    <span className="text-sm text-muted-foreground">156 searches</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">delivery</span>
                    <span className="text-sm text-muted-foreground">134 searches</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
