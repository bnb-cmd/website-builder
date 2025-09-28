import jwt from 'jsonwebtoken'
import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'
import { authConfig } from '@/config/environment'
import { UserService } from '@/services/userService'

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string
    email: string
    name: string
    role: string
  }
}

export interface JWTPayload {
  userId: string
  email: string
  name: string
  role: string
  iat?: number
  exp?: number
}

export interface RefreshTokenPayload {
  userId: string
  tokenVersion: number
  iat?: number
  exp?: number
}

export class AuthService {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  // Generate JWT token
  generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, authConfig.jwtSecret, {
      expiresIn: authConfig.jwtExpiresIn,
      issuer: 'pakistan-website-builder',
      audience: 'pakistan-website-builder-users'
    })
  }

  // Generate refresh token
  generateRefreshToken(payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, authConfig.jwtSecret, {
      expiresIn: authConfig.refreshTokenExpiresIn,
      issuer: 'pakistan-website-builder',
      audience: 'pakistan-website-builder-refresh'
    })
  }

  // Verify JWT token
  verifyAccessToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, authConfig.jwtSecret, {
        issuer: 'pakistan-website-builder',
        audience: 'pakistan-website-builder-users'
      }) as JWTPayload
    } catch (error) {
      console.error('JWT verification error:', error)
      return null
    }
  }

  // Verify refresh token
  verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
      return jwt.verify(token, authConfig.jwtSecret, {
        issuer: 'pakistan-website-builder',
        audience: 'pakistan-website-builder-refresh'
      }) as RefreshTokenPayload
    } catch (error) {
      console.error('Refresh token verification error:', error)
      return null
    }
  }

  // Extract token from request
  extractTokenFromRequest(request: FastifyRequest): string | null {
    const authHeader = request.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }
    return authHeader.substring(7)
  }

  // Generate token pair
  generateTokenPair(user: any): { accessToken: string; refreshToken: string } {
    const accessToken = this.generateAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    })

    const refreshToken = this.generateRefreshToken({
      userId: user.id,
      tokenVersion: 1 // This would be stored in database and incremented on logout
    })

    return { accessToken, refreshToken }
  }

  // Refresh access token
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const payload = this.verifyRefreshToken(refreshToken)
      if (!payload) {
        return null
      }

      // Get user from database
      const user = await this.userService.findById(payload.userId)
      if (!user) {
        return null
      }

      // Generate new token pair
      return this.generateTokenPair(user)
    } catch (error) {
      console.error('Token refresh error:', error)
      return null
    }
  }

  // Blacklist token (for logout)
  async blacklistToken(token: string): Promise<void> {
    try {
      // In a production environment, you would store blacklisted tokens
      // in Redis or database and check against them during verification
      const payload = this.verifyAccessToken(token)
      if (payload) {
        // Store in Redis with expiration time
        const expiresIn = payload.exp ? payload.exp - Math.floor(Date.now() / 1000) : 3600
        // await redis.setex(`blacklist:${token}`, expiresIn, '1')
      }
    } catch (error) {
      console.error('Token blacklist error:', error)
    }
  }

  // Check if token is blacklisted
  async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      // Check Redis for blacklisted token
      // const isBlacklisted = await redis.get(`blacklist:${token}`)
      // return !!isBlacklisted
      return false // Placeholder
    } catch (error) {
      console.error('Token blacklist check error:', error)
      return false
    }
  }
}

// Authentication middleware
export async function authenticate(
  request: AuthenticatedRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    // Skip authentication in development mode
    if (process.env.NODE_ENV === 'development' || process.env.DISABLE_AUTH === 'true') {
      // Set a mock user for development
      request.user = {
        id: 'dev-user-id',
        email: 'dev@example.com',
        role: 'USER'
      }
      return
    }

    const authService = new AuthService()
    const token = authService.extractTokenFromRequest(request)
    
    if (!token) {
      reply.status(401).send({
        success: false,
        error: {
          message: 'No token provided',
          code: 'NO_TOKEN'
        }
      })
      return
    }

    // Check if token is blacklisted
    const isBlacklisted = await authService.isTokenBlacklisted(token)
    if (isBlacklisted) {
      reply.status(401).send({
        success: false,
        error: {
          message: 'Token has been revoked',
          code: 'TOKEN_REVOKED'
        }
      })
      return
    }

    // Verify token
    const payload = authService.verifyAccessToken(token)
    if (!payload) {
      reply.status(401).send({
        success: false,
        error: {
          message: 'Invalid token',
          code: 'INVALID_TOKEN'
        }
      })
      return
    }

    // Get user from database
    const userService = new UserService()
    const user = await userService.findById(payload.userId)
    if (!user) {
      reply.status(401).send({
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      })
      return
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      reply.status(401).send({
        success: false,
        error: {
          message: 'User account is not active',
          code: 'USER_INACTIVE'
        }
      })
      return
    }

    // Attach user to request
    request.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  } catch (error) {
    console.error('Authentication error:', error)
    reply.status(500).send({
      success: false,
      error: {
        message: 'Authentication failed',
        code: 'AUTH_ERROR'
      }
    })
  }
}

