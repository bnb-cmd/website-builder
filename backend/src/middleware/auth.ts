import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

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
  })
}

export async function requestLogger(fastify: FastifyInstance) {
  fastify.addHook('onRequest', async (request, reply) => {
    console.log(`${request.method} ${request.url}`)
  })
}

export async function authenticate(request: AuthenticatedRequest, reply: FastifyReply) {
  // Mock authentication for minimal version
  return Promise.resolve()
}

export class AuthService {
  generateToken(payload: any): string {
    return 'mock-token'
  }

  verifyToken(token: string): any {
    return { id: 'mock-user', email: 'mock@example.com', role: 'USER' }
  }

  extractTokenFromRequest(request: FastifyRequest): string | null {
    const authHeader = request.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }
    return null
  }
}
