import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react'

interface NotificationElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function NotificationElement({ element, onUpdate, viewMode, style }: NotificationElementProps) {
  const handleMessageChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newMessage = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        message: newMessage
      }
    })
  }

  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200'
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200'
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200'
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-200'
      default:
        return 'bg-background text-foreground border-border'
    }
  }

  const getIcon = () => {
    switch (element.props.variant) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />
      case 'warning':
        return <AlertCircle className="h-5 w-5" />
      case 'error':
        return <AlertCircle className="h-5 w-5" />
      case 'info':
        return <Info className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getPositionClass = () => {
    switch (element.props.position) {
      case 'top-right':
        return 'fixed top-4 right-4 z-50'
      case 'top-left':
        return 'fixed top-4 left-4 z-50'
      case 'bottom-right':
        return 'fixed bottom-4 right-4 z-50'
      case 'bottom-left':
        return 'fixed bottom-4 left-4 z-50'
      case 'top-center':
        return 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50'
      default:
        return 'relative'
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
        'max-w-sm w-full rounded-lg border p-4 shadow-lg',
        getVariantClass(),
        getPositionClass(),
        element.props.animate ? 'animate-in slide-in-from-right' : ''
      )}
      style={style}
    >
      <div className="flex items-start">
        {/* Icon */}
        {element.props.showIcon !== false && (
          <div className="flex-shrink-0 mr-3">
            {getIcon()}
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {element.props.title && (
            <div className="font-medium mb-1">
              {element.props.title}
            </div>
          )}
          
          <div
            className="text-sm"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleMessageChange}
          >
            {element.props.message || 'Notification message'}
          </div>
        </div>
        
        {/* Dismiss Button */}
        {element.props.dismissible && (
          <button
            className="flex-shrink-0 ml-3 p-1 hover:bg-black/10 rounded-full transition-colors"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Action Buttons */}
      {element.props.actions && element.props.actions.length > 0 && (
        <div className="mt-3 flex space-x-2">
          {element.props.actions.map((action: any, index: number) => (
            <button
              key={index}
              className="text-sm font-medium hover:underline"
              onClick={() => {
                // Handle action
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
