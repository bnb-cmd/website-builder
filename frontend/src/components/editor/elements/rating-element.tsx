import { Element, ViewMode } from '@/types/editor'
import { cn } from '@/lib/utils'
import { Star, Heart, ThumbsUp, MessageCircle } from 'lucide-react'

interface RatingElementProps {
  element: Element
  onUpdate: (elementId: string, updates: Partial<Element>) => void
  viewMode: ViewMode
  style: React.CSSProperties
}

export function RatingElement({ element, onUpdate, viewMode, style }: RatingElementProps) {
  const handleRatingChange = (rating: number) => {
    onUpdate(element.id, {
      props: {
        ...element.props,
        rating: rating
      }
    })
  }

  const getIcon = () => {
    switch (element.props.icon) {
      case 'star':
        return Star
      case 'heart':
        return Heart
      case 'thumbs':
        return ThumbsUp
      case 'message':
        return MessageCircle
      default:
        return Star
    }
  }

  const getSizeClass = () => {
    switch (element.props.size) {
      case 'sm':
        return 'h-4 w-4'
      case 'lg':
        return 'h-8 w-8'
      case 'xl':
        return 'h-10 w-10'
      case 'md':
      default:
        return 'h-5 w-5'
    }
  }

  const getColorClass = () => {
    switch (element.props.color) {
      case 'yellow':
        return 'text-yellow-500'
      case 'red':
        return 'text-red-500'
      case 'green':
        return 'text-green-500'
      case 'blue':
        return 'text-blue-500'
      case 'purple':
        return 'text-purple-500'
      default:
        return 'text-yellow-500'
    }
  }

  const Icon = getIcon()
  const maxRating = element.props.maxRating || 5
  const currentRating = element.props.rating || 0
  const allowHalf = element.props.allowHalf || false
  const readOnly = element.props.readOnly || false

  return (
    <div
      className="flex items-center space-x-1"
      style={style}
    >
      {Array.from({ length: maxRating }).map((_, index) => {
        const rating = index + 1
        const isActive = rating <= currentRating
        const isHalf = allowHalf && rating === Math.ceil(currentRating) && currentRating % 1 !== 0
        
        return (
          <button
            key={index}
            className={cn(
              'transition-colors',
              getSizeClass(),
              isActive ? getColorClass() : 'text-gray-300',
              !readOnly && 'hover:scale-110 cursor-pointer',
              readOnly && 'cursor-default'
            )}
            onClick={() => !readOnly && handleRatingChange(rating)}
            disabled={readOnly}
          >
            <Icon className="h-full w-full" />
          </button>
        )
      })}
      
      {element.props.showValue && (
        <span className="ml-2 text-sm text-muted-foreground">
          {currentRating}/{maxRating}
        </span>
      )}
      
      {element.props.showText && (
        <span className="ml-2 text-sm text-muted-foreground">
          {currentRating === 0 ? 'No rating' : 
           currentRating === 1 ? 'Poor' :
           currentRating === 2 ? 'Fair' :
           currentRating === 3 ? 'Good' :
           currentRating === 4 ? 'Very Good' :
           'Excellent'}
        </span>
      )}
    </div>
  )
}
