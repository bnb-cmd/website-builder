import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { authenticate } from '../middleware/auth'
import { BrandKitService } from '../services/brandKitService'

// Schemas
const createBrandKitSchema = {
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string', minLength: 1 },
      description: { type: 'string' },
      websiteId: { type: 'string' },
      inheritsFrom: { type: 'string' },
      logo: {
        type: 'object',
        properties: {
          primary: { type: 'string', format: 'uri' },
          secondary: { type: 'string', format: 'uri' },
          favicon: { type: 'string', format: 'uri' }
        }
      },
      colors: {
        type: 'object',
        properties: {
          primary: { type: 'string' },
          secondary: { type: 'string' },
          accent: { type: 'string' },
          neutral: { type: 'array', items: { type: 'string' } },
          success: { type: 'string' },
          warning: { type: 'string' },
          error: { type: 'string' }
        }
      },
      typography: {
        type: 'object',
        properties: {
          heading: { type: 'string' },
          body: { type: 'string' },
          accent: { type: 'string' },
          sizes: {
            type: 'object',
            properties: {
              h1: { type: 'string' },
              h2: { type: 'string' },
              h3: { type: 'string' },
              h4: { type: 'string' },
              h5: { type: 'string' },
              h6: { type: 'string' },
              body: { type: 'string' },
              small: { type: 'string' }
            }
          }
        }
      },
      imagery: {
        type: 'object',
        properties: {
          style: { type: 'string' },
          mood: { type: 'string' },
          templates: { type: 'array', items: { type: 'string' } }
        }
      },
      guidelines: {
        type: 'object',
        properties: {
          logoUsage: { type: 'string' },
          colorUsage: { type: 'string' },
          spacing: { type: 'string' }
        }
      }
    }
  }
}

const updateBrandKitSchema = {
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
      description: { type: 'string' },
      logo: {
        type: 'object',
        properties: {
          primary: { type: 'string', format: 'uri' },
          secondary: { type: 'string', format: 'uri' },
          favicon: { type: 'string', format: 'uri' }
        }
      },
      colors: {
        type: 'object',
        properties: {
          primary: { type: 'string' },
          secondary: { type: 'string' },
          accent: { type: 'string' },
          neutral: { type: 'array', items: { type: 'string' } },
          success: { type: 'string' },
          warning: { type: 'string' },
          error: { type: 'string' }
        }
      },
      typography: {
        type: 'object',
        properties: {
          heading: { type: 'string' },
          body: { type: 'string' },
          accent: { type: 'string' },
          sizes: {
            type: 'object',
            properties: {
              h1: { type: 'string' },
              h2: { type: 'string' },
              h3: { type: 'string' },
              h4: { type: 'string' },
              h5: { type: 'string' },
              h6: { type: 'string' },
              body: { type: 'string' },
              small: { type: 'string' }
            }
          }
        }
      },
      imagery: {
        type: 'object',
        properties: {
          style: { type: 'string' },
          mood: { type: 'string' },
          templates: { type: 'array', items: { type: 'string' } }
        }
      },
      guidelines: {
        type: 'object',
        properties: {
          logoUsage: { type: 'string' },
          colorUsage: { type: 'string' },
          spacing: { type: 'string' }
        }
      }
    }
  }
}

const brandKitParamsSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
    }
  }
}

