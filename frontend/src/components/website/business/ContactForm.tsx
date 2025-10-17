'use client'

import React, { useState } from 'react'
import { Mail, User, Phone, MapPin, Building, Globe, Calendar, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ContactFormProps {
  onSubmit: (formData: any) => void
  fields?: Array<{
    id: string
    name: string
    type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio'
    label: string
    placeholder?: string
    required?: boolean
    options?: string[]
    validation?: any
  }>
  showName?: boolean
  showEmail?: boolean
  showPhone?: boolean
  showCompany?: boolean
  showMessage?: boolean
  showSubject?: boolean
  showAddress?: boolean
  showWebsite?: boolean
  showPrivacyConsent?: boolean
  submitButtonText?: string
  successMessage?: string
  errorMessage?: string
  layout?: 'single' | 'two-column' | 'compact'
  theme?: 'light' | 'dark' | 'colored'
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  fields,
  showName = true,
  showEmail = true,
  showPhone = true,
  showCompany = false,
  showMessage = true,
  showSubject = true,
  showAddress = false,
  showWebsite = false,
  showPrivacyConsent = true,
  submitButtonText = 'Send Message',
  successMessage = 'Thank you! Your message has been sent successfully.',
  errorMessage = 'Sorry, there was an error sending your message. Please try again.',
  layout = 'single',
  theme = 'light'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    address: '',
    website: '',
    privacyConsent: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
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

    if (showMessage && !formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    if (showPrivacyConsent && !formData.privacyConsent) {
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
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        address: '',
        website: '',
        privacyConsent: false
      })
    } catch (error) {
      console.error('Error submitting form:', error)
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
    'p-6 rounded-lg',
    theme === 'dark' 
      ? 'bg-gray-900'
      : theme === 'colored'
      ? 'bg-gradient-to-br from-blue-50 to-purple-50'
      : 'bg-white'
  )

  return (
    <div className={cn(containerClass, 'border border-gray-200')}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={cn(
          'grid gap-6',
          layout === 'two-column' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
        )}>
          {/* Name */}
          {showName && (
            <div>
              <label className={labelClass}>
                Name *
              </label>
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

          {/* Email */}
          {showEmail && (
            <div>
              <label className={labelClass}>
                Email *
              </label>
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

          {/* Phone */}
          {showPhone && (
            <div>
              <label className={labelClass}>
                Phone *
              </label>
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

          {/* Company */}
          {showCompany && (
            <div>
              <label className={labelClass}>
                Company
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className={cn(inputClass, 'pl-11')}
                  placeholder="Your company"
                />
              </div>
            </div>
          )}

          {/* Website */}
          {showWebsite && (
            <div>
              <label className={labelClass}>
                Website
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className={cn(inputClass, 'pl-11')}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          )}

          {/* Subject */}
          {showSubject && (
            <div className={layout === 'two-column' ? 'md:col-span-2' : ''}>
              <label className={labelClass}>
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                className={inputClass}
                placeholder="How can we help?"
              />
            </div>
          )}

          {/* Address */}
          {showAddress && (
            <div className={layout === 'two-column' ? 'md:col-span-2' : ''}>
              <label className={labelClass}>
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={cn(inputClass, 'pl-11')}
                  placeholder="Your address"
                />
              </div>
            </div>
          )}

          {/* Message */}
          {showMessage && (
            <div className={layout === 'two-column' ? 'md:col-span-2' : ''}>
              <label className={labelClass}>
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className={cn(inputClass, 'min-h-[150px] resize-y')}
                placeholder="Tell us more about your inquiry..."
              />
              {errors.message && (
                <p className="text-red-600 text-sm mt-1">{errors.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Privacy Consent */}
        {showPrivacyConsent && (
          <div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.privacyConsent}
                onChange={(e) => handleInputChange('privacyConsent', e.target.checked)}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                I agree to the privacy policy and terms of service *
              </span>
            </label>
            {errors.privacyConsent && (
              <p className="text-red-600 text-sm mt-1">{errors.privacyConsent}</p>
            )}
          </div>
        )}

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

        {/* Submit Button */}
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
          {isSubmitting ? 'Sending...' : submitButtonText}
        </button>
      </form>
    </div>
  )
}

// Component configuration for editor
export const ContactFormConfig = {
  id: 'contact-form',
  name: 'Contact Form',
  description: 'Contact form with customizable fields and validation',
  category: 'business' as const,
  icon: 'mail',
  defaultProps: {
    showName: true,
    showEmail: true,
    showPhone: true,
    showCompany: false,
    showMessage: true,
    showSubject: true,
    showAddress: false,
    showWebsite: false,
    showPrivacyConsent: true,
    submitButtonText: 'Send Message',
    successMessage: 'Thank you! Your message has been sent successfully.',
    errorMessage: 'Sorry, there was an error sending your message. Please try again.',
    layout: 'single',
    theme: 'light'
  },
  defaultSize: { width: 100, height: 600 },
  editableFields: [
    'fields',
    'showName',
    'showEmail',
    'showPhone',
    'showCompany',
    'showMessage',
    'showSubject',
    'showAddress',
    'showWebsite',
    'showPrivacyConsent',
    'submitButtonText',
    'successMessage',
    'errorMessage',
    'layout',
    'theme'
  ]
}