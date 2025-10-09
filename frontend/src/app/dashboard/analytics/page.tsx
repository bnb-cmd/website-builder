"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  BarChart3,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

// Sample analytics data
const analyticsData = {
  overview: {
    totalVisitors: 1247,
    pageViews: 3892,
    bounceRate: 42.3,
    avgSessionDuration: '2m 34s',
    conversionRate: 3.2
  },
  traffic: [
    { source: 'Google', visitors: 456, percentage: 36.6 },
    { source: 'Direct', visitors: 312, percentage: 25.0 },
    { source: 'Social Media', visitors: 234, percentage: 18.8 },
    { source: 'Email', visitors: 156, percentage: 12.5 },
    { source: 'Referrals', visitors: 89, percentage: 7.1 }
  ],
  devices: [
    { type: 'Desktop', visitors: 623, percentage: 50.0 },
    { type: 'Mobile', visitors: 499, percentage: 40.0 },
    { type: 'Tablet', visitors: 125, percentage: 10.0 }
  ],
  topPages: [
    { page: '/', views: 1234, visitors: 892 },
    { page: '/about', views: 567, visitors: 445 },
    { page: '/contact', views: 234, visitors: 198 },
    { page: '/services', views: 189, visitors: 156 }
  ],
  recentActivity: [
    { time: '2 minutes ago', action: 'New visitor from Google', location: 'New York, US' },
    { time: '5 minutes ago', action: 'Page view on /about', location: 'London, UK' },
    { time: '8 minutes ago', action: 'Form submission', location: 'Toronto, CA' },
    { time: '12 minutes ago', action: 'New visitor from Facebook', location: 'Sydney, AU' }
  ]
};

function AnalyticsPageContent() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedWebsite, setSelectedWebsite] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const periods = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleExport = () => {
    // Export analytics data
    console.log('Exporting analytics data...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track your website performance and visitor insights
          </p>
        </div>
        
        <div className="flex gap-2">
          <select 
            value={selectedWebsite}
            onChange={(e) => setSelectedWebsite(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Websites</option>
            <option value="site1">My Portfolio</option>
            <option value="site2">Business Site</option>
          </select>
          
          <div className="flex border rounded-md">
            {periods.map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedPeriod(period.value)}
                className="rounded-none first:rounded-l-md last:rounded-r-md"
              >
                {period.label}
              </Button>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalVisitors.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.pageViews.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.bounceRate}%</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              +2.1% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.avgSessionDuration}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15s from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.conversionRate}%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.3% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.traffic.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <span className="font-medium">{source.source}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{source.visitors}</div>
                    <div className="text-sm text-muted-foreground">{source.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Types */}
        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
            <CardDescription>How visitors access your site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.devices.map((device) => (
                <div key={device.type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {device.type === 'Desktop' && <Monitor className="h-4 w-4 text-muted-foreground" />}
                    {device.type === 'Mobile' && <Smartphone className="h-4 w-4 text-muted-foreground" />}
                    {device.type === 'Tablet' && <Monitor className="h-4 w-4 text-muted-foreground" />}
                    <span className="font-medium">{device.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{device.visitors}</div>
                    <div className="text-sm text-muted-foreground">{device.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages on your site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.topPages.map((page, index) => (
                <div key={page.page} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span className="font-medium">{page.page}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{page.views} views</div>
                    <div className="text-sm text-muted-foreground">{page.visitors} visitors</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Live visitor activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{activity.action}</div>
                    <div className="text-xs text-muted-foreground">
                      {activity.time} • {activity.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <CardDescription>Visitor distribution by location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">United States</span>
                </div>
                <div className="text-sm font-semibold">45.2%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">United Kingdom</span>
                </div>
                <div className="text-sm font-semibold">18.7%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Canada</span>
                </div>
                <div className="text-sm font-semibold">12.3%</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Australia</span>
                </div>
                <div className="text-sm font-semibold">8.9%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Browser Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Browser Usage</CardTitle>
            <CardDescription>Most popular browsers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Chrome</span>
                <div className="text-sm font-semibold">67.4%</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Safari</span>
                <div className="text-sm font-semibold">18.2%</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Firefox</span>
                <div className="text-sm font-semibold">8.7%</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Edge</span>
                <div className="text-sm font-semibold">5.7%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
            <CardDescription>Site speed and optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Page Load Time</span>
                  <span className="text-sm text-green-600">1.2s</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Core Web Vitals</span>
                  <span className="text-sm text-green-600">Good</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">SEO Score</span>
                  <span className="text-sm text-green-600">94/100</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64">Loading analytics...</div>}>
      <AnalyticsPageContent />
    </Suspense>
  );
}
