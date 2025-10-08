import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const ContactFormConfig: ComponentConfig = {
  id: 'contact-form',
  name: 'Contact Form',
  category: 'business',
  icon: 'Mail',
  description: 'Add contact forms',
  defaultProps: {},
  defaultSize: { width: 400, height: 350 },
  editableFields: []
}

interface ContactFormProps extends WebsiteComponentProps {}

export const ContactForm: React.FC<ContactFormProps> = ({ deviceMode = 'desktop' }) => {
  const textSize = getResponsiveTextSize('text-base', deviceMode)
  const inputSize = getResponsiveTextSize('text-sm', deviceMode)
  const padding = getResponsivePadding('p-6', deviceMode)
  
  return (
    <Card className={`w-full h-full flex flex-col justify-center ${padding}`}>
      <h3 className={`font-semibold mb-4 ${textSize}`}>Contact Us</h3>
      <div className="space-y-4">
        <Input 
          type="text" 
          placeholder="Name" 
          className={`w-full p-2 border rounded ${inputSize}`}
          readOnly 
        />
        <Input 
          type="email" 
          placeholder="Email" 
          className={`w-full p-2 border rounded ${inputSize}`}
          readOnly 
        />
        <textarea 
          placeholder="Message" 
          className={`w-full p-2 border rounded h-24 ${inputSize}`}
          readOnly 
        />
        <Button className="w-full">Submit</Button>
      </div>
    </Card>
  )
}
