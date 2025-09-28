import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { AgencyService } from '@/services/agencyService'
import { authenticate } from '@/middleware/auth'

const agencyDataSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  website: z.string().url().optional(),
  logo: z.string().url().optional(),
  brandName: z.string().max(100).optional(),
  brandColors: z.any().optional(),
  customDomain: z.string().optional(),
  customLogo: z.string().url().optional(),
  features: z.any().optional(),
  plan: z.enum(['STARTER', 'PROFESSIONAL', 'ENTERPRISE']).optional(),
  billingEmail: z.string().email().optional(),
})

const clientDataSchema = z.object({
  agencyId: z.string(),
  websiteId: z.string(),
  clientName: z.string().min(1).max(100),
  clientEmail: z.string().email(),
  clientPhone: z.string().optional(),
  companyName: z.string().max(100).optional(),
  projectType: z.string().optional(),
  budget: z.number().min(0).optional(),
  timeline: z.string().optional(),
  notes: z.string().max(1000).optional(),
})

export async function agencyRoutes(fastify: FastifyInstance) {
  const agencyService = new AgencyService()

  // POST /api/v1/agency
  fastify.post('/', {
    preHandler: [authenticate],
    schema: {
      description: 'Create a new agency',
      tags: ['Agency'],
      body: agencyDataSchema,
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
    const data = request.body as z.infer<typeof agencyDataSchema>
    const userId = (request as any).user.id
    const agency = await agencyService.createAgency(userId, data)
    reply.send({ success: true, data: agency })
  })

  // GET /api/v1/agency/my-agency
  fastify.get('/my-agency', {
    preHandler: [authenticate],
    schema: {
      description: 'Get current user\'s agency',
      tags: ['Agency'],
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
    const userId = (request as any).user.id
    const agency = await agencyService.getAgencyByUserId(userId)
    reply.send({ success: true, data: agency })
  })

  // PUT /api/v1/agency/:agencyId
  fastify.put('/:agencyId', {
    preHandler: [authenticate],
    schema: {
      description: 'Update agency settings',
      tags: ['Agency'],
      params: z.object({ agencyId: z.string() }),
      body: agencyDataSchema.partial(),
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
    const { agencyId } = request.params as { agencyId: string }
    const data = request.body as Partial<z.infer<typeof agencyDataSchema>>
    const agency = await agencyService.updateAgency(agencyId, data)
    reply.send({ success: true, data: agency })
  })

  // GET /api/v1/agency/:agencyId/clients
  fastify.get('/:agencyId/clients', {
    preHandler: [authenticate],
    schema: {
      description: 'Get agency clients',
      tags: ['Agency'],
      params: z.object({ agencyId: z.string() }),
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
    const { agencyId } = request.params as { agencyId: string }
    const clients = await agencyService.getAgencyClients(agencyId)
    reply.send({ success: true, data: clients })
  })

  // POST /api/v1/agency/clients
  fastify.post('/clients', {
    preHandler: [authenticate],
    schema: {
      description: 'Add a new client to agency',
      tags: ['Agency'],
      body: clientDataSchema,
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
    const data = request.body as z.infer<typeof clientDataSchema>
    const client = await agencyService.addClient(data)
    reply.send({ success: true, data: client })
  })

  // PUT /api/v1/agency/clients/:clientId
  fastify.put('/clients/:clientId', {
    preHandler: [authenticate],
    schema: {
      description: 'Update client information',
      tags: ['Agency'],
      params: z.object({ clientId: z.string() }),
      body: clientDataSchema.partial(),
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
    const { clientId } = request.params as { clientId: string }
    const data = request.body as Partial<z.infer<typeof clientDataSchema>>
    const client = await agencyService.updateClient(clientId, data)
    reply.send({ success: true, data: client })
  })

  // DELETE /api/v1/agency/clients/:clientId
  fastify.delete('/clients/:clientId', {
    preHandler: [authenticate],
    schema: {
      description: 'Remove client from agency',
      tags: ['Agency'],
      params: z.object({ clientId: z.string() }),
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
    const { clientId } = request.params as { clientId: string }
    await agencyService.removeClient(clientId)
    reply.send({ success: true })
  })

  // GET /api/v1/agency/:agencyId/stats
  fastify.get('/:agencyId/stats', {
    preHandler: [authenticate],
    schema: {
      description: 'Get agency statistics',
      tags: ['Agency'],
      params: z.object({ agencyId: z.string() }),
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
    const { agencyId } = request.params as { agencyId: string }
    const stats = await agencyService.getAgencyStats(agencyId)
    reply.send({ success: true, data: stats })
  })

  // GET /api/v1/agency/:agencyId/white-label-config
  fastify.get('/:agencyId/white-label-config', {
    schema: {
      description: 'Get white-label configuration for agency',
      tags: ['Agency'],
      params: z.object({ agencyId: z.string() }),
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
    const { agencyId } = request.params as { agencyId: string }
    const config = await agencyService.generateWhiteLabelConfig(agencyId)
    reply.send({ success: true, data: config })
  })

  // PUT /api/v1/agency/:agencyId/upgrade-plan
  fastify.put('/:agencyId/upgrade-plan', {
    preHandler: [authenticate],
    schema: {
      description: 'Upgrade agency plan',
      tags: ['Agency'],
      params: z.object({ agencyId: z.string() }),
      body: z.object({
        plan: z.enum(['STARTER', 'PROFESSIONAL', 'ENTERPRISE']),
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
    const { agencyId } = request.params as { agencyId: string }
    const { plan } = request.body as { plan: any }
    const agency = await agencyService.upgradeAgencyPlan(agencyId, plan)
    reply.send({ success: true, data: agency })
  })
}
