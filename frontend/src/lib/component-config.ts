import React from 'react'

export type ComponentCategory = 
  | 'basic' 
  | 'layout' 
  | 'content' 
  | 'business' 
  | 'ecommerce' 
  | 'media'
  | 'interactive'

export interface PropertyFieldConfig {
  label?: string
  type?: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'array' | 'object' | 'color' | 'image' | 'url' | 'email' | 'tel'
  options?: string[] // for select
  min?: number
  max?: number
  step?: number
  placeholder?: string
  description?: string
  validation?: (value: any) => boolean | string
  group?: string
  required?: boolean
}

export interface ComponentConfig {
  id: string
  name: string
  category: ComponentCategory
  icon: string
  isPremium?: boolean
  description: string
  defaultProps: Record<string, any>
  defaultSize: { width: number; height: number }
  editableFields: string[]
  propertyConfig?: Record<string, PropertyFieldConfig>
}

export interface ComponentProps {
  [key: string]: any
}

export interface WebsiteComponentProps extends ComponentProps {
  deviceMode?: 'desktop' | 'tablet' | 'mobile'
  isEditing?: boolean
  onTextEdit?: (value: string) => void
  onTextEditSubmit?: () => void
  onTextEditCancel?: () => void
}

export interface ComponentMetadata {
  config: ComponentConfig
  component: React.ComponentType<WebsiteComponentProps>
}

export type DeviceMode = 'desktop' | 'tablet' | 'mobile'

export interface ResponsiveDimensions {
  width: number
  height: number
  x: number
  y: number
}
