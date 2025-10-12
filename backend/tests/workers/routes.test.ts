import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { Hono } from 'hono'
import { db } from '../src/workers/lib/db'
import { kv } from '../src/workers/lib/kv'
import { r2 } from '../src/workers/lib/r2'
import { authRoutes } from '../src/workers/routes/auth'
import { contentRoutes } from '../src/workers/routes/content'
import { mediaRoutes } from '../src/workers/routes/media'
import { templateRoutes } from '../src/workers/routes/templates'
import { aiRoutes } from '../src/workers/routes/ai'
import { publishRoutes } from '../src/workers/routes/publish'
import { versionRoutes } from '../src/workers/routes/versions'
import { userTemplateRoutes } from '../src/workers/routes/user-templates'
import { sitemapRoutes } from '../src/workers/routes/sitemap'
import { productRoutes } from '../src/workers/routes/products'
import { paymentRoutes } from '../src/workers/routes/payments'

// Mock environment
const mockEnv = {
  DB: {} as D1Database,
  CACHE_KV: {} as KVNamespace,
  ASSETS_BUCKET: {} as R2Bucket,
  PUBLISH_QUEUE: {} as Queue,
  EDITOR_STATE: {} as DurableObjectNamespace,
  JWT_SECRET: 'test-secret',
  CLOUDFLARE_ACCOUNT_ID: 'test-account',
  CLOUDFLARE_API_TOKEN: 'test-token',
  AI_API_KEY: 'test-ai-key'
}

// Mock context
const createMockContext = (method: string, path: string, body?: any) => ({
  req: {
    method,
    url: `https://example.com${path}`,
    json: () => Promise.resolve(body || {}),
    param: (key: string) => path.split('/').pop() || '',
    query: (key: string) => new URLSearchParams(path.split('?')[1] || '').get(key) || '',
    header: (key: string) => key === 'Authorization' ? 'Bearer test-token' : ''
  },
  env: mockEnv,
  json: (data: any) => new Response(JSON.stringify(data)),
  text: (data: string) => new Response(data),
  status: (code: number) => ({ json: (data: any) => new Response(JSON.stringify(data), { status: code }) })
})

// Test data
const testUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashedpassword',
  role: 'USER',
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

const testSite = {
  id: 'site-123',
  name: 'Test Site',
  description: 'A test website',
  status: 'DRAFT',
  content: JSON.stringify({ pages: [] }),
  settings: JSON.stringify({ theme: 'default' }),
  userId: 'user-123',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

const testPage = {
  id: 'page-123',
  name: 'Home Page',
  slug: 'home',
  content: JSON.stringify({
    components: [
      {
        id: 'comp-1',
        type: 'hero',
        props: { title: 'Welcome' },
        layout: { default: { x: 0, y: 0, width: 100, height: 400 } },
        styles: { default: { backgroundColor: '#f8f9fa' } }
      }
    ]
  }),
  siteId: 'site-123',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

describe('Auth Routes', () => {
  let app: Hono

  beforeEach(() => {
    app = new Hono()
    app.route('/auth', authRoutes)
  })

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const mockContext = createMockContext('POST', '/auth/register', {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'password123'
      })

      // Mock database response
      vi.spyOn(db, 'queryOne').mockResolvedValue(null) // User doesn't exist
      vi.spyOn(db, 'execute').mockResolvedValue({ success: true })

      const response = await app.request('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'newuser@example.com',
          name: 'New User',
          password: 'password123'
        })
      })

      expect(response.status).toBe(201)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.user.email).toBe('newuser@example.com')
    })

    it('should reject duplicate email', async () => {
      const mockContext = createMockContext('POST', '/auth/register', {
        email: 'existing@example.com',
        name: 'Existing User',
        password: 'password123'
      })

      // Mock database response - user exists
      vi.spyOn(db, 'queryOne').mockResolvedValue(testUser)

      const response = await app.request('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'existing@example.com',
          name: 'Existing User',
          password: 'password123'
        })
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error.message).toContain('already exists')
    })

    it('should validate email format', async () => {
      const response = await app.request('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid-email',
          name: 'Test User',
          password: 'password123'
        })
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error.message).toContain('Invalid email')
    })
  })

  describe('POST /auth/login', () => {
    it('should login with valid credentials', async () => {
      // Mock database response
      vi.spyOn(db, 'queryOne').mockResolvedValue(testUser)
      vi.spyOn(db, 'execute').mockResolvedValue({ success: true })

      const response = await app.request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.token).toBeDefined()
      expect(data.data.user.email).toBe('test@example.com')
    })

    it('should reject invalid credentials', async () => {
      // Mock database response - user not found
      vi.spyOn(db, 'queryOne').mockResolvedValue(null)

      const response = await app.request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        })
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error.message).toContain('Invalid credentials')
    })
  })
})

