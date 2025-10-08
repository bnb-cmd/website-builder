import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { ImageLibraryService } from '../services/imageLibraryService'
import { authenticate } from '../middleware/auth'

const imageLibraryService = new ImageLibraryService()

// Validation schemas
const imageSearchSchema = z.object({
  category: z.string().optional(),
  tags: z.string().optional(),
  isPremium: z.boolean().optional(),
  source: z.string().optional(),
  orientation: z.enum(['landscape', 'portrait', 'square']).optional(),
  color: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
})

const customImageSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.string().min(1),
  tags: z.array(z.string()),
  url: z.string().url(),
  thumbnail: z.string().url(),
  width: z.number().min(1),
  height: z.number().min(1),
  source: z.string().default('custom'),
  license: z.string().default('free'),
  isPremium: z.boolean().default(false)
})

export async function imageLibraryRoutes(fastify: FastifyInstance) {
  // GET /api/v1/image-library - Browse all images
  fastify.get('/image-library', {
    schema: {
      description: 'Browse all images in the library',
      tags: ['Image Library'],
      querystring: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          tags: { type: 'string' },
          isPremium: { type: 'boolean' },
          source: { type: 'string' },
          orientation: { type: 'string', enum: ['landscape', 'portrait', 'square'] },
          color: { type: 'string' },
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 20 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                images: { type: 'array' },
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                hasMore: { type: 'boolean' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const query = request.query as any
      const filters = {
        category: query.category,
        tags: query.tags ? query.tags.split(',') : undefined,
        isPremium: query.isPremium,
        source: query.source,
        orientation: query.orientation,
        color: query.color
      }
      
      const result = await imageLibraryService.getImages(filters, query.page, query.limit)
      
      reply.send({
        success: true,
        data: result
      })
    } catch (error: any) {
      reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'FETCH_IMAGES_FAILED' }
      })
    }
  })

  // GET /api/v1/image-library/search - Search images
  fastify.get('/image-library/search', {
    schema: {
      description: 'Search images by query',
      tags: ['Image Library'],
      querystring: {
        type: 'object',
        required: ['q'],
        properties: {
          q: { type: 'string', minLength: 1 },
          category: { type: 'string' },
          tags: { type: 'string' },
          isPremium: { type: 'boolean' },
          source: { type: 'string' },
          orientation: { type: 'string', enum: ['landscape', 'portrait', 'square'] },
          color: { type: 'string' },
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 20 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                images: { type: 'array' },
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                hasMore: { type: 'boolean' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const query = request.query as any
      const filters = {
        category: query.category,
        tags: query.tags ? query.tags.split(',') : undefined,
        isPremium: query.isPremium,
        source: query.source,
        orientation: query.orientation,
        color: query.color
      }
      
      const result = await imageLibraryService.searchImages(query.q, filters, query.page, query.limit)
      
      reply.send({
        success: true,
        data: result
      })
    } catch (error: any) {
      reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'SEARCH_IMAGES_FAILED' }
      })
    }
  })

  // GET /api/v1/image-library/categories - Get categories
  fastify.get('/image-library/categories', {
    schema: {
      description: 'Get all available image categories',
      tags: ['Image Library'],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const categories = await imageLibraryService.getCategories()
      
      reply.send({
        success: true,
        data: categories
      })
    } catch (error: any) {
      reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'FETCH_CATEGORIES_FAILED' }
      })
    }
  })

  // GET /api/v1/image-library/category/:category - Get images by category
  fastify.get('/image-library/category/:category', {
    schema: {
      description: 'Get images by specific category',
      tags: ['Image Library'],
      params: {
        type: 'object',
        required: ['category'],
        properties: {
          category: { type: 'string' }
        }
      },
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'number', minimum: 1, maximum: 100, default: 50 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { category } = request.params as { category: string }
      const { limit } = request.query as { limit?: number }
      
      const images = await imageLibraryService.getImagesByCategory(category, limit)
      
      reply.send({
        success: true,
        data: images
      })
    } catch (error: any) {
      reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'FETCH_CATEGORY_IMAGES_FAILED' }
      })
    }
  })

  // GET /api/v1/image-library/hero-images - Get hero images
  fastify.get('/image-library/hero-images', {
    schema: {
      description: 'Get hero background images',
      tags: ['Image Library'],
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'number', minimum: 1, maximum: 100, default: 30 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { limit } = request.query as { limit?: number }
      
      const images = await imageLibraryService.getHeroImages(limit)
      
      reply.send({
        success: true,
        data: images
      })
    } catch (error: any) {
      reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'FETCH_HERO_IMAGES_FAILED' }
      })
    }
  })

  // GET /api/v1/image-library/popular - Get popular images
  fastify.get('/image-library/popular', {
    schema: {
      description: 'Get most downloaded images',
      tags: ['Image Library'],
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'number', minimum: 1, maximum: 100, default: 20 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { limit } = request.query as { limit?: number }
      
      const images = await imageLibraryService.getPopularImages(limit)
      
      reply.send({
        success: true,
        data: images
      })
    } catch (error: any) {
      reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'FETCH_POPULAR_IMAGES_FAILED' }
      })
    }
  })

  // GET /api/v1/image-library/:id - Get specific image
  fastify.get('/image-library/:id', {
    schema: {
      description: 'Get specific image by ID',
      tags: ['Image Library'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
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
    try {
      const { id } = request.params as { id: string }
      
      const image = await imageLibraryService.getImageById(id)
      
      if (!image) {
        return reply.code(404).send({
          success: false,
          error: { message: 'Image not found', code: 'IMAGE_NOT_FOUND' }
        })
      }
      
      reply.send({
        success: true,
        data: image
      })
    } catch (error: any) {
      reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'FETCH_IMAGE_FAILED' }
      })
    }
  })

  // POST /api/v1/image-library/custom - Upload custom image
  fastify.post('/image-library/custom', {
    preHandler: [authenticate],
    schema: {
      description: 'Add custom image to library',
      tags: ['Image Library'],
      body: customImageSchema,
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
    try {
      const imageData = request.body as z.infer<typeof customImageSchema>
      const userId = (request as any).user.id
      
      const imageId = await imageLibraryService.addCustomImage(userId, imageData)
      
      reply.send({
        success: true,
        data: { id: imageId }
      })
    } catch (error: any) {
      reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'ADD_CUSTOM_IMAGE_FAILED' }
      })
    }
  })

  // POST /api/v1/image-library/:id/download - Track download
  fastify.post('/image-library/:id/download', {
    schema: {
      description: 'Track image download',
      tags: ['Image Library'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      await imageLibraryService.incrementDownloadCount(id)
      
      reply.send({
        success: true
      })
    } catch (error: any) {
      reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'TRACK_DOWNLOAD_FAILED' }
      })
    }
  })

  // DELETE /api/v1/image-library/:id - Delete image (admin only)
  fastify.delete('/image-library/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Delete image from library',
      tags: ['Image Library'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const user = (request as any).user
      
      // Check if user is admin
      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        return reply.code(403).send({
          success: false,
          error: { message: 'Insufficient permissions', code: 'INSUFFICIENT_PERMISSIONS' }
        })
      }
      
      await imageLibraryService.deleteImage(id)
      
      reply.send({
        success: true
      })
    } catch (error: any) {
      reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'DELETE_IMAGE_FAILED' }
      })
    }
  })
}
