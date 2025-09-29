import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { authenticate } from '../middleware/auth'
import { websiteTemplates, blockTemplates } from '../data/templates'
import { db } from '../models/database'
import { advancedTemplateService } from '../services/advancedTemplateService'

interface GetTemplatesQuery {
  category?: string
  premium?: boolean
  localized?: boolean
  search?: string
  limit?: number
  offset?: number
}

interface UseTemplateBody {
  templateId: string
  websiteName: string
}

export async function templateRoutes(fastify: FastifyInstance) {
  // Get all website templates
  fastify.get<{ Querystring: GetTemplatesQuery }>(
    '/',
    {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            category: { type: 'string' },
            premium: { type: 'boolean' },
            localized: { type: 'boolean' },
            search: { type: 'string' },
            limit: { type: 'integer', default: 20 },
            offset: { type: 'integer', default: 0 }
          }
        }
      }
    },
    async (request: FastifyRequest<{ Querystring: GetTemplatesQuery }>, reply: FastifyReply) => {
      const { category, premium, localized, search, limit = 20, offset = 0 } = request.query

      let filtered = [...websiteTemplates]

      // Apply filters
      if (category) {
        filtered = filtered.filter(t => t.category.toLowerCase() === category.toLowerCase())
      }

      if (premium !== undefined) {
        filtered = filtered.filter(t => t.isPremium === premium)
      }

      if (localized) {
        filtered = filtered.filter(t => t.localizedFor === 'pk')
      }

      if (search) {
        const searchLower = search.toLowerCase()
        filtered = filtered.filter(t => 
          t.name.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower) ||
          t.tags.some(tag => tag.toLowerCase().includes(searchLower))
        )
      }

      // Pagination
      const total = filtered.length
      const templates = filtered.slice(offset, offset + limit)

      return {
        templates,
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    }
  )

  // Get template categories
  fastify.get('/categories', async (request, reply) => {
    const categories = [...new Set(websiteTemplates.map(t => t.category))]
    const categoriesWithCount = categories.map(cat => ({
      name: cat,
      count: websiteTemplates.filter(t => t.category === cat).length
    }))

    return { categories: categoriesWithCount }
  })

  // Get single template details
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    async (request, reply) => {
      const template = websiteTemplates.find(t => t.id === request.params.id)
      
      if (!template) {
        return reply.code(404).send({ error: 'Template not found' })
      }

      return { template }
    }
  )

  // Get block templates
  fastify.get<{ Querystring: { category?: string } }>(
    '/blocks',
    async (request, reply) => {
      const { category } = request.query
      
      let blocks = [...blockTemplates]
      
      if (category) {
        blocks = blocks.filter(b => b.category.toLowerCase() === category.toLowerCase())
      }

      const categories = [...new Set(blockTemplates.map(b => b.category))]

      return {
        blocks,
        categories
      }
    }
  )

  // Use a template (requires authentication)
  fastify.post<{ Body: UseTemplateBody }>(
    '/templates/use',
    {
      preHandler: authenticate,
      schema: {
        body: {
          type: 'object',
          required: ['templateId', 'websiteName'],
          properties: {
            templateId: { type: 'string' },
            websiteName: { type: 'string' }
          }
        }
      }
    },
    async (request, reply) => {
      const { templateId, websiteName } = request.body
      const userId = request.user.id

      const template = websiteTemplates.find(t => t.id === templateId)
      
      if (!template) {
        return reply.code(404).send({ error: 'Template not found' })
      }

      // Check if user can use premium templates
      if (template.isPremium) {
        const user = await db.user.findUnique({
          where: { id: userId },
          include: { subscription: true }
        })

        if (!user?.subscription || user.subscription.plan === 'free') {
          return reply.code(403).send({ error: 'Premium template requires a paid subscription' })
        }
      }

      // Create website from template
      const website = await db.website.create({
        data: {
          name: websiteName,
          userId,
          template: template.id,
          data: {
            elements: template.elements || [],
            pages: template.pages || ['home'],
            settings: {
              features: template.features || []
            }
          },
          status: 'draft'
        }
      })

      // Track template usage
      await db.templateUsage.create({
        data: {
          templateId,
          userId,
          websiteId: website.id
        }
      })

      return {
        website,
        message: 'Website created from template successfully'
      }
    }
  )

  // Get popular templates
  fastify.get('/popular', async (request, reply) => {
    // In a real app, this would query actual usage data
    const popular = websiteTemplates
      .slice(0, 6)
      .map(t => ({
        ...t,
        usageCount: Math.floor(Math.random() * 1000) + 100
      }))
      .sort((a, b) => b.usageCount - a.usageCount)

    return { templates: popular }
  })

  // Get templates by industry
  fastify.get('/industries', async (request, reply) => {
    const industries = {
      'Business & Corporate': ['business-1'],
      'E-commerce & Retail': ['ecommerce-1'],
      'Food & Restaurant': ['restaurant-1'],
      'Creative & Portfolio': ['portfolio-1'],
      'Education & Learning': ['education-1'],
      'Healthcare & Medical': ['medical-1'],
      'Real Estate': ['realestate-1'],
      'Events & Wedding': ['wedding-1'],
      'Blog & Content': ['blog-1'],
      'Non-Profit': ['nonprofit-1'],
      'Fitness & Sports': ['fitness-1'],
      'Travel & Tourism': ['travel-1']
    }

    const industriesWithTemplates = Object.entries(industries).map(([industry, ids]) => ({
      name: industry,
      templates: websiteTemplates.filter(t => ids.includes(t.id))
    }))

    return { industries: industriesWithTemplates }
  })

  // Advanced Template Engine endpoints
  // GET /api/v1/templates/catalog
  fastify.get('/catalog', {
    schema: {
      description: 'List advanced templates for catalog browsing',
      tags: ['Templates', 'Advanced'],
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
    try {
      const { category, search, featured, pricingModel, limit = 20, offset = 0 } = request.query as any

      const result = await advancedTemplateService.getTemplates({
        category,
        search,
        featured,
        pricingModel,
        limit,
        offset
      })

      reply.send({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to get template catalog',
          code: 'TEMPLATE_CATALOG_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/templates/advanced
  fastify.post('/advanced', {
    preHandler: [authenticate],
    schema: {
      description: 'Create a new advanced template',
      tags: ['Templates', 'Advanced'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          configuration: { type: 'object' },
          previewUrl: { type: 'string' },
          thumbnailUrl: { type: 'string' },
          pricingModel: { type: 'string', enum: ['free', 'premium', 'subscription'] },
          price: { type: 'number' },
          features: { type: 'array', items: { type: 'string' } },
          tags: { type: 'array', items: { type: 'string' } },
          isActive: { type: 'boolean' }
        }
      },
      response: {
        201: { $ref: 'Success' },
        400: { $ref: 'Error' },
        401: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const template = await advancedTemplateService.createTemplate(request.body as any)
      
      reply.code(201).send({
        success: true,
        data: template,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to create advanced template',
          code: 'ADVANCED_TEMPLATE_CREATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/templates/advanced/:id
  fastify.get('/advanced/:id', {
    schema: {
      description: 'Get advanced template by ID',
      tags: ['Templates', 'Advanced'],
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string' } }
      },
      response: {
        200: { $ref: 'Success' },
        404: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const template = await advancedTemplateService.getTemplateById(id)
      
      if (!template) {
        reply.status(404).send({
          success: false,
          error: {
            message: 'Template not found',
            code: 'TEMPLATE_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      reply.send({
        success: true,
        data: template,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to get advanced template',
          code: 'ADVANCED_TEMPLATE_FETCH_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })
}