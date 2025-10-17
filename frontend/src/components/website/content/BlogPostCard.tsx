'use client'

import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Building, Globe, Calendar, Clock, CheckCircle, Star, DollarSign, CreditCard, MessageSquare, FileText, Shield, Lock, Heart, ThumbsUp, Share2, Bookmark, Play, Pause, Volume2, VolumeX, Music, Mic, MicOff, Headphones, Instagram, Facebook, Twitter, Linkedin, Youtube, TikTok, Pinterest, Snapchat, Search, Filter, SortAsc, SortDesc } from '@/lib/icons'
import { cn } from '@/lib/utils'

export interface BlogPostCardProps {
  post: {
    id: string
    title: string
    excerpt: string
    content: string
    author: {
      name: string
      avatar: string
      bio?: string
    }
    publishedAt: string
    readTime: number
    category: string
    tags: string[]
    image: string
    likes: number
    comments: number
    shares: number
    isLiked?: boolean
    isBookmarked?: boolean
  }
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
  onShare?: (postId: string) => void
  onBookmark?: (postId: string) => void
  onReadMore?: (postId: string) => void
  showAuthor?: boolean
  showDate?: boolean
  showReadTime?: boolean
  showCategory?: boolean
  showTags?: boolean
  showEngagement?: boolean
  showExcerpt?: boolean
  layout?: 'card' | 'list' | 'compact' | 'featured'
  theme?: 'light' | 'dark' | 'colored'
  size?: 'sm' | 'md' | 'lg'
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({
  post = {
    id: '1',
    title: 'How to Build a Modern Website',
    excerpt: 'Learn the essential steps to create a stunning, responsive website that converts visitors into customers.',
    content: 'Full blog post content goes here...',
    author: {
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      bio: 'Web Developer & Designer'
    },
    publishedAt: '2024-01-15',
    readTime: 5,
    category: 'Web Development',
    tags: ['React', 'Next.js', 'Web Design'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    likes: 42,
    comments: 8,
    shares: 3,
    isLiked: false,
    isBookmarked: false
  },
  onLike,
  onComment,
  onShare,
  onBookmark,
  onReadMore,
  showAuthor = true,
  showDate = true,
  showReadTime = true,
  showCategory = true,
  showTags = true,
  showEngagement = true,
  showExcerpt = true,
  layout = 'card',
  theme = 'light',
  size = 'md'
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false)
  const [likes, setLikes] = useState(post.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(prev => isLiked ? prev - 1 : prev + 1)
    onLike?.(post.id)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    onBookmark?.(post.id)
  }

  const handleComment = () => {
    onComment?.(post.id)
  }

  const handleShare = () => {
    onShare?.(post.id)
  }

  const handleReadMore = () => {
    onReadMore?.(post.id)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-3',
          image: 'h-32',
          title: 'text-sm',
          excerpt: 'text-xs',
          author: 'text-xs',
          meta: 'text-xs',
          spacing: 'gap-2'
        }
      case 'lg':
        return {
          container: 'p-6',
          image: 'h-64',
          title: 'text-xl',
          excerpt: 'text-base',
          author: 'text-sm',
          meta: 'text-sm',
          spacing: 'gap-4'
        }
      default: // md
        return {
          container: 'p-4',
          image: 'h-48',
          title: 'text-lg',
          excerpt: 'text-sm',
          author: 'text-sm',
          meta: 'text-sm',
          spacing: 'gap-3'
        }
    }
  }

  const sizeClasses = getSizeClasses()

