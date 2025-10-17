import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Mail } from '@/lib/icons'
import { getResponsiveTextSize } from '../renderer'

export const EmailConfig: ComponentConfig = {
  id: 'email',
  name: 'Email',
  category: 'business',
  icon: 'Mail',
  description: 'Display email addresses',
  defaultProps: { email: 'info@example.com' },
  defaultSize: { width: 250, height: 40 },
  editableFields: ['email']
}

interface EmailProps extends WebsiteComponentProps {
  email: string
}

export const WebsiteEmail: React.FC<EmailProps> = ({ 
  email = 'info@example.com',
  deviceMode = 'desktop'
}) => {
  const textSize = getResponsiveTextSize('text-lg', deviceMode)
  
  return (
    <div className="w-full h-full flex items-center justify-center font-semibold">
      <Mail className="w-5 h-5 mr-2" />
      <span className={textSize}>{email}</span>
    </div>
  )
}
