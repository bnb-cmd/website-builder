'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, Users, TrendingUp, Eye } from 'lucide-react'

interface DashboardStatsProps {
  stats: {
    totalWebsites: number
    publishedWebsites: number
    totalVisitors: number
    conversionRate: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Websites',
      value: stats.totalWebsites,
      description: `${stats.publishedWebsites} published`,
      icon: Globe,
      trend: '+12%'
    },
    {
      title: 'Published Sites',
      value: stats.publishedWebsites,
      description: 'Live websites',
      icon: Eye,
      trend: '+8%'
    },
    {
      title: 'Total Visitors',
      value: stats.totalVisitors.toLocaleString(),
      description: 'This month',
      icon: Users,
      trend: '+23%'
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      description: 'Average across sites',
      icon: TrendingUp,
      trend: '+0.5%'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
            <div className="flex items-center mt-2">
              <span className="text-xs text-green-600 font-medium">
                {stat.trend}
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                from last month
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
