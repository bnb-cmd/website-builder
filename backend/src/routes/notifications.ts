import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { NotificationService } from '../services/notificationService'
import { SmartNotificationScheduler } from '../services/smartNotificationScheduler'
import { MultiChannelDeliveryService } from '../services/multiChannelDeliveryService'
import { InteractiveNotificationService } from '../services/interactiveNotificationService'
import { NotificationDigestService } from '../services/notificationDigestService'

// Validation schemas
const notificationSchema = z.object({
  userId: z.string(),
  type: z.enum(['SYSTEM', 'MARKETING', 'TRANSACTION', 'SECURITY', 'SOCIAL', 'PROMOTIONAL']),
  title: z.string(),
  message: z.string(),
  data: z.record(z.any()).optional(),
  channel: z.enum(['EMAIL', 'SMS', 'PUSH', 'IN_APP', 'WHATSAPP']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  actions: z.array(z.object({
    label: z.string(),
    action: z.string(),
    style: z.enum(['primary', 'secondary', 'danger', 'success']),
    url: z.string().optional()
  })).optional(),
  imageUrl: z.string().optional(),
  scheduledFor: z.string().optional(),
  expiresAt: z.string().optional()
})

const notificationPreferencesSchema = z.object({
  emailEnabled: z.boolean(),
  smsEnabled: z.boolean(),
  pushEnabled: z.boolean(),
  whatsappEnabled: z.boolean(),
  quietHoursStart: z.string().optional(),
  quietHoursEnd: z.string().optional(),
  digestFrequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'NEVER']).optional(),
  timezone: z.string().optional()
})

const templateSchema = z.object({
  name: z.string(),
  type: z.enum(['SYSTEM', 'MARKETING', 'TRANSACTION', 'SECURITY', 'SOCIAL', 'PROMOTIONAL']),
  channel: z.enum(['EMAIL', 'SMS', 'PUSH', 'IN_APP', 'WHATSAPP']),
  subject: z.string(),
  content: z.string(),
  variables: z.array(z.string()).optional(),
  isActive: z.boolean().optional()
})

const digestSchema = z.object({
  userId: z.string(),
  period: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).optional()
})

