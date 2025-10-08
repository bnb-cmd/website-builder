import { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/auth'
import { z } from 'zod'

const checkoutSchema = z.object({
  websiteId: z.string(),
  orderId: z.string(),
  paymentMethod: z.enum(['STRIPE', 'JAZZCASH', 'EASYPAISA', 'BANK_TRANSFER']),
  amount: z.number().positive(),
  currency: z.string().default('PKR'),
  customerEmail: z.string().email(),
  customerName: z.string().optional(),
  billingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string()
  }).optional()
})

const refundSchema = z.object({
  paymentId: z.string(),
  amount: z.number().positive().optional(), // If not provided, refund full amount
  reason: z.string().optional()
})

export async function storePaymentsRoutes(fastify: FastifyInstance) {
  // POST /api/v1/store-payments/checkout - Process customer checkout payment
  fastify.post('/checkout', {
    preHandler: [authenticate],
    schema: {
      description: 'Process customer checkout payment',
      tags: ['Store Payments'],
      body: {
        type: 'object',
        required: ['websiteId', 'orderId', 'paymentMethod', 'amount'],
        properties: {
          websiteId: { type: 'string' },
          orderId: { type: 'string' },
          paymentMethod: { type: 'string', enum: ['STRIPE', 'JAZZCASH', 'EASYPAISA', 'BANK_TRANSFER'] },
          amount: { type: 'number' },
          currency: { type: 'string', default: 'PKR' },
          customerEmail: { type: 'string', format: 'email' },
          customerName: { type: 'string' },
          billingAddress: {
            type: 'object',
            properties: {
              street: { type: 'string' },
              city: { type: 'string' },
              state: { type: 'string' },
              zipCode: { type: 'string' },
              country: { type: 'string' }
            }
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                paymentId: { type: 'string' },
                status: { type: 'string' },
                gatewayResponse: { type: 'object' },
                redirectUrl: { type: 'string' }
              }
            }
          }
        },
        400: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const paymentData = checkoutSchema.parse(request.body)
      
      // Get website e-commerce settings
      const settings = await fastify.prisma.websiteEcommerceSettings.findUnique({
        where: { websiteId: paymentData.websiteId }
      })

      if (!settings) {
        return reply.status(400).send({
          success: false,
          error: 'E-commerce not enabled for this website'
        })
      }

      // Check if payment method is enabled
      const paymentMethodEnabled = {
        'STRIPE': settings.stripeEnabled,
        'JAZZCASH': settings.jazzcashEnabled,
        'EASYPAISA': settings.easypaisaEnabled,
        'BANK_TRANSFER': true // Always available
      }[paymentData.paymentMethod]

      if (!paymentMethodEnabled) {
        return reply.status(400).send({
          success: false,
          error: `Payment method ${paymentData.paymentMethod} is not enabled for this website`
        })
      }

      // Create payment record
      const payment = await fastify.prisma.payment.create({
        data: {
          websiteId: paymentData.websiteId,
          purpose: 'WEBSITE_CHECKOUT',
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: 'PENDING',
          gateway: paymentData.paymentMethod,
          gatewayData: JSON.stringify({
            orderId: paymentData.orderId,
            customerEmail: paymentData.customerEmail,
            customerName: paymentData.customerName,
            billingAddress: paymentData.billingAddress
          })
        }
      })

      // Process payment based on gateway
      let gatewayResponse: any = {}
      let redirectUrl: string | undefined

      switch (paymentData.paymentMethod) {
        case 'STRIPE':
          // Implement Stripe payment processing
          gatewayResponse = {
            clientSecret: 'pi_test_1234567890',
            publishableKey: settings.stripePublicKey
          }
          break
        case 'JAZZCASH':
          // Implement JazzCash payment processing
          gatewayResponse = {
            merchantId: settings.jazzcashMerchantId,
            transactionId: `JC_${Date.now()}`
          }
          redirectUrl = 'https://sandbox.jazzcash.com.pk/ApplicationAPI/API/Payment/DoTransaction'
          break
        case 'EASYPAISA':
          // Implement EasyPaisa payment processing
          gatewayResponse = {
            merchantId: settings.easypaisaMerchantId,
            transactionId: `EP_${Date.now()}`
          }
          redirectUrl = 'https://easypay.easypaisa.com.pk/easypay/Index.jsf'
          break
        case 'BANK_TRANSFER':
          gatewayResponse = {
            accountNumber: '1234567890',
            bankName: 'Allied Bank',
            reference: payment.id
          }
          break
      }

      return reply.send({
        success: true,
        data: {
          paymentId: payment.id,
          status: 'PENDING',
          gatewayResponse,
          redirectUrl
        }
      })
    } catch (error) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Invalid payment data',
          details: error.errors
        })
      }
      
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to process payment'
      })
    }
  })

  // POST /api/v1/store-payments/refund - Process customer refund
  fastify.post('/refund', {
    preHandler: [authenticate],
    schema: {
      description: 'Process customer refund',
      tags: ['Store Payments'],
      body: {
        type: 'object',
        required: ['paymentId'],
        properties: {
          paymentId: { type: 'string' },
          amount: { type: 'number' },
          reason: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                refundId: { type: 'string' },
                status: { type: 'string' },
                amount: { type: 'number' }
              }
            }
          }
        },
        404: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { paymentId, amount, reason } = refundSchema.parse(request.body)
      
      const payment = await fastify.prisma.payment.findUnique({
        where: { id: paymentId }
      })

      if (!payment) {
        return reply.status(404).send({
          success: false,
          error: 'Payment not found'
        })
      }

      if (payment.status !== 'COMPLETED') {
        return reply.status(400).send({
          success: false,
          error: 'Can only refund completed payments'
        })
      }

      const refundAmount = amount || Number(payment.amount)

      // Process refund based on gateway
      let refundId: string
      switch (payment.gateway) {
        case 'STRIPE':
          refundId = `re_test_${Date.now()}`
          break
        case 'JAZZCASH':
          refundId = `JC_REFUND_${Date.now()}`
          break
        case 'EASYPAISA':
          refundId = `EP_REFUND_${Date.now()}`
          break
        case 'BANK_TRANSFER':
          refundId = `BT_REFUND_${Date.now()}`
          break
        default:
          refundId = `REFUND_${Date.now()}`
      }

      // Update payment status
      await fastify.prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'REFUNDED',
          gatewayData: JSON.stringify({
            ...JSON.parse(payment.gatewayData || '{}'),
            refundId,
            refundAmount,
            refundReason: reason,
            refundedAt: new Date().toISOString()
          })
        }
      })

      return reply.send({
        success: true,
        data: {
          refundId,
          status: 'REFUNDED',
          amount: refundAmount
        }
      })
    } catch (error) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Invalid refund data',
          details: error.errors
        })
      }
      
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to process refund'
      })
    }
  })

  // GET /api/v1/store-payments/transactions - List customer transactions per website
  fastify.get('/transactions', {
    preHandler: [authenticate],
    schema: {
      description: 'List customer transactions per website',
      tags: ['Store Payments'],
      querystring: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' },
          customerEmail: { type: 'string' },
          status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'] },
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 20 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                transactions: { type: 'array' },
                pagination: {
                  type: 'object',
                  properties: {
                    page: { type: 'number' },
                    limit: { type: 'number' },
                    total: { type: 'number' },
                    pages: { type: 'number' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { websiteId, customerEmail, status, page = 1, limit = 20 } = request.query as any
      
      const whereClause: any = {
        purpose: 'WEBSITE_CHECKOUT'
      }
      
      if (websiteId) whereClause.websiteId = websiteId
      if (status) whereClause.status = status
      if (customerEmail) {
        whereClause.gatewayData = {
          contains: customerEmail
        }
      }

      const transactions = await fastify.prisma.payment.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })

      const total = await fastify.prisma.payment.count({
        where: whereClause
      })

      return reply.send({
        success: true,
        data: {
          transactions: transactions.map(tx => ({
            id: tx.id,
            amount: tx.amount,
            currency: tx.currency,
            status: tx.status,
            gateway: tx.gateway,
            createdAt: tx.createdAt,
            gatewayData: JSON.parse(tx.gatewayData || '{}')
          })),
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch transactions'
      })
    }
  })

  // POST /api/v1/store-payments/webhook/stripe - Store-specific Stripe webhook
  fastify.post('/webhook/stripe', {
    schema: {
      description: 'Stripe webhook for store payments',
      tags: ['Store Payments']
    }
  }, async (request, reply) => {
    try {
      const payload = request.body as any
      
      // Verify Stripe webhook signature
      // Process webhook events (payment_intent.succeeded, payment_intent.payment_failed, etc.)
      
      if (payload.type === 'payment_intent.succeeded') {
        const paymentIntent = payload.data.object
        
        // Update payment status
        await fastify.prisma.payment.updateMany({
          where: {
            gatewayId: paymentIntent.id,
            gateway: 'STRIPE'
          },
          data: {
            status: 'COMPLETED',
            gatewayData: JSON.stringify(paymentIntent)
          }
        })
      }

      return reply.send({ received: true })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Webhook processing failed'
      })
    }
  })

  // POST /api/v1/store-payments/webhook/jazzcash - Store-specific JazzCash webhook
  fastify.post('/webhook/jazzcash', {
    schema: {
      description: 'JazzCash webhook for store payments',
      tags: ['Store Payments']
    }
  }, async (request, reply) => {
    try {
      const payload = request.body as any
      
      // Process JazzCash webhook
      if (payload.status === 'SUCCESS') {
        await fastify.prisma.payment.updateMany({
          where: {
            gatewayId: payload.transactionId,
            gateway: 'JAZZCASH'
          },
          data: {
            status: 'COMPLETED',
            gatewayData: JSON.stringify(payload)
          }
        })
      }

      return reply.send({ received: true })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Webhook processing failed'
      })
    }
  })

  // POST /api/v1/store-payments/webhook/easypaisa - Store-specific EasyPaisa webhook
  fastify.post('/webhook/easypaisa', {
    schema: {
      description: 'EasyPaisa webhook for store payments',
      tags: ['Store Payments']
    }
  }, async (request, reply) => {
    try {
      const payload = request.body as any
      
      // Process EasyPaisa webhook
      if (payload.status === 'SUCCESS') {
        await fastify.prisma.payment.updateMany({
          where: {
            gatewayId: payload.transactionId,
            gateway: 'EASYPAISA'
          },
          data: {
            status: 'COMPLETED',
            gatewayData: JSON.stringify(payload)
          }
        })
      }

      return reply.send({ received: true })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Webhook processing failed'
      })
    }
  })
}
