import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { initDB, initKV, cacheKeys, cacheTTL } from '../lib'
import type { Env } from '../index'

const app = new Hono<{ Bindings: Env }>()

// Apply auth middleware to all routes
app.use('*', authMiddleware)

// Get user templates
app.get('/', async (c) => {
  const user = c.get('user')
  const db = initDB(c.env)

  const templates = await db.query(
    'SELECT * FROM user_templates WHERE user_id = ? ORDER BY created_at DESC',
    [user.id]
  )

  return c.json({ success: true, data: templates })
})

// Get public templates
app.get('/public', async (c) => {
  const db = initDB(c.env)
  const cache = initKV(c.env)

  // Try cache first
  const cacheKey = 'user_templates:public'
  const cached = await cache.getJSON(cacheKey)
  if (cached) {
    return c.json({ success: true, data: cached })
  }

  const templates = await db.query(
    'SELECT id, name, description, content, thumbnail, category, created_at FROM user_templates WHERE is_public = TRUE ORDER BY created_at DESC'
  )

  // Cache the result
  await cache.setJSON(cacheKey, templates, cacheTTL.template)

  return c.json({ success: true, data: templates })
})

// Create user template
app.post('/', async (c) => {
  const user = c.get('user')
  const body = await c.req.json()
  const { name, description, content, thumbnail, category, isPublic } = body

  if (!name || !content) {
    return c.json({ error: 'Name and content are required' }, 400)
  }

  const db = initDB(c.env)
  const templateId = crypto.randomUUID()
  const now = new Date().toISOString()

  await db.execute(
    'INSERT INTO user_templates (id, user_id, name, description, content, thumbnail, category, is_public, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [templateId, user.id, name, description, content, thumbnail, category, isPublic || false, now, now]
  )

  return c.json({
    success: true,
    data: {
      id: templateId,
      name,
      description,
      content,
      thumbnail,
      category,
      isPublic: isPublic || false,
      createdAt: now
    }
  })
})

// Update user template
app.put('/:id', async (c) => {
  const user = c.get('user')
  const templateId = c.req.param('id')
  const body = await c.req.json()
  const { name, description, content, thumbnail, category, isPublic } = body

  const db = initDB(c.env)
  const cache = initKV(c.env)

  // Verify ownership
  const templates = await db.query(
    'SELECT id FROM user_templates WHERE id = ? AND user_id = ?',
    [templateId, user.id]
  )

  if (templates.length === 0) {
    return c.json({ error: 'Template not found or access denied' }, 404)
  }

  await db.execute(
    'UPDATE user_templates SET name = ?, description = ?, content = ?, thumbnail = ?, category = ?, is_public = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, description, content, thumbnail, category, isPublic, templateId]
  )

  // Invalidate cache
  await cache.delete('user_templates:public')

  return c.json({ success: true, message: 'Template updated successfully' })
})

// Delete user template
app.delete('/:id', async (c) => {
  const user = c.get('user')
  const templateId = c.req.param('id')
  const db = initDB(c.env)
  const cache = initKV(c.env)

  // Verify ownership
  const templates = await db.query(
    'SELECT id FROM user_templates WHERE id = ? AND user_id = ?',
    [templateId, user.id]
  )

  if (templates.length === 0) {
    return c.json({ error: 'Template not found or access denied' }, 404)
  }

  await db.execute('DELETE FROM user_templates WHERE id = ?', [templateId])

  // Invalidate cache
  await cache.delete('user_templates:public')

  return c.json({ success: true, message: 'Template deleted successfully' })
})

// Get template by ID
app.get('/:id', async (c) => {
  const templateId = c.req.param('id')
  const user = c.get('user')
  const db = initDB(c.env)

  // Get template (either user's own or public)
  const templates = await db.query(
    'SELECT * FROM user_templates WHERE id = ? AND (user_id = ? OR is_public = TRUE)',
    [templateId, user.id]
  )

  if (templates.length === 0) {
    return c.json({ error: 'Template not found or access denied' }, 404)
  }

  return c.json({ success: true, data: templates[0] })
})

export default app
