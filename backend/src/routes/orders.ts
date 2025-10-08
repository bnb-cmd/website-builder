import { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/auth'
import { OrderService } from '@/services/orderService'
import { z } from 'zod'

const orderService = new OrderService()

const createOrderSchema = z.object({
  websiteId: z.string(),
  customerEmail: z.string().email(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string()
  }),
  billingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string()
  }).optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive()
  })),
  subtotal: z.number().positive(),
  tax: z.number().min(0).default(0),
  shipping: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  total: z.number().positive(),
  notes: z.string().optional()
})

const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  notes: z.string().optional()
})

const addTrackingSchema = z.object({
  trackingNumber: z.string(),
  carrier: z.string(),
  trackingUrl: z.string().url().optional()
})

export async function orderRoutes(fastify: FastifyInstance) {
  // GET /api/v1/orders - List all orders
  fastify.get('/', {
    preHandler: [authenticate],
    schema: {
      description: 'List all orders',
      tags: ['Orders'],
      querystring: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' },
          status: { type: 'string', enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] },
          paymentStatus: { type: 'string', enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED'] },
          customerEmail: { type: 'string' },
          dateFrom: { type: 'string', format: 'date' },
          dateTo: { type: 'string', format: 'date' },
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 20 },
          sortBy: { type: 'string', enum: ['createdAt', 'total', 'status'], default: 'createdAt' },
          sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
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
                orders: { type: 'array' },
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
      const filters = request.query as any
      
      const result = await orderService.findMany(filters)
      
      return reply.send({
        success: true,
        data: result
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch orders'
      })
    }
  })

  // GET /api/v1/orders/:id - Get order details
  fastify.get('/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Get order details',
      tags: ['Orders'],
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
      
      const order = await orderService.findById(id)
      
      if (!order) {
        return reply.status(404).send({
          success: false,
          error: 'Order not found'
        })
      }

      return reply.send({
        success: true,
        data: order
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch order'
      })
    }
  })

  // POST /api/v1/orders - Create order
  fastify.post('/', {
    preHandler: [authenticate],
    schema: {
      description: 'Create a new order',
      tags: ['Orders'],
      body: {
        type: 'object',
        required: ['websiteId', 'customerEmail', 'items', 'total'],
        properties: {
          websiteId: { type: 'string' },
          customerEmail: { type: 'string', format: 'email' },
          customerName: { type: 'string' },
          customerPhone: { type: 'string' },
          shippingAddress: {
            type: 'object',
            required: ['street', 'city', 'state', 'zipCode', 'country'],
            properties: {
              street: { type: 'string' },
              city: { type: 'string' },
              state: { type: 'string' },
              zipCode: { type: 'string' },
              country: { type: 'string' }
            }
          },
          billingAddress: {
            type: 'object',
            properties: {
              street: { type: 'string' },
              city: { type: 'string' },
              state: { type: 'string' },
              zipCode: { type: 'string' },
              country: { type: 'string' }
            }
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['productId', 'quantity', 'price'],
              properties: {
                productId: { type: 'string' },
                quantity: { type: 'number' },
                price: { type: 'number' }
              }
            }
          },
          subtotal: { type: 'number' },
          tax: { type: 'number' },
          shipping: { type: 'number' },
          discount: { type: 'number' },
          total: { type: 'number' },
          notes: { type: 'string' }
        }
      },
      response: {
        201: {
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
      const orderData = createOrderSchema.parse(request.body)
      
      const order = await orderService.create(orderData)
      
      return reply.status(201).send({
        success: true,
        data: order
      })
    } catch (error) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Invalid order data',
          details: error.errors
        })
      }
      
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to create order'
      })
    }
  })

  // PUT /api/v1/orders/:id/status - Update order status
  fastify.put('/:id/status', {
    preHandler: [authenticate],
    schema: {
      description: 'Update order status',
      tags: ['Orders'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] },
          notes: { type: 'string' }
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
      const { status, notes } = updateOrderStatusSchema.parse(request.body)
      
      const order = await orderService.updateStatus(id, status, notes)
      
      if (!order) {
        return reply.status(404).send({
          success: false,
          error: 'Order not found'
        })
      }

      return reply.send({
        success: true,
        data: order
      })
    } catch (error) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Invalid status data',
          details: error.errors
        })
      }
      
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to update order status'
      })
    }
  })

  // PUT /api/v1/orders/:id/tracking - Add tracking info
  fastify.put('/:id/tracking', {
    preHandler: [authenticate],
    schema: {
      description: 'Add tracking information to order',
      tags: ['Orders'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        required: ['trackingNumber', 'carrier'],
        properties: {
          trackingNumber: { type: 'string' },
          carrier: { type: 'string' },
          trackingUrl: { type: 'string', format: 'uri' }
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
      const trackingData = addTrackingSchema.parse(request.body)
      
      const order = await orderService.addTracking(id, trackingData)
      
      if (!order) {
        return reply.status(404).send({
          success: false,
          error: 'Order not found'
        })
      }

      return reply.send({
        success: true,
        data: order
      })
    } catch (error) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Invalid tracking data',
          details: error.errors
        })
      }
      
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to add tracking'
      })
    }
  })

  // GET /api/v1/orders/analytics - Order analytics
  fastify.get('/analytics', {
    preHandler: [authenticate],
    schema: {
      description: 'Get order analytics',
      tags: ['Orders'],
      querystring: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' },
          period: { type: 'string', enum: ['day', 'week', 'month', 'year'], default: 'month' },
          dateFrom: { type: 'string', format: 'date' },
          dateTo: { type: 'string', format: 'date' }
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
                totalOrders: { type: 'number' },
                totalRevenue: { type: 'number' },
                averageOrderValue: { type: 'number' },
                ordersByStatus: { type: 'object' },
                revenueByPeriod: { type: 'array' },
                topProducts: { type: 'array' },
                ordersByDay: { type: 'array' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const filters = request.query as any
      
      const analytics = await orderService.getAnalytics(filters)
      
      return reply.send({
        success: true,
        data: analytics
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch analytics'
      })
    }
  })
}
