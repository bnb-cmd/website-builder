import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ColumnsElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function ColumnsElement({ element, onUpdate, viewMode, style, children }: ColumnsElementProps) {
  const getColumnsClass = () => {
    const columns = element.props.columns || 2
    const responsive = element.props.responsive || {}
    
    return {
      desktop: `grid-cols-${columns}`,
      tablet: `md:grid-cols-${responsive.tablet || Math.min(columns, 2)}`,
      mobile: `sm:grid-cols-${responsive.mobile || 1}`
    }
  }

  const getGapClass = () => {
    const gap = element.props.gap || 'medium'
    switch (gap) {
      case 'none':
        return 'gap-0'
      case 'small':
        return 'gap-2'
      case 'medium':
        return 'gap-4'
      case 'large':
        return 'gap-8'
      case 'xl':
        return 'gap-12'
      default:
        return 'gap-4'
    }
  }

  const getColumnWidths = () => {
    const widths = element.props.columnWidths || []
    if (widths.length === 0) return {}
    
    return {
      gridTemplateColumns: widths.map(width => `${width}fr`).join(' ')
    }
  }

  const columnsClass = getColumnsClass()
  const columnWidths = getColumnWidths()

  return (
    <div
      className={cn(
        'grid w-full min-h-[100px]',
        columnsClass.desktop,
        columnsClass.tablet,
        columnsClass.mobile,
        getGapClass()
      )}
      style={{
        ...style,
        ...columnWidths
      }}
    >
      {children}
      {!children && (
        <div className="col-span-full border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
          <p>Drop elements here to create columns</p>
          <p className="text-xs mt-2">
            Columns: {element.props.columns || 2} | 
            Gap: {element.props.gap || 'medium'}
          </p>
        </div>
      )}
    </div>
  )
}
