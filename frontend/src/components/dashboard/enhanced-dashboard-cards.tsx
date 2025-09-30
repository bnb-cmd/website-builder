'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Globe, 
  Eye, 
  Users, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  Clock,
  CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface WebsiteCardProps {
  website: {
    id: string
    name: string
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    updatedAt: string
    visitors?: number
    conversionRate?: number
    thumbnail?: string
  }
  onEdit: (id: string) => void
  onPreview: (id: string) => void
  onAnalytics: (id: string) => void
}

export function WebsiteCard({ website, onEdit, onPreview, onAnalytics }: WebsiteCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'bg-green-100 text-green-800 border-green-200'
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'ARCHIVED': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {website.name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              Updated {new Date(website.updatedAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge className={cn("text-xs font-medium", getStatusColor(website.status))}>
            {website.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Thumbnail Preview */}
        <div className="relative mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-32">
          {website.thumbnail ? (
            <img 
              src={website.thumbnail} 
              alt={website.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Globe className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Eye className="w-4 h-4 text-blue-600 mr-1" />
              <span className="text-sm font-medium text-blue-900">
                {website.visitors || 0}
              </span>
            </div>
            <p className="text-xs text-blue-700">Visitors</p>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm font-medium text-green-900">
                {website.conversionRate || 0}%
              </span>
            </div>
            <p className="text-xs text-green-700">Conversion</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
            onClick={() => onEdit(website.id)}
          >
            <Zap className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
            onClick={() => onPreview(website.id)}
          >
            <Eye className="w-3 h-3 mr-1" />
            Preview
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700"
            onClick={() => onAnalytics(website.id)}
          >
            <BarChart3 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface QuickActionCardProps {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  onClick: () => void
  gradient?: string
  badge?: string
}

export function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  gradient = "from-blue-500 to-purple-600",
  badge 
}: QuickActionCardProps) {
  return (
    <Card 
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm hover:bg-white/80 hover:scale-105"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
            gradient
          )}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {title}
              </CardTitle>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            <CardDescription className="text-sm text-gray-600">
              {description}
            </CardDescription>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </div>
      </CardContent>
    </Card>
  )
}

interface ProgressCardProps {
  title: string
  description: string
  progress: number
  total: number
  icon: React.ComponentType<{ className?: string }>
  color?: 'blue' | 'green' | 'purple' | 'orange'
}

export function ProgressCard({ 
  title, 
  description, 
  progress, 
  total, 
  icon: Icon,
  color = 'blue' 
}: ProgressCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100'
  }

  const progressColor = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  }

  return (
    <Card className="border-0 bg-white/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorClasses[color])}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {description}
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {progress}/{total}
            </div>
            <div className="text-sm text-gray-500">
              {Math.round((progress / total) * 100)}%
            </div>
          </div>
        </div>
        <Progress 
          value={(progress / total) * 100} 
          className="h-2"
        />
      </CardContent>
    </Card>
  )
}

interface AISuggestionCardProps {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  estimatedTime: string
  onApply: () => void
  onDismiss: () => void
}

export function AISuggestionCard({ 
  title, 
  description, 
  priority, 
  estimatedTime, 
  onApply, 
  onDismiss 
}: AISuggestionCardProps) {
  const priorityColors = {
    high: 'border-l-red-500 bg-red-50/50',
    medium: 'border-l-yellow-500 bg-yellow-50/50',
    low: 'border-l-green-500 bg-green-50/50'
  }

  return (
    <Card className={cn("border-l-4 transition-all duration-300 hover:shadow-lg", priorityColors[priority])}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-base font-semibold text-gray-900">
              {title}
            </CardTitle>
          </div>
          <Badge variant={priority === 'high' ? 'destructive' : priority === 'medium' ? 'default' : 'secondary'}>
            {priority}
          </Badge>
        </div>
        
        <CardDescription className="text-sm text-gray-600 mb-4">
          {description}
        </CardDescription>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{estimatedTime}</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onDismiss}>
              Dismiss
            </Button>
            <Button size="sm" onClick={onApply}>
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}