import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const ContainerConfig: ComponentConfig = {
  id: 'container',
  name: 'Container',
  category: 'layout',
  icon: 'Square',
  description: 'Group content in a container',
  defaultProps: {},
  defaultSize: { width: 400, height: 300 },
  editableFields: []
}

interface ContainerProps extends WebsiteComponentProps {}

export const Container: React.FC<ContainerProps> = ({ deviceMode = 'desktop' }) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  const padding = getResponsivePadding('p-4', deviceMode)
  
  return (
    <div className={`w-full h-full border-2 border-dashed border-muted-foreground rounded-lg bg-muted/20 flex items-center justify-center ${padding}`}>
      <p className={`text-muted-foreground text-center ${textSize}`}>Container</p>
    </div>
  )
}
