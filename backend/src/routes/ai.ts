import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { AIService } from '@/services/aiService'
import { authenticate } from '@/middleware/auth'
import { Language } from '@prisma/client'

// Validation schemas
const generateContentSchema = z.object({
  prompt: z.string().min(1).max(1000),
  language: z.enum(['ENGLISH', 'URDU', 'PUNJABI', 'SINDHI', 'PASHTO']),
  contentType: z.enum(['hero', 'about', 'services', 'contact', 'blog', 'product']),
  businessType: z.string().optional(),
  tone: z.enum(['professional', 'casual', 'friendly', 'formal']).optional(),
  maxTokens: z.number().min(1).max(4000).optional(),
  temperature: z.number().min(0).max(2).optional(),
  useAI: z.boolean().default(false) // Cost control flag
})

const optimizeSEOSchema = z.object({
  content: z.string().min(1),
  targetKeywords: z.array(z.string()).optional(),
  language: z.enum(['ENGLISH', 'URDU', 'PUNJABI', 'SINDHI', 'PASHTO']),
  businessType: z.string().optional(),
  contentType: z.string().optional(),
  useAI: z.boolean().default(false)
})

const generateColorsSchema = z.object({
  businessType: z.string().min(1),
  brandPersonality: z.enum(['modern', 'traditional', 'luxury', 'friendly', 'professional']).optional(),
  primaryColor: z.string().optional(),
  style: z.enum(['monochromatic', 'complementary', 'triadic', 'analogous']).optional(),
  language: z.enum(['ENGLISH', 'URDU']),
  useAI: z.boolean().default(false)
})

const suggestTemplatesSchema = z.object({
  businessType: z.string().min(1),
  industry: z.string().optional(),
  language: z.enum(['ENGLISH', 'URDU', 'PUNJABI', 'SINDHI', 'PASHTO']),
  features: z.array(z.string()).optional(),
  budget: z.enum(['free', 'premium']).optional(),
  useAI: z.boolean().default(false)
})

