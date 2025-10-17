'use client'

import React, { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface RatingProps {
  value: number
  max?: number
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: string
  emptyColor?: string
  showValue?: boolean
  showLabel?: boolean
  label?: string
  onChange?: (value: number) => void
  halfRatings?: boolean
}

export const Rating: React.FC<RatingProps> = ({
  value = 4,
  max = 5,
  readonly = false,
  size = 'md',
  color = '#FBBF24',
  emptyColor = '#D1D5DB',
  showValue = false,
  showLabel = false,
  label = 'Rating',
  onChange,
  halfRatings = false
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null)
  const [currentValue, setCurrentValue] = useState(value)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const handleClick = (rating: number) => {
    if (readonly) return
    
    setCurrentValue(rating)
    onChange?.(rating)
  }

  const handleMouseEnter = (rating: number) => {
    if (readonly) return
    setHoverValue(rating)
  }

  const handleMouseLeave = () => {
    if (readonly) return
    setHoverValue(null)
  }

  const displayValue = hoverValue !== null ? hoverValue : currentValue

  const renderStar = (index: number) => {
    const starValue = index + 1
    const isFilled = starValue <= displayValue
    const isHalfFilled = halfRatings && starValue === Math.ceil(displayValue) && displayValue % 1 !== 0

    return (
      <button
        key={index}
        type="button"
        onClick={() => handleClick(starValue)}
        onMouseEnter={() => handleMouseEnter(starValue)}
        onMouseLeave={handleMouseLeave}
        disabled={readonly}
        className={cn(
          'transition-colors duration-150',
          !readonly && 'cursor-pointer hover:scale-110',
          readonly && 'cursor-default'
        )}
        aria-label={`Rate ${starValue} out of ${max}`}
      >
        <Star
          className={cn(
            sizeClasses[size],
            'transition-colors duration-150',
            isFilled && !isHalfFilled && 'fill-current',
            isHalfFilled && 'fill-current opacity-50'
          )}
          style={{
            color: isFilled || isHalfFilled ? color : emptyColor
          }}
        />
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      {showLabel && (
        <span className="text-sm font-medium text-gray-700">
          {label}
        </span>
      )}

      {/* Stars */}
      <div className="flex items-center gap-1">
        {Array.from({ length: max }, (_, index) => renderStar(index))}
        
        {/* Value Display */}
        {showValue && (
          <span className="ml-2 text-sm font-medium text-gray-600">
            {displayValue.toFixed(halfRatings ? 1 : 0)}/{max}
          </span>
        )}
      </div>

      {/* Half Rating Instructions */}
      {halfRatings && !readonly && (
        <p className="text-xs text-gray-500">
          Click and hold for half ratings
        </p>
      )}
    </div>
  )
}

// Component configuration for editor
export const RatingConfig = {
  id: 'rating',
  name: 'Star Rating',
  description: 'Interactive star rating component with customizable appearance',
  category: 'interactive' as const,
  icon: 'star',
  defaultProps: {
    value: 4,
    max: 5,
    readonly: false,
    size: 'md',
    color: '#FBBF24',
    emptyColor: '#D1D5DB',
    showValue: false,
    showLabel: false,
    label: 'Rating',
    halfRatings: false
  },
  defaultSize: { width: 100, height: 40 },
  editableFields: [
    'value',
    'max',
    'readonly',
    'size',
    'color',
    'emptyColor',
    'showValue',
    'showLabel',
    'label',
    'halfRatings'
  ]
}
