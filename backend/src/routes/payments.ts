import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { PaymentService, CreatePaymentIntentData } from '../services/paymentService'
import { authenticate } from '../middleware/auth'
import { PaymentGateway, PaymentStatus } from '@prisma/client'

// Validation schemas
const createPaymentIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().min(3).max(3),
  orderId: z.string(),
  customerEmail: z.string().email(),
  gateway: z.enum(['STRIPE', 'JAZZCASH', 'EASYPAISA', 'BANK_TRANSFER']),
  metadata: z.record(z.string()).optional()
})

const confirmPaymentSchema = z.object({
  paymentId: z.string(),
  gatewayData: z.any().optional()
})

const refundSchema = z.object({
  paymentId: z.string(),
  amount: z.number().positive().optional(),
  reason: z.string().optional()
})

export async function paymentRoutes(fastify: FastifyInstance) {
  const paymentService = new PaymentService()

  // POST /api/v1/payments/create-intent
  fastify.post('/create-intent', {
    preHandler: [authenticate],
    schema: {
      description: 'Create payment intent',
      tags: ['Payments'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['amount', 'currency', 'orderId', 'customerEmail', 'gateway'],
        properties: {
          amount: { type: 'number', minimum: 0.01 },
          currency: { type: 'string', minLength: 3, maxLength: 3 },
          orderId: { type: 'string' },
          customerEmail: { type: 'string', format: 'email' },
          gateway: { type: 'string', enum: ['STRIPE', 'JAZZCASH', 'EASYPAISA', 'BANK_TRANSFER'] },
          metadata: { type: 'object', additionalProperties: { type: 'string' } }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const validatedData = createPaymentIntentSchema.parse(request.body)
      
      const paymentIntent = await paymentService.createPaymentIntent({
        amount: validatedData.amount,
        currency: validatedData.currency,
        orderId: validatedData.orderId,
        customerEmail: validatedData.customerEmail,
        gateway: validatedData.gateway as PaymentGateway,
        metadata: validatedData.metadata
      })

      if (!paymentIntent.success) {
        return reply.status(400).send({
          success: false,
          error: {
            message: paymentIntent.error || 'Failed to create payment intent',
            code: 'PAYMENT_INTENT_FAILED',
            timestamp: new Date().toISOString()
          }
        })
      }

      return reply.send({
        success: true,
        data: {
          paymentId: paymentIntent.paymentId,
          clientSecret: paymentIntent.clientSecret,
          redirectUrl: paymentIntent.redirectUrl,
          gatewayResponse: paymentIntent.gatewayResponse
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Create payment intent error:', error)
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
            timestamp: new Date().toISOString()
          }
        })
      }
      
      return reply.status(500).send({
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
        required: ['paymentId'],
        properties: {
          paymentId: { type: 'string' },
          gatewayData: { type: 'object' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const validatedData = confirmPaymentSchema.parse(request.body)
      
      const result = await paymentService.confirmPayment(
        validatedData.paymentId,
        validatedData.gatewayData
      )

      if (!result.success) {
        return reply.status(400).send({
          success: false,
          error: {
            message: result.error || 'Payment confirmation failed',
            code: 'PAYMENT_CONFIRMATION_FAILED',
            timestamp: new Date().toISOString()
          }
        })
      }

      return reply.send({
        success: true,
        data: {
          paymentId: result.paymentId,
          status: 'confirmed',
          gatewayResponse: result.gatewayResponse
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Confirm payment error:', error)
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
            timestamp: new Date().toISOString()
          }
        })
      }
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to confirm payment',
          code: 'PAYMENT_CONFIRMATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/payments/refund
  fastify.post('/refund', {
    preHandler: [authenticate],
    schema: {
      description: 'Process refund',
      tags: ['Payments'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['paymentId'],
        properties: {
          paymentId: { type: 'string' },
          amount: { type: 'number', minimum: 0.01 },
          reason: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const validatedData = refundSchema.parse(request.body)
      
      const result = await paymentService.processRefund(
        validatedData.paymentId,
        validatedData.amount,
        validatedData.reason
      )

      if (!result.success) {
        return reply.status(400).send({
          success: false,
          error: {
            message: result.error || 'Refund processing failed',
            code: 'REFUND_FAILED',
            timestamp: new Date().toISOString()
          }
        })
      }

      return reply.send({
        success: true,
        data: {
          paymentId: result.paymentId,
          refundId: result.gatewayResponse?.id,
          status: 'refunded',
          gatewayResponse: result.gatewayResponse
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Refund error:', error)
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
            timestamp: new Date().toISOString()
          }
        })
      }
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to process refund',
          code: 'REFUND_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/payments/:id
  fastify.get('/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Get payment details',
      tags: ['Payments'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        id: z.string()
      })
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const payment = await paymentService.findById(id)
      
      if (!payment) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'Payment not found',
            code: 'PAYMENT_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
      }

      return reply.send({
        success: true,
        data: { payment },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get payment error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve payment',
          code: 'PAYMENT_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/payments
  fastify.get('/', {
    preHandler: [authenticate],
    schema: {
      description: 'List payments',
      tags: ['Payments'],
      security: [{ bearerAuth: [] }],
      querystring: z.object({
        page: z.string().transform(Number).default('1'),
        limit: z.string().transform(Number).default('20'),
        status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']).optional(),
        gateway: z.enum(['STRIPE', 'JAZZCASH', 'EASYPAISA', 'BANK_TRANSFER']).optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional()
      })
    }
  }, async (request, reply) => {
    try {
      const query = request.query as any
      
      const filters: any = {}
      if (query.status) filters.status = query.status
      if (query.gateway) filters.gateway = query.gateway
      if (query.dateFrom || query.dateTo) {
        filters.createdAt = {}
        if (query.dateFrom) filters.createdAt.gte = new Date(query.dateFrom)
        if (query.dateTo) filters.createdAt.lte = new Date(query.dateTo)
      }

      const payments = await paymentService.findAll(filters)
      const total = payments.length

      return reply.send({
        success: true,
        data: {
          payments,
          pagination: {
            page: query.page,
            limit: query.limit,
            total,
            pages: Math.ceil(total / query.limit)
          }
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('List payments error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve payments',
          code: 'PAYMENTS_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/payments/stats
  fastify.get('/stats', {
    preHandler: [authenticate],
    schema: {
      description: 'Get payment statistics',
      tags: ['Payments'],
      security: [{ bearerAuth: [] }],
      querystring: z.object({
        websiteId: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional()
      })
    }
  }, async (request, reply) => {
    try {
      const query = request.query as any
      
      const dateRange = query.dateFrom || query.dateTo ? {
        from: query.dateFrom ? new Date(query.dateFrom) : undefined,
        to: query.dateTo ? new Date(query.dateTo) : undefined
      } : undefined

      const stats = await paymentService.getPaymentStats(query.websiteId, dateRange)

      return reply.send({
        success: true,
        data: { stats },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get payment stats error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve payment statistics',
          code: 'PAYMENT_STATS_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/payments/webhook/stripe
  fastify.post('/webhook/stripe', {
    schema: {
      description: 'Stripe webhook handler',
      tags: ['Payments']
    }
  }, async (request, reply) => {
    try {
      const payload = JSON.stringify(request.body)
      const signature = request.headers['stripe-signature'] as string

      if (!signature) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'Missing Stripe signature',
            code: 'MISSING_SIGNATURE',
            timestamp: new Date().toISOString()
          }
        })
      }

      await paymentService.handleStripeWebhook(payload, signature)

      return reply.send({
        success: true,
        data: { message: 'Webhook processed successfully' },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Stripe webhook error:', error)
      return reply.status(400).send({
        success: false,
        error: {
          message: 'Webhook processing failed',
          code: 'WEBHOOK_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })
}
