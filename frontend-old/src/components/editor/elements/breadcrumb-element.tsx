import { Element, ViewMode } from '@/types/editor'
import { cn } from '@/lib/utils'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function BreadcrumbElement({ element, onUpdate, viewMode, style }: BreadcrumbElementProps) {
  const handleItemsChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newItems = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        items: newItems.split(',').map(item => item.trim())
      }
    })
  }

  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'default':
        return 'text-muted-foreground'
      case 'primary':
        return 'text-primary'
      case 'secondary':
        return 'text-secondary-foreground'
      default:
        return 'text-muted-foreground'
    }
  }

  const getSeparatorClass = () => {
    switch (element.props.separator) {
      case 'slash':
        return '/'
      case 'arrow':
        return '→'
      case 'chevron':
        return <ChevronRight className="h-4 w-4" />
      case 'pipe':
        return '|'
      default:
        return <ChevronRight className="h-4 w-4" />
    }
  }

  const getSizeClass = () => {
    switch (element.props.size) {
      case 'sm':
        return 'text-sm'
      case 'lg':
        return 'text-lg'
      case 'md':
      default:
        return 'text-base'
    }
  }

  const items = element.props.items || ['Home', 'Category', 'Current Page']

  return (
    <nav
      className={cn(
        'flex items-center space-x-2',
        getVariantClass(),
        getSizeClass()
      )}
      style={style}
      aria-label="Breadcrumb"
    >
      {/* Home Icon */}
      {element.props.showHome && (
        <>
          <a href="#" className="hover:text-primary transition-colors">
            <Home className="h-4 w-4" />
          </a>
          <span className="mx-2">{getSeparatorClass()}</span>
        </>
      )}

      {/* Breadcrumb Items */}
      {items.map((item: string, index: number) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <span className="mx-2">{getSeparatorClass()}</span>
          )}
          
          {index === items.length - 1 ? (
            // Current page (not clickable)
            <span className="font-medium text-foreground">
              {item}
            </span>
          ) : (
            // Previous pages (clickable)
            <a
              href="#"
              className="hover:text-primary transition-colors"
            >
              {item}
            </a>
          )}
        </div>
      ))}

      {/* Editable Content */}
      <div
        className="ml-4 text-xs text-muted-foreground border-l pl-4"
        contentEditable
        suppressContentEditableWarning
        onBlur={handleItemsChange}
      >
        {items.join(', ')}
      </div>
    </nav>
  )
}
