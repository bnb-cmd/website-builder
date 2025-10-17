'use client'

import React, { useState } from 'react'
import { Star, ThumbsUp, ThumbsDown, Flag, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProductReviewProps {
  reviews: Array<{
    id: string
    userName: string
    userAvatar?: string
    rating: number
    title?: string
    comment: string
    date: string
    verified: boolean
    helpful: number
    images?: string[]
    variant?: string
    size?: string
    color?: string
  }>
  averageRating: number
  totalReviews: number
  ratingBreakdown: Array<{
    stars: number
    count: number
    percentage: number
  }>
  onHelpful: (reviewId: string) => void
  onReport: (reviewId: string) => void
  showImages?: boolean
  showVariant?: boolean
  showVerified?: boolean
  showHelpful?: boolean
  showReport?: boolean
  layout?: 'list' | 'grid' | 'compact'
}

export const ProductReview: React.FC<ProductReviewProps> = ({
  reviews = [
    {
      id: '1',
      userName: 'Ahmed Ali',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      rating: 5,
      title: 'Excellent quality!',
      comment: 'These headphones are amazing. Great sound quality and comfortable to wear for long periods.',
      date: '2024-01-15',
      verified: true,
      helpful: 12,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
      ],
      variant: 'Black',
      size: 'M'
    },
    {
      id: '2',
      userName: 'Sara Khan',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      rating: 4,
      title: 'Good value for money',
      comment: 'Decent headphones for the price. Battery life could be better but overall satisfied.',
      date: '2024-01-10',
      verified: true,
      helpful: 8,
      variant: 'White',
      size: 'L'
    }
  ],
  averageRating = 4.3,
  totalReviews = 128,
  ratingBreakdown = [
    { stars: 5, count: 65, percentage: 51 },
    { stars: 4, count: 35, percentage: 27 },
    { stars: 3, count: 15, percentage: 12 },
    { stars: 2, count: 8, percentage: 6 },
    { stars: 1, count: 5, percentage: 4 }
  ],
  onHelpful,
  onReport,
  showImages = true,
  showVariant = true,
  showVerified = true,
  showHelpful = true,
  showReport = true,
  layout = 'list'
}) => {
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set())

  const handleHelpful = (reviewId: string) => {
    setHelpfulReviews(prev => {
      const newSet = new Set(prev)
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId)
      } else {
        newSet.add(reviewId)
      }
      return newSet
    })
    onHelpful(reviewId)
  }

  const renderStars = (rating: number, size: 'sm' | 'md' = 'md') => {
    const starSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          starSize,
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        )}
      />
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const RatingSummary = () => (
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{averageRating}</div>
          <div className="flex justify-center mb-1">{renderStars(averageRating)}</div>
          <div className="text-sm text-gray-600">{totalReviews} reviews</div>
        </div>
        
        <div className="flex-1">
          {ratingBreakdown.map((breakdown) => (
            <div key={breakdown.stars} className="flex items-center gap-2 mb-1">
              <span className="text-sm text-gray-600 w-8">{breakdown.stars}★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${breakdown.percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{breakdown.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const ReviewItem = ({ review }: { review: any }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3 mb-3">
        <img
          src={review.userAvatar || 'https://via.placeholder.com/40x40'}
          alt={review.userName}
          className="w-10 h-10 rounded-full object-cover"
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900">{review.userName}</h4>
            {showVerified && review.verified && (
              <CheckCircle className="w-4 h-4 text-green-600" />
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">{renderStars(review.rating, 'sm')}</div>
            <span className="text-sm text-gray-600">{formatDate(review.date)}</span>
          </div>

          {review.title && (
            <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
          )}

          <p className="text-gray-700 mb-3">{review.comment}</p>

          {showVariant && (review.variant || review.size || review.color) && (
            <div className="text-sm text-gray-600 mb-3">
              <span>Purchased: </span>
              {review.variant && <span>{review.variant}</span>}
              {review.size && <span className="ml-2">Size {review.size}</span>}
              {review.color && <span className="ml-2">Color {review.color}</span>}
            </div>
          )}

          {showImages && review.images && review.images.length > 0 && (
            <div className="flex gap-2 mb-3">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-16 h-16 object-cover rounded"
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            {showHelpful && (
              <button
                onClick={() => handleHelpful(review.id)}
                className={cn(
                  'flex items-center gap-1 text-sm transition',
                  helpfulReviews.has(review.id)
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                )}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Helpful ({review.helpful})</span>
              </button>
            )}
            
            {showReport && (
              <button
                onClick={() => onReport(review.id)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition"
              >
                <Flag className="w-4 h-4" />
                <span>Report</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const CompactReview = ({ review }: { review: any }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-3 mb-3">
      <div className="flex items-center gap-2 mb-2">
        <img
          src={review.userAvatar || 'https://via.placeholder.com/32x32'}
          alt={review.userName}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 text-sm">{review.userName}</span>
            {showVerified && review.verified && (
              <CheckCircle className="w-3 h-3 text-green-600" />
            )}
          </div>
          <div className="flex items-center gap-1">
            <div className="flex">{renderStars(review.rating, 'sm')}</div>
            <span className="text-xs text-gray-600">{formatDate(review.date)}</span>
          </div>
        </div>
      </div>
      
      {review.title && (
        <h5 className="font-medium text-gray-900 text-sm mb-1">{review.title}</h5>
      )}
      
      <p className="text-gray-700 text-sm mb-2 line-clamp-2">{review.comment}</p>
      
      <div className="flex items-center gap-3">
        {showHelpful && (
          <button
            onClick={() => handleHelpful(review.id)}
            className={cn(
              'flex items-center gap-1 text-xs transition',
              helpfulReviews.has(review.id)
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            )}
          >
            <ThumbsUp className="w-3 h-3" />
            <span>{review.helpful}</span>
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div>
      <RatingSummary />
      
      <div className="space-y-4">
        {reviews.map((review) => (
          layout === 'compact' ? (
            <CompactReview key={review.id} review={review} />
          ) : (
            <ReviewItem key={review.id} review={review} />
          )
        ))}
      </div>
    </div>
  )
}

// Component configuration for editor
export const ProductReviewConfig = {
  id: 'product-review',
  name: 'Product Review',
  description: 'Product reviews and ratings display component',
  category: 'ecommerce' as const,
  icon: 'star',
  defaultProps: {
    reviews: [
      {
        id: '1',
        userName: 'Ahmed Ali',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        rating: 5,
        title: 'Excellent quality!',
        comment: 'These headphones are amazing. Great sound quality and comfortable to wear.',
        date: '2024-01-15',
        verified: true,
        helpful: 12,
        variant: 'Black',
        size: 'M'
      }
    ],
    averageRating: 4.3,
    totalReviews: 128,
    ratingBreakdown: [
      { stars: 5, count: 65, percentage: 51 },
      { stars: 4, count: 35, percentage: 27 },
      { stars: 3, count: 15, percentage: 12 },
      { stars: 2, count: 8, percentage: 6 },
      { stars: 1, count: 5, percentage: 4 }
    ],
    showImages: true,
    showVariant: true,
    showVerified: true,
    showHelpful: true,
    showReport: true,
    layout: 'list'
  },
  defaultSize: { width: 100, height: 500 },
  editableFields: [
    'reviews',
    'averageRating',
    'totalReviews',
    'ratingBreakdown',
    'showImages',
    'showVariant',
    'showVerified',
    'showHelpful',
    'showReport',
    'layout'
  ]
}
