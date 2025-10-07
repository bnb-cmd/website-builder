'use client'

import { Element } from '@/types/editor'
import { useEffect, useState } from 'react'

interface CountdownElementProps {
  element: Element
  isSelected: boolean
  onSelect: () => void
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownElement({ element, isSelected, onSelect }: CountdownElementProps) {
  const { 
    targetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    title = 'Coming Soon',
    showLabels = true
  } = element.props

  const calculateTimeLeft = (): TimeLeft => {
    const difference = new Date(targetDate).getTime() - new Date().getTime()
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }
    
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const timeUnits = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' }
  ]

  return (
    <div
      onClick={onSelect}
      className={`
        p-8 cursor-pointer transition-all text-center
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
    >
      {title && (
        <h2 className="text-3xl font-bold mb-8">{title}</h2>
      )}
      
      <div className="flex justify-center gap-4">
        {timeUnits.map((unit, index) => (
          <div key={index} className="text-center">
            <div className="bg-primary/10 rounded-lg p-4 min-w-[80px]">
              <div className="text-4xl font-bold text-primary">
                {String(unit.value).padStart(2, '0')}
              </div>
            </div>
            {showLabels && (
              <div className="text-sm text-muted-foreground mt-2">
                {unit.label}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
