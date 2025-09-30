import { FastifyError, FastifyRequest, FastifyReply } from 'fastify'

export interface APIError extends FastifyError {
  statusCode?: number
  code: string
  details?: any
}

export class AppError extends Error {
  public statusCode: number
  public code: string
  public details?: any
  public isOperational: boolean

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: any
  ) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  console.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method,
    ip: request.ip,
    userAgent: request.headers['user-agent'],
    userId: (request as any).user?.id
  })

  // Handle validation errors
  if (error.validation) {
    reply.status(400).send({
      success: false,
      error: {
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: error.validation,
        timestamp: new Date().toISOString()
      }
    })
    return
  }

  // Handle Prisma errors
  if (error.code && error.code.startsWith('P')) {
    const prismaError = handlePrismaError(error)
    reply.status(prismaError.statusCode).send({
      success: false,
      error: {
        message: prismaError.message,
        code: prismaError.code,
        timestamp: new Date().toISOString()
      }
    })
    return
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    reply.status(401).send({
      success: false,
      error: {
        message: 'Invalid token',
        code: 'INVALID_TOKEN',
        timestamp: new Date().toISOString()
      }
    })
    return
  }

  if (error.name === 'TokenExpiredError') {
    reply.status(401).send({
      success: false,
      error: {
        message: 'Token expired',
        code: 'TOKEN_EXPIRED',
        timestamp: new Date().toISOString()
      }
    })
    return
  }

  // Handle custom AppError
  if (error instanceof AppError) {
    reply.status(error.statusCode).send({
      success: false,
      error: {
        message: error.message,
        code: error.code,
        details: error.details,
        timestamp: new Date().toISOString()
      }
    })
    return
  }

  // Handle rate limit errors
  if (error.statusCode === 429) {
    reply.status(429).send({
      success: false,
      error: {
        message: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
        timestamp: new Date().toISOString()
      }
    })
    return
  }

  // Handle file upload errors
  if (error.code === 'LIMIT_FILE_SIZE') {
    reply.status(413).send({
      success: false,
      error: {
        message: 'File too large',
        code: 'FILE_TOO_LARGE',
        timestamp: new Date().toISOString()
      }
    })
    return
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    reply.status(413).send({
      success: false,
      error: {
        message: 'Too many files',
        code: 'TOO_MANY_FILES',
        timestamp: new Date().toISOString()
      }
    })
    return
  }

  // Handle generic errors
  const statusCode = error.statusCode || 500
  const message = statusCode === 500 ? 'Internal server error' : error.message

  reply.status(statusCode).send({
    success: false,
    error: {
      message,
      code: error.code || 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
      ...(process.env['NODE_ENV'] === 'development' && {
        stack: error.stack,
        details: (error as any).details
      })
    }
  })
}

function handlePrismaError(error: any): { statusCode: number; message: string; code: string } {
  switch (error.code) {
    case 'P2002':
      return {
        statusCode: 409,
        message: 'Resource already exists',
        code: 'DUPLICATE_ENTRY'
      }
    case 'P2025':
      return {
        statusCode: 404,
        message: 'Resource not found',
        code: 'NOT_FOUND'
      }
    case 'P2003':
      return {
        statusCode: 400,
        message: 'Foreign key constraint failed',
        code: 'FOREIGN_KEY_CONSTRAINT'
      }
    case 'P2014':
      return {
        statusCode: 400,
        message: 'Invalid ID provided',
        code: 'INVALID_ID'
      }
    case 'P2016':
      return {
        statusCode: 400,
        message: 'Query interpretation error',
        code: 'QUERY_ERROR'
      }
    case 'P2021':
      return {
        statusCode: 404,
        message: 'Table does not exist',
        code: 'TABLE_NOT_FOUND'
      }
    case 'P2022':
      return {
        statusCode: 404,
        message: 'Column does not exist',
        code: 'COLUMN_NOT_FOUND'
      }
    default:
      return {
        statusCode: 500,
        message: 'Database error',
        code: 'DATABASE_ERROR'
      }
  }
}

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

// Common error creators
export const createError = {
  badRequest: (message: string, details?: any) => 
    new AppError(message, 400, 'BAD_REQUEST', details),
  
  unauthorized: (message: string = 'Unauthorized') => 
    new AppError(message, 401, 'UNAUTHORIZED'),
  
  forbidden: (message: string = 'Forbidden') => 
    new AppError(message, 403, 'FORBIDDEN'),
  
  notFound: (message: string = 'Not found') => 
    new AppError(message, 404, 'NOT_FOUND'),
  
  conflict: (message: string, details?: any) => 
    new AppError(message, 409, 'CONFLICT', details),
  
  unprocessableEntity: (message: string, details?: any) => 
    new AppError(message, 422, 'UNPROCESSABLE_ENTITY', details),
  
  tooManyRequests: (message: string = 'Too many requests') => 
    new AppError(message, 429, 'TOO_MANY_REQUESTS'),
  
  internalServerError: (message: string = 'Internal server error') => 
    new AppError(message, 500, 'INTERNAL_SERVER_ERROR'),
  
  serviceUnavailable: (message: string = 'Service unavailable') => 
    new AppError(message, 503, 'SERVICE_UNAVAILABLE')
}

// Async error wrapper
export function asyncHandler(fn: Function) {
  return (request: FastifyRequest, reply: FastifyReply) => {
    Promise.resolve(fn(request, reply)).catch((error) => {
      errorHandler(error, request, reply)
    })
  }
}

// Error logging utility
export function logError(error: Error, context?: any) {
  const errorLog = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context
  }

  // In production, you would send this to a logging service
  console.error('Error logged:', errorLog)
  
  // Example: Send to Sentry, LogRocket, etc.
  // Sentry.captureException(error, { extra: context })
}

// Validation error formatter
export function formatValidationError(errors: any[]) {
  return errors.map(error => ({
    field: error.path?.join('.') || 'unknown',
    message: error.message,
    value: error.value
  }))
}

// Database connection error handler
export function handleDatabaseError(error: any) {
  if (error.code === 'ECONNREFUSED') {
    throw new AppError('Database connection refused', 503, 'DATABASE_CONNECTION_REFUSED')
  }
  
  if (error.code === 'ETIMEDOUT') {
    throw new AppError('Database connection timeout', 503, 'DATABASE_CONNECTION_TIMEOUT')
  }
  
  if (error.code === 'ENOTFOUND') {
    throw new AppError('Database host not found', 503, 'DATABASE_HOST_NOT_FOUND')
  }
  
  throw new AppError('Database error', 500, 'DATABASE_ERROR')
}

// Redis connection error handler
export function handleRedisError(error: any) {
  if (error.code === 'ECONNREFUSED') {
    throw new AppError('Redis connection refused', 503, 'REDIS_CONNECTION_REFUSED')
  }
  
  if (error.code === 'ETIMEDOUT') {
    throw new AppError('Redis connection timeout', 503, 'REDIS_CONNECTION_TIMEOUT')
  }
  
  throw new AppError('Redis error', 500, 'REDIS_ERROR')
}
