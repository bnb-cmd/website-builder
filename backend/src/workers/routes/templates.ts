import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from '../lib/db'
import { kv } from '../lib/kv'

const templateRoutes = new Hono()

// Validation schemas
const createTemplateSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  category: z.enum(['BUSINESS', 'PORTFOLIO', 'BLOG', 'ECOMMERCE', 'LANDING', 'CORPORATE', 'CREATIVE']),
  content: z.record(z.any()),
  preview: z.string().url().optional(),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).optional()
})

const updateTemplateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  category: z.enum(['BUSINESS', 'PORTFOLIO', 'BLOG', 'ECOMMERCE', 'LANDING', 'CORPORATE', 'CREATIVE']).optional(),
  content: z.record(z.any()).optional(),
  preview: z.string().url().optional(),
  isPublic: z.boolean().optional(),
  tags: z.array(z.string()).optional()
})

type Bindings = {
  DB: D1Database
  CACHE_KV: KVNamespace
}

// GET /templates - Get public templates
templateRoutes.get('/templates', async (c) => {
  const { DB } = c.env as Bindings

  try {
    const category = c.req.query('category')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = parseInt(c.req.query('offset') || '0')
    const search = c.req.query('search')

    // Try to get from cache first
    const cacheKey = `templates:${category || 'all'}:${limit}:${offset}:${search || ''}`
    const cached = await kv.get(c, cacheKey)
    if (cached) {
      return c.json(JSON.parse(cached))
    }

    let query = `
      SELECT id, name, description, category, preview, isPublic, downloadCount, 
             createdAt, updatedAt, tags
      FROM templates 
      WHERE isPublic = true
    `
    const params: any[] = []

    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)'
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    query += ' ORDER BY downloadCount DESC, createdAt DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const templates = await db.query(c, query, params)

    // Cache for 30 minutes
    await kv.set(c, cacheKey, JSON.stringify({
      success: true,
      data: templates
    }), 1800)

    return c.json({
      success: true,
      data: templates
    })

  } catch (error: any) {
    console.error('Get templates error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to get templates',
        code: 'GET_TEMPLATES_ERROR'
      }
    }, 500)
  }
})

// GET /templates/:id - Get template by ID
templateRoutes.get('/templates/:id', async (c) => {
  const { DB } = c.env as Bindings
  const templateId = c.req.param('id')

  try {
    // Try to get from cache first
    const cached = await kv.get(c, `template:${templateId}`)
    if (cached) {
      return c.json(JSON.parse(cached))
    }

    const template = await db.queryOne(c, `
      SELECT id, name, description, category, content, preview, isPublic, 
             downloadCount, createdAt, updatedAt, tags
      FROM templates 
      WHERE id = ? AND isPublic = true
    `, [templateId])

    if (!template) {
      return c.json({
        success: false,
        error: {
          message: 'Template not found',
          code: 'TEMPLATE_NOT_FOUND'
        }
      }, 404)
    }

    // Cache for 1 hour
    await kv.set(c, `template:${templateId}`, JSON.stringify({
      success: true,
      data: template
    }), 3600)

    return c.json({
      success: true,
      data: template
    })

  } catch (error: any) {
    console.error('Get template error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to get template',
        code: 'GET_TEMPLATE_ERROR'
      }
    }, 500)
  }
})

// POST /templates/:id/download - Increment download count
templateRoutes.post('/templates/:id/download', async (c) => {
  const { DB } = c.env as Bindings
  const templateId = c.req.param('id')

  try {
    // Increment download count
    await db.execute(c, `
      UPDATE templates 
      SET downloadCount = downloadCount + 1, updatedAt = ?
      WHERE id = ?
    `, [new Date().toISOString(), templateId])

    // Invalidate cache
    await kv.delete(c, `template:${templateId}`)

    return c.json({
      success: true,
      message: 'Download count updated'
    })

  } catch (error: any) {
    console.error('Update download count error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to update download count',
        code: 'UPDATE_DOWNLOAD_COUNT_ERROR'
      }
    }, 500)
  }
})

// GET /user-templates - Get user's templates
templateRoutes.get('/user-templates', async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId

  try {
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    const templates = await db.query(c, `
      SELECT id, name, description, category, preview, isPublic, downloadCount, 
             createdAt, updatedAt, tags
      FROM user_templates 
      WHERE userId = ?
      ORDER BY updatedAt DESC
    `, [userId])

    return c.json({
      success: true,
      data: templates
    })

  } catch (error: any) {
    console.error('Get user templates error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to get user templates',
        code: 'GET_USER_TEMPLATES_ERROR'
      }
    }, 500)
  }
})

