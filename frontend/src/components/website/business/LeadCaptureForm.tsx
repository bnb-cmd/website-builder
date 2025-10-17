'use client'

import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Building, Globe, Calendar, Clock, CheckCircle, Star, DollarSign, CreditCard, MessageSquare, FileText, Shield, Lock } from '@/lib/icons'
import { cn } from '@/lib/utils'

export interface LeadCaptureFormProps {
  onSubmit: (formData: any) => void
  title?: string
  subtitle?: string
  showName?: boolean
  showEmail?: boolean
  showPhone?: boolean
  showCompany?: boolean
  showJobTitle?: boolean
  showWebsite?: boolean
  showBudget?: boolean
  showTimeline?: boolean
  showSource?: boolean
  showInterests?: boolean
  showConsent?: boolean
  budgetRanges?: string[]
  timelineOptions?: string[]
  sourceOptions?: string[]
  interestOptions?: string[]
  submitButtonText?: string
  successMessage?: string
  errorMessage?: string
  layout?: 'single' | 'two-column' | 'compact' | 'card'
  theme?: 'light' | 'dark' | 'colored'
  showSocialProof?: boolean
  leadCount?: number
  showPrivacyBadge?: boolean
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  onSubmit,
  title = 'Get Started Today',
  subtitle = 'Fill out the form below and we\'ll get back to you within 24 hours',
  showName = true,
  showEmail = true,
  showPhone = true,
  showCompany = true,
  showJobTitle = true,
  showWebsite = false,
  showBudget = true,
  showTimeline = true,
  showSource = true,
  showInterests = true,
  showConsent = true,
  budgetRanges = ['Under PKR 50,000', 'PKR 50,000 - 100,000', 'PKR 100,000 - 500,000', 'PKR 500,000 - 1,000,000', 'Over PKR 1,000,000'],
  timelineOptions = ['ASAP', 'Within 1 month', 'Within 3 months', 'Within 6 months', 'Just exploring'],
  sourceOptions = ['Google Search', 'Social Media', 'Referral', 'Advertisement', 'Trade Show', 'Other'],
  interestOptions = ['Web Development', 'Mobile App', 'E-commerce', 'Digital Marketing', 'SEO', 'Content Creation', 'Consulting'],
  submitButtonText = 'Get Free Quote',
  successMessage = 'Thank you! We\'ll contact you within 24 hours.',
  errorMessage = 'Sorry, there was an error submitting your information. Please try again.',
  layout = 'single',
  theme = 'light',
  showSocialProof = true,
  leadCount = 1250,
  showPrivacyBadge = true
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    website: '',
    budget: '',
    timeline: '',
    source: '',
    interests: [] as string[],
    consent: false,
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

