import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Share2, Facebook, Twitter, Linkedin, Mail, Link, Copy } from 'lucide-react'

interface ShareElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function ShareElement({ element, onUpdate, viewMode, style, children }: ShareElementProps) {
  const handleShare = (platform: string) => {
    const url = element.props.url || window.location.href
    const title = element.props.title || document.title
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'mail':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`)
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        break
    }
  }

  const getLayoutClass = () => {
    switch (element.props.layout) {
      case 'horizontal':
        return 'flex flex-row space-x-2'
      case 'vertical':
        return 'flex flex-col space-y-2'
      case 'grid':
        return 'grid grid-cols-2 gap-2'
      case 'dropdown':
        return 'relative'
      default:
        return 'flex flex-row space-x-2'
    }
  }

  const getSizeClass = () => {
    switch (element.props.size) {
      case 'sm':
        return 'h-8 w-8'
      case 'lg':
        return 'h-12 w-12'
      case 'xl':
        return 'h-16 w-16'
      case 'md':
      default:
        return 'h-10 w-10'
    }
  }

  const getVariantClass = () => {
    switch (element.props.variant) {
      case 'outlined':
        return 'border border-border hover:border-primary'
      case 'filled':
        return 'bg-primary text-primary-foreground hover:bg-primary/90'
      case 'minimal':
        return 'hover:bg-muted'
      default:
        return 'bg-muted hover:bg-muted/80'
    }
  }

  const shareOptions = [
    { name: 'facebook', icon: Facebook, color: 'hover:text-blue-600' },
    { name: 'twitter', icon: Twitter, color: 'hover:text-blue-400' },
    { name: 'linkedin', icon: Linkedin, color: 'hover:text-blue-700' },
    { name: 'mail', icon: Mail, color: 'hover:text-green-600' },
    { name: 'copy', icon: Copy, color: 'hover:text-gray-600' }
  ]

  return (
    <div
      className={cn(
        'flex items-center',
        getLayoutClass()
      )}
      style={style}
    >
      {/* Share Label */}
      {element.props.showLabel && (
        <span className="text-sm font-medium text-foreground mr-2">
          Share:
        </span>
      )}

      {/* Share Buttons */}
      {shareOptions.map((option) => {
        const Icon = option.icon
        
        return (
          <button
            key={option.name}
            onClick={() => handleShare(option.name)}
            className={cn(
              'flex items-center justify-center rounded-full transition-all duration-200',
              getSizeClass(),
              getVariantClass(),
              option.color,
              element.props.showLabels && 'flex-col space-y-1'
            )}
            title={`Share on ${option.name}`}
          >
            <Icon className={cn(
              'transition-colors',
              element.props.size === 'sm' ? 'h-4 w-4' :
              element.props.size === 'lg' ? 'h-6 w-6' :
              element.props.size === 'xl' ? 'h-8 w-8' : 'h-5 w-5'
            )} />
            
            {element.props.showLabels && (
              <span className="text-xs capitalize">{option.name}</span>
            )}
          </button>
        )
      })}

      {/* Share Count */}
      {element.props.showCount && (
        <div className="ml-2 text-sm text-muted-foreground">
          {element.props.shareCount || '0'} shares
        </div>
      )}

      {/* Custom Share Button */}
      {element.props.showCustomButton && (
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center space-x-2">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
      )}
    </div>
  )
}
