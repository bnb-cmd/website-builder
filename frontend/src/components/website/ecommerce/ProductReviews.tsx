import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { Button } from '../../ui/button'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const ProductReviewsConfig: ComponentConfig = {
  id: 'product-reviews',
  name: 'Product Reviews',
  category: 'ecommerce',
  icon: 'Star',
  description: 'Customer reviews and ratings',
  defaultProps: { 
    title: 'Customer Reviews',
    subtitle: 'What our customers are saying',
    averageRating: 4.3,
    totalReviews: 127,
    reviews: [
      {
        name: 'Sarah Johnson',
        rating: 5,
        date: '2024-01-10',
        text: 'Excellent product! Exceeded my expectations. Highly recommend.',
        helpful: 12,
        avatar: ''
      },
      {
        name: 'Mike Chen',
        rating: 4,
        date: '2024-01-08',
        text: 'Good quality product. Fast shipping and great customer service.',
        helpful: 8,
        avatar: ''
      },
      {
        name: 'Emily Davis',
        rating: 5,
        date: '2024-01-05',
        text: 'Perfect! Exactly what I was looking for. Will definitely buy again.',
        helpful: 15,
        avatar: ''
      }
    ],
    showWriteReview: true,
    showHelpful: true
  },
  defaultSize: { width: 500, height: 600 },
  editableFields: ['title', 'subtitle', 'averageRating', 'totalReviews', 'reviews', 'showWriteReview', 'showHelpful']
}

interface Review {
  name: string
  rating: number
  date: string
  text: string
  helpful: number
  avatar: string
}

interface ProductReviewsProps extends WebsiteComponentProps {
  title: string
  subtitle: string
  averageRating: number
  totalReviews: number
  reviews: Review[]
  showWriteReview: boolean
  showHelpful: boolean
}

export const WebsiteProductReviews: React.FC<ProductReviewsProps> = ({ 
  title, 
  subtitle, 
  averageRating, 
  totalReviews, 
  reviews, 
  showWriteReview, 
  showHelpful,
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
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-sm', deviceMode)
  const ratingSize = getResponsiveTextSize('text-2xl', deviceMode)
  const reviewTextSize = getResponsiveTextSize('text-sm', deviceMode)
  const nameSize = getResponsiveTextSize('text-sm', deviceMode)
  const dateSize = getResponsiveTextSize('text-xs', deviceMode)

  return (
    <div className={cn("w-full h-full", padding)}>
      <div className="space-y-6">
        <div className="text-center">
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
        
        {/* Overall Rating */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            {renderStars(Math.floor(averageRating))}
          </div>
          <div 
            className={cn("font-bold", ratingSize)}
            onDoubleClick={onTextDoubleClick}
          >
            {averageRating}
          </div>
          <div 
            className={cn("text-gray-600", subtitleSize)}
            onDoubleClick={onTextDoubleClick}
          >
            Based on {totalReviews} reviews
          </div>
        </div>
        
        {/* Write Review Button */}
        {showWriteReview && (
          <div className="text-center">
            <Button variant="outline">
              Write a Review
            </Button>
          </div>
        )}
        
        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={review.avatar} alt={review.name} />
                    <AvatarFallback className="text-xs">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div 
                      className={cn("font-semibold", nameSize)}
                      onDoubleClick={onTextDoubleClick}
                    >
                      {review.name}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                      <span 
                        className={cn("text-gray-500", dateSize)}
                        onDoubleClick={onTextDoubleClick}
                      >
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p 
                  className={cn("text-gray-700", reviewTextSize)}
                  onDoubleClick={onTextDoubleClick}
                >
                  {review.text}
                </p>
                
                {showHelpful && (
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                      <ThumbsUp className="w-4 h-4" />
                      <span className={cn("text-xs", dateSize)}>{review.helpful}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                    <span className={cn("text-xs text-gray-500", dateSize)}>
                      Was this helpful?
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Load More Reviews */}
        <div className="text-center">
          <Button variant="outline">
            Load More Reviews
          </Button>
        </div>
      </div>
    </div>
  )
}
