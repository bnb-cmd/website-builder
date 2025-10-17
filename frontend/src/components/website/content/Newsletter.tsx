import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Mail, Send } from '@/lib/icons'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const NewsletterConfig: ComponentConfig = {
  id: 'newsletter',
  name: 'Newsletter',
  category: 'content',
  icon: 'Mail',
  description: 'Email newsletter signup form',
  defaultProps: { 
    title: 'Subscribe to Our Newsletter',
    description: 'Get the latest updates and news delivered to your inbox.',
    placeholder: 'Enter your email address',
    buttonText: 'Subscribe',
    showIcon: true
  },
  defaultSize: { width: 400, height: 200 },
  editableFields: ['title', 'description', 'placeholder', 'buttonText', 'showIcon']
}

interface NewsletterProps extends WebsiteComponentProps {
  title: string
  description: string
  placeholder: string
  buttonText: string
  showIcon: boolean
}

export const WebsiteNewsletter: React.FC<NewsletterProps> = ({ 
  title, 
  description, 
  placeholder, 
  buttonText, 
  showIcon,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const padding = getResponsivePadding('p-6', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const descriptionSize = getResponsiveTextSize('text-sm', deviceMode)
  const inputSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <div className={cn("w-full h-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg", padding)}>
      <div className="text-center space-y-4">
        {showIcon && (
          <div className="flex justify-center">
            <Mail className="w-8 h-8" />
          </div>
        )}
        
        <h3 
          className={cn("font-bold", titleSize)}
          onDoubleClick={onTextDoubleClick}
        >
          {title}
        </h3>
        
        <p 
          className={cn("opacity-90", descriptionSize)}
          onDoubleClick={onTextDoubleClick}
        >
          {description}
        </p>
        
        <div className="flex gap-2 max-w-sm mx-auto">
          <Input 
            type="email"
            placeholder={placeholder}
            className={cn("flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70", inputSize)}
            readOnly
          />
          <Button variant="secondary" size="sm">
            {showIcon && <Send className="w-4 h-4 mr-2" />}
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
}
