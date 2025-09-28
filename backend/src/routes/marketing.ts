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
    preHandler: [authenticate, requireOwnership('website')],
    schema: {
      description: 'Create a new marketing campaign',
      tags: ['Marketing'],
      params: z.object({ websiteId: z.string() }),
      body: campaignDataSchema,
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
    const data = request.body as z.infer<typeof campaignDataSchema>
    const campaign = await marketingService.createCampaign(websiteId, data)
    reply.send({ success: true, data: campaign })
  })

  // GET /api/v1/marketing/:websiteId/campaigns
  fastify.get('/:websiteId/campaigns', {
    preHandler: [authenticate, requireOwnership('website')],
    schema: {
      description: 'Get all marketing campaigns for a website',
      tags: ['Marketing'],
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
    const campaigns = await marketingService.getCampaigns(websiteId)
    reply.send({ success: true, data: campaigns })
  })

  // PUT /api/v1/marketing/campaigns/:campaignId/status
  fastify.put('/campaigns/:campaignId/status', {
    preHandler: [authenticate],
    schema: {
      description: 'Update campaign status',
      tags: ['Marketing'],
      params: z.object({ campaignId: z.string() }),
      body: z.object({
        status: z.enum(['DRAFT', 'SCHEDULED', 'RUNNING', 'PAUSED', 'COMPLETED', 'CANCELLED']),
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
      body: messageDataSchema,
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
    const data = request.body as z.infer<typeof messageDataSchema>
    const message = await marketingService.sendMessage(data)
    reply.send({ success: true, data: message })
  })

  // GET /api/v1/marketing/campaigns/:campaignId/metrics
  fastify.get('/campaigns/:campaignId/metrics', {
    preHandler: [authenticate],
    schema: {
      description: 'Get campaign performance metrics',
      tags: ['Marketing'],
      params: z.object({ campaignId: z.string() }),
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
