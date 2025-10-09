import { FastifyInstance } from 'fastify'
import { authenticate, requireAdmin } from '@/middleware/auth'

export async function adminRoutes(fastify: FastifyInstance) {
  // GET /api/v1/admin/stats
  fastify.get('/stats', {
    preHandler: [authenticate, requireAdmin],
    schema: {
      description: 'Get admin statistics',
      tags: ['Admin'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                users: {
                  type: 'object',
                  properties: {
                    total: { type: 'number' },
                    active: { type: 'number' },
                    newThisMonth: { type: 'number' }
                  }
                },
                websites: {
                  type: 'object',
                  properties: {
                    total: { type: 'number' },
                    published: { type: 'number' },
                    draft: { type: 'number' }
                  }
                },
                revenue: {
                  type: 'object',
                  properties: {
                    total: { type: 'number' },
                    thisMonth: { type: 'number' },
                    currency: { type: 'string' }
                  }
                }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        401: { $ref: 'Error' },
        403: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      // Mock admin stats
      const stats = {
        users: {
          total: 1250,
          active: 1100,
          newThisMonth: 85
        },
        websites: {
          total: 2100,
          published: 1800,
          draft: 300
        },
        revenue: {
          total: 2500000,
          thisMonth: 150000,
          currency: 'PKR'
        }
      }
      
      reply.send({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to fetch admin stats',
          code: 'ADMIN_STATS_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/admin/users
  fastify.get('/users', {
    preHandler: [authenticate, requireAdmin],
    schema: {
      description: 'Get all users (admin only)',
      tags: ['Admin'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', minimum: 1, default: 1 },
          limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
          search: { type: 'string' },
          status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'] },
          role: { type: 'string', enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' },
                  role: { type: 'string' },
                  status: { type: 'string' },
                  businessType: { type: 'string' },
                  city: { type: 'string' },
                  companyName: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  lastLoginAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            pagination: { $ref: 'Pagination' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        401: { $ref: 'Error' },
        403: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const { page = 1, limit = 10, search, status, role } = request.query as any
      
      // Mock user data
      const users = [
        {
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+92-300-1234567',
          role: 'USER',
          status: 'ACTIVE',
          businessType: 'SERVICE',
          city: 'Karachi',
          companyName: 'John\'s Services',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        },
        {
          id: 'user-2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+92-300-7654321',
          role: 'USER',
          status: 'ACTIVE',
          businessType: 'RESTAURANT',
          city: 'Lahore',
          companyName: 'Jane\'s Restaurant',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ]
      
      reply.send({
        success: true,
        data: users,
        pagination: {
          page,
          limit,
          total: users.length,
          pages: Math.ceil(users.length / limit)
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to fetch users',
          code: 'FETCH_USERS_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })
}