// Optional authentication middleware
export async function optionalAuthenticate(
  request: AuthenticatedRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authService = new AuthService()
    const token = authService.extractTokenFromRequest(request)
    
    if (token) {
      const payload = authService.verifyAccessToken(token)
      if (payload) {
        const userService = new UserService()
        const user = await userService.findById(payload.userId)
        if (user && user.status === 'ACTIVE') {
          request.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        }
      }
    }
  } catch (error) {
    // Optional auth - don't throw error, just continue without user
    console.error('Optional authentication error:', error)
  }
}

// Role-based authorization middleware
export function authorize(roles: string[]) {
  return async (request: AuthenticatedRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      reply.status(401).send({
        success: false,
        error: {
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        }
      })
      return
    }

    if (!roles.includes(request.user.role)) {
      reply.status(403).send({
        success: false,
        error: {
          message: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS'
        }
      })
      return
    }
  }
}

// Admin authorization middleware
export const requireAdmin = authorize(['ADMIN', 'SUPER_ADMIN'])

// Super admin authorization middleware
export const requireSuperAdmin = authorize(['SUPER_ADMIN'])

// Resource ownership middleware
export function requireOwnership(resourceUserIdField: string = 'userId') {
  return async (request: AuthenticatedRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      reply.status(401).send({
        success: false,
        error: {
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        }
      })
      return
    }

    // For admin users, allow access to all resources
    if (request.user.role === 'ADMIN' || request.user.role === 'SUPER_ADMIN') {
      return
    }

    // Check if user owns the resource
    const resourceUserId = (request.params as any)[resourceUserIdField]
    if (resourceUserId !== request.user.id) {
      reply.status(403).send({
        success: false,
        error: {
          message: 'Access denied - resource ownership required',
          code: 'OWNERSHIP_REQUIRED'
        }
      })
      return
    }
  }
}

// Rate limiting middleware
export function createRateLimit(options: {
  windowMs: number
  maxRequests: number
  keyGenerator?: (request: FastifyRequest) => string
}) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const key = options.keyGenerator 
      ? options.keyGenerator(request)
      : request.ip

    // This would integrate with Redis rate limiting
    // For now, we'll implement a simple in-memory rate limiter
    const now = Date.now()
    const windowStart = now - options.windowMs
    
    // Placeholder implementation - in production, use Redis
    const requestCount = 1 // This would be fetched from Redis
    
    if (requestCount > options.maxRequests) {
      reply.status(429).send({
        success: false,
        error: {
          message: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil(options.windowMs / 1000)
        }
      })
      return
    }
  }
}

// CORS middleware
export function createCorsMiddleware(allowedOrigins: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const origin = request.headers.origin
    
    if (origin && allowedOrigins.includes(origin)) {
      reply.header('Access-Control-Allow-Origin', origin)
    }
    
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    reply.header('Access-Control-Allow-Credentials', 'true')
    
    if (request.method === 'OPTIONS') {
      reply.status(200).send()
      return
    }
  }
}

// Security headers middleware
export async function securityHeaders(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply, payload) => {
    reply.header('X-Content-Type-Options', 'nosniff')
    reply.header('X-Frame-Options', 'DENY')
    reply.header('X-XSS-Protection', '1; mode=block')
    reply.header('Referrer-Policy', 'strict-origin-when-cross-origin')
    reply.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

    if (process.env.NODE_ENV === 'production') {
      reply.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    }
    return payload
  })
}

// Request logging middleware as a plugin
export async function requestLogger(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('onRequest', async (request) => {
    ;(request as any)._startTime = Date.now()
  })

  fastify.addHook('onResponse', async (request, reply) => {
    const start = (request as any)._startTime || Date.now()
    const duration = Date.now() - start

    const logData = {
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration: `${duration}ms`,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
      userId: (request as any).user?.id
    }

    fastify.log.info({ req: logData }, 'Request completed')
  })
}
