import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input - The input string to sanitize
 * @param options - Sanitization options
 * @returns Sanitized string
 */
export function sanitizeInput(
  input: string | null | undefined,
  options: {
    allowTags?: string[]
    allowAttributes?: string[]
    stripHtml?: boolean
  } = {}
): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  const { allowTags = [], allowAttributes = [], stripHtml = false } = options

  // Configure DOMPurify
  const config: DOMPurify.Config = {
    ALLOWED_TAGS: allowTags,
    ALLOWED_ATTR: allowAttributes,
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM_IMPORT: false,
  }

  // If stripHtml is true, remove all HTML tags
  if (stripHtml) {
    config.ALLOWED_TAGS = []
    config.ALLOWED_ATTR = []
  }

  return DOMPurify.sanitize(input, config)
}

/**
 * Sanitizes HTML content while preserving basic formatting
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML
 */
export function sanitizeHtml(html: string): string {
  return sanitizeInput(html, {
    allowTags: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a'],
    allowAttributes: ['href', 'target', 'rel']
  })
}

/**
 * Sanitizes plain text input (removes all HTML)
 * @param text - Text string to sanitize
 * @returns Sanitized plain text
 */
export function sanitizeText(text: string): string {
  return sanitizeInput(text, { stripHtml: true })
}

/**
 * Sanitizes JSON input recursively
 * @param obj - Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeText(obj)
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value)
    }
    return sanitized
  }
  
  return obj
}
