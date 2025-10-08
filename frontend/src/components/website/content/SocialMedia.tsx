import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const SocialMediaConfig: ComponentConfig = {
  id: 'social-media',
  name: 'Social Media',
  category: 'content',
  icon: 'Share2',
  description: 'Social media links and icons',
  defaultProps: { 
    title: 'Follow Us',
    platforms: [
      { name: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
      { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
      { name: 'Instagram', url: 'https://instagram.com', icon: 'instagram' }
    ],
    layout: 'horizontal',
    size: 'medium'
  },
  defaultSize: { width: 300, height: 100 },
  editableFields: ['title', 'platforms', 'layout', 'size']
}

interface SocialPlatform {
  name: string
  url: string
  icon: string
}

interface SocialMediaProps extends WebsiteComponentProps {
  title: string
  platforms: SocialPlatform[]
  layout: 'horizontal' | 'vertical' | 'grid'
  size: 'small' | 'medium' | 'large'
}

const iconMap: Record<string, React.ComponentType<any>> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube
}

export const WebsiteSocialMedia: React.FC<SocialMediaProps> = ({ 
  title, 
  platforms, 
  layout, 
  size,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'w-8 h-8'
      case 'large': return 'w-12 h-12'
      default: return 'w-10 h-10'
    }
  }

  const getLayoutClass = () => {
    switch (layout) {
      case 'vertical': return 'flex-col space-y-2'
      case 'grid': return 'grid grid-cols-2 gap-2'
      default: return 'flex-row space-x-2'
    }
  }

  const padding = getResponsivePadding('p-4', deviceMode)
  const titleSize = getResponsiveTextSize('text-lg', deviceMode)

  return (
    <div className={cn("w-full h-full", padding)}>
      <h3 
        className={cn("font-semibold mb-4 text-center", titleSize)}
        onDoubleClick={onTextDoubleClick}
      >
        {title}
      </h3>
      
      <div className={cn("flex justify-center", getLayoutClass())}>
        {platforms.map((platform, index) => {
          const IconComponent = iconMap[platform.icon] || Facebook
          return (
            <a
              key={index}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors",
                getSizeClass()
              )}
              title={platform.name}
            >
              <IconComponent className="w-5 h-5 text-gray-600" />
            </a>
          )
        })}
      </div>
    </div>
  )
}
