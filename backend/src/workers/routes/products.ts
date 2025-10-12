import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { initDB, initKV, cacheKeys, cacheTTL } from '../lib'
import type { Env } from '../index'

const app = new Hono<{ Bindings: Env }>()

// Apply auth middleware to all routes
app.use('*', authMiddleware)

// Get products for website
app.get('/websites/:websiteId', async (c) => {
  const user = c.get('user')
  const websiteId = c.req.param('websiteId')
  const db = initDB(c.env)

  // Verify website ownership
  const websites = await db.query(
    'SELECT id FROM websites WHERE id = ? AND user_id = ?',
    [websiteId, user.id]
  )

  if (websites.length === 0) {
    return c.json({ error: 'Website not found or access denied' }, 404)
  }

  const products = await db.query(
    'SELECT * FROM products WHERE website_id = ? ORDER BY created_at DESC',
    [websiteId]
  )

  return c.json({ success: true, data: products })
})

// Create product
app.post('/', async (c) => {
  const user = c.get('user')
  const body = await c.req.json()
  const { website_id, name, description, price, compare_price, sku, images, videos, meta_title, meta_description, meta_keywords, track_inventory, inventory, low_stock_threshold, allow_backorder, has_variants, variants, weight, dimensions } = body

  if (!website_id || !name || !price) {
    return c.json({ error: 'Website ID, name, and price are required' }, 400)
  }

  const db = initDB(c.env)

  // Verify website ownership
  const websites = await db.query(
    'SELECT id FROM websites WHERE id = ? AND user_id = ?',
    [website_id, user.id]
  )

  if (websites.length === 0) {
    return c.json({ error: 'Website not found or access denied' }, 404)
  }

  const productId = crypto.randomUUID()
  const now = new Date().toISOString()

  await db.execute(
    'INSERT INTO products (id, website_id, name, description, price, compare_price, sku, images, videos, meta_title, meta_description, meta_keywords, track_inventory, inventory, low_stock_threshold, allow_backorder, has_variants, variants, weight, dimensions, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [productId, website_id, name, description, price, compare_price, sku, images, videos, meta_title, meta_description, meta_keywords, track_inventory || false, inventory || 0, low_stock_threshold || 5, allow_backorder || false, has_variants || false, variants, weight, dimensions, now, now]
  )

  return c.json({
    success: true,
    data: {
      id: productId,
      website_id,
      name,
      description,
      price,
      compare_price,
      sku,
      images,
      videos,
      meta_title,
      meta_description,
      meta_keywords,
      track_inventory: track_inventory || false,
      inventory: inventory || 0,
      low_stock_threshold: low_stock_threshold || 5,
      allow_backorder: allow_backorder || false,
      has_variants: has_variants || false,
      variants,
      weight,
      dimensions,
      created_at: now
    }
  })
})

// Update product
app.put('/:id', async (c) => {
  const user = c.get('user')
  const productId = c.req.param('id')
  const body = await c.req.json()

  const db = initDB(c.env)

  // Verify product ownership
  const products = await db.query(
    'SELECT p.*, w.user_id FROM products p JOIN websites w ON p.website_id = w.id WHERE p.id = ? AND w.user_id = ?',
    [productId, user.id]
  )

  if (products.length === 0) {
    return c.json({ error: 'Product not found or access denied' }, 404)
  }

  const { name, description, price, compare_price, sku, images, videos, meta_title, meta_description, meta_keywords, track_inventory, inventory, low_stock_threshold, allow_backorder, has_variants, variants, weight, dimensions } = body

  await db.execute(
    'UPDATE products SET name = ?, description = ?, price = ?, compare_price = ?, sku = ?, images = ?, videos = ?, meta_title = ?, meta_description = ?, meta_keywords = ?, track_inventory = ?, inventory = ?, low_stock_threshold = ?, allow_backorder = ?, has_variants = ?, variants = ?, weight = ?, dimensions = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, description, price, compare_price, sku, images, videos, meta_title, meta_description, meta_keywords, track_inventory, inventory, low_stock_threshold, allow_backorder, has_variants, variants, weight, dimensions, productId]
  )

  return c.json({ success: true, message: 'Product updated successfully' })
})

// Delete product
app.delete('/:id', async (c) => {
  const user = c.get('user')
  const productId = c.req.param('id')
  const db = initDB(c.env)

  // Verify product ownership
  const products = await db.query(
    'SELECT p.*, w.user_id FROM products p JOIN websites w ON p.website_id = w.id WHERE p.id = ? AND w.user_id = ?',
    [productId, user.id]
  )

  if (products.length === 0) {
    return c.json({ error: 'Product not found or access denied' }, 404)
  }

  await db.execute('DELETE FROM products WHERE id = ?', [productId])

  return c.json({ success: true, message: 'Product deleted successfully' })
})

export default app
