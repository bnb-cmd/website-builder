import { Element, ViewMode } from '@/types/editor'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Mail, Phone } from 'lucide-react'

interface SocialElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
  children: ReactNode
}

export function SocialElement({ element, onUpdate, viewMode, style, children }: SocialElementProps) {
  const handleLinkChange = (platform: string, url: string) => {
    onUpdate(element.id, {
      props: {
        ...element.props,
        links: {
          ...element.props.links,
          [platform]: url
        }
      }
    })
  }

  const getLayoutClass = () => {
    switch (element.props.layout) {
      case 'horizontal':
        return 'flex flex-row space-x-4'
      case 'vertical':
        return 'flex flex-col space-y-4'
      case 'grid':
        return 'grid grid-cols-2 gap-4'
      default:
        return 'flex flex-row space-x-4'
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

  const socialPlatforms = [
    { name: 'facebook', icon: Facebook, color: 'hover:text-blue-600' },
    { name: 'twitter', icon: Twitter, color: 'hover:text-blue-400' },
    { name: 'instagram', icon: Instagram, color: 'hover:text-pink-600' },
    { name: 'linkedin', icon: Linkedin, color: 'hover:text-blue-700' },
    { name: 'youtube', icon: Youtube, color: 'hover:text-red-600' },
    { name: 'github', icon: Github, color: 'hover:text-gray-800' },
    { name: 'email', icon: Mail, color: 'hover:text-green-600' },
    { name: 'phone', icon: Phone, color: 'hover:text-green-600' }
  ]

  const links = element.props.links || {}

  return (
    <div
      className={cn(
        'flex items-center',
        getLayoutClass()
      )}
      style={style}
    >
      {socialPlatforms.map((platform) => {
        const Icon = platform.icon
        const url = links[platform.name] || '#'
        
        return (
          <a
            key={platform.name}
            href={url}
            className={cn(
              'flex items-center justify-center rounded-full transition-all duration-200',
              getSizeClass(),
              getVariantClass(),
              platform.color,
              element.props.showLabels && 'flex-col space-y-1'
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon className={cn(
              'transition-colors',
              element.props.size === 'sm' ? 'h-4 w-4' :
              element.props.size === 'lg' ? 'h-6 w-6' :
              element.props.size === 'xl' ? 'h-8 w-8' : 'h-5 w-5'
            )} />
            
            {element.props.showLabels && (
              <span className="text-xs capitalize">{platform.name}</span>
            )}
          </a>
        )
      })}

      {Object.keys(links).length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-4 text-center text-muted-foreground">
          <p>Configure social links in properties panel</p>
          <p className="text-xs mt-1">
            Layout: {element.props.layout || 'horizontal'} | 
            Size: {element.props.size || 'md'}
          </p>
        </div>
      )}
    </div>
  )
}
