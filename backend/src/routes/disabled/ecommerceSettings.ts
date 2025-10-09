import { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/auth'
import { z } from 'zod'

const ecommerceSettingsSchema = z.object({
  storeName: z.string().optional(),
  storeDescription: z.string().optional(),
  currency: z.string().default('PKR'),
  taxRate: z.number().min(0).max(100).default(0),
  shippingEnabled: z.boolean().default(true),
  
  // Payment gateways
  stripeEnabled: z.boolean().default(false),
  stripePublicKey: z.string().optional(),
  stripeSecretKey: z.string().optional(),
  jazzcashEnabled: z.boolean().default(false),
  jazzcashMerchantId: z.string().optional(),
  jazzcashSecretKey: z.string().optional(),
  easypaisaEnabled: z.boolean().default(false),
  easypaisaMerchantId: z.string().optional(),
  easypaisaSecretKey: z.string().optional(),
  
  // Shipping
  freeShippingThreshold: z.number().min(0).optional(),
  flatShippingRate: z.number().min(0).optional(),
  localDeliveryEnabled: z.boolean().default(false),
  
  // Inventory
  lowStockAlert: z.boolean().default(true),
  lowStockThreshold: z.number().int().min(0).default(10),
  
  // Cart & Checkout
  guestCheckoutEnabled: z.boolean().default(true),
  cartAbandonmentEmail: z.boolean().default(false),
  
  // Email settings
  orderConfirmationEmail: z.boolean().default(true),
  shippingNotificationEmail: z.boolean().default(true)
})

export async function ecommerceSettingsRoutes(fastify: FastifyInstance) {
  // GET /api/v1/websites/:id/ecommerce/settings - Get e-commerce settings
  fastify.get('/:id/ecommerce/settings', {
    preHandler: [authenticate],
    schema: {
      description: 'Get e-commerce settings for a website',
      tags: ['E-commerce Settings'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' }
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
      const { id } = request.params as { id: string }
      
      const settings = await fastify.prisma.websiteEcommerceSettings.findUnique({
        where: { websiteId: id }
      })
      
      if (!settings) {
        return reply.status(404).send({
          success: false,
          error: 'E-commerce settings not found'
        })
      }

      return reply.send({
        success: true,
        data: settings
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch e-commerce settings'
      })
    }
  })

  // PUT /api/v1/websites/:id/ecommerce/settings - Update e-commerce settings
  fastify.put('/:id/ecommerce/settings', {
    preHandler: [authenticate],
    schema: {
      description: 'Update e-commerce settings for a website',
      tags: ['E-commerce Settings'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        properties: {
          storeName: { type: 'string' },
          storeDescription: { type: 'string' },
          currency: { type: 'string' },
          taxRate: { type: 'number' },
          shippingEnabled: { type: 'boolean' },
          stripeEnabled: { type: 'boolean' },
          stripePublicKey: { type: 'string' },
          stripeSecretKey: { type: 'string' },
          jazzcashEnabled: { type: 'boolean' },
          jazzcashMerchantId: { type: 'string' },
          jazzcashSecretKey: { type: 'string' },
          easypaisaEnabled: { type: 'boolean' },
          easypaisaMerchantId: { type: 'string' },
          easypaisaSecretKey: { type: 'string' },
          freeShippingThreshold: { type: 'number' },
          flatShippingRate: { type: 'number' },
          localDeliveryEnabled: { type: 'boolean' },
          lowStockAlert: { type: 'boolean' },
          lowStockThreshold: { type: 'number' },
          guestCheckoutEnabled: { type: 'boolean' },
          cartAbandonmentEmail: { type: 'boolean' },
          orderConfirmationEmail: { type: 'boolean' },
          shippingNotificationEmail: { type: 'boolean' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' }
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
      const { id } = request.params as { id: string }
      const settingsData = ecommerceSettingsSchema.parse(request.body)
      
      const settings = await fastify.prisma.websiteEcommerceSettings.upsert({
        where: { websiteId: id },
        update: settingsData,
        create: {
          websiteId: id,
          ...settingsData
        }
      })

      return reply.send({
        success: true,
        data: settings
      })
    } catch (error) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Invalid settings data',
          details: error.errors
        })
      }
      
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to update e-commerce settings'
      })
    }
  })

  // POST /api/v1/websites/:id/ecommerce/enable - Enable e-commerce
  fastify.post('/:id/ecommerce/enable', {
    preHandler: [authenticate],
    schema: {
      description: 'Enable e-commerce for a website',
      tags: ['E-commerce Settings'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const settings = await fastify.prisma.websiteEcommerceSettings.upsert({
        where: { websiteId: id },
        update: {
          shippingEnabled: true,
          guestCheckoutEnabled: true,
          orderConfirmationEmail: true,
          shippingNotificationEmail: true
        },
        create: {
          websiteId: id,
          shippingEnabled: true,
          guestCheckoutEnabled: true,
          orderConfirmationEmail: true,
          shippingNotificationEmail: true
        }
      })

      return reply.send({
        success: true,
        data: settings
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to enable e-commerce'
      })
    }
  })

  // POST /api/v1/websites/:id/ecommerce/disable - Disable e-commerce
  fastify.post('/:id/ecommerce/disable', {
    preHandler: [authenticate],
    schema: {
      description: 'Disable e-commerce for a website',
      tags: ['E-commerce Settings'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const settings = await fastify.prisma.websiteEcommerceSettings.update({
        where: { websiteId: id },
        data: {
          shippingEnabled: false,
          stripeEnabled: false,
          jazzcashEnabled: false,
          easypaisaEnabled: false
        }
      })

      return reply.send({
        success: true,
        data: settings
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to disable e-commerce'
      })
    }
  })
}
