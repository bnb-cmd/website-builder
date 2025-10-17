import React from 'react'
import { ComponentConfig, WebsiteComponentProps } from '@/lib/component-config'
import { getResponsiveTextSize } from '../renderer'

export const HeadingConfig: ComponentConfig = {
  id: 'heading',
  name: 'Heading',
  category: 'basic',
  icon: 'Type',
  description: 'Add titles and headings',
  defaultProps: { text: 'Your Heading Here', level: 2 },
  defaultSize: { width: 300, height: 60 },
  editableFields: ['text', 'level'],
  propertyConfig: {
    text: {
      label: 'Heading Text',
      type: 'text' as const,
      placeholder: 'Enter heading text',
      required: true,
      group: 'Content'
    },
    level: {
      label: 'Heading Level',
      type: 'select' as const,
      options: ['1', '2', '3', '4', '5', '6'],
      group: 'Content'
    }
  }
}

interface HeadingProps extends WebsiteComponentProps {
  text: string
  level: number
}

export const Heading: React.FC<HeadingProps> = ({ 
  text, 
  level, 
  deviceMode = 'desktop',
  onTextDoubleClick 
}) => {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements
  const textSize = getResponsiveTextSize(`text-${level === 1 ? '3xl' : level === 2 ? '2xl' : 'xl'}`, deviceMode)
  
  return (
    <Tag 
      className={`font-bold ${textSize}`}
      onDoubleClick={onTextDoubleClick}
    >
      {text}
    </Tag>
  )
}
