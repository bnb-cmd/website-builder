import { FastifyInstance } from 'fastify'
import { performanceOptimizationService } from '../services/performanceOptimizationService.js'
import multer from 'fastify-multer'
import { promises as fs } from 'fs'
import path from 'path'

const upload = multer({
  dest: 'uploads/temp/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
})

export async function performanceOptimizationRoutes(fastify: FastifyInstance) {
  // Image Optimization
  fastify.post('/optimize-image', {
    schema: {
      description: 'Optimize an image with various transformations',
      tags: ['Performance Optimization'],
      consumes: ['multipart/form-data']
    },
    preHandler: upload.single('image')
  }, async (request, reply) => {
    const file = (request as any).file
    if (!file) {
      return reply.code(400).send({
        success: false,
        error: { message: 'No image file provided', code: 'NO_IMAGE' }
      })
    }

    const { format = 'webp', quality = 80, width, height, fit = 'cover' } = request.body as any

    try {
      // Read uploaded file
      const imageBuffer = await fs.readFile(file.path)

      // Optimize image
      const optimizedBuffer = await performanceOptimizationService.optimizeImage(imageBuffer, {
        format,
        quality: parseInt(quality),
        width: width ? parseInt(width) : undefined,
        height: height ? parseInt(height) : undefined,
        fit
      })

      // Clean up temp file
      await fs.unlink(file.path)

      // Return optimized image
      return reply
        .header('Content-Type', `image/${format}`)
        .header('Content-Disposition', `attachment; filename="optimized.${format}"`)
        .send(optimizedBuffer)

    } catch (error: any) {
      // Clean up temp file on error
      if (file?.path) {
        await fs.unlink(file.path).catch(() => {})
      }

      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'OPTIMIZATION_FAILED' }
      })
    }
  })

  fastify.post('/generate-image-variants', {
    schema: {
      description: 'Generate multiple optimized variants of an image',
      tags: ['Performance Optimization'],
      consumes: ['multipart/form-data']
    },
    preHandler: upload.single('image')
  }, async (request, reply) => {
    const file = (request as any).file
    if (!file) {
      return reply.code(400).send({
        success: false,
        error: { message: 'No image file provided', code: 'NO_IMAGE' }
      })
    }

    try {
      const imageBuffer = await fs.readFile(file.path)
      const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const variants = await performanceOptimizationService.generateImageVariants(imageBuffer, imageId)

      // Clean up temp file
      await fs.unlink(file.path)

      return reply.send({
        success: true,
        data: {
          imageId,
          variants
        }
      })

    } catch (error: any) {
      if (file?.path) {
        await fs.unlink(file.path).catch(() => {})
      }

      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'VARIANTS_GENERATION_FAILED' }
      })
    }
  })

  // Code Minification
  fastify.post('/minify/javascript', {
    schema: {
      description: 'Minify JavaScript code',
      tags: ['Performance Optimization'],
      body: {
        type: 'object',
        properties: {
          code: { type: 'string' }
        },
        required: ['code']
      }
    }
  }, async (request, reply) => {
    const { code } = request.body as { code: string }

    try {
      const minifiedCode = await performanceOptimizationService.minifyJavaScript(code)

      return reply.send({
        success: true,
        data: {
          originalSize: code.length,
          minifiedSize: minifiedCode.length,
          compressionRatio: ((code.length - minifiedCode.length) / code.length * 100).toFixed(2) + '%',
          code: minifiedCode
        }
      })

    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'MINIFICATION_FAILED' }
      })
    }
  })

  fastify.post('/minify/css', {
    schema: {
      description: 'Minify CSS code',
      tags: ['Performance Optimization'],
      body: {
        type: 'object',
        properties: {
          css: { type: 'string' }
        },
        required: ['css']
      }
    }
  }, async (request, reply) => {
    const { css } = request.body as { css: string }

    try {
      const minifiedCSS = await performanceOptimizationService.minifyCSS(css)

      return reply.send({
        success: true,
        data: {
          originalSize: css.length,
          minifiedSize: minifiedCSS.length,
          compressionRatio: ((css.length - minifiedCSS.length) / css.length * 100).toFixed(2) + '%',
          css: minifiedCSS
        }
      })

    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'MINIFICATION_FAILED' }
      })
    }
  })

  // Bundle Analysis
  fastify.get('/websites/:websiteId/bundle-analysis', {
    schema: {
      description: 'Analyze the website bundle for performance insights',
      tags: ['Performance Optimization'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }

    try {
      const analysis = await performanceOptimizationService.analyzeBundle(websiteId)

      return reply.send({
        success: true,
        data: analysis
      })

    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'ANALYSIS_FAILED' }
      })
    }
  })

  // Core Web Vitals
  fastify.get('/websites/:websiteId/core-web-vitals', {
    schema: {
      description: 'Get Core Web Vitals metrics for a website',
      tags: ['Performance Optimization'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      },
      querystring: {
        type: 'object',
        properties: {
          period: { type: 'string', enum: ['1d', '7d', '30d'], default: '7d' }
        }
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }
    const query = request.query as any

    try {
      const vitals = await performanceOptimizationService.getCoreWebVitals(
        websiteId,
        query.period || '7d'
      )

      return reply.send({
        success: true,
        data: vitals
      })

    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'VITALS_FAILED' }
      })
    }
  })

  // Performance Recommendations
  fastify.get('/websites/:websiteId/performance-recommendations', {
    schema: {
      description: 'Get personalized performance recommendations',
      tags: ['Performance Optimization'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }

    try {
      const recommendations = await performanceOptimizationService.generatePerformanceRecommendations(websiteId)

      return reply.send({
        success: true,
        data: recommendations
      })

    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'RECOMMENDATIONS_FAILED' }
      })
    }
  })

  // Lazy Loading Implementation
  fastify.post('/websites/:websiteId/implement-lazy-loading', {
    schema: {
      description: 'Implement lazy loading for website assets',
      tags: ['Performance Optimization'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }

    try {
      const result = await performanceOptimizationService.implementLazyLoading(websiteId)

      return reply.send({
        success: true,
        data: result
      })

    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'LAZY_LOADING_FAILED' }
      })
    }
  })

  // Critical CSS Extraction
  fastify.post('/extract-critical-css', {
    schema: {
      description: 'Extract critical CSS for above-the-fold content',
      tags: ['Performance Optimization'],
      body: {
        type: 'object',
        properties: {
          html: { type: 'string' },
          css: { type: 'string' }
        },
        required: ['html', 'css']
      }
    }
  }, async (request, reply) => {
    const { html, css } = request.body as { html: string; css: string }

    try {
      const result = await performanceOptimizationService.extractCriticalCSS('', html, css)

      return reply.send({
        success: true,
        data: result
      })

    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'CRITICAL_CSS_FAILED' }
      })
    }
  })

  // Resource Hints
  fastify.get('/websites/:websiteId/resource-hints', {
    schema: {
      description: 'Get resource hints recommendations',
      tags: ['Performance Optimization'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }

    try {
      const hints = await performanceOptimizationService.addResourceHints(websiteId)

      return reply.send({
        success: true,
        data: hints
      })

    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'HINTS_FAILED' }
      })
    }
  })

  // Performance Monitoring Setup
  fastify.post('/websites/:websiteId/setup-monitoring', {
    schema: {
      description: 'Set up performance monitoring for a website',
      tags: ['Performance Optimization'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }

    try {
      const monitoring = await performanceOptimizationService.setupPerformanceMonitoring(websiteId)

      return reply.send({
        success: true,
        data: monitoring
      })

    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'MONITORING_SETUP_FAILED' }
      })
    }
  })

  // Automated Optimization
  fastify.post('/websites/:websiteId/auto-optimize', {
    schema: {
      description: 'Run automated performance optimization',
      tags: ['Performance Optimization'],
      params: {
        type: 'object',
        properties: {
          websiteId: { type: 'string' }
        },
        required: ['websiteId']
      }
    }
  }, async (request, reply) => {
    const { websiteId } = request.params as { websiteId: string }

    try {
      const result = await performanceOptimizationService.runAutomatedOptimization(websiteId)

      return reply.send({
        success: true,
        data: result
      })

    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'AUTO_OPTIMIZATION_FAILED' }
      })
    }
  })

  // CDN Integration
  fastify.post('/cdn/upload', {
    schema: {
      description: 'Upload file to CDN',
      tags: ['Performance Optimization'],
      consumes: ['multipart/form-data']
    },
    preHandler: upload.single('file')
  }, async (request, reply) => {
    const file = (request as any).file
    if (!file) {
      return reply.code(400).send({
        success: false,
        error: { message: 'No file provided', code: 'NO_FILE' }
      })
    }

    try {
      const fileBuffer = await fs.readFile(file.path)
      const filePath = `/uploads/${Date.now()}_${file.originalname}`

      const cdnUrl = await performanceOptimizationService.uploadToCDN(filePath, fileBuffer)

      // Clean up temp file
      await fs.unlink(file.path)

      return reply.send({
        success: true,
        data: {
          cdnUrl,
          originalName: file.originalname,
          size: file.size
        }
      })

    } catch (error: any) {
      if (file?.path) {
        await fs.unlink(file.path).catch(() => {})
      }

      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'CDN_UPLOAD_FAILED' }
      })
    }
  })

  fastify.post('/cdn/purge-cache', {
    schema: {
      description: 'Purge CDN cache for specific URLs',
      tags: ['Performance Optimization'],
      body: {
        type: 'object',
        properties: {
          urls: { type: 'array', items: { type: 'string' } }
        },
        required: ['urls']
      }
    }
  }, async (request, reply) => {
    const { urls } = request.body as { urls: string[] }

    try {
      await performanceOptimizationService.purgeCDNCache(urls)

      return reply.send({
        success: true,
        message: `Cache purged for ${urls.length} URLs`
      })

    } catch (error: any) {
      return reply.code(400).send({
        success: false,
        error: { message: error.message, code: 'CACHE_PURGE_FAILED' }
      })
    }
  })
}
