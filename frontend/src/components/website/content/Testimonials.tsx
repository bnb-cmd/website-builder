import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { Card } from '../../ui/card'
import { Star } from '@/lib/icons'
import { getResponsiveTextSize, getResponsivePadding } from '../renderer'

export const TestimonialsConfig: ComponentConfig = {
  id: 'testimonials',
  name: 'Testimonials',
  category: 'content',
  icon: 'Quote',
  description: 'Show customer testimonials',
  defaultProps: {},
  defaultSize: { width: 350, height: 200 },
  editableFields: []
}

interface TestimonialsProps extends WebsiteComponentProps {}

export const Testimonials: React.FC<TestimonialsProps> = ({ deviceMode = 'desktop' }) => {
  const textSize = getResponsiveTextSize('text-base', deviceMode)
  const padding = getResponsivePadding('p-6', deviceMode)
  
  return (
    <Card className={`w-full h-full text-center flex flex-col justify-center items-center ${padding}`}>
      <Star className="w-8 h-8 text-primary mb-4" />
      <p className={`italic mb-4 ${textSize}`}>"This is an amazing product! Highly recommend."</p>
      <p className={`font-semibold ${textSize}`}>- Customer Name</p>
    </Card>
  )
}
