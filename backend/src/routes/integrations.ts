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
      querystring: {
        type: 'object',
        properties: {
          category: { type: 'string', enum: ['ANALYTICS','PAYMENT','EMAIL','SOCIAL_MEDIA','CRM','ECOMMERCE','MARKETING','CUSTOMER_SUPPORT','PRODUCTIVITY','OTHER'] }
        },
        additionalProperties: false
      },
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
      body: {
        type: 'object',
        required: ['name','category','provider'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          description: { type: 'string', maxLength: 500 },
          category: { type: 'string', enum: ['ANALYTICS','PAYMENT','EMAIL','SOCIAL_MEDIA','CRM','ECOMMERCE','MARKETING','CUSTOMER_SUPPORT','PRODUCTIVITY','OTHER'] },
          provider: { type: 'string', minLength: 1, maxLength: 50 },
          iconUrl: { type: 'string' },
          websiteUrl: { type: 'string' },
          apiVersion: { type: 'string' },
          documentationUrl: { type: 'string' },
          configSchema: {},
          authType: { type: 'string', enum: ['API_KEY','OAUTH2','BASIC_AUTH','WEBHOOK','NO_AUTH'] },
          isPremium: { type: 'boolean' },
          price: { type: 'number', minimum: 0 },
          features: { type: 'array', items: { type: 'string' } },
          tags: { type: 'array', items: { type: 'string' } }
        },
        additionalProperties: false
      },
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
    preHandler: [authenticate, requireOwnership('websiteId')],
    schema: {
      description: 'Get installed integrations for a website',
      tags: ['Integrations'],
      params: {
        type: 'object',
        required: ['websiteId'],
        properties: { websiteId: { type: 'string' } }
      },
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
    preHandler: [authenticate, requireOwnership('websiteId')],
    schema: {
      description: 'Install an integration for a website',
      tags: ['Integrations'],
      params: {
        type: 'object',
        required: ['websiteId'],
        properties: { websiteId: { type: 'string' } }
      },
      body: {
        type: 'object',
        required: ['integrationId','config','credentials'],
        properties: {
          integrationId: { type: 'string' },
          config: {},
          credentials: {}
        },
        additionalProperties: false
      },
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
      params: {
        type: 'object',
        required: ['websiteIntegrationId'],
        properties: { websiteIntegrationId: { type: 'string' } }
      },
      body: {
        type: 'object',
        required: ['config'],
        properties: {
          config: {},
          credentials: {}
        },
        additionalProperties: false
      },
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
      params: {
        type: 'object',
        required: ['websiteIntegrationId'],
        properties: { websiteIntegrationId: { type: 'string' } }
      },
      body: {
        type: 'object',
        required: ['isEnabled'],
        properties: {
          isEnabled: { type: 'boolean' }
        },
        additionalProperties: false
      },
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
      params: {
        type: 'object',
        required: ['websiteIntegrationId'],
        properties: { websiteIntegrationId: { type: 'string' } }
      },
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
      params: {
        type: 'object',
        required: ['websiteIntegrationId'],
        properties: { websiteIntegrationId: { type: 'string' } }
      },
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
