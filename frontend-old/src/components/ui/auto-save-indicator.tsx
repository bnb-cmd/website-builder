import React from 'react'
import { SaveState } from '@/hooks/use-auto-save'
import { cn } from '@/lib/utils'
import { CheckCircle, AlertCircle, Loader2, Clock, Wifi, WifiOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface AutoSaveIndicatorProps {
  saveState: SaveState
  className?: string
  showLastSaved?: boolean
  showUnsavedBadge?: boolean
  compact?: boolean
}

export function AutoSaveIndicator({
  saveState,
  className,
  showLastSaved = true,
  showUnsavedBadge = true,
  compact = false
}: AutoSaveIndicatorProps) {
  const { status, lastSaved, error, hasUnsavedChanges, autoSaveEnabled } = saveState

  const getStatusIcon = () => {
    switch (status) {
      case 'saving':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'saved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return autoSaveEnabled ?
          <Wifi className="h-4 w-4 text-muted-foreground" /> :
          <WifiOff className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'saving':
        return 'Saving...'
      case 'saved':
        return 'All changes saved'
      case 'error':
        return 'Save failed'
      default:
        return autoSaveEnabled ? 'Auto-save enabled' : 'Auto-save disabled'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'saving':
        return 'text-blue-600'
      case 'saved':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return autoSaveEnabled ? 'text-muted-foreground' : 'text-orange-600'
    }
  }

  const formatLastSaved = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("flex items-center space-x-2", className)}>
              {getStatusIcon()}
              {hasUnsavedChanges && showUnsavedBadge && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  Unsaved
                </Badge>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-sm">
              <div className={cn("font-medium", getStatusColor())}>
                {getStatusText()}
              </div>
              {error && (
                <div className="text-red-500 text-xs mt-1">{error}</div>
              )}
              {lastSaved && showLastSaved && (
                <div className="text-muted-foreground text-xs mt-1">
                  Last saved: {formatLastSaved(lastSaved)}
                </div>
              )}
              {!autoSaveEnabled && (
                <div className="text-orange-600 text-xs mt-1">
                  Auto-save is disabled
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className={cn("flex items-center space-x-3 px-3 py-2 rounded-md border bg-card", className)}>
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <span className={cn("text-sm font-medium", getStatusColor())}>
          {getStatusText()}
        </span>
      </div>

      {hasUnsavedChanges && showUnsavedBadge && (
        <Badge variant="secondary" className="text-xs">
          Unsaved changes
        </Badge>
      )}

      {error && (
        <div className="text-red-500 text-xs max-w-xs truncate">
          {error}
        </div>
      )}

      {lastSaved && showLastSaved && (
        <div className="text-muted-foreground text-xs flex items-center space-x-1">
          <Clock className="h-3 w-3" />
          <span>Last saved {formatLastSaved(lastSaved)}</span>
        </div>
      )}

      {!autoSaveEnabled && (
        <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
          Auto-save off
        </Badge>
      )}
    </div>
  )
}
