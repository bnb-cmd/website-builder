'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts'
import { 
  Users, 
  Eye, 
  MousePointer, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Activity,
  Target,
  DollarSign,
  ShoppingCart,
  Map,
  BarChart3,
  PieChartIcon
} from 'lucide-react'

interface AnalyticsDashboardProps {
  websiteId: string
}

export function AnalyticsDashboard({ websiteId }: AnalyticsDashboardProps) {
  const [dateRange, setDateRange] = useState('7d')
  const [isLoading, setIsLoading] = useState(false)

  // Sample data - in real app, this would come from API
  const visitorData = [
    { date: 'Mon', visitors: 120, pageViews: 450 },
    { date: 'Tue', visitors: 132, pageViews: 520 },
    { date: 'Wed', visitors: 101, pageViews: 380 },
    { date: 'Thu', visitors: 134, pageViews: 490 },
    { date: 'Fri', visitors: 90, pageViews: 340 },
    { date: 'Sat', visitors: 230, pageViews: 890 },
    { date: 'Sun', visitors: 210, pageViews: 780 }
  ]

  const deviceData = [
    { name: 'Desktop', value: 45, color: '#3b82f6' },
    { name: 'Mobile', value: 38, color: '#10b981' },
    { name: 'Tablet', value: 17, color: '#f59e0b' }
  ]

  const topPages = [
    { page: '/home', views: 2341, avgTime: '2:45' },
    { page: '/products', views: 1832, avgTime: '3:12' },
    { page: '/about', views: 923, avgTime: '1:23' },
    { page: '/contact', views: 512, avgTime: '4:05' },
    { page: '/blog', views: 389, avgTime: '5:32' }
  ]

  const trafficSources = [
    { source: 'Direct', visits: 3421, percentage: 35 },
    { source: 'Google', visits: 2834, percentage: 29 },
    { source: 'Social Media', visits: 1753, percentage: 18 },
    { source: 'Referral', visits: 982, percentage: 10 },
    { source: 'Email', visits: 784, percentage: 8 }
  ]

  const locationData = [
    { country: 'Pakistan', city: 'Karachi', visitors: 2341 },
    { country: 'Pakistan', city: 'Lahore', visitors: 1923 },
    { country: 'Pakistan', city: 'Islamabad', visitors: 1234 },
    { country: 'Pakistan', city: 'Faisalabad', visitors: 892 },
    { country: 'Pakistan', city: 'Rawalpindi', visitors: 673 }
  ]

  const conversionData = [
    { name: 'Visitors', value: 10234 },
    { name: 'Leads', value: 892 },
    { name: 'Customers', value: 234 },
    { name: 'Revenue', value: 485000 }
  ]

  const metrics = {
    totalVisitors: 10234,
    totalPageViews: 34521,
    avgSessionDuration: '3:24',
    bounceRate: 42.3,
    conversionRate: 2.3,
    revenue: 485000
  }

  const refreshData = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your website performance and visitor insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+12.5%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalPageViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+8.3%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgSessionDuration}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+5.2%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.bounceRate}%</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              <span className="text-red-500">-3.1%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+1.2%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">PKR {(metrics.revenue / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+23.8%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Visitors & Page Views Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Visitors & Page Views</CardTitle>
                <CardDescription>Daily traffic over the last week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={visitorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="visitors" 
                      stackId="1"
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="pageViews" 
                      stackId="1"
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>Visitor devices distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {deviceData.map((device) => (
                    <div key={device.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: device.color }}
                      />
                      <span className="text-sm">{device.name} ({device.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages on your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{page.page}</p>
                        <p className="text-sm text-muted-foreground">Avg. time: {page.avgTime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{page.views.toLocaleString()} views</p>
                      <Progress value={(page.views / topPages[0].views) * 100} className="h-2 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors come from</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={trafficSources}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visits" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Geographic Location */}
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Top locations of your visitors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locationData.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Map className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{location.city}</p>
                          <p className="text-sm text-muted-foreground">{location.country}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {location.visitors.toLocaleString()} visitors
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Flow</CardTitle>
              <CardDescription>How users navigate through your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center border-2 border-dashed border-muted-foreground/50 rounded-lg">
                <div className="text-center">
                  <Activity className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    User flow visualization coming soon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Track user journey from visitor to customer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {conversionData.map((stage, index) => (
                  <div key={stage.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{stage.name}</span>
                      <span className="text-muted-foreground">
                        {stage.name === 'Revenue' 
                          ? `PKR ${stage.value.toLocaleString()}`
                          : stage.value.toLocaleString()
                        }
                      </span>
                    </div>
                    <Progress 
                      value={stage.name === 'Revenue' ? 100 : (stage.value / conversionData[0].value) * 100} 
                      className="h-3"
                    />
                    {index < conversionData.length - 2 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {((conversionData[index + 1].value / stage.value) * 100).toFixed(1)}% conversion rate
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Real-time Visitors
              </CardTitle>
              <CardDescription>Active users on your website right now</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-6xl font-bold">23</div>
                <p className="text-muted-foreground mt-2">Active users</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <Monitor className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-2xl font-semibold">15</p>
                  <p className="text-sm text-muted-foreground">Desktop</p>
                </div>
                <div className="text-center">
                  <Smartphone className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-2xl font-semibold">6</p>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                </div>
                <div className="text-center">
                  <Tablet className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-2xl font-semibold">2</p>
                  <p className="text-sm text-muted-foreground">Tablet</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
