'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface CountdownTimerProps {
  targetDate: string | Date
  title?: string
  showDays?: boolean
  showHours?: boolean
  showMinutes?: boolean
  showSeconds?: boolean
  onComplete?: () => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'boxes' | 'inline' | 'circle'
  color?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  title = 'Time Remaining',
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  onComplete,
  size = 'md',
  variant = 'boxes',
  color = '#3B82F6'
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  })

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const target = new Date(targetDate).getTime()
      const now = new Date().getTime()
      const difference = target - now

      if (difference <= 0) {
        if (onComplete) onComplete()
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        total: difference
      }
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const boxSizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  }

  const circleSizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  }

  const renderBoxes = () => {
    const timeUnits = [
      { label: 'Days', value: timeLeft.days, show: showDays },
      { label: 'Hours', value: timeLeft.hours, show: showHours },
      { label: 'Minutes', value: timeLeft.minutes, show: showMinutes },
      { label: 'Seconds', value: timeLeft.seconds, show: showSeconds }
    ].filter(unit => unit.show)

    return (
      <div className="flex gap-4 justify-center">
        {timeUnits.map((unit) => (
          <div key={unit.label} className="text-center">
            <div
              className={cn(
                'flex items-center justify-center rounded-lg font-bold text-white',
                boxSizeClasses[size]
              )}
              style={{ backgroundColor: color }}
            >
              {unit.value.toString().padStart(2, '0')}
            </div>
            <div className={cn('mt-2 font-medium text-gray-600', sizeClasses[size])}>
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderInline = () => {
    const timeUnits = [
      { label: 'd', value: timeLeft.days, show: showDays },
      { label: 'h', value: timeLeft.hours, show: showHours },
      { label: 'm', value: timeLeft.minutes, show: showMinutes },
      { label: 's', value: timeLeft.seconds, show: showSeconds }
    ].filter(unit => unit.show)

    return (
      <div className="flex items-center gap-2">
        {timeUnits.map((unit, index) => (
          <React.Fragment key={unit.label}>
            <span className={cn('font-mono font-bold', sizeClasses[size])} style={{ color }}>
              {unit.value.toString().padStart(2, '0')}
            </span>
            <span className={cn('text-gray-500', sizeClasses[size])}>{unit.label}</span>
            {index < timeUnits.length - 1 && (
              <span className={cn('text-gray-300', sizeClasses[size])}>:</span>
            )}
          </React.Fragment>
        ))}
      </div>
    )
  }

  const renderCircle = () => {
    const timeUnits = [
      { label: 'Days', value: timeLeft.days, show: showDays },
      { label: 'Hours', value: timeLeft.hours, show: showHours },
      { label: 'Minutes', value: timeLeft.minutes, show: showMinutes },
      { label: 'Seconds', value: timeLeft.seconds, show: showSeconds }
    ].filter(unit => unit.show)

    return (
      <div className="flex gap-4 justify-center">
        {timeUnits.map((unit) => {
          const percentage = unit.showSeconds ? 
            (unit.value / 60) * 100 : 
            unit.showMinutes ? 
            (unit.value / 60) * 100 :
            unit.showHours ?
            (unit.value / 24) * 100 :
            (unit.value / 365) * 100

          return (
            <div key={unit.label} className="text-center">
              <div className="relative">
                <svg
                  className={cn('transform -rotate-90', circleSizeClasses[size])}
                  viewBox="0 0 36 36"
                >
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${percentage}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={cn('font-bold text-white', sizeClasses[size])}>
                    {unit.value.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
              <div className={cn('mt-2 font-medium text-gray-600', sizeClasses[size])}>
                {unit.label}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  if (timeLeft.total <= 0) {
    return (
      <div className="text-center">
        {title && <h3 className={cn('font-bold mb-4', sizeClasses[size])}>{title}</h3>}
        <div className={cn('text-gray-500', sizeClasses[size])}>
          Time's up!
        </div>
      </div>
    )
  }

  return (
    <div className="text-center">
      {title && (
        <h3 className={cn('font-bold mb-4', sizeClasses[size])} style={{ color }}>
          {title}
        </h3>
      )}
      
      {variant === 'boxes' && renderBoxes()}
      {variant === 'inline' && renderInline()}
      {variant === 'circle' && renderCircle()}
    </div>
  )
}

// Component configuration for editor
export const CountdownTimerConfig = {
  id: 'countdown-timer',
  name: 'Countdown Timer',
  description: 'Countdown timer for events, sales, or deadlines',
  category: 'interactive' as const,
  icon: 'clock',
  defaultProps: {
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    title: 'Sale Ends In',
    showDays: true,
    showHours: true,
    showMinutes: true,
    showSeconds: true,
    size: 'md',
    variant: 'boxes',
    color: '#3B82F6'
  },
  defaultSize: { width: 100, height: 200 },
  editableFields: [
    'targetDate',
    'title',
    'showDays',
    'showHours',
    'showMinutes',
    'showSeconds',
    'size',
    'variant',
    'color'
  ]
}
