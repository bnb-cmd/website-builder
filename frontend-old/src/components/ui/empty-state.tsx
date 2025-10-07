'use client'

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  illustration?: ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  illustration,
  className
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      {/* Illustration or Icon */}
      <div className="relative mb-6">
        {illustration ? (
          illustration
        ) : Icon ? (
          <div className="relative">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-2xl animate-pulse" />
            
            {/* Icon Container */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl flex items-center justify-center border border-primary/20 shadow-lg">
              <Icon className="w-12 h-12 text-primary" strokeWidth={1.5} />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full animate-bounce" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary/30 rounded-full animate-bounce delay-100" />
          </div>
        ) : null}
      </div>

      {/* Content */}
      <div className="max-w-md space-y-3">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          {action && (
            <Button
              onClick={action.onClick}
              size="lg"
              className="shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {action.icon && <action.icon className="h-4 w-4 mr-2" />}
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              size="lg"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Preset Empty States
export function NoDataEmptyState({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      title="No data available"
      description="There's nothing to show here yet. Start by adding some data."
      action={onAction ? {
        label: "Get Started",
        onClick: onAction
      } : undefined}
    />
  )
}

export function NoResultsEmptyState({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      title="No results found"
      description="We couldn't find anything matching your search. Try adjusting your filters."
      action={onReset ? {
        label: "Clear Filters",
        onClick: onReset
      } : undefined}
    />
  )
}
