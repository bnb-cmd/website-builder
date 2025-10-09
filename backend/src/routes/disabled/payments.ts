import { FastifyInstance } from 'fastify'
import { authenticate, requireAdmin } from '@/middleware/auth'

export async function paymentRoutes(fastify: FastifyInstance) {
  // POST /api/v1/payments/create-intent
  fastify.post('/create-intent', {
    preHandler: [authenticate],
    schema: {
      description: 'Create payment intent',
      tags: ['Payments'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['amount', 'currency', 'subscriptionId'],
        properties: {
          amount: { type: 'number', minimum: 1 },
          currency: { type: 'string', enum: ['PKR', 'USD'] },
          subscriptionId: { type: 'string' },
          paymentMethod: { type: 'string', enum: ['STRIPE', 'JAZZCASH', 'EASYPAISA'] }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                clientSecret: { type: 'string' },
                paymentIntentId: { type: 'string' },
                amount: { type: 'number' },
                currency: { type: 'string' }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        400: { $ref: 'Error' },
        401: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const { amount, currency, subscriptionId, paymentMethod } = request.body as any
      
      // Mock payment intent creation
      const paymentIntent = {
        clientSecret: 'pi_mock_client_secret',
        paymentIntentId: 'pi_mock_payment_intent_id',
        amount,
        currency
      }
      
      reply.send({
        success: true,
        data: paymentIntent,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to create payment intent',
          code: 'PAYMENT_INTENT_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/payments/confirm
  fastify.post('/confirm', {
    preHandler: [authenticate],
    schema: {
      description: 'Confirm payment',
      tags: ['Payments'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['paymentIntentId'],
        properties: {
          paymentIntentId: { type: 'string' },
          subscriptionId: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                paymentId: { type: 'string' },
                status: { type: 'string' },
                subscriptionId: { type: 'string' },
                expiresAt: { type: 'string', format: 'date-time' }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        400: { $ref: 'Error' },
        401: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const { paymentIntentId, subscriptionId } = request.body as any
      
      // Mock payment confirmation
      const payment = {
        paymentId: 'pay_mock_payment_id',
        status: 'COMPLETED',
        subscriptionId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
      
      reply.send({
        success: true,
        data: payment,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to confirm payment',
          code: 'PAYMENT_CONFIRMATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/payments/history
  fastify.get('/history', {
    preHandler: [authenticate],
    schema: {
      description: 'Get payment history',
      tags: ['Payments'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 10 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  amount: { type: 'number' },
                  currency: { type: 'string' },
                  status: { type: 'string' },
                  gateway: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            pagination: { $ref: 'Pagination' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        401: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const { page = 1, limit = 10 } = request.query as any
      
      // Mock payment history
      const payments = [
        {
          id: 'pay-1',
          amount: 5000,
          currency: 'PKR',
          status: 'COMPLETED',
          gateway: 'STRIPE',
          createdAt: new Date().toISOString()
        },
        {
          id: 'pay-2',
          amount: 2500,
          currency: 'PKR',
          status: 'COMPLETED',
          gateway: 'JAZZCASH',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ]
      
      reply.send({
        success: true,
        data: payments,
        pagination: {
          page,
          limit,
          total: payments.length,
          pages: Math.ceil(payments.length / limit)
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to fetch payment history',
          code: 'PAYMENT_HISTORY_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })
}
