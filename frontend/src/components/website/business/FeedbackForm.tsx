'use client'

import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Building, Globe, Calendar, Clock, CheckCircle, Star, DollarSign, CreditCard, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface FeedbackFormProps {
  onSubmit: (formData: any) => void
  title?: string
  subtitle?: string
  showRating?: boolean
  showCategory?: boolean
  showContactInfo?: boolean
  showAnonymous?: boolean
  categories?: Array<{
    id: string
    name: string
    description: string
  }>
  ratingLabels?: string[]
  submitButtonText?: string
  successMessage?: string
  errorMessage?: string
  layout?: 'single' | 'compact' | 'card'
  theme?: 'light' | 'dark' | 'colored'
  showSocialProof?: boolean
  responseTime?: string
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onSubmit,
  title = 'Share Your Feedback',
  subtitle = 'Help us improve by sharing your thoughts and suggestions',
  showRating = true,
  showCategory = true,
  showContactInfo = false,
  showAnonymous = true,
  categories = [
    {
      id: 'general',
      name: 'General Feedback',
      description: 'General comments and suggestions'
    },
    {
      id: 'bug',
      name: 'Bug Report',
      description: 'Report a technical issue or bug'
    },
    {
      id: 'feature',
      name: 'Feature Request',
      description: 'Suggest a new feature or improvement'
    },
    {
      id: 'service',
      name: 'Customer Service',
      description: 'Feedback about our customer service'
    },
    {
      id: 'product',
      name: 'Product Feedback',
      description: 'Feedback about our products or services'
    }
  ],
  ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
  submitButtonText = 'Submit Feedback',
  successMessage = 'Thank you for your feedback! We appreciate your input.',
  errorMessage = 'Sorry, there was an error submitting your feedback. Please try again.',
  layout = 'single',
  theme = 'light',
  showSocialProof = true,
  responseTime = '24 hours'
}) => {
  const [formData, setFormData] = useState({
    rating: 0,
    category: '',
    feedback: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    anonymous: false,
    followUp: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (showRating && formData.rating === 0) {
      newErrors.rating = 'Please provide a rating'
    }

    if (showCategory && !formData.category) {
      newErrors.category = 'Please select a category'
    }

    if (!formData.feedback.trim()) {
      newErrors.feedback = 'Please provide your feedback'
    }

    if (showContactInfo && !formData.anonymous) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required'
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email'
      }
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
        rating: 0,
        category: '',
        feedback: '',
        name: '',
        email: '',
        phone: '',
        company: '',
        anonymous: false,
        followUp: false
      })
    } catch (error) {
      console.error('Error submitting feedback:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = cn(
    'w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition',
    theme === 'dark' 
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
      : theme === 'colored'
      ? 'bg-blue-50 border-blue-200 text-gray-900'
      : 'bg-white border-gray-300 text-gray-900'
  )

  const labelClass = cn(
    'block text-sm font-medium mb-2',
    theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
  )

  const containerClass = cn(
    'p-6 rounded-lg border',
    theme === 'dark' 
      ? 'bg-gray-900 border-gray-700'
      : theme === 'colored'
      ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
      : 'bg-white border-gray-200'
  )

  const titleClass = cn(
    'text-xl font-bold mb-2',
    theme === 'dark' ? 'text-white' : 'text-gray-900'
  )

  const subtitleClass = cn(
    'text-sm mb-4',
    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  )

  if (layout === 'compact') {
    return (
      <div className={containerClass}>
        <div className="mb-4">
          <h3 className={titleClass}>{title}</h3>
          <p className={subtitleClass}>{subtitle}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {showRating && (
            <div>
              <label className={labelClass}>Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleInputChange('rating', star)}
                    className={cn(
                      'text-2xl transition',
                      star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                    )}
                  >
                    ★
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="text-red-600 text-sm mt-1">{errors.rating}</p>
              )}
            </div>
          )}

          <div>
            <label className={labelClass}>Feedback *</label>
            <textarea
              value={formData.feedback}
              onChange={(e) => handleInputChange('feedback', e.target.value)}
              className={cn(inputClass, 'min-h-[100px] resize-y')}
              placeholder="Share your thoughts..."
            />
            {errors.feedback && (
              <p className="text-red-600 text-sm mt-1">{errors.feedback}</p>
            )}
          </div>

          {showContactInfo && !formData.anonymous && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={inputClass}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={inputClass}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          )}

          {showAnonymous && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.anonymous}
                onChange={(e) => handleInputChange('anonymous', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                Submit anonymously
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'w-full py-3 px-6 rounded-lg font-medium transition',
              isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {isSubmitting ? 'Submitting...' : submitButtonText}
          </button>
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
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span>We respond within {responseTime}</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {showRating && (
            <div>
              <label className={labelClass}>Overall Rating *</label>
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleInputChange('rating', star)}
                      className={cn(
                        'text-3xl transition hover:scale-110',
                        star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                      )}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {formData.rating > 0 && (
                  <span className="text-sm text-gray-600">
                    {ratingLabels[formData.rating - 1]}
                  </span>
                )}
              </div>
              {errors.rating && (
                <p className="text-red-600 text-sm mt-1">{errors.rating}</p>
              )}
            </div>
          )}

          {showCategory && (
            <div>
              <label className={labelClass}>Category *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => handleInputChange('category', category.id)}
                    className={cn(
                      'p-3 border-2 rounded-lg cursor-pointer transition',
                      formData.category === category.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <h4 className="font-medium text-gray-900 mb-1">{category.name}</h4>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                ))}
              </div>
              {errors.category && (
                <p className="text-red-600 text-sm mt-2">{errors.category}</p>
              )}
            </div>
          )}

          <div>
            <label className={labelClass}>Your Feedback *</label>
            <textarea
              value={formData.feedback}
              onChange={(e) => handleInputChange('feedback', e.target.value)}
              className={cn(inputClass, 'min-h-[150px] resize-y')}
              placeholder="Please share your detailed feedback..."
            />
            {errors.feedback && (
              <p className="text-red-600 text-sm mt-1">{errors.feedback}</p>
            )}
          </div>

          {showContactInfo && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div>
                  <label className={labelClass}>Email</label>
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
                </div>

                <div>
                  <label className={labelClass}>Company</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className={cn(inputClass, 'pl-11')}
                      placeholder="Company name"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {showAnonymous && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.anonymous}
                  onChange={(e) => handleInputChange('anonymous', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                  Submit anonymously
                </span>
              </label>
            )}

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.followUp}
                onChange={(e) => handleInputChange('followUp', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                I'd like to receive follow-up on this feedback
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
              isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {isSubmitting ? 'Submitting...' : submitButtonText}
          </button>
        </form>
      </div>
    )
  }

  // Single layout (default)
  return (
    <div className={containerClass}>
      <div className="mb-6">
        <h2 className={titleClass}>{title}</h2>
        <p className={subtitleClass}>{subtitle}</p>
        {showSocialProof && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span>We respond within {responseTime}</span>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {showRating && (
          <div>
            <label className={labelClass}>Overall Rating *</label>
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleInputChange('rating', star)}
                    className={cn(
                      'text-3xl transition hover:scale-110',
                      star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                    )}
                  >
                    ★
                  </button>
                ))}
              </div>
              {formData.rating > 0 && (
                <span className="text-sm text-gray-600">
                  {ratingLabels[formData.rating - 1]}
                </span>
              )}
            </div>
            {errors.rating && (
              <p className="text-red-600 text-sm mt-1">{errors.rating}</p>
            )}
          </div>
        )}

        {showCategory && (
          <div>
            <label className={labelClass}>Category *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleInputChange('category', category.id)}
                  className={cn(
                    'p-3 border-2 rounded-lg cursor-pointer transition',
                    formData.category === category.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <h4 className="font-medium text-gray-900 mb-1">{category.name}</h4>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                ))}
              </div>
            {errors.category && (
              <p className="text-red-600 text-sm mt-2">{errors.category}</p>
            )}
          </div>
        )}

        <div>
          <label className={labelClass}>Your Feedback *</label>
          <textarea
            value={formData.feedback}
            onChange={(e) => handleInputChange('feedback', e.target.value)}
            className={cn(inputClass, 'min-h-[150px] resize-y')}
            placeholder="Please share your detailed feedback..."
          />
          {errors.feedback && (
            <p className="text-red-600 text-sm mt-1">{errors.feedback}</p>
          )}
        </div>

        {showContactInfo && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <label className={labelClass}>Email</label>
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
              </div>

              <div>
                <label className={labelClass}>Company</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className={cn(inputClass, 'pl-11')}
                    placeholder="Company name"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {showAnonymous && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.anonymous}
                onChange={(e) => handleInputChange('anonymous', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                Submit anonymously
              </span>
            </label>
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.followUp}
              onChange={(e) => handleInputChange('followUp', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              I'd like to receive follow-up on this feedback
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
            isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          )}
        >
          {isSubmitting ? 'Submitting...' : submitButtonText}
        </button>
      </form>
    </div>
  )
}

