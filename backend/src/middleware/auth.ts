import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { AuthService } from '@/services/authService'

export interface AuthenticatedRequest extends FastifyRequest {
  user: {
    id: string
    email: string
    name: string
    role: 'USER' | 'ADMIN'
  }
}

export async function securityHeaders(fastify: FastifyInstance) {
  fastify.addHook('onRequest', async (request, reply) => {
    reply.header('X-Content-Type-Options', 'nosniff')
    reply.header('X-Frame-Options', 'DENY')
    reply.header('X-XSS-Protection', '1; mode=block')
    reply.header('Referrer-Policy', 'strict-origin-when-cross-origin')
    reply.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  })
}

export async function requestLogger(fastify: FastifyInstance) {
  fastify.addHook('onRequest', async (request, reply) => {
    request.log.info({ req: request }, 'incoming request')
  })
}

export const authenticate = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify()
    
    // Get user data from JWT payload
    const payload = request.user as any
    if (!payload || !payload.userId) {
      throw new Error('Invalid token payload')
    }

    // Attach user data to request
    request.user = {
      id: payload.userId,
      email: payload.email,
      name: payload.name || '',
      role: payload.role
    }

  } catch (err) {
    reply.status(401).send({ 
      success: false, 
      error: { message: 'Unauthorized: Invalid or expired token' } 
    })
  }
}

// Rate limiting for authentication endpoints
export async function authRateLimit(fastify: FastifyInstance) {
  await fastify.register(require('@fastify/rate-limit'), {
    max: 5, // 5 attempts
    timeWindow: '15 minutes', // per 15 minutes
    skipOnError: true,
    keyGenerator: (request) => {
      return request.ip
    }
  })
}

// Ownership validation middleware
export const requireOwnership = (resourceUserIdField: string) => async (request: AuthenticatedRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify()
    
    const payload = request.user as any
    if (!payload || !payload.userId) {
      throw new Error('Invalid token payload')
    }

    request.user = {
      id: payload.userId,
      email: payload.email,
      name: payload.name || '',
      role: payload.role
    }

    // Check resource ownership
    const resourceId = (request.params as any)[resourceUserIdField]
    if (resourceId && request.user.id !== resourceId) {
      reply.status(403).send({ 
        success: false, 
        error: { message: 'Forbidden: You do not own this resource' } 
      })
      return
    }

  } catch (err) {
    reply.status(401).send({ 
      success: false, 
      error: { message: 'Unauthorized: Invalid or expired token' } 
    })
  }
}

// Export AuthService for use in routes
export { AuthService }
