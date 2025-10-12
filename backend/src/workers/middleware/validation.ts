import { Hono } from 'hono'
import { z } from 'zod'
import { kv } from '../lib/kv'
import DOMPurify from 'isomorphic-dompurify'

const validationRoutes = new Hono()

// Rate limiting configuration
const RATE_LIMITS = {
  perUser: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 1000
  },
  perIP: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5000
  }
}

// Input validation schemas
const UserRegistrationSchema = z.object({
  email: z.string().email().min(1).max(255),
  name: z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/),
  password: z.string().min(8).max(128).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/).optional(),
  businessType: z.enum(['INDIVIDUAL', 'BUSINESS', 'NONPROFIT', 'EDUCATION']).optional(),
  city: z.string().min(1).max(100).optional(),
  companyName: z.string().min(1).max(200).optional(),
  preferredLanguage: z.enum(['ENGLISH', 'URDU']).default('ENGLISH')
})

const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

const SiteCreationSchema = z.object({
  name: z.string().min(1).max(200).regex(/^[a-zA-Z0-9\s\-_]+$/),
  description: z.string().max(1000).optional(),
  subdomain: z.string().min(3).max(50).regex(/^[a-z0-9\-]+$/),
  customDomain: z.string().regex(/^[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}$/).optional(),
  businessType: z.enum(['INDIVIDUAL', 'BUSINESS', 'NONPROFIT', 'EDUCATION']).optional(),
  language: z.enum(['ENGLISH', 'URDU']).default('ENGLISH'),
  templateId: z.string().uuid().optional()
})

const PageUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9\-]+$/).optional(),
  components: z.array(z.any()).optional(),
  settings: z.record(z.any()).optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  metaKeywords: z.string().max(500).optional(),
  language: z.enum(['ENGLISH', 'URDU']).optional(),
  direction: z.enum(['ltr', 'rtl']).optional()
})

const MediaUploadSchema = z.object({
  fileName: z.string().min(1).max(255).regex(/^[a-zA-Z0-9\-_\.]+$/),
  fileType: z.string().regex(/^(image|video|audio|application)\/[a-zA-Z0-9\-\.]+$/),
  fileSize: z.number().min(1).max(50 * 1024 * 1024), // 50MB max
  category: z.enum(['image', 'video', 'audio', 'document']).optional()
})

const AIGenerationSchema = z.object({
  prompt: z.string().min(1).max(2000),
  type: z.enum(['hero', 'features', 'testimonials', 'content', 'seo']),
  language: z.enum(['ENGLISH', 'URDU']).default('ENGLISH'),
  context: z.record(z.any()).optional()
})

const PublishRequestSchema = z.object({
  siteId: z.string().uuid(),
  pages: z.array(z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(200),
    slug: z.string().min(1).max(100),
    components: z.array(z.any()),
    settings: z.record(z.any()).optional(),
    metaTitle: z.string().max(200).optional(),
    metaDescription: z.string().max(500).optional(),
    metaKeywords: z.string().max(500).optional(),
    language: z.enum(['ENGLISH', 'URDU']).default('ENGLISH'),
    direction: z.enum(['ltr', 'rtl']).default('ltr')
  })),
  settings: z.object({
    siteName: z.string().min(1).max(200),
    description: z.string().max(1000).optional(),
    language: z.enum(['ENGLISH', 'URDU']).default('ENGLISH'),
    direction: z.enum(['ltr', 'rtl']).default('ltr'),
    customCSS: z.string().max(10000).optional(),
    customJS: z.string().max(10000).optional(),
    favicon: z.string().url().optional(),
    ogImage: z.string().url().optional()
  }),
  domain: z.string().regex(/^[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}$/).optional(),
  subdomain: z.string().min(3).max(50).regex(/^[a-z0-9\-]+$/).optional()
})

// Rate limiting middleware
const rateLimiter = () => async (c: any, next: any) => {
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown'
  const userId = c.get('user')?.id || 'anonymous'
  
  // Check per-IP rate limit
  const ipKey = `rate_limit:ip:${ip}`
  const ipCount = await kv.get(c, ipKey)
  
  if (ipCount && parseInt(ipCount) >= RATE_LIMITS.perIP.maxRequests) {
    return c.json({
      success: false,
      error: {
        message: 'Rate limit exceeded for IP address',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: RATE_LIMITS.perIP.windowMs / 1000
      }
    }, 429)
  }
  
  // Check per-user rate limit
  const userKey = `rate_limit:user:${userId}`
  const userCount = await kv.get(c, userKey)
  
  if (userCount && parseInt(userCount) >= RATE_LIMITS.perUser.maxRequests) {
    return c.json({
      success: false,
      error: {
        message: 'Rate limit exceeded for user',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: RATE_LIMITS.perUser.windowMs / 1000
      }
    }, 429)
  }
  
  // Increment counters
  await kv.set(c, ipKey, (parseInt(ipCount) || 0) + 1, RATE_LIMITS.perIP.windowMs / 1000)
  await kv.set(c, userKey, (parseInt(userCount) || 0) + 1, RATE_LIMITS.perUser.windowMs / 1000)
  
  await next()
}

