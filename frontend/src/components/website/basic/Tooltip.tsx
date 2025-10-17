import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip'
import { Info } from '@/lib/icons'
import { getResponsiveTextSize } from '../renderer'

export const TooltipConfig: ComponentConfig = {
  id: 'tooltip',
  name: 'Tooltip',
  category: 'basic',
  icon: 'Info',
  description: 'Show helpful information on hover',
  defaultProps: { 
    trigger: 'ℹ️',
    content: 'This is a helpful tooltip',
    placement: 'top'
  },
  defaultSize: { width: 40, height: 40 },
  editableFields: ['trigger', 'content', 'placement']
}

interface TooltipProps extends WebsiteComponentProps {
  trigger: string
  content: string
  placement: 'top' | 'bottom' | 'left' | 'right'
}

export const WebsiteTooltip: React.FC<TooltipProps> = ({ 
  trigger, 
  content, 
  placement,
  deviceMode = 'desktop'
}) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <div className="w-full h-full flex items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <Info className="w-4 h-4 text-gray-600" />
            </button>
          </TooltipTrigger>
          <TooltipContent side={placement} className={textSize}>
            <p>{content}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
