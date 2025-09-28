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
      body: {
        type: 'object',
        required: ['websiteId', 'type'],
        properties: {
          websiteId: { type: 'string' },
          userId: { type: 'string' },
          type: { type: 'string', enum: ['CHAT', 'CODE_GENERATION', 'CONTENT_CREATION', 'DESIGN_ASSISTANCE', 'ANALYSIS'] },
          context: {},
          model: { type: 'string' },
          temperature: { type: 'number', minimum: 0, maximum: 2 },
          maxTokens: { type: 'number', minimum: 1 }
        },
        additionalProperties: false
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            sessionId: { type: 'string' },
            websiteId: { type: 'string' },
            userId: { type: 'string' },
            type: { type: 'string' },
            status: { type: 'string' },
            createdAt: { type: 'string' }
          }
        }
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
      params: {
        type: 'object',
        required: ['websiteId'],
        properties: { websiteId: { type: 'string' } }
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              sessionId: { type: 'string' },
              websiteId: { type: 'string' },
              userId: { type: 'string' },
              type: { type: 'string' },
              status: { type: 'string' },
              messageCount: { type: 'number' },
              tokenUsage: { type: 'number' },
              cost: { type: 'number' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' }
            }
          }
        }
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
      params: {
        type: 'object',
        required: ['sessionId'],
        properties: { sessionId: { type: 'string' } }
      },
      body: {
        type: 'object',
        required: ['message'],
        properties: { message: { type: 'string', minLength: 1 } },
        additionalProperties: false
      },
      response: {
        200: {
          type: 'object',
          properties: {
            response: { type: 'string' },
            tokensUsed: { type: 'number' },
            cost: { type: 'number' }
          }
        }
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
      body: {
        type: 'object',
        required: ['websiteId', 'name', 'type'],
        properties: {
          websiteId: { type: 'string' },
          userId: { type: 'string' },
          name: { type: 'string', minLength: 1 },
          type: { type: 'string', enum: ['AR_OVERLAY', 'VR_EXPERIENCE', '3D_MODEL', 'ANIMATION', 'INTERACTIVE_SCENE'] },
          description: { type: 'string' },
          modelUrl: { type: 'string' },
          textureUrl: { type: 'string' },
          animationUrl: { type: 'string' },
          scale: {},
          position: {},
          rotation: {},
          interactions: {}
        },
        additionalProperties: false
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            websiteId: { type: 'string' },
            userId: { type: 'string' },
            name: { type: 'string' },
            type: { type: 'string' },
            status: { type: 'string' },
            createdAt: { type: 'string' }
          }
        }
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
      params: {
        type: 'object',
        required: ['websiteId'],
        properties: { websiteId: { type: 'string' } }
      },
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              websiteId: { type: 'string' },
              userId: { type: 'string' },
              name: { type: 'string' },
              type: { type: 'string' },
              description: { type: 'string' },
              status: { type: 'string' },
              polygonCount: { type: 'number' },
              textureSize: { type: 'number' },
              fileSize: { type: 'number' },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' }
            }
          }
        }
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
      params: {
        type: 'object',
        required: ['contentId'],
        properties: { contentId: { type: 'string' } }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            status: { type: 'string' },
            message: { type: 'string' }
          }
        }
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
      body: {
        type: 'object',
        required: ['prompt', 'type', 'websiteId'],
        properties: {
          prompt: { type: 'string', minLength: 1 },
          type: { type: 'string', enum: ['AR_OVERLAY', 'VR_EXPERIENCE', '3D_MODEL', 'ANIMATION', 'INTERACTIVE_SCENE'] },
          websiteId: { type: 'string' },
          userId: { type: 'string' }
        },
        additionalProperties: false
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            type: { type: 'string' },
            status: { type: 'string' },
            message: { type: 'string' }
          }
        }
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
      body: {
        type: 'object',
        required: ['description', 'language'],
        properties: {
          description: { type: 'string', minLength: 1 },
          language: { type: 'string', minLength: 1 }
        },
        additionalProperties: false
      },
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            explanation: { type: 'string' },
            suggestions: { type: 'array', items: { type: 'string' } }
          }
        }
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
      body: {
        type: 'object',
        required: ['websiteId'],
        properties: {
          websiteId: { type: 'string' }
        },
        additionalProperties: false
      },
      response: {
        200: {
          type: 'object',
          properties: {
            score: { type: 'number' },
            recommendations: { type: 'array', items: { type: 'string' } },
            metrics: {
              type: 'object',
              properties: {
                pageLoadTime: { type: 'number' },
                firstContentfulPaint: { type: 'number' },
                largestContentfulPaint: { type: 'number' },
                cumulativeLayoutShift: { type: 'number' },
                firstInputDelay: { type: 'number' }
              }
            }
          }
        }
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
