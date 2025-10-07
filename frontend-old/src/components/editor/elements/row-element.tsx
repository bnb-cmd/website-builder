import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface RowElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function RowElement({ element, onUpdate, viewMode, style, children }: RowElementProps) {
  const getJustifyClass = () => {
    switch (element.props.justify) {
      case 'start':
        return 'justify-start'
      case 'center':
        return 'justify-center'
      case 'end':
        return 'justify-end'
      case 'between':
        return 'justify-between'
      case 'around':
        return 'justify-around'
      case 'evenly':
        return 'justify-evenly'
      default:
        return 'justify-start'
    }
  }

  const getAlignClass = () => {
    switch (element.props.align) {
      case 'start':
        return 'items-start'
      case 'center':
        return 'items-center'
      case 'end':
        return 'items-end'
      case 'stretch':
        return 'items-stretch'
      case 'baseline':
        return 'items-baseline'
      default:
        return 'items-stretch'
    }
  }

  const getGapClass = () => {
    const gap = element.props.gap || '16px'
    if (gap === '0px') return 'gap-0'
    if (gap === '4px') return 'gap-1'
    if (gap === '8px') return 'gap-2'
    if (gap === '12px') return 'gap-3'
    if (gap === '16px') return 'gap-4'
    if (gap === '20px') return 'gap-5'
    if (gap === '24px') return 'gap-6'
    if (gap === '32px') return 'gap-8'
    return 'gap-4'
  }

  const getWrapClass = () => {
    switch (element.props.wrap) {
      case 'nowrap':
        return 'flex-nowrap'
      case 'wrap':
        return 'flex-wrap'
      case 'wrap-reverse':
        return 'flex-wrap-reverse'
      default:
        return 'flex-wrap'
    }
  }

  return (
    <div
      className={cn(
        'flex w-full min-h-[60px]',
        getJustifyClass(),
        getAlignClass(),
        getGapClass(),
        getWrapClass(),
        element.props.reverse ? 'flex-row-reverse' : 'flex-row'
      )}
      style={style}
    >
      {children}
      {!children && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground flex-1">
          <p>Drop elements here to create a row layout</p>
          <p className="text-xs mt-2">
            Justify: {element.props.justify || 'start'} | 
            Align: {element.props.align || 'stretch'} |
            Gap: {element.props.gap || '16px'}
          </p>
        </div>
      )}
    </div>
  )
}