  const containerClass = cn(
    'rounded-lg border overflow-hidden transition hover:shadow-lg',
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

  const buttonClass = cn(
    'p-2 rounded-full transition',
    theme === 'dark' 
      ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  )

  if (layout === 'list') {
    return (
      <div className={containerClass}>
        <div className="flex gap-4">
          <img
            src={post.image}
            alt={post.title}
            className={cn('w-32 rounded-lg object-cover', sizeClasses.image)}
          />
          
          <div className="flex-1">
            <div className={cn('space-y-2', sizeClasses.spacing)}>
              {showCategory && (
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {post.category}
                </span>
              )}
              
              <h3 className={cn('font-semibold', sizeClasses.title, textClass)}>
                {post.title}
              </h3>
              
              {showExcerpt && (
                <p className={cn(sizeClasses.excerpt, secondaryTextClass)}>
                  {post.excerpt}
                </p>
              )}
              
              <div className="flex items-center gap-4">
                {showAuthor && (
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className={cn(sizeClasses.author, secondaryTextClass)}>
                      {post.author.name}
                    </span>
                  </div>
                )}
                
                {showDate && (
                  <span className={cn(sizeClasses.meta, secondaryTextClass)}>
                    {formatDate(post.publishedAt)}
                  </span>
                )}
                
                {showReadTime && (
                  <span className={cn(sizeClasses.meta, secondaryTextClass)}>
                    {post.readTime} min read
                  </span>
                )}
              </div>
              
              {showTags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              {showEngagement && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={cn(
                      'flex items-center gap-1 transition',
                      isLiked ? 'text-red-500' : buttonClass
                    )}
                  >
                    <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
                    <span className="text-xs">{formatNumber(likes)}</span>
                  </button>
                  
                  <button
                    onClick={handleComment}
                    className={cn('flex items-center gap-1', buttonClass)}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs">{formatNumber(post.comments)}</span>
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className={cn('flex items-center gap-1', buttonClass)}
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-xs">{formatNumber(post.shares)}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (layout === 'compact') {
    return (
      <div className={containerClass}>
        <div className="flex items-center gap-3">
          <img
            src={post.image}
            alt={post.title}
            className="w-16 h-16 rounded-lg object-cover"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className={cn('font-medium truncate', sizeClasses.title, textClass)}>
              {post.title}
            </h3>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {showAuthor && (
                <span>{post.author.name}</span>
              )}
              {showDate && (
                <span>• {formatDate(post.publishedAt)}</span>
              )}
              {showReadTime && (
                <span>• {post.readTime} min</span>
              )}
            </div>
          </div>
          
          {showEngagement && (
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">{formatNumber(likes)}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (layout === 'featured') {
    return (
      <div className={cn(containerClass, 'relative')}>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-64 object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="space-y-3">
            {showCategory && (
              <span className="inline-block px-3 py-1 bg-white bg-opacity-20 text-white text-sm rounded-full">
                {post.category}
              </span>
            )}
            
            <h3 className={cn('font-bold', sizeClasses.title)}>
              {post.title}
            </h3>
            
            {showExcerpt && (
              <p className={cn(sizeClasses.excerpt, 'text-gray-200')}>
                {post.excerpt}
              </p>
            )}
            
            <div className="flex items-center gap-4">
              {showAuthor && (
                <div className="flex items-center gap-2">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className={cn(sizeClasses.author, 'text-gray-200')}>
                    {post.author.name}
                  </span>
                </div>
              )}
              
              {showDate && (
                <span className={cn(sizeClasses.meta, 'text-gray-300')}>
                  {formatDate(post.publishedAt)}
                </span>
              )}
              
              {showReadTime && (
                <span className={cn(sizeClasses.meta, 'text-gray-300')}>
                  {post.readTime} min read
                </span>
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
      <img
        src={post.image}
        alt={post.title}
        className={cn('w-full object-cover', sizeClasses.image)}
      />
      
      <div className={sizeClasses.container}>
        <div className={cn('space-y-3', sizeClasses.spacing)}>
          {showCategory && (
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {post.category}
            </span>
          )}
          
          <h3 className={cn('font-semibold', sizeClasses.title, textClass)}>
            {post.title}
          </h3>
          
          {showExcerpt && (
            <p className={cn(sizeClasses.excerpt, secondaryTextClass)}>
              {post.excerpt}
            </p>
          )}
          
          <div className="flex items-center gap-4">
            {showAuthor && (
              <div className="flex items-center gap-2">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className={cn(sizeClasses.author, secondaryTextClass)}>
                  {post.author.name}
                </span>
              </div>
            )}
            
            {showDate && (
              <span className={cn(sizeClasses.meta, secondaryTextClass)}>
                {formatDate(post.publishedAt)}
              </span>
            )}
            
            {showReadTime && (
              <span className={cn(sizeClasses.meta, secondaryTextClass)}>
                {post.readTime} min read
              </span>
            )}
          </div>
          
          {showTags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {showEngagement && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={cn(
                    'flex items-center gap-1 transition',
                    isLiked ? 'text-red-500' : buttonClass
                  )}
                >
                  <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
                  <span className="text-xs">{formatNumber(likes)}</span>
                </button>
                
                <button
                  onClick={handleComment}
                  className={cn('flex items-center gap-1', buttonClass)}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-xs">{formatNumber(post.comments)}</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className={cn('flex items-center gap-1', buttonClass)}
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs">{formatNumber(post.shares)}</span>
                </button>
              </div>
              
              <button
                onClick={handleBookmark}
                className={cn(
                  'transition',
                  isBookmarked ? 'text-blue-500' : buttonClass
                )}
              >
                <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
              </button>
            </div>
          )}
          
          <button
            onClick={handleReadMore}
            className={cn(
              'w-full py-2 px-4 rounded-lg font-medium transition',
              theme === 'dark'
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
            )}
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  )
}

// Component configuration for editor
export const BlogPostCardConfig = {
  id: 'blog-post-card',
  name: 'Blog Post Card',
  description: 'Blog post card with author info, engagement metrics, and multiple layouts',
  category: 'content' as const,
  icon: 'file-text',
  defaultProps: {
    post: {
      id: '1',
      title: 'How to Build a Modern Website',
      excerpt: 'Learn the essential steps to create a stunning, responsive website that converts visitors into customers.',
      content: 'Full blog post content goes here...',
      author: {
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        bio: 'Web Developer & Designer'
      },
      publishedAt: '2024-01-15',
      readTime: 5,
      category: 'Web Development',
      tags: ['React', 'Next.js', 'Web Design'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      likes: 42,
      comments: 8,
      shares: 3,
      isLiked: false,
      isBookmarked: false
    },
    showAuthor: true,
    showDate: true,
    showReadTime: true,
    showCategory: true,
    showTags: true,
    showEngagement: true,
    showExcerpt: true,
    layout: 'card',
    theme: 'light',
    size: 'md'
  },
  defaultSize: { width: 100, height: 400 },
  editableFields: [
    'post',
    'onLike',
    'onComment',
    'onShare',
    'onBookmark',
    'onReadMore',
    'showAuthor',
    'showDate',
    'showReadTime',
    'showCategory',
    'showTags',
    'showEngagement',
    'showExcerpt',
    'layout',
    'theme',
    'size'
  ]
}
