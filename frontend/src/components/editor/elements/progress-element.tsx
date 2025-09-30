'use client'

import { Element } from '@/types/editor'
import { useEffect, useState } from 'react'

interface ProgressElementProps {
  element: Element
  isSelected: boolean
  onSelect: () => void
}

export function ProgressElement({ element, isSelected, onSelect }: ProgressElementProps) {
  const { 
    value = 75, 
    max = 100, 
    label = 'Progress',
    showPercentage = true,
    animate = true,
    color = 'primary',
    size = 'medium'
  } = element.props
  
  const [progress, setProgress] = useState(animate ? 0 : value)
  
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setProgress(value)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [animate, value])
  
  const percentage = Math.round((progress / max) * 100)
  
  const sizeClasses = {
    small: 'h-2',
    medium: 'h-4',
    large: 'h-6'
  }
  
  const colorClasses = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  }

  return (
    <div
      onClick={onSelect}
      className={`
        p-6 cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">{label}</span>
          {showPercentage && (
            <span className="text-sm text-muted-foreground">{percentage}%</span>
          )}
        </div>
        
        <div className={`w-full bg-muted rounded-full overflow-hidden ${sizeClasses[size as keyof typeof sizeClasses]}`}>
          <div
            className={`h-full transition-all duration-1000 ease-out ${colorClasses[color as keyof typeof colorClasses]}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}
