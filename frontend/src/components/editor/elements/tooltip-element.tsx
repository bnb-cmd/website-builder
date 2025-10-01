import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TooltipElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function TooltipElement({ element, onUpdate, viewMode, style, children }: TooltipElementProps) {
  const handleTooltipChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newContent = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        tooltip: newContent
      }
    })
  }

  const getPlacementClass = () => {
    switch (element.props.placement) {
      case 'top':
        return 'tooltip-top'
      case 'bottom':
        return 'tooltip-bottom'
      case 'left':
        return 'tooltip-left'
      case 'right':
        return 'tooltip-right'
      default:
        return 'tooltip-top'
    }
  }

  return (
    <div
      className={cn(
        'relative inline-block',
        getPlacementClass()
      )}
      style={style}
      data-tooltip={element.props.tooltip || 'Tooltip content'}
    >
      {children}
      {!children && (
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center text-muted-foreground">
          <p>Drop elements here for tooltip trigger</p>
          <div
            className="text-xs mt-2 p-2 bg-muted rounded"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTooltipChange}
          >
            {element.props.tooltip || 'Edit tooltip content'}
          </div>
        </div>
      )}
    </div>
  )
}
