import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { secureHeaders } from 'hono/secure-headers'
import { jwt } from 'hono/jwt'
import { rateLimiter } from 'hono/rate-limiter'

// Import middleware
import { authMiddleware } from './middleware/auth'
import { errorHandler } from './middleware/error'

// Import routes
import authRoutes from './routes/auth'
import contentRoutes from './routes/content'
import mediaRoutes from './routes/media'
import templateRoutes from './routes/templates'
import aiRoutes from './routes/ai'
import paymentRoutes from './routes/payments'
import productRoutes from './routes/products'
import publishRoutes from './routes/publish'
import versionRoutes from './routes/versions'
import userTemplateRoutes from './routes/user-templates'
import sitemapRoutes from './routes/sitemap'
// E-commerce routes
import orderRoutes from './routes/orders'
import checkoutRoutes from './routes/checkout'
import socialSyncRoutes from './routes/social-sync'

// Import database and cache
import { initDB } from './lib/db'
import { initKV } from './lib/kv'

export interface Env {
  DB: D1Database
  CACHE: KVNamespace
  ASSETS: R2Bucket
  PUBLISH_QUEUE: Queue
  COLLABORATION: DurableObjectNamespace
  JWT_SECRET: string
  OPENAI_API_KEY: string
  ANTHROPIC_API_KEY: string
  GOOGLE_AI_API_KEY: string
  NODE_ENV: string
  CLOUDFLARE_IMAGES_ACCOUNT_ID: string
  // E-commerce environment variables
  EASYPAISA_STORE_ID: string
  EASYPAISA_MERCHANT_KEY: string
  JAZZCASH_MERCHANT_ID: string
  JAZZCASH_PASSWORD: string
  INSTAGRAM_APP_ID: string
  INSTAGRAM_APP_SECRET: string
  TIKTOK_APP_KEY: string
  TIKTOK_APP_SECRET: string
  FACEBOOK_APP_ID: string
  FACEBOOK_APP_SECRET: string
  PINTEREST_APP_ID: string
  PINTEREST_APP_SECRET: string
  WHATSAPP_ACCESS_TOKEN: string
  PRODUCT_IMAGES: R2Bucket
}

const app = new Hono<{ Bindings: Env }>()

// Global middleware
app.use('*', logger())
app.use('*', prettyJSON())
app.use('*', secureHeaders())
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://pakistan-builder.pages.dev'],
  credentials: true,
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}))

// Rate limiting
app.use('*', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  keyGenerator: (c) => c.req.header('cf-connecting-ip') || 'unknown'
}))

// Health check
app.get('/health', async (c) => {
  const [dbHealth, kvHealth] = await Promise.all([
    c.env.DB.prepare('SELECT 1').first().then(() => true).catch(() => false),
    c.env.CACHE.get('health').then(() => true).catch(() => false)
  ])

  return c.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      database: dbHealth,
      cache: kvHealth
    }
  })
})

// API root
app.get('/', (c) => {
  return c.json({
    message: 'Pakistan Website Builder API',
    version: '2.0.0',
    environment: c.env.NODE_ENV,
    timestamp: new Date().toISOString()
  })
})

// Register routes
app.route('/api/v1/auth', authRoutes)
app.route('/api/v1/content', contentRoutes)
app.route('/api/v1/media', mediaRoutes)
app.route('/api/v1/templates', templateRoutes)
app.route('/api/v1/ai', aiRoutes)
app.route('/api/v1/payments', paymentRoutes)
app.route('/api/v1/products', productRoutes)
app.route('/api/v1/publish', publishRoutes)
app.route('/api/v1/versions', versionRoutes)
app.route('/api/v1/user-templates', userTemplateRoutes)
app.route('/api/v1/sitemap', sitemapRoutes)
// E-commerce routes
app.route('/api/v1/orders', orderRoutes)
app.route('/api/v1/checkout', checkoutRoutes)
app.route('/api/v1/social', socialSyncRoutes)

// Error handling
app.onError(errorHandler)

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

export default app
