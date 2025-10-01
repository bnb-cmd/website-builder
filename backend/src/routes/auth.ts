import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { UserService } from '../services/userService'
import { AuthService } from '../middleware/auth'
import { authenticate } from '../middleware/auth'

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  phone: z.string().optional(),
  businessType: z.enum(['RESTAURANT', 'RETAIL', 'SERVICE', 'ECOMMERCE', 'EDUCATION', 'HEALTHCARE', 'REAL_ESTATE', 'TECHNOLOGY', 'CREATIVE', 'NON_PROFIT', 'OTHER']).optional(),
  city: z.string().optional(),
  companyName: z.string().optional()
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1)
})

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  businessType: z.enum(['RESTAURANT', 'RETAIL', 'SERVICE', 'ECOMMERCE', 'EDUCATION', 'HEALTHCARE', 'REAL_ESTATE', 'TECHNOLOGY', 'CREATIVE', 'NON_PROFIT', 'OTHER']).optional(),
  city: z.string().optional(),
  companyName: z.string().optional(),
  avatar: z.string().url().optional()
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6).max(100)
})

export async function authRoutes(fastify: FastifyInstance) {
  const userService = new UserService()
  const authService = new AuthService()

  // POST /api/v1/auth/register
  fastify.post('/register', {
    schema: {
      description: 'Register a new user',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 100 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6, maxLength: 100 },
          phone: { type: 'string' },
          businessType: { 
            type: 'string', 
            enum: ['RESTAURANT', 'RETAIL', 'SERVICE', 'ECOMMERCE', 'EDUCATION', 'HEALTHCARE', 'REAL_ESTATE', 'TECHNOLOGY', 'CREATIVE', 'NON_PROFIT', 'OTHER'] 
          },
          city: { type: 'string' },
          companyName: { type: 'string' }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    phone: { type: 'string' },
                    businessType: { type: 'string' },
                    city: { type: 'string' },
                    companyName: { type: 'string' },
                    role: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' }
                  }
                },
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        400: { $ref: 'Error' },
        409: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const data = registerSchema.parse(request.body)
      
      // Create user
      const user = await userService.create(data)
      
      // Generate tokens
      const { accessToken, refreshToken } = authService.generateTokenPair(user)
      
      // Update last login
      await userService.updateLastLogin(user.id)
      
      // Return user data without password
      const { password, ...userData } = user
      
      reply.status(201).send({
        success: true,
        data: {
          user: userData,
          accessToken,
          refreshToken
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({
          success: false,
          error: {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      reply.status(409).send({
        success: false,
        error: {
          message: error.message || 'Registration failed',
          code: 'REGISTRATION_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/auth/login
  fastify.post('/login', {
    schema: {
      description: 'Login user',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    phone: { type: 'string' },
                    businessType: { type: 'string' },
                    city: { type: 'string' },
                    companyName: { type: 'string' },
                    role: { type: 'string' },
                    lastLoginAt: { type: 'string', format: 'date-time' }
                  }
                },
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        400: { $ref: 'Error' },
        401: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const { email, password } = loginSchema.parse(request.body)
      
      // Find user by email
      const user = await userService.findByEmail(email)
      if (!user) {
        reply.status(401).send({
          success: false,
          error: {
            message: 'Invalid credentials',
            code: 'INVALID_CREDENTIALS',
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      // Validate password
      const isValidPassword = await userService.validatePassword(user, password)
      if (!isValidPassword) {
        reply.status(401).send({
          success: false,
          error: {
            message: 'Invalid credentials',
            code: 'INVALID_CREDENTIALS',
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      // Check if user is active
      if (user.status !== 'ACTIVE') {
        reply.status(401).send({
          success: false,
          error: {
            message: 'Account is not active',
            code: 'ACCOUNT_INACTIVE',
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      // Generate tokens
      const { accessToken, refreshToken } = authService.generateTokenPair(user)
      
      // Update last login
      await userService.updateLastLogin(user.id)
      
      // Return user data without password
      const { password: _, ...userData } = user
      
      reply.send({
        success: true,
        data: {
          user: userData,
          accessToken,
          refreshToken
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({
          success: false,
          error: {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      reply.status(500).send({
        success: false,
        error: {
          message: 'Login failed',
          code: 'LOGIN_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/auth/refresh
  fastify.post('/refresh', {
    schema: {
      description: 'Refresh access token',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        401: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const { refreshToken } = refreshTokenSchema.parse(request.body)
      
      const tokenPair = await authService.refreshAccessToken(refreshToken)
      if (!tokenPair) {
        reply.status(401).send({
          success: false,
          error: {
            message: 'Invalid refresh token',
            code: 'INVALID_REFRESH_TOKEN',
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      reply.send({
        success: true,
        data: tokenPair,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({
          success: false,
          error: {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      reply.status(401).send({
        success: false,
        error: {
          message: 'Token refresh failed',
          code: 'TOKEN_REFRESH_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/auth/logout
  fastify.post('/logout', {
    preHandler: [authenticate],
    schema: {
      description: 'Logout user',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Logged out successfully' }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        401: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const token = authService.extractTokenFromRequest(request)
      if (token) {
        await authService.blacklistToken(token)
      }
      
      reply.send({
        success: true,
        data: {
          message: 'Logged out successfully'
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: {
          message: 'Logout failed',
          code: 'LOGOUT_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/auth/me
  fastify.get('/me', {
    preHandler: [authenticate],
    schema: {
      description: 'Get current user profile',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    phone: { type: 'string' },
                    avatar: { type: 'string' },
                    businessType: { type: 'string' },
                    city: { type: 'string' },
                    companyName: { type: 'string' },
                    role: { type: 'string' },
                    status: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                    lastLoginAt: { type: 'string', format: 'date-time' }
                  }
                }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        401: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      // Return mock user data in development mode
      if (process.env.NODE_ENV === 'development' || process.env.DISABLE_AUTH === 'true') {
        const mockUser = {
          id: 'dev-user-id',
          email: 'dev@example.com',
          name: 'Development User',
          phone: '+92-300-1234567',
          avatar: null,
          businessType: 'SERVICE',
          city: 'Karachi',
          companyName: 'Dev Company',
          role: 'USER',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString()
        }
        
        reply.send({
          success: true,
          data: {
            user: mockUser
          },
          timestamp: new Date().toISOString()
        })
        return
      }

      const user = await userService.findById(request.user!.id)
      if (!user) {
        reply.status(404).send({
          success: false,
          error: {
            message: 'User not found',
            code: 'USER_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      // Return user data without password
      const { password, ...userData } = user
      
      reply.send({
        success: true,
        data: {
          user: userData
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to get user profile',
          code: 'PROFILE_FETCH_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // PUT /api/v1/auth/profile
  fastify.put('/profile', {
    preHandler: [authenticate],
    schema: {
      description: 'Update user profile',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 100 },
          phone: { type: 'string' },
          businessType: { 
            type: 'string', 
            enum: ['RESTAURANT', 'RETAIL', 'SERVICE', 'ECOMMERCE', 'EDUCATION', 'HEALTHCARE', 'REAL_ESTATE', 'TECHNOLOGY', 'CREATIVE', 'NON_PROFIT', 'OTHER'] 
          },
          city: { type: 'string' },
          companyName: { type: 'string' },
          avatar: { type: 'string', format: 'uri' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    phone: { type: 'string' },
                    avatar: { type: 'string' },
                    businessType: { type: 'string' },
                    city: { type: 'string' },
                    companyName: { type: 'string' },
                    role: { type: 'string' },
                    status: { type: 'string' },
                    updatedAt: { type: 'string', format: 'date-time' }
                  }
                }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        400: { $ref: 'Error' },
        401: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const data = updateProfileSchema.parse(request.body)
      
      const user = await userService.update(request.user!.id, data)
      
      // Return user data without password
      const { password, ...userData } = user
      
      reply.send({
        success: true,
        data: {
          user: userData
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({
          success: false,
          error: {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      reply.status(500).send({
        success: false,
        error: {
          message: 'Profile update failed',
          code: 'PROFILE_UPDATE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // PUT /api/v1/auth/change-password
  fastify.put('/change-password', {
    preHandler: [authenticate],
    schema: {
      description: 'Change user password',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: { type: 'string' },
          newPassword: { type: 'string', minLength: 6, maxLength: 100 }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Password changed successfully' }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        400: { $ref: 'Error' },
        401: { $ref: 'Error' }
      }
    }
  }, async (request, reply) => {
    try {
      const { currentPassword, newPassword } = changePasswordSchema.parse(request.body)
      
      // Get current user
      const user = await userService.findById(request.user!.id)
      if (!user) {
        reply.status(404).send({
          success: false,
          error: {
            message: 'User not found',
            code: 'USER_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      // Validate current password
      const isValidPassword = await userService.validatePassword(user, currentPassword)
      if (!isValidPassword) {
        reply.status(401).send({
          success: false,
          error: {
            message: 'Current password is incorrect',
            code: 'INVALID_CURRENT_PASSWORD',
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      // Update password
      await userService.updatePassword(user.id, newPassword)
      
      reply.send({
        success: true,
        data: {
          message: 'Password changed successfully'
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({
          success: false,
          error: {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            details: error.errors,
            timestamp: new Date().toISOString()
          }
        })
        return
      }
      
      reply.status(500).send({
        success: false,
        error: {
          message: 'Password change failed',
          code: 'PASSWORD_CHANGE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })
}
