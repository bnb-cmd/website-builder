'use client'

import React from 'react'
import { Facebook, Twitter, Linkedin, Mail, MessageCircle, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  platforms: Array<'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'email' | 'telegram'>
  style?: 'icon' | 'button' | 'text'
  size?: 'sm' | 'md' | 'lg'
  color?: string
  backgroundColor?: string
  showLabels?: boolean
  orientation?: 'horizontal' | 'vertical'
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  url = 'https://example.com',
  title = 'Check this out!',
  description = '',
  platforms = ['facebook', 'twitter', 'linkedin', 'whatsapp', 'email'],
  style = 'button',
  size = 'md',
  color = '#3B82F6',
  backgroundColor = '#FFFFFF',
  showLabels = true,
  orientation = 'horizontal'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
  }

  const platformIcons = {
    facebook: Facebook,
    twitter: Twitter,
    linkedin: Linkedin,
    whatsapp: MessageCircle,
    email: Mail,
    telegram: Share2
  }

  const platformLabels = {
    facebook: 'Facebook',
    twitter: 'Twitter',
    linkedin: 'LinkedIn',
    whatsapp: 'WhatsApp',
    email: 'Email',
    telegram: 'Telegram'
  }

  const platformColors = {
    facebook: '#1877F2',
    twitter: '#1DA1F2',
    linkedin: '#0077B5',
    whatsapp: '#25D366',
    email: '#6B7280',
    telegram: '#0088CC'
  }

  const handleShare = (platform: string) => {
    const shareUrl = shareLinks[platform as keyof typeof shareLinks]
    
    if (platform === 'email') {
      window.location.href = shareUrl
    } else {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  const containerClasses = cn(
    'flex gap-2',
    orientation === 'vertical' ? 'flex-col' : 'flex-row'
  )

  const buttonClasses = cn(
    'flex items-center justify-center transition-all duration-200 hover:scale-105',
    sizeClasses[size],
    style === 'button' && 'rounded-lg border',
    style === 'icon' && 'rounded-full',
    style === 'text' && 'rounded px-3 py-2'
  )

  return (
    <div className="w-full">
      <div className={containerClasses}>
        {platforms.map((platform) => {
          const Icon = platformIcons[platform]
          const label = platformLabels[platform]
          const platformColor = platformColors[platform]

          return (
            <button
              key={platform}
              onClick={() => handleShare(platform)}
              className={cn(
                buttonClasses,
                style === 'button' && 'hover:shadow-md',
                style === 'icon' && 'hover:shadow-lg'
              )}
              style={{
                backgroundColor: style === 'icon' ? platformColor : backgroundColor,
                color: style === 'icon' ? '#FFFFFF' : platformColor,
                borderColor: style === 'button' ? platformColor : 'transparent'
              }}
              aria-label={`Share on ${label}`}
            >
              <Icon className={cn(
                style === 'text' ? 'w-4 h-4 mr-2' : 'w-5 h-5'
              )} />
              
              {showLabels && style === 'text' && (
                <span className={textSizeClasses[size]}>
                  {label}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Component configuration for editor
export const ShareButtonsConfig = {
  id: 'share-buttons',
  name: 'Share Buttons',
  description: 'Social media sharing buttons with multiple platforms',
  category: 'interactive' as const,
  icon: 'share-2',
  defaultProps: {
    url: 'https://example.com',
    title: 'Check this out!',
    description: '',
    platforms: ['facebook', 'twitter', 'linkedin', 'whatsapp', 'email'],
    style: 'button',
    size: 'md',
    color: '#3B82F6',
    backgroundColor: '#FFFFFF',
    showLabels: true,
    orientation: 'horizontal'
  },
  defaultSize: { width: 100, height: 60 },
  editableFields: [
    'url',
    'title',
    'description',
    'platforms',
    'style',
    'size',
    'color',
    'backgroundColor',
    'showLabels',
    'orientation'
  ]
}