    if (showName && !formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (showEmail && !formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (showEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (showPhone && !formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    }

    if (showCompany && !formData.company.trim()) {
      newErrors.company = 'Company is required'
    }

    if (showBudget && !formData.budget) {
      newErrors.budget = 'Budget range is required'
    }

    if (showTimeline && !formData.timeline) {
      newErrors.timeline = 'Timeline is required'
    }

    if (showSource && !formData.source) {
      newErrors.source = 'Source is required'
    }

    if (showConsent && !formData.consent) {
      newErrors.consent = 'You must accept the terms and conditions'
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
        name: '',
        email: '',
        phone: '',
        company: '',
        jobTitle: '',
        website: '',
        budget: '',
        timeline: '',
        source: '',
        interests: [],
        consent: false,
        marketingConsent: false
      })
    } catch (error) {
      console.error('Error submitting lead capture:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatLeadCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showName && (
              <div>
                <label className={labelClass}>Name *</label>
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

            {showEmail && (
              <div>
                <label className={labelClass}>Email *</label>
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
            )}

            {showPhone && (
              <div>
                <label className={labelClass}>Phone *</label>
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

            {showCompany && (
              <div>
                <label className={labelClass}>Company *</label>
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
                {errors.company && (
                  <p className="text-red-600 text-sm mt-1">{errors.company}</p>
                )}
              </div>
            )}
          </div>

          {showBudget && (
            <div>
              <label className={labelClass}>Budget Range *</label>
              <select
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className={inputClass}
              >
                <option value="">Select budget range</option>
                {budgetRanges.map((range) => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
              {errors.budget && (
                <p className="text-red-600 text-sm mt-1">{errors.budget}</p>
              )}
            </div>
          )}

          {showConsent && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => handleInputChange('consent', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                I agree to the terms and conditions *
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
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{formatLeadCount(leadCount)}+ leads generated</span>
            </div>
          )}
          {showPrivacyBadge && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>100% Secure & Confidential</span>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showName && (
              <div>
                <label className={labelClass}>Name *</label>
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

            {showEmail && (
              <div>
                <label className={labelClass}>Email *</label>
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
            )}

            {showPhone && (
              <div>
                <label className={labelClass}>Phone *</label>
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

            {showCompany && (
              <div>
                <label className={labelClass}>Company *</label>
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
                {errors.company && (
                  <p className="text-red-600 text-sm mt-1">{errors.company}</p>
                )}
              </div>
            )}

            {showJobTitle && (
              <div>
                <label className={labelClass}>Job Title</label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  className={inputClass}
                  placeholder="Your job title"
                />
              </div>
            )}

            {showWebsite && (
              <div>
                <label className={labelClass}>Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className={cn(inputClass, 'pl-11')}
                    placeholder="https://company.com"
                  />
                </div>
              </div>
            )}
          </div>

          {showBudget && (
            <div>
              <label className={labelClass}>Budget Range *</label>
              <select
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className={inputClass}
              >
                <option value="">Select budget range</option>
                {budgetRanges.map((range) => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
              {errors.budget && (
                <p className="text-red-600 text-sm mt-1">{errors.budget}</p>
              )}
            </div>
          )}

          {showTimeline && (
            <div>
              <label className={labelClass}>Project Timeline *</label>
              <select
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                className={inputClass}
              >
                <option value="">Select timeline</option>
                {timelineOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.timeline && (
                <p className="text-red-600 text-sm mt-1">{errors.timeline}</p>
              )}
            </div>
          )}

          {showSource && (
            <div>
              <label className={labelClass}>How did you hear about us? *</label>
              <select
                value={formData.source}
                onChange={(e) => handleInputChange('source', e.target.value)}
                className={inputClass}
              >
                <option value="">Select source</option>
                {sourceOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.source && (
                <p className="text-red-600 text-sm mt-1">{errors.source}</p>
              )}
            </div>
          )}

          {showInterests && (
            <div>
              <label className={labelClass}>Areas of Interest</label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
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

          <div className="space-y-2">
            {showConsent && (
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => handleInputChange('consent', e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                  I agree to the terms and conditions *
                </span>
              </label>
            )}
            {errors.consent && (
              <p className="text-red-600 text-sm">{errors.consent}</p>
            )}

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.marketingConsent}
                onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{formatLeadCount(leadCount)}+ leads generated</span>
          </div>
        )}
        {showPrivacyBadge && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span>100% Secure & Confidential</span>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={cn(
          'grid gap-4',
          layout === 'two-column' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
        )}>
          {showName && (
            <div>
              <label className={labelClass}>Name *</label>
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

          {showEmail && (
            <div>
              <label className={labelClass}>Email *</label>
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
          )}

          {showPhone && (
            <div>
              <label className={labelClass}>Phone *</label>
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

          {showCompany && (
            <div>
              <label className={labelClass}>Company *</label>
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
              {errors.company && (
                <p className="text-red-600 text-sm mt-1">{errors.company}</p>
              )}
            </div>
          )}

          {showJobTitle && (
            <div>
              <label className={labelClass}>Job Title</label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                className={inputClass}
                placeholder="Your job title"
              />
            </div>
          )}

          {showWebsite && (
            <div>
              <label className={labelClass}>Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className={cn(inputClass, 'pl-11')}
                  placeholder="https://company.com"
                />
              </div>
            </div>
          )}
        </div>

        {showBudget && (
          <div>
            <label className={labelClass}>Budget Range *</label>
            <select
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className={inputClass}
            >
              <option value="">Select budget range</option>
              {budgetRanges.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
            {errors.budget && (
              <p className="text-red-600 text-sm mt-1">{errors.budget}</p>
            )}
          </div>
        )}

        {showTimeline && (
          <div>
            <label className={labelClass}>Project Timeline *</label>
            <select
              value={formData.timeline}
              onChange={(e) => handleInputChange('timeline', e.target.value)}
              className={inputClass}
            >
              <option value="">Select timeline</option>
              {timelineOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.timeline && (
              <p className="text-red-600 text-sm mt-1">{errors.timeline}</p>
            )}
          </div>
        )}

        {showSource && (
          <div>
            <label className={labelClass}>How did you hear about us? *</label>
            <select
              value={formData.source}
              onChange={(e) => handleInputChange('source', e.target.value)}
              className={inputClass}
            >
              <option value="">Select source</option>
              {sourceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {errors.source && (
              <p className="text-red-600 text-sm mt-1">{errors.source}</p>
            )}
          </div>
        )}

        {showInterests && (
          <div>
            <label className={labelClass}>Areas of Interest</label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
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

        <div className="space-y-2">
          {showConsent && (
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => handleInputChange('consent', e.target.checked)}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                I agree to the terms and conditions *
              </span>
            </label>
          )}
          {errors.consent && (
            <p className="text-red-600 text-sm">{errors.consent}</p>
          )}

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.marketingConsent}
              onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
export const LeadCaptureFormConfig = {
  id: 'lead-capture-form',
  name: 'Lead Capture Form',
  description: 'Lead generation form with budget, timeline, and interest tracking',
  category: 'business' as const,
  icon: 'user-plus',
  defaultProps: {
    title: 'Get Started Today',
    subtitle: 'Fill out the form below and we\'ll get back to you within 24 hours',
    showName: true,
    showEmail: true,
    showPhone: true,
    showCompany: true,
    showJobTitle: true,
    showWebsite: false,
    showBudget: true,
    showTimeline: true,
    showSource: true,
    showInterests: true,
    showConsent: true,
    budgetRanges: ['Under PKR 50,000', 'PKR 50,000 - 100,000', 'PKR 100,000 - 500,000', 'PKR 500,000 - 1,000,000', 'Over PKR 1,000,000'],
    timelineOptions: ['ASAP', 'Within 1 month', 'Within 3 months', 'Within 6 months', 'Just exploring'],
    sourceOptions: ['Google Search', 'Social Media', 'Referral', 'Advertisement', 'Trade Show', 'Other'],
    interestOptions: ['Web Development', 'Mobile App', 'E-commerce', 'Digital Marketing', 'SEO', 'Content Creation', 'Consulting'],
    submitButtonText: 'Get Free Quote',
    successMessage: 'Thank you! We\'ll contact you within 24 hours.',
    errorMessage: 'Sorry, there was an error submitting your information. Please try again.',
    layout: 'single',
    theme: 'light',
    showSocialProof: true,
    leadCount: 1250,
    showPrivacyBadge: true
  },
  defaultSize: { width: 100, height: 600 },
  editableFields: [
    'title',
    'subtitle',
    'showName',
    'showEmail',
    'showPhone',
    'showCompany',
    'showJobTitle',
    'showWebsite',
    'showBudget',
    'showTimeline',
    'showSource',
    'showInterests',
    'showConsent',
    'budgetRanges',
    'timelineOptions',
    'sourceOptions',
    'interestOptions',
    'submitButtonText',
    'successMessage',
    'errorMessage',
    'layout',
    'theme',
    'showSocialProof',
    'leadCount',
    'showPrivacyBadge'
  ]
}
