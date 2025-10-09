import { FastifyInstance } from 'fastify'
import { authenticate, requireAdmin } from '@/middleware/auth'

export async function userRoutes(fastify: FastifyInstance) {
  // GET /api/v1/users/profile
  fastify.get('/profile', {
    preHandler: [authenticate],
    schema: {
      description: 'Get user profile',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    phone: { type: 'string' },
                    avatar: { type: 'string' },
                    businessType: { type: 'string' },
                    city: { type: 'string' },
                    companyName: { type: 'string' },
                    role: { type: 'string' },
                    status: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    lastLoginAt: { type: 'string', format: 'date-time' }
                  }
                }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        401: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      // This would typically fetch from UserService
      const user = {
        id: request.user!.id,
        name: request.user!.name,
        email: request.user!.email,
        phone: '+92-300-1234567',
        avatar: null,
        businessType: 'SERVICE',
        city: 'Karachi',
        companyName: 'My Company',
        role: request.user!.role,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      }
      
      reply.send({
        success: true,
        data: { user },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to fetch user profile',
          code: 'FETCH_PROFILE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/users/subscription
  fastify.get('/subscription', {
    preHandler: [authenticate],
    schema: {
      description: 'Get user subscription details',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                subscription: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    currency: { type: 'string' },
                    interval: { type: 'string' },
                    maxWebsites: { type: 'number' },
                    maxPages: { type: 'number' },
                    maxProducts: { type: 'number' },
                    maxStorage: { type: 'number' },
                    customDomain: { type: 'boolean' },
                    aiGenerations: { type: 'number' },
                    prioritySupport: { type: 'boolean' }
                  }
                },
                status: { type: 'string' },
                expiresAt: { type: 'string', format: 'date-time' }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        401: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      // Mock subscription data
      const subscription = {
        id: 'sub-1',
        name: 'Business Plan',
        description: 'Perfect for growing businesses',
        price: 5000,
        currency: 'PKR',
        interval: 'MONTHLY',
        maxWebsites: 10,
        maxPages: 50,
        maxProducts: 100,
        maxStorage: 50000,
        customDomain: true,
        aiGenerations: 1000,
        prioritySupport: true
      }
      
      reply.send({
        success: true,
        data: {
          subscription,
          status: 'ACTIVE',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to fetch subscription',
          code: 'FETCH_SUBSCRIPTION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })
}
