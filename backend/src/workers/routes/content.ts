import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from '../lib/db'
import { kv } from '../lib/kv'

const contentRoutes = new Hono()

// Validation schemas
const createSiteSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  subdomain: z.string().min(3).max(50).regex(/^[a-z0-9\-]+$/),
  customDomain: z.string().regex(/^[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}$/).optional(),
  businessType: z.enum(['INDIVIDUAL', 'BUSINESS', 'NONPROFIT', 'EDUCATION']).optional(),
  language: z.enum(['ENGLISH', 'URDU']).default('ENGLISH'),
  templateId: z.string().uuid().optional()
})

const updateSiteSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  subdomain: z.string().min(3).max(50).regex(/^[a-z0-9\-]+$/).optional(),
  customDomain: z.string().regex(/^[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}$/).optional(),
  businessType: z.enum(['INDIVIDUAL', 'BUSINESS', 'NONPROFIT', 'EDUCATION']).optional(),
  language: z.enum(['ENGLISH', 'URDU']).optional(),
  settings: z.record(z.any()).optional(),
  customCSS: z.string().max(10000).optional(),
  customJS: z.string().max(10000).optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  metaKeywords: z.string().max(500).optional()
})

const createPageSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9\-]+$/),
  content: z.record(z.any()).optional(),
  settings: z.record(z.any()).optional(),
  isHome: z.boolean().default(false),
  order: z.number().default(0),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  metaKeywords: z.string().max(500).optional(),
  language: z.enum(['ENGLISH', 'URDU']).default('ENGLISH'),
  dir: z.enum(['ltr', 'rtl']).default('ltr')
})

const updatePageSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9\-]+$/).optional(),
  content: z.record(z.any()).optional(),
  settings: z.record(z.any()).optional(),
  isHome: z.boolean().optional(),
  order: z.number().optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  metaKeywords: z.string().max(500).optional(),
  language: z.enum(['ENGLISH', 'URDU']).optional(),
  dir: z.enum(['ltr', 'rtl']).optional()
})

const patchPageSchema = z.object({
  operations: z.array(z.object({
    op: z.enum(['add', 'remove', 'replace', 'move', 'copy', 'test']),
    path: z.string(),
    value: z.any().optional(),
    from: z.string().optional()
  }))
})

type Bindings = {
  DB: D1Database
  CACHE_KV: KVNamespace
}

// Helper function to check site ownership
const checkSiteOwnership = async (c: any, siteId: string, userId: string) => {
  const site = await db.queryOne(c, 'SELECT id, userId FROM websites WHERE id = ?', [siteId])
  if (!site || site.userId !== userId) {
    return false
  }
  return true
}

// Helper function to invalidate site cache
const invalidateSiteCache = async (c: any, siteId: string) => {
  await kv.delete(c, `site:${siteId}`)
  await kv.delete(c, `site_pages:${siteId}`)
}

// GET /sites - Get user's sites
contentRoutes.get('/sites', async (c) => {
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

    const sites = await db.query(c, `
      SELECT id, name, description, status, subdomain, customDomain, 
             businessType, language, createdAt, updatedAt, publishedAt
      FROM websites 
      WHERE userId = ? 
      ORDER BY updatedAt DESC
    `, [userId])

    return c.json({
      success: true,
      data: sites
    })

  } catch (error: any) {
    console.error('Get sites error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to get sites',
        code: 'GET_SITES_ERROR'
      }
    }, 500)
  }
})

