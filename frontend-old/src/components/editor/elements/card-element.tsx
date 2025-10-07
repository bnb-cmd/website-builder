import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function CardElement({ element, onUpdate, viewMode, style, children }: CardElementProps) {
  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'outlined':
        return 'border border-border'
      case 'filled':
        return 'bg-muted'
      case 'elevated':
        return 'shadow-lg'
      case 'flat':
      default:
        return 'shadow-sm'
    }
  }

  const getPaddingClass = () => {
    const padding = element.props.padding || 'medium'
    switch (padding) {
      case 'none':
        return 'p-0'
      case 'small':
        return 'p-3'
      case 'medium':
        return 'p-6'
      case 'large':
        return 'p-8'
      default:
        return 'p-6'
    }
  }

  const getRoundedClass = () => {
    const rounded = element.props.rounded || 'medium'
    switch (rounded) {
      case 'none':
        return 'rounded-none'
      case 'small':
        return 'rounded-sm'
      case 'medium':
        return 'rounded-md'
      case 'large':
        return 'rounded-lg'
      case 'xl':
        return 'rounded-xl'
      case 'full':
        return 'rounded-full'
      default:
        return 'rounded-md'
    }
  }

  const getHeaderContent = () => {
    if (!element.props.title && !element.props.subtitle) return null
    
    return (
      <div className="card-header mb-4">
        {element.props.title && (
          <h3 className="text-lg font-semibold text-foreground">
            {element.props.title}
          </h3>
        )}
        {element.props.subtitle && (
          <p className="text-sm text-muted-foreground mt-1">
            {element.props.subtitle}
          </p>
        )}
      </div>
    )
  }

  const getFooterContent = () => {
    if (!element.props.footer) return null
    
    return (
      <div className="card-footer mt-4 pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          {element.props.footer}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'card w-full bg-card text-card-foreground',
        getVariantClass(),
        getPaddingClass(),
        getRoundedClass(),
        element.props.hoverable ? 'hover:shadow-md transition-shadow' : ''
      )}
      style={style}
    >
      {getHeaderContent()}
      
      <div className="card-content">
        {children}
        {!children && (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
            <p>Drop elements here to create card content</p>
            <p className="text-xs mt-2">
              Variant: {element.props.variant || 'flat'} | 
              Padding: {element.props.padding || 'medium'}
            </p>
          </div>
        )}
      </div>
      
      {getFooterContent()}
    </div>
  )
}
