'use client'

import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Building, Globe, Calendar, Clock, CheckCircle, Star, DollarSign, CreditCard, MessageSquare, FileText, Shield, Lock, Heart, ThumbsUp, Share2, Bookmark, Play, Pause, Volume2, VolumeX, Music, Mic, MicOff, Headphones, Instagram, Facebook, Twitter, Linkedin, Youtube, TikTok, Pinterest, Snapchat, Search, Filter, SortAsc, SortDesc, Award, Trophy, Medal, Target, TrendingUp, BarChart3, PieChart, Activity, Users, Eye, Download, ExternalLink } from '@/lib/icons'
import { cn } from '@/lib/utils'

export interface PricingCardProps {
  plan: {
    id: string
    name: string
    description: string
    price: number
    currency: string
    period: string
    features: string[]
    limitations?: string[]
    popular?: boolean
    buttonText: string
    buttonVariant: 'primary' | 'secondary' | 'outline'
  }
  onSelectPlan?: (planId: string) => void
  showFeatures?: boolean
  showLimitations?: boolean
  showPopularBadge?: boolean
  showCurrency?: boolean
  showPeriod?: boolean
  layout?: 'card' | 'minimal' | 'featured' | 'comparison'
  theme?: 'light' | 'dark' | 'colored'
  size?: 'sm' | 'md' | 'lg'
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan = {
    id: '1',
    name: 'Professional',
    description: 'Perfect for growing businesses',
    price: 99,
    currency: 'PKR',
    period: 'month',
    features: [
      'Up to 10 projects',
      '24/7 support',
      'Advanced analytics',
      'Custom integrations',
      'Priority support',
      'API access'
    ],
    limitations: [
      'Limited to 5 team members',
      'No white-label option'
    ],
    popular: true,
    buttonText: 'Get Started',
    buttonVariant: 'primary'
  },
  onSelectPlan,
  showFeatures = true,
  showLimitations = false,
  showPopularBadge = true,
  showCurrency = true,
  showPeriod = true,
  layout = 'card',
  theme = 'light',
  size = 'md'
}) => {
  const handleSelectPlan = () => {
    onSelectPlan?.(plan.id)
  }

  const formatPrice = (price: number, currency: string) => {
    return `${currency} ${price.toLocaleString()}`
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-4',
          title: 'text-lg',
          price: 'text-2xl',
          description: 'text-sm',
          features: 'text-sm',
          button: 'py-2 px-4 text-sm',
          spacing: 'gap-3'
        }
      case 'lg':
        return {
          container: 'p-8',
          title: 'text-2xl',
          price: 'text-4xl',
          description: 'text-lg',
          features: 'text-base',
          button: 'py-4 px-8 text-lg',
          spacing: 'gap-6'
        }
      default: // md
        return {
          container: 'p-6',
          title: 'text-xl',
          price: 'text-3xl',
          description: 'text-base',
          features: 'text-sm',
          button: 'py-3 px-6 text-base',
          spacing: 'gap-4'
        }
    }
  }

  const sizeClasses = getSizeClasses()

  const containerClass = cn(
    'rounded-lg border relative',
    theme === 'dark' 
      ? 'bg-gray-900 border-gray-700'
      : theme === 'colored'
      ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
      : 'bg-white border-gray-200',
    plan.popular && 'border-blue-500 shadow-lg'
  )

  const textClass = cn(
    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
  )

  const secondaryTextClass = cn(
    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  )

  const buttonClass = cn(
    'w-full rounded-lg font-medium transition',
    sizeClasses.button,
    plan.buttonVariant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : plan.buttonVariant === 'secondary'
      ? 'bg-gray-600 text-white hover:bg-gray-700'
      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  )

  if (layout === 'minimal') {
    return (
      <div className={containerClass}>
        {plan.popular && showPopularBadge && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
              Most Popular
            </span>
          </div>
        )}
        
        <div className={sizeClasses.container}>
          <div className={cn('text-center', sizeClasses.spacing)}>
            <h3 className={cn('font-bold', sizeClasses.title, textClass)}>
              {plan.name}
            </h3>
            
            <div className={cn('font-bold', sizeClasses.price, textClass)}>
              {showCurrency && formatPrice(plan.price, plan.currency)}
              {showPeriod && (
                <span className={cn('text-sm font-normal', secondaryTextClass)}>
                  /{plan.period}
                </span>
              )}
            </div>
            
            <p className={cn(sizeClasses.description, secondaryTextClass)}>
              {plan.description}
            </p>
            
            <button
              onClick={handleSelectPlan}
              className={buttonClass}
            >
              {plan.buttonText}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (layout === 'featured') {
    return (
      <div className={cn(containerClass, 'relative overflow-hidden')}>
        {plan.popular && showPopularBadge && (
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-lg">
            Popular
          </div>
        )}
        
        <div className={cn('absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-5')} />
        
        <div className={cn('relative', sizeClasses.container)}>
          <div className={cn('text-center', sizeClasses.spacing)}>
            <h3 className={cn('font-bold', sizeClasses.title, textClass)}>
              {plan.name}
            </h3>
            
            <div className={cn('font-bold', sizeClasses.price, textClass)}>
              {showCurrency && formatPrice(plan.price, plan.currency)}
              {showPeriod && (
                <span className={cn('text-sm font-normal', secondaryTextClass)}>
                  /{plan.period}
                </span>
              )}
            </div>
            
            <p className={cn(sizeClasses.description, secondaryTextClass)}>
              {plan.description}
            </p>
            
            {showFeatures && (
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className={cn(sizeClasses.features, textClass)}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={handleSelectPlan}
              className={buttonClass}
            >
              {plan.buttonText}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (layout === 'comparison') {
    return (
      <div className={containerClass}>
        {plan.popular && showPopularBadge && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
              Recommended
            </span>
          </div>
        )}
        
        <div className={sizeClasses.container}>
          <div className={cn('text-center', sizeClasses.spacing)}>
            <h3 className={cn('font-bold', sizeClasses.title, textClass)}>
              {plan.name}
            </h3>
            
            <div className={cn('font-bold', sizeClasses.price, textClass)}>
              {showCurrency && formatPrice(plan.price, plan.currency)}
              {showPeriod && (
                <span className={cn('text-sm font-normal', secondaryTextClass)}>
                  /{plan.period}
                </span>
              )}
            </div>
            
            <p className={cn(sizeClasses.description, secondaryTextClass)}>
              {plan.description}
            </p>
            
            {showFeatures && (
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className={cn(sizeClasses.features, textClass)}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            {showLimitations && plan.limitations && plan.limitations.length > 0 && (
              <div className="space-y-2">
                {plan.limitations.map((limitation, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-4 h-4 text-gray-400">✗</span>
                    <span className={cn(sizeClasses.features, secondaryTextClass)}>
                      {limitation}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={handleSelectPlan}
              className={buttonClass}
            >
              {plan.buttonText}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Card layout (default)
  return (
    <div className={containerClass}>
      {plan.popular && showPopularBadge && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      
      <div className={sizeClasses.container}>
        <div className={cn('text-center', sizeClasses.spacing)}>
          <h3 className={cn('font-bold', sizeClasses.title, textClass)}>
            {plan.name}
          </h3>
          
          <div className={cn('font-bold', sizeClasses.price, textClass)}>
            {showCurrency && formatPrice(plan.price, plan.currency)}
            {showPeriod && (
              <span className={cn('text-sm font-normal', secondaryTextClass)}>
                /{plan.period}
              </span>
            )}
          </div>
          
          <p className={cn(sizeClasses.description, secondaryTextClass)}>
            {plan.description}
          </p>
          
          {showFeatures && (
            <div className="space-y-2">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className={cn(sizeClasses.features, textClass)}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {showLimitations && plan.limitations && plan.limitations.length > 0 && (
            <div className="space-y-2">
              {plan.limitations.map((limitation, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-4 h-4 text-gray-400">✗</span>
                  <span className={cn(sizeClasses.features, secondaryTextClass)}>
                    {limitation}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          <button
            onClick={handleSelectPlan}
            className={buttonClass}
          >
            {plan.buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}

// Component configuration for editor
export const PricingCardConfig = {
  id: 'pricing-card',
  name: 'Pricing Card',
  description: 'Pricing plan card with features, limitations, and multiple layouts',
  category: 'business' as const,
  icon: 'credit-card',
  defaultProps: {
    plan: {
      id: '1',
      name: 'Professional',
      description: 'Perfect for growing businesses',
      price: 99,
      currency: 'PKR',
      period: 'month',
      features: [
        'Up to 10 projects',
        '24/7 support',
        'Advanced analytics',
        'Custom integrations',
        'Priority support',
        'API access'
      ],
      limitations: [
        'Limited to 5 team members',
        'No white-label option'
      ],
      popular: true,
      buttonText: 'Get Started',
      buttonVariant: 'primary'
    },
    showFeatures: true,
    showLimitations: false,
    showPopularBadge: true,
    showCurrency: true,
    showPeriod: true,
    layout: 'card',
    theme: 'light',
    size: 'md'
  },
  defaultSize: { width: 100, height: 400 },
  editableFields: [
    'plan',
    'onSelectPlan',
    'showFeatures',
    'showLimitations',
    'showPopularBadge',
    'showCurrency',
    'showPeriod',
    'layout',
    'theme',
    'size'
  ]
}
