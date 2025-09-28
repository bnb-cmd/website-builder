import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { MediaService } from '@/services/mediaService'
import { authenticate, requireOwnership } from '@/middleware/auth'

const mediaAssetSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['IMAGE', 'VIDEO', 'AUDIO', 'GIF', 'SVG', 'PDF']),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  size: z.number().min(0),
  duration: z.number().min(0).optional(),
  width: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  metadata: z.any().optional(),
  tags: z.array(z.string()).optional(),
  aiGenerated: z.boolean().optional(),
  aiPrompt: z.string().optional(),
})

const videoProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  resolution: z.string().optional(),
  frameRate: z.number().min(1).max(120).optional(),
  timeline: z.any().optional(),
  exportSettings: z.any().optional(),
})

const videoClipSchema = z.object({
  name: z.string().min(1).max(100),
  assetId: z.string().optional(),
  startTime: z.number().min(0).optional(),
  endTime: z.number().min(0).optional(),
  position: z.number().min(0).optional(),
  effects: z.any().optional(),
  filters: z.any().optional(),
  transform: z.any().optional(),
})

export async function mediaRoutes(fastify: FastifyInstance) {
  const mediaService = new MediaService()

  // POST /api/v1/media/:websiteId/assets
  fastify.post('/:websiteId/assets', {
    preHandler: [authenticate, requireOwnership('websiteId')],
    schema: {
      description: 'Upload a media asset',
      tags: ['Media'],
      params: {
        type: 'object',
        required: ['websiteId'],
        properties: { websiteId: { type: 'string' } }
      },
      body: {
        type: 'object',
        required: ['name','type','url','size'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          type: { type: 'string', enum: ['IMAGE','VIDEO','AUDIO','GIF','SVG','PDF'] },
          url: { type: 'string' },
          thumbnailUrl: { type: 'string' },
          size: { type: 'number', minimum: 0 },
          duration: { type: 'number', minimum: 0 },
          width: { type: 'number', minimum: 0 },
          height: { type: 'number', minimum: 0 },
          metadata: {},
          tags: { type: 'array', items: { type: 'string' } },
          aiGenerated: { type: 'boolean' },
          aiPrompt: { type: 'string' }
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
    const data = request.body as z.infer<typeof mediaAssetSchema>
    const userId = (request as any).user.id
    const asset = await mediaService.createMediaAsset(websiteId, userId, data)
    reply.send({ success: true, data: asset })
  })

  // GET /api/v1/media/:websiteId/assets
  fastify.get('/:websiteId/assets', {
    preHandler: [authenticate, requireOwnership('websiteId')],
    schema: {
      description: 'Get media assets for a website',
      tags: ['Media'],
      params: {
        type: 'object',
        required: ['websiteId'],
        properties: { websiteId: { type: 'string' } }
      },
      querystring: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['IMAGE','VIDEO','AUDIO','GIF','SVG','PDF'] }
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
    const { websiteId } = request.params as { websiteId: string }
    const { type } = request.query as { type?: any }
    const assets = await mediaService.getMediaAssets(websiteId, type)
    reply.send({ success: true, data: assets })
  })

  // POST /api/v1/media/:websiteId/ai-generate
  fastify.post('/:websiteId/ai-generate', {
    preHandler: [authenticate, requireOwnership('websiteId')],
    schema: {
      description: 'Generate AI media content',
      tags: ['Media'],
      params: {
        type: 'object',
        required: ['websiteId'],
        properties: { websiteId: { type: 'string' } }
      },
      body: {
        type: 'object',
        required: ['prompt','type'],
        properties: {
          prompt: { type: 'string', minLength: 1, maxLength: 1000 },
          type: { type: 'string', enum: ['IMAGE','VIDEO','AUDIO'] }
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
    const { prompt, type } = request.body as { prompt: string; type: any }
    const userId = (request as any).user.id
    const asset = await mediaService.generateAIMedia(prompt, type, websiteId, userId)
    reply.send({ success: true, data: asset })
  })

  // POST /api/v1/media/:websiteId/video-projects
  fastify.post('/:websiteId/video-projects', {
    preHandler: [authenticate, requireOwnership('websiteId')],
    schema: {
      description: 'Create a new video project',
      tags: ['Media'],
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
          resolution: { type: 'string' },
          frameRate: { type: 'number', minimum: 1, maximum: 120 },
          timeline: {},
          exportSettings: {}
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
    const data = request.body as z.infer<typeof videoProjectSchema>
    const userId = (request as any).user.id
    const project = await mediaService.createVideoProject(websiteId, userId, data)
    reply.send({ success: true, data: project })
  })

  // GET /api/v1/media/:websiteId/video-projects
  fastify.get('/:websiteId/video-projects', {
    preHandler: [authenticate, requireOwnership('websiteId')],
    schema: {
      description: 'Get video projects for a website',
      tags: ['Media'],
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
    const projects = await mediaService.getVideoProjects(websiteId)
    reply.send({ success: true, data: projects })
  })

  // PUT /api/v1/media/video-projects/:projectId
  fastify.put('/video-projects/:projectId', {
    preHandler: [authenticate],
    schema: {
      description: 'Update a video project',
      tags: ['Media'],
      params: {
        type: 'object',
        required: ['projectId'],
        properties: { projectId: { type: 'string' } }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          description: { type: 'string', maxLength: 500 },
          resolution: { type: 'string' },
          frameRate: { type: 'number', minimum: 1, maximum: 120 },
          timeline: {},
          exportSettings: {}
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
    const { projectId } = request.params as { projectId: string }
    const data = request.body as Partial<z.infer<typeof videoProjectSchema>>
    const project = await mediaService.updateVideoProject(projectId, data)
    reply.send({ success: true, data: project })
  })

  // POST /api/v1/media/video-projects/:projectId/clips
  fastify.post('/video-projects/:projectId/clips', {
    preHandler: [authenticate],
    schema: {
      description: 'Add a clip to a video project',
      tags: ['Media'],
      params: {
        type: 'object',
        required: ['projectId'],
        properties: { projectId: { type: 'string' } }
      },
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          assetId: { type: 'string' },
          startTime: { type: 'number', minimum: 0 },
          endTime: { type: 'number', minimum: 0 },
          position: { type: 'number', minimum: 0 },
          effects: {},
          filters: {},
          transform: {}
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
    const { projectId } = request.params as { projectId: string }
    const data = request.body as z.infer<typeof videoClipSchema>
    const clip = await mediaService.addVideoClip(projectId, data)
    reply.send({ success: true, data: clip })
  })

  // PUT /api/v1/media/video-clips/:clipId
  fastify.put('/video-clips/:clipId', {
    preHandler: [authenticate],
    schema: {
      description: 'Update a video clip',
      tags: ['Media'],
      params: {
        type: 'object',
        required: ['clipId'],
        properties: { clipId: { type: 'string' } }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1, maxLength: 100 },
          assetId: { type: 'string' },
          startTime: { type: 'number', minimum: 0 },
          endTime: { type: 'number', minimum: 0 },
          position: { type: 'number', minimum: 0 },
          effects: {},
          filters: {},
          transform: {}
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
    const { clipId } = request.params as { clipId: string }
    const data = request.body as Partial<z.infer<typeof videoClipSchema>>
    const clip = await mediaService.updateVideoClip(clipId, data)
    reply.send({ success: true, data: clip })
  })

  // DELETE /api/v1/media/video-clips/:clipId
  fastify.delete('/video-clips/:clipId', {
    preHandler: [authenticate],
    schema: {
      description: 'Delete a video clip',
      tags: ['Media'],
      params: {
        type: 'object',
        required: ['clipId'],
        properties: { clipId: { type: 'string' } }
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
    const { clipId } = request.params as { clipId: string }
    await mediaService.deleteVideoClip(clipId)
    reply.send({ success: true })
  })

  // POST /api/v1/media/video-projects/:projectId/export
  fastify.post('/video-projects/:projectId/export', {
    preHandler: [authenticate],
    schema: {
      description: 'Export a video project',
      tags: ['Media'],
      params: {
        type: 'object',
        required: ['projectId'],
        properties: { projectId: { type: 'string' } }
      },
      body: {
        type: 'object',
        required: ['settings'],
        properties: {
          settings: {}
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
    const { projectId } = request.params as { projectId: string }
    const { settings } = request.body as { settings: any }
    const result = await mediaService.exportVideo(projectId, settings)
    reply.send({ success: true, data: result })
  })
}
