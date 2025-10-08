import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const TimelineConfig: ComponentConfig = {
  id: 'timeline',
  name: 'Timeline',
  category: 'content',
  icon: 'Clock',
  description: 'Display events in chronological order',
  defaultProps: { 
    events: [
      { date: '2024', title: 'Event 1', description: 'Description of event 1' },
      { date: '2023', title: 'Event 2', description: 'Description of event 2' },
      { date: '2022', title: 'Event 3', description: 'Description of event 3' }
    ],
    orientation: 'vertical'
  },
  defaultSize: { width: 400, height: 400 },
  editableFields: ['events', 'orientation']
}

interface TimelineEvent {
  date: string
  title: string
  description: string
}

interface TimelineProps extends WebsiteComponentProps {
  events: TimelineEvent[]
  orientation: 'vertical' | 'horizontal'
}

export const WebsiteTimeline: React.FC<TimelineProps> = ({ 
  events, 
  orientation,
  deviceMode = 'desktop'
}) => {
  const padding = getResponsivePadding('p-4', deviceMode)
  const dateSize = getResponsiveTextSize('text-sm', deviceMode)
  const titleSize = getResponsiveTextSize('text-base', deviceMode)
  const descriptionSize = getResponsiveTextSize('text-sm', deviceMode)

  if (orientation === 'horizontal') {
    return (
      <div className={cn("w-full h-full", padding)}>
        <div className="flex items-center space-x-4 overflow-x-auto">
          {events.map((event, index) => (
            <div key={index} className="flex-shrink-0 text-center min-w-32">
              <div className="w-4 h-4 bg-primary rounded-full mx-auto mb-2"></div>
              <div className={cn("text-primary font-medium", dateSize)}>{event.date}</div>
              <div className={cn("font-semibold mt-1", titleSize)}>{event.title}</div>
              <div className={cn("text-gray-600 mt-1", descriptionSize)}>{event.description}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full h-full", padding)}>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
        <div className="space-y-6">
          {events.map((event, index) => (
            <div key={index} className="relative flex items-start">
              <div className="absolute left-3 w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div className="ml-8">
                <div className={cn("text-primary font-medium", dateSize)}>{event.date}</div>
                <div className={cn("font-semibold mt-1", titleSize)}>{event.title}</div>
                <div className={cn("text-gray-600 mt-1", descriptionSize)}>{event.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
