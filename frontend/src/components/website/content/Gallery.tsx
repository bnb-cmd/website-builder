import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const GalleryConfig: ComponentConfig = {
  id: 'gallery',
  name: 'Gallery',
  category: 'content',
  icon: 'Grid3X3',
  description: 'Display image galleries',
  defaultProps: {},
  defaultSize: { width: 500, height: 300 },
  editableFields: []
}

interface GalleryProps extends WebsiteComponentProps {}

export const Gallery: React.FC<GalleryProps> = ({ deviceMode = 'desktop' }) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  const padding = getResponsivePadding('p-4', deviceMode)
  
  return (
    <div className={`w-full h-full border-2 border-dashed border-muted-foreground rounded-lg bg-muted/20 flex items-center justify-center ${padding}`}>
      <p className={`text-muted-foreground text-center ${textSize}`}>Image Gallery</p>
    </div>
  )
}
