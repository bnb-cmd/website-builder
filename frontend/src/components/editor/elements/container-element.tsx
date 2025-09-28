import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContainerElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function ContainerElement({ element, onUpdate, viewMode, style, children }: ContainerElementProps) {
  const getLayoutClass = () => {
    switch (element.props.layout) {
      case 'horizontal':
        return 'flex flex-row'
      case 'vertical':
        return 'flex flex-col'
      case 'grid':
        return 'grid'
      default:
        return 'flex flex-col'
    }
  }

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
      default:
        return ''
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
      default:
        return ''
    }
  }

  const getGapClass = () => {
    const gap = element.props.gap || '10px'
    // Convert px values to Tailwind classes
    if (gap === '0px') return 'gap-0'
    if (gap === '4px') return 'gap-1'
    if (gap === '8px') return 'gap-2'
    if (gap === '12px') return 'gap-3'
    if (gap === '16px') return 'gap-4'
    if (gap === '20px') return 'gap-5'
    if (gap === '24px') return 'gap-6'
    if (gap === '32px') return 'gap-8'
    return 'gap-4' // default
  }

  return (
    <div
      style={style}
      className={cn(
        getLayoutClass(),
        getJustifyClass(),
        getAlignClass(),
        getGapClass(),
        'min-h-[60px] w-full'
      )}
    >
      {children}
      {!children && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
          <p>Drop elements here</p>
        </div>
      )}
    </div>
  )
}
