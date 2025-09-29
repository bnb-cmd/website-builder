import { FastifyInstance } from 'fastify'
import { integrationMarketplaceService } from '../services/integrationMarketplaceService.js'

export async function integrationMarketplaceRoutes(fastify: FastifyInstance) {
  // Get all integrations
  fastify.get('/integrations', {
    schema: {
      description: 'Get all available integrations',
      tags: ['Integration Marketplace'],
      querystring: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          status: { type: 'string', enum: ['active', 'beta', 'deprecated', 'coming_soon'] },
          search: { type: 'string' },
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          offset: { type: 'integer', minimum: 0, default: 0 }
        }
      }
    }
  }, async (request, reply) => {
    const query = request.query as any

    try {
      const result = await integrationMarketplaceService.getIntegrations({
        category: query.category,
        status: query.status,
        search: query.search,
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
        error: { message: error.message, code: 'GET_INTEGRATIONS_FAILED' }
      })
    }
  })

  // Get integration by ID
  fastify.get('/integrations/:id', {
    schema: {
      description: 'Get integration details by ID',
      tags: ['Integration Marketplace'],
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
      const integration = await integrationMarketplaceService.getIntegrationById(id)

      if (!integration) {
        return reply.code(404).send({
          success: false,
          error: { message: 'Integration not found', code: 'INTEGRATION_NOT_FOUND' }
        })
      }

      return reply.send({
        success: true,
        data: integration
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'GET_INTEGRATION_FAILED' }
      })
    }
  })

  // Install integration
  fastify.post('/websites/:websiteId/integrations', {
    schema: {
      description: 'Install an integration for a website',
      tags: ['Integration Marketplace'],
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
          integrationId: { type: 'string' },
          config: { type: 'object' }
        },
        required: ['integrationId']
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }
    const { integrationId, config } = request.body as any

    try {
      const installation = await integrationMarketplaceService.installIntegration(
        websiteId,
        integrationId,
        config || {}
      )

      return reply.code(201).send({
        success: true,
        data: installation
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'INSTALL_INTEGRATION_FAILED' }
      })
    }
  })

  // Configure integration
  fastify.put('/website-integrations/:id', {
    schema: {
      description: 'Configure an installed integration',
      tags: ['Integration Marketplace'],
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
          config: { type: 'object' },
          credentials: { type: 'object' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const { config, credentials } = request.body as any

    try {
      const updatedIntegration = await integrationMarketplaceService.configureIntegration(
        id,
        config || {},
        credentials || {}
      )

      return reply.send({
        success: true,
        data: updatedIntegration
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'CONFIGURE_INTEGRATION_FAILED' }
      })
    }
  })

  // Uninstall integration
  fastify.delete('/website-integrations/:id', {
    schema: {
      description: 'Uninstall an integration',
      tags: ['Integration Marketplace'],
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
      await integrationMarketplaceService.uninstallIntegration(id)

      return reply.send({
        success: true,
        message: 'Integration uninstalled successfully'
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'UNINSTALL_INTEGRATION_FAILED' }
      })
    }
  })

  // Get website integrations
  fastify.get('/websites/:websiteId/integrations', {
    schema: {
      description: 'Get all integrations for a website',
      tags: ['Integration Marketplace'],
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
      const integrations = await integrationMarketplaceService.getWebsiteIntegrations(websiteId)

      return reply.send({
        success: true,
        data: { integrations }
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'GET_WEBSITE_INTEGRATIONS_FAILED' }
      })
    }
  })

  // Sync integration data
  fastify.post('/website-integrations/:id/sync', {
    schema: {
      description: 'Sync data for an integration',
      tags: ['Integration Marketplace'],
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
      const syncResult = await integrationMarketplaceService.syncIntegrationData(id)

      return reply.send({
        success: true,
        data: syncResult
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'SYNC_INTEGRATION_FAILED' }
      })
    }
  })

  // Create webhook
  fastify.post('/website-integrations/:integrationId/webhooks', {
    schema: {
      description: 'Create a webhook for an integration',
      tags: ['Integration Marketplace'],
      params: {
        type: 'object',
        properties: {
          integrationId: { type: 'string' }
        },
        required: ['integrationId']
      },
      body: {
        type: 'object',
        properties: {
          event: { type: 'string' },
          url: { type: 'string' }
        },
        required: ['event', 'url']
      }
    }
  }, async (request, reply) => {
    const { integrationId } = request.params as { integrationId: string }
    const { event, url } = request.body as any

    try {
      const webhook = await integrationMarketplaceService.createWebhook(integrationId, event, url)

      return reply.code(201).send({
        success: true,
        data: webhook
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'CREATE_WEBHOOK_FAILED' }
      })
    }
  })

  // Trigger webhook (internal)
  fastify.post('/internal/webhooks/:webhookId/trigger', {
    schema: {
      description: 'Trigger a webhook (internal)',
      tags: ['Integration Marketplace'],
      params: {
        type: 'object',
        properties: {
          webhookId: { type: 'string' }
        },
        required: ['webhookId']
      },
      body: { type: 'object' },
      hide: true
    }
  }, async (request, reply) => {
    const { webhookId } = request.params as { webhookId: string }
    const payload = request.body

    try {
      await integrationMarketplaceService.triggerWebhook(webhookId, payload)

      return reply.send({
        success: true,
        message: 'Webhook triggered successfully'
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'TRIGGER_WEBHOOK_FAILED' }
      })
    }
  })

  // Get integration logs
  fastify.get('/website-integrations/:integrationId/logs', {
    schema: {
      description: 'Get logs for an integration',
      tags: ['Integration Marketplace'],
      params: {
        type: 'object',
        properties: {
          integrationId: { type: 'string' }
        },
        required: ['integrationId']
      },
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 50 }
        }
      }
    }
  }, async (request, reply) => {
    const { integrationId } = request.params as { integrationId: string }
    const query = request.query as any

    try {
      const logs = await integrationMarketplaceService.getIntegrationLogs(
        integrationId,
        query.limit || 50
      )

      return reply.send({
        success: true,
        data: { logs }
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'GET_INTEGRATION_LOGS_FAILED' }
      })
    }
  })

  // Create review
  fastify.post('/integrations/:integrationId/reviews', {
    schema: {
      description: 'Create a review for an integration',
      tags: ['Integration Marketplace'],
      params: {
        type: 'object',
        properties: {
          integrationId: { type: 'string' }
        },
        required: ['integrationId']
      },
      body: {
        type: 'object',
        properties: {
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          title: { type: 'string' },
          content: { type: 'string' }
        },
        required: ['rating']
      }
    }
  }, async (request, reply) => {
    const { integrationId } = request.params as { integrationId: string }
    const { rating, title, content } = request.body as any
    const userId = (request as any).user?.id

    if (!userId) {
      return reply.code(401).send({
        success: false,
        error: { message: 'Authentication required', code: 'UNAUTHORIZED' }
      })
    }

    try {
      const review = await integrationMarketplaceService.createReview(
        integrationId,
        userId,
        rating,
        title,
        content
      )

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

  // Get integration categories
  fastify.get('/integration-categories', {
    schema: {
      description: 'Get all integration categories',
      tags: ['Integration Marketplace']
    }
  }, async (request, reply) => {
    try {
      const categories = await integrationMarketplaceService.getIntegrationCategories()

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

  // Get integration analytics
  fastify.get('/website-integrations/:integrationId/analytics', {
    schema: {
      description: 'Get analytics for an integration',
      tags: ['Integration Marketplace'],
      params: {
        type: 'object',
        properties: {
          integrationId: { type: 'string' }
        },
        required: ['integrationId']
      },
      querystring: {
        type: 'object',
        properties: {
          period: { type: 'string', enum: ['7d', '30d', '90d'], default: '30d' }
        }
      }
    }
  }, async (request, reply) => {
    const { integrationId } = request.params as { integrationId: string }
    const query = request.query as any

    try {
      const analytics = await integrationMarketplaceService.getIntegrationAnalytics(
        integrationId,
        query.period || '30d'
      )

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

  // Admin routes for managing integrations
  fastify.post('/admin/integrations', {
    schema: {
      description: 'Create a new integration (admin only)',
      tags: ['Integration Marketplace Admin'],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          provider: { type: 'string' },
          logo: { type: 'string' },
          website: { type: 'string' },
          documentation: { type: 'string' },
          pricing: { type: 'object' },
          features: { type: 'array', items: { type: 'string' } },
          screenshots: { type: 'array', items: { type: 'string' } },
          tags: { type: 'array', items: { type: 'string' } },
          status: { type: 'string' }
        },
        required: ['name', 'description', 'category', 'provider']
      }
    }
  }, async (request, reply) => {
    // TODO: Add admin authentication check

    try {
      const integration = await integrationMarketplaceService.createIntegration(request.body as any)

      return reply.code(201).send({
        success: true,
        data: integration
      })
    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'CREATE_INTEGRATION_FAILED' }
      })
    }
  })

  fastify.post('/admin/integration-categories', {
    schema: {
      description: 'Create an integration category (admin only)',
      tags: ['Integration Marketplace Admin'],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          icon: { type: 'string' },
          color: { type: 'string' }
        },
        required: ['name', 'slug']
      }
    }
  }, async (request, reply) => {
    // TODO: Add admin authentication check

    try {
      const category = await integrationMarketplaceService.createIntegrationCategory(request.body as any)

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
}