// POST /sites - Create new site
contentRoutes.post('/sites', zValidator('json', createSiteSchema), async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const siteData = c.req.valid('json')

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

    // Check if subdomain is available
    const existingSite = await db.queryOne(c, 'SELECT id FROM websites WHERE subdomain = ?', [siteData.subdomain])
    if (existingSite) {
      return c.json({
        success: false,
        error: {
          message: 'Subdomain is already taken',
          code: 'SUBDOMAIN_TAKEN'
        }
      }, 409)
    }

    // Create site
    const siteId = crypto.randomUUID()
    await db.execute(c, `
      INSERT INTO websites (id, name, description, subdomain, customDomain, businessType, 
                           language, userId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      siteId, siteData.name, siteData.description, siteData.subdomain, siteData.customDomain,
      siteData.businessType, siteData.language, userId, new Date().toISOString(), new Date().toISOString()
    ])

    // Create default home page
    const homePageId = crypto.randomUUID()
    await db.execute(c, `
      INSERT INTO pages (id, name, slug, content, settings, isHome, order, 
                        metaTitle, metaDescription, metaKeywords, language, dir, 
                        websiteId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      homePageId, 'Home', 'home', JSON.stringify({ components: [] }), JSON.stringify({}),
      true, 0, siteData.name, siteData.description, '', siteData.language, 
      siteData.language === 'URDU' ? 'rtl' : 'ltr', siteId, new Date().toISOString(), new Date().toISOString()
    ])

    // Get created site
    const site = await db.queryOne(c, `
      SELECT id, name, description, status, subdomain, customDomain, 
             businessType, language, createdAt, updatedAt, publishedAt
      FROM websites WHERE id = ?
    `, [siteId])

    return c.json({
      success: true,
      data: site
    })

  } catch (error: any) {
    console.error('Create site error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to create site',
        code: 'CREATE_SITE_ERROR'
      }
    }, 500)
  }
})

// GET /sites/:id - Get site by ID
contentRoutes.get('/sites/:id', async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const siteId = c.req.param('id')

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
    const hasAccess = await checkSiteOwnership(c, siteId, userId)
    if (!hasAccess) {
      return c.json({
        success: false,
        error: {
          message: 'Site not found or access denied',
          code: 'SITE_NOT_FOUND'
        }
      }, 404)
    }

    // Try to get from cache first
    const cached = await kv.get(c, `site:${siteId}`)
    if (cached) {
      return c.json(JSON.parse(cached))
    }

    const site = await db.queryOne(c, `
      SELECT id, name, description, status, content, settings, customCSS, customJS,
             subdomain, customDomain, businessType, language, metaTitle, metaDescription, 
             metaKeywords, createdAt, updatedAt, publishedAt
      FROM websites WHERE id = ?
    `, [siteId])

    if (!site) {
      return c.json({
        success: false,
        error: {
          message: 'Site not found',
          code: 'SITE_NOT_FOUND'
        }
      }, 404)
    }

    // Cache for 5 minutes
    await kv.set(c, `site:${siteId}`, JSON.stringify({
      success: true,
      data: site
    }), 300)

    return c.json({
      success: true,
      data: site
    })

  } catch (error: any) {
    console.error('Get site error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to get site',
        code: 'GET_SITE_ERROR'
      }
    }, 500)
  }
})

// PUT /sites/:id - Update site
contentRoutes.put('/sites/:id', zValidator('json', updateSiteSchema), async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const siteId = c.req.param('id')
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
    const hasAccess = await checkSiteOwnership(c, siteId, userId)
    if (!hasAccess) {
      return c.json({
        success: false,
        error: {
          message: 'Site not found or access denied',
          code: 'SITE_NOT_FOUND'
        }
      }, 404)
    }

    // Check subdomain availability if updating
    if (updateData.subdomain) {
      const existingSite = await db.queryOne(c, 'SELECT id FROM websites WHERE subdomain = ? AND id != ?', [updateData.subdomain, siteId])
      if (existingSite) {
        return c.json({
          success: false,
          error: {
            message: 'Subdomain is already taken',
            code: 'SUBDOMAIN_TAKEN'
          }
        }, 409)
      }
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
    values.push(new Date().toISOString(), siteId)

    await db.execute(c, `
      UPDATE websites 
      SET ${setClause}, updatedAt = ?
      WHERE id = ?
    `, values)

    // Invalidate cache
    await invalidateSiteCache(c, siteId)

    // Get updated site
    const site = await db.queryOne(c, `
      SELECT id, name, description, status, content, settings, customCSS, customJS,
             subdomain, customDomain, businessType, language, metaTitle, metaDescription, 
             metaKeywords, createdAt, updatedAt, publishedAt
      FROM websites WHERE id = ?
    `, [siteId])

    return c.json({
      success: true,
      data: site
    })

  } catch (error: any) {
    console.error('Update site error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to update site',
        code: 'UPDATE_SITE_ERROR'
      }
    }, 500)
  }
})

