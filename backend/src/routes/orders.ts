import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { OrderService, CreateOrderData, UpdateOrderData } from '../services/orderService'
import { authenticate } from '../middleware/auth'
import { PaymentStatus, ShippingStatus } from '@prisma/client'

// Validation schemas
const createOrderSchema = z.object({
  websiteId: z.string(),
  customerEmail: z.string().email(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  shippingAddress: z.object({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string()
  }),
  billingAddress: z.object({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
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

const updateOrderSchema = z.object({
  customerEmail: z.string().email().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  shippingAddress: z.any().optional(),
  billingAddress: z.any().optional(),
  paymentStatus: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED']).optional(),
  shippingStatus: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
  trackingNumber: z.string().optional(),
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
  const orderService = new OrderService()

  // POST /api/v1/orders
  fastify.post('/', {
    preHandler: [authenticate],
    schema: {
      description: 'Create a new order',
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['customerEmail', 'items'],
        properties: {
          customerEmail: { type: 'string', format: 'email' },
          items: { type: 'array', items: { type: 'object' } },
          shippingAddress: { type: 'object' },
          billingAddress: { type: 'object' },
          paymentMethod: { type: 'string' },
          notes: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const validatedData = createOrderSchema.parse(request.body)
      
      const order = await orderService.createOrder(validatedData as any)

      return reply.status(201).send({
        success: true,
        data: { order },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Create order error:', error)
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
          message: 'Failed to create order',
          code: 'ORDER_CREATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/orders
  fastify.get('/', {
    preHandler: [authenticate],
    schema: {
      description: 'List orders',
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      querystring: z.object({
        page: z.string().transform(Number).default('1'),
        limit: z.string().transform(Number).default('20'),
        websiteId: z.string().optional(),
        customerEmail: z.string().email().optional(),
        paymentStatus: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED']).optional(),
        shippingStatus: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
        search: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        sortBy: z.string().default('createdAt'),
        sortOrder: z.enum(['asc', 'desc']).default('desc')
      })
    }
  }, async (request, reply) => {
    try {
      const query = request.query as any
      
      const filters: any = {
        page: query.page,
        limit: query.limit,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder
      }

      if (query.websiteId) filters.websiteId = query.websiteId
      if (query.customerEmail) filters.customerEmail = query.customerEmail
      if (query.paymentStatus) filters.paymentStatus = query.paymentStatus
      if (query.shippingStatus) filters.shippingStatus = query.shippingStatus
      if (query.search) filters.search = query.search
      if (query.dateFrom || query.dateTo) {
        filters.dateFrom = query.dateFrom ? new Date(query.dateFrom) : undefined
        filters.dateTo = query.dateTo ? new Date(query.dateTo) : undefined
      }

      const result = await orderService.findMany(filters)

      return reply.send({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('List orders error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve orders',
          code: 'ORDERS_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/orders/:id
  fastify.get('/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Get order details',
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        id: z.string()
      })
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const order = await orderService.findByIdWithDetails(id)
      
      if (!order) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'Order not found',
            code: 'ORDER_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
      }

      return reply.send({
        success: true,
        data: { order },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get order error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve order',
          code: 'ORDER_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/orders/number/:orderNumber
  fastify.get('/number/:orderNumber', {
    preHandler: [authenticate],
    schema: {
      description: 'Get order by order number',
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        orderNumber: z.string()
      })
    }
  }, async (request, reply) => {
    try {
      const { orderNumber } = request.params as { orderNumber: string }
      
      const order = await orderService.findByOrderNumber(orderNumber)
      
      if (!order) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'Order not found',
            code: 'ORDER_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
      }

      return reply.send({
        success: true,
        data: { order },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get order by number error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve order',
          code: 'ORDER_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // PUT /api/v1/orders/:id
  fastify.put('/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Update order',
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        id: z.string()
      }),
      body: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          notes: { type: 'string' },
          shippingAddress: { type: 'object' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const validatedData = updateOrderSchema.parse(request.body)
      
      const order = await orderService.update(id, validatedData)

      return reply.send({
        success: true,
        data: { order },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Update order error:', error)
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
          message: 'Failed to update order',
          code: 'ORDER_UPDATE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // PUT /api/v1/orders/:id/status
  fastify.put('/:id/status', {
    preHandler: [authenticate],
    schema: {
      description: 'Update order status',
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        id: z.string()
      }),
      body: updateOrderStatusSchema
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const validatedData = updateOrderStatusSchema.parse(request.body)
      
      const order = await orderService.updateStatus(id, validatedData.status as ShippingStatus, validatedData.notes)

      return reply.send({
        success: true,
        data: { order },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Update order status error:', error)
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
          message: 'Failed to update order status',
          code: 'ORDER_STATUS_UPDATE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // PUT /api/v1/orders/:id/tracking
  fastify.put('/:id/tracking', {
    preHandler: [authenticate],
    schema: {
      description: 'Add tracking information',
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        id: z.string()
      }),
      body: addTrackingSchema
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const validatedData = addTrackingSchema.parse(request.body)
      
      const order = await orderService.addTracking(id, validatedData as any)

      return reply.send({
        success: true,
        data: { order },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Add tracking error:', error)
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
          message: 'Failed to add tracking information',
          code: 'TRACKING_UPDATE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // DELETE /api/v1/orders/:id
  fastify.delete('/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Cancel order',
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        id: z.string()
      })
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const success = await orderService.delete(id)

      if (!success) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'Failed to cancel order',
            code: 'ORDER_CANCELLATION_FAILED',
            timestamp: new Date().toISOString()
          }
        })
      }

      return reply.send({
        success: true,
        data: { message: 'Order cancelled successfully' },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Cancel order error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to cancel order',
          code: 'ORDER_CANCELLATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/orders/customer/:email
  fastify.get('/customer/:email', {
    preHandler: [authenticate],
    schema: {
      description: 'Get customer orders',
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        email: z.string().email()
      }),
      querystring: z.object({
        websiteId: z.string().optional()
      })
    }
  }, async (request, reply) => {
    try {
      const { email } = request.params as { email: string }
      const query = request.query as any
      
      const orders = await orderService.getCustomerOrders(email, query.websiteId)

      return reply.send({
        success: true,
        data: { orders },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get customer orders error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve customer orders',
          code: 'CUSTOMER_ORDERS_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/orders/search/:query
  fastify.get('/search/:query', {
    preHandler: [authenticate],
    schema: {
      description: 'Search orders',
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        query: z.string()
      }),
      querystring: z.object({
        websiteId: z.string()
      })
    }
  }, async (request, reply) => {
    try {
      const { query } = request.params as { query: string }
      const { websiteId } = request.query as { websiteId: string }
      
      const orders = await orderService.searchOrders(websiteId, query)

      return reply.send({
        success: true,
        data: { orders },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Search orders error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to search orders',
          code: 'ORDERS_SEARCH_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/orders/stats
  fastify.get('/stats', {
    preHandler: [authenticate],
    schema: {
      description: 'Get order statistics',
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      querystring: z.object({
        websiteId: z.string(),
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

      const stats = await orderService.getOrderStats(query.websiteId, dateRange)

      return reply.send({
        success: true,
        data: { stats },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get order stats error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve order statistics',
          code: 'ORDER_STATS_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/orders/:id/calculate-total
  fastify.post('/:id/calculate-total', {
    preHandler: [authenticate],
    schema: {
      description: 'Calculate order total',
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        id: z.string()
      }),
      body: z.object({
        items: z.array(z.object({
          productId: z.string(),
          quantity: z.number().int().positive()
        })),
        shippingAddress: z.object({
          city: z.string(),
          country: z.string()
        })
      })
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const body = request.body as any
      
      const order = await orderService.findById(id)
      if (!order) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'Order not found',
            code: 'ORDER_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
      }

      const totals = await orderService.calculateOrderTotal(
        body.items,
        order.websiteId,
        body.shippingAddress
      )

      return reply.send({
        success: true,
        data: { totals },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Calculate order total error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to calculate order total',
          code: 'ORDER_TOTAL_CALCULATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })
}
