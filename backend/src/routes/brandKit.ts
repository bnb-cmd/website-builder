import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { authenticate } from '../middleware/auth'
import { BrandKitService } from '../services/brandKitService'

// Schemas
const createBrandKitSchema = {
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    websiteId: z.string().optional(),
    inheritsFrom: z.string().optional(),
    logo: z.object({
      primary: z.string().url().optional(),
      secondary: z.string().url().optional(),
      favicon: z.string().url().optional()
    }).optional(),
    colors: z.object({
      primary: z.string().optional(),
      secondary: z.string().optional(),
      accent: z.string().optional(),
      neutral: z.array(z.string()).optional(),
      success: z.string().optional(),
      warning: z.string().optional(),
      error: z.string().optional()
    }).optional(),
    typography: z.object({
      heading: z.string().optional(),
      body: z.string().optional(),
      accent: z.string().optional(),
      sizes: z.object({
        h1: z.string().optional(),
        h2: z.string().optional(),
        h3: z.string().optional(),
        h4: z.string().optional(),
        h5: z.string().optional(),
        h6: z.string().optional(),
        body: z.string().optional(),
        small: z.string().optional()
      }).optional()
    }).optional(),
    imagery: z.object({
      style: z.string().optional(),
      mood: z.string().optional(),
      templates: z.array(z.string()).optional()
    }).optional(),
    guidelines: z.object({
      logoUsage: z.string().optional(),
      colorUsage: z.string().optional(),
      spacing: z.string().optional()
    }).optional()
  })
}

const updateBrandKitSchema = {
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    logo: z.object({
      primary: z.string().url().optional(),
      secondary: z.string().url().optional(),
      favicon: z.string().url().optional()
    }).optional(),
    colors: z.object({
      primary: z.string().optional(),
      secondary: z.string().optional(),
      accent: z.string().optional(),
      neutral: z.array(z.string()).optional(),
      success: z.string().optional(),
      warning: z.string().optional(),
      error: z.string().optional()
    }).optional(),
    typography: z.object({
      heading: z.string().optional(),
      body: z.string().optional(),
      accent: z.string().optional(),
      sizes: z.object({
        h1: z.string().optional(),
        h2: z.string().optional(),
        h3: z.string().optional(),
        h4: z.string().optional(),
        h5: z.string().optional(),
        h6: z.string().optional(),
        body: z.string().optional(),
        small: z.string().optional()
      }).optional()
    }).optional(),
    imagery: z.object({
      style: z.string().optional(),
      mood: z.string().optional(),
      templates: z.array(z.string()).optional()
    }).optional(),
    guidelines: z.object({
      logoUsage: z.string().optional(),
      colorUsage: z.string().optional(),
      spacing: z.string().optional()
    }).optional()
  })
}

const brandKitParamsSchema = {
  params: z.object({
    id: z.string()
  })
}

export async function brandKitRoutes(fastify: FastifyInstance) {
  const brandKitService = new BrandKitService()

  // Get user's brand kits
  fastify.get('/api/brand-kits', { preHandler: authenticate }, async (request, reply) => {
    try {
      const userId = request.user.id
      const brandKits = await brandKitService.getUserBrandKits(userId)
      reply.send({ success: true, brandKits })
    } catch (error) {
      reply.status(500).send({ success: false, error: 'Failed to fetch brand kits' })
    }
  })

  // Get global brand kit
  fastify.get('/api/brand-kits/global', { preHandler: authenticate }, async (request, reply) => {
    try {
      const userId = request.user.id
      const globalBrandKit = await brandKitService.getGlobalBrandKit(userId)
      reply.send({ success: true, brandKit: globalBrandKit })
    } catch (error) {
      reply.status(500).send({ success: false, error: 'Failed to fetch global brand kit' })
    }
  })

  // Get specific brand kit
  fastify.get('/api/brand-kits/:id', { 
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
  fastify.post('/api/brand-kits', { 
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
  fastify.put('/api/brand-kits/:id', { 
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
  fastify.delete('/api/brand-kits/:id', { 
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
  fastify.post('/api/brand-kits/:id/duplicate', { 
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
  fastify.post('/api/brand-kits/:id/apply', { 
    preHandler: authenticate,
    schema: {
      params: brandKitParamsSchema.params,
      body: z.object({
        websiteId: z.string()
      })
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
  fastify.get('/api/brand-kits/:id/export', { 
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
  fastify.post('/api/brand-kits/:id/assets', { 
    preHandler: authenticate,
    schema: {
      params: brandKitParamsSchema.params,
      body: z.object({
        type: z.enum(['logo', 'image', 'icon']),
        file: z.string(), // Base64 encoded file
        filename: z.string(),
        mimeType: z.string()
      })
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
  fastify.get('/api/brand-kits/:id/stats', { 
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
