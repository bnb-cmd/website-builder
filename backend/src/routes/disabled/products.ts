import { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/auth'
import { ProductService } from '@/services/productService'
import { z } from 'zod'

const productService = new ProductService()

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
  allowBackorder: z.boolean().default(false),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).default('ACTIVE'),
  hasVariants: z.boolean().default(false),
  variants: z.any().optional(),
  weight: z.number().positive().optional(),
  dimensions: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
    height: z.number().positive()
  }).optional()
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

export async function productRoutes(fastify: FastifyInstance) {
  // GET /api/v1/products - List all products
  fastify.get('/', {
    preHandler: [authenticate],
    schema: {
      description: 'List all products',
      tags: ['Products'],
      querystring: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'] },
          search: { type: 'string' },
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 20 },
          sortBy: { type: 'string', enum: ['name', 'price', 'createdAt', 'updatedAt'], default: 'createdAt' },
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
                products: { type: 'array' },
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
      const { websiteId, status, search, page, limit, sortBy, sortOrder } = request.query as any
      
      const filters = {
        websiteId,
        status,
        search,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
        sortBy: sortBy || 'createdAt',
        sortOrder: sortOrder || 'desc'
      }

      const result = await productService.findMany(filters)
      
      return reply.send({
        success: true,
        data: result
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch products'
      })
    }
  })

  // GET /api/v1/products/:id - Get product details
  fastify.get('/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Get product details',
      tags: ['Products'],
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
      
      const product = await productService.findById(id)
      
      if (!product) {
        return reply.status(404).send({
          success: false,
          error: 'Product not found'
        })
      }

      return reply.send({
        success: true,
        data: product
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch product'
      })
    }
  })

  // POST /api/v1/products - Create product
  fastify.post('/', {
    preHandler: [authenticate],
    schema: {
      description: 'Create a new product',
      tags: ['Products'],
      body: {
        type: 'object',
        required: ['websiteId', 'name', 'price'],
        properties: {
          websiteId: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          comparePrice: { type: 'number' },
          sku: { type: 'string' },
          trackInventory: { type: 'boolean' },
          inventory: { type: 'number' },
          lowStockThreshold: { type: 'number' },
          allowBackorder: { type: 'boolean' },
          images: { type: 'array', items: { type: 'string' } },
          videos: { type: 'array', items: { type: 'string' } },
          metaTitle: { type: 'string' },
          metaDescription: { type: 'string' },
          metaKeywords: { type: 'array', items: { type: 'string' } },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'] },
          hasVariants: { type: 'boolean' },
          variants: { type: 'object' },
          weight: { type: 'number' },
          dimensions: {
            type: 'object',
            properties: {
              length: { type: 'number' },
              width: { type: 'number' },
              height: { type: 'number' }
            }
          }
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
      const productData = createProductSchema.parse(request.body)
      
      const product = await productService.create(productData)
      
      return reply.status(201).send({
        success: true,
        data: product
      })
    } catch (error) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Invalid product data',
          details: error.errors
        })
      }
      
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to create product'
      })
    }
  })

  // PUT /api/v1/products/:id - Update product
  fastify.put('/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Update a product',
      tags: ['Products'],
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
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          comparePrice: { type: 'number' },
          sku: { type: 'string' },
          trackInventory: { type: 'boolean' },
          inventory: { type: 'number' },
          lowStockThreshold: { type: 'number' },
          allowBackorder: { type: 'boolean' },
          images: { type: 'array', items: { type: 'string' } },
          videos: { type: 'array', items: { type: 'string' } },
          metaTitle: { type: 'string' },
          metaDescription: { type: 'string' },
          metaKeywords: { type: 'array', items: { type: 'string' } },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'] },
          hasVariants: { type: 'boolean' },
          variants: { type: 'object' },
          weight: { type: 'number' },
          dimensions: {
            type: 'object',
            properties: {
              length: { type: 'number' },
              width: { type: 'number' },
              height: { type: 'number' }
            }
          }
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
      const updateData = updateProductSchema.parse(request.body)
      
      const product = await productService.update(id, updateData)
      
      if (!product) {
        return reply.status(404).send({
          success: false,
          error: 'Product not found'
        })
      }

      return reply.send({
        success: true,
        data: product
      })
    } catch (error) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Invalid product data',
          details: error.errors
        })
      }
      
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to update product'
      })
    }
  })

  // DELETE /api/v1/products/:id - Delete product
  fastify.delete('/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Delete a product',
      tags: ['Products'],
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
            message: { type: 'string' }
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
      
      const deleted = await productService.delete(id)
      
      if (!deleted) {
        return reply.status(404).send({
          success: false,
          error: 'Product not found'
        })
      }

      return reply.send({
        success: true,
        message: 'Product deleted successfully'
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to delete product'
      })
    }
  })

  // POST /api/v1/products/:id/variants - Add product variants
  fastify.post('/:id/variants', {
    preHandler: [authenticate],
    schema: {
      description: 'Add variants to a product',
      tags: ['Products'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      body: {
        type: 'object',
        required: ['variants'],
        properties: {
          variants: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                sku: { type: 'string' },
                price: { type: 'number' },
                inventory: { type: 'number' },
                attributes: { type: 'object' }
              }
            }
          }
        }
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
      const { variants } = request.body as { variants: any[] }
      
      const product = await productService.addVariants(id, variants)
      
      return reply.send({
        success: true,
        data: product
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to add variants'
      })
    }
  })

  // PUT /api/v1/products/bulk-update - Bulk inventory update
  fastify.put('/bulk-update', {
    preHandler: [authenticate],
    schema: {
      description: 'Bulk update products',
      tags: ['Products'],
      body: {
        type: 'object',
        required: ['productIds', 'updates'],
        properties: {
          productIds: {
            type: 'array',
            items: { type: 'string' }
          },
          updates: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'] },
              inventory: { type: 'number' },
              price: { type: 'number' }
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
                updated: { type: 'number' },
                failed: { type: 'number' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const { productIds, updates } = bulkUpdateSchema.parse(request.body)
      
      const result = await productService.bulkUpdateByIds(productIds, updates)
      
      return reply.send({
        success: true,
        data: result
      })
    } catch (error) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Invalid bulk update data',
          details: error.errors
        })
      }
      
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to bulk update products'
      })
    }
  })
}
