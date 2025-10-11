import { FastifyPluginAsync } from 'fastify'
import { mediaService } from '@/services/mediaService'
import { authenticate } from '@/middleware/auth'
import { z } from 'zod'

const createMediaAssetSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['IMAGE', 'VIDEO', 'AUDIO', 'GIF', 'SVG', 'PDF']),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  size: z.number().positive(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  duration: z.number().positive().optional(),
  metadata: z.any().optional(),
  tags: z.array(z.string()).optional(),
  aiGenerated: z.boolean().optional(),
  aiPrompt: z.string().optional()
})

const createVideoProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  timeline: z.any().optional(),
  resolution: z.string().optional(),
  frameRate: z.number().positive().optional(),
  exportSettings: z.any().optional()
})

const createVideoClipSchema = z.object({
  name: z.string().min(1),
  assetId: z.string().cuid().optional(),
  startTime: z.number().min(0).optional(),
  endTime: z.number().min(0).optional(),
  position: z.number().min(0).optional(),
  effects: z.any().optional(),
  filters: z.any().optional(),
  transform: z.any().optional()
})

const mediaRoutes: FastifyPluginAsync = async (fastify) => {
  // Create media asset
  fastify.post<{
    Params: { websiteId: string }
    Body: any
  }>('/media/:websiteId/assets', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ websiteId: z.string().cuid() }),
      body: createMediaAssetSchema
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
      const asset = await mediaService.createMediaAsset(websiteId, userId, {
        name: (request.body as any).name,
        type: (request.body as any).type,
        url: (request.body as any).url,
        thumbnailUrl: (request.body as any).thumbnailUrl,
        size: (request.body as any).size,
        width: (request.body as any).width,
        height: (request.body as any).height,
        duration: (request.body as any).duration,
        metadata: (request.body as any).metadata,
        tags: (request.body as any).tags,
        aiGenerated: (request.body as any).aiGenerated,
        aiPrompt: (request.body as any).aiPrompt
      })

      return reply.code(201).send({
        success: true,
        data: { asset },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'MEDIA_ASSET_CREATION_FAILED' }
      })
    }
  })

  // Get media assets
  fastify.get<{
    Params: { websiteId: string }
    Querystring: {
      type?: string
      page?: string
      limit?: string
    }
  }>('/media/:websiteId/assets', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ websiteId: z.string().cuid() }),
      querystring: z.object({
        type: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional()
      })
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }
    const { type, page, limit } = request.query as any

    try {
      const assets = await mediaService.getMediaAssets(websiteId, {
        type: type as any,
        limit: limit ? parseInt(limit) : 20,
        offset: page ? (parseInt(page) - 1) * (limit ? parseInt(limit) : 20) : 0
      } as any)

      return reply.send({
        success: true,
        data: { assets },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'MEDIA_ASSETS_RETRIEVAL_FAILED' }
      })
    }
  })

  // Get media asset by ID
  fastify.get<{
    Params: { id: string }
  }>('/media/assets/:id', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ id: z.string().cuid() })
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const asset = await mediaService.findById(id)

      if (!asset) {
        return reply.code(404).send({
          success: false,
          error: { message: 'Media asset not found', code: 'MEDIA_ASSET_NOT_FOUND' }
        })
      }

      return reply.send({
        success: true,
        data: { asset },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'MEDIA_ASSET_RETRIEVAL_FAILED' }
      })
    }
  })

  // Update media asset
  fastify.put<{
    Params: { id: string }
    Body: any
  }>('/media/assets/:id', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ id: z.string().cuid() }),
      body: z.object({
        name: z.string().min(1).optional(),
        tags: z.array(z.string()).optional(),
        metadata: z.any().optional()
      })
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const asset = await mediaService.update(id, request.body as any)

      return reply.send({
        success: true,
        data: { asset },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'MEDIA_ASSET_UPDATE_FAILED' }
      })
    }
  })

  // Delete media asset
  fastify.delete<{
    Params: { id: string }
  }>('/media/assets/:id', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ id: z.string().cuid() })
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const success = await mediaService.delete(id)

      return reply.send({
        success,
        message: success ? 'Media asset deleted successfully' : 'Failed to delete media asset',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'MEDIA_ASSET_DELETE_FAILED' }
      })
    }
  })

  // Create video project
  fastify.post<{
    Params: { websiteId: string }
    Body: any
  }>('/media/:websiteId/video-projects', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ websiteId: z.string().cuid() }),
      body: createVideoProjectSchema
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
      const project = await mediaService.createVideoProject(websiteId, userId, {
        name: (request.body as any).name,
        description: (request.body as any).description,
        timeline: (request.body as any).timeline,
        resolution: (request.body as any).resolution,
        frameRate: (request.body as any).frameRate,
        exportSettings: (request.body as any).exportSettings
      })

      return reply.code(201).send({
        success: true,
        data: { project },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'VIDEO_PROJECT_CREATION_FAILED' }
      })
    }
  })

  // Add video clip
  fastify.post<{
    Params: { projectId: string }
    Body: any
  }>('/media/video-projects/:projectId/clips', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ projectId: z.string().cuid() }),
      body: createVideoClipSchema
    }
  }, async (request, reply) => {
    const { projectId } = request.params as { projectId: string }

    try {
      const clip = await mediaService.addVideoClip(projectId, {
        name: (request.body as any).name,
        assetId: (request.body as any).assetId,
        startTime: (request.body as any).startTime,
        endTime: (request.body as any).endTime,
        position: (request.body as any).position,
        effects: (request.body as any).effects,
        filters: (request.body as any).filters,
        transform: (request.body as any).transform
      })

      return reply.code(201).send({
        success: true,
        data: { clip },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'VIDEO_CLIP_CREATION_FAILED' }
      })
    }
  })

  // Upload to Cloudinary
  fastify.post<{
    Body: {
      file: string
      folder?: string
      publicId?: string
      transformation?: any
    }
  }>('/media/upload/cloudinary', {
    preHandler: [authenticate],
    schema: {
      body: z.object({
        file: z.string(),
        folder: z.string().optional(),
        publicId: z.string().optional(),
        transformation: z.any().optional()
      })
    }
  }, async (request, reply) => {
    try {
      const { file, folder, publicId, transformation } = request.body as any

      const result = await mediaService.uploadToCloudinary(file, {
        folder,
        publicId,
        transformation
      })

      return reply.send({
        success: true,
        data: { result },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'CLOUDINARY_UPLOAD_FAILED' }
      })
    }
  })

  // Generate Cloudinary URL
  fastify.post<{
    Body: {
      publicId: string
      transformations?: any
    }
  }>('/media/cloudinary/url', {
    preHandler: [authenticate],
    schema: {
      body: z.object({
        publicId: z.string(),
        transformations: z.any().optional()
      })
    }
  }, async (request, reply) => {
    try {
      const { publicId, transformations } = request.body as any

      const url = await mediaService.generateCloudinaryUrl(publicId, transformations)

      return reply.send({
        success: true,
        data: { url },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'CLOUDINARY_URL_GENERATION_FAILED' }
      })
    }
  })
}

export default mediaRoutes