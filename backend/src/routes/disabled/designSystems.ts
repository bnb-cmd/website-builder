import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { DesignSystemService } from '@/services/designSystemService'
import { authenticate, requireOwnership } from '@/middleware/auth'

const designSystemSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  brandName: z.string().max(100).optional(),
  brandValues: z.array(z.string()).optional(),
  brandPersonality: z.string().optional(),
  primaryColors: z.array(z.any()).optional(),
  secondaryColors: z.array(z.any()).optional(),
  neutralColors: z.array(z.any()).optional(),
  fontFamilies: z.array(z.any()).optional(),
  fontSizes: z.array(z.any()).optional(),
  spacingScale: z.array(z.any()).optional(),
  borderRadius: z.array(z.any()).optional(),
  shadows: z.array(z.any()).optional(),
  components: z.any().optional(),
})

const aiGenerationSchema = z.object({
  prompt: z.string().min(1).max(1000),
  settings: z.object({
    industry: z.string().optional(),
    targetAudience: z.string().optional(),
    brandPersonality: z.string().optional(),
    colorPreferences: z.array(z.string()).optional(),
    stylePreferences: z.array(z.string()).optional(),
    mood: z.string().optional(),
  }).optional(),
})

export async function designSystemRoutes(fastify: FastifyInstance) {
  const designSystemService = new DesignSystemService()

  // POST /api/v1/design-systems/:websiteId
  fastify.post('/:websiteId', {
    preHandler: [authenticate, requireOwnership('websiteId')],
    schema: {
      description: 'Create a new design system',
      tags: ['Design Systems'],
      params: {
        type: 'object',
        required: ['websiteId'],
        properties: { websiteId: { type: 'string' } }
      },
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          description: { type: 'string', maxLength: 500 },
          brandName: { type: 'string', maxLength: 100 },
          brandValues: { type: 'array', items: { type: 'string' } },
          brandPersonality: { type: 'string' },
          primaryColors: { type: 'array', items: {} },
          secondaryColors: { type: 'array', items: {} },
          neutralColors: { type: 'array', items: {} },
          fontFamilies: { type: 'array', items: {} },
          fontSizes: { type: 'array', items: {} },
          spacingScale: { type: 'array', items: {} },
          borderRadius: { type: 'array', items: {} },
          shadows: { type: 'array', items: {} },
          components: {}
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
    const data = request.body as z.infer<typeof designSystemSchema>
    const userId = (request as any).user.id
    const designSystem = await designSystemService.createDesignSystem(websiteId, userId, data)
    reply.send({ success: true, data: designSystem })
  })

  // GET /api/v1/design-systems/:websiteId
  fastify.get('/:websiteId', {
    preHandler: [authenticate, requireOwnership('websiteId')],
    schema: {
      description: 'Get design systems for a website',
      tags: ['Design Systems'],
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
    const designSystems = await designSystemService.getDesignSystems(websiteId)
    reply.send({ success: true, data: designSystems })
  })

  // POST /api/v1/design-systems/:websiteId/ai-generate
  fastify.post('/:websiteId/ai-generate', {
    preHandler: [authenticate, requireOwnership('websiteId')],
    schema: {
      description: 'Generate AI design system',
      tags: ['Design Systems'],
      params: {
        type: 'object',
        required: ['websiteId'],
        properties: { websiteId: { type: 'string' } }
      },
      body: {
        type: 'object',
        required: ['prompt'],
        properties: {
          prompt: { type: 'string', minLength: 1, maxLength: 1000 },
          settings: {
            type: 'object',
            properties: {
              industry: { type: 'string' },
              targetAudience: { type: 'string' },
              brandPersonality: { type: 'string' },
              colorPreferences: { type: 'array', items: { type: 'string' } },
              stylePreferences: { type: 'array', items: { type: 'string' } },
              mood: { type: 'string' }
            },
            additionalProperties: true
          }
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
    const { prompt, settings } = request.body as z.infer<typeof aiGenerationSchema>
    const userId = (request as any).user.id
    const designSystem = await designSystemService.generateAIDesignSystem(websiteId, userId, prompt, settings || {})
    reply.send({ success: true, data: designSystem })
  })

  // PUT /api/v1/design-systems/:designSystemId
  fastify.put('/:designSystemId', {
    preHandler: [authenticate],
    schema: {
      description: 'Update a design system',
      tags: ['Design Systems'],
      params: {
        type: 'object',
        required: ['designSystemId'],
        properties: { designSystemId: { type: 'string' } }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          description: { type: 'string', maxLength: 500 },
          brandName: { type: 'string', maxLength: 100 },
          brandValues: { type: 'array', items: { type: 'string' } },
          brandPersonality: { type: 'string' },
          primaryColors: { type: 'array', items: {} },
          secondaryColors: { type: 'array', items: {} },
          neutralColors: { type: 'array', items: {} },
          fontFamilies: { type: 'array', items: {} },
          fontSizes: { type: 'array', items: {} },
          spacingScale: { type: 'array', items: {} },
          borderRadius: { type: 'array', items: {} },
          shadows: { type: 'array', items: {} },
          components: {}
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
    const { designSystemId } = request.params as { designSystemId: string }
    const data = request.body as Partial<z.infer<typeof designSystemSchema>>
    const designSystem = await designSystemService.updateDesignSystem(designSystemId, data)
    reply.send({ success: true, data: designSystem })
  })

  // POST /api/v1/design-systems/:designSystemId/apply
  fastify.post('/:designSystemId/apply', {
    preHandler: [authenticate],
    schema: {
      description: 'Apply a design system to a website',
      tags: ['Design Systems'],
      params: {
        type: 'object',
        required: ['designSystemId'],
        properties: { designSystemId: { type: 'string' } }
      },
      body: {
        type: 'object',
        required: ['websiteId'],
        properties: {
          websiteId: { type: 'string' }
        },
        additionalProperties: false
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
    const { designSystemId } = request.params as { designSystemId: string }
    const { websiteId } = request.body as { websiteId: string }
    await designSystemService.applyDesignSystem(designSystemId, websiteId)
    reply.send({ success: true })
  })
}
