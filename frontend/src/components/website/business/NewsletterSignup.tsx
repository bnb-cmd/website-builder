'use client'

import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Building, Globe, Calendar, Clock, CheckCircle, Star } from '@/lib/icons'
import { cn } from '@/lib/utils'

export interface NewsletterSignupProps {
  onSubmit: (formData: any) => void
  title?: string
  subtitle?: string
  showName?: boolean
  showPhone?: boolean
  showInterests?: boolean
  showFrequency?: boolean
  interests?: string[]
  frequencies?: Array<{
    id: string
    label: string
    description: string
  }>
  privacyPolicyUrl?: string
  termsUrl?: string
  submitButtonText?: string
  successMessage?: string
  errorMessage?: string
  layout?: 'horizontal' | 'vertical' | 'compact' | 'card'
  theme?: 'light' | 'dark' | 'colored'
  showSocialProof?: boolean
  subscriberCount?: number
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  onSubmit,
  title = 'Stay Updated',
  subtitle = 'Get the latest news and updates delivered to your inbox',
  showName = false,
  showPhone = false,
  showInterests = false,
  showFrequency = false,
  interests = ['Technology', 'Business', 'Health', 'Education', 'Entertainment'],
  frequencies = [
    {
      id: 'daily',
      label: 'Daily',
      description: 'Get updates every day'
    },
    {
      id: 'weekly',
      label: 'Weekly',
      description: 'Get updates once a week'
    },
    {
      id: 'monthly',
      label: 'Monthly',
      description: 'Get updates once a month'
    }
  ],
  privacyPolicyUrl,
  termsUrl,
  submitButtonText = 'Subscribe',
  successMessage = 'Thank you for subscribing! Check your email for confirmation.',
  errorMessage = 'Sorry, there was an error subscribing. Please try again.',
  layout = 'vertical',
  theme = 'light',
  showSocialProof = true,
  subscriberCount = 12500
}) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    interests: [] as string[],
    frequency: 'weekly',
    privacyConsent: false,
    marketingConsent: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleInterestToggle = (interest: string) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest]
    handleInputChange('interests', newInterests)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (showName && !formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (showPhone && !formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    }

    if (!formData.privacyConsent) {
      newErrors.privacyConsent = 'You must accept the privacy policy'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await onSubmit(formData)
      setSubmitStatus('success')
      // Reset form
      setFormData({
        email: '',
        name: '',
        phone: '',
        interests: [],
        frequency: 'weekly',
        privacyConsent: false,
        marketingConsent: false
      })
    } catch (error) {
      console.error('Error subscribing:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatSubscriberCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const containerClass = cn(
    'p-6 rounded-lg border',
    theme === 'dark' 
      ? 'bg-gray-900 border-gray-700'
      : theme === 'colored'
      ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
      : 'bg-white border-gray-200'
  )

  const inputClass = cn(
    'w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition',
    theme === 'dark' 
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
      : theme === 'colored'
      ? 'bg-white border-blue-200 text-gray-900'
      : 'bg-white border-gray-300 text-gray-900'
  )

  const labelClass = cn(
    'block text-sm font-medium mb-2',
    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
  )

  const titleClass = cn(
    'text-xl font-bold mb-2',
    theme === 'dark' ? 'text-white' : 'text-gray-900'
  )

  const subtitleClass = cn(
    'text-sm mb-4',
    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  )

  if (layout === 'horizontal') {
    return (
      <div className={containerClass}>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className={titleClass}>{title}</h3>
            <p className={subtitleClass}>{subtitle}</p>
            {showSocialProof && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{formatSubscriberCount(subscriberCount)} subscribers</span>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="flex-1 w-full">
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={cn(inputClass, 'pl-11')}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'px-6 py-3 rounded-lg font-medium transition',
                  theme === 'dark'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : theme === 'colored'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700',
                  isSubmitting && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isSubmitting ? 'Subscribing...' : submitButtonText}
              </button>
            </div>
            
            {showSocialProof && (
              <div className="mt-2 text-xs text-gray-500">
                Join {formatSubscriberCount(subscriberCount)} others who get our updates
              </div>
            )}
          </form>
        </div>
      </div>
    )
  }

  if (layout === 'compact') {
    return (
      <div className={containerClass}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <h3 className={titleClass}>{title}</h3>
            <p className={subtitleClass}>{subtitle}</p>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={inputClass}
                placeholder="Email address"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'px-4 py-3 rounded-lg font-medium transition',
                theme === 'dark'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700',
                isSubmitting && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isSubmitting ? '...' : submitButtonText}
            </button>
          </div>
          
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email}</p>
          )}
        </form>
      </div>
    )
  }

  if (layout === 'card') {
    return (
      <div className={containerClass}>
        <div className="text-center mb-6">
          <h3 className={titleClass}>{title}</h3>
          <p className={subtitleClass}>{subtitle}</p>
          {showSocialProof && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{formatSubscriberCount(subscriberCount)} subscribers</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={cn(inputClass, 'pl-11')}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {showName && (
            <div>
              <label className={labelClass}>Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={cn(inputClass, 'pl-11')}
                  placeholder="Your name"
                />
              </div>
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>
          )}

          {showPhone && (
            <div>
              <label className={labelClass}>Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={cn(inputClass, 'pl-11')}
                  placeholder="+92 300 1234567"
                />
              </div>
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          )}

          {showInterests && (
            <div>
              <label className={labelClass}>Interests (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestToggle(interest)}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm border transition',
                      formData.interests.includes(interest)
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showFrequency && (
            <div>
              <label className={labelClass}>Email Frequency</label>
              <div className="space-y-2">
                {frequencies.map((freq) => (
                  <label key={freq.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      value={freq.id}
                      checked={formData.frequency === freq.id}
                      onChange={(e) => handleInputChange('frequency', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{freq.label}</div>
                      <div className="text-sm text-gray-600">{freq.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.privacyConsent}
                onChange={(e) => handleInputChange('privacyConsent', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                I agree to the privacy policy *
              </span>
            </label>
            {errors.privacyConsent && (
              <p className="text-red-600 text-sm">{errors.privacyConsent}</p>
            )}

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.marketingConsent}
                onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                I'd like to receive marketing communications
              </span>
            </label>
          </div>

          {/* Submit Status */}
          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
              {successMessage}
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'w-full py-3 px-6 rounded-lg font-medium transition',
              theme === 'dark'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : theme === 'colored'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                : 'bg-blue-600 text-white hover:bg-blue-700',
              isSubmitting && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isSubmitting ? 'Subscribing...' : submitButtonText}
          </button>
        </form>
      </div>
    )
  }

  // Vertical layout (default)
  return (
    <div className={containerClass}>
      <div className="text-center mb-6">
        <h3 className={titleClass}>{title}</h3>
        <p className={subtitleClass}>{subtitle}</p>
        {showSocialProof && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{formatSubscriberCount(subscriberCount)} subscribers</span>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Email Address *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={cn(inputClass, 'pl-11')}
              placeholder="your@email.com"
            />
          </div>
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {showName && (
          <div>
            <label className={labelClass}>Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={cn(inputClass, 'pl-11')}
                placeholder="Your name"
              />
            </div>
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>
        )}

        {showPhone && (
          <div>
            <label className={labelClass}>Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={cn(inputClass, 'pl-11')}
                placeholder="+92 300 1234567"
              />
            </div>
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        )}

        {showInterests && (
          <div>
            <label className={labelClass}>Interests (Optional)</label>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm border transition',
                    formData.interests.includes(interest)
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}

        {showFrequency && (
          <div>
            <label className={labelClass}>Email Frequency</label>
            <div className="space-y-2">
              {frequencies.map((freq) => (
                <label key={freq.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="frequency"
                    value={freq.id}
                    checked={formData.frequency === freq.id}
                    onChange={(e) => handleInputChange('frequency', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{freq.label}</div>
                    <div className="text-sm text-gray-600">{freq.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.privacyConsent}
              onChange={(e) => handleInputChange('privacyConsent', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              I agree to the privacy policy *
            </span>
          </label>
          {errors.privacyConsent && (
            <p className="text-red-600 text-sm">{errors.privacyConsent}</p>
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.marketingConsent}
              onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              I'd like to receive marketing communications
            </span>
          </label>
        </div>

        {/* Submit Status */}
        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'w-full py-3 px-6 rounded-lg font-medium transition',
            theme === 'dark'
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : theme === 'colored'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              : 'bg-blue-600 text-white hover:bg-blue-700',
            isSubmitting && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSubmitting ? 'Subscribing...' : submitButtonText}
        </button>
      </form>
    </div>
  )
}

// Component configuration for editor
export const NewsletterSignupConfig = {
  id: 'newsletter-signup',
  name: 'Newsletter Signup',
  description: 'Newsletter subscription form with customizable fields and themes',
  category: 'business' as const,
  icon: 'mail',
  defaultProps: {
    title: 'Stay Updated',
    subtitle: 'Get the latest news and updates delivered to your inbox',
    showName: false,
    showPhone: false,
    showInterests: false,
    showFrequency: false,
    interests: ['Technology', 'Business', 'Health', 'Education', 'Entertainment'],
    frequencies: [
      {
        id: 'daily',
        label: 'Daily',
        description: 'Get updates every day'
      },
      {
        id: 'weekly',
        label: 'Weekly',
        description: 'Get updates once a week'
      },
      {
        id: 'monthly',
        label: 'Monthly',
        description: 'Get updates once a month'
      }
    ],
    submitButtonText: 'Subscribe',
    successMessage: 'Thank you for subscribing! Check your email for confirmation.',
    errorMessage: 'Sorry, there was an error subscribing. Please try again.',
    layout: 'vertical',
    theme: 'light',
    showSocialProof: true,
    subscriberCount: 12500
  },
  defaultSize: { width: 100, height: 400 },
  editableFields: [
    'title',
    'subtitle',
    'showName',
    'showPhone',
    'showInterests',
    'showFrequency',
    'interests',
    'frequencies',
    'privacyPolicyUrl',
    'termsUrl',
    'submitButtonText',
    'successMessage',
    'errorMessage',
    'layout',
    'theme',
    'showSocialProof',
    'subscriberCount'
  ]
}
