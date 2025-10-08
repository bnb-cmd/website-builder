import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Clock, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const HoursConfig: ComponentConfig = {
  id: 'hours',
  name: 'Hours',
  category: 'business',
  icon: 'Clock',
  description: 'Display business hours',
  defaultProps: { 
    title: 'Business Hours',
    subtitle: 'We\'re here when you need us',
    hours: [
      { day: 'Monday', hours: '9:00 AM - 6:00 PM' },
      { day: 'Tuesday', hours: '9:00 AM - 6:00 PM' },
      { day: 'Wednesday', hours: '9:00 AM - 6:00 PM' },
      { day: 'Thursday', hours: '9:00 AM - 6:00 PM' },
      { day: 'Friday', hours: '9:00 AM - 5:00 PM' },
      { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
      { day: 'Sunday', hours: 'Closed' }
    ],
    showTitle: true,
    showSubtitle: true,
    highlightToday: true
  },
  defaultSize: { width: 300, height: 350 },
  editableFields: ['title', 'subtitle', 'hours', 'showTitle', 'showSubtitle', 'highlightToday']
}

interface BusinessHour {
  day: string
  hours: string
}

interface HoursProps extends WebsiteComponentProps {
  title: string
  subtitle: string
  hours: BusinessHour[]
  showTitle: boolean
  showSubtitle: boolean
  highlightToday: boolean
}

export const WebsiteHours: React.FC<HoursProps> = ({ 
  title, 
  subtitle, 
  hours, 
  showTitle, 
  showSubtitle, 
  highlightToday,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const getToday = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
    return today
  }

  const padding = getResponsivePadding('p-6', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-sm', deviceMode)
  const daySize = getResponsiveTextSize('text-sm', deviceMode)
  const hoursSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <div className={cn("w-full h-full bg-white border border-gray-200 rounded-lg", padding)}>
      <div className="space-y-4">
        {(showTitle || showSubtitle) && (
          <div className="text-center">
            {showTitle && (
              <h3 
                className={cn("font-bold mb-2", titleSize)}
                onDoubleClick={onTextDoubleClick}
              >
                {title}
              </h3>
            )}
            {showSubtitle && (
              <p 
                className={cn("text-gray-600", subtitleSize)}
                onDoubleClick={onTextDoubleClick}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          {hours.map((hour, index) => {
            const isToday = highlightToday && hour.day === getToday()
            return (
              <div 
                key={index}
                className={cn(
                  "flex justify-between items-center py-2 px-3 rounded-md",
                  isToday ? "bg-primary/10 border border-primary/20" : "hover:bg-gray-50"
                )}
              >
                <span 
                  className={cn(
                    "font-medium",
                    daySize,
                    isToday ? "text-primary" : "text-gray-700"
                  )}
                  onDoubleClick={onTextDoubleClick}
                >
                  {hour.day}
                </span>
                <span 
                  className={cn(
                    hoursSize,
                    isToday ? "text-primary font-medium" : "text-gray-600"
                  )}
                  onDoubleClick={onTextDoubleClick}
                >
                  {hour.hours}
                </span>
              </div>
            )
          })}
        </div>
        
        <div className="text-center pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className={cn("text-xs", subtitleSize)}>
              All times are in local timezone
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
