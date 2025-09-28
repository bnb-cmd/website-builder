'use client'

import { Element } from '@/types/editor'
import { Calendar, CheckCircle } from 'lucide-react'

interface TimelineElementProps {
  element: Element
  isSelected: boolean
  onSelect: () => void
}

export function TimelineElement({ element, isSelected, onSelect }: TimelineElementProps) {
  const { events = [], orientation = 'vertical' } = element.props

  const defaultEvents = events.length > 0 ? events : [
    { date: '2024', title: 'Company Founded', description: 'Started our journey' },
    { date: '2025', title: 'Product Launch', description: 'Launched our first product' },
  ]

  return (
    <div
      onClick={onSelect}
      className={`
        p-8 cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
    >
      <div className={`relative ${orientation === 'horizontal' ? 'flex items-center' : ''}`}>
        {/* Timeline Line */}
        <div className={`
          absolute bg-border
          ${orientation === 'horizontal' 
            ? 'h-0.5 w-full top-1/2 transform -translate-y-1/2' 
            : 'w-0.5 h-full left-6 top-0'
          }
        `} />
        
        {/* Events */}
        <div className={`
          relative z-10
          ${orientation === 'horizontal' 
            ? 'flex justify-between w-full' 
            : 'space-y-8'
          }
        `}>
          {defaultEvents.map((event, index) => (
            <div
              key={index}
              className={`
                flex items-start gap-4
                ${orientation === 'horizontal' ? 'flex-col items-center' : ''}
              `}
            >
              {/* Event Marker */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                  {index < defaultEvents.length - 1 ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <Calendar className="h-6 w-6" />
                  )}
                </div>
              </div>
              
              {/* Event Content */}
              <div className={`
                ${orientation === 'horizontal' 
                  ? 'text-center mt-4' 
                  : 'flex-1 pb-8'
                }
              `}>
                <div className="text-sm text-muted-foreground mb-1">{event.date}</div>
                <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                <p className="text-muted-foreground">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