// DELETE /sites/:id - Delete site
contentRoutes.delete('/sites/:id', async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const siteId = c.req.param('id')

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
    const hasAccess = await checkSiteOwnership(c, siteId, userId)
    if (!hasAccess) {
      return c.json({
        success: false,
        error: {
          message: 'Site not found or access denied',
          code: 'SITE_NOT_FOUND'
        }
      }, 404)
    }

    // Delete site and related data
    await db.execute(c, 'DELETE FROM pages WHERE websiteId = ?', [siteId])
    await db.execute(c, 'DELETE FROM websites WHERE id = ?', [siteId])

    // Invalidate cache
    await invalidateSiteCache(c, siteId)

    return c.json({
      success: true,
      message: 'Site deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete site error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to delete site',
        code: 'DELETE_SITE_ERROR'
      }
    }, 500)
  }
})

// GET /sites/:id/pages - Get site pages
contentRoutes.get('/sites/:id/pages', async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const siteId = c.req.param('id')

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
    const hasAccess = await checkSiteOwnership(c, siteId, userId)
    if (!hasAccess) {
      return c.json({
        success: false,
        error: {
          message: 'Site not found or access denied',
          code: 'SITE_NOT_FOUND'
        }
      }, 404)
    }

    // Try to get from cache first
    const cached = await kv.get(c, `site_pages:${siteId}`)
    if (cached) {
      return c.json(JSON.parse(cached))
    }

    const pages = await db.query(c, `
      SELECT id, name, slug, content, settings, isHome, order, 
             metaTitle, metaDescription, metaKeywords, language, dir, 
             createdAt, updatedAt
      FROM pages 
      WHERE websiteId = ? 
      ORDER BY order ASC, createdAt ASC
    `, [siteId])

    // Cache for 5 minutes
    await kv.set(c, `site_pages:${siteId}`, JSON.stringify({
      success: true,
      data: pages
    }), 300)

    return c.json({
      success: true,
      data: pages
    })

  } catch (error: any) {
    console.error('Get pages error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to get pages',
        code: 'GET_PAGES_ERROR'
      }
    }, 500)
  }
})

