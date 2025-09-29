import { FastifyInstance } from 'fastify'
import { contentService } from '../services/contentService.js'

export async function contentRoutes(fastify: FastifyInstance) {
  // Content CRUD
  fastify.post('/websites/:websiteId/contents', {
    schema: {
      description: 'Create new content',
      tags: ['Content'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      },
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
          excerpt: { type: 'string' },
          categoryId: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          type: { type: 'string', enum: ['blog_post', 'article', 'news', 'page', 'product_description', 'landing_page'] },
          seo: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              keywords: { type: 'array', items: { type: 'string' } },
              noIndex: { type: 'boolean' },
              noFollow: { type: 'boolean' }
            }
          }
        },
        required: ['title', 'content']
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
                title: { type: 'string' },
                slug: { type: 'string' },
                status: { type: 'string' },
                createdAt: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }
    const userId = (request as any).user?.id

    if (!userId) {
      return reply.code(401).send({
        success: false,
        error: { message: 'Authentication required', code: 'UNAUTHORIZED' }
      })
    }

    try {
      const content = await contentService.createContent(websiteId, {
        ...request.body as any,
        authorId: userId
      })

      return reply.code(201).send({
        success: true,
        data: {
          id: content.id,
          title: content.title,
          slug: content.slug,
          status: content.status,
          createdAt: content.createdAt
        }
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'CREATE_CONTENT_FAILED' }
      })
    }
  })

  fastify.get('/websites/:websiteId/contents', {
    schema: {
      description: 'Get contents for a website',
      tags: ['Content'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      },
      querystring: {
        type: 'object',
        properties: {
          search: { type: 'string' },
          status: { type: 'string', enum: ['draft', 'scheduled', 'published', 'archived'] },
          type: { type: 'string' },
          categoryId: { type: 'string' },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          offset: { type: 'integer', minimum: 0, default: 0 }
        }
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }
    const query = request.query as any

    try {
      const result = await contentService.getContents(websiteId, {
        search: query.search,
        status: query.status,
        type: query.type,
        categoryId: query.categoryId,
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
        error: { message: error.message, code: 'GET_CONTENTS_FAILED' }
      })
    }
  })

  fastify.put('/contents/:id', {
    schema: {
      description: 'Update content',
      tags: ['Content'],
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
      const content = await contentService.updateContent(id, request.body as any)

      return reply.send({
        success: true,
        data: content
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'UPDATE_CONTENT_FAILED' }
      })
    }
  })

  fastify.delete('/contents/:id', {
    schema: {
      description: 'Delete content',
      tags: ['Content'],
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
      await contentService.deleteContent(id)

      return reply.send({
        success: true,
        message: 'Content deleted successfully'
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'DELETE_CONTENT_FAILED' }
      })
    }
  })

  // Content Categories
  fastify.post('/websites/:websiteId/content-categories', {
    schema: {
      description: 'Create content category',
      tags: ['Content'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          parentId: { type: 'string' },
          seo: { type: 'object' }
        },
        required: ['name']
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }

    try {
      const category = await contentService.createCategory(websiteId, request.body as any)

      return reply.code(201).send({
        success: true,
        data: category
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'CREATE_CATEGORY_FAILED' }
      })
    }
  })

  fastify.get('/websites/:websiteId/content-categories', {
    schema: {
      description: 'Get content categories for a website',
      tags: ['Content'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }

    try {
      const categories = await contentService.getCategories(websiteId)

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

  // Content Scheduling
  fastify.post('/contents/:contentId/schedule', {
    schema: {
      description: 'Schedule content for publication',
      tags: ['Content'],
      params: {
        type: 'object',
        properties: {
          contentId: { type: 'string' }
        },
        required: ['contentId']
      },
      body: {
        type: 'object',
        properties: {
          scheduledAt: { type: 'string', format: 'date-time' },
          platforms: { type: 'array', items: { type: 'string' } }
        },
        required: ['scheduledAt']
      }
    }
  }, async (request, reply) => {
    const { contentId } = request.params as { contentId: string }

    try {
      const schedule = await contentService.scheduleContent(contentId, request.body as any)

      return reply.send({
        success: true,
        data: schedule
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'SCHEDULE_CONTENT_FAILED' }
      })
    }
  })

  // SEO Optimization
  fastify.post('/contents/:contentId/optimize-seo', {
    schema: {
      description: 'Optimize content SEO with AI',
      tags: ['Content'],
      params: {
        type: 'object',
        properties: {
          contentId: { type: 'string' }
        },
        required: ['contentId']
      }
    }
  }, async (request, reply) => {
    const { contentId } = request.params as { contentId: string }

    try {
      const suggestions = await contentService.optimizeContentSEO(contentId)

      return reply.send({
        success: true,
        data: { suggestions }
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'SEO_OPTIMIZATION_FAILED' }
      })
    }
  })

  // Content Templates
  fastify.post('/content-templates', {
    schema: {
      description: 'Create content template',
      tags: ['Content'],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          content: { type: 'string' },
          variables: { type: 'array' },
          isPublic: { type: 'boolean' }
        },
        required: ['name', 'category', 'content']
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
      const template = await contentService.createTemplate({
        ...request.body as any,
        createdBy: userId
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

  fastify.get('/content-templates', {
    schema: {
      description: 'Get content templates',
      tags: ['Content'],
      querystring: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          isPublic: { type: 'boolean' }
        }
      }
    }
  }, async (request, reply) => {
    const query = request.query as any

    try {
      const templates = await contentService.getTemplates({
        category: query.category,
        isPublic: query.isPublic
      })

      return reply.send({
        success: true,
        data: { templates }
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'GET_TEMPLATES_FAILED' }
      })
    }
  })

  fastify.post('/content-templates/:templateId/use', {
    schema: {
      description: 'Use a content template',
      tags: ['Content'],
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
      const template = await contentService.useTemplate(templateId, userId)

      return reply.send({
        success: true,
        data: template
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'USE_TEMPLATE_FAILED' }
      })
    }
  })

  // Content Analytics
  fastify.get('/contents/:contentId/analytics', {
    schema: {
      description: 'Get content analytics',
      tags: ['Content'],
      params: {
        type: 'object',
        properties: {
          contentId: { type: 'string' }
        },
        required: ['contentId']
      }
    }
  }, async (request, reply) => {
    const { contentId } = request.params as { contentId: string }

    try {
      const analytics = await contentService.getContentAnalytics(contentId)

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

  fastify.put('/contents/:contentId/analytics', {
    schema: {
      description: 'Update content analytics',
      tags: ['Content'],
      params: {
        type: 'object',
        properties: {
          contentId: { type: 'string' }
        },
        required: ['contentId']
      }
    }
  }, async (request, reply) => {
    const { contentId } = request.params as { contentId: string }

    try {
      const analytics = await contentService.updateContentAnalytics(contentId, request.body as any)

      return reply.send({
        success: true,
        data: analytics
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'UPDATE_ANALYTICS_FAILED' }
      })
    }
  })

  // Content Insights
  fastify.get('/websites/:websiteId/content-insights', {
    schema: {
      description: 'Get content insights for a website',
      tags: ['Content'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      },
      querystring: {
        type: 'object',
        properties: {
          period: { type: 'string', enum: ['7d', '30d', '90d'], default: '30d' }
        }
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }
    const query = request.query as any

    try {
      const insights = await contentService.getContentInsights(websiteId, query.period || '30d')

      return reply.send({
        success: true,
        data: insights
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'GET_INSIGHTS_FAILED' }
      })
    }
  })

  // Process scheduled content (internal endpoint)
  fastify.post('/internal/process-scheduled-content', {
    schema: {
      description: 'Process scheduled content publication (internal)',
      tags: ['Content'],
      hide: true
    }
  }, async (request, reply) => {
    try {
      const processedCount = await contentService.processScheduledContent()

      return reply.send({
        success: true,
        data: { processedCount }
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'PROCESS_SCHEDULED_FAILED' }
      })
    }
  })
}
