import { FastifyPluginAsync } from 'fastify'
import { contentService } from '@/services/contentService'
import { authenticate } from '@/middleware/auth'
import { z } from 'zod'

const createContentSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  type: z.enum(['ARTICLE', 'PAGE', 'BLOG_POST', 'NEWS', 'PRODUCT_DESCRIPTION']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).optional(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  featuredImage: z.string().optional(),
  language: z.string().optional()
})

const updateContentSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().optional(),
  type: z.enum(['ARTICLE', 'PAGE', 'BLOG_POST', 'NEWS', 'PRODUCT_DESCRIPTION']).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).optional(),
  tags: z.array(z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  featuredImage: z.string().optional(),
  language: z.string().optional()
})

const contentRoutes: FastifyPluginAsync = async (fastify) => {
  // Create content
  fastify.post<{
    Params: { websiteId: string }
    Body: any
  }>('/content/:websiteId', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ websiteId: z.string().cuid() }),
      body: createContentSchema
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
      const content = await contentService.createContent(websiteId, {
        ...request.body as any,
        authorId: userId
      })

      return reply.code(201).send({
        success: true,
        data: {
          id: content.id,
          title: content.title,
          content: content.content,
          status: content.status,
          createdAt: content.createdAt
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'CONTENT_CREATION_FAILED' }
      })
    }
  })

  // Get content by website
  fastify.get<{
    Params: { websiteId: string }
    Querystring: {
      search?: string
      type?: string
      status?: string
      page?: string
      limit?: string
    }
  }>('/content/:websiteId', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ websiteId: z.string().cuid() }),
      querystring: z.object({
        search: z.string().optional(),
        type: z.string().optional(),
        status: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional()
      })
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }
    const { search, type, status, page, limit } = request.query as any

    try {
      const contents = await contentService.getContentByWebsite(websiteId, {
        search,
        type: type as any,
        status: status as any,
        limit: limit ? parseInt(limit) : 20,
        offset: page ? (parseInt(page) - 1) * (limit ? parseInt(limit) : 20) : 0
      })

      return reply.send({
        success: true,
        data: { contents },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'CONTENT_RETRIEVAL_FAILED' }
      })
    }
  })

  // Get content by ID
  fastify.get<{
    Params: { id: string }
  }>('/content/:id', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ id: z.string().cuid() })
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const content = await contentService.findById(id)

      if (!content) {
        return reply.code(404).send({
          success: false,
          error: { message: 'Content not found', code: 'CONTENT_NOT_FOUND' }
        })
      }

      return reply.send({
        success: true,
        data: { content },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'CONTENT_RETRIEVAL_FAILED' }
      })
    }
  })

  // Update content
  fastify.put<{
    Params: { id: string }
    Body: any
  }>('/content/:id', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ id: z.string().cuid() }),
      body: updateContentSchema
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const content = await contentService.update(id, request.body as any)

      return reply.send({
        success: true,
        data: { content },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'CONTENT_UPDATE_FAILED' }
      })
    }
  })

  // Delete content
  fastify.delete<{
    Params: { id: string }
  }>('/content/:id', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ id: z.string().cuid() })
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const success = await contentService.delete(id)

      return reply.send({
        success,
        message: success ? 'Content deleted successfully' : 'Failed to delete content',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'CONTENT_DELETE_FAILED' }
      })
    }
  })

  // Publish content
  fastify.post<{
    Params: { id: string }
  }>('/content/:id/publish', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ id: z.string().cuid() })
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const content = await contentService.publishContent(id)

      return reply.send({
        success: true,
        data: { content },
        message: 'Content published successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'CONTENT_PUBLISH_FAILED' }
      })
    }
  })

  // Get content analytics
  fastify.get<{
    Params: { id: string }
  }>('/content/:id/analytics', {
    preHandler: [authenticate],
    schema: {
      params: z.object({ id: z.string().cuid() })
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }

    try {
      const analytics = await contentService.getContentAnalytics(id)

      return reply.send({
        success: true,
        data: { analytics },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'ANALYTICS_RETRIEVAL_FAILED' }
      })
    }
  })

  // Record content view
  fastify.post<{
    Params: { id: string }
    Body: { metadata?: any }
  }>('/content/:id/view', {
    schema: {
      params: z.object({ id: z.string().cuid() }),
      body: z.object({
        metadata: z.any().optional()
      })
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string }
    const { metadata } = request.body as { metadata?: any }

    try {
      await contentService.recordContentView(id, metadata)

      return reply.send({
        success: true,
        message: 'View recorded successfully',
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: { message: error.message, code: 'VIEW_RECORDING_FAILED' }
      })
    }
  })
}

export default contentRoutes