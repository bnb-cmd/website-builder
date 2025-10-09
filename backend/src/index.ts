import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import compress from '@fastify/compress'
import fastifyStatic from '@fastify/static'
import cookie from '@fastify/cookie'
import path from 'path'

import { config, serverConfig } from '@/config/environment'
import { db } from '@/models/database'
import { redis } from '@/models/redis'
import { securityHeaders, requestLogger } from '@/middleware/auth'
import type { FastifyServerOptions, FastifyPluginAsync } from 'fastify'
import type { FastifyJWTOptions } from '@fastify/jwt'

// Import routes
import { authRoutes } from '@/routes/auth'
import { websiteRoutes } from '@/routes/websites'
import { templateRoutes } from '@/routes/templates'
import { aiRoutes } from '@/routes/ai'
import { userRoutes } from '@/routes/users'
// import { paymentRoutes } from '@/routes/payments'
import { adminRoutes } from '@/routes/admin'
// import { domainRoutes } from '@/routes/domains'
// import { dnsVerificationRoutes } from '@/routes/dnsVerification'
// import { pwaRoutes } from '@/routes/pwa'
// import { analyticsRoutes } from '@/routes/analytics'
// import { marketingRoutes } from '@/routes/marketing'
// import { integrationRoutes } from '@/routes/integrations'
// import { mediaRoutes } from '@/routes/media'
// import { designSystemRoutes } from '@/routes/designSystems'
// import { agencyRoutes } from '@/routes/agency'
// import { blockchainRoutes } from '@/routes/blockchain'
// import { notificationRoutes } from '@/routes/notifications'
// import { subscriptionRoutes } from '@/routes/subscriptions'
// import { aiOnboardingRoutes } from '@/routes/aiOnboarding'
// import { contentRoutes } from '@/routes/content'
// import { performanceOptimizationRoutes } from '@/routes/performanceOptimization'
// import { conversationRoutes } from '@/routes/conversation'
// import { seoRoutes } from '@/routes/seo'
import { brandKitRoutes } from '@/routes/brandKit'
// import { productRoutes } from '@/routes/products'
// import { orderRoutes } from '@/routes/orders'
// import { customerRoutes } from '@/routes/customers'
// import { ecommerceSettingsRoutes } from '@/routes/ecommerceSettings'
// import { storePaymentsRoutes } from '@/routes/storePayments'
import { imageLibraryRoutes } from '@/routes/imageLibrary'

// Import error handlers
import { errorHandler } from '@/utils/errorHandler'
import { notFoundHandler } from '@/utils/notFoundHandler'

