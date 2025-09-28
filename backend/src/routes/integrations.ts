import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { IntegrationService } from '@/services/integrationService'
import { authenticate, requireOwnership } from '@/middleware/auth'

const integrationDataSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.enum(['ANALYTICS', 'PAYMENT', 'EMAIL', 'SOCIAL_MEDIA', 'CRM', 'ECOMMERCE', 'MARKETING', 'CUSTOMER_SUPPORT', 'PRODUCTIVITY', 'OTHER']),
  provider: z.string().min(1).max(50),
  iconUrl: z.string().url().optional(),
  websiteUrl: z.string().url().optional(),
  apiVersion: z.string().optional(),
  documentationUrl: z.string().url().optional(),
  configSchema: z.any().optional(),
  authType: z.enum(['API_KEY', 'OAUTH2', 'BASIC_AUTH', 'WEBHOOK', 'NO_AUTH']).optional(),
  isPremium: z.boolean().optional(),
  price: z.number().min(0).optional(),
  features: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
})

const installIntegrationSchema = z.object({
  integrationId: z.string(),
  config: z.any(),
  credentials: z.any(),
})

export async function integrationRoutes(fastify: FastifyInstance) {
  const integrationService = new IntegrationService()

  // GET /api/v1/integrations
  fastify.get('/', {
    schema: {
      description: 'Get all available integrations',
      tags: ['Integrations'],
      querystring: z.object({
        category: z.enum(['ANALYTICS', 'PAYMENT', 'EMAIL', 'SOCIAL_MEDIA', 'CRM', 'ECOMMERCE', 'MARKETING', 'CUSTOMER_SUPPORT', 'PRODUCTIVITY', 'OTHER']).optional(),
      }),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { category } = request.query as { category?: any }
    const integrations = await integrationService.getIntegrations(category)
    reply.send({ success: true, data: integrations })
  })

  // POST /api/v1/integrations
  fastify.post('/', {
    preHandler: [authenticate],
    schema: {
      description: 'Create a new integration (admin only)',
      tags: ['Integrations'],
      body: integrationDataSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const data = request.body as z.infer<typeof integrationDataSchema>
    const integration = await integrationService.createIntegration(data)
    reply.send({ success: true, data: integration })
  })

  // GET /api/v1/integrations/:websiteId/installed
  fastify.get('/:websiteId/installed', {
    preHandler: [authenticate, requireOwnership('website')],
    schema: {
      description: 'Get installed integrations for a website',
      tags: ['Integrations'],
      params: z.object({ websiteId: z.string() }),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }
    const integrations = await integrationService.getWebsiteIntegrations(websiteId)
    reply.send({ success: true, data: integrations })
  })

  // POST /api/v1/integrations/:websiteId/install
  fastify.post('/:websiteId/install', {
    preHandler: [authenticate, requireOwnership('website')],
    schema: {
      description: 'Install an integration for a website',
      tags: ['Integrations'],
      params: z.object({ websiteId: z.string() }),
      body: installIntegrationSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }
    const { integrationId, config, credentials } = request.body as z.infer<typeof installIntegrationSchema>
    const websiteIntegration = await integrationService.installIntegration(websiteId, integrationId, config, credentials)
    reply.send({ success: true, data: websiteIntegration })
  })

  // PUT /api/v1/integrations/website/:websiteIntegrationId/config
  fastify.put('/website/:websiteIntegrationId/config', {
    preHandler: [authenticate],
    schema: {
      description: 'Update integration configuration',
      tags: ['Integrations'],
      params: z.object({ websiteIntegrationId: z.string() }),
      body: z.object({
        config: z.any(),
        credentials: z.any().optional(),
      }),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { websiteIntegrationId } = request.params as { websiteIntegrationId: string }
    const { config, credentials } = request.body as { config: any; credentials?: any }
    const websiteIntegration = await integrationService.updateIntegrationConfig(websiteIntegrationId, config, credentials)
    reply.send({ success: true, data: websiteIntegration })
  })

  // PUT /api/v1/integrations/website/:websiteIntegrationId/toggle
  fastify.put('/website/:websiteIntegrationId/toggle', {
    preHandler: [authenticate],
    schema: {
      description: 'Enable/disable an integration',
      tags: ['Integrations'],
      params: z.object({ websiteIntegrationId: z.string() }),
      body: z.object({
        isEnabled: z.boolean(),
      }),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { websiteIntegrationId } = request.params as { websiteIntegrationId: string }
    const { isEnabled } = request.body as { isEnabled: boolean }
    const websiteIntegration = await integrationService.toggleIntegration(websiteIntegrationId, isEnabled)
    reply.send({ success: true, data: websiteIntegration })
  })

  // DELETE /api/v1/integrations/website/:websiteIntegrationId
  fastify.delete('/website/:websiteIntegrationId', {
    preHandler: [authenticate],
    schema: {
      description: 'Uninstall an integration',
      tags: ['Integrations'],
      params: z.object({ websiteIntegrationId: z.string() }),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { websiteIntegrationId } = request.params as { websiteIntegrationId: string }
    await integrationService.uninstallIntegration(websiteIntegrationId)
    reply.send({ success: true })
  })

  // POST /api/v1/integrations/website/:websiteIntegrationId/test
  fastify.post('/website/:websiteIntegrationId/test', {
    preHandler: [authenticate],
    schema: {
      description: 'Test an integration connection',
      tags: ['Integrations'],
      params: z.object({ websiteIntegrationId: z.string() }),
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
          },
        },
      },
    },
  }, async (request, reply) => {
    const { websiteIntegrationId } = request.params as { websiteIntegrationId: string }
    const result = await integrationService.testIntegration(websiteIntegrationId)
    reply.send({ success: true, data: result })
  })
}
