import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { X, Maximize2, Minimize2 } from 'lucide-react'
import { useState } from 'react'

interface PopupElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function PopupElement({ element, onUpdate, viewMode, style, children }: PopupElementProps) {
  const [isOpen, setIsOpen] = useState(element.props.isOpen || false)
  const [isMinimized, setIsMinimized] = useState(false)

  const handleTitleChange = (e: React.FocusEvent<HTMLDivElement>) => {
    const newTitle = e.target.innerText
    onUpdate(element.id, {
      props: {
        ...element.props,
        title: newTitle
      }
    })
  }

  const handleClose = () => {
    setIsOpen(false)
    onUpdate(element.id, {
      props: {
        ...element.props,
        isOpen: false
      }
    })
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const getSizeClass = () => {
    switch (element.props.size) {
      case 'sm':
        return 'max-w-sm'
      case 'md':
        return 'max-w-md'
      case 'lg':
        return 'max-w-lg'
      case 'xl':
        return 'max-w-xl'
      case '2xl':
        return 'max-w-2xl'
      case 'full':
        return 'max-w-full'
      default:
        return 'max-w-md'
    }
  }

  const getPositionClass = () => {
    switch (element.props.position) {
      case 'center':
        return 'fixed inset-0 flex items-center justify-center z-50'
      case 'top-right':
        return 'fixed top-4 right-4 z-50'
      case 'top-left':
        return 'fixed top-4 left-4 z-50'
      case 'bottom-right':
        return 'fixed bottom-4 right-4 z-50'
      case 'bottom-left':
        return 'fixed bottom-4 left-4 z-50'
      default:
        return 'fixed inset-0 flex items-center justify-center z-50'
    }
  }

  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'modal':
        return 'bg-background border border-border shadow-lg'
      case 'card':
        return 'bg-card border border-border shadow-lg'
      case 'floating':
        return 'bg-background border border-border shadow-xl'
      default:
        return 'bg-background border border-border shadow-lg'
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <button
          className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          Open Popup
        </button>
      </div>
    )
  }

  return (
    <div className={getPositionClass()}>
      {/* Backdrop */}
      {element.props.showBackdrop && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={element.props.closeOnBackdrop ? handleClose : undefined}
        />
      )}
      
      {/* Popup Content */}
      <div
        className={cn(
          'relative rounded-lg overflow-hidden',
          getSizeClass(),
          getVariantClass(),
          isMinimized ? 'h-12' : 'h-auto'
        )}
        style={style}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
          <div
            className="font-semibold text-foreground"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleTitleChange}
          >
            {element.props.title || 'Popup Title'}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Minimize Button */}
            {element.props.showMinimize && (
              <button
                className="p-1 hover:bg-muted rounded transition-colors"
                onClick={handleMinimize}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
            )}
            
            {/* Close Button */}
            {element.props.showClose && (
              <button
                className="p-1 hover:bg-muted rounded transition-colors"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="p-4">
            {children}
            {!children && (
              <div className="text-center text-muted-foreground">
                <p>Popup content goes here</p>
                <p className="text-xs mt-2">
                  Size: {element.props.size || 'md'} | 
                  Position: {element.props.position || 'center'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
