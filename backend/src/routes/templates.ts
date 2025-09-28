import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { authenticate } from '../middleware/auth'
import { websiteTemplates, blockTemplates } from '../data/templates'
import { db } from '../models/database'

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
}