export async function notificationRoutes(fastify: FastifyInstance) {
  const notificationService = new NotificationService()
  const schedulerService = new SmartNotificationScheduler(notificationService)
  const deliveryService = new MultiChannelDeliveryService()
  const interactiveService = new InteractiveNotificationService(notificationService)
  const digestService = new NotificationDigestService(notificationService, deliveryService)

  // Create notification
  fastify.post('/notifications', {
    schema: {
      body: {
        type: 'object',
        required: ['userId', 'type', 'title', 'message'],
        properties: {
          userId: { type: 'string' },
          type: { type: 'string', enum: ['SYSTEM', 'MARKETING', 'TRANSACTION', 'SECURITY', 'SOCIAL', 'PROMOTIONAL'] },
          title: { type: 'string' },
          message: { type: 'string' },
          data: { type: 'object' },
          channel: { type: 'string', enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP', 'WHATSAPP'] },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
          actions: {
            type: 'array',
            items: {
              type: 'object',
              required: ['label', 'action', 'style'],
              properties: {
                label: { type: 'string' },
                action: { type: 'string' },
                style: { type: 'string', enum: ['primary', 'secondary', 'danger', 'success'] },
                url: { type: 'string' }
              }
            }
          },
          imageUrl: { type: 'string' },
          scheduledFor: { type: 'string' },
          expiresAt: { type: 'string' }
        },
        additionalProperties: false
      },
      response: {
        201: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            userId: { type: 'string' },
            type: { type: 'string' },
            title: { type: 'string' },
            message: { type: 'string' },
            status: { type: 'string' },
            createdAt: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const notification = await notificationService.createNotification(request.body)
      return reply.status(201).send(notification)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to create notification' })
    }
  })

  // Create notification from template
  fastify.post('/notifications/template/:templateId', {
    schema: {
      params: {
        type: 'object',
        required: ['templateId'],
        properties: { templateId: { type: 'string' } }
      },
      body: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string' },
          variables: { type: 'object' }
        },
        additionalProperties: false
      }
    }
  }, async (request, reply) => {
    try {
      const { templateId } = request.params
      const { userId, variables } = request.body
      const notification = await notificationService.createNotificationFromTemplate(templateId, userId, variables)
      return reply.status(201).send(notification)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to create notification from template' })
    }
  })

  // Get notifications for user
  fastify.get('/notifications/:userId', {
    schema: {
      params: {
        type: 'object',
        required: ['userId'],
        properties: { userId: { type: 'string' } }
      },
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'string' },
          limit: { type: 'string' },
          type: { type: 'string' },
          status: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { userId } = request.params
      const { page = '1', limit = '20', type, status } = request.query
      const notifications = await notificationService.getUserNotifications(
        userId,
        parseInt(page),
        parseInt(limit),
        type,
        status
      )
      return reply.send(notifications)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to get notifications' })
    }
  })

  // Mark notification as read
  fastify.patch('/notifications/:id/read', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string' } }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params
      const notification = await notificationService.markAsRead(id)
      return reply.send(notification)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to mark notification as read' })
    }
  })

  // Mark all notifications as read
  fastify.patch('/notifications/:userId/read-all', {
    schema: {
      params: {
        type: 'object',
        required: ['userId'],
        properties: { userId: { type: 'string' } }
      }
    }
  }, async (request, reply) => {
    try {
      const { userId } = request.params
      const count = await notificationService.markAllAsRead(userId)
      return reply.send({ count })
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to mark all notifications as read' })
    }
  })

  // Get user preferences
  fastify.get('/notifications/preferences/:userId', {
    schema: {
      params: {
        type: 'object',
        required: ['userId'],
        properties: { userId: { type: 'string' } }
      }
    }
  }, async (request, reply) => {
    try {
      const { userId } = request.params
      const preferences = await notificationService.getUserPreferences(userId)
      return reply.send(preferences)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to get user preferences' })
    }
  })

  // Update user preferences
  fastify.put('/notifications/preferences/:userId', {
    schema: {
      params: {
        type: 'object',
        required: ['userId'],
        properties: { userId: { type: 'string' } }
      },
      body: {
        type: 'object',
        required: ['emailEnabled', 'smsEnabled', 'pushEnabled', 'whatsappEnabled'],
        properties: {
          emailEnabled: { type: 'boolean' },
          smsEnabled: { type: 'boolean' },
          pushEnabled: { type: 'boolean' },
          whatsappEnabled: { type: 'boolean' },
          quietHoursStart: { type: 'string' },
          quietHoursEnd: { type: 'string' },
          digestFrequency: { type: 'string', enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'NEVER'] },
          timezone: { type: 'string' }
        },
        additionalProperties: false
      }
    }
  }, async (request, reply) => {
    try {
      const { userId } = request.params
      const preferences = await notificationService.updateUserPreferences(userId, request.body)
      return reply.send(preferences)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to update user preferences' })
    }
  })

  // Create notification template
  fastify.post('/notifications/templates', {
    schema: {
      body: {
        type: 'object',
        required: ['name', 'type', 'channel', 'subject', 'content'],
        properties: {
          name: { type: 'string' },
          type: { type: 'string', enum: ['SYSTEM', 'MARKETING', 'TRANSACTION', 'SECURITY', 'SOCIAL', 'PROMOTIONAL'] },
          channel: { type: 'string', enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP', 'WHATSAPP'] },
          subject: { type: 'string' },
          content: { type: 'string' },
          variables: { type: 'array', items: { type: 'string' } },
          isActive: { type: 'boolean' }
        },
        additionalProperties: false
      }
    }
  }, async (request, reply) => {
    try {
      const template = await notificationService.createTemplate(request.body)
      return reply.status(201).send(template)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to create template' })
    }
  })

  // Get notification templates
  fastify.get('/notifications/templates', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          channel: { type: 'string' },
          isActive: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { type, channel, isActive } = request.query
      const templates = await notificationService.getTemplates({ type, channel, isActive })
      return reply.send(templates)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to get templates' })
    }
  })

  // Get notification analytics
  fastify.get('/notifications/analytics/:userId', {
    schema: {
      params: {
        type: 'object',
        required: ['userId'],
        properties: { userId: { type: 'string' } }
      },
      querystring: {
        type: 'object',
        properties: { days: { type: 'string' } }
      }
    }
  }, async (request, reply) => {
    try {
      const { userId } = request.params
      const { days = '30' } = request.query
      const analytics = await notificationService.getNotificationAnalytics(userId, parseInt(days))
      return reply.send(analytics)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to get analytics' })
    }
  })

  // Smart scheduling
  fastify.post('/notifications/schedule', {
    schema: {
      body: {
        type: 'object',
        required: ['userId', 'type', 'title', 'message'],
        properties: {
          userId: { type: 'string' },
          type: { type: 'string', enum: ['SYSTEM', 'MARKETING', 'TRANSACTION', 'SECURITY', 'SOCIAL', 'PROMOTIONAL'] },
          title: { type: 'string' },
          message: { type: 'string' },
          data: { type: 'object' },
          channel: { type: 'string', enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP', 'WHATSAPP'] },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
          actions: {
            type: 'array',
            items: {
              type: 'object',
              required: ['label', 'action', 'style'],
              properties: {
                label: { type: 'string' },
                action: { type: 'string' },
                style: { type: 'string', enum: ['primary', 'secondary', 'danger', 'success'] },
                url: { type: 'string' }
              }
            }
          },
          imageUrl: { type: 'string' },
          scheduledFor: { type: 'string' },
          expiresAt: { type: 'string' },
          optimalTime: { type: 'boolean' }
        },
        additionalProperties: false
      }
    }
  }, async (request, reply) => {
    try {
      const { optimalTime, ...notificationData } = request.body
      const scheduledNotification = await schedulerService.scheduleNotification(notificationData, optimalTime)
      return reply.status(201).send(scheduledNotification)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to schedule notification' })
    }
  })

  // Multi-channel delivery test
  fastify.post('/notifications/test-delivery', {
    schema: {
      body: {
        type: 'object',
        required: ['channel', 'recipient', 'message'],
        properties: {
          channel: { type: 'string', enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP', 'WHATSAPP'] },
          recipient: { type: 'string' },
          message: { type: 'string' }
        },
        additionalProperties: false
      }
    }
  }, async (request, reply) => {
    try {
      const { channel, recipient, message } = request.body
      const result = await deliveryService.testDelivery(channel, recipient, message)
      return reply.send(result)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to test delivery' })
    }
  })

  // Interactive notifications
  fastify.post('/notifications/interactive', {
    schema: {
      body: {
        type: 'object',
        required: ['userId', 'type', 'title', 'message', 'actions'],
        properties: {
          userId: { type: 'string' },
          type: { type: 'string' },
          title: { type: 'string' },
          message: { type: 'string' },
          actions: {
            type: 'array',
            items: {
              type: 'object',
              required: ['label', 'action', 'style'],
              properties: {
                label: { type: 'string' },
                action: { type: 'string' },
                style: { type: 'string', enum: ['primary', 'secondary', 'danger', 'success'] },
                url: { type: 'string' }
              }
            }
          }
        },
        additionalProperties: false
      }
    }
  }, async (request, reply) => {
    try {
      const { userId, type, title, message, actions } = request.body
      const notification = await interactiveService.createInteractiveNotification(userId, type, title, message, actions)
      return reply.status(201).send(notification)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to create interactive notification' })
    }
  })

  // Handle interactive notification response
  fastify.post('/notifications/interactive/:id/respond', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string' } }
      },
      body: {
        type: 'object',
        required: ['action', 'userId'],
        properties: {
          action: { type: 'string' },
          userId: { type: 'string' }
        },
        additionalProperties: false
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params
      const { action, userId } = request.body
      const result = await interactiveService.handleActionResponse(id, action, userId)
      return reply.send(result)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to handle action response' })
    }
  })

  // Notification digests
  fastify.post('/notifications/digests', {
    schema: {
      body: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string' },
          period: { type: 'string', enum: ['DAILY', 'WEEKLY', 'MONTHLY'] }
        },
        additionalProperties: false
      }
    }
  }, async (request, reply) => {
    try {
      const { userId, period } = request.body
      const digest = await digestService.createDigest(userId, period)
      return reply.status(201).send(digest)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to create digest' })
    }
  })

  // Process digests for user
  fastify.post('/notifications/digests/:userId/process', {
    schema: {
      params: {
        type: 'object',
        required: ['userId'],
        properties: { userId: { type: 'string' } }
      }
    }
  }, async (request, reply) => {
    try {
      const { userId } = request.params
      const result = await digestService.processDigestsForUser(userId)
      return reply.send(result)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to process digests' })
    }
  })

  // Get digest stats
  fastify.get('/notifications/digests/:userId/stats', {
    schema: {
      params: {
        type: 'object',
        required: ['userId'],
        properties: { userId: { type: 'string' } }
      }
    }
  }, async (request, reply) => {
    try {
      const { userId } = request.params
      const stats = await digestService.getDigestStats(userId)
      return reply.send(stats)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: 'Failed to get digest stats' })
    }
  })

  // WebSocket endpoint for real-time notifications
  fastify.register(async function (fastify) {
    fastify.get('/ws/:userId', { websocket: true }, (connection, req) => {
      const { userId } = req.params as { userId: string }
      
      // Add connection to service
      notificationService.addWebSocketConnection(userId, connection)
      
      connection.socket.on('close', () => {
        notificationService.removeWebSocketConnection(userId)
      })
    })
  })
}