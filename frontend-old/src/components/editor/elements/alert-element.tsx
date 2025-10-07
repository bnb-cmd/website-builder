import { Element, ViewMode } from '@/types/editor'
import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'

interface AlertElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function AlertElement({ element, onUpdate, viewMode, style }: AlertElementProps) {
  const handleContentChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newContent = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        content: newContent
      }
    })
  }

  const handleTitleChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newTitle = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        title: newTitle
      }
    })
  }

  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'default':
        return 'bg-background text-foreground border-border'
      case 'destructive':
        return 'bg-destructive text-destructive-foreground border-destructive'
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200'
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200'
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-200'
      default:
        return 'bg-background text-foreground border-border'
    }
  }

  const getIcon = () => {
    switch (element.props.variant) {
      case 'destructive':
        return <AlertCircle className="h-4 w-4" />
      case 'success':
        return <CheckCircle className="h-4 w-4" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />
      case 'info':
        return <Info className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
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
      default:
        return 'rounded-md'
    }
  }

  const handleDismiss = () => {
    onUpdate(element.id, {
      props: {
        ...element.props,
        dismissed: true
      }
    })
  }

  if (element.props.dismissed) {
    return null
  }

  return (
    <div
      className={cn(
        'relative w-full rounded-lg border p-4',
        getVariantClass(),
        getRoundedClass()
      )}
      style={style}
    >
      <div className="flex items-start">
        {element.props.showIcon !== false && (
          <div className="flex-shrink-0 mr-3 mt-0.5">
            {getIcon()}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          {element.props.title && (
            <div
              className="font-medium mb-1"
              contentEditable
              suppressContentEditableWarning
              onBlur={handleTitleChange}
            >
              {element.props.title}
            </div>
          )}
          
          <div
            className="text-sm"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleContentChange}
          >
            {element.props.content || 'Alert message content'}
          </div>
        </div>
        
        {element.props.dismissible && (
          <button
            className="flex-shrink-0 ml-3 p-1 hover:bg-black/10 rounded-full transition-colors"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
