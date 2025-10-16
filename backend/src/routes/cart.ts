import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { CartService, CartItem } from '../services/cartService'
import { authenticate } from '../middleware/auth'

// Validation schemas
const addItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  variant: z.any().optional()
})

const updateItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().min(0),
  variant: z.any().optional()
})

const removeItemSchema = z.object({
  productId: z.string(),
  variant: z.any().optional()
})

const mergeCartsSchema = z.object({
  sourceCartId: z.string(),
  targetCartId: z.string()
})

export async function cartRoutes(fastify: FastifyInstance) {
  const cartService = new CartService()

  // GET /api/v1/cart
  fastify.get('/', {
    preHandler: [authenticate],
    schema: {
      description: 'Get or create cart',
      tags: ['Cart'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          sessionId: { type: 'string' },
          websiteId: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const query = request.query as any
      
      const cart = await cartService.getOrCreateCart(
        query.userId,
        query.sessionId,
        query.websiteId
      )

      return reply.send({
        success: true,
        data: { cart },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get cart error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve cart',
          code: 'CART_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/cart
  fastify.post('/', {
    preHandler: [authenticate],
    schema: {
      description: 'Create cart',
      tags: ['Cart'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['websiteId'],
        properties: {
          userId: { type: 'string' },
          sessionId: { type: 'string' },
          websiteId: { type: 'string' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['productId', 'quantity'],
              properties: {
                productId: { type: 'string' },
                quantity: { type: 'number', minimum: 1 },
                variantId: { type: 'string' },
                metadata: { type: 'object' }
              }
            },
            default: []
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const body = request.body as any
      
      const cart = await cartService.createCart({
        userId: body.userId,
        sessionId: body.sessionId,
        websiteId: body.websiteId,
        items: body.items,
        subtotal: 0,
        total: 0
      })

      return reply.status(201).send({
        success: true,
        data: { cart },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Create cart error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to create cart',
          code: 'CART_CREATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/cart/:id
  fastify.get('/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Get cart by ID',
      tags: ['Cart'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const cart = await cartService.findById(id)
      
      if (!cart) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'Cart not found',
            code: 'CART_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
      }

      return reply.send({
        success: true,
        data: { cart },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get cart by ID error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve cart',
          code: 'CART_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/cart/:id/items
  fastify.post('/:id/items', {
    preHandler: [authenticate],
    schema: {
      description: 'Add item to cart',
      tags: ['Cart'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        required: ['productId', 'quantity'],
        properties: {
          productId: { type: 'string' },
          quantity: { type: 'number', minimum: 1 },
          variantId: { type: 'string' },
          metadata: { type: 'object' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const validatedData = request.body as any
      
      const cart = await cartService.addItem(id, validatedData as any)

      return reply.send({
        success: true,
        data: { cart },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Add item to cart error:', error)
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to add item to cart',
          code: 'CART_ADD_ITEM_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // PUT /api/v1/cart/:id/items
  fastify.put('/:id/items', {
    preHandler: [authenticate],
    schema: {
      description: 'Update item in cart',
      tags: ['Cart'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        required: ['itemId', 'quantity'],
        properties: {
          itemId: { type: 'string' },
          quantity: { type: 'number', minimum: 1 },
          metadata: { type: 'object' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const validatedData = request.body as any
      
      const cart = await cartService.updateItem(
        id,
        validatedData.productId,
        validatedData.quantity,
        validatedData.variant
      )

      return reply.send({
        success: true,
        data: { cart },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Update item in cart error:', error)
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to update item in cart',
          code: 'CART_UPDATE_ITEM_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // DELETE /api/v1/cart/:id/items
  fastify.delete('/:id/items', {
    preHandler: [authenticate],
    schema: {
      description: 'Remove item from cart',
      tags: ['Cart'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        required: ['productId'],
        properties: {
          productId: { type: 'string' },
          variant: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const validatedData = request.body as any
      
      const cart = await cartService.removeItem(
        id,
        validatedData.productId,
        validatedData.variant
      )

      return reply.send({
        success: true,
        data: { cart },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Remove item from cart error:', error)
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to remove item from cart',
          code: 'CART_REMOVE_ITEM_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // DELETE /api/v1/cart/:id
  fastify.delete('/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Clear cart',
      tags: ['Cart'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const cart = await cartService.clearCart(id)

      return reply.send({
        success: true,
        data: { cart },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Clear cart error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to clear cart',
          code: 'CART_CLEAR_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/cart/:id/merge
  fastify.post('/:id/merge', {
    preHandler: [authenticate],
    schema: {
      description: 'Merge carts',
      tags: ['Cart'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        required: ['sourceCartId'],
        properties: {
          sourceCartId: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const body = request.body as any
      
      const cart = await cartService.mergeCarts(body.sourceCartId, id)

      return reply.send({
        success: true,
        data: { cart },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Merge carts error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to merge carts',
          code: 'CART_MERGE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/cart/:id/validate
  fastify.get('/:id/validate', {
    preHandler: [authenticate],
    schema: {
      description: 'Validate cart',
      tags: ['Cart'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const validation = await cartService.validateCart(id)

      return reply.send({
        success: true,
        data: { validation },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Validate cart error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to validate cart',
          code: 'CART_VALIDATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/cart/stats
  fastify.get('/stats', {
    preHandler: [authenticate],
    schema: {
      description: 'Get cart statistics',
      tags: ['Cart'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' },
          dateFrom: { type: 'string' },
          dateTo: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const query = request.query as any
      
      const dateRange = query.dateFrom || query.dateTo ? {
        from: query.dateFrom ? new Date(query.dateFrom) : undefined,
        to: query.dateTo ? new Date(query.dateTo) : undefined
      } : undefined

      const stats = await cartService.getCartStats(query.websiteId, dateRange)

      return reply.send({
        success: true,
        data: { stats },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get cart stats error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve cart statistics',
          code: 'CART_STATS_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/cart/cleanup
  fastify.post('/cleanup', {
    preHandler: [authenticate],
    schema: {
      description: 'Cleanup expired carts',
      tags: ['Cart'],
      security: [{ bearerAuth: [] }]
    }
  }, async (request, reply) => {
    try {
      const count = await cartService.cleanupExpiredCarts()

      return reply.send({
        success: true,
        data: { cleanedCarts: count },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Cleanup expired carts error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to cleanup expired carts',
          code: 'CART_CLEANUP_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })
}
