import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { WebsiteService } from '@/services/websiteService'
import { authenticate, requireOwnership } from '@/middleware/auth'

// Validation schemas
const createWebsiteSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  templateId: z.string().optional(),
  businessType: z.enum(['RESTAURANT', 'RETAIL', 'SERVICE', 'HEALTHCARE', 'EDUCATION', 'TECHNOLOGY', 'FINANCE', 'REAL_ESTATE', 'ENTERTAINMENT', 'NON_PROFIT', 'OTHER']).optional(),
  language: z.enum(['ENGLISH', 'URDU']).optional(),
  content: z.any().optional(),
  settings: z.any().optional(),
  customCSS: z.string().optional(),
  customJS: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional()
})

const updateWebsiteSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  content: z.any().optional(),
  settings: z.any().optional(),
  customCSS: z.string().optional(),
  customJS: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional()
})

const querySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  search: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  businessType: z.enum(['RESTAURANT', 'RETAIL', 'SERVICE', 'HEALTHCARE', 'EDUCATION', 'TECHNOLOGY', 'FINANCE', 'REAL_ESTATE', 'ENTERTAINMENT', 'NON_PROFIT', 'OTHER']).optional(),
  language: z.enum(['ENGLISH', 'URDU']).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

export async function websiteRoutes(fastify: FastifyInstance) {
  const websiteService = new WebsiteService()

  // GET /api/v1/websites - List user's websites
  fastify.get('/', {
    schema: {
      description: 'Get user websites',
      tags: ['Websites'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 10 },
          search: { type: 'string' },
          status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
          businessType: { type: 'string' },
          language: { type: 'string', enum: ['ENGLISH', 'URDU'] },
          sortBy: { type: 'string', enum: ['createdAt', 'updatedAt', 'name', 'status'], default: 'createdAt' },
          sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
        }
      }
    },
    preHandler: authenticate
  }, async (request, reply) => {
    try {
      const userId = (request as any).user.id
      const query = querySchema.parse(request.query)
      
      const websites = await websiteService.findMany({
        userId,
        ...query,
        skip: (query.page - 1) * query.limit,
        take: query.limit
      })

      const total = await websiteService.count({ userId })

      return reply.send({
        success: true,
        data: {
          websites,
          pagination: {
            page: query.page,
            limit: query.limit,
            total,
            pages: Math.ceil(total / query.limit)
          }
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('List websites error:', error)
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
          message: 'Failed to fetch websites',
          code: 'FETCH_WEBSITES_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/websites/:id - Get single website
  fastify.get('/:id', {
    schema: {
      description: 'Get website by ID',
      tags: ['Websites'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    },
    preHandler: authenticate
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = (request as any).user.id
      
      const website = await websiteService.findById(id)
      if (!website) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'Website not found',
            code: 'WEBSITE_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
      }

      // Check ownership
      if (website.userId !== userId) {
        return reply.status(403).send({
          success: false,
          error: {
            message: 'Forbidden: You do not own this website',
            code: 'FORBIDDEN',
            timestamp: new Date().toISOString()
          }
        })
      }

      return reply.send({
        success: true,
        data: { website },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get website error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to fetch website',
          code: 'FETCH_WEBSITE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/websites - Create new website
  fastify.post('/', {
    schema: {
      description: 'Create new website',
      tags: ['Websites'],
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          description: { type: 'string', maxLength: 500 },
          templateId: { type: 'string' },
          businessType: { type: 'string' },
          language: { type: 'string', enum: ['ENGLISH', 'URDU'] },
          content: { type: 'object' },
          settings: { type: 'object' },
          customCSS: { type: 'string' },
          customJS: { type: 'string' },
          metaTitle: { type: 'string' },
          metaDescription: { type: 'string' },
          metaKeywords: { type: 'array', items: { type: 'string' } }
        }
      }
    },
    preHandler: authenticate
  }, async (request, reply) => {
    try {
      const userId = (request as any).user.id
      const validatedData = createWebsiteSchema.parse(request.body)
      
      const website = await websiteService.create({
        name: validatedData.name,
        description: validatedData.description,
        templateId: validatedData.templateId,
        businessType: validatedData.businessType,
        language: validatedData.language,
        userId,
        content: validatedData.content,
        settings: validatedData.settings,
        customCSS: validatedData.customCSS,
        customJS: validatedData.customJS,
        metaTitle: validatedData.metaTitle,
        metaDescription: validatedData.metaDescription,
        metaKeywords: validatedData.metaKeywords?.join(', ') || ''
      })

      return reply.status(201).send({
        success: true,
        data: { website },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Create website error:', error)
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
          message: 'Failed to create website',
          code: 'CREATE_WEBSITE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // PUT /api/v1/websites/:id - Update website
  fastify.put('/:id', {
    schema: {
      description: 'Update website',
      tags: ['Websites'],
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
          content: { type: 'object' },
          settings: { type: 'object' },
          customCSS: { type: 'string' },
          customJS: { type: 'string' },
          metaTitle: { type: 'string' },
          metaDescription: { type: 'string' },
          metaKeywords: { type: 'array', items: { type: 'string' } },
          status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] }
        }
      }
    },
    preHandler: authenticate
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = (request as any).user.id
      const validatedData = updateWebsiteSchema.parse(request.body)
      
      // Check if website exists and user owns it
      const existingWebsite = await websiteService.findById(id)
      if (!existingWebsite) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'Website not found',
            code: 'WEBSITE_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
      }

      if (existingWebsite.userId !== userId) {
        return reply.status(403).send({
          success: false,
          error: {
            message: 'Forbidden: You do not own this website',
            code: 'FORBIDDEN',
            timestamp: new Date().toISOString()
          }
        })
      }

      const website = await websiteService.update(id, {
        ...validatedData,
        metaKeywords: Array.isArray(validatedData.metaKeywords) 
          ? validatedData.metaKeywords.join(', ') 
          : validatedData.metaKeywords
      })

      return reply.send({
        success: true,
        data: { website },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Update website error:', error)
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
          message: 'Failed to update website',
          code: 'UPDATE_WEBSITE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // DELETE /api/v1/websites/:id - Delete website
  fastify.delete('/:id', {
    schema: {
      description: 'Delete website',
      tags: ['Websites'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    },
    preHandler: authenticate
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = (request as any).user.id
      
      // Check if website exists and user owns it
      const existingWebsite = await websiteService.findById(id)
      if (!existingWebsite) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'Website not found',
            code: 'WEBSITE_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
      }

      if (existingWebsite.userId !== userId) {
        return reply.status(403).send({
          success: false,
          error: {
            message: 'Forbidden: You do not own this website',
            code: 'FORBIDDEN',
            timestamp: new Date().toISOString()
          }
        })
      }

      await websiteService.delete(id)

      return reply.send({
        success: true,
        data: { message: 'Website deleted successfully' },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Delete website error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to delete website',
          code: 'DELETE_WEBSITE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/websites/:id/publish - Publish website
  fastify.post('/:id/publish', {
    schema: {
      description: 'Publish website',
      tags: ['Websites'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    },
    preHandler: authenticate
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const userId = (request as any).user.id
      
      // Check if website exists and user owns it
      const existingWebsite = await websiteService.findById(id)
      if (!existingWebsite) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'Website not found',
            code: 'WEBSITE_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
      }

      if (existingWebsite.userId !== userId) {
        return reply.status(403).send({
          success: false,
          error: {
            message: 'Forbidden: You do not own this website',
            code: 'FORBIDDEN',
            timestamp: new Date().toISOString()
          }
        })
      }

      const website = await websiteService.publish(id)

      return reply.send({
        success: true,
        data: { website },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Publish website error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to publish website',
          code: 'PUBLISH_WEBSITE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/websites/stats - Get website statistics
  fastify.get('/stats', {
    schema: {
      description: 'Get website statistics',
      tags: ['Websites']
    },
    preHandler: authenticate
  }, async (request, reply) => {
    try {
      const userId = (request as any).user.id
      
      const stats = await websiteService.getStats(userId)

      return reply.send({
        success: true,
        data: { stats },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get website stats error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to fetch website statistics',
          code: 'FETCH_STATS_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/websites/:id/analytics - Get website analytics
  fastify.get('/:id/analytics', {
    preHandler: [authenticate, requireOwnership('id')],
    schema: {
      description: 'Get analytics for a website',
      tags: ['Website Management'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string() }),
      querystring: z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        period: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).default('DAILY')
      })
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const query = request.query as any
      
      const filters = {
        websiteId: id,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
        period: query.period
      }
      
      const analytics = await websiteService.getWebsiteAnalytics(id, filters)

      return reply.send({
        success: true,
        data: { analytics },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get website analytics error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve website analytics',
          code: 'ANALYTICS_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/websites/:id/analytics/summary - Get website analytics summary
  fastify.get('/:id/analytics/summary', {
    preHandler: [authenticate, requireOwnership('id')],
    schema: {
      description: 'Get analytics summary for a website',
      tags: ['Website Management'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string() }),
      querystring: z.object({
        period: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).default('DAILY'),
        days: z.string().transform(Number).default('30')
      })
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const query = request.query as any
      
      const summary = await websiteService.getWebsiteAnalyticsSummary(id, query.period, query.days)

      return reply.send({
        success: true,
        data: { summary },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get website analytics summary error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve website analytics summary',
          code: 'ANALYTICS_SUMMARY_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/websites/:id/analytics/trends - Get website analytics trends
  fastify.get('/:id/analytics/trends', {
    preHandler: [authenticate, requireOwnership('id')],
    schema: {
      description: 'Get analytics trends for a website',
      tags: ['Website Management'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string() }),
      querystring: z.object({
        period: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).default('DAILY'),
        days: z.string().transform(Number).default('30')
      })
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const query = request.query as any
      
      const trends = await websiteService.getWebsiteAnalyticsTrends(id, query.period, query.days)

      return reply.send({
        success: true,
        data: { trends },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get website analytics trends error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve website analytics trends',
          code: 'ANALYTICS_TRENDS_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/websites/:id/analytics/insights - Get website predictive insights
  fastify.get('/:id/analytics/insights', {
    preHandler: [authenticate, requireOwnership('id')],
    schema: {
      description: 'Get predictive insights for a website',
      tags: ['Website Management'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string() })
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const insights = await websiteService.getWebsitePredictiveInsights(id)

      return reply.send({
        success: true,
        data: { insights },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get website analytics insights error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve website analytics insights',
          code: 'ANALYTICS_INSIGHTS_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/websites/:id/analytics - Create analytics record for website
  fastify.post('/:id/analytics', {
    preHandler: [authenticate, requireOwnership('id')],
    schema: {
      description: 'Create analytics record for website',
      tags: ['Website Management'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string() }),
      body: z.object({
        visitors: z.number().min(0),
        pageViews: z.number().min(0),
        bounceRate: z.number().min(0).max(1).optional(),
        avgSessionDuration: z.number().min(0).optional(),
        conversionRate: z.number().min(0).max(1).optional(),
        revenue: z.number().min(0).optional(),
        orders: z.number().min(0).optional(),
        avgOrderValue: z.number().min(0).optional(),
        organicTraffic: z.number().min(0).optional(),
        socialTraffic: z.number().min(0).optional(),
        directTraffic: z.number().min(0).optional(),
        referralTraffic: z.number().min(0).optional(),
        mobileTraffic: z.number().min(0).optional(),
        desktopTraffic: z.number().min(0).optional(),
        tabletTraffic: z.number().min(0).optional(),
        topCountries: z.record(z.string(), z.number()).optional(),
        topCities: z.record(z.string(), z.number()).optional(),
        pageLoadTime: z.number().min(0).optional(),
        coreWebVitals: z.object({
          lcp: z.number().min(0),
          fid: z.number().min(0),
          cls: z.number().min(0)
        }).optional(),
        topPages: z.array(z.object({
          path: z.string(),
          views: z.number().min(0),
          uniqueViews: z.number().min(0)
        })).optional(),
        referrers: z.array(z.object({
          domain: z.string(),
          visits: z.number().min(0)
        })).optional(),
        devices: z.object({
          mobile: z.number().min(0),
          desktop: z.number().min(0),
          tablet: z.number().min(0)
        }).optional(),
        browsers: z.record(z.string(), z.number()).optional(),
        operatingSystems: z.record(z.string(), z.number()).optional(),
        screenResolutions: z.record(z.string(), z.number()).optional(),
        timeOnSite: z.number().min(0).optional(),
        exitRate: z.number().min(0).max(1).optional(),
        newVisitors: z.number().min(0).optional(),
        returningVisitors: z.number().min(0).optional(),
        period: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).default('DAILY'),
        date: z.string().optional()
      })
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const body = request.body as any
      
      const analytics = await websiteService.createWebsiteAnalytics(
        id, 
        body, 
        body.period || 'DAILY',
        body.date ? new Date(body.date) : new Date()
      )

      return reply.status(201).send({
        success: true,
        data: { analytics },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Create website analytics error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to create website analytics',
          code: 'ANALYTICS_CREATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })
}