import { FastifyInstance } from 'fastify'
import { advancedTemplateService } from '../services/advancedTemplateService.js'

export async function advancedTemplateEngineRoutes(fastify: FastifyInstance) {
  fastify.get('/catalog', {
    schema: {
      description: 'List advanced templates for catalog browsing',
      tags: ['Advanced Templates'],
      querystring: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          search: { type: 'string' },
          featured: { type: 'boolean' },
          pricingModel: { type: 'string', enum: ['free', 'premium', 'subscription'] },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          offset: { type: 'integer', minimum: 0, default: 0 }
        }
      }
    }
  }, async (request, reply) => {
    const { category, search, featured, pricingModel, limit = 20, offset = 0 } = request.query as any

    const result = await advancedTemplateService.getTemplates({
      category,
      search,
      featured,
      pricingModel,
      limit,
      offset
    })

    return reply.send({
      success: true,
      data: result
    })
  })

  // Template Management
  fastify.post('/templates', {
    schema: {
      description: 'Create a new advanced template',
      tags: ['Advanced Templates'],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          configuration: { type: 'object' },
          marketplace: { type: 'object' },
          price: { type: 'number' },
          technologies: { type: 'array', items: { type: 'string' } },
          features: { type: 'array' }
        },
        required: ['name', 'description', 'category', 'configuration']
      }
    }
  }, async (request, reply) => {
    const userId = (request as any).user?.id

    if (!userId) {
      return reply.code(401).send({
        success: false,
        error: { message: 'Authentication required', code: 'UNAUTHORIZED' }
      })
    }

    try {
      const template = await advancedTemplateService.createTemplate({
        ...request.body as any,
        authorId: userId
      })

      return reply.code(201).send({
        success: true,
        data: template
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'CREATE_TEMPLATE_FAILED' }
      })
    }
  })

  fastify.get('/templates', {
    schema: {
      description: 'Get templates with filtering and pagination',
      tags: ['Advanced Templates'],
      querystring: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          status: { type: 'string' },
          authorId: { type: 'string' },
          search: { type: 'string' },
          pricingModel: { type: 'string' },
          featured: { type: 'boolean' },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          offset: { type: 'integer', minimum: 0, default: 0 }
        }
      }
    }
  }, async (request, reply) => {
    const query = request.query as any

    try {
      const result = await advancedTemplateService.getTemplates({
        category: query.category,
        status: query.status,
        authorId: query.authorId,
        search: query.search,
        pricingModel: query.pricingModel,
        featured: query.featured,
        limit: query.limit || 20,
        offset: query.offset || 0
      })

      return reply.send({
        success: true,
        data: result
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'GET_TEMPLATES_FAILED' }
      })
    }
  })

  fastify.get('/templates/:id', {
    schema: {
      description: 'Get template by ID',
      tags: ['Advanced Templates'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const template = await advancedTemplateService.getTemplateById(id)

      if (!template) {
        return reply.code(404).send({
          success: false,
          error: { message: 'Template not found', code: 'TEMPLATE_NOT_FOUND' }
        })
      }

      return reply.send({
        success: true,
        data: template
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'GET_TEMPLATE_FAILED' }
      })
    }
  })

  fastify.put('/templates/:id', {
    schema: {
      description: 'Update template',
      tags: ['Advanced Templates'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const template = await advancedTemplateService.updateTemplate(id, request.body as any)

      return reply.send({
        success: true,
        data: template
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'UPDATE_TEMPLATE_FAILED' }
      })
    }
  })

  fastify.delete('/templates/:id', {
    schema: {
      description: 'Delete template',
      tags: ['Advanced Templates'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      await advancedTemplateService.deleteTemplate(id)

      return reply.send({
        success: true,
        message: 'Template deleted successfully'
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'DELETE_TEMPLATE_FAILED' }
      })
    }
  })

  // AI Template Generation
  fastify.post('/templates/generate-ai', {
    schema: {
      description: 'Generate template using AI',
      tags: ['Advanced Templates'],
      body: {
        type: 'object',
        properties: {
          prompt: { type: 'string' },
          requirements: {
            type: 'object',
            properties: {
              category: { type: 'string' },
              features: { type: 'array', items: { type: 'string' } },
              style: { type: 'string' },
              colorScheme: { type: 'array', items: { type: 'string' } },
              targetAudience: { type: 'string' },
              industry: { type: 'string' }
            }
          }
        },
        required: ['prompt']
      }
    }
  }, async (request, reply) => {
    const userId = (request as any).user?.id

    if (!userId) {
      return reply.code(401).send({
        success: false,
        error: { message: 'Authentication required', code: 'UNAUTHORIZED' }
      })
    }

    try {
      const generation = await advancedTemplateService.generateTemplateWithAI({
        userId,
        ...request.body as any
      })

      return reply.code(201).send({
        success: true,
        data: generation
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'AI_GENERATION_FAILED' }
      })
    }
  })

  fastify.get('/templates/ai-generations/:generationId', {
    schema: {
      description: 'Get AI generation status',
      tags: ['Advanced Templates'],
      params: {
        type: 'object',
        properties: {
          generationId: { type: 'string' }
        },
        required: ['generationId']
      }
    }
  }, async (request, reply) => {
    const { generationId } = request.params as { generationId: string }

    try {
      const status = await advancedTemplateService.getAIGenerationStatus(generationId)

      return reply.send({
        success: true,
        data: status
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'GET_GENERATION_STATUS_FAILED' }
      })
    }
  })

  // Template Customization
  fastify.post('/templates/:templateId/customizations', {
    schema: {
      description: 'Create template customization',
      tags: ['Advanced Templates'],
      params: {
        type: 'object',
        properties: {
          templateId: { type: 'string' }
        },
        required: ['templateId']
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          customizations: { type: 'array' }
        },
        required: ['name', 'customizations']
      }
    }
  }, async (request, reply) => {
    const { templateId } = request.params as { templateId: string }
    const userId = (request as any).user?.id

    if (!userId) {
      return reply.code(401).send({
        success: false,
        error: { message: 'Authentication required', code: 'UNAUTHORIZED' }
      })
    }

    try {
      const customization = await advancedTemplateService.createCustomization({
        templateId,
        userId,
        ...request.body as any
      })

      return reply.code(201).send({
        success: true,
        data: customization
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'CREATE_CUSTOMIZATION_FAILED' }
      })
    }
  })

  fastify.post('/template-customizations/:customizationId/apply', {
    schema: {
      description: 'Apply template customization',
      tags: ['Advanced Templates'],
      params: {
        type: 'object',
        properties: {
          customizationId: { type: 'string' }
        },
        required: ['customizationId']
      }
    }
  }, async (request, reply) => {
    const { customizationId } = request.params as { customizationId: string }

    try {
      const result = await advancedTemplateService.applyCustomization(customizationId)

      return reply.send({
        success: true,
        data: result
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'APPLY_CUSTOMIZATION_FAILED' }
      })
    }
  })

  // Template Reviews
  fastify.post('/templates/:templateId/reviews', {
    schema: {
      description: 'Create template review',
      tags: ['Advanced Templates'],
      params: {
        type: 'object',
        properties: {
          templateId: { type: 'string' }
        },
        required: ['templateId']
      },
      body: {
        type: 'object',
        properties: {
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          title: { type: 'string' },
          content: { type: 'string' },
          images: { type: 'array', items: { type: 'string' } }
        },
        required: ['rating']
      }
    }
  }, async (request, reply) => {
    const { templateId } = request.params as { templateId: string }
    const userId = (request as any).user?.id

    if (!userId) {
      return reply.code(401).send({
        success: false,
        error: { message: 'Authentication required', code: 'UNAUTHORIZED' }
      })
    }

    try {
      const review = await advancedTemplateService.createReview({
        templateId,
        userId,
        ...request.body as any
      })

      return reply.code(201).send({
        success: true,
        data: review
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'CREATE_REVIEW_FAILED' }
      })
    }
  })

  // Template Marketplace
  fastify.post('/templates/:templateId/purchase', {
    schema: {
      description: 'Purchase a premium template',
      tags: ['Advanced Templates'],
      params: {
        type: 'object',
        properties: {
          templateId: { type: 'string' }
        },
        required: ['templateId']
      }
    }
  }, async (request, reply) => {
    const { templateId } = request.params as { templateId: string }
    const userId = (request as any).user?.id

    if (!userId) {
      return reply.code(401).send({
        success: false,
        error: { message: 'Authentication required', code: 'UNAUTHORIZED' }
      })
    }

    try {
      const result = await advancedTemplateService.purchaseTemplate(templateId, userId)

      return reply.send({
        success: true,
        data: result
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'PURCHASE_TEMPLATE_FAILED' }
      })
    }
  })

  fastify.get('/templates/:templateId/analytics', {
    schema: {
      description: 'Get template analytics',
      tags: ['Advanced Templates'],
      params: {
        type: 'object',
        properties: {
          templateId: { type: 'string' }
        },
        required: ['templateId']
      }
    }
  }, async (request, reply) => {
    const { templateId } = request.params as { templateId: string }

    try {
      const analytics = await advancedTemplateService.getTemplateAnalytics(templateId)

      return reply.send({
        success: true,
        data: analytics
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'GET_ANALYTICS_FAILED' }
      })
    }
  })

  // Template Categories
  fastify.get('/template-categories', {
    schema: {
      description: 'Get template categories',
      tags: ['Advanced Templates']
    }
  }, async (request, reply) => {
    try {
      const categories = await advancedTemplateService.getTemplateCategories()

      return reply.send({
        success: true,
        data: { categories }
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'GET_CATEGORIES_FAILED' }
      })
    }
  })

  // Template Search
  fastify.get('/templates/search', {
    schema: {
      description: 'Search templates with advanced filtering',
      tags: ['Advanced Templates'],
      querystring: {
        type: 'object',
        properties: {
          q: { type: 'string' },
          category: { type: 'string' },
          pricingModel: { type: 'string' },
          complexity: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const query = request.query as any

    try {
      const results = await advancedTemplateService.searchTemplates(query.q, {
        category: query.category,
        pricingModel: query.pricingModel,
        complexity: query.complexity
      })

      return reply.send({
        success: true,
        data: { results }
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'SEARCH_TEMPLATES_FAILED' }
      })
    }
  })

  // Admin routes for template management
  fastify.put('/admin/templates/:id/status', {
    schema: {
      description: 'Update template status (admin)',
      tags: ['Advanced Templates Admin'],
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
          status: { type: 'string', enum: ['draft', 'review', 'published', 'archived', 'suspended'] },
          featured: { type: 'boolean' },
          trending: { type: 'boolean' },
          popular: { type: 'boolean' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const { status, featured, trending, popular } = request.body as any

    // TODO: Add admin authentication check

    try {
      const updateData: any = {}

      if (status) updateData.status = status
      if (featured !== undefined || trending !== undefined || popular !== undefined) {
        const template = await advancedTemplateService.getTemplateById(id)
        updateData.marketplace = {
          ...template?.marketplace,
          featured: featured ?? template?.marketplace?.featured,
          trending: trending ?? template?.marketplace?.trending,
          popular: popular ?? template?.marketplace?.popular
        }
      }

      const template = await advancedTemplateService.updateTemplate(id, updateData)

      return reply.send({
        success: true,
        data: template
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'UPDATE_TEMPLATE_STATUS_FAILED' }
      })
    }
  })
}
