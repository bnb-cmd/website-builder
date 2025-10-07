import { Element, ViewMode } from '@/types/editor'
import { cn } from '@/lib/utils'

interface BadgeElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function BadgeElement({ element, onUpdate, viewMode, style }: BadgeElementProps) {
  const handleContentChange = (e: React.FocusEvent<HTMLSpanElement>) => {
    const newContent = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        content: newContent
      }
    })
  }

  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'default':
        return 'bg-primary text-primary-foreground'
      case 'secondary':
        return 'bg-secondary text-secondary-foreground'
      case 'destructive':
        return 'bg-destructive text-destructive-foreground'
      case 'outline':
        return 'border border-input bg-background text-foreground'
      case 'success':
        return 'bg-green-500 text-white'
      case 'warning':
        return 'bg-yellow-500 text-white'
      case 'info':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-primary text-primary-foreground'
    }
  }

  const getSizeClass = () => {
    switch (element.props.size) {
      case 'sm':
        return 'text-xs px-2 py-1'
      case 'lg':
        return 'text-sm px-4 py-2'
      case 'xl':
        return 'text-base px-6 py-3'
      case 'md':
      default:
        return 'text-sm px-2.5 py-0.5'
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
        return 'rounded-full'
    }
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium transition-colors',
        getVariantClass(),
        getSizeClass(),
        getRoundedClass(),
        element.props.clickable ? 'cursor-pointer hover:opacity-80' : ''
      )}
      style={style}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleContentChange}
      onClick={(e) => {
        if (element.props.clickable) {
          e.stopPropagation()
          // Handle click action
        }
      }}
    >
      {element.props.content || 'Badge'}
    </span>
  )
}
