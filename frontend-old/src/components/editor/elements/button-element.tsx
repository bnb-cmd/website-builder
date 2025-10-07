import { Element, ViewMode } from '@/types/editor'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ButtonElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function ButtonElement({ element, onUpdate, viewMode, style }: ButtonElementProps) {
  const getVariantClass = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-primary-foreground hover:bg-primary/90'
      case 'secondary':
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
      case 'outline':
        return 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
      case 'ghost':
        return 'hover:bg-accent hover:text-accent-foreground'
      default:
        return 'bg-primary text-primary-foreground hover:bg-primary/90'
    }
  }

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'sm':
        return 'h-9 px-3 text-sm'
      case 'lg':
        return 'h-11 px-8'
      case 'icon':
        return 'h-10 w-10'
      default:
        return 'h-10 px-4 py-2'
    }
  }

  return (
    <button
      style={style}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        getVariantClass(element.props.variant || 'primary'),
        getSizeClass(element.props.size || 'default')
      )}
      onClick={(e) => {
        e.preventDefault()
        if (element.props.href) {
          console.log('Would navigate to:', element.props.href)
        }
      }}
    >
      {element.props.text || 'Button'}
    </button>
  )
}
