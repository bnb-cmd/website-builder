'use client'

import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Building, Globe, Calendar, Clock, CheckCircle, Star, DollarSign, CreditCard, MessageSquare, FileText, Shield, Lock, Heart, ThumbsUp, Share2, Bookmark, Play, Pause, Volume2, VolumeX, Music, Mic, MicOff, Headphones } from '@/lib/icons'
import { getIcon as getCustomIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'

export interface SocialMediaLinksProps {
  platforms: Array<{
    id: string
    name: string
    url: string
    icon: string
    followers?: number
    verified?: boolean
  }>
  showFollowers?: boolean
  showVerifiedBadges?: boolean
  showLabels?: boolean
  layout?: 'horizontal' | 'vertical' | 'grid' | 'compact'
  theme?: 'light' | 'dark' | 'colored'
  size?: 'sm' | 'md' | 'lg'
  onPlatformClick?: (platform: any) => void
}

export const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({
  platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      url: 'https://facebook.com/yourpage',
      icon: 'facebook',
      followers: 12500,
      verified: true
    },
    {
      id: 'instagram',
      name: 'Instagram',
      url: 'https://instagram.com/yourpage',
      icon: 'instagram',
      followers: 8900,
      verified: true
    },
    {
      id: 'twitter',
      name: 'Twitter',
      url: 'https://twitter.com/yourpage',
      icon: 'twitter',
      followers: 5600,
      verified: false
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/yourpage',
      icon: 'linkedin',
      followers: 2300,
      verified: true
    },
    {
      id: 'youtube',
      name: 'YouTube',
      url: 'https://youtube.com/c/yourpage',
      icon: 'youtube',
      followers: 15600,
      verified: true
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      url: 'https://tiktok.com/@yourpage',
      icon: 'tiktok',
      followers: 7800,
      verified: false
    }
  ],
  showFollowers = true,
  showVerifiedBadges = true,
  showLabels = true,
  layout = 'horizontal',
  theme = 'light',
  size = 'md',
  onPlatformClick
}) => {
  const getIcon = (iconName: string) => {
    const IconComponent = getCustomIcon(iconName.toLowerCase())
    return IconComponent ? <IconComponent className="w-5 h-5" /> : null
  }

  const getPlatformColor = (platformId: string) => {
    const colorMap: Record<string, string> = {
      facebook: 'bg-blue-600 hover:bg-blue-700',
      instagram: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      twitter: 'bg-blue-400 hover:bg-blue-500',
      linkedin: 'bg-blue-700 hover:bg-blue-800',
      youtube: 'bg-red-600 hover:bg-red-700',
      tiktok: 'bg-black hover:bg-gray-800',
      pinterest: 'bg-red-500 hover:bg-red-600',
      snapchat: 'bg-yellow-400 hover:bg-yellow-500'
    }
    
    return colorMap[platformId.toLowerCase()] || 'bg-gray-600 hover:bg-gray-700'
  }

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          button: 'w-8 h-8',
          icon: 'w-4 h-4',
          text: 'text-xs',
          spacing: 'gap-2'
        }
      case 'lg':
        return {
          button: 'w-12 h-12',
          icon: 'w-6 h-6',
          text: 'text-base',
          spacing: 'gap-4'
        }
      default: // md
        return {
          button: 'w-10 h-10',
          icon: 'w-5 h-5',
          text: 'text-sm',
          spacing: 'gap-3'
        }
    }
  }

  const sizeClasses = getSizeClasses()

  const containerClass = cn(
    'rounded-lg border p-4',
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

  const PlatformButton = ({ platform }: { platform: any }) => (
    <button
      onClick={() => onPlatformClick?.(platform)}
      className={cn(
        'flex items-center justify-center rounded-full text-white transition-all duration-200 hover:scale-105',
        sizeClasses.button,
        getPlatformColor(platform.id)
      )}
    >
      {getIcon(platform.icon)}
    </button>
  )

  const PlatformCard = ({ platform }: { platform: any }) => (
    <div
      onClick={() => onPlatformClick?.(platform)}
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition hover:shadow-md',
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700 hover:bg-gray-750'
          : 'bg-white border-gray-200 hover:bg-gray-50'
      )}
    >
      <div className={cn(
        'flex items-center justify-center rounded-full text-white',
        sizeClasses.button,
        getPlatformColor(platform.id)
      )}>
        {getIcon(platform.icon)}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className={cn('font-medium', sizeClasses.text, textClass)}>
            {platform.name}
          </h4>
          {showVerifiedBadges && platform.verified && (
            <CheckCircle className="w-4 h-4 text-blue-500" />
          )}
        </div>
        
        {showFollowers && platform.followers && (
          <p className={cn('text-xs', secondaryTextClass)}>
            {formatFollowers(platform.followers)} followers
          </p>
        )}
      </div>
    </div>
  )

  if (layout === 'vertical') {
    return (
      <div className={containerClass}>
        <h3 className={cn('font-semibold mb-4', textClass)}>Follow Us</h3>
        <div className="space-y-2">
          {platforms.map((platform) => (
            <PlatformCard key={platform.id} platform={platform} />
          ))}
        </div>
      </div>
    )
  }

  if (layout === 'grid') {
    return (
      <div className={containerClass}>
        <h3 className={cn('font-semibold mb-4', textClass)}>Follow Us</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {platforms.map((platform) => (
            <PlatformCard key={platform.id} platform={platform} />
          ))}
        </div>
      </div>
    )
  }

  if (layout === 'compact') {
    return (
      <div className={containerClass}>
        <div className="flex items-center gap-2">
          <span className={cn('text-sm font-medium', textClass)}>Follow us:</span>
          <div className="flex gap-2">
            {platforms.map((platform) => (
              <PlatformButton key={platform.id} platform={platform} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Horizontal layout (default)
  return (
    <div className={containerClass}>
      <h3 className={cn('font-semibold mb-4', textClass)}>Follow Us</h3>
      <div className={cn('flex flex-wrap', sizeClasses.spacing)}>
        {platforms.map((platform) => (
          <div key={platform.id} className="text-center">
            <PlatformButton platform={platform} />
            {showLabels && (
              <div className="mt-2">
                <p className={cn('font-medium', sizeClasses.text, textClass)}>
                  {platform.name}
                </p>
                {showFollowers && platform.followers && (
                  <p className={cn('text-xs', secondaryTextClass)}>
                    {formatFollowers(platform.followers)}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Component configuration for editor
export const SocialMediaLinksConfig = {
  id: 'social-media-links',
  name: 'Social Media Links',
  description: 'Social media platform links with icons and follower counts',
  category: 'content' as const,
  icon: 'share-2',
  defaultProps: {
    platforms: [
      {
        id: 'facebook',
        name: 'Facebook',
        url: 'https://facebook.com/yourpage',
        icon: 'facebook',
        followers: 12500,
        verified: true
      },
      {
        id: 'instagram',
        name: 'Instagram',
        url: 'https://instagram.com/yourpage',
        icon: 'instagram',
        followers: 8900,
        verified: true
      },
      {
        id: 'twitter',
        name: 'Twitter',
        url: 'https://twitter.com/yourpage',
        icon: 'twitter',
        followers: 5600,
        verified: false
      }
    ],
    showFollowers: true,
    showVerifiedBadges: true,
    showLabels: true,
    layout: 'horizontal',
    theme: 'light',
    size: 'md'
  },
  defaultSize: { width: 100, height: 200 },
  editableFields: [
    'platforms',
    'showFollowers',
    'showVerifiedBadges',
    'showLabels',
    'layout',
    'theme',
    'size',
    'onPlatformClick'
  ]
}