export async function brandKitRoutes(fastify: FastifyInstance) {
  const brandKitService = new BrandKitService()

  // Get user's brand kits
  fastify.get('/', { preHandler: authenticate }, async (request, reply) => {
    try {
      const userId = request.user.id
      const brandKits = await brandKitService.getUserBrandKits(userId)
      reply.send({ success: true, brandKits })
    } catch (error) {
      reply.status(500).send({ success: false, error: 'Failed to fetch brand kits' })
    }
  })

  // Get global brand kit
  fastify.get('/global', { preHandler: authenticate }, async (request, reply) => {
    try {
      const userId = request.user.id
      const globalBrandKit = await brandKitService.getGlobalBrandKit(userId)
      reply.send({ success: true, brandKit: globalBrandKit })
    } catch (error) {
      reply.status(500).send({ success: false, error: 'Failed to fetch global brand kit' })
    }
  })

  // Get specific brand kit
  fastify.get('/:id', { 
    preHandler: authenticate,
    schema: brandKitParamsSchema 
  }, async (request, reply) => {
    try {
      const userId = request.user.id
      const { id } = request.params
      const brandKit = await brandKitService.getBrandKitById(id, userId)
      
      if (!brandKit) {
        return reply.status(404).send({ success: false, error: 'Brand kit not found' })
      }
      
      reply.send({ success: true, brandKit })
    } catch (error) {
      reply.status(500).send({ success: false, error: 'Failed to fetch brand kit' })
    }
  })

  // Create brand kit
  fastify.post('/', { 
    preHandler: authenticate,
    schema: createBrandKitSchema 
  }, async (request, reply) => {
    try {
      const userId = request.user.id
      const brandKitData = request.body
      
      const brandKit = await brandKitService.createBrandKit({
        userId,
        ...brandKitData
      })
      
      reply.send({ success: true, brandKit, message: 'Brand kit created successfully' })
    } catch (error) {
      reply.status(500).send({ success: false, error: 'Failed to create brand kit' })
    }
  })

  // Update brand kit
  fastify.put('/:id', { 
    preHandler: authenticate,
    schema: updateBrandKitSchema 
  }, async (request, reply) => {
    try {
      const userId = request.user.id
      const { id } = request.params
      const updates = request.body
      
      const brandKit = await brandKitService.updateBrandKit(id, userId, updates)
      
      if (!brandKit) {
        return reply.status(404).send({ success: false, error: 'Brand kit not found' })
      }
      
      reply.send({ success: true, brandKit, message: 'Brand kit updated successfully' })
    } catch (error) {
      reply.status(500).send({ success: false, error: 'Failed to update brand kit' })
    }
  })

  // Delete brand kit
  fastify.delete('/:id', { 
    preHandler: authenticate,
    schema: brandKitParamsSchema 
  }, async (request, reply) => {
    try {
      const userId = request.user.id
      const { id } = request.params
      
      const success = await brandKitService.deleteBrandKit(id, userId)
      
      if (!success) {
        return reply.status(404).send({ success: false, error: 'Brand kit not found' })
      }
      
      reply.send({ success: true, message: 'Brand kit deleted successfully' })
    } catch (error) {
      reply.status(500).send({ success: false, error: 'Failed to delete brand kit' })
    }
  })

  // Duplicate brand kit
  fastify.post('/:id/duplicate', { 
    preHandler: authenticate,
    schema: brandKitParamsSchema 
  }, async (request, reply) => {
    try {
      const userId = request.user.id
      const { id } = request.params
      
      const duplicatedBrandKit = await brandKitService.duplicateBrandKit(id, userId)
      
      if (!duplicatedBrandKit) {
        return reply.status(404).send({ success: false, error: 'Brand kit not found' })
      }
      
      reply.send({ success: true, brandKit: duplicatedBrandKit, message: 'Brand kit duplicated successfully' })
    } catch (error) {
      reply.status(500).send({ success: false, error: 'Failed to duplicate brand kit' })
    }
  })

  // Apply brand kit to website
  fastify.post('/:id/apply', { 
    preHandler: authenticate,
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
        required: ['websiteId'],
        properties: {
          websiteId: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const userId = request.user.id
      const { id } = request.params
      const { websiteId } = request.body
      
      const success = await brandKitService.applyBrandKitToWebsite(id, websiteId, userId)
      
      if (!success) {
        return reply.status(404).send({ success: false, error: 'Brand kit or website not found' })
      }
      
      reply.send({ success: true, message: 'Brand kit applied to website successfully' })
    } catch (error) {
      reply.status(500).send({ success: false, error: 'Failed to apply brand kit to website' })
    }
  })

  // Export brand kit
  fastify.get('/:id/export', { 
    preHandler: authenticate,
    schema: brandKitParamsSchema 
  }, async (request, reply) => {
    try {
      const userId = request.user.id
      const { id } = request.params
      
      const exportData = await brandKitService.exportBrandKit(id, userId)
      
      if (!exportData) {
        return reply.status(404).send({ success: false, error: 'Brand kit not found' })
      }
      
      reply.send({ success: true, exportData })
    } catch (error) {
      reply.status(500).send({ success: false, error: 'Failed to export brand kit' })
    }
  })

  // Upload brand asset
  fastify.post('/:id/assets', { 
    preHandler: authenticate,
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
        required: ['type', 'file', 'filename', 'mimeType'],
        properties: {
          type: { type: 'string', enum: ['logo', 'image', 'icon'] },
          file: { type: 'string' },
          filename: { type: 'string' },
          mimeType: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const userId = request.user.id
      const { id } = request.params
      const { type, file, filename, mimeType } = request.body
      
      const assetUrl = await brandKitService.uploadBrandAsset(id, userId, {
        type,
        file,
        filename,
        mimeType
      })
      
      if (!assetUrl) {
        return reply.status(404).send({ success: false, error: 'Brand kit not found' })
      }
      
      reply.send({ success: true, assetUrl, message: 'Asset uploaded successfully' })
    } catch (error) {
      reply.status(500).send({ success: false, error: 'Failed to upload asset' })
    }
  })

  // Get brand kit usage statistics
  fastify.get('/:id/stats', { 
    preHandler: authenticate,
    schema: brandKitParamsSchema 
  }, async (request, reply) => {
    try {
      const userId = request.user.id
      const { id } = request.params
      
      const stats = await brandKitService.getBrandKitStats(id, userId)
      
      if (!stats) {
        return reply.status(404).send({ success: false, error: 'Brand kit not found' })
      }
      
      reply.send({ success: true, stats })
    } catch (error) {
      reply.status(500).send({ success: false, error: 'Failed to fetch brand kit stats' })
    }
  })
}