// POST /user-templates - Create user template
templateRoutes.post('/user-templates', zValidator('json', createTemplateSchema), async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const templateData = c.req.valid('json')

  try {
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    // Create template
    const templateId = crypto.randomUUID()
    await db.execute(c, `
      INSERT INTO user_templates (id, name, description, category, content, preview, 
                                 isPublic, userId, createdAt, updatedAt, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      templateId, templateData.name, templateData.description, templateData.category,
      JSON.stringify(templateData.content), templateData.preview, templateData.isPublic,
      userId, new Date().toISOString(), new Date().toISOString(),
      JSON.stringify(templateData.tags || [])
    ])

    // Get created template
    const template = await db.queryOne(c, `
      SELECT id, name, description, category, content, preview, isPublic, 
             downloadCount, createdAt, updatedAt, tags
      FROM user_templates WHERE id = ?
    `, [templateId])

    return c.json({
      success: true,
      data: template
    })

  } catch (error: any) {
    console.error('Create user template error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to create template',
        code: 'CREATE_TEMPLATE_ERROR'
      }
    }, 500)
  }
})

// GET /user-templates/:id - Get user template by ID
templateRoutes.get('/user-templates/:id', async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const templateId = c.req.param('id')

  try {
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    const template = await db.queryOne(c, `
      SELECT id, name, description, category, content, preview, isPublic, 
             downloadCount, createdAt, updatedAt, tags
      FROM user_templates 
      WHERE id = ? AND userId = ?
    `, [templateId, userId])

    if (!template) {
      return c.json({
        success: false,
        error: {
          message: 'Template not found',
          code: 'TEMPLATE_NOT_FOUND'
        }
      }, 404)
    }

    return c.json({
      success: true,
      data: template
    })

  } catch (error: any) {
    console.error('Get user template error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to get template',
        code: 'GET_TEMPLATE_ERROR'
      }
    }, 500)
  }
})

// PUT /user-templates/:id - Update user template
templateRoutes.put('/user-templates/:id', zValidator('json', updateTemplateSchema), async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const templateId = c.req.param('id')
  const updateData = c.req.valid('json')

  try {
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    // Check ownership
    const template = await db.queryOne(c, 'SELECT id FROM user_templates WHERE id = ? AND userId = ?', [templateId, userId])
    if (!template) {
      return c.json({
        success: false,
        error: {
          message: 'Template not found',
          code: 'TEMPLATE_NOT_FOUND'
        }
      }, 404)
    }

    // Build dynamic update query
    const fields = Object.keys(updateData).filter(key => updateData[key] !== undefined)
    if (fields.length === 0) {
      return c.json({
        success: false,
        error: {
          message: 'No fields to update',
          code: 'NO_FIELDS_TO_UPDATE'
        }
      }, 400)
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ')
    const values = fields.map(field => updateData[field])
    values.push(new Date().toISOString(), templateId)

    await db.execute(c, `
      UPDATE user_templates 
      SET ${setClause}, updatedAt = ?
      WHERE id = ?
    `, values)

    // Get updated template
    const updatedTemplate = await db.queryOne(c, `
      SELECT id, name, description, category, content, preview, isPublic, 
             downloadCount, createdAt, updatedAt, tags
      FROM user_templates WHERE id = ?
    `, [templateId])

    return c.json({
      success: true,
      data: updatedTemplate
    })

  } catch (error: any) {
    console.error('Update user template error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to update template',
        code: 'UPDATE_TEMPLATE_ERROR'
      }
    }, 500)
  }
})

// DELETE /user-templates/:id - Delete user template
templateRoutes.delete('/user-templates/:id', async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const templateId = c.req.param('id')

  try {
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    // Check ownership
    const template = await db.queryOne(c, 'SELECT id FROM user_templates WHERE id = ? AND userId = ?', [templateId, userId])
    if (!template) {
      return c.json({
        success: false,
        error: {
          message: 'Template not found',
          code: 'TEMPLATE_NOT_FOUND'
        }
      }, 404)
    }

    // Delete template
    await db.execute(c, 'DELETE FROM user_templates WHERE id = ?', [templateId])

    return c.json({
      success: true,
      message: 'Template deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete user template error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to delete template',
        code: 'DELETE_TEMPLATE_ERROR'
      }
    }, 500)
  }
})

// POST /user-templates/:id/publish - Publish user template to public
templateRoutes.post('/user-templates/:id/publish', async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const templateId = c.req.param('id')

  try {
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User not authenticated',
          code: 'NOT_AUTHENTICATED'
        }
      }, 401)
    }

    // Get user template
    const userTemplate = await db.queryOne(c, `
      SELECT id, name, description, category, content, preview, tags
      FROM user_templates 
      WHERE id = ? AND userId = ?
    `, [templateId, userId])

    if (!userTemplate) {
      return c.json({
        success: false,
        error: {
          message: 'Template not found',
          code: 'TEMPLATE_NOT_FOUND'
        }
      }, 404)
    }

    // Create public template
    const publicTemplateId = crypto.randomUUID()
    await db.execute(c, `
      INSERT INTO templates (id, name, description, category, content, preview, 
                            isPublic, downloadCount, createdAt, updatedAt, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      publicTemplateId, userTemplate.name, userTemplate.description, userTemplate.category,
      userTemplate.content, userTemplate.preview, true, 0,
      new Date().toISOString(), new Date().toISOString(),
      userTemplate.tags
    ])

    // Update user template to mark as published
    await db.execute(c, `
      UPDATE user_templates 
      SET isPublic = true, updatedAt = ?
      WHERE id = ?
    `, [new Date().toISOString(), templateId])

    return c.json({
      success: true,
      data: {
        id: publicTemplateId,
        message: 'Template published successfully'
      }
    })

  } catch (error: any) {
    console.error('Publish template error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to publish template',
        code: 'PUBLISH_TEMPLATE_ERROR'
      }
    }, 500)
  }
})

export { templateRoutes }