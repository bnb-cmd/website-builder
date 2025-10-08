import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { ImageWithFallback } from '../../figma/ImageWithFallback'
import { getResponsiveTextSize } from '../renderer'

export const ImageConfig: ComponentConfig = {
  id: 'image',
  name: 'Image',
  category: 'basic',
  icon: 'Image',
  description: 'Add images to your website',
  defaultProps: { src: '', alt: 'Image' },
  defaultSize: { width: 300, height: 200 },
  editableFields: ['src', 'alt']
}

interface ImageProps extends WebsiteComponentProps {
  src: string
  alt: string
}

export const WebsiteImage: React.FC<ImageProps> = ({ 
  src, 
  alt,
  deviceMode = 'desktop'
}) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  
  return (
    <div className="w-full h-full border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center bg-muted/50 overflow-hidden">
      {src ? (
        <ImageWithFallback
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <div className="text-center text-muted-foreground">
          <ImageWithFallback 
            src=""
            alt="Placeholder"
            className="w-12 h-12 mx-auto mb-2 opacity-50"
          />
          <p className={textSize}>Click to add image</p>
        </div>
      )}
    </div>
  )
}
