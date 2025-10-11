import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { UserService } from '../services/userService'
import { AuthService } from '../services/authService'
import { authenticate } from '../middleware/auth'

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  phone: z.string().optional(),
  businessType: z.enum(['RESTAURANT', 'RETAIL', 'SERVICE', 'HEALTHCARE', 'EDUCATION', 'TECHNOLOGY', 'FINANCE', 'REAL_ESTATE', 'ENTERTAINMENT', 'NON_PROFIT', 'OTHER']).optional(),
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
  businessType: z.enum(['RESTAURANT', 'RETAIL', 'SERVICE', 'HEALTHCARE', 'EDUCATION', 'TECHNOLOGY', 'FINANCE', 'REAL_ESTATE', 'ENTERTAINMENT', 'NON_PROFIT', 'OTHER']).optional(),
  city: z.string().optional(),
  companyName: z.string().optional()
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100)
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
          businessType: { type: 'string', enum: ['RESTAURANT', 'RETAIL', 'SERVICE', 'HEALTHCARE', 'EDUCATION', 'TECHNOLOGY', 'FINANCE', 'REAL_ESTATE', 'ENTERTAINMENT', 'NON_PROFIT', 'OTHER'] },
          city: { type: 'string' },
          companyName: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const validatedData = registerSchema.parse(request.body)
      
      // Check if user already exists
      const existingUser = await userService.findByEmail(validatedData.email)
      if (existingUser) {
        return reply.status(409).send({
          success: false,
          error: {
            message: 'User with this email already exists',
            code: 'USER_EXISTS',
            timestamp: new Date().toISOString()
          }
        })
      }

      // Validate password strength
      const passwordValidation = authService.validatePassword(validatedData.password)
      if (!passwordValidation.isValid) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'Password does not meet requirements',
            code: 'WEAK_PASSWORD',
            details: passwordValidation.errors,
            timestamp: new Date().toISOString()
          }
        })
      }

      // Hash password
      const hashedPassword = await authService.hashPassword(validatedData.password)

      // Create user
      const user = await userService.create({
        email: validatedData.email,
        name: validatedData.name,
        password: hashedPassword,
        phone: validatedData.phone,
        businessType: validatedData.businessType,
        city: validatedData.city,
        companyName: validatedData.companyName
      })

      // Generate tokens
      const tokenPair = authService.generateTokenPair(user)

      return reply.status(201).send({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            businessType: user.businessType,
            city: user.city,
            companyName: user.companyName,
            role: user.role,
            createdAt: user.createdAt
          },
          accessToken: tokenPair.accessToken,
          refreshToken: tokenPair.refreshToken,
          expiresIn: tokenPair.expiresIn
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Registration error:', error)
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
          message: 'Registration failed',
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
      }
    }
  }, async (request, reply) => {
    try {
      const validatedData = loginSchema.parse(request.body)
      
      // Find user
      const user = await userService.findByEmail(validatedData.email)
      if (!user) {
        return reply.status(401).send({
          success: false,
          error: {
            message: 'Invalid email or password',
            code: 'INVALID_CREDENTIALS',
            timestamp: new Date().toISOString()
          }
        })
      }

      // Verify password
      const isPasswordValid = await authService.verifyPassword(validatedData.password, user.password)
      if (!isPasswordValid) {
        return reply.status(401).send({
          success: false,
          error: {
            message: 'Invalid email or password',
            code: 'INVALID_CREDENTIALS',
            timestamp: new Date().toISOString()
          }
        })
      }

      // Update last login
      await userService.update(user.id, { lastLoginAt: new Date() })

      // Generate tokens
      const tokenPair = authService.generateTokenPair(user)

      return reply.status(200).send({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            businessType: user.businessType,
            city: user.city,
            companyName: user.companyName,
            role: user.role,
            lastLoginAt: user.lastLoginAt
          },
          accessToken: tokenPair.accessToken,
          refreshToken: tokenPair.refreshToken,
          expiresIn: tokenPair.expiresIn
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Login error:', error)
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
      }
    }
  }, async (request, reply) => {
    try {
      const validatedData = refreshTokenSchema.parse(request.body)
      
      const tokenPair = await authService.refreshAccessToken(validatedData.refreshToken)
      if (!tokenPair) {
        return reply.status(401).send({
          success: false,
          error: {
            message: 'Invalid or expired refresh token',
            code: 'INVALID_REFRESH_TOKEN',
            timestamp: new Date().toISOString()
          }
        })
      }

      return reply.status(200).send({
        success: true,
        data: {
          accessToken: tokenPair.accessToken,
          refreshToken: tokenPair.refreshToken,
          expiresIn: tokenPair.expiresIn
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Token refresh error:', error)
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
          message: 'Token refresh failed',
          code: 'REFRESH_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // POST /api/v1/auth/logout
  fastify.post('/logout', {
    schema: {
      description: 'Logout user',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }]
    },
    preHandler: authenticate
  }, async (request, reply) => {
    try {
      const token = authService.extractTokenFromRequest(request)
      if (token) {
        await authService.blacklistToken(token)
      }

      return reply.status(200).send({
        success: true,
        data: {
          message: 'Logged out successfully'
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Logout error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Logout failed',
          code: 'LOGOUT_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // GET /api/v1/auth/profile
  fastify.get('/profile', {
    schema: {
      description: 'Get current user profile',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }]
    },
    preHandler: authenticate
  }, async (request, reply) => {
    try {
      const user = await userService.findById((request as any).user.id)
      if (!user) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'User not found',
            code: 'USER_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
      }

      return reply.status(200).send({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            businessType: user.businessType,
            city: user.city,
            companyName: user.companyName,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            lastLoginAt: user.lastLoginAt
          }
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Profile fetch error:', error)
      return reply.status(500).send({
        success: false,
        error: {
          message: 'Failed to fetch profile',
          code: 'PROFILE_FETCH_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // PUT /api/v1/auth/profile
  fastify.put('/profile', {
    schema: {
      description: 'Update user profile',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 100 },
          phone: { type: 'string' },
          businessType: { type: 'string', enum: ['RESTAURANT', 'RETAIL', 'SERVICE', 'HEALTHCARE', 'EDUCATION', 'TECHNOLOGY', 'FINANCE', 'REAL_ESTATE', 'ENTERTAINMENT', 'NON_PROFIT', 'OTHER'] },
          city: { type: 'string' },
          companyName: { type: 'string' }
        }
      }
    },
    preHandler: authenticate
  }, async (request, reply) => {
    try {
      const validatedData = updateProfileSchema.parse(request.body)
      const userId = (request as any).user.id

      const updatedUser = await userService.update(userId, validatedData)

      return reply.status(200).send({
        success: true,
        data: {
          user: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            avatar: updatedUser.avatar,
            businessType: updatedUser.businessType,
            city: updatedUser.city,
            companyName: updatedUser.companyName,
            role: updatedUser.role,
            status: updatedUser.status,
            updatedAt: updatedUser.updatedAt
          }
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Profile update error:', error)
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
          message: 'Profile update failed',
          code: 'PROFILE_UPDATE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })

  // PUT /api/v1/auth/change-password
  fastify.put('/change-password', {
    schema: {
      description: 'Change user password',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: { type: 'string' },
          newPassword: { type: 'string', minLength: 8, maxLength: 100 }
        }
      }
    },
    preHandler: authenticate
  }, async (request, reply) => {
    try {
      const validatedData = changePasswordSchema.parse(request.body)
      const userId = (request as any).user.id

      // Get current user
      const user = await userService.findById(userId)
      if (!user) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'User not found',
            code: 'USER_NOT_FOUND',
            timestamp: new Date().toISOString()
          }
        })
      }

      // Verify current password
      const isCurrentPasswordValid = await authService.verifyPassword(validatedData.currentPassword, user.password)
      if (!isCurrentPasswordValid) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'Current password is incorrect',
            code: 'INVALID_CURRENT_PASSWORD',
            timestamp: new Date().toISOString()
          }
        })
      }

      // Validate new password strength
      const passwordValidation = authService.validatePassword(validatedData.newPassword)
      if (!passwordValidation.isValid) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'New password does not meet requirements',
            code: 'WEAK_PASSWORD',
            details: passwordValidation.errors,
            timestamp: new Date().toISOString()
          }
        })
      }

      // Hash new password
      const hashedNewPassword = await authService.hashPassword(validatedData.newPassword)

      // Update password
      await userService.update(userId, { password: hashedNewPassword })

      return reply.status(200).send({
        success: true,
        data: {
          message: 'Password changed successfully'
        },
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Password change error:', error)
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
          message: 'Password change failed',
          code: 'PASSWORD_CHANGE_FAILED',
          timestamp: new Date().toISOString()
        }
      })
    }
  })
}