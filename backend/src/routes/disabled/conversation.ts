import { FastifyInstance } from 'fastify'
import { ConversationOrchestrator } from '../services/conversationOrchestrator'

const orchestrator = new ConversationOrchestrator()

export async function conversationRoutes(fastify: FastifyInstance) {
  // Start a new conversation
  fastify.post('/conversation/start', async (request, reply) => {
    try {
      const { sessionId, userId } = request.body as { sessionId: string; userId?: string }

      const session = await orchestrator.startConversation(sessionId, userId)

      return reply.send({
        success: true,
        data: session
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to start conversation'
      })
    }
  })

  // Send a message in the conversation
  fastify.post('/conversation/message', async (request, reply) => {
    try {
      const { sessionId, message } = request.body as { sessionId: string; message: string }

      if (!sessionId || !message) {
        return reply.status(400).send({
          success: false,
          error: 'Session ID and message are required'
        })
      }

      const result = await orchestrator.processMessage(sessionId, message)

      return reply.send({
        success: true,
        data: {
          session: result.session,
          aiResponse: result.aiResponse
        }
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to process message'
      })
    }
  })

  // Get conversation session
  fastify.get('/conversation/:sessionId', async (request, reply) => {
    try {
      const { sessionId } = request.params as { sessionId: string }

      const session = orchestrator.getSession(sessionId)

      if (!session) {
        return reply.status(404).send({
          success: false,
          error: 'Session not found'
        })
      }

      return reply.send({
        success: true,
        data: session
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to get session'
      })
    }
  })

  // Generate website from conversation
  fastify.post('/conversation/generate-website', async (request, reply) => {
    try {
      const { sessionId, userId } = request.body as { sessionId: string; userId: string }

      if (!sessionId || !userId) {
        return reply.status(400).send({
          success: false,
          error: 'Session ID and user ID are required'
        })
      }

      const websiteId = await orchestrator.generateWebsite(sessionId, userId)

      return reply.send({
        success: true,
        data: {
          websiteId,
          message: 'Website generated successfully'
        }
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to generate website'
      })
    }
  })

  // Quick intent detection (for suggestions)
  fastify.post('/conversation/detect-intent', async (request, reply) => {
    try {
      const { message } = request.body as { message: string }

      const intentService = new (await import('../services/intentDetectionService')).IntentDetectionService()
      const intent = intentService.detectIntent(message)

      return reply.send({
        success: true,
        data: intent
      })
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to detect intent'
      })
    }
  })
}
