'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign,
  AlertTriangle,
  Lightbulb,
  Target,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'
import { apiHelpers } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  bounceRate: number
  avgSessionDuration: number
  conversionRate: number
  revenue: number
  orders: number
  avgOrderValue: number
  organicTraffic: number
  socialTraffic: number
  directTraffic: number
  referralTraffic: number
  mobileTraffic: number
  desktopTraffic: number
  tabletTraffic: number
  topCountries: Record<string, number>
  topCities: Record<string, number>
  pageLoadTime: number
  coreWebVitals: {
    lcp: number
    fid: number
    cls: number
  }
}

interface PredictiveInsights {
  predictedRevenue: number
  predictedTraffic: number
  recommendedActions: string[]
  riskFactors: string[]
  opportunities: string[]
}

interface BIDashboardProps {
  websiteId: string
}

export function BIDashboard({ websiteId }: BIDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([])
  const [insights, setInsights] = useState<PredictiveInsights | null>(null)
  const [period, setPeriod] = useState('DAILY')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
    fetchInsights()
  }, [websiteId, period])

  const fetchAnalytics = async () => {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30) // Last 30 days

      const response = await apiHelpers.getAnalytics(websiteId, {
        period,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
      setAnalytics(response.data.data || [])
    } catch (error) {
      toast.error('Failed to fetch analytics data')
    }
  }

  const fetchInsights = async () => {
    try {
      const response = await apiHelpers.getAnalyticsInsights(websiteId)
      setInsights(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch insights')
    }
  }

  const latestData = analytics[analytics.length - 1]
  const previousData = analytics[analytics.length - 2]

  const calculateChange = (current: number, previous: number) => {
    if (!previous) return 0
    return ((current - previous) / previous) * 100
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-PK').format(num)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Business Intelligence Dashboard</h1>
          <p className="text-muted-foreground">AI-powered insights and analytics</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HOURLY">Hourly</SelectItem>
            <SelectItem value="DAILY">Daily</SelectItem>
            <SelectItem value="WEEKLY">Weekly</SelectItem>
            <SelectItem value="MONTHLY">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(latestData?.pageViews || 0)}</div>
            {previousData && (
              <p className="text-xs text-muted-foreground">
                <span className={calculateChange(latestData?.pageViews || 0, previousData.pageViews) >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {calculateChange(latestData?.pageViews || 0, previousData.pageViews) >= 0 ? '+' : ''}
                  {calculateChange(latestData?.pageViews || 0, previousData.pageViews).toFixed(1)}%
                </span>
                {' '}from last period
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(latestData?.revenue || 0)}</div>
            {previousData && (
              <p className="text-xs text-muted-foreground">
                <span className={calculateChange(latestData?.revenue || 0, previousData.revenue) >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {calculateChange(latestData?.revenue || 0, previousData.revenue) >= 0 ? '+' : ''}
                  {calculateChange(latestData?.revenue || 0, previousData.revenue).toFixed(1)}%
                </span>
                {' '}from last period
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(latestData?.conversionRate || 0).toFixed(2)}%</div>
            <Progress value={(latestData?.conversionRate || 0) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(latestData?.avgOrderValue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              {latestData?.orders || 0} orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Insights */}
      {insights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              AI Predictive Insights
            </CardTitle>
            <CardDescription>AI-powered recommendations and predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Predictions</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Predicted Revenue:</span>
                    <span className="font-medium">{formatCurrency(insights.predictedRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Predicted Traffic:</span>
                    <span className="font-medium">{formatNumber(insights.predictedTraffic)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Recommended Actions</h4>
                <div className="space-y-1">
                  {insights.recommendedActions.map((action, index) => (
                    <Badge key={index} variant="secondary" className="mr-1 mb-1">
                      {action}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="font-semibold mb-2 text-red-600 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Risk Factors
                </h4>
                <div className="space-y-1">
                  {insights.riskFactors.map((risk, index) => (
                    <Badge key={index} variant="destructive" className="mr-1 mb-1">
                      {risk}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Opportunities
                </h4>
                <div className="space-y-1">
                  {insights.opportunities.map((opportunity, index) => (
                    <Badge key={index} variant="outline" className="mr-1 mb-1 border-green-600 text-green-600">
                      {opportunity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Traffic Sources & Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Organic</span>
                <span className="font-medium">{formatNumber(latestData?.organicTraffic || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Social</span>
                <span className="font-medium">{formatNumber(latestData?.socialTraffic || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Direct</span>
                <span className="font-medium">{formatNumber(latestData?.directTraffic || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Referral</span>
                <span className="font-medium">{formatNumber(latestData?.referralTraffic || 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </span>
                <span className="font-medium">{formatNumber(latestData?.mobileTraffic || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Desktop
                </span>
                <span className="font-medium">{formatNumber(latestData?.desktopTraffic || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Tablet className="h-4 w-4" />
                  Tablet
                </span>
                <span className="font-medium">{formatNumber(latestData?.tabletTraffic || 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
