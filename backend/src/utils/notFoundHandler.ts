import { FastifyRequest, FastifyReply } from 'fastify'

export function notFoundHandler(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  reply.status(404).send({
    success: false,
    error: {
      message: 'Route not found',
      code: 'ROUTE_NOT_FOUND',
      timestamp: new Date().toISOString()
    }
  })
}
