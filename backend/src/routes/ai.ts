import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { AIService } from '@/services/aiService'
import { authenticate } from '@/middleware/auth'

// Validation schemas
const generateContentSchema = z.object({
  prompt: z.string().min(1).max(1000),
  language: z.enum(['ENGLISH', 'URDU', 'PUNJABI', 'SINDHI', 'PASHTO']),
  contentType: z.enum(['hero', 'about', 'services', 'contact', 'blog', 'product']),
  businessType: z.string().optional(),
  tone: z.enum(['professional', 'casual', 'friendly', 'formal']).optional(),
  maxTokens: z.number().min(1).max(4000).optional(),
  temperature: z.number().min(0).max(2).optional()
})

const optimizeSEOSchema = z.object({
  content: z.string().min(1),
  targetKeywords: z.array(z.string()).optional(),
  language: z.enum(['ENGLISH', 'URDU', 'PUNJABI', 'SINDHI', 'PASHTO']),
  businessType: z.string().optional(),
  contentType: z.string().optional()
})

const generateColorsSchema = z.object({
  businessType: z.string().min(1),
  brandPersonality: z.enum(['modern', 'traditional', 'luxury', 'friendly', 'professional']).optional(),
  primaryColor: z.string().optional(),
  style: z.enum(['monochromatic', 'complementary', 'triadic', 'analogous']).optional(),
  language: z.enum(['ENGLISH', 'URDU'])
})

const suggestTemplatesSchema = z.object({
  businessType: z.string().min(1),
  industry: z.string().optional(),
  language: z.enum(['ENGLISH', 'URDU', 'PUNJABI', 'SINDHI', 'PASHTO']),
  features: z.array(z.string()).optional(),
  budget: z.enum(['free', 'premium']).optional()
})

export async function aiRoutes(fastify: FastifyInstance) {
  const aiService = new AIService()

  // POST /api/v1/ai/generate-content
  fastify.post('/generate-content', {
    preHandler: [authenticate],
    schema: {
      description: 'Generate AI content',
      tags: ['AI'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['prompt', 'language', 'contentType'],
        properties: {
          prompt: { type: 'string', minLength: 1, maxLength: 1000 },
          language: { type: 'string', enum: ['ENGLISH', 'URDU'] },
          contentType: { type: 'string', enum: ['hero', 'about', 'services', 'contact', 'blog', 'product'] },
          businessType: { type: 'string' },
          tone: { type: 'string', enum: ['professional', 'casual', 'friendly', 'formal'] },
          maxTokens: { type: 'number', minimum: 1, maximum: 4000 },
          temperature: { type: 'number', minimum: 0, maximum: 2 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                content: { type: 'string' },
                tokens: { type: 'number' },
                cost: { type: 'number' },
                model: { type: 'string' },
                generationId: { type: 'string' }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        400: { $ref: 'Error' },
        401: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const data = generateContentSchema.parse(request.body)
      
      const response = await aiService.generateContent({
        ...data,
        userId: request.user!.id
      })
      
      reply.send({
        success: true,
        data: response,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({
          success: false,
          error: {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to generate content',
          code: 'CONTENT_GENERATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/ai/optimize-seo
  fastify.post('/optimize-seo', {
    preHandler: [authenticate],
    schema: {
      description: 'Optimize content for SEO',
      tags: ['AI'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['content', 'language'],
        properties: {
          content: { type: 'string', minLength: 1 },
          targetKeywords: { type: 'array', items: { type: 'string' } },
          language: { type: 'string', enum: ['ENGLISH', 'URDU'] },
          businessType: { type: 'string' },
          contentType: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                keywords: { type: 'array', items: { type: 'string' } },
                suggestions: { type: 'array', items: { type: 'string' } }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        400: { $ref: 'Error' },
        401: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const data = optimizeSEOSchema.parse(request.body)
      
      const response = await aiService.optimizeSEO({
        ...data,
        userId: request.user!.id
      })
      
      reply.send({
        success: true,
        data: response,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({
          success: false,
          error: {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to optimize SEO',
          code: 'SEO_OPTIMIZATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/ai/generate-colors
  fastify.post('/generate-colors', {
    preHandler: [authenticate],
    schema: {
      description: 'Generate color palette',
      tags: ['AI'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['businessType', 'language'],
        properties: {
          businessType: { type: 'string', minLength: 1 },
          brandPersonality: { type: 'string', enum: ['modern', 'traditional', 'luxury', 'friendly', 'professional'] },
          primaryColor: { type: 'string' },
          style: { type: 'string', enum: ['monochromatic', 'complementary', 'triadic', 'analogous'] },
          language: { type: 'string', enum: ['ENGLISH', 'URDU'] }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                primary: { type: 'string' },
                secondary: { type: 'string' },
                accent: { type: 'string' },
                neutral: { type: 'string' },
                palette: { type: 'array', items: { type: 'string' } },
                suggestions: { type: 'array', items: { type: 'string' } }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        400: { $ref: 'Error' },
        401: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const data = generateColorsSchema.parse(request.body)
      
      const response = await aiService.generateColors({
        ...data,
        userId: request.user!.id
      })
      
      reply.send({
        success: true,
        data: response,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({
          success: false,
          error: {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to generate colors',
          code: 'COLOR_GENERATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/ai/suggest-templates
  fastify.post('/suggest-templates', {
    preHandler: [authenticate],
    schema: {
      description: 'Suggest templates for business',
      tags: ['AI'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['businessType', 'language'],
        properties: {
          businessType: { type: 'string', minLength: 1 },
          industry: { type: 'string' },
          language: { type: 'string', enum: ['ENGLISH', 'URDU'] },
          features: { type: 'array', items: { type: 'string' } },
          budget: { type: 'string', enum: ['free', 'premium'] }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                templates: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                      description: { type: 'string' },
                      category: { type: 'string' },
                      features: { type: 'array', items: { type: 'string' } },
                      matchScore: { type: 'number' }
                    }
                  }
                },
                recommendations: { type: 'array', items: { type: 'string' } }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        400: { $ref: 'Error' },
        401: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const data = suggestTemplatesSchema.parse(request.body)
      
      const response = await aiService.suggestTemplates({
        ...data,
        userId: request.user!.id
      })
      
      reply.send({
        success: true,
        data: response,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({
          success: false,
          error: {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to suggest templates',
          code: 'TEMPLATE_SUGGESTION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/ai/stats
  fastify.get('/stats', {
    preHandler: [authenticate],
    schema: {
      description: 'Get AI usage statistics',
      tags: ['AI'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                totalGenerations: { type: 'number' },
                generationsByType: { type: 'object' },
                totalTokens: { type: 'number' },
                totalCost: { type: 'number' },
                averageCostPerGeneration: { type: 'number' }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        401: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const stats = await aiService.getStats()
      
      reply.send({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to get AI stats',
          code: 'AI_STATS_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })
}
