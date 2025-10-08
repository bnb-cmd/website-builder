import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const SectionConfig: ComponentConfig = {
  id: 'section',
  name: 'Section',
  category: 'layout',
  icon: 'Layout',
  description: 'Create page sections with background',
  defaultProps: { 
    title: 'Section Title',
    content: 'Section content goes here',
    background: 'white',
    padding: 'large'
  },
  defaultSize: { width: 600, height: 300 },
  editableFields: ['title', 'content', 'background', 'padding']
}

interface SectionProps extends WebsiteComponentProps {
  title: string
  content: string
  background: 'white' | 'gray' | 'primary' | 'gradient'
  padding: 'small' | 'medium' | 'large'
}

export const WebsiteSection: React.FC<SectionProps> = ({ 
  title, 
  content, 
  background, 
  padding,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const getBackgroundClass = () => {
    switch (background) {
      case 'gray': return 'bg-gray-50'
      case 'primary': return 'bg-primary text-primary-foreground'
      case 'gradient': return 'bg-gradient-to-r from-primary to-primary/70 text-primary-foreground'
      default: return 'bg-white'
    }
  }

  const getPaddingClass = () => {
    switch (padding) {
      case 'small': return 'p-4'
      case 'large': return 'p-12'
      default: return 'p-8'
    }
  }

  const paddingClass = getResponsivePadding(getPaddingClass(), deviceMode)
  const titleSize = getResponsiveTextSize('text-2xl', deviceMode)
  const contentSize = getResponsiveTextSize('text-base', deviceMode)

  return (
    <section className={cn("w-full h-full", getBackgroundClass(), paddingClass)}>
      <div className="max-w-4xl mx-auto">
        <h2 
          className={cn("font-bold mb-4", titleSize)}
          onDoubleClick={onTextDoubleClick}
        >
          {title}
        </h2>
        <p 
          className={contentSize}
          onDoubleClick={onTextDoubleClick}
        >
          {content}
        </p>
      </div>
    </section>
  )
}
