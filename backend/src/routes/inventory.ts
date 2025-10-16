import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { InventoryService, InventoryTransaction } from '../services/inventoryService'
import { authenticate } from '../middleware/auth'

// Validation schemas
const createTransactionSchema = z.object({
  productId: z.string(),
  type: z.enum(['IN', 'OUT', 'ADJUSTMENT', 'RETURN', 'DAMAGE', 'LOSS']),
  quantity: z.number().int(),
  reason: z.string().optional(),
  reference: z.string().optional(),
  notes: z.string().optional(),
  cost: z.number().positive().optional()
})

const bulkAdjustmentSchema = z.object({
  adjustments: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int(),
    reason: z.string().optional()
  }))
})

const bulkReceiptSchema = z.object({
  receipts: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int(),
    cost: z.number().positive().optional(),
    reference: z.string().optional()
  }))
})

const reserveInventorySchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  orderId: z.string()
})

export async function inventoryRoutes(fastify: FastifyInstance) {
  const inventoryService = new InventoryService()

  // POST /api/v1/inventory/transactions
  fastify.post('/transactions', {
    preHandler: [authenticate],
    schema: {
      description: 'Record inventory transaction',
      tags: ['Inventory'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['productId', 'type', 'quantity'],
        properties: {
          productId: { type: 'string' },
          type: { type: 'string', enum: ['IN', 'OUT', 'ADJUSTMENT', 'TRANSFER'] },
          quantity: { type: 'number', minimum: 1 },
          reason: { type: 'string' },
          reference: { type: 'string' },
          metadata: { type: 'object' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const validatedData = request.body as any
      
      const transaction = await inventoryService.recordTransaction(validatedData as any)

      return reply.status(201).send({
        success: true,
        data: { transaction },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Record inventory transaction error:', error)
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to record inventory transaction',
          code: 'INVENTORY_TRANSACTION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/inventory/transactions
  fastify.get('/transactions', {
    preHandler: [authenticate],
    schema: {
      description: 'List inventory transactions',
      tags: ['Inventory'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'string', default: '1' },
          limit: { type: 'string', default: '20' },
          productId: { type: 'string' },
          websiteId: { type: 'string' },
          type: { type: 'string', enum: ['IN', 'OUT', 'ADJUSTMENT', 'RETURN', 'DAMAGE', 'LOSS'] },
          dateFrom: { type: 'string' },
          dateTo: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const query = request.query as any
      
      const filters: any = {
        productId: query.productId,
        websiteId: query.websiteId,
        type: query.type,
        dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
        dateTo: query.dateTo ? new Date(query.dateTo) : undefined
      }

      const result = await inventoryService.findMany(filters)

      return reply.send({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('List inventory transactions error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve inventory transactions',
          code: 'INVENTORY_TRANSACTIONS_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/inventory/transactions/:id
  fastify.get('/transactions/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Get inventory transaction details',
      tags: ['Inventory'],
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
      
      const transaction = await inventoryService.findById(id)
      
      if (!transaction) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'Inventory transaction not found',
            code: 'INVENTORY_TRANSACTION_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
      }

      return reply.send({
        success: true,
        data: { transaction },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get inventory transaction error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve inventory transaction',
          code: 'INVENTORY_TRANSACTION_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/inventory/reserve
  fastify.post('/reserve', {
    preHandler: [authenticate],
    schema: {
      description: 'Reserve inventory for order',
      tags: ['Inventory'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['productId', 'quantity', 'orderId'],
        properties: {
          productId: { type: 'string' },
          quantity: { type: 'number', minimum: 1 },
          orderId: { type: 'string' },
          expiresAt: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const validatedData = request.body as any
      
      const success = await inventoryService.reserveInventory(
        validatedData.productId,
        validatedData.quantity,
        validatedData.orderId
      )

      if (!success) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'Insufficient inventory or product not found',
            code: 'INVENTORY_RESERVE_FAILED',
            timestamp: new Date().toISOString()
          }
        })
      }

      return reply.send({
        success: true,
        data: { message: 'Inventory reserved successfully' },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Reserve inventory error:', error)
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to reserve inventory',
          code: 'INVENTORY_RESERVE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/inventory/release
  fastify.post('/release', {
    preHandler: [authenticate],
    schema: {
      description: 'Release inventory reservation',
      tags: ['Inventory'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['orderId'],
        properties: {
          orderId: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const body = request.body as any
      
      await inventoryService.releaseReservation(body.orderId)

      return reply.send({
        success: true,
        data: { message: 'Inventory reservation released successfully' },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Release inventory reservation error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to release inventory reservation',
          code: 'INVENTORY_RELEASE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/inventory/fulfill
  fastify.post('/fulfill', {
    preHandler: [authenticate],
    schema: {
      description: 'Fulfill inventory reservation',
      tags: ['Inventory'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['orderId'],
        properties: {
          orderId: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const body = request.body as any
      
      await inventoryService.fulfillReservation(body.orderId)

      return reply.send({
        success: true,
        data: { message: 'Inventory reservation fulfilled successfully' },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Fulfill inventory reservation error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to fulfill inventory reservation',
          code: 'INVENTORY_FULFILL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/inventory/alerts
  fastify.get('/alerts', {
    preHandler: [authenticate],
    schema: {
      description: 'Get inventory alerts',
      tags: ['Inventory'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const query = request.query as any
      
      const alerts = await inventoryService.getAllAlerts(query.websiteId)

      return reply.send({
        success: true,
        data: { alerts },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get inventory alerts error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve inventory alerts',
          code: 'INVENTORY_ALERTS_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/inventory/report
  fastify.get('/report', {
    preHandler: [authenticate],
    schema: {
      description: 'Get inventory report',
      tags: ['Inventory'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const query = request.query as any
      
      const report = await inventoryService.getInventoryReport(query.websiteId)

      return reply.send({
        success: true,
        data: { report },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get inventory report error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve inventory report',
          code: 'INVENTORY_REPORT_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/inventory/movements/:productId
  fastify.get('/movements/:productId', {
    preHandler: [authenticate],
    schema: {
      description: 'Get product inventory movements',
      tags: ['Inventory'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['productId'],
        properties: {
          productId: { type: 'string' }
        }
      },
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'string', default: '50' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { productId } = request.params as { productId: string }
      const query = request.query as any
      
      const movements = await inventoryService.getInventoryMovements(productId, query.limit)

      return reply.send({
        success: true,
        data: { movements },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get inventory movements error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve inventory movements',
          code: 'INVENTORY_MOVEMENTS_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/inventory/bulk-adjust
  fastify.post('/bulk-adjust', {
    preHandler: [authenticate],
    schema: {
      description: 'Bulk adjust inventory',
      tags: ['Inventory'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['adjustments'],
        properties: {
          adjustments: {
            type: 'array',
            items: {
              type: 'object',
              required: ['productId', 'quantity', 'type'],
              properties: {
                productId: { type: 'string' },
                quantity: { type: 'number', minimum: 1 },
                type: { type: 'string', enum: ['IN', 'OUT', 'ADJUSTMENT'] },
                reason: { type: 'string' },
                reference: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const validatedData = request.body as any
      
      await inventoryService.bulkAdjustInventory(validatedData.adjustments as any)

      return reply.send({
        success: true,
        data: { message: 'Bulk inventory adjustment completed successfully' },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Bulk adjust inventory error:', error)
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to bulk adjust inventory',
          code: 'BULK_INVENTORY_ADJUST_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/inventory/bulk-receive
  fastify.post('/bulk-receive', {
    preHandler: [authenticate],
    schema: {
      description: 'Bulk receive inventory',
      tags: ['Inventory'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['receipts'],
        properties: {
          receipts: {
            type: 'array',
            items: {
              type: 'object',
              required: ['productId', 'quantity', 'supplier'],
              properties: {
                productId: { type: 'string' },
                quantity: { type: 'number', minimum: 1 },
                supplier: { type: 'string' },
                cost: { type: 'number', minimum: 0 },
                batchNumber: { type: 'string' },
                expiryDate: { type: 'string' },
                notes: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const validatedData = request.body as any
      
      await inventoryService.bulkReceiveInventory(validatedData.receipts as any)

      return reply.send({
        success: true,
        data: { message: 'Bulk inventory receipt completed successfully' },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Bulk receive inventory error:', error)
      
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to bulk receive inventory',
          code: 'BULK_INVENTORY_RECEIPT_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/inventory/analytics
  fastify.get('/analytics', {
    preHandler: [authenticate],
    schema: {
      description: 'Get inventory analytics',
      tags: ['Inventory'],
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

      const analytics = await inventoryService.getInventoryAnalytics(query.websiteId, dateRange)

      return reply.send({
        success: true,
        data: { analytics },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get inventory analytics error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve inventory analytics',
          code: 'INVENTORY_ANALYTICS_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })
}
