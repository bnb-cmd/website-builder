export interface ValidationResult {
  isValid: boolean
  error?: string
}

export const validateProperty = (value: any, fieldConfig?: any): ValidationResult => {
  // Custom validation function
  if (fieldConfig?.validation) {
    const result = fieldConfig.validation(value)
    if (typeof result === 'string') {
      return { isValid: false, error: result }
    }
    if (!result) {
      return { isValid: false, error: 'Invalid value' }
    }
  }

  // Required field validation
  if (fieldConfig?.required && (value === undefined || value === null || value === '')) {
    return { isValid: false, error: 'This field is required' }
  }

  // Type-specific validation
  if (fieldConfig?.type) {
    switch (fieldConfig.type) {
      case 'email':
        if (value && !isValidEmail(value)) {
          return { isValid: false, error: 'Invalid email format' }
        }
        break
      case 'url':
        if (value && !isValidUrl(value)) {
          return { isValid: false, error: 'Invalid URL format' }
        }
        break
      case 'number':
        if (value !== undefined && value !== null && value !== '') {
          const num = Number(value)
          if (isNaN(num)) {
            return { isValid: false, error: 'Must be a valid number' }
          }
          if (fieldConfig.min !== undefined && num < fieldConfig.min) {
            return { isValid: false, error: `Must be at least ${fieldConfig.min}` }
          }
          if (fieldConfig.max !== undefined && num > fieldConfig.max) {
            return { isValid: false, error: `Must be at most ${fieldConfig.max}` }
          }
        }
        break
      case 'tel':
        if (value && !isValidPhone(value)) {
          return { isValid: false, error: 'Invalid phone number format' }
        }
        break
    }
  }

  return { isValid: true }
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const isValidPhone = (phone: string): boolean => {
  // Basic phone validation - allows various formats
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

export const inferPropertyType = (value: any, fieldName: string): string => {
  if (value === null || value === undefined) {
    return 'text'
  }

  if (typeof value === 'boolean') {
    return 'boolean'
  }

  if (typeof value === 'number') {
    return 'number'
  }

  if (Array.isArray(value)) {
    return 'array'
  }

  if (typeof value === 'object') {
    return 'object'
  }

  if (typeof value === 'string') {
    // Infer specific string types based on field name or content
    const lowerFieldName = fieldName.toLowerCase()
    
    if (lowerFieldName.includes('email')) {
      return 'email'
    }
    if (lowerFieldName.includes('url') || lowerFieldName.includes('link') || lowerFieldName.includes('href')) {
      return 'url'
    }
    if (lowerFieldName.includes('phone') || lowerFieldName.includes('tel')) {
      return 'tel'
    }
    if (lowerFieldName.includes('color')) {
      return 'color'
    }
    if (lowerFieldName.includes('image') || lowerFieldName.includes('src') || lowerFieldName.includes('background')) {
      return 'image'
    }
    if (value.length > 100) {
      return 'textarea'
    }
    
    return 'text'
  }

  return 'text'
}

export const getPropertyGroups = (editableFields: string[], propertyConfig?: Record<string, any>): Record<string, string[]> => {
  const groups: Record<string, string[]> = {
    'Content': [],
    'Behavior': [],
    'Layout': [],
    'Style': [],
    'Advanced': []
  }

  editableFields.forEach(field => {
    const config = propertyConfig?.[field]
    const group = config?.group || inferGroup(field)
    groups[group].push(field)
  })

  // Remove empty groups
  Object.keys(groups).forEach(group => {
    if (groups[group].length === 0) {
      delete groups[group]
    }
  })

  return groups
}

const inferGroup = (fieldName: string): string => {
  const lowerFieldName = fieldName.toLowerCase()
  
  // Content fields
  if (lowerFieldName.includes('text') || lowerFieldName.includes('title') || 
      lowerFieldName.includes('description') || lowerFieldName.includes('content') ||
      lowerFieldName.includes('label') || lowerFieldName.includes('name')) {
    return 'Content'
  }
  
  // Behavior fields
  if (lowerFieldName.includes('show') || lowerFieldName.includes('enable') ||
      lowerFieldName.includes('allow') || lowerFieldName.includes('autoplay') ||
      lowerFieldName.includes('visible') || lowerFieldName.includes('hidden')) {
    return 'Behavior'
  }
  
  // Layout fields
  if (lowerFieldName.includes('column') || lowerFieldName.includes('row') ||
      lowerFieldName.includes('size') || lowerFieldName.includes('width') ||
      lowerFieldName.includes('height') || lowerFieldName.includes('spacing') ||
      lowerFieldName.includes('gap') || lowerFieldName.includes('margin') ||
      lowerFieldName.includes('padding')) {
    return 'Layout'
  }
  
  // Style fields
  if (lowerFieldName.includes('variant') || lowerFieldName.includes('theme') ||
      lowerFieldName.includes('style') || lowerFieldName.includes('color') ||
      lowerFieldName.includes('background') || lowerFieldName.includes('border')) {
    return 'Style'
  }
  
  // Default to Advanced for complex fields
  return 'Advanced'
}
