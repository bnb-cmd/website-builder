import React, { useState } from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const AppointmentBookingConfig: ComponentConfig = {
  id: 'appointment-booking',
  name: 'Appointment Booking',
  category: 'business',
  icon: 'Calendar',
  description: 'Book appointments and schedule meetings',
  defaultProps: {
    title: 'Book an Appointment',
    subtitle: 'Schedule your consultation today',
    services: [
      { id: 'consultation', name: 'Consultation', duration: 30, price: 100 },
      { id: 'follow-up', name: 'Follow-up', duration: 15, price: 50 },
      { id: 'assessment', name: 'Assessment', duration: 60, price: 200 }
    ],
    timeSlots: [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ],
    showCalendar: true,
    showTimeSlots: true,
    showServices: true,
    confirmationMessage: 'Your appointment has been booked successfully!'
  },
  defaultSize: { width: 400, height: 500 },
  editableFields: [
    'title',
    'subtitle',
    'confirmationMessage'
  ]
}

interface AppointmentBookingProps extends WebsiteComponentProps {
  title?: string
  subtitle?: string
  services?: Array<{
    id: string
    name: string
    duration: number
    price: number
  }>
  timeSlots?: string[]
  showCalendar?: boolean
  showTimeSlots?: boolean
  showServices?: boolean
  confirmationMessage?: string
}

export const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ 
  deviceMode = 'desktop',
  title = 'Book an Appointment',
  subtitle = 'Schedule your consultation today',
  services = [],
  timeSlots = [],
  showCalendar = true,
  showTimeSlots = true,
  showServices = true,
  confirmationMessage = 'Your appointment has been booked successfully!'
}) => {
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isBooked, setIsBooked] = useState(false)

  const textSize = getResponsiveTextSize('text-base', deviceMode)
  const titleSize = getResponsiveTextSize('text-xl', deviceMode)
  const padding = getResponsivePadding('p-6', deviceMode)
  
  const handleBooking = () => {
    if (selectedService && selectedDate && selectedTime && customerInfo.name && customerInfo.email) {
      setIsBooked(true)
    }
  }

  if (isBooked) {
    return (
      <Card className={`w-full h-full flex flex-col justify-center items-center ${padding}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className={`font-semibold mb-2 ${titleSize}`}>Appointment Booked!</h3>
          <p className={`${textSize} text-gray-600`}>{confirmationMessage}</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`w-full h-full flex flex-col ${padding}`}>
      <div className="mb-6">
        <h3 className={`font-semibold mb-2 ${titleSize}`}>{title}</h3>
        <p className={`${textSize} text-gray-600`}>{subtitle}</p>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {showServices && services.length > 0 && (
          <div>
            <label className={`block font-medium mb-2 ${textSize}`}>Select Service</label>
            <div className="space-y-2">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`p-3 border rounded cursor-pointer transition-colors ${
                    selectedService === service.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${textSize}`}>{service.name}</span>
                    <span className={`text-sm text-gray-600`}>
                      {service.duration}min - ${service.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showCalendar && (
          <div>
            <label className={`block font-medium mb-2 ${textSize}`}>Select Date</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`w-full p-2 border rounded ${textSize}`}
            />
          </div>
        )}

        {showTimeSlots && timeSlots.length > 0 && (
          <div>
            <label className={`block font-medium mb-2 ${textSize}`}>Select Time</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  className={`p-2 text-sm border rounded transition-colors ${
                    selectedTime === time
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className={`block font-medium mb-1 ${textSize}`}>Name</label>
            <Input
              type="text"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              placeholder="Your name"
              className={`w-full p-2 border rounded ${textSize}`}
            />
          </div>
          <div>
            <label className={`block font-medium mb-1 ${textSize}`}>Email</label>
            <Input
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              placeholder="your@email.com"
              className={`w-full p-2 border rounded ${textSize}`}
            />
          </div>
          <div>
            <label className={`block font-medium mb-1 ${textSize}`}>Phone</label>
            <Input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              placeholder="Your phone number"
              className={`w-full p-2 border rounded ${textSize}`}
            />
          </div>
        </div>
      </div>

      <Button 
        onClick={handleBooking}
        className="w-full mt-4"
        disabled={!selectedService || !selectedDate || !selectedTime || !customerInfo.name || !customerInfo.email}
      >
        Book Appointment
      </Button>
    </Card>
  )
}
