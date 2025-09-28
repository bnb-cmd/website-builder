'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Palette, Zap, FileText, Users, BarChart3 } from 'lucide-react'

export function QuickActions() {
  const actions = [
    {
      title: 'New Website',
      description: 'Start from scratch or use a template',
      icon: Plus,
      href: '/dashboard/websites/new',
    color: 'bg-blue-900'
    },
    {
      title: 'Browse Templates',
      description: 'Find the perfect design',
      icon: Palette,
      href: '/dashboard/templates',
      color: 'bg-purple-500'
    },
    {
      title: 'AI Assistant',
      description: 'Generate content with AI',
      icon: Zap,
      href: '/dashboard/ai',
      color: 'bg-green-500'
    },
    {
      title: 'Help Center',
      description: 'Get help and tutorials',
      icon: FileText,
      href: '/help',
      color: 'bg-orange-500'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{action.title}</h4>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