describe('Content Routes', () => {
  let app: Hono

  beforeEach(() => {
    app = new Hono()
    app.route('/content', contentRoutes)
  })

  describe('GET /content/sites', () => {
    it('should return user sites', async () => {
      // Mock database response
      vi.spyOn(db, 'query').mockResolvedValue([testSite])

      const response = await app.request('/content/sites', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer test-token' }
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].name).toBe('Test Site')
    })

    it('should require authentication', async () => {
      const response = await app.request('/content/sites', {
        method: 'GET'
        // No Authorization header
      })

      expect(response.status).toBe(401)
    })
  })

  describe('POST /content/sites', () => {
    it('should create a new site', async () => {
      // Mock database response
      vi.spyOn(db, 'execute').mockResolvedValue({ success: true })
      vi.spyOn(db, 'queryOne').mockResolvedValue({ ...testSite, id: 'new-site-123' })

      const response = await app.request('/content/sites', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
          name: 'New Site',
          description: 'A new website',
          subdomain: 'new-site'
        })
      })

      expect(response.status).toBe(201)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.name).toBe('New Site')
    })

    it('should validate required fields', async () => {
      const response = await app.request('/content/sites', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
          // Missing required fields
        })
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error.message).toContain('required')
    })
  })

  describe('GET /content/sites/:id/pages', () => {
    it('should return site pages', async () => {
      // Mock database response
      vi.spyOn(db, 'query').mockResolvedValue([testPage])

      const response = await app.request('/content/sites/site-123/pages', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer test-token' }
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].name).toBe('Home Page')
    })
  })

  describe('PATCH /content/sites/:id/pages/:pageId', () => {
    it('should update page with JSON patch', async () => {
      // Mock database response
      vi.spyOn(db, 'queryOne').mockResolvedValue(testPage)
      vi.spyOn(db, 'execute').mockResolvedValue({ success: true })

      const response = await app.request('/content/sites/site-123/pages/page-123', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify([
          { op: 'replace', path: '/name', value: 'Updated Page Name' }
        ])
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.name).toBe('Updated Page Name')
    })

    it('should validate JSON patch format', async () => {
      const response = await app.request('/content/sites/site-123/pages/page-123', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify([
          { op: 'invalid', path: '/name', value: 'Updated Page Name' }
        ])
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error.message).toContain('Invalid patch operation')
    })
  })
})

describe('Media Routes', () => {
  let app: Hono

  beforeEach(() => {
    app = new Hono()
    app.route('/media', mediaRoutes)
  })

  describe('POST /media/upload', () => {
    it('should generate presigned URL for upload', async () => {
      // Mock R2 response
      vi.spyOn(r2, 'getPresignedUrl').mockResolvedValue('https://example.com/presigned-url')

      const response = await app.request('/media/upload', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
          fileName: 'test-image.jpg',
          fileType: 'image/jpeg',
          fileSize: 1024000
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.presignedUrl).toBe('https://example.com/presigned-url')
    })

    it('should validate file type', async () => {
      const response = await app.request('/media/upload', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
          fileName: 'test-file.exe',
          fileType: 'application/x-executable',
          fileSize: 1024000
        })
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error.message).toContain('Invalid file type')
    })

    it('should validate file size', async () => {
      const response = await app.request('/media/upload', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
          fileName: 'test-image.jpg',
          fileType: 'image/jpeg',
          fileSize: 50 * 1024 * 1024 // 50MB
        })
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error.message).toContain('File too large')
    })
  })

  describe('GET /media/list', () => {
    it('should return user media files', async () => {
      // Mock R2 response
      vi.spyOn(r2, 'list').mockResolvedValue([
        {
          key: 'user-123/image1.jpg',
          size: 1024000,
          lastModified: new Date().toISOString(),
          etag: 'etag1'
        },
        {
          key: 'user-123/image2.jpg',
          size: 2048000,
          lastModified: new Date().toISOString(),
          etag: 'etag2'
        }
      ])

      const response = await app.request('/media/list', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer test-token' }
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(2)
      expect(data.data[0].key).toBe('user-123/image1.jpg')
    })
  })

  describe('DELETE /media/:id', () => {
    it('should delete media file', async () => {
      // Mock R2 response
      vi.spyOn(r2, 'delete').mockResolvedValue(true)

      const response = await app.request('/media/image1.jpg', {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer test-token' }
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.message).toContain('deleted')
    })

    it('should handle delete errors', async () => {
      // Mock R2 response - delete fails
      vi.spyOn(r2, 'delete').mockResolvedValue(false)

      const response = await app.request('/media/image1.jpg', {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer test-token' }
      })

      expect(response.status).toBe(500)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error.message).toContain('Failed to delete')
    })
  })
})

