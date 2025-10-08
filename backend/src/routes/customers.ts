import { FastifyInstance } from 'fastify'
import { authenticate } from '@/middleware/auth'
import { z } from 'zod'

// Customer service would be implemented similar to ProductService and OrderService
// For now, we'll create the routes structure

const updateCustomerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string()
  }).optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional()
})

export async function customerRoutes(fastify: FastifyInstance) {
  // GET /api/v1/customers - List customers
  fastify.get('/', {
    preHandler: [authenticate],
    schema: {
      description: 'List all customers',
      tags: ['Customers'],
      querystring: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' },
          search: { type: 'string' },
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 20 },
          sortBy: { type: 'string', enum: ['name', 'email', 'createdAt', 'totalSpent'], default: 'createdAt' },
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
                customers: { type: 'array' },
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
      
      // This would use a CustomerService similar to ProductService
      // For now, we'll return a placeholder structure
      const customers = await fastify.prisma.order.findMany({
        where: filters.websiteId ? { websiteId: filters.websiteId } : {},
        select: {
          customerEmail: true,
          customerName: true,
          customerPhone: true,
          createdAt: true,
          total: true,
          _count: {
            select: { items: true }
          }
        },
        distinct: ['customerEmail'],
        skip: ((filters.page || 1) - 1) * (filters.limit || 20),
        take: filters.limit || 20,
        orderBy: {
          createdAt: filters.sortOrder === 'asc' ? 'asc' : 'desc'
        }
      })

      const total = await fastify.prisma.order.count({
        where: filters.websiteId ? { websiteId: filters.websiteId } : {},
        distinct: ['customerEmail']
      })

      return reply.send({
        success: true,
        data: {
          customers: customers.map(customer => ({
            id: customer.customerEmail,
            email: customer.customerEmail,
            name: customer.customerName,
            phone: customer.customerPhone,
            totalOrders: customer._count.items,
            totalSpent: customer.total,
            firstOrder: customer.createdAt,
            lastOrder: customer.createdAt
          })),
          pagination: {
            page: filters.page || 1,
            limit: filters.limit || 20,
            total,
            pages: Math.ceil(total / (filters.limit || 20))
          }
        }
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch customers'
      })
    }
  })

  // GET /api/v1/customers/:id - Get customer details
  fastify.get('/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Get customer details',
      tags: ['Customers'],
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
      
      // Get customer details from orders
      const customerOrders = await fastify.prisma.order.findMany({
        where: { customerEmail: id },
        include: {
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      if (customerOrders.length === 0) {
        return reply.status(404).send({
          success: false,
          error: 'Customer not found'
        })
      }

      const customer = {
        id,
        email: customerOrders[0].customerEmail,
        name: customerOrders[0].customerName,
        phone: customerOrders[0].customerPhone,
        totalOrders: customerOrders.length,
        totalSpent: customerOrders.reduce((sum, order) => sum + Number(order.total), 0),
        averageOrderValue: customerOrders.reduce((sum, order) => sum + Number(order.total), 0) / customerOrders.length,
        firstOrder: customerOrders[customerOrders.length - 1].createdAt,
        lastOrder: customerOrders[0].createdAt,
        orders: customerOrders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.shippingStatus,
          paymentStatus: order.paymentStatus,
          total: order.total,
          createdAt: order.createdAt,
          items: order.items.map(item => ({
            productName: item.product.name,
            quantity: item.quantity,
            price: item.price
          }))
        }))
      }

      return reply.send({
        success: true,
        data: customer
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to fetch customer'
      })
    }
  })

  // GET /api/v1/customers/:id/orders - Get customer order history
  fastify.get('/:id/orders', {
    preHandler: [authenticate],
    schema: {
      description: 'Get customer order history',
      tags: ['Customers'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 20 },
          status: { type: 'string', enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] }
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
      const { id } = request.params as { id: string }
      const { page = 1, limit = 20, status } = request.query as any
      
      const whereClause: any = { customerEmail: id }
      if (status) {
        whereClause.shippingStatus = status
      }

      const orders = await fastify.prisma.order.findMany({
        where: whereClause,
        include: {
          items: {
            include: {
              product: true
            }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      })

      const total = await fastify.prisma.order.count({
        where: whereClause
      })

      return reply.send({
        success: true,
        data: {
          orders: orders.map(order => ({
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.shippingStatus,
            paymentStatus: order.paymentStatus,
            total: order.total,
            createdAt: order.createdAt,
            items: order.items.map(item => ({
              productName: item.product.name,
              quantity: item.quantity,
              price: item.price
            }))
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
        error: error.message || 'Failed to fetch customer orders'
      })
    }
  })

  // PUT /api/v1/customers/:id - Update customer info
  fastify.put('/:id', {
    preHandler: [authenticate],
    schema: {
      description: 'Update customer information',
      tags: ['Customers'],
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
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          address: {
            type: 'object',
            properties: {
              street: { type: 'string' },
              city: { type: 'string' },
              state: { type: 'string' },
              zipCode: { type: 'string' },
              country: { type: 'string' }
            }
          },
          notes: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } }
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
      const updateData = updateCustomerSchema.parse(request.body)
      
      // For now, we'll update the customer info in orders
      // In a real implementation, you'd have a separate Customer table
      const updatedOrders = await fastify.prisma.order.updateMany({
        where: { customerEmail: id },
        data: {
          customerName: updateData.name,
          customerPhone: updateData.phone,
          notes: updateData.notes
        }
      })

      if (updatedOrders.count === 0) {
        return reply.status(404).send({
          success: false,
          error: 'Customer not found'
        })
      }

      return reply.send({
        success: true,
        data: { message: 'Customer updated successfully' }
      })
    } catch (error) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({
          success: false,
          error: 'Invalid customer data',
          details: error.errors
        })
      }
      
      return reply.status(500).send({
        success: false,
        error: error.message || 'Failed to update customer'
      })
    }
  })
}
