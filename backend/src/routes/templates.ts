import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { TemplateService } from '@/services/templateService'
import { authenticate } from '@/middleware/auth'
import { BusinessType, Language } from '@prisma/client'

// Validation schemas
const createTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.string().min(1),
  businessType: z.enum(['RESTAURANT', 'RETAIL', 'SERVICE', 'HEALTHCARE', 'EDUCATION', 'TECHNOLOGY', 'FINANCE', 'REAL_ESTATE', 'ENTERTAINMENT', 'NON_PROFIT', 'OTHER']).optional(),
  language: z.enum(['ENGLISH', 'URDU']).default('ENGLISH'),
  content: z.string().min(1), // JSON string
  styles: z.string().min(1), // JSON string
  assets: z.string().optional(),
  previewImage: z.string().url().optional(),
  thumbnail: z.string().url().optional(),
  heroImageUrl: z.string().url().optional(),
  demoImages: z.string().optional(),
  isGlobal: z.boolean().default(true),
  parentTemplateId: z.string().optional(),
  localizedFor: z.string().optional(),
  isPremium: z.boolean().default(false),
  price: z.number().min(0).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']).default('ACTIVE'),
  tags: z.string().optional(),
  features: z.string().optional(),
  responsive: z.boolean().default(true)
})

const updateTemplateSchema = createTemplateSchema.partial()

const querySchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(20),
  search: z.string().optional(),
  category: z.string().optional(),
  businessType: z.enum(['RESTAURANT', 'RETAIL', 'SERVICE', 'HEALTHCARE', 'EDUCATION', 'TECHNOLOGY', 'FINANCE', 'REAL_ESTATE', 'ENTERTAINMENT', 'NON_PROFIT', 'OTHER']).optional(),
  language: z.enum(['ENGLISH', 'URDU']).optional(),
  isPremium: z.boolean().optional(),
  isGlobal: z.boolean().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']).optional(),
  responsive: z.boolean().optional(),
  tags: z.string().optional(),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

const duplicateTemplateSchema = z.object({
  newName: z.string().min(1).max(100)
})

