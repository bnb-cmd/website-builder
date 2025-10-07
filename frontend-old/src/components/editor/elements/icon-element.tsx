import { Element, ViewMode } from '@/types/editor'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface IconElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function IconElement({ element, onUpdate, viewMode, style }: IconElementProps) {
  const handleIconChange = (iconName: string) => {
    onUpdate(element.id, {
      props: {
        ...element.props,
        icon: iconName
      }
    })
  }

  const getSizeClass = () => {
    switch (element.props.size) {
      case 'xs':
        return 'h-3 w-3'
      case 'sm':
        return 'h-4 w-4'
      case 'md':
        return 'h-5 w-5'
      case 'lg':
        return 'h-6 w-6'
      case 'xl':
        return 'h-8 w-8'
      case '2xl':
        return 'h-12 w-12'
      default:
        return 'h-5 w-5'
    }
  }

  const getColorClass = () => {
    switch (element.props.color) {
      case 'primary':
        return 'text-primary'
      case 'secondary':
        return 'text-secondary-foreground'
      case 'accent':
        return 'text-accent-foreground'
      case 'muted':
        return 'text-muted-foreground'
      case 'destructive':
        return 'text-destructive'
      case 'success':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'info':
        return 'text-blue-600'
      default:
        return 'text-foreground'
    }
  }

  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'outlined':
        return 'border border-current'
      case 'filled':
        return 'bg-current text-background'
      case 'soft':
        return 'bg-current/10 text-current'
      default:
        return ''
    }
  }

  const getRoundedClass = () => {
    switch (element.props.rounded) {
      case 'none':
        return 'rounded-none'
      case 'sm':
        return 'rounded-sm'
      case 'md':
        return 'rounded-md'
      case 'lg':
        return 'rounded-lg'
      case 'full':
        return 'rounded-full'
      default:
        return 'rounded-md'
    }
  }

  const iconName = element.props.icon || 'Star'
  const IconComponent = LucideIcon as any // This would need proper icon mapping

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center',
        getSizeClass(),
        getColorClass(),
        getVariantClass(),
        getRoundedClass(),
        element.props.clickable ? 'cursor-pointer hover:scale-110 transition-transform' : ''
      )}
      style={style}
      onClick={(e) => {
        if (element.props.clickable) {
          e.stopPropagation()
          // Handle click action
        }
      }}
    >
      {/* Icon Placeholder - In real implementation, you'd map icon names to actual icons */}
      <div className="w-full h-full flex items-center justify-center bg-muted rounded">
        <span className="text-xs font-mono">{iconName}</span>
      </div>
    </div>
  )
}