export async function createServer() {
  const fastify = Fastify({
    logger: {
      level: serverConfig.enableLogging ? 'info' : 'error',
      transport: serverConfig.nodeEnv === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true
            }
          }
        : undefined
    },
    trustProxy: true,
    bodyLimit: 10 * 1024 * 1024, // 10MB
    maxParamLength: 200
  })

  // Register shared schemas for $ref usage in route schemas
  fastify.addSchema({
    $id: 'Error',
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      error: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          code: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' }
        }
      }
    }
  })

  fastify.addSchema({
    $id: 'Success',
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: { type: 'object' },
      timestamp: { type: 'string', format: 'date-time' }
    }
  })

  fastify.addSchema({
    $id: 'Pagination',
    type: 'object',
    properties: {
      page: { type: 'number' },
      limit: { type: 'number' },
      total: { type: 'number' },
      pages: { type: 'number' }
    }
  })

  // Register security middleware
  await fastify.register(securityHeaders)

  // Register request logger
  await fastify.register(requestLogger)

  // Register compression
  await fastify.register(compress)

  // Register static file serving
  await fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/',
    decorateReply: false
  })

  // Register CORS
  await fastify.register(cors, {
    origin: serverConfig.nodeEnv === 'development' 
      ? ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:3002']
      : serverConfig.enableCors ? [serverConfig.clientUrl] : false,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })

  // Register JWT
  await fastify.register(jwt, {
    secret: config.auth.jwtSecret,
    sign: {
      expiresIn: config.auth.jwtExpiresIn
    }
  })

  // Register cookie support
  await fastify.register(cookie, {
    secret: config.auth.jwtSecret
  })

  // Register multipart for file uploads
  await fastify.register(multipart, {
    limits: {
      fileSize: config.fileUpload.maxFileSize,
      files: 10
    },
    attachFieldsToBody: true
  })

  // Register rate limiting
  await fastify.register(rateLimit, {
    max: config.rateLimit.maxRequests,
    timeWindow: config.rateLimit.windowMs,
    skipOnError: true,
    keyGenerator: (request) => {
      // Use user ID if authenticated, otherwise IP
      return (request as any).user?.id || request.ip
    }
  })

  // Register Swagger documentation
  if (serverConfig.enableSwagger) {
    await fastify.register(swagger, {
      openapi: {
        openapi: '3.0.3',
        info: {
          title: 'Pakistan Website Builder API',
          description: 'AI-powered website builder for Pakistani businesses',
          version: '1.0.0',
          contact: {
            name: 'API Support',
            email: 'support@pakistanbuilder.com',
            url: 'https://pakistanbuilder.com'
          },
          license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
          }
        },
        servers: [
          {
            url: serverConfig.nodeEnv === 'production' 
              ? 'https://api.pakistanbuilder.com/v1'
              : `http://localhost:${serverConfig.port}/v1`,
            description: serverConfig.nodeEnv === 'production' 
              ? 'Production server'
              : 'Development server'
          }
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          },
          schemas: {
            Error: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                error: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                    code: { type: 'string' },
                    timestamp: { type: 'string', format: 'date-time' }
                  }
                }
              }
            },
            Success: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: true },
                data: { type: 'object' },
                timestamp: { type: 'string', format: 'date-time' }
              }
            },
            Pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                pages: { type: 'number' }
              }
            }
          }
        },
        security: [
          { bearerAuth: [] }
        ]
      }
    })

    await fastify.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false
      },
      uiHooks: {
        onRequest: function (request, reply, next) {
          next()
        },
        preHandler: function (request, reply, next) {
          next()
        }
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject, request, reply) => {
        return swaggerObject
      },
      transformSpecificationClone: true
    })
  }

  // Register global hooks
  // Hooks are registered within plugins above

  // Register Prisma client as decorator
  fastify.decorate('prisma', db.getClient())

  // Register error handlers
  fastify.setErrorHandler(errorHandler)
  fastify.setNotFoundHandler(notFoundHandler)

  // Health check endpoint
  fastify.get('/health', {
    schema: {
      description: 'Health check endpoint',
      tags: ['Health'],
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'OK' },
            timestamp: { type: 'string', format: 'date-time' },
            uptime: { type: 'number' },
            version: { type: 'string' },
            environment: { type: 'string' },
            services: {
              type: 'object',
              properties: {
                database: { type: 'boolean' },
                redis: { type: 'boolean' }
              }
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const [dbHealth, redisHealth] = await Promise.all([
      db.healthCheck(),
      redis.healthCheck()
    ])

    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: serverConfig.nodeEnv,
      services: {
        database: dbHealth,
        redis: redisHealth
      }
    }
  })

  // API versioning
  await fastify.register(async (scope) => {
    const routePlugins: Array<[string, any, string]> = [
      ['authRoutes', authRoutes, '/auth'],
      ['websiteRoutes', websiteRoutes, '/websites'],
      ['templateRoutes', templateRoutes, '/templates'],
      ['aiRoutes', aiRoutes, '/ai'],
      ['userRoutes', userRoutes, '/users'],
      ['paymentRoutes', paymentRoutes, '/payments'],
      ['adminRoutes', adminRoutes, '/admin'],
      ['domainRoutes', domainRoutes, '/domains'],
      ['dnsVerificationRoutes', dnsVerificationRoutes, '/dns'],
      ['pwaRoutes', pwaRoutes, '/pwa'],
      ['analyticsRoutes', analyticsRoutes, '/analytics'],
      ['marketingRoutes', marketingRoutes, '/marketing'],
      ['integrationRoutes', integrationRoutes, '/integrations'],
      ['mediaRoutes', mediaRoutes, '/media'],
      ['designSystemRoutes', designSystemRoutes, '/design-systems'],
      ['agencyRoutes', agencyRoutes, '/agency'],
      ['blockchainRoutes', blockchainRoutes, '/blockchain'],
      ['notificationRoutes', notificationRoutes, '/notifications'],
      ['subscriptionRoutes', subscriptionRoutes, '/subscriptions'],
      ['aiOnboardingRoutes', aiOnboardingRoutes, '/ai-onboarding'],
      ['conversationRoutes', conversationRoutes, '/conversations'],
      ['contentRoutes', contentRoutes, '/content'],
      ['performanceOptimizationRoutes', performanceOptimizationRoutes, '/performance'],
      ['seoRoutes', seoRoutes, '/seo'],
      ['brandKitRoutes', brandKitRoutes, '/brand-kit'],
      ['productRoutes', productRoutes, '/products'],
      ['orderRoutes', orderRoutes, '/orders'],
      ['customerRoutes', customerRoutes, '/customers'],
      ['ecommerceSettingsRoutes', ecommerceSettingsRoutes, '/websites'],
      ['storePaymentsRoutes', storePaymentsRoutes, '/store-payments'],
      ['imageLibraryRoutes', imageLibraryRoutes, '/image-library']
    ]

    for (const [name, plugin, prefix] of routePlugins) {
      if (typeof plugin !== 'function') {
        throw new Error(`Route plugin ${name} is undefined or not a function`)
      }
      await scope.register(plugin, { prefix })
    }
  }, { prefix: '/v1' })

  // Root endpoint
  fastify.get('/', {
    schema: {
      description: 'API root endpoint',
      tags: ['Root'],
      response: {
        200: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            version: { type: 'string' },
            documentation: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }, async (request, reply) => {
    return {
      message: 'Pakistan Website Builder API',
      version: '1.0.0',
      documentation: serverConfig.enableSwagger ? '/docs' : 'Documentation not available',
      timestamp: new Date().toISOString()
    }
  })

  // Graceful shutdown
  const gracefulShutdown = async (signal: string) => {
    console.log(`Received ${signal}, shutting down gracefully...`)
    
    try {
      await fastify.close()
      await db.disconnect()
      await redis.disconnect()
      console.log('Server closed successfully')
      process.exit(0)
    } catch (error) {
      console.error('Error during shutdown:', error)
      process.exit(1)
    }
  }

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
  process.on('SIGINT', () => gracefulShutdown('SIGINT'))

  return fastify
}

export async function startServer() {
  try {
    // Validate configuration
    if (serverConfig.nodeEnv === 'production') {
      // Add production-specific validations
      if (!config.auth.jwtSecret || config.auth.jwtSecret === 'your-super-secret-jwt-key') {
        throw new Error('JWT secret must be set in production')
      }
    }

    // Connect to database
    await db.connect()
    console.log('✅ Database connected')

    // Test Redis connection
    const redisHealth = await redis.healthCheck()
    if (redisHealth) {
      console.log('✅ Redis connected')
    } else {
      console.warn('⚠️ Redis connection failed')
    }

    // Create and start server
    const server = await createServer()
    
    await server.listen({
      port: serverConfig.port,
      host: serverConfig.host
    })

    console.log(`🚀 Server running on http://${serverConfig.host}:${serverConfig.port}`)
    console.log(`📚 API Documentation: http://${serverConfig.host}:${serverConfig.port}/docs`)
    console.log(`🔍 Health Check: http://${serverConfig.host}:${serverConfig.port}/health`)

    return server
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Start server if this file is run directly
if (require.main === module) {
  startServer()
}
