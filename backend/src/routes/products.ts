import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { ProductService, CreateProductData, UpdateProductData } from '../services/productService'
import { authenticate } from '../middleware/auth'
import { ProductStatus } from '@prisma/client'

// Validation schemas
const createProductSchema = z.object({
  websiteId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  sku: z.string().optional(),
  trackInventory: z.boolean().default(false),
  inventory: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  images: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).default('ACTIVE')
})

const updateProductSchema = createProductSchema.partial().omit({ websiteId: true })

const bulkUpdateSchema = z.object({
  productIds: z.array(z.string()),
  updates: z.object({
    status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).optional(),
    inventory: z.number().int().min(0).optional(),
    price: z.number().positive().optional()
  })
})

const inventoryUpdateSchema = z.object({
  quantity: z.number().int(),
  operation: z.enum(['add', 'subtract', 'set']),
  reason: z.string().optional()
})

export async function productRoutes(fastify: FastifyInstance) {
  const productService = new ProductService()

  // GET /api/v1/products
  fastify.get('/', {
    schema: {
      description: 'List products',
      tags: ['Products'],
      querystring: z.object({
        page: z.string().transform(Number).default('1'),
        limit: z.string().transform(Number).default('20'),
        websiteId: z.string().optional(),
        status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).optional(),
        priceMin: z.string().transform(Number).optional(),
        priceMax: z.string().transform(Number).optional(),
        inStock: z.string().transform(val => val === 'true').optional(),
        search: z.string().optional(),
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
      if (query.status) filters.status = query.status
      if (query.priceMin !== undefined) filters.priceMin = query.priceMin
      if (query.priceMax !== undefined) filters.priceMax = query.priceMax
      if (query.inStock !== undefined) filters.inStock = query.inStock
      if (query.search) filters.search = query.search

      const result = await productService.findMany(filters)

      return reply.send({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('List products error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve products',
          code: 'PRODUCTS_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/products/:id
  fastify.get('/:id', {
    schema: {
      description: 'Get product details',
      tags: ['Products'],
      params: z.object({
        id: z.string()
      })
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const product = await productService.findById(id)
      
      if (!product) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'Product not found',
            code: 'PRODUCT_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
      }

      return reply.send({
        success: true,
        data: { product },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get product error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve product',
          code: 'PRODUCT_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/products
  fastify.post('/', {
    preHandler: [authenticate],
    schema: {
      description: 'Create a new product',
      tags: ['Products'],
      security: [{ bearerAuth: [] }],
      body: createProductSchema
    }
  }, async (request, reply) => {
    try {
      const validatedData = createProductSchema.parse(request.body)
      
      const product = await productService.createProduct(validatedData as any)

      return reply.status(201).send({
        success: true,
        data: { product },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Create product error:', error)
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
          message: 'Failed to create product',
          code: 'PRODUCT_CREATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // PUT /api/v1/products/:id
  fastify.put('/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Update product',
      tags: ['Products'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        id: z.string()
      }),
      body: updateProductSchema
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const validatedData = updateProductSchema.parse(request.body)
      
      const product = await productService.updateProduct(id, validatedData)

      return reply.send({
        success: true,
        data: { product },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Update product error:', error)
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
          message: 'Failed to update product',
          code: 'PRODUCT_UPDATE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // DELETE /api/v1/products/:id
  fastify.delete('/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Delete product',
      tags: ['Products'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        id: z.string()
      })
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const success = await productService.delete(id)

      if (!success) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'Failed to delete product',
            code: 'PRODUCT_DELETION_FAILED',
            timestamp: new Date().toISOString()
          }
        })
      }

      return reply.send({
        success: true,
        data: { message: 'Product deleted successfully' },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Delete product error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to delete product',
          code: 'PRODUCT_DELETION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // PUT /api/v1/products/:id/inventory
  fastify.put('/:id/inventory', {
    preHandler: [authenticate],
    schema: {
      description: 'Update product inventory',
      tags: ['Products'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        id: z.string()
      }),
      body: inventoryUpdateSchema
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const validatedData = inventoryUpdateSchema.parse(request.body)
      
      const product = await productService.updateInventory(
        id,
        validatedData.quantity,
        validatedData.operation
      )

      return reply.send({
        success: true,
        data: { product },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Update inventory error:', error)
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
          message: 'Failed to update inventory',
          code: 'INVENTORY_UPDATE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // PUT /api/v1/products/:id/publish
  fastify.put('/:id/publish', {
    preHandler: [authenticate],
    schema: {
      description: 'Publish product',
      tags: ['Products'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        id: z.string()
      })
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const product = await productService.publish(id)

      return reply.send({
        success: true,
        data: { product },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Publish product error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to publish product',
          code: 'PRODUCT_PUBLISH_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // PUT /api/v1/products/:id/unpublish
  fastify.put('/:id/unpublish', {
    preHandler: [authenticate],
    schema: {
      description: 'Unpublish product',
      tags: ['Products'],
      security: [{ bearerAuth: [] }],
      params: z.object({
        id: z.string()
      })
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      
      const product = await productService.unpublish(id)

      return reply.send({
        success: true,
        data: { product },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Unpublish product error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to unpublish product',
          code: 'PRODUCT_UNPUBLISH_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/products/search/:query
  fastify.get('/search/:query', {
    schema: {
      description: 'Search products',
      tags: ['Products'],
      params: z.object({
        query: z.string()
      }),
      querystring: z.object({
        websiteId: z.string(),
        category: z.string().optional(),
        priceMin: z.string().transform(Number).optional(),
        priceMax: z.string().transform(Number).optional(),
        inStock: z.string().transform(val => val === 'true').optional()
      })
    }
  }, async (request, reply) => {
    try {
      const { query } = request.params as { query: string }
      const queryParams = request.query as any
      
      const filters: any = {}
      if (queryParams.category) filters.category = queryParams.category
      if (queryParams.priceMin !== undefined) filters.priceMin = queryParams.priceMin
      if (queryParams.priceMax !== undefined) filters.priceMax = queryParams.priceMax
      if (queryParams.inStock !== undefined) filters.inStock = queryParams.inStock

      const products = await productService.searchProducts(queryParams.websiteId, query, filters)

      return reply.send({
        success: true,
        data: { products },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Search products error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to search products',
          code: 'PRODUCTS_SEARCH_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/products/featured
  fastify.get('/featured', {
    schema: {
      description: 'Get featured products',
      tags: ['Products'],
      querystring: z.object({
        websiteId: z.string(),
        limit: z.string().transform(Number).default('8')
      })
    }
  }, async (request, reply) => {
    try {
      const query = request.query as any
      
      const products = await productService.getFeaturedProducts(query.websiteId, query.limit)

      return reply.send({
        success: true,
        data: { products },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get featured products error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve featured products',
          code: 'FEATURED_PRODUCTS_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/products/:id/related
  fastify.get('/:id/related', {
    schema: {
      description: 'Get related products',
      tags: ['Products'],
      params: z.object({
        id: z.string()
      }),
      querystring: z.object({
        limit: z.string().transform(Number).default('4')
      })
    }
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const query = request.query as any
      
      const products = await productService.getRelatedProducts(id, query.limit)

      return reply.send({
        success: true,
        data: { products },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get related products error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve related products',
          code: 'RELATED_PRODUCTS_RETRIEVAL_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/products/stats
  fastify.get('/stats', {
    preHandler: [authenticate],
    schema: {
      description: 'Get product statistics',
      tags: ['Products'],
      security: [{ bearerAuth: [] }],
      querystring: z.object({
        websiteId: z.string()
      })
    }
  }, async (request, reply) => {
    try {
      const query = request.query as any
      
      const stats = await productService.getProductStats(query.websiteId)

      return reply.send({
        success: true,
        data: { stats },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Get product stats error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to retrieve product statistics',
          code: 'PRODUCT_STATS_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/products/bulk-update
  fastify.post('/bulk-update', {
    preHandler: [authenticate],
    schema: {
      description: 'Bulk update products',
      tags: ['Products'],
      security: [{ bearerAuth: [] }],
      body: bulkUpdateSchema
    }
  }, async (request, reply) => {
    try {
      const validatedData = bulkUpdateSchema.parse(request.body)
      
      const result = await productService.bulkUpdateByIds(validatedData.productIds, validatedData.updates)

      return reply.send({
        success: true,
        data: { result },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Bulk update products error:', error)
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
          message: 'Failed to bulk update products',
          code: 'BULK_UPDATE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })
}
