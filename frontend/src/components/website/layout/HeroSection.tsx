import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Button } from '../../ui/button'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const HeroSectionConfig: ComponentConfig = {
  id: 'hero-section',
  name: 'Hero Section',
  category: 'layout',
  icon: 'Zap',
  description: 'Create compelling hero sections',
  defaultProps: { 
    title: 'Your Hero Title', 
    subtitle: 'Compelling subtitle that describes your business', 
    buttonText: 'Get Started' 
  },
  defaultSize: { width: 600, height: 400 },
  editableFields: ['title', 'subtitle', 'buttonText']
}

interface HeroSectionProps extends WebsiteComponentProps {
  title: string
  subtitle: string
  buttonText: string
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  title,
  subtitle,
  buttonText,
  deviceMode = 'desktop',
  onTextDoubleClick
}) => {
  const titleSize = getResponsiveTextSize('text-3xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-base', deviceMode)
  const buttonSize = getResponsiveTextSize('text-base', deviceMode)
  const padding = getResponsivePadding('p-8', deviceMode)
  
  return (
    <div className={`w-full h-full bg-gradient-to-r from-primary to-primary/70 rounded-lg flex flex-col justify-center items-start text-primary-foreground ${padding}`}>
      <h1 
        className={`font-bold mb-4 ${titleSize}`}
        onDoubleClick={onTextDoubleClick}
      >
        {title}
      </h1>
      <p 
        className={`mb-6 ${subtitleSize}`}
        onDoubleClick={onTextDoubleClick}
      >
        {subtitle}
      </p>
      <Button 
        variant="secondary" 
        className={buttonSize}
        onDoubleClick={onTextDoubleClick}
      >
        {buttonText}
      </Button>
    </div>
  )
}
