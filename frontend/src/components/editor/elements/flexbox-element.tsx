import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FlexboxElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function FlexboxElement({ element, onUpdate, viewMode, style, children }: FlexboxElementProps) {
  const getFlexDirection = () => {
    switch (element.props.direction) {
      case 'row':
        return 'flex-row'
      case 'row-reverse':
        return 'flex-row-reverse'
      case 'column':
        return 'flex-col'
      case 'column-reverse':
        return 'flex-col-reverse'
      default:
        return 'flex-row'
    }
  }

  const getJustifyContent = () => {
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

  const getAlignItems = () => {
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

  const getFlexWrap = () => {
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

  const getGap = () => {
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

  return (
    <div
      className={cn(
        'flex w-full min-h-[60px]',
        getFlexDirection(),
        getJustifyContent(),
        getAlignItems(),
        getFlexWrap(),
        getGap()
      )}
      style={style}
    >
      {children}
      {!children && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground flex-1">
          <p>Drop elements here to create a flexbox layout</p>
          <p className="text-xs mt-2">
            Direction: {element.props.direction || 'row'} | 
            Justify: {element.props.justify || 'start'} | 
            Align: {element.props.align || 'stretch'}
          </p>
        </div>
      )}
    </div>
  )
}