export async function templateRoutes(fastify: FastifyInstance) {
  const templateService = new TemplateService()

  // GET /api/v1/templates - List templates with filters
  fastify.get('/', {
    schema: {
      description: 'List templates with filters and pagination',
      tags: ['Template Management'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 20 },
          search: { type: 'string' },
          category: { type: 'string' },
          businessType: { type: 'string', enum: ['RESTAURANT', 'RETAIL', 'SERVICE', 'HEALTHCARE', 'EDUCATION', 'TECHNOLOGY', 'FINANCE', 'REAL_ESTATE', 'ENTERTAINMENT', 'NON_PROFIT', 'OTHER'] },
          language: { type: 'string', enum: ['ENGLISH', 'URDU'] },
          isPremium: { type: 'boolean' },
          isGlobal: { type: 'boolean' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'DRAFT'] },
          responsive: { type: 'boolean' },
          tags: { type: 'string' },
          sortBy: { type: 'string', default: 'createdAt' },
          sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const query = querySchema.parse(request.query)
      
      const result = await templateService.searchTemplates({
        page: query.page,
        limit: query.limit,
        search: query.search,
        category: query.category,
        businessType: query.businessType,
        language: query.language,
        isPremium: query.isPremium,
        isGlobal: query.isGlobal,
        status: query.status,
        responsive: query.responsive,
        tags: query.tags ? query.tags.split(',') : undefined,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder
      })

      return reply.send({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('List templates error:', error)
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
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve templates',
          code: 'TEMPLATE_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/templates/:id - Get specific template
  fastify.get('/:id', {
    schema: {
      description: 'Get a specific template by ID',
      tags: ['Template Management'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const template = await templateService.findById(id)

      if (!template) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'Template not found',
            code: 'TEMPLATE_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
      }

      return reply.send({
        success: true,
        data: { template },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get template error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve template',
          code: 'TEMPLATE_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/templates - Create new template (admin only)
  fastify.post('/', {
    preHandler: [authenticate],
    schema: {
      description: 'Create a new template',
      tags: ['Template Management'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['name', 'category', 'content', 'styles'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          description: { type: 'string', maxLength: 500 },
          category: { type: 'string', minLength: 1 },
          businessType: { type: 'string', enum: ['RESTAURANT', 'RETAIL', 'SERVICE', 'HEALTHCARE', 'EDUCATION', 'TECHNOLOGY', 'FINANCE', 'REAL_ESTATE', 'ENTERTAINMENT', 'NON_PROFIT', 'OTHER'] },
          language: { type: 'string', enum: ['ENGLISH', 'URDU'], default: 'ENGLISH' },
          content: { type: 'string', minLength: 1 },
          styles: { type: 'string', minLength: 1 },
          assets: { type: 'string' },
          previewImage: { type: 'string', format: 'uri' },
          thumbnail: { type: 'string', format: 'uri' },
          heroImageUrl: { type: 'string', format: 'uri' },
          demoImages: { type: 'string' },
          isGlobal: { type: 'boolean', default: true },
          parentTemplateId: { type: 'string' },
          localizedFor: { type: 'string' },
          isPremium: { type: 'boolean', default: false },
          price: { type: 'number', minimum: 0 },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'DRAFT'], default: 'ACTIVE' },
          tags: { type: 'string' },
          features: { type: 'string' },
          responsive: { type: 'boolean', default: true }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const validatedData = createTemplateSchema.parse(request.body)
      
      // Ensure required fields are present
      if (!validatedData.name || !validatedData.category || !validatedData.content || !validatedData.styles) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'name, category, content, and styles are required',
            code: 'VALIDATION_ERROR',
            timestamp: new Date().toISOString()
          }
        })
      }
      
      const template = await templateService.createTemplate(validatedData as any)

      return reply.status(201).send({
        success: true,
        data: { template },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Create template error:', error)
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
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to create template',
          code: 'TEMPLATE_CREATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // PUT /api/v1/templates/:id - Update template
  fastify.put('/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Update an existing template',
      tags: ['Template Management'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          description: { type: 'string', maxLength: 500 },
          category: { type: 'string', minLength: 1 },
          businessType: { type: 'string', enum: ['RESTAURANT', 'RETAIL', 'SERVICE', 'HEALTHCARE', 'EDUCATION', 'TECHNOLOGY', 'FINANCE', 'REAL_ESTATE', 'ENTERTAINMENT', 'NON_PROFIT', 'OTHER'] },
          language: { type: 'string', enum: ['ENGLISH', 'URDU'] },
          content: { type: 'string', minLength: 1 },
          styles: { type: 'string', minLength: 1 },
          assets: { type: 'string' },
          previewImage: { type: 'string', format: 'uri' },
          thumbnail: { type: 'string', format: 'uri' },
          heroImageUrl: { type: 'string', format: 'uri' },
          demoImages: { type: 'string' },
          isGlobal: { type: 'boolean' },
          parentTemplateId: { type: 'string' },
          localizedFor: { type: 'string' },
          isPremium: { type: 'boolean' },
          price: { type: 'number', minimum: 0 },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'DRAFT'] },
          tags: { type: 'string' },
          features: { type: 'string' },
          responsive: { type: 'boolean' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const validatedData = updateTemplateSchema.parse(request.body)
      
      // Validate content and styles if provided
      if (validatedData.content) {
        const isContentValid = await templateService.validateTemplateContent(validatedData.content)
        if (!isContentValid) {
          return reply.status(400).send({
            success: false,
            error: {
              message: 'Invalid template content format',
              code: 'INVALID_TEMPLATE_FORMAT',
              timestamp: new Date().toISOString()
            }
          })
        }
      }
      
      if (validatedData.styles) {
        const isStylesValid = await templateService.validateTemplateStyles(validatedData.styles)
        if (!isStylesValid) {
          return reply.status(400).send({
            success: false,
            error: {
              message: 'Invalid template styles format',
              code: 'INVALID_TEMPLATE_FORMAT',
              timestamp: new Date().toISOString()
            }
          })
        }
      }
      
      const template = await templateService.updateTemplate(id, validatedData)

      return reply.send({
        success: true,
        data: { template },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Update template error:', error)
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
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to update template',
          code: 'TEMPLATE_UPDATE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // DELETE /api/v1/templates/:id - Delete template
  fastify.delete('/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Delete a template',
      tags: ['Template Management'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      await templateService.delete(id)

      return reply.send({
        success: true,
        data: { message: 'Template deleted successfully' },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Delete template error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to delete template',
          code: 'TEMPLATE_DELETION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/templates/categories - Get template categories
  fastify.get('/categories', {
    schema: {
      description: 'Get all available template categories',
      tags: ['Template Management']
    }
  }, async (request, reply) => {
    try {
      const categories = await templateService.getTemplateCategories()

      return reply.send({
        success: true,
        data: { categories },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get template categories error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve template categories',
          code: 'CATEGORIES_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/templates/category/:category - Get templates by category
  fastify.get('/category/:category', {
    schema: {
      description: 'Get templates by category',
      tags: ['Template Management'],
      params: {
        type: 'object',
        properties: {
          category: { type: 'string' }
        },
        required: ['category']
      }
    }
  }, async (request, reply) => {
    try {
      const { category } = request.params as { category: string }
      const templates = await templateService.getTemplatesByCategory(category)

      return reply.send({
        success: true,
        data: { templates },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get templates by category error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve templates by category',
          code: 'CATEGORY_TEMPLATES_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/templates/featured - Get featured templates
  fastify.get('/featured', {
    schema: {
      description: 'Get featured templates',
      tags: ['Template Management'],
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'number', default: 10 }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { limit = 10 } = request.query as { limit?: number }
      const templates = await templateService.getFeaturedTemplates(limit)

      return reply.send({
        success: true,
        data: { templates },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get featured templates error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve featured templates',
          code: 'FEATURED_TEMPLATES_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/templates/trending - Get trending templates
  fastify.get('/trending', {
    schema: {
      description: 'Get trending templates',
      tags: ['Template Management'],
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'number', default: 10 }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { limit = 10 } = request.query as { limit?: number }
      const templates = await templateService.getTrendingTemplates(limit)

      return reply.send({
        success: true,
        data: { templates },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get trending templates error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve trending templates',
          code: 'TRENDING_TEMPLATES_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/templates/:id/duplicate - Duplicate template
  fastify.post('/:id/duplicate', {
    preHandler: [authenticate],
    schema: {
      description: 'Duplicate a template',
      tags: ['Template Management'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        required: ['newName'],
        properties: {
          newName: { type: 'string', minLength: 1, maxLength: 100 }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { newName } = duplicateTemplateSchema.parse(request.body)
      
      const duplicatedTemplate = await templateService.duplicateTemplate(id, newName)

      return reply.status(201).send({
        success: true,
        data: { template: duplicatedTemplate },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Duplicate template error:', error)
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
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to duplicate template',
          code: 'TEMPLATE_DUPLICATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/templates/stats - Get template statistics
  fastify.get('/stats', {
    preHandler: [authenticate],
    schema: {
      description: 'Get template statistics',
      tags: ['Template Management'],
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    try {
      const stats = await templateService.getTemplateStats()

      return reply.send({
        success: true,
        data: { stats },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get template stats error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve template statistics',
          code: 'TEMPLATE_STATS_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })
}
