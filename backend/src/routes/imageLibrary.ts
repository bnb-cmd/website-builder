import { FastifyPluginAsync } from 'fastify'
import { imageLibraryService } from '@/services/imageLibraryService'
import { authenticate } from '@/middleware/auth'
import { z } from 'zod'

const addImageSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()),
  url: z.string().url(),
  thumbnail: z.string().url(),
  width: z.number().positive(),
  height: z.number().positive(),
  source: z.string().min(1),
  license: z.string().min(1),
  isPremium: z.boolean().optional()
})

const imageLibraryRoutes: FastifyPluginAsync = async (fastify) => {
  // Get images
  fastify.get<{
    Querystring: {
      category?: string
      tags?: string
      orientation?: string
      color?: string
      isPremium?: string
      search?: string
      page?: string
      limit?: string
    }
  }>('/images', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          tags: { type: 'string' },
          orientation: { type: 'string' },
          color: { type: 'string' },
          isPremium: { type: 'string' },
          search: { type: 'string' },
          page: { type: 'string' },
          limit: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { category, tags, orientation, color, isPremium, search, page, limit } = request.query as any

      const result = await imageLibraryService.getImages({
        category,
        tags: tags ? tags.split(',') : undefined,
        orientation: orientation as any,
        color,
        isPremium: isPremium ? isPremium === 'true' : undefined,
        search
      }, page ? parseInt(page) : 1, limit ? parseInt(limit) : 20)

      return reply.send({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'IMAGES_RETRIEVAL_FAILED' }
      })
    }
  })

  // Add image
  fastify.post<{
    Body: any
  }>('/images', {
    preHandler: [authenticate],
    schema: {
      body: {
        type: 'object',
        required: ['url', 'title', 'category'],
        properties: {
          url: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          orientation: { type: 'string', enum: ['landscape', 'portrait', 'square'] },
          color: { type: 'string' },
          isPremium: { type: 'boolean' },
          metadata: { type: 'object' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const image = await imageLibraryService.addImage(request.body as any)

      return reply.code(201).send({
        success: true,
        data: { image },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'IMAGE_ADDITION_FAILED' }
      })
    }
  })

  // Get image by ID
  fastify.get<{
    Params: { id: string }
  }>('/images/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const image = await imageLibraryService.findById(id)

      if (!image) {
        return reply.code(404).send({
          success: false,
          error: { message: 'Image not found', code: 'IMAGE_NOT_FOUND' }
        })
      }

      return reply.send({
        success: true,
        data: { image },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'IMAGE_RETRIEVAL_FAILED' }
      })
    }
  })

  // Update image
  fastify.put<{
    Params: { id: string }
    Body: any
  }>('/images/:id', {
    preHandler: [authenticate],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 1 },
          category: { type: 'string', minLength: 1 },
          tags: { type: 'array', items: { type: 'string' } },
          license: { type: 'string', minLength: 1 },
          isPremium: { type: 'boolean' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const image = await imageLibraryService.updateImage(id, request.body as any)

      return reply.send({
        success: true,
        data: { image },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'IMAGE_UPDATE_FAILED' }
      })
    }
  })

  // Delete image
  fastify.delete<{
    Params: { id: string }
  }>('/images/:id', {
    preHandler: [authenticate],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const success = await imageLibraryService.deleteImage(id)

      return reply.send({
        success,
        message: success ? 'Image deleted successfully' : 'Failed to delete image',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'IMAGE_DELETE_FAILED' }
      })
    }
  })

  // Increment download count
  fastify.post<{
    Params: { id: string }
  }>('/images/:id/download', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      await imageLibraryService.incrementDownloadCount(id)

      return reply.send({
        success: true,
        message: 'Download count incremented',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'DOWNLOAD_COUNT_UPDATE_FAILED' }
      })
    }
  })

  // Get categories
  fastify.get('/images/categories', async (request, reply) => {
    try {
      const categories = await imageLibraryService.getCategories()

      return reply.send({
        success: true,
        data: { categories },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'CATEGORIES_RETRIEVAL_FAILED' }
      })
    }
  })

  // Get popular images
  fastify.get<{
    Querystring: { limit?: string }
  }>('/images/popular', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { limit } = request.query as { limit?: string }

    try {
      const images = await imageLibraryService.getPopularImages(limit ? parseInt(limit) : 10)

      return reply.send({
        success: true,
        data: { images },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'POPULAR_IMAGES_RETRIEVAL_FAILED' }
      })
    }
  })

  // Get recent images
  fastify.get<{
    Querystring: { limit?: string }
  }>('/images/recent', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { limit } = request.query as { limit?: string }

    try {
      const images = await imageLibraryService.getRecentImages(limit ? parseInt(limit) : 10)

      return reply.send({
        success: true,
        data: { images },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'RECENT_IMAGES_RETRIEVAL_FAILED' }
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
  }>('/images/upload/cloudinary', {
    preHandler: [authenticate],
    schema: {
      body: {
        type: 'object',
        required: ['file'],
        properties: {
          file: { type: 'string' },
          folder: { type: 'string' },
          publicId: { type: 'string' },
          transformation: { type: 'object' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { file, folder, publicId, transformation } = request.body as any

      const result = await imageLibraryService.uploadImageToCloudinary(file, {
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

  // Generate optimized URL
  fastify.post<{
    Body: {
      publicId: string
      width?: number
      height?: number
      quality?: string
      format?: string
    }
  }>('/images/cloudinary/optimize', {
    preHandler: [authenticate],
    schema: {
      body: {
        type: 'object',
        required: ['publicId'],
        properties: {
          publicId: { type: 'string' },
          width: { type: 'number', minimum: 1 },
          height: { type: 'number', minimum: 1 },
          quality: { type: 'string' },
          format: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { publicId, width, height, quality, format } = request.body as any

      const url = await imageLibraryService.generateOptimizedUrl(publicId, {
        width,
        height,
        quality,
        format
      })

      return reply.send({
        success: true,
        data: { url },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'CLOUDINARY_OPTIMIZATION_FAILED' }
      })
    }
  })
}

export default imageLibraryRoutes