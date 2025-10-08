import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'

export const DividerConfig: ComponentConfig = {
  id: 'divider',
  name: 'Divider',
  category: 'basic',
  icon: 'Minus',
  description: 'Add horizontal dividers',
  defaultProps: {},
  defaultSize: { width: 400, height: 2 },
  editableFields: []
}

interface DividerProps extends WebsiteComponentProps {}

export const Divider: React.FC<DividerProps> = () => {
  return (
    <div className="w-full h-full flex items-center">
      <hr className="w-full border-t-2 border-muted-foreground" />
    </div>
  )
}
