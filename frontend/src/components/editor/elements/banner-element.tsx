import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { X, AlertCircle, Info, CheckCircle, Star } from 'lucide-react'

interface BannerElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function BannerElement({ element, onUpdate, viewMode, style, children }: BannerElementProps) {
  const handleTitleChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newTitle = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        title: newTitle
      }
    })
  }

  const handleDescriptionChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newDescription = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        description: newDescription
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
      case 'premium':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      case 'announcement':
        return 'bg-primary text-primary-foreground'
      default:
        return 'bg-muted text-muted-foreground border-border'
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
      case 'premium':
        return <Star className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getPositionClass = () => {
    switch (element.props.position) {
      case 'fixed-top':
        return 'fixed top-0 left-0 right-0 z-50'
      case 'fixed-bottom':
        return 'fixed bottom-0 left-0 right-0 z-50'
      case 'sticky-top':
        return 'sticky top-0 z-40'
      case 'sticky-bottom':
        return 'sticky bottom-0 z-40'
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
        'w-full border rounded-lg p-4',
        getVariantClass(),
        getPositionClass(),
        element.props.animate ? 'animate-in slide-in-from-top' : ''
      )}
      style={style}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Icon */}
          {element.props.showIcon !== false && (
            <div className="flex-shrink-0">
              {getIcon()}
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1">
            {element.props.title && (
              <div
                className="font-semibold mb-1"
                contentEditable
                suppressContentEditableWarning
                onBlur={handleTitleChange}
              >
                {element.props.title}
              </div>
            )}
            
            {element.props.description && (
              <div
                className="text-sm opacity-90"
                contentEditable
                suppressContentEditableWarning
                onBlur={handleDescriptionChange}
              >
                {element.props.description}
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* CTA Button */}
          {element.props.ctaText && (
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors text-sm font-medium">
              {element.props.ctaText}
            </button>
          )}
          
          {/* Dismiss Button */}
          {element.props.dismissible && (
            <button
              className="p-1 hover:bg-black/10 rounded-full transition-colors"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
