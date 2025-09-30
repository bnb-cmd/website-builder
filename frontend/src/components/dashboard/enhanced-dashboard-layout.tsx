'use client'

import React from 'react'
import { WebsiteCard, QuickActionCard, ProgressCard, AISuggestionCard } from './enhanced-dashboard-cards'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Globe, 
  Sparkles, 
  Zap, 
  Target, 
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
  Eye,
  Settings,
  Palette,
  Brain,
  ArrowRight,
  CheckCircle2,
  Clock
} from 'lucide-react'

interface EnhancedDashboardProps {
  user: {
    id: string
    name: string
    email: string
  }
  websites: any[]
  stats: {
    totalWebsites: number
    publishedWebsites: number
    totalVisitors: number
    conversionRate: number
  }
  onCreateWebsite: () => void
  onEditWebsite: (id: string) => void
  onPreviewWebsite: (id: string) => void
  onAnalyticsWebsite: (id: string) => void
}

export function EnhancedDashboard({ 
  user, 
  websites, 
  stats, 
  onCreateWebsite, 
  onEditWebsite, 
  onPreviewWebsite, 
  onAnalyticsWebsite 
}: EnhancedDashboardProps) {
  const quickActions = [
    {
      title: "AI Website Builder",
      description: "Create a website with AI assistance",
      icon: Brain,
      onClick: onCreateWebsite,
      gradient: "from-purple-500 to-pink-600",
      badge: "New"
    },
    {
      title: "Template Gallery",
      description: "Browse professional templates",
      icon: Palette,
      onClick: () => console.log("Templates"),
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "Analytics Dashboard",
      description: "View detailed website analytics",
      icon: BarChart3,
      onClick: () => console.log("Analytics"),
      gradient: "from-green-500 to-emerald-600"
    },
    {
      title: "AI Marketing Tools",
      description: "Optimize your marketing strategy",
      icon: Target,
      onClick: () => console.log("Marketing"),
      gradient: "from-orange-500 to-red-600"
    }
  ]

  const aiSuggestions = [
    {
      title: "Optimize Mobile Experience",
      description: "Your website could benefit from mobile-first design improvements",
      priority: "high" as const,
      estimatedTime: "15 min",
      onApply: () => console.log("Apply mobile optimization"),
      onDismiss: () => console.log("Dismiss suggestion")
    },
    {
      title: "Add Contact Form",
      description: "Increase lead generation with a contact form",
      priority: "medium" as const,
      estimatedTime: "5 min",
      onApply: () => console.log("Add contact form"),
      onDismiss: () => console.log("Dismiss suggestion")
    },
    {
      title: "Improve SEO",
      description: "Enhance your website's search engine visibility",
      priority: "low" as const,
      estimatedTime: "30 min",
      onApply: () => console.log("Improve SEO"),
      onDismiss: () => console.log("Dismiss suggestion")
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-gray-600">Ready to create something amazing?</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                <Sparkles className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                onClick={onCreateWebsite}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Website
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Websites</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalWebsites}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.publishedWebsites}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalVisitors.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              <p className="text-gray-600">Get started with these powerful tools</p>
            </div>
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={index}
                title={action.title}
                description={action.description}
                icon={action.icon}
                onClick={action.onClick}
                gradient={action.gradient}
                badge={action.badge}
              />
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI Suggestions</h2>
              <p className="text-gray-600">Personalized recommendations for your websites</p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiSuggestions.map((suggestion, index) => (
              <AISuggestionCard
                key={index}
                title={suggestion.title}
                description={suggestion.description}
                priority={suggestion.priority}
                estimatedTime={suggestion.estimatedTime}
                onApply={suggestion.onApply}
                onDismiss={suggestion.onDismiss}
              />
            ))}
          </div>
        </div>

        {/* Recent Websites */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Websites</h2>
              <p className="text-gray-600">Your latest website projects</p>
            </div>
            <Button variant="outline" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.slice(0, 6).map((website) => (
              <WebsiteCard
                key={website.id}
                website={website}
                onEdit={onEditWebsite}
                onPreview={onPreviewWebsite}
                onAnalytics={onAnalyticsWebsite}
              />
            ))}
          </div>
        </div>

        {/* Progress Tracking */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Your Progress</h2>
              <p className="text-gray-600">Track your website building journey</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProgressCard
              title="Website Completion"
              description="Complete your website setup"
              progress={stats.publishedWebsites}
              total={stats.totalWebsites}
              icon={Globe}
              color="blue"
            />
            <ProgressCard
              title="SEO Optimization"
              description="Improve your search rankings"
              progress={2}
              total={5}
              icon={Target}
              color="green"
            />
            <ProgressCard
              title="Marketing Setup"
              description="Configure marketing tools"
              progress={1}
              total={3}
              icon={BarChart3}
              color="purple"
            />
          </div>
        </div>
      </div>
    </div>
  )
}