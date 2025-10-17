'use client'

import React, { useState } from 'react'
import { User, Mail, Phone, MapPin, Building, Globe, Calendar, Clock, CheckCircle, Star, DollarSign, CreditCard } from '@/lib/icons'
import { cn } from '@/lib/utils'

export interface EventRegistrationFormProps {
  onSubmit: (formData: any) => void
  event: {
    id: string
    title: string
    date: string
    time: string
    location: string
    price: number
    description?: string
    maxAttendees?: number
    currentAttendees?: number
  }
  showPersonalInfo?: boolean
  showCompanyInfo?: boolean
  showDietaryRequirements?: boolean
  showAccessibility?: boolean
  showEmergencyContact?: boolean
  showPayment?: boolean
  showTickets?: boolean
  dietaryOptions?: string[]
  accessibilityOptions?: string[]
  paymentMethods?: Array<{
    id: string
    name: string
    type: 'card' | 'bank' | 'mobile' | 'cod'
    icon: string
  }>
  submitButtonText?: string
  successMessage?: string
  errorMessage?: string
  layout?: 'single' | 'multi-step' | 'compact'
  theme?: 'light' | 'dark' | 'colored'
}

export const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({
  onSubmit,
  event = {
    id: '1',
    title: 'Tech Conference 2024',
    date: '2024-03-15',
    time: '09:00',
    location: 'Karachi Convention Centre',
    price: 5000,
    description: 'Annual technology conference featuring industry leaders',
    maxAttendees: 500,
    currentAttendees: 250
  },
  showPersonalInfo = true,
  showCompanyInfo = false,
  showDietaryRequirements = true,
  showAccessibility = true,
  showEmergencyContact = true,
  showPayment = true,
  showTickets = true,
  dietaryOptions = ['None', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Dairy-Free', 'Nut Allergy'],
  accessibilityOptions = ['None', 'Wheelchair Access', 'Hearing Assistance', 'Visual Assistance', 'Mobility Support'],
  paymentMethods = [
    {
      id: 'jazzcash',
      name: 'JazzCash',
      type: 'mobile',
      icon: '📱'
    },
    {
      id: 'easypaisa',
      name: 'EasyPaisa',
      type: 'mobile',
      icon: '💰'
    },
    {
      id: 'credit-card',
      name: 'Credit Card',
      type: 'card',
      icon: '💳'
    },
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      type: 'bank',
      icon: '🏦'
    }
  ],
  submitButtonText = 'Register for Event',
  successMessage = 'Thank you! Your registration has been confirmed.',
  errorMessage = 'Sorry, there was an error processing your registration. Please try again.',
  layout = 'single',
  theme = 'light'
}) => {
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Company Info
    company: '',
    jobTitle: '',
    website: '',
    
    // Event Specific
    dietaryRequirements: [] as string[],
    accessibilityNeeds: [] as string[],
    emergencyContactName: '',
    emergencyContactPhone: '',
    
    // Payment
    paymentMethod: '',
    ticketQuantity: 1,
    
    // Consent
    privacyConsent: false,
    termsConsent: false,
    marketingConsent: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [currentStep, setCurrentStep] = useState(1)

  const handleInputChange = (field: string, value: string | boolean | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleRequirementToggle = (type: 'dietary' | 'accessibility', requirement: string) => {
    const field = type === 'dietary' ? 'dietaryRequirements' : 'accessibilityNeeds'
    const currentRequirements = formData[field] as string[]
    const newRequirements = currentRequirements.includes(requirement)
      ? currentRequirements.filter(r => r !== requirement)
      : [...currentRequirements, requirement]
    handleInputChange(field, newRequirements)
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1 && showPersonalInfo) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email'
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    }

    if (step === 2 && showCompanyInfo) {
      if (!formData.company.trim()) newErrors.company = 'Company is required'
    }

    if (step === 3) {
      if (showPayment && !formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required'
      if (!formData.privacyConsent) newErrors.privacyConsent = 'You must accept the privacy policy'
      if (!formData.termsConsent) newErrors.termsConsent = 'You must accept the terms and conditions'
    }

    return newErrors
  }

  const handleNext = () => {
    const newErrors = validateStep(currentStep)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setCurrentStep(prev => prev + 1)
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = validateStep(3)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await onSubmit(formData)
      setSubmitStatus('success')
    } catch (error) {
      console.error('Error registering for event:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPrice = (price: number) => {
    return `PKR ${price.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const totalPrice = event.price * formData.ticketQuantity
  const availableSpots = event.maxAttendees ? event.maxAttendees - (event.currentAttendees || 0) : null

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

  const PersonalInfoStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={cn(inputClass, 'pl-11')}
                placeholder="John"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={inputClass}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={cn(inputClass, 'pl-11')}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

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
        </div>
      </div>
    </div>
  )

  const CompanyInfoStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
        <div className="space-y-4">
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

          <div>
            <label className={labelClass}>Job Title</label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              className={inputClass}
              placeholder="Software Developer"
            />
          </div>

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
        </div>
      </div>
    </div>
  )

  const EventDetailsStep = () => (
    <div className="space-y-6">
      {showDietaryRequirements && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dietary Requirements</h3>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleRequirementToggle('dietary', option)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm border transition',
                  formData.dietaryRequirements.includes(option)
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {showAccessibility && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Accessibility Needs</h3>
          <div className="flex flex-wrap gap-2">
            {accessibilityOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleRequirementToggle('accessibility', option)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm border transition',
                  formData.accessibilityNeeds.includes(option)
                    ? 'bg-green-100 border-green-300 text-green-800'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {showEmergencyContact && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Emergency Contact Name</label>
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                className={inputClass}
                placeholder="Emergency contact name"
              />
            </div>

            <div>
              <label className={labelClass}>Emergency Contact Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                  className={cn(inputClass, 'pl-11')}
                  placeholder="+92 300 1234567"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const PaymentStep = () => (
    <div className="space-y-6">
      {showTickets && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{event.title}</span>
              <span className="text-sm text-gray-600">{formatDate(event.date)} at {event.time}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">{event.location}</span>
              <span className="font-semibold">{formatPrice(event.price)} per ticket</span>
            </div>
            
            <div className="flex items-center gap-4">
              <label className={labelClass}>Quantity:</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleInputChange('ticketQuantity', Math.max(1, formData.ticketQuantity - 1))}
                  className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{formData.ticketQuantity}</span>
                <button
                  type="button"
                  onClick={() => handleInputChange('ticketQuantity', formData.ticketQuantity + 1)}
                  className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPayment && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => handleInputChange('paymentMethod', method.id)}
                className={cn(
                  'p-4 border-2 rounded-lg cursor-pointer transition',
                  formData.paymentMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <span className="font-medium">{method.name}</span>
                </div>
              </div>
            ))}
          </div>
          {errors.paymentMethod && (
            <p className="text-red-600 text-sm mt-2">{errors.paymentMethod}</p>
          )}
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Consent</h3>
        <div className="space-y-3">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.privacyConsent}
              onChange={(e) => handleInputChange('privacyConsent', e.target.checked)}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              I agree to the privacy policy *
            </span>
          </label>
          {errors.privacyConsent && (
            <p className="text-red-600 text-sm">{errors.privacyConsent}</p>
          )}

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.termsConsent}
              onChange={(e) => handleInputChange('termsConsent', e.target.checked)}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              I agree to the terms and conditions *
            </span>
          </label>
          {errors.termsConsent && (
            <p className="text-red-600 text-sm">{errors.termsConsent}</p>
          )}

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.marketingConsent}
              onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              I'd like to receive updates about future events
            </span>
          </label>
        </div>
      </div>
    </div>
  )

  if (layout === 'multi-step') {
    return (
      <div className={containerClass}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Register for {event.title}</h2>
          <p className="text-gray-600">{formatDate(event.date)} at {event.time}</p>
          <p className="text-gray-600">{event.location}</p>
          {availableSpots !== null && (
            <p className="text-sm text-blue-600">{availableSpots} spots remaining</p>
          )}
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              )}>
                {step}
              </div>
              {step < 3 && (
                <div className={cn(
                  'w-16 h-0.5 mx-2',
                  currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                )} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && <PersonalInfoStep />}
          {currentStep === 2 && <EventDetailsStep />}
          {currentStep === 3 && <PaymentStep />}

          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Back
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'ml-auto px-6 py-2 rounded-lg font-medium transition',
                  isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                )}
              >
                {isSubmitting ? 'Processing...' : submitButtonText}
              </button>
            )}
          </div>
        </form>

        {/* Submit Status */}
        {submitStatus === 'success' && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {errorMessage}
          </div>
        )}
      </div>
    )
  }

  if (layout === 'compact') {
    return (
      <div className={containerClass}>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h2>
          <p className="text-sm text-gray-600">{formatDate(event.date)} at {event.time}</p>
          <p className="text-sm text-gray-600">{event.location}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name *</label>
              <input
                type="text"
                value={`${formData.firstName} ${formData.lastName}`}
                onChange={(e) => {
                  const [first, ...last] = e.target.value.split(' ')
                  handleInputChange('firstName', first || '')
                  handleInputChange('lastName', last.join(' ') || '')
                }}
                className={inputClass}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className={labelClass}>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={inputClass}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className={labelClass}>Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={inputClass}
                placeholder="+92 300 1234567"
              />
            </div>

            <div>
              <label className={labelClass}>Tickets</label>
              <select
                value={formData.ticketQuantity}
                onChange={(e) => handleInputChange('ticketQuantity', parseInt(e.target.value))}
                className={inputClass}
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} ticket{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.privacyConsent}
              onChange={(e) => handleInputChange('privacyConsent', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
              I agree to the privacy policy *
            </span>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="font-semibold">{formatPrice(totalPrice)}</span>
            </div>
          </div>

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
            {isSubmitting ? 'Processing...' : submitButtonText}
          </button>
        </form>
      </div>
    )
  }

  // Single layout (default)
  return (
    <div className={containerClass}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Register for {event.title}</h2>
        <p className="text-gray-600">{formatDate(event.date)} at {event.time}</p>
        <p className="text-gray-600">{event.location}</p>
        {availableSpots !== null && (
          <p className="text-sm text-blue-600">{availableSpots} spots remaining</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {showPersonalInfo && <PersonalInfoStep />}
        {showCompanyInfo && <CompanyInfoStep />}
        <EventDetailsStep />
        <PaymentStep />

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
          {isSubmitting ? 'Processing...' : submitButtonText}
        </button>
      </form>
    </div>
  )
}

// Component configuration for editor
export const EventRegistrationFormConfig = {
  id: 'event-registration-form',
  name: 'Event Registration Form',
  description: 'Event registration form with tickets, dietary requirements, and payment',
  category: 'business' as const,
  icon: 'calendar',
  defaultProps: {
    event: {
      id: '1',
      title: 'Tech Conference 2024',
      date: '2024-03-15',
      time: '09:00',
      location: 'Karachi Convention Centre',
      price: 5000,
      description: 'Annual technology conference featuring industry leaders',
      maxAttendees: 500,
      currentAttendees: 250
    },
    showPersonalInfo: true,
    showCompanyInfo: false,
    showDietaryRequirements: true,
    showAccessibility: true,
    showEmergencyContact: true,
    showPayment: true,
    showTickets: true,
    dietaryOptions: ['None', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Dairy-Free', 'Nut Allergy'],
    accessibilityOptions: ['None', 'Wheelchair Access', 'Hearing Assistance', 'Visual Assistance', 'Mobility Support'],
    paymentMethods: [
      {
        id: 'jazzcash',
        name: 'JazzCash',
        type: 'mobile',
        icon: '📱'
      },
      {
        id: 'easypaisa',
        name: 'EasyPaisa',
        type: 'mobile',
        icon: '💰'
      },
      {
        id: 'credit-card',
        name: 'Credit Card',
        type: 'card',
        icon: '💳'
      }
    ],
    submitButtonText: 'Register for Event',
    successMessage: 'Thank you! Your registration has been confirmed.',
    errorMessage: 'Sorry, there was an error processing your registration. Please try again.',
    layout: 'single',
    theme: 'light'
  },
  defaultSize: { width: 100, height: 700 },
  editableFields: [
    'event',
    'showPersonalInfo',
    'showCompanyInfo',
    'showDietaryRequirements',
    'showAccessibility',
    'showEmergencyContact',
    'showPayment',
    'showTickets',
    'dietaryOptions',
    'accessibilityOptions',
    'paymentMethods',
    'submitButtonText',
    'successMessage',
    'errorMessage',
    'layout',
    'theme'
  ]
}
