import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { AdvancedAIService } from '../services/advancedAIService'

const aiSessionSchema = z.object({
  websiteId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  type: z.enum(['CHAT', 'CODE_GENERATION', 'CONTENT_CREATION', 'DESIGN_ASSISTANCE', 'ANALYSIS']),
  context: z.any().optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional()
})

const arvrContentSchema = z.object({
  websiteId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  name: z.string().min(1),
  type: z.enum(['AR_OVERLAY', 'VR_EXPERIENCE', '3D_MODEL', 'ANIMATION', 'INTERACTIVE_SCENE']),
  description: z.string().optional(),
  modelUrl: z.string().url().optional(),
  textureUrl: z.string().url().optional(),
  animationUrl: z.string().url().optional(),
  scale: z.any().optional(),
  position: z.any().optional(),
  rotation: z.any().optional(),
  interactions: z.any().optional()
})

const generateARVRContentSchema = z.object({
  prompt: z.string().min(1),
  type: z.enum(['AR_OVERLAY', 'VR_EXPERIENCE', '3D_MODEL', 'ANIMATION', 'INTERACTIVE_SCENE']),
  websiteId: z.string().uuid(),
  userId: z.string().uuid().optional()
})

const codeGenerationSchema = z.object({
  description: z.string().min(1),
  language: z.string().min(1)
})

const websiteAnalysisSchema = z.object({
  websiteId: z.string().uuid()
})

export async function advancedAIRoutes(fastify: FastifyInstance) {
  const aiService = new AdvancedAIService(fastify.prisma)

  // AI Session Management
  fastify.post('/ai-sessions', {
    schema: {
      body: aiSessionSchema,
      response: {
        201: z.object({
          id: z.string(),
          sessionId: z.string(),
          websiteId: z.string(),
          userId: z.string().optional(),
          type: z.string(),
          status: z.string(),
          createdAt: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const session = await aiService.createAISession(request.body)
      reply.code(201).send(session)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to create AI session' })
    }
  })

  fastify.get('/ai-sessions/:websiteId', {
    schema: {
      params: z.object({
        websiteId: z.string().uuid()
      }),
      response: {
        200: z.array(z.object({
          id: z.string(),
          sessionId: z.string(),
          websiteId: z.string(),
          userId: z.string().optional(),
          type: z.string(),
          status: z.string(),
          messageCount: z.number(),
          tokenUsage: z.number(),
          cost: z.number(),
          createdAt: z.string(),
          updatedAt: z.string()
        }))
      }
    }
  }, async (request, reply) => {
    try {
      const { websiteId } = request.params as { websiteId: string }
      const sessions = await aiService.getAISessions(websiteId)
      reply.send(sessions)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch AI sessions' })
    }
  })

  fastify.post('/ai-sessions/:sessionId/message', {
    schema: {
      params: z.object({
        sessionId: z.string()
      }),
      body: z.object({
        message: z.string().min(1)
      }),
      response: {
        200: z.object({
          response: z.string(),
          tokensUsed: z.number(),
          cost: z.number()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const { sessionId } = request.params as { sessionId: string }
      const { message } = request.body as { message: string }
      const result = await aiService.sendAIMessage(sessionId, message)
      reply.send(result)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to send AI message' })
    }
  })

  // AR/VR Content Management
  fastify.post('/arvr-content', {
    schema: {
      body: arvrContentSchema,
      response: {
        201: z.object({
          id: z.string(),
          websiteId: z.string(),
          userId: z.string().optional(),
          name: z.string(),
          type: z.string(),
          status: z.string(),
          createdAt: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const content = await aiService.createARVRContent(request.body)
      reply.code(201).send(content)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to create AR/VR content' })
    }
  })

  fastify.get('/arvr-content/:websiteId', {
    schema: {
      params: z.object({
        websiteId: z.string().uuid()
      }),
      response: {
        200: z.array(z.object({
          id: z.string(),
          websiteId: z.string(),
          userId: z.string().optional(),
          name: z.string(),
          type: z.string(),
          description: z.string().optional(),
          status: z.string(),
          polygonCount: z.number().optional(),
          textureSize: z.number().optional(),
          fileSize: z.number().optional(),
          createdAt: z.string(),
          updatedAt: z.string()
        }))
      }
    }
  }, async (request, reply) => {
    try {
      const { websiteId } = request.params as { websiteId: string }
      const content = await aiService.getARVRContent(websiteId)
      reply.send(content)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch AR/VR content' })
    }
  })

  fastify.post('/arvr-content/:contentId/process', {
    schema: {
      params: z.object({
        contentId: z.string().uuid()
      }),
      response: {
        200: z.object({
          id: z.string(),
          status: z.string(),
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const { contentId } = request.params as { contentId: string }
      const content = await aiService.processARVRContent(contentId)
      reply.send({
        id: content.id,
        status: content.status,
        message: 'AR/VR content processing started'
      })
    } catch (error) {
      reply.code(500).send({ error: 'Failed to process AR/VR content' })
    }
  })

  fastify.post('/arvr-content/generate', {
    schema: {
      body: generateARVRContentSchema,
      response: {
        201: z.object({
          id: z.string(),
          name: z.string(),
          type: z.string(),
          status: z.string(),
          message: z.string()
        })
      }
    }
  }, async (request, reply) => {
    try {
      const { prompt, type, websiteId, userId } = request.body as {
        prompt: string
        type: string
        websiteId: string
        userId?: string
      }
      const content = await aiService.generateARVRContent(prompt, type as any, websiteId, userId)
      reply.code(201).send({
        id: content.id,
        name: content.name,
        type: content.type,
        status: content.status,
        message: 'AR/VR content generated successfully'
      })
    } catch (error) {
      reply.code(500).send({ error: 'Failed to generate AR/VR content' })
    }
  })

  // Advanced AI Features
  fastify.post('/generate-code', {
    schema: {
      body: codeGenerationSchema,
      response: {
        200: z.object({
          code: z.string(),
          explanation: z.string(),
          suggestions: z.array(z.string())
        })
      }
    }
  }, async (request, reply) => {
    try {
      const { description, language } = request.body as {
        description: string
        language: string
      }
      const result = await aiService.generateCodeFromDescription(description, language)
      reply.send(result)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to generate code' })
    }
  })

  fastify.post('/analyze-website', {
    schema: {
      body: websiteAnalysisSchema,
      response: {
        200: z.object({
          score: z.number(),
          recommendations: z.array(z.string()),
          metrics: z.object({
            pageLoadTime: z.number(),
            firstContentfulPaint: z.number(),
            largestContentfulPaint: z.number(),
            cumulativeLayoutShift: z.number(),
            firstInputDelay: z.number()
          })
        })
      }
    }
  }, async (request, reply) => {
    try {
      const { websiteId } = request.body as { websiteId: string }
      const analysis = await aiService.analyzeWebsitePerformance(websiteId)
      reply.send(analysis)
    } catch (error) {
      reply.code(500).send({ error: 'Failed to analyze website performance' })
    }
  })
}
