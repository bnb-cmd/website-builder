'use client'

import React, { useState } from 'react'
import { Calendar, Clock, User, Mail, Phone, MapPin, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AppointmentBookingProps {
  onSubmit: (appointmentData: any) => void
  services: Array<{
    id: string
    name: string
    duration: number
    price: number
    description?: string
  }>
  timeSlots: Array<{
    date: string
    slots: Array<{
      time: string
      available: boolean
    }>
  }>
  showServices?: boolean
  showTimeSlots?: boolean
  showCustomerInfo?: boolean
  showNotes?: boolean
  showConfirmation?: boolean
  minAdvanceBooking?: number
  maxAdvanceBooking?: number
  workingHours?: {
    start: string
    end: string
    days: string[]
  }
  layout?: 'single' | 'two-column' | 'compact'
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({
  onSubmit,
  services = [
    {
      id: '1',
      name: 'Consultation',
      duration: 30,
      price: 2000,
      description: 'Initial consultation session'
    },
    {
      id: '2',
      name: 'Follow-up',
      duration: 15,
      price: 1000,
      description: 'Follow-up appointment'
    },
    {
      id: '3',
      name: 'Extended Session',
      duration: 60,
      price: 4000,
      description: 'Extended consultation session'
    }
  ],
  timeSlots = [
    {
      date: '2024-01-20',
      slots: [
        { time: '09:00', available: true },
        { time: '09:30', available: false },
        { time: '10:00', available: true },
        { time: '10:30', available: true },
        { time: '11:00', available: false },
        { time: '11:30', available: true }
      ]
    },
    {
      date: '2024-01-21',
      slots: [
        { time: '09:00', available: true },
        { time: '09:30', available: true },
        { time: '10:00', available: false },
        { time: '10:30', available: true },
        { time: '11:00', available: true },
        { time: '11:30', available: false }
      ]
    }
  ],
  showServices = true,
  showTimeSlots = true,
  showCustomerInfo = true,
  showNotes = true,
  showConfirmation = true,
  minAdvanceBooking = 2,
  maxAdvanceBooking = 30,
  workingHours = {
    start: '09:00',
    end: '17:00',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  layout = 'single'
}) => {
  const [formData, setFormData] = useState({
    serviceId: '',
    date: '',
    time: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: '',
    confirmed: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (showServices && !formData.serviceId) {
        newErrors.serviceId = 'Please select a service'
      }
      if (showTimeSlots && !formData.date) {
        newErrors.date = 'Please select a date'
      }
      if (showTimeSlots && !formData.time) {
        newErrors.time = 'Please select a time'
      }
    }

    if (step === 2 && showCustomerInfo) {
      if (!formData.customerName.trim()) {
        newErrors.customerName = 'Name is required'
      }
      if (!formData.customerEmail.trim()) {
        newErrors.customerEmail = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
        newErrors.customerEmail = 'Please enter a valid email'
      }
      if (!formData.customerPhone.trim()) {
        newErrors.customerPhone = 'Phone is required'
      }
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

    const newErrors = validateStep(2)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error booking appointment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedService = services.find(s => s.id === formData.serviceId)
  const selectedDateSlots = timeSlots.find(slot => slot.date === formData.date)

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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Book an Appointment</h2>
        <p className="text-gray-600">Schedule your appointment with us</p>
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
        {/* Step 1: Service & Time Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Services */}
            {showServices && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Service</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleInputChange('serviceId', service.id)}
                      className={cn(
                        'p-4 border-2 rounded-lg cursor-pointer transition',
                        formData.serviceId === service.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <h4 className="font-medium text-gray-900 mb-2">{service.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{service.duration} min</span>
                        <span className="font-semibold text-gray-900">{formatPrice(service.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.serviceId && (
                  <p className="text-red-600 text-sm mt-2">{errors.serviceId}</p>
                )}
              </div>
            )}

            {/* Date Selection */}
            {showTimeSlots && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.date}
                      type="button"
                      onClick={() => handleInputChange('date', slot.date)}
                      className={cn(
                        'p-3 border rounded-lg text-left transition',
                        formData.date === slot.date
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="font-medium text-gray-900">{formatDate(slot.date)}</div>
                      <div className="text-sm text-gray-600">
                        {slot.slots.filter(s => s.available).length} slots available
                      </div>
                    </button>
                  ))}
                </div>
                {errors.date && (
                  <p className="text-red-600 text-sm mt-2">{errors.date}</p>
                )}
              </div>
            )}

            {/* Time Selection */}
            {showTimeSlots && selectedDateSlots && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {selectedDateSlots.slots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => handleInputChange('time', slot.time)}
                      disabled={!slot.available}
                      className={cn(
                        'p-2 border rounded-lg text-sm font-medium transition',
                        formData.time === slot.time
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : slot.available
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      )}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
                {errors.time && (
                  <p className="text-red-600 text-sm mt-2">{errors.time}</p>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Customer Information */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>
            
            <div className={cn(
              'grid gap-4',
              layout === 'two-column' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
            )}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                {errors.customerName && (
                  <p className="text-red-600 text-sm mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                {errors.customerEmail && (
                  <p className="text-red-600 text-sm mt-1">{errors.customerEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+92 300 1234567"
                  />
                </div>
                {errors.customerPhone && (
                  <p className="text-red-600 text-sm mt-1">{errors.customerPhone}</p>
                )}
              </div>
            </div>

            {showNotes && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Any additional information..."
                />
              </div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Confirm Appointment</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-3">
                {selectedService && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{selectedService.name}</span>
                  </div>
                )}
                
                {formData.date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(formData.date)}</span>
                  </div>
                )}
                
                {formData.time && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{formData.time}</span>
                  </div>
                )}
                
                {selectedService && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{selectedService.duration} minutes</span>
                  </div>
                )}
                
                {selectedService && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">{formatPrice(selectedService.price)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{formData.customerName}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{formData.customerEmail}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{formData.customerPhone}</span>
                </div>
              </div>
            </div>

            {showConfirmation && (
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.confirmed}
                    onChange={(e) => handleInputChange('confirmed', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm the appointment details and agree to the terms
                  </span>
                </label>
                {errors.confirmed && (
                  <p className="text-red-600 text-sm mt-1">{errors.confirmed}</p>
                )}
              </div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.confirmed}
                className={cn(
                  'px-6 py-2 rounded-lg font-medium transition',
                  formData.confirmed && !isSubmitting
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                )}
              >
                {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

// Component configuration for editor
export const AppointmentBookingConfig = {
  id: 'appointment-booking',
  name: 'Appointment Booking',
  description: 'Multi-step appointment booking form with service and time selection',
  category: 'business' as const,
  icon: 'calendar',
  defaultProps: {
    services: [
      {
        id: '1',
        name: 'Consultation',
        duration: 30,
        price: 2000,
        description: 'Initial consultation session'
      }
    ],
    timeSlots: [
      {
        date: '2024-01-20',
        slots: [
          { time: '09:00', available: true },
          { time: '09:30', available: false },
          { time: '10:00', available: true }
        ]
      }
    ],
    showServices: true,
    showTimeSlots: true,
    showCustomerInfo: true,
    showNotes: true,
    showConfirmation: true,
    minAdvanceBooking: 2,
    maxAdvanceBooking: 30,
    layout: 'single'
  },
  defaultSize: { width: 100, height: 700 },
  editableFields: [
    'services',
    'timeSlots',
    'showServices',
    'showTimeSlots',
    'showCustomerInfo',
    'showNotes',
    'showConfirmation',
    'minAdvanceBooking',
    'maxAdvanceBooking',
    'workingHours',
    'layout'
  ]
}