export async function aiRoutes(fastify: FastifyInstance) {
  const aiService = new AIService()

  // POST /api/v1/ai/generate-content - Generate content
  fastify.post('/generate-content', {
    preHandler: [authenticate],
    schema: {
      description: 'Generate AI-powered content for websites',
      tags: ['AI Content'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['prompt', 'language', 'contentType'],
        properties: {
          prompt: { type: 'string', minLength: 1, maxLength: 1000 },
          language: { type: 'string', enum: ['ENGLISH', 'URDU', 'PUNJABI', 'SINDHI', 'PASHTO'] },
          contentType: { type: 'string', enum: ['hero', 'about', 'services', 'contact', 'blog', 'product'] },
          businessType: { type: 'string' },
          tone: { type: 'string', enum: ['professional', 'casual', 'friendly', 'formal'] },
          maxTokens: { type: 'number', minimum: 1, maximum: 4000 },
          temperature: { type: 'number', minimum: 0, maximum: 2 },
          useAI: { type: 'boolean', default: false }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const validatedData = generateContentSchema.parse(request.body)
      const userId = (request as any).user.id

      // Check AI quota if AI is requested
      if (validatedData.useAI) {
        const quota = await aiService.getUserQuota(userId)
        if (quota.used >= quota.monthlyLimit) {
          return reply.status(429).send({
            success: false,
            error: {
              message: 'AI quota exceeded. Upgrade your plan or wait for quota reset.',
              code: 'AI_QUOTA_EXCEEDED',
              quota: {
                used: quota.used,
                limit: quota.monthlyLimit,
                resetDate: quota.resetDate,
                tier: quota.tier
              },
              timestamp: new Date().toISOString()
            }
          })
        }
      }

      const result = await aiService.generateContent(validatedData as any, userId)

      return reply.status(201).send({
        success: true,
        data: { 
          content: result.content,
          tokens: result.tokens,
          cost: result.cost,
          model: result.model,
          generationId: result.generationId,
          aiEnabled: validatedData.useAI
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Generate content error:', error)
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
            timestamp: new Date().toISOString()
          }
        })
      }
      
      if (error.message === 'AI quota exceeded') {
        return reply.status(429).send({
          success: false,
          error: {
            message: 'AI quota exceeded',
            code: 'AI_QUOTA_EXCEEDED',
            timestamp: new Date().toISOString()
          }
        })
      }
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to generate content',
          code: 'CONTENT_GENERATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/ai/optimize-seo - Optimize SEO
  fastify.post('/optimize-seo', {
    preHandler: [authenticate],
    schema: {
      description: 'Optimize content for SEO using AI',
      tags: ['AI SEO'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['content', 'language'],
        properties: {
          content: { type: 'string', minLength: 1 },
          targetKeywords: { type: 'array', items: { type: 'string' } },
          language: { type: 'string', enum: ['ENGLISH', 'URDU', 'PUNJABI', 'SINDHI', 'PASHTO'] },
          businessType: { type: 'string' },
          contentType: { type: 'string' },
          useAI: { type: 'boolean', default: false }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const validatedData = optimizeSEOSchema.parse(request.body)
      const userId = (request as any).user.id

      // Check AI quota if AI is requested
      if (validatedData.useAI) {
        const quota = await aiService.getUserQuota(userId)
        if (quota.used >= quota.monthlyLimit) {
          return reply.status(429).send({
            success: false,
            error: {
              message: 'AI quota exceeded. Upgrade your plan or wait for quota reset.',
              code: 'AI_QUOTA_EXCEEDED',
              quota: {
                used: quota.used,
                limit: quota.monthlyLimit,
                resetDate: quota.resetDate,
                tier: quota.tier
              },
              timestamp: new Date().toISOString()
            }
          })
        }
      }

      const result = await aiService.optimizeSEO(validatedData as any, userId)

      return reply.status(201).send({
        success: true,
        data: { 
          optimizedContent: result.content,
          tokens: result.tokens,
          cost: result.cost,
          model: result.model,
          generationId: result.generationId,
          aiEnabled: validatedData.useAI
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Optimize SEO error:', error)
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
            timestamp: new Date().toISOString()
          }
        })
      }
      
      if (error.message === 'AI quota exceeded') {
        return reply.status(429).send({
          success: false,
          error: {
            message: 'AI quota exceeded',
            code: 'AI_QUOTA_EXCEEDED',
            timestamp: new Date().toISOString()
          }
        })
      }
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to optimize SEO',
          code: 'SEO_OPTIMIZATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/ai/generate-colors - Generate color palette
  fastify.post('/generate-colors', {
    preHandler: [authenticate],
    schema: {
      description: 'Generate AI-powered color palettes',
      tags: ['AI Design'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['businessType', 'language'],
        properties: {
          businessType: { type: 'string', minLength: 1 },
          brandPersonality: { type: 'string', enum: ['modern', 'traditional', 'luxury', 'friendly', 'professional'] },
          primaryColor: { type: 'string' },
          style: { type: 'string', enum: ['monochromatic', 'complementary', 'triadic', 'analogous'] },
          language: { type: 'string', enum: ['ENGLISH', 'URDU'] },
          useAI: { type: 'boolean', default: false }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const validatedData = generateColorsSchema.parse(request.body)
      const userId = (request as any).user.id

      // Check AI quota if AI is requested
      if (validatedData.useAI) {
        const quota = await aiService.getUserQuota(userId)
        if (quota.used >= quota.monthlyLimit) {
          return reply.status(429).send({
            success: false,
            error: {
              message: 'AI quota exceeded. Upgrade your plan or wait for quota reset.',
              code: 'AI_QUOTA_EXCEEDED',
              quota: {
                used: quota.used,
                limit: quota.monthlyLimit,
                resetDate: quota.resetDate,
                tier: quota.tier
              },
              timestamp: new Date().toISOString()
            }
          })
        }
      }

      const result = await aiService.generateColors(validatedData as any, userId)

      return reply.status(201).send({
        success: true,
        data: { 
          colorPalette: JSON.parse(result.content),
          tokens: result.tokens,
          cost: result.cost,
          model: result.model,
          generationId: result.generationId,
          aiEnabled: validatedData.useAI
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Generate colors error:', error)
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
            timestamp: new Date().toISOString()
          }
        })
      }
      
      if (error.message === 'AI quota exceeded') {
        return reply.status(429).send({
          success: false,
          error: {
            message: 'AI quota exceeded',
            code: 'AI_QUOTA_EXCEEDED',
            timestamp: new Date().toISOString()
          }
        })
      }
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to generate colors',
          code: 'COLOR_GENERATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/ai/suggest-templates - Suggest templates
  fastify.post('/suggest-templates', {
    preHandler: [authenticate],
    schema: {
      description: 'Get AI-powered template suggestions',
      tags: ['AI Templates'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['businessType', 'language'],
        properties: {
          businessType: { type: 'string', minLength: 1 },
          industry: { type: 'string' },
          language: { type: 'string', enum: ['ENGLISH', 'URDU', 'PUNJABI', 'SINDHI', 'PASHTO'] },
          features: { type: 'array', items: { type: 'string' } },
          budget: { type: 'string', enum: ['free', 'premium'] },
          useAI: { type: 'boolean', default: false }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const validatedData = suggestTemplatesSchema.parse(request.body)
      const userId = (request as any).user.id

      // Check AI quota if AI is requested
      if (validatedData.useAI) {
        const quota = await aiService.getUserQuota(userId)
        if (quota.used >= quota.monthlyLimit) {
          return reply.status(429).send({
            success: false,
            error: {
              message: 'AI quota exceeded. Upgrade your plan or wait for quota reset.',
              code: 'AI_QUOTA_EXCEEDED',
              quota: {
                used: quota.used,
                limit: quota.monthlyLimit,
                resetDate: quota.resetDate,
                tier: quota.tier
              },
              timestamp: new Date().toISOString()
            }
          })
        }
      }

      const result = await aiService.suggestTemplates(validatedData as any, userId)

      return reply.status(201).send({
        success: true,
        data: { 
          suggestions: JSON.parse(result.content),
          tokens: result.tokens,
          cost: result.cost,
          model: result.model,
          generationId: result.generationId,
          aiEnabled: validatedData.useAI
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Suggest templates error:', error)
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
            timestamp: new Date().toISOString()
          }
        })
      }
      
      if (error.message === 'AI quota exceeded') {
        return reply.status(429).send({
          success: false,
          error: {
            message: 'AI quota exceeded',
            code: 'AI_QUOTA_EXCEEDED',
            timestamp: new Date().toISOString()
          }
        })
      }
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to suggest templates',
          code: 'TEMPLATE_SUGGESTION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/ai/quota - Get user AI quota
  fastify.get('/quota', {
    preHandler: [authenticate],
    schema: {
      description: 'Get user AI quota information',
      tags: ['AI Management'],
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    try {
      const userId = (request as any).user.id
      const quota = await aiService.getUserQuota(userId)

      return reply.send({
        success: true,
        data: { quota },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get quota error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve quota information',
          code: 'QUOTA_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/ai/history - Get generation history
  fastify.get('/history', {
    preHandler: [authenticate],
    schema: {
      description: 'Get user AI generation history',
      tags: ['AI Management'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'number', default: 20 }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const userId = (request as any).user.id
      const { limit } = request.query as { limit: number }
      
      const history = await aiService.getGenerationHistory(userId, limit)

      return reply.send({
        success: true,
        data: { 
          history,
          total: history.length
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get history error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve generation history',
          code: 'HISTORY_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/ai/generations/:id - Get specific generation
  fastify.get('/generations/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Get specific AI generation details',
      tags: ['AI Management'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const generation = await aiService.findById(id)

      if (!generation) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'Generation not found',
            code: 'GENERATION_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
      }

      return reply.send({
        success: true,
        data: { generation },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get generation error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve generation',
          code: 'GENERATION_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })
}
