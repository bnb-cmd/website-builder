import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function SectionElement({ element, onUpdate, viewMode, style, children }: SectionElementProps) {
  const getBackgroundClass = () => {
    switch (element.props.background) {
      case 'primary':
        return 'bg-primary text-primary-foreground'
      case 'secondary':
        return 'bg-secondary text-secondary-foreground'
      case 'muted':
        return 'bg-muted text-muted-foreground'
      case 'accent':
        return 'bg-accent text-accent-foreground'
      case 'transparent':
        return 'bg-transparent'
      default:
        return 'bg-background'
    }
  }

  const getPaddingClass = () => {
    const padding = element.props.padding || 'medium'
    switch (padding) {
      case 'none':
        return 'p-0'
      case 'small':
        return 'p-4'
      case 'medium':
        return 'p-8'
      case 'large':
        return 'p-16'
      case 'xl':
        return 'p-24'
      default:
        return 'p-8'
    }
  }

  const getMaxWidthClass = () => {
    const maxWidth = element.props.maxWidth || 'full'
    switch (maxWidth) {
      case 'sm':
        return 'max-w-sm mx-auto'
      case 'md':
        return 'max-w-md mx-auto'
      case 'lg':
        return 'max-w-lg mx-auto'
      case 'xl':
        return 'max-w-xl mx-auto'
      case '2xl':
        return 'max-w-2xl mx-auto'
      case '4xl':
        return 'max-w-4xl mx-auto'
      case '6xl':
        return 'max-w-6xl mx-auto'
      case 'full':
      default:
        return 'w-full'
    }
  }

  return (
    <section
      className={cn(
        'w-full',
        getBackgroundClass(),
        getPaddingClass(),
        getMaxWidthClass(),
        element.props.fullWidth ? 'w-screen -mx-4' : '',
        element.props.rounded ? 'rounded-lg' : ''
      )}
      style={style}
    >
      {children}
      {!children && (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
          <p>Drop elements here to create a section</p>
          <p className="text-xs mt-2">
            Background: {element.props.background || 'default'} | 
            Padding: {element.props.padding || 'medium'} |
            Max Width: {element.props.maxWidth || 'full'}
          </p>
        </div>
      )}
    </section>
  )
}