describe('Template Routes', () => {
  let app: Hono

  beforeEach(() => {
    app = new Hono()
    app.route('/templates', templateRoutes)
  })

  describe('GET /templates', () => {
    it('should return available templates', async () => {
      // Mock database response
      vi.spyOn(db, 'query').mockResolvedValue([
        {
          id: 'template-1',
          name: 'Business Template',
          description: 'Professional business website',
          category: 'business',
          preview: 'preview-url',
          components: JSON.stringify([]),
          isPublic: true,
          createdAt: new Date().toISOString()
        }
      ])

      const response = await app.request('/templates', {
        method: 'GET'
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].name).toBe('Business Template')
    })

    it('should filter templates by category', async () => {
      // Mock database response
      vi.spyOn(db, 'query').mockResolvedValue([])

      const response = await app.request('/templates?category=business', {
        method: 'GET'
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(0)
    })
  })

  describe('GET /templates/:id', () => {
    it('should return template details', async () => {
      // Mock database response
      vi.spyOn(db, 'queryOne').mockResolvedValue({
        id: 'template-1',
        name: 'Business Template',
        description: 'Professional business website',
        category: 'business',
        preview: 'preview-url',
        components: JSON.stringify([]),
        isPublic: true,
        createdAt: new Date().toISOString()
      })

      const response = await app.request('/templates/template-1', {
        method: 'GET'
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.name).toBe('Business Template')
    })

    it('should return 404 for non-existent template', async () => {
      // Mock database response
      vi.spyOn(db, 'queryOne').mockResolvedValue(null)

      const response = await app.request('/templates/non-existent', {
        method: 'GET'
      })

      expect(response.status).toBe(404)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error.message).toContain('not found')
    })
  })
})

describe('Publish Routes', () => {
  let app: Hono

  beforeEach(() => {
    app = new Hono()
    app.route('/publish', publishRoutes)
  })

  describe('POST /publish', () => {
    it('should start publish job', async () => {
      // Mock KV response
      vi.spyOn(kv, 'setJSON').mockResolvedValue(undefined)
      vi.spyOn(kv, 'getJSON').mockResolvedValue({
        id: 'job-123',
        status: 'pending',
        progress: 0,
        message: 'Starting publish process...',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      const response = await app.request('/publish', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
          siteId: 'site-123',
          pages: [testPage],
          settings: {
            siteName: 'Test Site',
            description: 'A test website',
            language: 'ENGLISH',
            direction: 'ltr'
          }
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.jobId).toBeDefined()
      expect(data.data.status).toBe('pending')
    })

    it('should validate publish request', async () => {
      const response = await app.request('/publish', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
          // Missing required fields
        })
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error.message).toContain('required')
    })
  })

  describe('GET /publish/:jobId/status', () => {
    it('should return job status', async () => {
      // Mock KV response
      vi.spyOn(kv, 'getJSON').mockResolvedValue({
        id: 'job-123',
        status: 'processing',
        progress: 50,
        message: 'Generating HTML...',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      const response = await app.request('/publish/job-123/status', {
        method: 'GET'
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.status).toBe('processing')
      expect(data.data.progress).toBe(50)
    })

    it('should return 404 for non-existent job', async () => {
      // Mock KV response
      vi.spyOn(kv, 'getJSON').mockResolvedValue(null)

      const response = await app.request('/publish/non-existent/status', {
        method: 'GET'
      })

      expect(response.status).toBe(404)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error.message).toContain('not found')
    })
  })

  describe('POST /publish/:jobId/cancel', () => {
    it('should cancel publish job', async () => {
      // Mock KV response
      vi.spyOn(kv, 'getJSON').mockResolvedValue({
        id: 'job-123',
        status: 'pending',
        progress: 0,
        message: 'Starting publish process...',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      vi.spyOn(kv, 'setJSON').mockResolvedValue(undefined)

      const response = await app.request('/publish/job-123/cancel', {
        method: 'POST'
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.status).toBe('cancelled')
    })

    it('should not cancel completed job', async () => {
      // Mock KV response
      vi.spyOn(kv, 'getJSON').mockResolvedValue({
        id: 'job-123',
        status: 'completed',
        progress: 100,
        message: 'Publish completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      const response = await app.request('/publish/job-123/cancel', {
        method: 'POST'
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error.message).toContain('Cannot cancel')
    })
  })
})

describe('Sitemap Routes', () => {
  let app: Hono

  beforeEach(() => {
    app = new Hono()
    app.route('/sitemap', sitemapRoutes)
  })

  describe('POST /sitemap', () => {
    it('should generate sitemap and robots.txt', async () => {
      // Mock R2 response
      vi.spyOn(r2, 'upload').mockResolvedValue(true)
      vi.spyOn(db, 'execute').mockResolvedValue({ success: true })

      const response = await app.request('/sitemap', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
          siteId: 'site-123',
          pages: [testPage],
          settings: {
            siteName: 'Test Site',
            description: 'A test website',
            language: 'ENGLISH',
            direction: 'ltr',
            subdomain: 'test-site'
          }
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.sitemapUrl).toContain('sitemap.xml')
      expect(data.data.robotsUrl).toContain('robots.txt')
      expect(data.data.pagesCount).toBe(1)
    })
  })

  describe('GET /sitemap/:siteId/xml', () => {
    it('should return sitemap XML', async () => {
      // Mock R2 response
      vi.spyOn(r2, 'get').mockResolvedValue('<?xml version="1.0" encoding="UTF-8"?><urlset></urlset>')

      const response = await app.request('/sitemap/site-123/xml', {
        method: 'GET'
      })

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('application/xml')
    })

    it('should return 404 for non-existent sitemap', async () => {
      // Mock R2 response
      vi.spyOn(r2, 'get').mockResolvedValue(null)

      const response = await app.request('/sitemap/non-existent/xml', {
        method: 'GET'
      })

      expect(response.status).toBe(404)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error.message).toContain('not found')
    })
  })

  describe('GET /sitemap/:siteId/robots', () => {
    it('should return robots.txt', async () => {
      // Mock R2 response
      vi.spyOn(r2, 'get').mockResolvedValue('User-agent: *\nAllow: /')

      const response = await app.request('/sitemap/site-123/robots', {
        method: 'GET'
      })

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('text/plain')
    })
  })
})

describe('AI Routes', () => {
  let app: Hono

  beforeEach(() => {
    app = new Hono()
    app.route('/ai', aiRoutes)
  })

  describe('POST /ai/generate-content', () => {
    it('should generate content using AI', async () => {
      // Mock AI response
      const mockAIResponse = {
        content: 'Generated content',
        suggestions: ['suggestion1', 'suggestion2']
      }

      const response = await app.request('/ai/generate-content', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
          prompt: 'Generate a hero section for a business website',
          type: 'hero',
          language: 'ENGLISH'
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.content).toBeDefined()
    })

    it('should validate AI request', async () => {
      const response = await app.request('/ai/generate-content', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
          // Missing required fields
        })
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.error.message).toContain('required')
    })
  })

  describe('POST /ai/optimize-seo', () => {
    it('should optimize SEO content', async () => {
      const response = await app.request('/ai/optimize-seo', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
          content: 'Test content',
          keywords: ['test', 'website'],
          language: 'ENGLISH'
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.optimizedContent).toBeDefined()
    })
  })
})

describe('Version Routes', () => {
  let app: Hono

  beforeEach(() => {
    app = new Hono()
    app.route('/versions', versionRoutes)
  })

  describe('GET /versions/sites/:siteId', () => {
    it('should return site versions', async () => {
      // Mock database response
      vi.spyOn(db, 'query').mockResolvedValue([
        {
          id: 'version-1',
          siteId: 'site-123',
          version: 1,
          content: JSON.stringify({ pages: [] }),
          message: 'Initial version',
          createdAt: new Date().toISOString()
        }
      ])

      const response = await app.request('/versions/sites/site-123', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer test-token' }
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].version).toBe(1)
    })
  })

  describe('POST /versions/sites/:siteId/restore', () => {
    it('should restore site version', async () => {
      // Mock database response
      vi.spyOn(db, 'queryOne').mockResolvedValue({
        id: 'version-1',
        siteId: 'site-123',
        version: 1,
        content: JSON.stringify({ pages: [] }),
        message: 'Initial version',
        createdAt: new Date().toISOString()
      })
      vi.spyOn(db, 'execute').mockResolvedValue({ success: true })

      const response = await app.request('/versions/sites/site-123/restore', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
          versionId: 'version-1'
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.message).toContain('restored')
    })
  })
})

describe('User Template Routes', () => {
  let app: Hono

  beforeEach(() => {
    app = new Hono()
    app.route('/user-templates', userTemplateRoutes)
  })

  describe('POST /user-templates', () => {
    it('should save user template', async () => {
      // Mock database response
      vi.spyOn(db, 'execute').mockResolvedValue({ success: true })
      vi.spyOn(db, 'queryOne').mockResolvedValue({
        id: 'template-123',
        name: 'My Template',
        description: 'A custom template',
        category: 'business',
        components: JSON.stringify([]),
        userId: 'user-123',
        createdAt: new Date().toISOString()
      })

      const response = await app.request('/user-templates', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
          name: 'My Template',
          description: 'A custom template',
          category: 'business',
          components: []
        })
      })

      expect(response.status).toBe(201)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.name).toBe('My Template')
    })
  })

  describe('GET /user-templates', () => {
    it('should return user templates', async () => {
      // Mock database response
      vi.spyOn(db, 'query').mockResolvedValue([
        {
          id: 'template-123',
          name: 'My Template',
          description: 'A custom template',
          category: 'business',
          components: JSON.stringify([]),
          userId: 'user-123',
          createdAt: new Date().toISOString()
        }
      ])

      const response = await app.request('/user-templates', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer test-token' }
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].name).toBe('My Template')
    })
  })
})

