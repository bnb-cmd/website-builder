import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { PwaService } from '@/services/pwaService'
import { WebsiteService } from '@/services/websiteService'
import { authenticate, requireOwnership } from '@/middleware/auth'

const pwaSettingsSchema = z.object({
  name: z.string().min(1).max(100),
  shortName: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
  themeColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  display: z.enum(['standalone', 'fullscreen', 'minimal-ui']).optional(),
  orientation: z.enum(['portrait', 'landscape']).optional(),
  startUrl: z.string().optional(),
  icon512: z.string().url().optional(),
  icon192: z.string().url().optional(),
})

export async function pwaRoutes(fastify: FastifyInstance) {
  const pwaService = new PwaService()
  const websiteService = new WebsiteService()

  fastify.post('/:websiteId/pwa', {
    preHandler: [authenticate, requireOwnership('websiteId')],
    schema: {
      params: {
        type: 'object',
        required: ['websiteId'],
        properties: {
          websiteId: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          shortName: { type: 'string', minLength: 1, maxLength: 50 },
          description: { type: 'string', maxLength: 500 },
          themeColor: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' },
          backgroundColor: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' },
          display: { type: 'string', enum: ['standalone', 'fullscreen', 'minimal-ui'] },
          orientation: { type: 'string', enum: ['portrait', 'landscape'] },
          startUrl: { type: 'string' },
          icon512: { type: 'string' },
          icon192: { type: 'string' }
        },
        additionalProperties: false
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }
    const settings = request.body as z.infer<typeof pwaSettingsSchema>
    const pwaSettings = await pwaService.createOrUpdate(websiteId, settings)
    reply.send({ success: true, data: pwaSettings })
  })

  fastify.get('/:websiteId/manifest.json', {
    schema: {
      params: {
        type: 'object',
        required: ['websiteId'],
        properties: {
          websiteId: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }
    const website = await websiteService.findById(websiteId)
    const pwaSettings = await pwaService.getByWebsiteId(websiteId)
    
    if (!website || !pwaSettings) {
      reply.status(404).send({ error: 'Website or PWA settings not found' })
      return
    }

    const manifest = pwaService.generateManifest(pwaSettings, website)
    reply.header('Content-Type', 'application/manifest+json').send(manifest)
  })

  fastify.get('/:websiteId/sw.js', {
    schema: {
      params: {
        type: 'object',
        required: ['websiteId'],
        properties: {
          websiteId: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }
    const serviceWorker = pwaService.generateServiceWorker(websiteId)
    reply.header('Content-Type', 'application/javascript').send(serviceWorker)
  })
}
