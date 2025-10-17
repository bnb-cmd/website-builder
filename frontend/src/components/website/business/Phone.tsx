import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Phone } from '@/lib/icons'
import { getResponsiveTextSize } from '../renderer'

export const PhoneConfig: ComponentConfig = {
  id: 'phone',
  name: 'Phone',
  category: 'business',
  icon: 'Phone',
  description: 'Display phone numbers',
  defaultProps: { phoneNumber: '+1 (123) 456-7890' },
  defaultSize: { width: 200, height: 40 },
  editableFields: ['phoneNumber']
}

interface PhoneProps extends WebsiteComponentProps {
  phoneNumber: string
}

export const WebsitePhone: React.FC<PhoneProps> = ({ 
  phoneNumber = '+1 (123) 456-7890',
  deviceMode = 'desktop'
}) => {
  const textSize = getResponsiveTextSize('text-lg', deviceMode)
  
  return (
    <div className="w-full h-full flex items-center justify-center font-semibold">
      <Phone className="w-5 h-5 mr-2" />
      <span className={textSize}>{phoneNumber}</span>
    </div>
  )
}