// Component configuration for editor
export const FeedbackFormConfig = {
  id: 'feedback-form',
  name: 'Feedback Form',
  description: 'Customer feedback form with rating, categories, and contact options',
  category: 'business' as const,
  icon: 'message-square',
  defaultProps: {
    title: 'Share Your Feedback',
    subtitle: 'Help us improve by sharing your thoughts and suggestions',
    showRating: true,
    showCategory: true,
    showContactInfo: false,
    showAnonymous: true,
    categories: [
      {
        id: 'general',
        name: 'General Feedback',
        description: 'General comments and suggestions'
      },
      {
        id: 'bug',
        name: 'Bug Report',
        description: 'Report a technical issue or bug'
      },
      {
        id: 'feature',
        name: 'Feature Request',
        description: 'Suggest a new feature or improvement'
      }
    ],
    ratingLabels: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
    submitButtonText: 'Submit Feedback',
    successMessage: 'Thank you for your feedback! We appreciate your input.',
    errorMessage: 'Sorry, there was an error submitting your feedback. Please try again.',
    layout: 'single',
    theme: 'light',
    showSocialProof: true,
    responseTime: '24 hours'
  },
  defaultSize: { width: 100, height: 600 },
  editableFields: [
    'title',
    'subtitle',
    'showRating',
    'showCategory',
    'showContactInfo',
    'showAnonymous',
    'categories',
    'ratingLabels',
    'submitButtonText',
    'successMessage',
    'errorMessage',
    'layout',
    'theme',
    'showSocialProof',
    'responseTime'
  ]
}
