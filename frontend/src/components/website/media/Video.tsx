import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Video } from '@/lib/icons'
import { getResponsiveTextSize } from '../renderer'

export const VideoConfig: ComponentConfig = {
  id: 'video',
  name: 'Video',
  category: 'media',
  icon: 'Video',
  description: 'Embed videos',
  defaultProps: {},
  defaultSize: { width: 400, height: 250 },
  editableFields: []
}

interface VideoProps extends WebsiteComponentProps {}

export const WebsiteVideo: React.FC<VideoProps> = ({ deviceMode = 'desktop' }) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  
  return (
    <div className="w-full h-full bg-muted/50 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
      <Video className="w-12 h-12 text-muted-foreground" />
      <p className={`text-muted-foreground ml-2 ${textSize}`}>Video Placeholder</p>
    </div>
  )
}
