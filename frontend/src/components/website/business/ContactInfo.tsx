import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Phone, Mail, MapPin, Clock } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { getResponsivePadding, getResponsiveTextSize } from '../renderer'

export const ContactInfoConfig: ComponentConfig = {
  id: 'contact-info',
  name: 'Contact Info',
  category: 'business',
  icon: 'Phone',
  description: 'Display contact information',
  defaultProps: { 
    title: 'Get In Touch',
    subtitle: 'We\'d love to hear from you',
    phone: '+1 (555) 123-4567',
    email: 'info@company.com',
    address: '123 Business St, City, State 12345',
    hours: 'Mon-Fri: 9AM-6PM',
    showTitle: true,
    showSubtitle: true
  },
  defaultSize: { width: 400, height: 300 },
  editableFields: ['title', 'subtitle', 'phone', 'email', 'address', 'hours', 'showTitle', 'showSubtitle']
}

interface ContactInfoProps extends WebsiteComponentProps {
  title: string
  subtitle: string
  phone: string
  email: string
  address: string
  hours: string
  showTitle: boolean
  showSubtitle: boolean
}

export const WebsiteContactInfo: React.FC<ContactInfoProps> = ({ 
  title, 
  subtitle, 
  phone, 
  email, 
  address, 
  hours, 
  showTitle, 
  showSubtitle,
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const padding = getResponsivePadding('p-6', deviceMode)
  const titleSize = getResponsiveTextSize('text-2xl', deviceMode)
  const subtitleSize = getResponsiveTextSize('text-base', deviceMode)
  const infoSize = getResponsiveTextSize('text-sm', deviceMode)

  return (
    <div className={cn("w-full h-full bg-white border border-gray-200 rounded-lg", padding)}>
      <div className="space-y-6">
        {(showTitle || showSubtitle) && (
          <div className="text-center">
            {showTitle && (
              <h3 
                className={cn("font-bold mb-2", titleSize)}
                onDoubleClick={onTextDoubleClick}
              >
                {title}
              </h3>
            )}
            {showSubtitle && (
              <p 
                className={cn("text-gray-600", subtitleSize)}
                onDoubleClick={onTextDoubleClick}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-primary flex-shrink-0" />
            <a 
              href={`tel:${phone}`}
              className={cn("text-gray-700 hover:text-primary transition-colors", infoSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {phone}
            </a>
          </div>
          
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-primary flex-shrink-0" />
            <a 
              href={`mailto:${email}`}
              className={cn("text-gray-700 hover:text-primary transition-colors", infoSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {email}
            </a>
          </div>
          
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span 
              className={cn("text-gray-700", infoSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {address}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-primary flex-shrink-0" />
            <span 
              className={cn("text-gray-700", infoSize)}
              onDoubleClick={onTextDoubleClick}
            >
              {hours}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
