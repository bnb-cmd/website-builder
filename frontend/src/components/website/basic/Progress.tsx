import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Progress } from '../../ui/progress'
import { getResponsiveTextSize } from '../renderer'

export const ProgressConfig: ComponentConfig = {
  id: 'progress',
  name: 'Progress',
  category: 'basic',
  icon: 'BarChart3',
  description: 'Show progress bars and completion status',
  defaultProps: { 
    value: 75,
    label: 'Progress',
    showPercentage: true,
    color: 'default'
  },
  defaultSize: { width: 300, height: 60 },
  editableFields: ['value', 'label', 'showPercentage', 'color']
}

interface ProgressProps extends WebsiteComponentProps {
  value: number
  label: string
  showPercentage: boolean
  color: 'default' | 'success' | 'warning' | 'destructive'
}

export const WebsiteProgress: React.FC<ProgressProps> = ({ 
  value, 
  label, 
  showPercentage, 
  color,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  const labelSize = getResponsiveTextSize('text-base', deviceMode)

  const getColorClass = () => {
    switch (color) {
      case 'success': return 'bg-green-500'
      case 'warning': return 'bg-yellow-500'
      case 'destructive': return 'bg-red-500'
      default: return 'bg-primary'
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-center space-y-2">
      <div className="flex justify-between items-center">
        <span 
          className={`${labelSize} font-medium`}
          onDoubleClick={onTextDoubleClick}
        >
          {label}
        </span>
        {showPercentage && (
          <span className={`${textSize} text-gray-600`}>
            {value}%
          </span>
        )}
      </div>
      <Progress 
        value={value} 
        className="h-2"
        // Note: Progress component might need custom styling for colors
      />
    </div>
  )
}
