import { FastifyInstance } from 'fastify'
import { SubscriptionService } from '@/services/subscriptionService'
import { PaymentService } from '@/services/paymentService'
import { PaymentGateway, PaymentPurpose } from '@prisma/client'

export async function subscriptionRoutes(fastify: FastifyInstance) {
  const subscriptionService = new SubscriptionService()
  const paymentService = new PaymentService()

  // Get all available subscriptions
  fastify.get('/subscriptions', async (request, reply) => {
    try {
      const subscriptions = await subscriptionService.getAvailableSubscriptions()
      return reply.send({
        success: true,
        data: subscriptions
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch subscriptions'
      })
    }
  })

  // Get subscription by ID
  fastify.get('/subscriptions/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const subscription = await subscriptionService.getSubscriptionWithFeatures(id)
      
      if (!subscription) {
        return reply.status(404).send({
          success: false,
          error: 'Subscription not found'
        })
      }

      return reply.send({
        success: true,
        data: subscription
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch subscription'
      })
    }
  })

  // Get default subscription
  fastify.get('/subscriptions/default', async (request, reply) => {
    try {
      const subscription = await subscriptionService.getDefaultSubscription()
      
      if (!subscription) {
        return reply.status(404).send({
          success: false,
          error: 'Default subscription not found'
        })
      }

      return reply.send({
        success: true,
        data: subscription
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch default subscription'
      })
    }
  })

  // Upgrade subscription
  fastify.post('/subscriptions/upgrade', async (request, reply) => {
    try {
      const { userId, subscriptionId, paymentGateway, customerEmail, customerPhone } = request.body as {
        userId: string
        subscriptionId: string
        paymentGateway: PaymentGateway
        customerEmail: string
        customerPhone?: string
      }

      const result = await subscriptionService.upgradeSubscription({
        userId,
        subscriptionId,
        paymentGateway,
        customerEmail,
        customerPhone
      })

      if (!result.success) {
        return reply.status(400).send({
          success: false,
          error: result.error
        })
      }

      return reply.send({
        success: true,
        data: {
          paymentId: result.paymentId,
          redirectUrl: result.redirectUrl,
          clientSecret: result.clientSecret
        }
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to upgrade subscription'
      })
    }
  })

  // Confirm subscription upgrade
  fastify.post('/subscriptions/confirm-upgrade', async (request, reply) => {
    try {
      const { paymentId } = request.body as { paymentId: string }

      const success = await subscriptionService.confirmSubscriptionUpgrade(paymentId)

      if (!success) {
        return reply.status(400).send({
          success: false,
          error: 'Failed to confirm subscription upgrade'
        })
      }

      return reply.send({
        success: true,
        message: 'Subscription upgraded successfully'
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to confirm subscription upgrade'
      })
    }
  })

  // Get user subscription limits
  fastify.get('/subscriptions/limits/:userId', async (request, reply) => {
    try {
      const { userId } = request.params as { userId: string }
      const limits = await subscriptionService.checkUserLimits(userId)

      return reply.send({
        success: true,
        data: limits
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch user limits'
      })
    }
  })

  // Reset AI quota
  fastify.post('/subscriptions/reset-ai-quota/:userId', async (request, reply) => {
    try {
      const { userId } = request.params as { userId: string }
      await subscriptionService.resetUserAIQuota(userId)

      return reply.send({
        success: true,
        message: 'AI quota reset successfully'
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to reset AI quota'
      })
    }
  })

  // Get subscription analytics (admin only)
  fastify.get('/subscriptions/analytics', async (request, reply) => {
    try {
      // TODO: Add admin authentication check
      const analytics = await subscriptionService.getSubscriptionAnalytics()

      return reply.send({
        success: true,
        data: analytics
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch subscription analytics'
      })
    }
  })

  // Initialize default subscriptions (admin only)
  fastify.post('/subscriptions/initialize', async (request, reply) => {
    try {
      // TODO: Add admin authentication check
      await subscriptionService.initializeDefaultSubscriptions()

      return reply.send({
        success: true,
        message: 'Default subscriptions initialized successfully'
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to initialize subscriptions'
      })
    }
  })

  // Payment webhook handlers
  fastify.post('/subscriptions/webhook/jazzcash', async (request, reply) => {
    try {
      const payload = JSON.stringify(request.body)
      const signature = request.headers['x-jazzcash-signature'] as string

      // Process JazzCash webhook
      const result = await paymentService.confirmPayment(
        request.body?.pp_TxnRefNo,
        request.body
      )

      return reply.send({
        success: result.success,
        message: result.success ? 'Payment confirmed' : 'Payment failed'
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Webhook processing failed'
      })
    }
  })

  fastify.post('/subscriptions/webhook/easypaisa', async (request, reply) => {
    try {
      const payload = JSON.stringify(request.body)
      const signature = request.headers['x-easypaisa-signature'] as string

      // Process EasyPaisa webhook
      const result = await paymentService.confirmPayment(
        request.body?.transactionId,
        request.body
      )

      return reply.send({
        success: result.success,
        message: result.success ? 'Payment confirmed' : 'Payment failed'
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Webhook processing failed'
      })
    }
  })

  fastify.post('/subscriptions/webhook/stripe', async (request, reply) => {
    try {
      const payload = JSON.stringify(request.body)
      const signature = request.headers['stripe-signature'] as string

      await paymentService.handleStripeWebhook(payload, signature)

      return reply.send({
        success: true,
        message: 'Webhook processed successfully'
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Webhook processing failed'
      })
    }
  })
}
