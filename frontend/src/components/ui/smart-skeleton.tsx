import { cn } from '@/lib/utils'

interface SmartSkeletonProps {
  type: 'template-grid' | 'dashboard-stats' | 'editor-canvas' | 'activity-feed' | 'form-fields' | 'table-rows' | 'chart'
  count?: number
  className?: string
}

export function SmartSkeleton({ type, count = 1, className }: SmartSkeletonProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'template-grid':
        return (
          <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="space-y-4">
                {/* Thumbnail */}
                <div className="aspect-video bg-muted animate-pulse rounded-lg" />

                {/* Content */}
                <div className="space-y-3">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                  <div className="flex space-x-2">
                    <div className="h-6 bg-muted animate-pulse rounded-full w-16" />
                    <div className="h-6 bg-muted animate-pulse rounded-full w-20" />
                  </div>
                  <div className="h-8 bg-muted animate-pulse rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )

      case 'dashboard-stats':
        return (
          <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-6 bg-card rounded-lg border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-muted animate-pulse rounded w-24" />
                  <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-muted animate-pulse rounded w-16" />
                  <div className="h-3 bg-muted animate-pulse rounded w-20" />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 bg-muted animate-pulse rounded w-8" />
                  <div className="h-3 bg-muted animate-pulse rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        )

      case 'editor-canvas':
        return (
          <div className={cn('space-y-6', className)}>
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex space-x-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-8 w-8 bg-muted animate-pulse rounded" />
                ))}
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              </div>
            </div>

            {/* Canvas */}
            <div className="min-h-96 bg-muted/30 rounded-lg p-8">
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="h-6 bg-muted animate-pulse rounded w-1/4" />
                    <div className="h-32 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>

            {/* Properties Panel */}
            <div className="w-80 space-y-4">
              <div className="h-6 bg-muted animate-pulse rounded w-1/2" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
                    <div className="h-8 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'activity-feed':
        return (
          <div className={cn('space-y-4', className)}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )

      case 'form-fields':
        return (
          <div className={cn('space-y-6', className)}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
                <div className="h-10 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        )

      case 'table-rows':
        return (
          <div className={cn('space-y-3', className)}>
            {/* Table Header */}
            <div className="flex space-x-4 p-3 bg-muted/50 rounded">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-muted animate-pulse rounded flex-1" />
              ))}
            </div>

            {/* Table Rows */}
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex space-x-4 p-3 border-b">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-4 bg-muted animate-pulse rounded flex-1" />
                ))}
              </div>
            ))}
          </div>
        )

      case 'chart':
        return (
          <div className={cn('space-y-4', className)}>
            {/* Chart Title */}
            <div className="h-6 bg-muted animate-pulse rounded w-1/3" />

            {/* Chart Area */}
            <div className="h-64 bg-muted/30 rounded-lg flex items-end justify-between p-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-muted animate-pulse rounded-t w-8"
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                />
              ))}
            </div>

            {/* Chart Legend */}
            <div className="flex justify-center space-x-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-muted animate-pulse rounded-full" />
                  <div className="h-3 bg-muted animate-pulse rounded w-16" />
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div className={cn('h-4 bg-muted animate-pulse rounded', className)} />
        )
    }
  }

  return renderSkeleton()
}
