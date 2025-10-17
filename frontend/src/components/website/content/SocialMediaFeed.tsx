'use client'

import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Building, Globe, Calendar, Clock, CheckCircle, Star, DollarSign, CreditCard, MessageSquare, FileText, Shield, Lock, Heart, ThumbsUp, Share2, Bookmark } from '@/lib/icons'
import { cn } from '@/lib/utils'

export interface SocialMediaFeedProps {
  posts: Array<{
    id: string
    author: {
      name: string
      avatar: string
      handle: string
      verified?: boolean
    }
    content: string
    image?: string
    video?: string
    timestamp: string
    likes: number
    comments: number
    shares: number
    isLiked?: boolean
    isBookmarked?: boolean
  }>
  onLike?: (postId: string) => void
  onComment?: (postId: string, comment: string) => void
  onShare?: (postId: string) => void
  onBookmark?: (postId: string) => void
  showEngagement?: boolean
  showTimestamps?: boolean
  showVerifiedBadges?: boolean
  layout?: 'feed' | 'grid' | 'compact'
  theme?: 'light' | 'dark' | 'colored'
  maxPosts?: number
  showLoadMore?: boolean
  onLoadMore?: () => void
}

export const SocialMediaFeed: React.FC<SocialMediaFeedProps> = ({
  posts = [
    {
      id: '1',
      author: {
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        handle: '@johndoe',
        verified: true
      },
      content: 'Just launched our new website! Check it out and let me know what you think. #webdesign #launch',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      timestamp: '2 hours ago',
      likes: 42,
      comments: 8,
      shares: 3,
      isLiked: false,
      isBookmarked: false
    },
    {
      id: '2',
      author: {
        name: 'Sarah Wilson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        handle: '@sarahw',
        verified: false
      },
      content: 'Working on some exciting new features for our platform. Can\'t wait to share them with you all!',
      timestamp: '4 hours ago',
      likes: 28,
      comments: 5,
      shares: 2,
      isLiked: true,
      isBookmarked: true
    },
    {
      id: '3',
      author: {
        name: 'Tech Company',
        avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=face',
        handle: '@techcompany',
        verified: true
      },
      content: 'Our team is growing! We\'re looking for talented developers to join us. Check out our careers page.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
      timestamp: '6 hours ago',
      likes: 156,
      comments: 23,
      shares: 12,
      isLiked: false,
      isBookmarked: false
    }
  ],
  onLike,
  onComment,
  onShare,
  onBookmark,
  showEngagement = true,
  showTimestamps = true,
  showVerifiedBadges = true,
  layout = 'feed',
  theme = 'light',
  maxPosts = 10,
  showLoadMore = true,
  onLoadMore
}) => {
  const [localPosts, setLocalPosts] = useState(posts)
  const [newComment, setNewComment] = useState<Record<string, string>>({})
  const [showCommentBox, setShowCommentBox] = useState<Record<string, boolean>>({})

  const handleLike = (postId: string) => {
    setLocalPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        }
      }
      return post
    }))
    onLike?.(postId)
  }

  const handleBookmark = (postId: string) => {
    setLocalPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isBookmarked: !post.isBookmarked
        }
      }
      return post
    }))
    onBookmark?.(postId)
  }

  const handleComment = (postId: string) => {
    const comment = newComment[postId]
    if (comment?.trim()) {
      setLocalPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments + 1
          }
        }
        return post
      }))
      onComment?.(postId, comment)
      setNewComment(prev => ({ ...prev, [postId]: '' }))
      setShowCommentBox(prev => ({ ...prev, [postId]: false }))
    }
  }

  const handleShare = (postId: string) => {
    setLocalPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          shares: post.shares + 1
        }
      }
      return post
    }))
    onShare?.(postId)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const containerClass = cn(
    'rounded-lg border',
    theme === 'dark' 
      ? 'bg-gray-900 border-gray-700'
      : theme === 'colored'
      ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
      : 'bg-white border-gray-200'
  )

  const postClass = cn(
    'p-4 border-b last:border-b-0',
    theme === 'dark' 
      ? 'border-gray-700'
      : 'border-gray-200'
  )

  const textClass = cn(
    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
  )

  const secondaryTextClass = cn(
    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  )

  const PostCard = ({ post }: { post: any }) => (
    <div className={postClass}>
      {/* Author Info */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className={cn('font-medium', textClass)}>{post.author.name}</h4>
            {showVerifiedBadges && post.author.verified && (
              <CheckCircle className="w-4 h-4 text-blue-500" />
            )}
          </div>
          <p className={cn('text-sm', secondaryTextClass)}>{post.author.handle}</p>
        </div>
        {showTimestamps && (
          <span className={cn('text-sm', secondaryTextClass)}>{post.timestamp}</span>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className={cn('text-sm leading-relaxed', textClass)}>{post.content}</p>
      </div>

      {/* Media */}
      {post.image && (
        <div className="mb-4">
          <img
            src={post.image}
            alt="Post content"
            className="w-full rounded-lg object-cover max-h-96"
          />
        </div>
      )}

      {post.video && (
        <div className="mb-4">
          <video
            src={post.video}
            controls
            className="w-full rounded-lg max-h-96"
          />
        </div>
      )}

      {/* Engagement */}
      {showEngagement && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(post.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1 rounded-full transition',
                post.isLiked
                  ? 'bg-red-100 text-red-600'
                  : 'hover:bg-gray-100 text-gray-600'
              )}
            >
              <Heart className={cn('w-4 h-4', post.isLiked && 'fill-current')} />
              <span className="text-sm">{formatNumber(post.likes)}</span>
            </button>

            <button
              onClick={() => setShowCommentBox(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
              className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-gray-100 text-gray-600 transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">{formatNumber(post.comments)}</span>
            </button>

            <button
              onClick={() => handleShare(post.id)}
              className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-gray-100 text-gray-600 transition"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm">{formatNumber(post.shares)}</span>
            </button>
          </div>

          <button
            onClick={() => handleBookmark(post.id)}
            className={cn(
              'p-2 rounded-full transition',
              post.isBookmarked
                ? 'bg-blue-100 text-blue-600'
                : 'hover:bg-gray-100 text-gray-600'
            )}
          >
            <Bookmark className={cn('w-4 h-4', post.isBookmarked && 'fill-current')} />
          </button>
        </div>
      )}

      {/* Comment Box */}
      {showCommentBox[post.id] && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment[post.id] || ''}
              onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => handleComment(post.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  )

  const displayedPosts = localPosts.slice(0, maxPosts)

  if (layout === 'grid') {
    return (
      <div className={containerClass}>
        <div className="p-4">
          <h3 className={cn('text-lg font-semibold mb-4', textClass)}>Social Feed</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {displayedPosts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <PostCard post={post} />
            </div>
          ))}
        </div>
        {showLoadMore && displayedPosts.length < localPosts.length && (
          <div className="p-4 text-center">
            <button
              onClick={onLoadMore}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    )
  }

  if (layout === 'compact') {
    return (
      <div className={containerClass}>
        <div className="p-4">
          <h3 className={cn('text-lg font-semibold mb-4', textClass)}>Recent Posts</h3>
        </div>
        <div className="space-y-2">
          {displayedPosts.map((post) => (
            <div key={post.id} className="p-3 hover:bg-gray-50 transition">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={cn('font-medium text-sm truncate', textClass)}>{post.author.name}</h4>
                    {showVerifiedBadges && post.author.verified && (
                      <CheckCircle className="w-3 h-3 text-blue-500" />
                    )}
                  </div>
                  <p className={cn('text-xs truncate', secondaryTextClass)}>{post.content}</p>
                </div>
                {showEngagement && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Heart className="w-3 h-3" />
                    <span>{formatNumber(post.likes)}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Feed layout (default)
  return (
    <div className={containerClass}>
      <div className="p-4">
        <h3 className={cn('text-lg font-semibold mb-4', textClass)}>Social Feed</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {displayedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {showLoadMore && displayedPosts.length < localPosts.length && (
        <div className="p-4 text-center">
          <button
            onClick={onLoadMore}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

// Component configuration for editor
export const SocialMediaFeedConfig = {
  id: 'social-media-feed',
  name: 'Social Media Feed',
  description: 'Social media feed with posts, engagement, and interactions',
  category: 'content' as const,
  icon: 'users',
  defaultProps: {
    posts: [
      {
        id: '1',
        author: {
          name: 'John Doe',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          handle: '@johndoe',
          verified: true
        },
        content: 'Just launched our new website! Check it out and let me know what you think. #webdesign #launch',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
        timestamp: '2 hours ago',
        likes: 42,
        comments: 8,
        shares: 3,
        isLiked: false,
        isBookmarked: false
      }
    ],
    showEngagement: true,
    showTimestamps: true,
    showVerifiedBadges: true,
    layout: 'feed',
    theme: 'light',
    maxPosts: 10,
    showLoadMore: true
  },
  defaultSize: { width: 100, height: 600 },
  editableFields: [
    'posts',
    'onLike',
    'onComment',
    'onShare',
    'onBookmark',
    'showEngagement',
    'showTimestamps',
    'showVerifiedBadges',
    'layout',
    'theme',
    'maxPosts',
    'showLoadMore',
    'onLoadMore'
  ]
}