describe('Product Routes', () => {
  let app: Hono

  beforeEach(() => {
    app = new Hono()
    app.route('/products', productRoutes)
  })

  describe('GET /products', () => {
    it('should return products', async () => {
      // Mock database response
      vi.spyOn(db, 'query').mockResolvedValue([
        {
          id: 'product-1',
          name: 'Test Product',
          description: 'A test product',
          price: 99.99,
          category: 'electronics',
          image: 'product-image.jpg',
          status: 'ACTIVE',
          createdAt: new Date().toISOString()
        }
      ])

      const response = await app.request('/products', {
        method: 'GET'
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].name).toBe('Test Product')
    })
  })
})

describe('Payment Routes', () => {
  let app: Hono

  beforeEach(() => {
    app = new Hono()
    app.route('/payments', paymentRoutes)
  })

  describe('POST /payments/create-intent', () => {
    it('should create payment intent', async () => {
      // Mock Stripe response
      const mockStripeResponse = {
        id: 'pi_123',
        client_secret: 'pi_123_secret',
        amount: 999,
        currency: 'usd',
        status: 'requires_payment_method'
      }

      const response = await app.request('/payments/create-intent', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
          amount: 999,
          currency: 'usd',
          description: 'Test payment'
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.clientSecret).toBeDefined()
    })
  })
})

// Cleanup after each test
afterEach(() => {
  vi.restoreAllMocks()
})
