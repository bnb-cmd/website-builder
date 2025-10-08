import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Star, Quote } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const ReviewsConfig: ComponentConfig = {
  id: 'reviews',
  name: 'Reviews',
  category: 'business',
  icon: 'Star',
  description: 'Display customer reviews',
  defaultProps: { 
    title: 'What Our Customers Say',
    subtitle: 'Don\'t just take our word for it',
    reviews: [
      {
        name: 'Sarah Johnson',
        role: 'CEO, TechCorp',
        rating: 5,
        text: 'Exceptional service and outstanding results. Highly recommended!',
        avatar: '',
        date: '2024-01-15'
      },
      {
        name: 'Mike Chen',
        role: 'Marketing Director',
        rating: 5,
        text: 'Professional team that delivered beyond our expectations.',
        avatar: '',
        date: '2024-01-10'
      },
      {
        name: 'Emily Davis',
        role: 'Small Business Owner',
        rating: 5,
        text: 'Amazing experience from start to finish. Will definitely work with them again.',
        avatar: '',
        date: '2024-01-08'
      }
    ],
    showAvatars: true,
    showRatings: true,
    showDates: true
  },
  defaultSize: { width: 600, height: 400 },
  editableFields: ['title', 'subtitle', 'reviews', 'showAvatars', 'showRatings', 'showDates']
}

interface Review {
  name: string
  role: string
  rating: number
  text: string
  avatar: string
  date: string
}

interface ReviewsProps extends WebsiteComponentProps {
  title: string
  subtitle: string
  reviews: Review[]
  showAvatars: boolean
  showRatings: boolean
  showDates: boolean
}

export const WebsiteReviews: React.FC<ReviewsProps> = ({ 
  title, 
  subtitle, 
  reviews, 
  showAvatars, 
  showRatings, 
  showDates,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={cn(
          "w-4 h-4",
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        )} 
      />
    ))
  }

  const padding = getResponsivePadding('p-6', deviceMode)
  const titleSize = getResponsiveTextSize('text-2xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-base', deviceMode)
  const reviewTextSize = getResponsiveTextSize('text-sm', deviceMode)
  const nameSize = getResponsiveTextSize('text-sm', deviceMode)
  const roleSize = getResponsiveTextSize('text-xs', deviceMode)
  const dateSize = getResponsiveTextSize('text-xs', deviceMode)

  return (
    <div className={cn("w-full h-full", padding)}>
      <div className="text-center mb-8">
        <h2 
          className={cn("font-bold mb-2", titleSize)}
          onDoubleClick={onTextDoubleClick}
        >
          {title}
        </h2>
        <p 
          className={cn("text-gray-600", subtitleSize)}
          onDoubleClick={onTextDoubleClick}
        >
          {subtitle}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="space-y-3">
              {showRatings && (
                <div className="flex justify-center">
                  {renderStars(review.rating)}
                </div>
              )}
              
              <div className="text-center">
                <Quote className="w-6 h-6 text-primary mx-auto mb-2" />
                <p 
                  className={cn("text-gray-700 italic", reviewTextSize)}
                  onDoubleClick={onTextDoubleClick}
                >
                  "{review.text}"
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                {showAvatars && (
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={review.avatar} alt={review.name} />
                    <AvatarFallback className="text-sm">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1">
                  <div 
                    className={cn("font-semibold", nameSize)}
                    onDoubleClick={onTextDoubleClick}
                  >
                    {review.name}
                  </div>
                  <div 
                    className={cn("text-gray-600", roleSize)}
                    onDoubleClick={onTextDoubleClick}
                  >
                    {review.role}
                  </div>
                  {showDates && (
                    <div 
                      className={cn("text-gray-500", dateSize)}
                      onDoubleClick={onTextDoubleClick}
                    >
                      {review.date}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
