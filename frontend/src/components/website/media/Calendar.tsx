import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const CalendarConfig: ComponentConfig = {
  id: 'calendar',
  name: 'Calendar',
  category: 'media',
  icon: 'Calendar',
  description: 'Display calendar widgets',
  defaultProps: {},
  defaultSize: { width: 300, height: 300 },
  editableFields: []
}

interface CalendarProps extends WebsiteComponentProps {}

export const Calendar: React.FC<CalendarProps> = ({ deviceMode = 'desktop' }) => {
  const textSize = getResponsiveTextSize('text-sm', deviceMode)
  const headerSize = getResponsiveTextSize('text-base', deviceMode)
  const padding = getResponsivePadding('p-4', deviceMode)
  
  return (
    <Card className={`w-full h-full ${padding}`}>
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="sm">Prev</Button>
        <h4 className={`font-semibold ${headerSize}`}>November 2023</h4>
        <Button variant="ghost" size="sm">Next</Button>
      </div>
      <div className={`grid grid-cols-7 gap-1 text-center ${textSize}`}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="font-bold">{day}</div>
        ))}
        {[...Array(30)].map((_, i) => (
          <div key={i} className="p-1">{i + 1}</div>
        ))}
      </div>
    </Card>
  )
}
