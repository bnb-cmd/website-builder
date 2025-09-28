import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { WebsiteService } from '@/services/websiteService'
import { authenticate, requireOwnership } from '@/middleware/auth'

// Validation schemas
const createWebsiteSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  templateId: z.string().optional(),
  businessType: z.enum(['RESTAURANT', 'RETAIL', 'SERVICE', 'ECOMMERCE', 'EDUCATION', 'HEALTHCARE', 'REAL_ESTATE', 'TECHNOLOGY', 'CREATIVE', 'NON_PROFIT', 'OTHER']).optional(),
  language: z.enum(['ENGLISH', 'URDU', 'PUNJABI', 'SINDHI', 'PASHTO']).optional(),
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
  customDomain: z.string().optional()
})

const websiteQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  businessType: z.enum(['RESTAURANT', 'RETAIL', 'SERVICE', 'ECOMMERCE', 'EDUCATION', 'HEALTHCARE', 'REAL_ESTATE', 'TECHNOLOGY', 'CREATIVE', 'NON_PROFIT', 'OTHER']).optional(),
  language: z.enum(['ENGLISH', 'URDU', 'PUNJABI', 'SINDHI', 'PASHTO']).optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
})

export async function websiteRoutes(fastify: FastifyInstance) {
  const websiteService = new WebsiteService()

  const mockWebsites = [
    {
      id: 'demo-website-1',
      name: 'Lahore Bites Restaurant',
      description: 'Modern restaurant website with online menu and reservations',
      status: 'PUBLISHED',
      subdomain: 'lahorebites',
      customDomain: 'lahorebites.pk',
      businessType: 'RESTAURANT',
      language: 'ENGLISH',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'demo-website-2',
      name: 'Karachi Fashion Hub',
      description: 'E-commerce storefront with EasyPaisa and JazzCash integration',
      status: 'PUBLISHED',
      subdomain: 'karachifashion',
      customDomain: 'karachifashion.pk',
      businessType: 'ECOMMERCE',
      language: 'ENGLISH',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'demo-website-3',
      name: 'Islamabad Tech Conference',
      description: 'Event landing page with speaker profiles and registration',
      status: 'DRAFT',
      subdomain: 'islamabadtech',
      customDomain: null,
      businessType: 'TECHNOLOGY',
      language: 'ENGLISH',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      publishedAt: null
    },
    {
      id: 'demo-website-4',
      name: 'Peshawar Fitness Club',
      description: 'Gym and fitness studio website with class schedules and trainer bios',
      status: 'PUBLISHED',
      subdomain: 'peshawarfitness',
      customDomain: null,
      businessType: 'SERVICE',
      language: 'ENGLISH',
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      publishedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'demo-website-5',
      name: 'Quetta Study Circle',
      description: 'Educational site offering course outlines and enrollment forms',
      status: 'DRAFT',
      subdomain: 'quettastudy',
      customDomain: null,
      businessType: 'EDUCATION',
      language: 'ENGLISH',
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      publishedAt: null
    }
  ]

  // GET /api/v1/websites
  fastify.get('/', {
    preHandler: [authenticate],
    schema: {
      description: 'Get user websites',
      tags: ['Websites'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
          status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] },
          businessType: { type: 'string', enum: ['RESTAURANT', 'RETAIL', 'SERVICE', 'ECOMMERCE', 'EDUCATION', 'HEALTHCARE', 'REAL_ESTATE', 'TECHNOLOGY', 'CREATIVE', 'NON_PROFIT', 'OTHER'] },
          language: { type: 'string', enum: ['ENGLISH', 'URDU'] },
          search: { type: 'string' },
          sortBy: { type: 'string' },
          sortOrder: { type: 'string', enum: ['asc', 'desc'] }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  status: { type: 'string' },
                  subdomain: { type: 'string' },
                  customDomain: { type: 'string' },
                  businessType: { type: 'string' },
                  language: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                  publishedAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            pagination: { $ref: 'Pagination' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        401: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const query = websiteQuerySchema.parse(request.query)

      if (process.env.NODE_ENV === 'development' || process.env.USE_MOCK_DATA === 'true') {
        const offset = (query.page - 1) * query.limit
        const data = mockWebsites.slice(offset, offset + query.limit)

        reply.send({
          success: true,
          data,
          pagination: {
            page: query.page,
            limit: query.limit,
            total: mockWebsites.length,
            pages: Math.ceil(mockWebsites.length / query.limit)
          },
          timestamp: new Date().toISOString()
        })
        return
      }

      const websites = await websiteService.findAll({
        ...query,
        userId: request.user!.id
      })

      const total = await websiteService.count({ userId: request.user!.id })

      reply.send({
        success: true,
        data: websites,
        pagination: {
          page: query.page,
          limit: query.limit,
          total,
          pages: Math.ceil(total / query.limit)
        },
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
          message: 'Failed to fetch websites',
          code: 'FETCH_WEBSITES_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/websites
  fastify.post('/', {
    preHandler: [authenticate],
    schema: {
      description: 'Create a new website',
      tags: ['Websites'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          description: { type: 'string', maxLength: 500 },
          templateId: { type: 'string' },
          businessType: { type: 'string', enum: ['RESTAURANT', 'RETAIL', 'SERVICE', 'ECOMMERCE', 'EDUCATION', 'HEALTHCARE', 'REAL_ESTATE', 'TECHNOLOGY', 'CREATIVE', 'NON_PROFIT', 'OTHER'] },
          language: { type: 'string', enum: ['ENGLISH', 'URDU'] },
          content: { type: 'object' },
          settings: { type: 'object' },
          customCSS: { type: 'string' },
          customJS: { type: 'string' },
          metaTitle: { type: 'string' },
          metaDescription: { type: 'string' },
          metaKeywords: { type: 'array', items: { type: 'string' } }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' },
                status: { type: 'string' },
                subdomain: { type: 'string' },
                businessType: { type: 'string' },
                language: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
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
      const data = createWebsiteSchema.parse(request.body)
      
      const website = await websiteService.create({
        ...data,
        userId: request.user!.id
      })
      
      reply.status(201).send({
        success: true,
        data: website,
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
          message: 'Failed to create website',
          code: 'CREATE_WEBSITE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/websites/:id
  fastify.get('/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Get website by ID',
      tags: ['Websites'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
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
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' },
                status: { type: 'string' },
                subdomain: { type: 'string' },
                customDomain: { type: 'string' },
                content: { type: 'object' },
                settings: { type: 'object' },
                customCSS: { type: 'string' },
                customJS: { type: 'string' },
                metaTitle: { type: 'string' },
                metaDescription: { type: 'string' },
                metaKeywords: { type: 'array', items: { type: 'string' } },
                businessType: { type: 'string' },
                language: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
                publishedAt: { type: 'string', format: 'date-time' }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        401: { $ref: 'Error' },
        404: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const website = await websiteService.findById(id)
      if (!website) {
        reply.status(404).send({
          success: false,
          error: {
            message: 'Website not found',
            code: 'WEBSITE_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      // Check ownership
      if (website.userId !== request.user!.id && request.user!.role !== 'ADMIN') {
        reply.status(403).send({
          success: false,
          error: {
            message: 'Access denied',
            code: 'ACCESS_DENIED',
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      reply.send({
        success: true,
        data: website,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to fetch website',
          code: 'FETCH_WEBSITE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // PUT /api/v1/websites/:id
  fastify.put('/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Update website',
      tags: ['Websites'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
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
          customDomain: { type: 'string' }
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
                id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' },
                status: { type: 'string' },
                subdomain: { type: 'string' },
                customDomain: { type: 'string' },
                updatedAt: { type: 'string', format: 'date-time' }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        400: { $ref: 'Error' },
        401: { $ref: 'Error' },
        404: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const data = updateWebsiteSchema.parse(request.body)
      
      const website = await websiteService.findById(id)
      if (!website) {
        reply.status(404).send({
          success: false,
          error: {
            message: 'Website not found',
            code: 'WEBSITE_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      // Check ownership
      if (website.userId !== request.user!.id && request.user!.role !== 'ADMIN') {
        reply.status(403).send({
          success: false,
          error: {
            message: 'Access denied',
            code: 'ACCESS_DENIED',
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      const updatedWebsite = await websiteService.update(id, data)
      
      reply.send({
        success: true,
        data: updatedWebsite,
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
          message: 'Failed to update website',
          code: 'UPDATE_WEBSITE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // DELETE /api/v1/websites/:id
  fastify.delete('/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Delete website',
      tags: ['Websites'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
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
                message: { type: 'string', example: 'Website deleted successfully' }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        401: { $ref: 'Error' },
        404: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const website = await websiteService.findById(id)
      if (!website) {
        reply.status(404).send({
          success: false,
          error: {
            message: 'Website not found',
            code: 'WEBSITE_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      // Check ownership
      if (website.userId !== request.user!.id && request.user!.role !== 'ADMIN') {
        reply.status(403).send({
          success: false,
          error: {
            message: 'Access denied',
            code: 'ACCESS_DENIED',
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      await websiteService.delete(id)
      
      reply.send({
        success: true,
        data: {
          message: 'Website deleted successfully'
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to delete website',
          code: 'DELETE_WEBSITE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/websites/:id/publish
  fastify.post('/:id/publish', {
    preHandler: [authenticate],
    schema: {
      description: 'Publish website',
      tags: ['Websites'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
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
                id: { type: 'string' },
                status: { type: 'string' },
                publishedAt: { type: 'string', format: 'date-time' }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        401: { $ref: 'Error' },
        404: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const website = await websiteService.findById(id)
      if (!website) {
        reply.status(404).send({
          success: false,
          error: {
            message: 'Website not found',
            code: 'WEBSITE_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      // Check ownership
      if (website.userId !== request.user!.id && request.user!.role !== 'ADMIN') {
        reply.status(403).send({
          success: false,
          error: {
            message: 'Access denied',
            code: 'ACCESS_DENIED',
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      const publishedWebsite = await websiteService.publish(id)
      
      reply.send({
        success: true,
        data: {
          id: publishedWebsite.id,
          status: publishedWebsite.status,
          publishedAt: publishedWebsite.publishedAt
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to publish website',
          code: 'PUBLISH_WEBSITE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/websites/:id/duplicate
  fastify.post('/:id/duplicate', {
    preHandler: [authenticate],
    schema: {
      description: 'Duplicate website',
      tags: ['Websites'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                status: { type: 'string' },
                subdomain: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        400: { $ref: 'Error' },
        401: { $ref: 'Error' },
        404: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { name } = request.body as { name: string }
      
      const website = await websiteService.findById(id)
      if (!website) {
        reply.status(404).send({
          success: false,
          error: {
            message: 'Website not found',
            code: 'WEBSITE_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      // Check ownership
      if (website.userId !== request.user!.id && request.user!.role !== 'ADMIN') {
        reply.status(403).send({
          success: false,
          error: {
            message: 'Access denied',
            code: 'ACCESS_DENIED',
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      const duplicatedWebsite = await websiteService.duplicate(id, name, request.user!.id)
      
      reply.status(201).send({
        success: true,
        data: duplicatedWebsite,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to duplicate website',
          code: 'DUPLICATE_WEBSITE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })
}