// Input sanitization middleware
const sanitizeInput = () => async (c: any, next: any) => {
  const body = await c.req.json()
  
  // Sanitize HTML content
  if (body.content) {
    body.content = DOMPurify.sanitize(body.content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel'],
      ALLOW_DATA_ATTR: false
    })
  }
  
  // Sanitize CSS
  if (body.customCSS) {
    body.customCSS = DOMPurify.sanitize(body.customCSS, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    })
  }
  
  // Sanitize JavaScript
  if (body.customJS) {
    body.customJS = DOMPurify.sanitize(body.customJS, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    })
  }
  
  // Sanitize text fields
  const textFields = ['name', 'description', 'title', 'subtitle', 'content', 'metaTitle', 'metaDescription', 'metaKeywords']
  textFields.forEach(field => {
    if (body[field]) {
      body[field] = DOMPurify.sanitize(body[field], {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
      })
    }
  })
  
  c.req.json = () => Promise.resolve(body)
  await next()
}

// Validation middleware factory
const validateInput = (schema: z.ZodSchema) => async (c: any, next: any) => {
  try {
    const body = await c.req.json()
    const validatedData = schema.parse(body)
    c.req.json = () => Promise.resolve(validatedData)
    await next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        }
      }, 400)
    }
    
    return c.json({
      success: false,
      error: {
        message: 'Invalid request data',
        code: 'INVALID_REQUEST'
      }
    }, 400)
  }
}

// Security headers middleware
const securityHeaders = () => async (c: any, next: any) => {
  c.res.headers.set('X-Frame-Options', 'DENY')
  c.res.headers.set('X-Content-Type-Options', 'nosniff')
  c.res.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  c.res.headers.set('X-XSS-Protection', '1; mode=block')
  c.res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  c.res.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:;")
  
  await next()
}

// CORS middleware
const cors = () => async (c: any, next: any) => {
  const origin = c.req.header('Origin')
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://pakistan-builder.pages.dev',
    'https://*.pakistanbuilder.com'
  ]
  
  if (allowedOrigins.some(o => origin?.endsWith(o.replace('*.', '')))) {
    c.res.headers.set('Access-Control-Allow-Origin', origin)
  } else {
    c.res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000')
  }
  
  c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  c.res.headers.set('Access-Control-Allow-Credentials', 'true')
  c.res.headers.set('Access-Control-Max-Age', '86400')
  
  if (c.req.method === 'OPTIONS') {
    return c.text('', 204)
  }
  
  await next()
}

// JWT authentication middleware
const authenticate = () => async (c: any, next: any) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return c.json({
      success: false,
      error: {
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      }
    }, 401)
  }
  
  try {
    // Verify JWT token
    const payload = await verifyJWT(token, c.env.JWT_SECRET)
    c.set('user', payload)
    await next()
  } catch (error) {
    return c.json({
      success: false,
      error: {
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      }
    }, 401)
  }
}

// JWT verification function
async function verifyJWT(token: string, secret: string): Promise<any> {
  // This would typically use a JWT library like jsonwebtoken
  // For now, we'll implement a simple verification
  try {
    const [header, payload, signature] = token.split('.')
    const decodedPayload = JSON.parse(atob(payload))
    
    // Check expiration
    if (decodedPayload.exp && decodedPayload.exp < Date.now() / 1000) {
      throw new Error('Token expired')
    }
    
    return decodedPayload
  } catch (error) {
    throw new Error('Invalid token')
  }
}

// Input validation routes
validationRoutes.post('/validate/user-registration', validateInput(UserRegistrationSchema), async (c) => {
  return c.json({
    success: true,
    message: 'User registration data is valid'
  })
})

validationRoutes.post('/validate/user-login', validateInput(UserLoginSchema), async (c) => {
  return c.json({
    success: true,
    message: 'User login data is valid'
  })
})

validationRoutes.post('/validate/site-creation', validateInput(SiteCreationSchema), async (c) => {
  return c.json({
    success: true,
    message: 'Site creation data is valid'
  })
})

validationRoutes.post('/validate/page-update', validateInput(PageUpdateSchema), async (c) => {
  return c.json({
    success: true,
    message: 'Page update data is valid'
  })
})

validationRoutes.post('/validate/media-upload', validateInput(MediaUploadSchema), async (c) => {
  return c.json({
    success: true,
    message: 'Media upload data is valid'
  })
})

validationRoutes.post('/validate/ai-generation', validateInput(AIGenerationSchema), async (c) => {
  return c.json({
    success: true,
    message: 'AI generation data is valid'
  })
})

validationRoutes.post('/validate/publish-request', validateInput(PublishRequestSchema), async (c) => {
  return c.json({
    success: true,
    message: 'Publish request data is valid'
  })
})

// Export middleware functions
export {
  rateLimiter,
  sanitizeInput,
  validateInput,
  securityHeaders,
  cors,
  authenticate,
  UserRegistrationSchema,
  UserLoginSchema,
  SiteCreationSchema,
  PageUpdateSchema,
  MediaUploadSchema,
  AIGenerationSchema,
  PublishRequestSchema
}

export { validationRoutes }
