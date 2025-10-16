import { FastifyPluginAsync } from 'fastify'
import { brandKitService } from '@/services/brandKitService'
import { authenticate } from '@/middleware/auth'
import { z } from 'zod'

const createBrandKitSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  inheritsFrom: z.string().optional(),
  isDefault: z.boolean().optional(),
  logoPrimary: z.string().optional(),
  logoSecondary: z.string().optional(),
  logoFavicon: z.string().optional(),
  logoVariations: z.string().optional(),
  colorPrimary: z.string().optional(),
  colorSecondary: z.string().optional(),
  colorAccent: z.string().optional(),
  colorNeutral: z.string().optional(),
  colorSuccess: z.string().optional(),
  colorWarning: z.string().optional(),
  colorError: z.string().optional(),
  fontHeading: z.string().optional(),
  fontBody: z.string().optional(),
  fontAccent: z.string().optional(),
  fontSizeH1: z.string().optional(),
  fontSizeH2: z.string().optional(),
  fontSizeH3: z.string().optional(),
  fontSizeH4: z.string().optional(),
  fontSizeH5: z.string().optional(),
  fontSizeH6: z.string().optional(),
  fontSizeBody: z.string().optional(),
  fontSizeSmall: z.string().optional(),
  imageStyle: z.string().optional(),
  imageMood: z.string().optional(),
  imageTemplates: z.string().optional(),
  logoUsageRules: z.string().optional(),
  colorUsageRules: z.string().optional(),
  spacingRules: z.string().optional(),
  typographyRules: z.string().optional(),
  imageGuidelines: z.string().optional()
})

const brandKitRoutes: FastifyPluginAsync = async (fastify) => {
  // Create brand kit
  fastify.post<{
    Params: { userId: string }
    Body: any
  }>('/brand-kits/:userId', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ userId: z.string().cuid() }),
      body: createBrandKitSchema
    }
  }, async (request, reply) => {
    const { userId } = request.params as { userId: string }
    const currentUserId = (request as any).user?.id

    if (!currentUserId) {
      return reply.code(401).send({
        success: false,
        error: { message: 'Authentication required', code: 'UNAUTHORIZED' }
      })
    }

    try {
      const brandKit = await brandKitService.createBrandKit(userId, request.body as any)

      return reply.code(201).send({
        success: true,
        data: { brandKit },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'BRAND_KIT_CREATION_FAILED' }
      })
    }
  })

  // Get brand kits by user
  fastify.get<{
    Params: { userId: string }
  }>('/brand-kits/user/:userId', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ userId: z.string().cuid() })
    }
  }, async (request, reply) => {
    const { userId } = request.params as { userId: string }

    try {
      const brandKits = await brandKitService.getBrandKitsByUser(userId)

      return reply.send({
        success: true,
        data: { brandKits },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'BRAND_KITS_RETRIEVAL_FAILED' }
      })
    }
  })

  // Get brand kit by ID
  fastify.get<{
    Params: { id: string }
  }>('/brand-kits/:id', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ id: z.string().cuid() })
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const brandKit = await brandKitService.findById(id)

      if (!brandKit) {
        return reply.code(404).send({
          success: false,
          error: { message: 'Brand kit not found', code: 'BRAND_KIT_NOT_FOUND' }
        })
      }

      return reply.send({
        success: true,
        data: { brandKit },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'BRAND_KIT_RETRIEVAL_FAILED' }
      })
    }
  })

  // Update brand kit
  fastify.put<{
    Params: { id: string }
    Body: any
  }>('/brand-kits/:id', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ id: z.string().cuid() }),
      body: createBrandKitSchema.partial()
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const brandKit = await brandKitService.update(id, request.body as any)

      return reply.send({
        success: true,
        data: { brandKit },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'BRAND_KIT_UPDATE_FAILED' }
      })
    }
  })

  // Delete brand kit
  fastify.delete<{
    Params: { id: string }
  }>('/brand-kits/:id', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ id: z.string().cuid() })
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const success = await brandKitService.delete(id)

      return reply.send({
        success,
        message: success ? 'Brand kit deleted successfully' : 'Failed to delete brand kit',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'BRAND_KIT_DELETE_FAILED' }
      })
    }
  })

  // Apply brand kit to website
  fastify.post<{
    Params: { id: string }
    Body: { websiteId: string }
  }>('/brand-kits/:id/apply', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ id: z.string().cuid() }),
      body: z.object({
        websiteId: z.string().cuid()
      })
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const { websiteId } = request.body as { websiteId: string }

    try {
      const result = await brandKitService.applyToWebsite(id, websiteId)

      return reply.send({
        success: true,
        data: { result },
        message: 'Brand kit applied to website successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'BRAND_KIT_APPLICATION_FAILED' }
      })
    }
  })

  // Get brand kit analytics
  fastify.get<{
    Params: { id: string }
  }>('/brand-kits/:id/analytics', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ id: z.string().cuid() })
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const analytics = await brandKitService.getBrandKitAnalytics(id)

      return reply.send({
        success: true,
        data: { analytics },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'BRAND_KIT_ANALYTICS_FAILED' }
      })
    }
  })

  // Upload brand asset
  fastify.post<{
    Params: { id: string }
    Body: {
      type: string
      file: string
      filename: string
      mimeType: string
    }
  }>('/brand-kits/:id/assets', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ id: z.string().cuid() }),
      body: z.object({
        type: z.string(),
        file: z.string(),
        filename: z.string(),
        mimeType: z.string()
      })
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const { type, file, filename, mimeType } = request.body as any

    try {
      const result = await brandKitService.uploadBrandAsset(id, {
        type,
        file,
        filename,
        mimeType
      })

      return reply.send({
        success: true,
        data: { result },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'BRAND_ASSET_UPLOAD_FAILED' }
      })
    }
  })

  // Get brand kit templates
  fastify.get<{
    Params: { id: string }
  }>('/brand-kits/:id/templates', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ id: z.string().cuid() })
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const templates = await brandKitService.getBrandTemplates(id)

      return reply.send({
        success: true,
        data: { templates },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'BRAND_TEMPLATES_RETRIEVAL_FAILED' }
      })
    }
  })
}

export default brandKitRoutes