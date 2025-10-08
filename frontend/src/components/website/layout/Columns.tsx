import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const ColumnsConfig: ComponentConfig = {
  id: 'columns',
  name: 'Columns',
  category: 'layout',
  icon: 'Columns',
  description: 'Create multi-column layouts',
  defaultProps: { columns: 2 },
  defaultSize: { width: 500, height: 200 },
  editableFields: ['columns']
}

interface ColumnsProps extends WebsiteComponentProps {
  columns: number
}

export const Columns: React.FC<ColumnsProps> = ({ 
  columns = 2,
  deviceMode = 'desktop'
}) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  const padding = getResponsivePadding('p-4', deviceMode)
  
  return (
    <div className={`w-full h-full border-2 border-dashed border-muted-foreground rounded-lg bg-muted/20 ${padding}`}>
      <div className={`grid grid-cols-${columns} gap-4 h-full`}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="bg-white/50 rounded border border-dashed border-gray-400 flex items-center justify-center">
            <p className={`text-muted-foreground ${textSize}`}>Column {i + 1}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
