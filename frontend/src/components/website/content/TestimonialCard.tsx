'use client'

import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Building, Globe, Calendar, Clock, CheckCircle, Star, DollarSign, CreditCard, MessageSquare, FileText, Shield, Lock, Heart, ThumbsUp, Share2, Bookmark, Play, Pause, Volume2, VolumeX, Music, Mic, MicOff, Headphones, Instagram, Facebook, Twitter, Linkedin, Youtube, TikTok, Pinterest, Snapchat, Search, Filter, SortAsc, SortDesc, Award, Trophy, Medal, Target, TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TestimonialCardProps {
  testimonial: {
    id: string
    content: string
    author: {
      name: string
      title: string
      company: string
      avatar: string
      verified?: boolean
    }
    rating: number
    date: string
    location?: string
    product?: string
  }
  onLike?: (testimonialId: string) => void
  onShare?: (testimonialId: string) => void
  showRating?: boolean
  showAuthor?: boolean
  showDate?: boolean
  showLocation?: boolean
  showProduct?: boolean
  showVerifiedBadge?: boolean
  showEngagement?: boolean
  layout?: 'card' | 'quote' | 'minimal' | 'featured'
  theme?: 'light' | 'dark' | 'colored'
  size?: 'sm' | 'md' | 'lg'
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial = {
    id: '1',
    content: 'This service exceeded all my expectations. The team was professional, responsive, and delivered exactly what we needed. Highly recommended!',
    author: {
      name: 'Sarah Johnson',
      title: 'Marketing Director',
      company: 'TechCorp',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      verified: true
    },
    rating: 5,
    date: '2024-01-15',
    location: 'Karachi, Pakistan',
    product: 'Web Development Service'
  },
  onLike,
  onShare,
  showRating = true,
  showAuthor = true,
  showDate = true,
  showLocation = false,
  showProduct = false,
  showVerifiedBadge = true,
  showEngagement = false,
  layout = 'card',
  theme = 'light',
  size = 'md'
}) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(12)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(prev => isLiked ? prev - 1 : prev + 1)
    onLike?.(testimonial.id)
  }

  const handleShare = () => {
    onShare?.(testimonial.id)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-3',
          content: 'text-sm',
          author: 'text-xs',
          title: 'text-xs',
          spacing: 'gap-2'
        }
      case 'lg':
        return {
          container: 'p-6',
          content: 'text-lg',
          author: 'text-base',
          title: 'text-sm',
          spacing: 'gap-4'
        }
      default: // md
        return {
          container: 'p-4',
          content: 'text-base',
          author: 'text-sm',
          title: 'text-sm',
          spacing: 'gap-3'
        }
    }
  }

  const sizeClasses = getSizeClasses()

  const containerClass = cn(
    'rounded-lg border',
    theme === 'dark' 
      ? 'bg-gray-900 border-gray-700'
      : theme === 'colored'
      ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
      : 'bg-white border-gray-200'
  )

  const textClass = cn(
    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
  )

  const secondaryTextClass = cn(
    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  )

  const quoteClass = cn(
    'text-6xl font-bold opacity-20',
    theme === 'dark' ? 'text-white' : 'text-gray-300'
  )

  if (layout === 'quote') {
    return (
      <div className={cn(containerClass, 'relative')}>
        <div className={cn('absolute top-4 left-4', quoteClass)}>"</div>
        
        <div className={cn('pt-8', sizeClasses.container)}>
          <blockquote className={cn('italic mb-4', sizeClasses.content, textClass)}>
            {testimonial.content}
          </blockquote>
          
          {showRating && (
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'w-4 h-4',
                    star <= testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  )}
                />
              ))}
            </div>
          )}
          
          {showAuthor && (
            <div className="flex items-center gap-3">
              <img
                src={testimonial.author.avatar}
                alt={testimonial.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className={cn('font-medium', sizeClasses.author, textClass)}>
                    {testimonial.author.name}
                  </h4>
                  {showVerifiedBadge && testimonial.author.verified && (
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <p className={cn(sizeClasses.title, secondaryTextClass)}>
                  {testimonial.author.title} at {testimonial.author.company}
                </p>
                {showDate && (
                  <p className={cn('text-xs', secondaryTextClass)}>
                    {formatDate(testimonial.date)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (layout === 'minimal') {
    return (
      <div className={containerClass}>
        <div className={cn('flex items-start gap-3', sizeClasses.spacing)}>
          <img
            src={testimonial.author.avatar}
            alt={testimonial.author.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          
          <div className="flex-1">
            <p className={cn('mb-2', sizeClasses.content, textClass)}>
              "{testimonial.content}"
            </p>
            
            <div className="flex items-center gap-2">
              <h4 className={cn('font-medium', sizeClasses.author, textClass)}>
                {testimonial.author.name}
              </h4>
              {showVerifiedBadge && testimonial.author.verified && (
                <CheckCircle className="w-3 h-3 text-blue-500" />
              )}
              {showRating && (
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        'w-3 h-3',
                        star <= testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (layout === 'featured') {
    return (
      <div className={cn(containerClass, 'relative overflow-hidden')}>
        <div className={cn('absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-5')} />
        
        <div className={cn('relative', sizeClasses.container)}>
          <div className="text-center mb-6">
            {showRating && (
              <div className="flex justify-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'w-5 h-5',
                      star <= testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
            )}
            
            <blockquote className={cn('text-xl italic mb-6', textClass)}>
              "{testimonial.content}"
            </blockquote>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <img
              src={testimonial.author.avatar}
              alt={testimonial.author.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <h4 className={cn('font-semibold text-lg', textClass)}>
                  {testimonial.author.name}
                </h4>
                {showVerifiedBadge && testimonial.author.verified && (
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <p className={cn('text-sm', secondaryTextClass)}>
                {testimonial.author.title} at {testimonial.author.company}
              </p>
              {showDate && (
                <p className={cn('text-xs', secondaryTextClass)}>
                  {formatDate(testimonial.date)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Card layout (default)
  return (
    <div className={containerClass}>
      <div className={sizeClasses.container}>
        <div className={cn('space-y-4', sizeClasses.spacing)}>
          {showRating && (
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'w-4 h-4',
                    star <= testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  )}
                />
              ))}
            </div>
          )}
          
          <blockquote className={cn('italic', sizeClasses.content, textClass)}>
            "{testimonial.content}"
          </blockquote>
          
          {showAuthor && (
            <div className="flex items-center gap-3">
              <img
                src={testimonial.author.avatar}
                alt={testimonial.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className={cn('font-medium', sizeClasses.author, textClass)}>
                    {testimonial.author.name}
                  </h4>
                  {showVerifiedBadge && testimonial.author.verified && (
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <p className={cn(sizeClasses.title, secondaryTextClass)}>
                  {testimonial.author.title} at {testimonial.author.company}
                </p>
                {showDate && (
                  <p className={cn('text-xs', secondaryTextClass)}>
                    {formatDate(testimonial.date)}
                  </p>
                )}
                {showLocation && testimonial.location && (
                  <p className={cn('text-xs', secondaryTextClass)}>
                    📍 {testimonial.location}
                  </p>
                )}
                {showProduct && testimonial.product && (
                  <p className={cn('text-xs', secondaryTextClass)}>
                    🛍️ {testimonial.product}
                  </p>
                )}
              </div>
            </div>
          )}
          
          {showEngagement && (
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={cn(
                    'flex items-center gap-1 text-sm transition',
                    isLiked ? 'text-red-500' : secondaryTextClass
                  )}
                >
                  <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
                  <span>{likes}</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className={cn('flex items-center gap-1 text-sm transition', secondaryTextClass)}
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Component configuration for editor
export const TestimonialCardConfig = {
  id: 'testimonial-card',
  name: 'Testimonial Card',
  description: 'Customer testimonial card with rating, author info, and multiple layouts',
  category: 'content' as const,
  icon: 'message-square',
  defaultProps: {
    testimonial: {
      id: '1',
      content: 'This service exceeded all my expectations. The team was professional, responsive, and delivered exactly what we needed. Highly recommended!',
      author: {
        name: 'Sarah Johnson',
        title: 'Marketing Director',
        company: 'TechCorp',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        verified: true
      },
      rating: 5,
      date: '2024-01-15',
      location: 'Karachi, Pakistan',
      product: 'Web Development Service'
    },
    showRating: true,
    showAuthor: true,
    showDate: true,
    showLocation: false,
    showProduct: false,
    showVerifiedBadge: true,
    showEngagement: false,
    layout: 'card',
    theme: 'light',
    size: 'md'
  },
  defaultSize: { width: 100, height: 300 },
  editableFields: [
    'testimonial',
    'onLike',
    'onShare',
    'showRating',
    'showAuthor',
    'showDate',
    'showLocation',
    'showProduct',
    'showVerifiedBadge',
    'showEngagement',
    'layout',
    'theme',
    'size'
  ]
}