// POST /sites/:id/pages - Create new page
contentRoutes.post('/sites/:id/pages', zValidator('json', createPageSchema), async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const siteId = c.req.param('id')
  const pageData = c.req.valid('json')

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
    const hasAccess = await checkSiteOwnership(c, siteId, userId)
    if (!hasAccess) {
      return c.json({
        success: false,
        error: {
          message: 'Site not found or access denied',
          code: 'SITE_NOT_FOUND'
        }
      }, 404)
    }

    // Check if slug is unique within site
    const existingPage = await db.queryOne(c, 'SELECT id FROM pages WHERE websiteId = ? AND slug = ?', [siteId, pageData.slug])
    if (existingPage) {
      return c.json({
        success: false,
        error: {
          message: 'Page slug must be unique within the site',
          code: 'SLUG_TAKEN'
        }
      }, 409)
    }

    // If this is set as home page, unset other home pages
    if (pageData.isHome) {
      await db.execute(c, 'UPDATE pages SET isHome = false WHERE websiteId = ?', [siteId])
    }

    // Create page
    const pageId = crypto.randomUUID()
    await db.execute(c, `
      INSERT INTO pages (id, name, slug, content, settings, isHome, order, 
                        metaTitle, metaDescription, metaKeywords, language, dir, 
                        websiteId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      pageId, pageData.name, pageData.slug, JSON.stringify(pageData.content || {}), 
      JSON.stringify(pageData.settings || {}), pageData.isHome, pageData.order,
      pageData.metaTitle, pageData.metaDescription, pageData.metaKeywords, 
      pageData.language, pageData.dir, siteId, new Date().toISOString(), new Date().toISOString()
    ])

    // Invalidate cache
    await invalidateSiteCache(c, siteId)

    // Get created page
    const page = await db.queryOne(c, `
      SELECT id, name, slug, content, settings, isHome, order, 
             metaTitle, metaDescription, metaKeywords, language, dir, 
             createdAt, updatedAt
      FROM pages WHERE id = ?
    `, [pageId])

    return c.json({
      success: true,
      data: page
    })

  } catch (error: any) {
    console.error('Create page error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to create page',
        code: 'CREATE_PAGE_ERROR'
      }
    }, 500)
  }
})

// GET /pages/:id - Get page by ID
contentRoutes.get('/pages/:id', async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const pageId = c.req.param('id')

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

    const page = await db.queryOne(c, `
      SELECT p.id, p.name, p.slug, p.content, p.settings, p.isHome, p.order, 
             p.metaTitle, p.metaDescription, p.metaKeywords, p.language, p.dir, 
             p.createdAt, p.updatedAt, w.userId
      FROM pages p
      JOIN websites w ON p.websiteId = w.id
      WHERE p.id = ? AND w.userId = ?
    `, [pageId, userId])

    if (!page) {
      return c.json({
        success: false,
        error: {
          message: 'Page not found',
          code: 'PAGE_NOT_FOUND'
        }
      }, 404)
    }

    return c.json({
      success: true,
      data: page
    })

  } catch (error: any) {
    console.error('Get page error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to get page',
        code: 'GET_PAGE_ERROR'
      }
    }, 500)
  }
})

// PUT /pages/:id - Update page
contentRoutes.put('/pages/:id', zValidator('json', updatePageSchema), async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const pageId = c.req.param('id')
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
    const page = await db.queryOne(c, `
      SELECT p.id, p.websiteId, w.userId
      FROM pages p
      JOIN websites w ON p.websiteId = w.id
      WHERE p.id = ? AND w.userId = ?
    `, [pageId, userId])

    if (!page) {
      return c.json({
        success: false,
        error: {
          message: 'Page not found',
          code: 'PAGE_NOT_FOUND'
        }
      }, 404)
    }

    // Check slug uniqueness if updating
    if (updateData.slug) {
      const existingPage = await db.queryOne(c, 'SELECT id FROM pages WHERE websiteId = ? AND slug = ? AND id != ?', [page.websiteId, updateData.slug, pageId])
      if (existingPage) {
        return c.json({
          success: false,
          error: {
            message: 'Page slug must be unique within the site',
            code: 'SLUG_TAKEN'
          }
        }, 409)
      }
    }

    // If setting as home page, unset other home pages
    if (updateData.isHome) {
      await db.execute(c, 'UPDATE pages SET isHome = false WHERE websiteId = ?', [page.websiteId])
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
    values.push(new Date().toISOString(), pageId)

    await db.execute(c, `
      UPDATE pages 
      SET ${setClause}, updatedAt = ?
      WHERE id = ?
    `, values)

    // Invalidate cache
    await invalidateSiteCache(c, page.websiteId)

    // Get updated page
    const updatedPage = await db.queryOne(c, `
      SELECT id, name, slug, content, settings, isHome, order, 
             metaTitle, metaDescription, metaKeywords, language, dir, 
             createdAt, updatedAt
      FROM pages WHERE id = ?
    `, [pageId])

    return c.json({
      success: true,
      data: updatedPage
    })

  } catch (error: any) {
    console.error('Update page error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to update page',
        code: 'UPDATE_PAGE_ERROR'
      }
    }, 500)
  }
})

// PATCH /pages/:id - Patch page with JSON Patch
contentRoutes.patch('/pages/:id', zValidator('json', patchPageSchema), async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const pageId = c.req.param('id')
  const { operations } = c.req.valid('json')

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
    const page = await db.queryOne(c, `
      SELECT p.id, p.content, p.websiteId, w.userId
      FROM pages p
      JOIN websites w ON p.websiteId = w.id
      WHERE p.id = ? AND w.userId = ?
    `, [pageId, userId])

    if (!page) {
      return c.json({
        success: false,
        error: {
          message: 'Page not found',
          code: 'PAGE_NOT_FOUND'
        }
      }, 404)
    }

    // Apply JSON Patch operations
    let currentContent = typeof page.content === 'string' ? JSON.parse(page.content) : page.content
    
    for (const operation of operations) {
      switch (operation.op) {
        case 'add':
          // Add value at path
          const addPath = operation.path.split('/').filter(p => p !== '')
          let addTarget = currentContent
          for (let i = 0; i < addPath.length - 1; i++) {
            if (!addTarget[addPath[i]]) {
              addTarget[addPath[i]] = {}
            }
            addTarget = addTarget[addPath[i]]
          }
          addTarget[addPath[addPath.length - 1]] = operation.value
          break
          
        case 'remove':
          // Remove value at path
          const removePath = operation.path.split('/').filter(p => p !== '')
          let removeTarget = currentContent
          for (let i = 0; i < removePath.length - 1; i++) {
            removeTarget = removeTarget[removePath[i]]
          }
          delete removeTarget[removePath[removePath.length - 1]]
          break
          
        case 'replace':
          // Replace value at path
          const replacePath = operation.path.split('/').filter(p => p !== '')
          let replaceTarget = currentContent
          for (let i = 0; i < replacePath.length - 1; i++) {
            replaceTarget = replaceTarget[replacePath[i]]
          }
          replaceTarget[replacePath[replacePath.length - 1]] = operation.value
          break
          
        case 'move':
          // Move value from one path to another
          const fromPath = operation.from!.split('/').filter(p => p !== '')
          const toPath = operation.path.split('/').filter(p => p !== '')
          
          let fromTarget = currentContent
          for (let i = 0; i < fromPath.length - 1; i++) {
            fromTarget = fromTarget[fromPath[i]]
          }
          const value = fromTarget[fromPath[fromPath.length - 1]]
          delete fromTarget[fromPath[fromPath.length - 1]]
          
          let toTarget = currentContent
          for (let i = 0; i < toPath.length - 1; i++) {
            if (!toTarget[toPath[i]]) {
              toTarget[toPath[i]] = {}
            }
            toTarget = toTarget[toPath[i]]
          }
          toTarget[toPath[toPath.length - 1]] = value
          break
          
        case 'copy':
          // Copy value from one path to another
          const copyFromPath = operation.from!.split('/').filter(p => p !== '')
          const copyToPath = operation.path.split('/').filter(p => p !== '')
          
          let copyFromTarget = currentContent
          for (let i = 0; i < copyFromPath.length - 1; i++) {
            copyFromTarget = copyFromTarget[copyFromPath[i]]
          }
          const copyValue = copyFromTarget[copyFromPath[copyFromPath.length - 1]]
          
          let copyToTarget = currentContent
          for (let i = 0; i < copyToPath.length - 1; i++) {
            if (!copyToTarget[copyToPath[i]]) {
              copyToTarget[copyToPath[i]] = {}
            }
            copyToTarget = copyToTarget[copyToPath[i]]
          }
          copyToTarget[copyToPath[copyToPath.length - 1]] = copyValue
          break
          
        case 'test':
          // Test value at path
          const testPath = operation.path.split('/').filter(p => p !== '')
          let testTarget = currentContent
          for (let i = 0; i < testPath.length; i++) {
            testTarget = testTarget[testPath[i]]
          }
          if (testTarget !== operation.value) {
            return c.json({
              success: false,
              error: {
                message: 'Test operation failed',
                code: 'TEST_FAILED'
              }
            }, 400)
          }
          break
      }
    }

    // Update page content
    await db.execute(c, `
      UPDATE pages 
      SET content = ?, updatedAt = ?
      WHERE id = ?
    `, [JSON.stringify(currentContent), new Date().toISOString(), pageId])

    // Invalidate cache
    await invalidateSiteCache(c, page.websiteId)

    return c.json({
      success: true,
      data: {
        id: pageId,
        content: currentContent,
        updatedAt: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('Patch page error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to patch page',
        code: 'PATCH_PAGE_ERROR'
      }
    }, 500)
  }
})

// DELETE /pages/:id - Delete page
contentRoutes.delete('/pages/:id', async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const pageId = c.req.param('id')

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
    const page = await db.queryOne(c, `
      SELECT p.id, p.websiteId, w.userId
      FROM pages p
      JOIN websites w ON p.websiteId = w.id
      WHERE p.id = ? AND w.userId = ?
    `, [pageId, userId])

    if (!page) {
      return c.json({
        success: false,
        error: {
          message: 'Page not found',
          code: 'PAGE_NOT_FOUND'
        }
      }, 404)
    }

    // Delete page
    await db.execute(c, 'DELETE FROM pages WHERE id = ?', [pageId])

    // Invalidate cache
    await invalidateSiteCache(c, page.websiteId)

    return c.json({
      success: true,
      message: 'Page deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete page error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to delete page',
        code: 'DELETE_PAGE_ERROR'
      }
    }, 500)
  }
})

export { contentRoutes }