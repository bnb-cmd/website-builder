'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  color?: string
  backgroundColor?: string
  animated?: boolean
  striped?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  rounded?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 75,
  max = 100,
  label = 'Progress',
  showPercentage = true,
  color,
  backgroundColor = '#E5E7EB',
  animated = false,
  striped = false,
  size = 'md',
  variant = 'default',
  rounded = true
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  }

  const getVariantColor = () => {
    if (color) return color
    
    switch (variant) {
      case 'success':
        return '#10B981'
      case 'warning':
        return '#F59E0B'
      case 'error':
        return '#EF4444'
      case 'info':
        return '#3B82F6'
      default:
        return '#3B82F6'
    }
  }

  const progressBarClasses = cn(
    'w-full overflow-hidden',
    sizeClasses[size],
    rounded ? 'rounded-full' : 'rounded-none',
    backgroundColor === '#E5E7EB' ? 'bg-gray-200' : '',
    backgroundColor !== '#E5E7EB' && `bg-[${backgroundColor}]`
  )

  const progressFillClasses = cn(
    'h-full transition-all duration-300 ease-out',
    rounded ? 'rounded-full' : 'rounded-none',
    animated && 'animate-pulse',
    striped && 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_20px]'
  )

  return (
    <div className="w-full">
      {/* Label and Percentage */}
      <div className="flex justify-between items-center mb-2">
        {label && (
          <span className="text-sm font-medium text-gray-700">
            {label}
          </span>
        )}
        {showPercentage && (
          <span className="text-sm font-medium text-gray-600">
            {Math.round(percentage)}%
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className={progressBarClasses} style={{ backgroundColor }}>
        <div
          className={progressFillClasses}
          style={{
            width: `${percentage}%`,
            backgroundColor: getVariantColor()
          }}
        />
      </div>

      {/* Value Display */}
      <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
        <span>{value}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

// Component configuration for editor
export const ProgressBarConfig = {
  id: 'progress-bar',
  name: 'Progress Bar',
  description: 'Animated progress indicator with customizable styling',
  category: 'interactive' as const,
  icon: 'bar-chart',
  defaultProps: {
    value: 75,
    max: 100,
    label: 'Progress',
    showPercentage: true,
    color: '#3B82F6',
    backgroundColor: '#E5E7EB',
    animated: false,
    striped: false,
    size: 'md',
    variant: 'default',
    rounded: true
  },
  defaultSize: { width: 100, height: 60 },
  editableFields: [
    'value',
    'max',
    'label',
    'showPercentage',
    'color',
    'backgroundColor',
    'animated',
    'striped',
    'size',
    'variant',
    'rounded'
  ]
}
