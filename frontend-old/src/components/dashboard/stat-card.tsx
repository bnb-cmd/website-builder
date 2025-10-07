'use client'

import { ReactNode } from 'react'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
  loading?: boolean
}

const colorClasses = {
  blue: {
    bg: 'from-blue-500/10 to-blue-600/5',
    icon: 'bg-blue-500/10 text-blue-600',
    trend: 'text-blue-600',
    border: 'border-blue-500/20'
  },
  green: {
    bg: 'from-green-500/10 to-green-600/5',
    icon: 'bg-green-500/10 text-green-600',
    trend: 'text-green-600',
    border: 'border-green-500/20'
  },
  purple: {
    bg: 'from-purple-500/10 to-purple-600/5',
    icon: 'bg-purple-500/10 text-purple-600',
    trend: 'text-purple-600',
    border: 'border-purple-500/20'
  },
  orange: {
    bg: 'from-orange-500/10 to-orange-600/5',
    icon: 'bg-orange-500/10 text-orange-600',
    trend: 'text-orange-600',
    border: 'border-orange-500/20'
  },
  red: {
    bg: 'from-red-500/10 to-red-600/5',
    icon: 'bg-red-500/10 text-red-600',
    trend: 'text-red-600',
    border: 'border-red-500/20'
  }
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  trend = 'neutral',
  color = 'blue',
  loading = false
}: StatCardProps) {
  const colors = colorClasses[color]

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-10 w-10 bg-muted rounded-lg" />
          </div>
          <div className="h-8 bg-muted rounded w-32" />
          <div className="h-3 bg-muted rounded w-20" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group relative bg-gradient-to-br',
        colors.bg,
        'border rounded-xl p-6 shadow-sm',
        colors.border,
        'hover:shadow-lg hover:-translate-y-1',
        'transition-all duration-300 ease-out',
        'overflow-hidden'
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)]" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={cn('p-2.5 rounded-lg transition-transform duration-300 group-hover:scale-110', colors.icon)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        {/* Value */}
        <div className="mb-2">
          <h3 className="text-3xl font-bold text-foreground tracking-tight">
            {value}
          </h3>
        </div>

        {/* Trend */}
        {change !== undefined && (
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full',
                trend === 'up' && 'bg-green-500/10 text-green-600',
                trend === 'down' && 'bg-red-500/10 text-red-600',
                trend === 'neutral' && 'bg-muted text-muted-foreground'
              )}
            >
              {trend === 'up' && <TrendingUp className="h-3 w-3" />}
              {trend === 'down' && <TrendingDown className="h-3 w-3" />}
              <span>{change > 0 ? '+' : ''}{change}%</span>
            </div>
            {changeLabel && (
              <span className="text-xs text-muted-foreground">{changeLabel}</span>
            )}
          </div>
        )}
      </div>

      {/* Hover Glow Effect */}
      <div className={cn(
        'absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500',
        color === 'blue' && 'bg-blue-500',
        color === 'green' && 'bg-green-500',
        color === 'purple' && 'bg-purple-500',
        color === 'orange' && 'bg-orange-500',
        color === 'red' && 'bg-red-500'
      )} />
    </div>
  )
}

// Grid Container for Stat Cards
export function StatCardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {children}
    </div>
  )
}
