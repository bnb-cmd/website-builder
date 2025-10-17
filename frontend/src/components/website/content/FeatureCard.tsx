'use client'

import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Building, Globe, Calendar, Clock, CheckCircle, Star, DollarSign, CreditCard, MessageSquare, FileText, Shield, Lock, Heart, ThumbsUp, Share2, Bookmark, Play, Pause, Volume2, VolumeX, Music, Mic, MicOff, Headphones, Instagram, Facebook, Twitter, Linkedin, Youtube, TikTok, Pinterest, Snapchat, Search, Filter, SortAsc, SortDesc, Award, Trophy, Medal, Target, TrendingUp, BarChart3, PieChart, Activity, Users, Eye, Download, ExternalLink, Zap, Rocket, Shield as ShieldIcon, Crown, Diamond } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FeatureCardProps {
  feature: {
    id: string
    title: string
    description: string
    icon: string
    benefits: string[]
    image?: string
    video?: string
    demoUrl?: string
    category?: string
    tags?: string[]
  }
  onLearnMore?: (featureId: string) => void
  onTryDemo?: (featureId: string) => void
  showBenefits?: boolean
  showImage?: boolean
  showVideo?: boolean
  showDemoButton?: boolean
  showCategory?: boolean
  showTags?: boolean
  layout?: 'card' | 'minimal' | 'detailed' | 'hero'
  theme?: 'light' | 'dark' | 'colored'
  size?: 'sm' | 'md' | 'lg'
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  feature = {
    id: '1',
    title: 'AI-Powered Analytics',
    description: 'Get deep insights into your business performance with our advanced AI analytics dashboard.',
    icon: 'bar-chart-3',
    benefits: [
      'Real-time data visualization',
      'Predictive analytics',
      'Custom reports',
      'Automated insights'
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    demoUrl: 'https://demo.example.com',
    category: 'Analytics',
    tags: ['AI', 'Data', 'Insights', 'Dashboard']
  },
  onLearnMore,
  onTryDemo,
  showBenefits = true,
  showImage = true,
  showVideo = false,
  showDemoButton = true,
  showCategory = true,
  showTags = true,
  layout = 'card',
  theme = 'light',
  size = 'md'
}) => {
  const [isPlaying, setIsPlaying] = useState(false)

  const handleLearnMore = () => {
    onLearnMore?.(feature.id)
  }

  const handleTryDemo = () => {
    onTryDemo?.(feature.id)
  }

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'bar-chart-3': BarChart3,
      'pie-chart': PieChart,
      'activity': Activity,
      'trending-up': TrendingUp,
      'users': Users,
      'shield': ShieldIcon,
      'zap': Zap,
      'rocket': Rocket,
      'crown': Crown,
      'diamond': Diamond,
      'target': Target,
      'award': Award,
      'trophy': Trophy,
      'medal': Medal
    }
    
    const IconComponent = iconMap[iconName.toLowerCase()]
    return IconComponent ? <IconComponent className="w-6 h-6" /> : <Star className="w-6 h-6" />
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-4',
          title: 'text-lg',
          description: 'text-sm',
          benefits: 'text-sm',
          button: 'py-2 px-4 text-sm',
          spacing: 'gap-3'
        }
      case 'lg':
        return {
          container: 'p-8',
          title: 'text-2xl',
          description: 'text-lg',
          benefits: 'text-base',
          button: 'py-4 px-8 text-lg',
          spacing: 'gap-6'
        }
      default: // md
        return {
          container: 'p-6',
          title: 'text-xl',
          description: 'text-base',
          benefits: 'text-sm',
          button: 'py-3 px-6 text-base',
          spacing: 'gap-4'
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

  const iconClass = cn(
    'p-3 rounded-lg',
    theme === 'dark' 
      ? 'bg-gray-800 text-blue-400'
      : theme === 'colored'
      ? 'bg-blue-100 text-blue-600'
      : 'bg-blue-100 text-blue-600'
  )

  if (layout === 'minimal') {
    return (
      <div className={containerClass}>
        <div className={sizeClasses.container}>
          <div className={cn('flex items-start gap-3', sizeClasses.spacing)}>
            <div className={iconClass}>
              {getIcon(feature.icon)}
            </div>
            
            <div className="flex-1">
              <h3 className={cn('font-semibold mb-2', sizeClasses.title, textClass)}>
                {feature.title}
              </h3>
              <p className={cn(sizeClasses.description, secondaryTextClass)}>
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (layout === 'detailed') {
    return (
      <div className={containerClass}>
        {showImage && feature.image && (
          <img
            src={feature.image}
            alt={feature.title}
            className="w-full h-48 object-cover"
          />
        )}
        
        <div className={sizeClasses.container}>
          <div className={cn('space-y-4', sizeClasses.spacing)}>
            <div className="flex items-start gap-3">
              <div className={iconClass}>
                {getIcon(feature.icon)}
              </div>
              
              <div className="flex-1">
                {showCategory && feature.category && (
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-2">
                    {feature.category}
                  </span>
                )}
                
                <h3 className={cn('font-semibold mb-2', sizeClasses.title, textClass)}>
                  {feature.title}
                </h3>
                <p className={cn(sizeClasses.description, secondaryTextClass)}>
                  {feature.description}
                </p>
              </div>
            </div>
            
            {showBenefits && feature.benefits.length > 0 && (
              <div>
                <h4 className={cn('font-medium mb-2', textClass)}>Key Benefits:</h4>
                <ul className="space-y-1">
                  {feature.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className={cn(sizeClasses.benefits, textClass)}>
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {showTags && feature.tags && feature.tags.length > 0 && (
              <div>
                <div className="flex flex-wrap gap-1">
                  {feature.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={handleLearnMore}
                className={cn(
                  'flex-1 rounded-lg font-medium transition',
                  sizeClasses.button,
                  theme === 'dark'
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                )}
              >
                Learn More
              </button>
              
              {showDemoButton && feature.demoUrl && (
                <button
                  onClick={handleTryDemo}
                  className={cn(
                    'flex-1 rounded-lg font-medium transition',
                    sizeClasses.button,
                    'bg-blue-600 text-white hover:bg-blue-700'
                  )}
                >
                  Try Demo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (layout === 'hero') {
    return (
      <div className={cn(containerClass, 'relative overflow-hidden')}>
        <div className={cn('absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-5')} />
        
        <div className={cn('relative', sizeClasses.container)}>
          <div className={cn('text-center', sizeClasses.spacing)}>
            <div className="flex justify-center mb-4">
              <div className={cn(iconClass, 'p-4')}>
                {getIcon(feature.icon)}
              </div>
            </div>
            
            {showCategory && feature.category && (
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full mb-4">
                {feature.category}
              </span>
            )}
            
            <h3 className={cn('font-bold mb-4', sizeClasses.title, textClass)}>
              {feature.title}
            </h3>
            
            <p className={cn('mb-6', sizeClasses.description, secondaryTextClass)}>
              {feature.description}
            </p>
            
            {showBenefits && feature.benefits.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {feature.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className={cn(sizeClasses.benefits, textClass)}>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleLearnMore}
                className={cn(
                  'rounded-lg font-medium transition',
                  sizeClasses.button,
                  theme === 'dark'
                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                )}
              >
                Learn More
              </button>
              
              {showDemoButton && feature.demoUrl && (
                <button
                  onClick={handleTryDemo}
                  className={cn(
                    'rounded-lg font-medium transition',
                    sizeClasses.button,
                    'bg-blue-600 text-white hover:bg-blue-700'
                  )}
                >
                  Try Demo
                </button>
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
      {showImage && feature.image && (
        <img
          src={feature.image}
          alt={feature.title}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className={sizeClasses.container}>
        <div className={cn('space-y-4', sizeClasses.spacing)}>
          <div className="flex items-start gap-3">
            <div className={iconClass}>
              {getIcon(feature.icon)}
            </div>
            
            <div className="flex-1">
              {showCategory && feature.category && (
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mb-2">
                  {feature.category}
                </span>
              )}
              
              <h3 className={cn('font-semibold mb-2', sizeClasses.title, textClass)}>
                {feature.title}
              </h3>
              <p className={cn(sizeClasses.description, secondaryTextClass)}>
                {feature.description}
              </p>
            </div>
          </div>
          
          {showBenefits && feature.benefits.length > 0 && (
            <div>
              <h4 className={cn('font-medium mb-2', textClass)}>Key Benefits:</h4>
              <ul className="space-y-1">
                {feature.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className={cn(sizeClasses.benefits, textClass)}>
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {showTags && feature.tags && feature.tags.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-1">
                {feature.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={handleLearnMore}
              className={cn(
                'flex-1 rounded-lg font-medium transition',
                sizeClasses.button,
                theme === 'dark'
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              )}
            >
              Learn More
            </button>
            
            {showDemoButton && feature.demoUrl && (
              <button
                onClick={handleTryDemo}
                className={cn(
                  'flex-1 rounded-lg font-medium transition',
                  sizeClasses.button,
                  'bg-blue-600 text-white hover:bg-blue-700'
                )}
              >
                Try Demo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Component configuration for editor
export const FeatureCardConfig = {
  id: 'feature-card',
  name: 'Feature Card',
  description: 'Feature showcase card with benefits, demo links, and multiple layouts',
  category: 'content' as const,
  icon: 'star',
  defaultProps: {
    feature: {
      id: '1',
      title: 'AI-Powered Analytics',
      description: 'Get deep insights into your business performance with our advanced AI analytics dashboard.',
      icon: 'bar-chart-3',
      benefits: [
        'Real-time data visualization',
        'Predictive analytics',
        'Custom reports',
        'Automated insights'
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      demoUrl: 'https://demo.example.com',
      category: 'Analytics',
      tags: ['AI', 'Data', 'Insights', 'Dashboard']
    },
    showBenefits: true,
    showImage: true,
    showVideo: false,
    showDemoButton: true,
    showCategory: true,
    showTags: true,
    layout: 'card',
    theme: 'light',
    size: 'md'
  },
  defaultSize: { width: 100, height: 400 },
  editableFields: [
    'feature',
    'onLearnMore',
    'onTryDemo',
    'showBenefits',
    'showImage',
    'showVideo',
    'showDemoButton',
    'showCategory',
    'showTags',
    'layout',
    'theme',
    'size'
  ]
}
