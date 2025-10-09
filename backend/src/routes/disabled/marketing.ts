import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { MarketingService } from '@/services/marketingService'
import { authenticate, requireOwnership } from '@/middleware/auth'

const campaignDataSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['EMAIL', 'SMS', 'WHATSAPP', 'PUSH_NOTIFICATION', 'SOCIAL_MEDIA']),
  channels: z.array(z.enum(['EMAIL', 'SMS', 'WHATSAPP', 'PUSH', 'FACEBOOK', 'INSTAGRAM', 'TWITTER'])),
  message: z.string().min(1).max(1000),
  mediaUrls: z.array(z.string().url()).optional(),
  targetAudience: z.any().optional(),
  schedule: z.any().optional(),
  triggers: z.any().optional(),
  conditions: z.any().optional(),
})

const messageDataSchema = z.object({
  campaignId: z.string(),
  recipientId: z.string().optional(),
  channel: z.enum(['EMAIL', 'SMS', 'WHATSAPP', 'PUSH', 'FACEBOOK', 'INSTAGRAM', 'TWITTER']),
  content: z.string().min(1).max(1000),
  mediaUrls: z.array(z.string().url()).optional(),
})

export async function marketingRoutes(fastify: FastifyInstance) {
  const marketingService = new MarketingService()

  // POST /api/v1/marketing/:websiteId/campaigns
  fastify.post('/:websiteId/campaigns', {
    preHandler: [authenticate, requireOwnership('websiteId')],
    schema: {
      description: 'Create a new marketing campaign',
      tags: ['Marketing'],
      params: {
        type: 'object',
        required: ['websiteId'],
        properties: { websiteId: { type: 'string' } }
      },
      body: {
        type: 'object',
        required: ['name','type','channels','message'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          type: { type: 'string', enum: ['EMAIL','SMS','WHATSAPP','PUSH_NOTIFICATION','SOCIAL_MEDIA'] },
          channels: { type: 'array', items: { type: 'string', enum: ['EMAIL','SMS','WHATSAPP','PUSH','FACEBOOK','INSTAGRAM','TWITTER'] } },
          message: { type: 'string', minLength: 1, maxLength: 1000 },
          mediaUrls: { type: 'array', items: { type: 'string' } },
          targetAudience: {},
          schedule: {},
          triggers: {},
          conditions: {}
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
    const data = request.body as any
    const campaign = await marketingService.createCampaign(websiteId, data)
    reply.send({ success: true, data: campaign })
  })

  // GET /api/v1/marketing/:websiteId/campaigns
  fastify.get('/:websiteId/campaigns', {
    preHandler: [authenticate, requireOwnership('websiteId')],
    schema: {
      description: 'Get all marketing campaigns for a website',
      tags: ['Marketing'],
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
    const campaigns = await marketingService.getCampaigns(websiteId)
    reply.send({ success: true, data: campaigns })
  })

  // PUT /api/v1/marketing/campaigns/:campaignId/status
  fastify.put('/campaigns/:campaignId/status', {
    preHandler: [authenticate],
    schema: {
      description: 'Update campaign status',
      tags: ['Marketing'],
      params: {
        type: 'object',
        required: ['campaignId'],
        properties: { campaignId: { type: 'string' } }
      },
      body: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['DRAFT','SCHEDULED','RUNNING','PAUSED','COMPLETED','CANCELLED'] }
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
    const { campaignId } = request.params as { campaignId: string }
    const { status } = request.body as { status: any }
    const campaign = await marketingService.updateCampaignStatus(campaignId, status)
    reply.send({ success: true, data: campaign })
  })

  // POST /api/v1/marketing/messages
  fastify.post('/messages', {
    preHandler: [authenticate],
    schema: {
      description: 'Send a marketing message',
      tags: ['Marketing'],
      body: {
        type: 'object',
        required: ['channel','content'],
        properties: {
          campaignId: { type: 'string' },
          recipientId: { type: 'string' },
          channel: { type: 'string', enum: ['EMAIL','SMS','WHATSAPP','PUSH','FACEBOOK','INSTAGRAM','TWITTER'] },
          content: { type: 'string', minLength: 1, maxLength: 1000 },
          mediaUrls: { type: 'array', items: { type: 'string' } }
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
    const data = request.body as any
    const message = await marketingService.sendMessage(data)
    reply.send({ success: true, data: message })
  })

  // GET /api/v1/marketing/campaigns/:campaignId/metrics
  fastify.get('/campaigns/:campaignId/metrics', {
    preHandler: [authenticate],
    schema: {
      description: 'Get campaign performance metrics',
      tags: ['Marketing'],
      params: {
        type: 'object',
        required: ['campaignId'],
        properties: { campaignId: { type: 'string' } }
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
    const { campaignId } = request.params as { campaignId: string }
    const metrics = await marketingService.getCampaignMetrics(campaignId)
    reply.send({ success: true, data: metrics })
  })
}
