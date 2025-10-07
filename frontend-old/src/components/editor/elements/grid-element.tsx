import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GridElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function GridElement({ element, onUpdate, viewMode, style, children }: GridElementProps) {
  const getGridTemplateColumns = () => {
    const columns = element.props.columns || 3
    const gap = element.props.gap || '16px'
    
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: gap,
      ...style
    }
  }

  const getResponsiveColumns = () => {
    const responsive = element.props.responsive || {}
    const baseColumns = element.props.columns || 3
    
    return {
      desktop: responsive.desktop?.columns || baseColumns,
      tablet: responsive.tablet?.columns || Math.min(baseColumns, 2),
      mobile: responsive.mobile?.columns || 1
    }
  }

  const responsiveColumns = getResponsiveColumns()

  return (
    <div
      className={cn(
        'grid w-full min-h-[100px]',
        // Desktop columns
        `grid-cols-${responsiveColumns.desktop}`,
        // Tablet columns
        `md:grid-cols-${responsiveColumns.tablet}`,
        // Mobile columns
        `sm:grid-cols-${responsiveColumns.mobile}`
      )}
      style={getGridTemplateColumns()}
    >
      {children}
      {!children && (
        <div className="col-span-full border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
          <p>Drop elements here to create a grid layout</p>
          <p className="text-xs mt-2">Current: {responsiveColumns.desktop} columns</p>
        </div>
      )}
    </div>
  )
}
