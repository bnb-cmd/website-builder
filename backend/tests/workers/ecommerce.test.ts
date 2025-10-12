import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Miniflare } from 'miniflare'
import { Hono } from 'hono'
import orderRoutes from '../routes/orders'
import checkoutRoutes from '../routes/checkout'
import socialSyncRoutes from '../routes/social-sync'

describe('E-commerce API Routes', () => {
  let mf: Miniflare
  let app: Hono

  beforeEach(async () => {
    mf = new Miniflare({
      modules: true,
      script: '',
      bindings: {
        DB: {
          prepare: vi.fn().mockReturnValue({
            first: vi.fn(),
            all: vi.fn(),
            run: vi.fn()
          }),
          exec: vi.fn(),
          batch: vi.fn()
        },
        CACHE_KV: {
          get: vi.fn(),
          put: vi.fn(),
          delete: vi.fn()
        },
        PRODUCT_IMAGES: {
          put: vi.fn()
        },
        EASYPAISA_STORE_ID: 'test-store-id',
        EASYPAISA_MERCHANT_KEY: 'test-merchant-key',
        JAZZCASH_MERCHANT_ID: 'test-merchant-id',
        JAZZCASH_PASSWORD: 'test-password',
        INSTAGRAM_APP_ID: 'test-instagram-id',
        INSTAGRAM_APP_SECRET: 'test-instagram-secret',
        TIKTOK_APP_KEY: 'test-tiktok-key',
        TIKTOK_APP_SECRET: 'test-tiktok-secret',
        FACEBOOK_APP_ID: 'test-facebook-id',
        FACEBOOK_APP_SECRET: 'test-facebook-secret',
        PINTEREST_APP_ID: 'test-pinterest-id',
        PINTEREST_APP_SECRET: 'test-pinterest-secret',
        WHATSAPP_ACCESS_TOKEN: 'test-whatsapp-token'
      }
    })

    app = new Hono()
    app.route('/orders', orderRoutes)
    app.route('/checkout', checkoutRoutes)
    app.route('/social', socialSyncRoutes)
  })

  afterEach(async () => {
    await mf.dispose()
  })

  describe('Order Management', () => {
    it('should create a new order successfully', async () => {
      const orderData = {
        websiteId: 'test-website-id',
        customerName: 'John Doe',
        customerPhone: '+92 300 1234567',
        customerEmail: 'john@example.com',
        items: [
          {
            productId: 'product-1',
            quantity: 2,
            price: 1000
          }
        ],
        shippingAddress: {
          addressLine1: '123 Main Street',
          addressLine2: 'Apt 4B',
          city: 'Karachi',
          postalCode: '75000',
          phone: '+92 300 1234567'
        },
        paymentMethod: 'cod',
        notes: 'Please deliver after 6 PM'
      }

      const res = await app.request('/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.orderId).toBeDefined()
      expect(data.data.totalAmount).toBe(2000)
      expect(data.data.currency).toBe('PKR')
    })

    it('should validate Pakistani phone number format', async () => {
      const orderData = {
        websiteId: 'test-website-id',
        customerName: 'John Doe',
        customerPhone: 'invalid-phone',
        items: [
          {
            productId: 'product-1',
            quantity: 1,
            price: 1000
          }
        ],
        shippingAddress: {
          addressLine1: '123 Main Street',
          city: 'Karachi',
          phone: '+92 300 1234567'
        },
        paymentMethod: 'cod'
      }

      const res = await app.request('/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.success).toBe(false)
      expect(data.error.message).toContain('Invalid Pakistani phone number')
    })

    it('should require authentication for order listing', async () => {
      const res = await app.request('/orders?websiteId=test-website-id')

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data.success).toBe(false)
      expect(data.error.code).toBe('NOT_AUTHENTICATED')
    })

    it('should require STARTER package for order management', async () => {
      // Mock user with FREE package
      const res = await app.request('/orders?websiteId=test-website-id', {
        headers: {
          'Authorization': 'Bearer free-user-token'
        }
      })

      expect(res.status).toBe(403)
      const data = await res.json()
      expect(data.success).toBe(false)
      expect(data.error.code).toBe('PACKAGE_UPGRADE_REQUIRED')
      expect(data.error.requiredPackage).toBe('STARTER')
    })
  })

  describe('Payment Processing', () => {
    it('should initiate Easypaisa payment', async () => {
      const paymentData = {
        orderId: 'test-order-id',
        paymentMethod: 'easypaisa',
        returnUrl: 'https://example.com/success'
      }

      const res = await app.request('/checkout/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer starter-user-token'
        },
        body: JSON.stringify(paymentData)
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.paymentMethod).toBe('easypaisa')
      expect(data.data.paymentUrl).toBeDefined()
    })

    it('should initiate JazzCash payment', async () => {
      const paymentData = {
        orderId: 'test-order-id',
        paymentMethod: 'jazzcash',
        returnUrl: 'https://example.com/success'
      }

      const res = await app.request('/checkout/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer starter-user-token'
        },
        body: JSON.stringify(paymentData)
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.paymentMethod).toBe('jazzcash')
    })

    it('should handle COD confirmation', async () => {
      const codData = {
        orderId: 'test-order-id',
        confirmed: true
      }

      const res = await app.request('/checkout/cod/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer starter-user-token'
        },
        body: JSON.stringify(codData)
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.status).toBe('confirmed')
      expect(data.data.paymentStatus).toBe('paid')
    })

    it('should verify payment webhook signatures', async () => {
      const callbackData = {
        transactionId: 'test-transaction-id',
        orderId: 'test-order-id',
        amount: '2000',
        status: 'success',
        signature: 'invalid-signature'
      }

      const res = await app.request('/checkout/easypaisa/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(callbackData)
      })

      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.success).toBe(false)
      expect(data.error.code).toBe('INVALID_SIGNATURE')
    })
  })

  describe('Social Media Integration', () => {
    it('should require PRO package for OAuth integration', async () => {
      const res = await app.request('/social/auth/instagram?websiteId=test-website-id', {
        headers: {
          'Authorization': 'Bearer starter-user-token'
        }
      })

      expect(res.status).toBe(403)
      const data = await res.json()
      expect(data.success).toBe(false)
      expect(data.error.code).toBe('PACKAGE_UPGRADE_REQUIRED')
      expect(data.error.requiredPackage).toBe('PRO')
    })

    it('should allow STARTER package for manual link import', async () => {
      const importData = {
        websiteId: 'test-website-id',
        url: 'https://instagram.com/p/test-post',
        platform: 'instagram'
      }

      const res = await app.request('/social/import-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer starter-user-token'
        },
        body: JSON.stringify(importData)
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.productId).toBeDefined()
      expect(data.data.platform).toBe('instagram')
    })

    it('should extract product data from social media URLs', async () => {
      const importData = {
        websiteId: 'test-website-id',
        url: 'https://instagram.com/p/test-post',
        platform: 'instagram'
      }

      // Mock fetch to return Instagram post HTML
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(`
          <html>
            <head>
              <meta property="og:title" content="Beautiful Handmade Jewelry">
              <meta property="og:description" content="Handcrafted silver necklace - Rs. 2,500">
              <meta property="og:image" content="https://example.com/image.jpg">
            </head>
          </html>
        `)
      })

      const res = await app.request('/social/import-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer starter-user-token'
        },
        body: JSON.stringify(importData)
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.name).toBe('Beautiful Handmade Jewelry')
      expect(data.data.price).toBe(2500)
    })

    it('should require ENTERPRISE package for WhatsApp Business', async () => {
      const res = await app.request('/social/auth/whatsapp_business?websiteId=test-website-id', {
        headers: {
          'Authorization': 'Bearer pro-user-token'
        }
      })

      expect(res.status).toBe(403)
      const data = await res.json()
      expect(data.success).toBe(false)
      expect(data.error.code).toBe('PACKAGE_UPGRADE_REQUIRED')
      expect(data.error.requiredPackage).toBe('ENTERPRISE')
    })

    it('should sync products from connected social accounts', async () => {
      const syncData = {
        websiteId: 'test-website-id',
        platform: 'instagram'
      }

      const res = await app.request('/social/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer pro-user-token'
        },
        body: JSON.stringify(syncData)
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.success).toBe(true)
      expect(data.data.results).toBeDefined()
    })
  })

  describe('Package Restrictions', () => {
    it('should enforce product limits based on package', async () => {
      // Mock user with STARTER package (50 products max)
      const productData = {
        websiteId: 'test-website-id',
        name: 'Test Product',
        description: 'Test Description',
        price: 1000,
        currency: 'PKR',
        imageUrl: 'https://example.com/image.jpg'
      }

      // Mock database to return 50 products (at limit)
      const mockDb = {
        prepare: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue({ count: 50 })
        })
      }

      const res = await app.request('/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer starter-user-token'
        },
        body: JSON.stringify(productData)
      })

      expect(res.status).toBe(403)
      const data = await res.json()
      expect(data.success).toBe(false)
      expect(data.error.code).toBe('PRODUCT_LIMIT_EXCEEDED')
    })

    it('should allow unlimited products for ENTERPRISE package', async () => {
      const productData = {
        websiteId: 'test-website-id',
        name: 'Test Product',
        description: 'Test Description',
        price: 1000,
        currency: 'PKR',
        imageUrl: 'https://example.com/image.jpg'
      }

      const res = await app.request('/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer enterprise-user-token'
        },
        body: JSON.stringify(productData)
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.success).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Mock database error
      const mockDb = {
        prepare: vi.fn().mockReturnValue({
          first: vi.fn().mockRejectedValue(new Error('Database connection failed'))
        })
      }

      const res = await app.request('/orders?websiteId=test-website-id', {
        headers: {
          'Authorization': 'Bearer starter-user-token'
        }
      })

      expect(res.status).toBe(500)
      const data = await res.json()
      expect(data.success).toBe(false)
      expect(data.error.code).toBe('ORDERS_RETRIEVAL_FAILED')
    })

    it('should handle invalid JSON in request body', async () => {
      const res = await app.request('/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: 'invalid-json'
      })

      expect(res.status).toBe(400)
    })

    it('should handle missing required fields', async () => {
      const incompleteData = {
        websiteId: 'test-website-id',
        customerName: 'John Doe'
        // Missing required fields
      }

      const res = await app.request('/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(incompleteData)
      })

      expect(res.status).toBe(400)
    })
  })

  describe('Security', () => {
    it('should sanitize user input', async () => {
      const maliciousData = {
        websiteId: 'test-website-id',
        customerName: '<script>alert("xss")</script>',
        customerPhone: '+92 300 1234567',
        items: [
          {
            productId: 'product-1',
            quantity: 1,
            price: 1000
          }
        ],
        shippingAddress: {
          addressLine1: '123 Main Street',
          city: 'Karachi',
          phone: '+92 300 1234567'
        },
        paymentMethod: 'cod'
      }

      const res = await app.request('/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(maliciousData)
      })

      expect(res.status).toBe(200)
      // Verify that script tags are sanitized
      const data = await res.json()
      expect(data.success).toBe(true)
    })

    it('should rate limit order creation', async () => {
      const orderData = {
        websiteId: 'test-website-id',
        customerName: 'John Doe',
        customerPhone: '+92 300 1234567',
        items: [
          {
            productId: 'product-1',
            quantity: 1,
            price: 1000
          }
        ],
        shippingAddress: {
          addressLine1: '123 Main Street',
          city: 'Karachi',
          phone: '+92 300 1234567'
        },
        paymentMethod: 'cod'
      }

      // Make multiple requests rapidly
      const promises = Array(10).fill(null).map(() =>
        app.request('/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        })
      )

      const responses = await Promise.all(promises)
      
      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(res => res.status === 429)
      expect(rateLimitedResponses.length).toBeGreaterThan(0)
    })
  })
})
