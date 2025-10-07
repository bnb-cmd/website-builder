import { Element, ViewMode } from '@/types/editor'
import { cn } from '@/lib/utils'
import { Mail, Send } from 'lucide-react'

interface NewsletterElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function NewsletterElement({ element, onUpdate, viewMode, style }: NewsletterElementProps) {
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

  const handlePlaceholderChange = (e: React.FocusEvent<HTMLInputElement>) => {
    const newPlaceholder = e.target.value
    onUpdate(element.id, {
      props: {
        ...element.props,
        placeholder: newPlaceholder
      }
    })
  }

  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'centered':
        return 'text-center'
      case 'left':
        return 'text-left'
      case 'right':
        return 'text-right'
      default:
        return 'text-center'
    }
  }

  const getBackgroundClass = () => {
    switch (element.props.background) {
      case 'primary':
        return 'bg-primary text-primary-foreground'
      case 'secondary':
        return 'bg-secondary text-secondary-foreground'
      case 'muted':
        return 'bg-muted text-muted-foreground'
      case 'transparent':
        return 'bg-transparent'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div
      className={cn(
        'w-full p-8 rounded-lg',
        getBackgroundClass(),
        getVariantClass()
      )}
      style={style}
    >
      <div className="max-w-md mx-auto">
        {/* Icon */}
        {element.props.showIcon && (
          <div className="flex justify-center mb-4">
            <Mail className="h-8 w-8" />
          </div>
        )}

        {/* Title */}
        <div
          className="text-2xl font-bold mb-2"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleChange}
        >
          {element.props.title || 'Subscribe to our newsletter'}
        </div>

        {/* Description */}
        <div
          className="text-sm mb-6 opacity-80"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleDescriptionChange}
        >
          {element.props.description || 'Get the latest updates and news delivered to your inbox.'}
        </div>

        {/* Email Form */}
        <div className="flex gap-2">
          <input
            type="email"
            placeholder={element.props.placeholder || 'Enter your email'}
            className="flex-1 px-4 py-2 rounded-md border border-border bg-background text-foreground"
            onChange={handlePlaceholderChange}
          />
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2">
            <Send className="h-4 w-4" />
            Subscribe
          </button>
        </div>

        {/* Privacy Notice */}
        {element.props.showPrivacy && (
          <p className="text-xs mt-4 opacity-70">
            We respect your privacy. Unsubscribe at any time.
          </p>
        )}
      </div>
    </div>
  )
}
