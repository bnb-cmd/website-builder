import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { MapPin } from '@/lib/icons'
import { getResponsiveTextSize } from '../renderer'

export const MapConfig: ComponentConfig = {
  id: 'map',
  name: 'Map',
  category: 'business',
  icon: 'MapPin',
  description: 'Add location maps',
  defaultProps: {},
  defaultSize: { width: 400, height: 250 },
  editableFields: []
}

interface MapProps extends WebsiteComponentProps {}

export const Map: React.FC<MapProps> = ({ deviceMode = 'desktop' }) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  
  return (
    <div className="w-full h-full bg-muted/50 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
      <MapPin className="w-12 h-12 text-muted-foreground" />
      <p className={`text-muted-foreground ml-2 ${textSize}`}>Map Placeholder</p>
    </div>
  )
}
