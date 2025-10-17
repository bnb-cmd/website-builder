import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { ArrowRight, Phone, Mail } from '@/lib/icons'
import { Button } from '../../ui/button'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const CTAConfig: ComponentConfig = {
  id: 'cta',
  name: 'CTA',
  category: 'business',
  icon: 'ArrowRight',
  description: 'Call-to-action sections',
  defaultProps: { 
    title: 'Ready to Get Started?',
    subtitle: 'Join thousands of satisfied customers',
    primaryButton: 'Get Started',
    secondaryButton: 'Learn More',
    primaryAction: 'https://example.com/signup',
    secondaryAction: 'https://example.com/about',
    style: 'default',
    showSecondary: true
  },
  defaultSize: { width: 500, height: 200 },
  editableFields: ['title', 'subtitle', 'primaryButton', 'secondaryButton', 'primaryAction', 'secondaryAction', 'style', 'showSecondary']
}

interface CTAProps extends WebsiteComponentProps {
  title: string
  subtitle: string
  primaryButton: string
  secondaryButton: string
  primaryAction: string
  secondaryAction: string
  style: 'default' | 'minimal' | 'gradient'
  showSecondary: boolean
}

export const WebsiteCTA: React.FC<CTAProps> = ({ 
  title, 
  subtitle, 
  primaryButton, 
  secondaryButton, 
  primaryAction, 
  secondaryAction, 
  style, 
  showSecondary,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const getStyleClass = () => {
    switch (style) {
      case 'minimal': return 'bg-white border border-gray-200'
      case 'gradient': return 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground'
      default: return 'bg-primary text-primary-foreground'
    }
  }

  const getButtonVariant = () => {
    switch (style) {
      case 'minimal': return 'default'
      case 'gradient': return 'secondary'
      default: return 'secondary'
    }
  }

  const padding = getResponsivePadding('p-8', deviceMode)
  const titleSize = getResponsiveTextSize('text-2xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-base', deviceMode)

  return (
    <div className={cn("w-full h-full rounded-lg", getStyleClass(), padding)}>
      <div className="text-center space-y-6">
        <div>
          <h2 
            className={cn("font-bold mb-2", titleSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {title}
          </h2>
          <p 
            className={cn("opacity-90", subtitleSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {subtitle}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            variant={getButtonVariant()}
            className="flex items-center"
          >
            {primaryButton}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          {showSecondary && (
            <Button 
              size="lg" 
              variant="outline"
              className={cn(
                style === 'gradient' && "border-white text-white hover:bg-white hover:text-primary"
              )}
            >
              {secondaryButton}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
