import { Hono } from 'hono'
import { db } from '../lib/db'
import { kv } from '../lib/kv'

const performanceRoutes = new Hono()

// Cache configuration
const CACHE_CONFIG = {
  userSites: {
    ttl: 5 * 60, // 5 minutes
    keyPrefix: 'user_sites:'
  },
  templates: {
    ttl: 30 * 60, // 30 minutes
    keyPrefix: 'templates:'
  },
  media: {
    ttl: 60 * 60, // 1 hour
    keyPrefix: 'media:'
  },
  sitemaps: {
    ttl: 24 * 60 * 60, // 24 hours
    keyPrefix: 'sitemaps:'
  }
}

// Prepared statements cache
const preparedStatements = new Map<string, any>()

// Get prepared statement
const getPreparedStatement = (c: any, query: string) => {
  if (!preparedStatements.has(query)) {
    preparedStatements.set(query, c.env.DB.prepare(query))
  }
  return preparedStatements.get(query)
}

// Cache middleware
const cacheMiddleware = (config: { ttl: number; keyPrefix: string }) => {
  return async (c: any, next: any) => {
    const cacheKey = `${config.keyPrefix}${c.req.url}`
    
    // Try to get from cache
    const cached = await kv.get(c, cacheKey)
    if (cached) {
      return c.json(JSON.parse(cached))
    }
    
    // Execute request
    await next()
    
    // Cache response
    const response = await c.res.clone().text()
    await kv.set(c, cacheKey, response, config.ttl)
  }
}

// Database query optimization
const optimizedQuery = async (c: any, query: string, params: any[] = []) => {
  const stmt = getPreparedStatement(c, query)
  return stmt.bind(...params).all()
}

// GET /performance/user-sites - Get user sites with caching
performanceRoutes.get('/user-sites', cacheMiddleware(CACHE_CONFIG.userSites), async (c) => {
  try {
    const userId = c.get('user')?.id
    
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User ID required',
          code: 'USER_ID_REQUIRED'
        }
      }, 400)
    }
    
    // Use optimized query with prepared statement
    const sites = await optimizedQuery(c, `
      SELECT id, name, description, status, subdomain, customDomain, 
             businessType, language, createdAt, updatedAt, publishedAt
      FROM websites 
      WHERE userId = ? 
      ORDER BY updatedAt DESC 
      LIMIT 50
    `, [userId])
    
    return c.json({
      success: true,
      data: sites
    })
    
  } catch (error) {
    console.error('Get user sites error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to get user sites',
        code: 'GET_SITES_ERROR'
      }
    }, 500)
  }
})

// GET /performance/templates - Get templates with caching
performanceRoutes.get('/templates', cacheMiddleware(CACHE_CONFIG.templates), async (c) => {
  try {
    const category = c.req.query('category')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = parseInt(c.req.query('offset') || '0')
    
    let query = `
      SELECT id, name, description, category, preview, isPublic, 
             createdAt, updatedAt, downloadCount
      FROM templates 
      WHERE isPublic = true
    `
    const params: any[] = []
    
    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }
    
    query += ' ORDER BY downloadCount DESC, createdAt DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)
    
    const templates = await optimizedQuery(c, query, params)
    
    return c.json({
      success: true,
      data: templates
    })
    
  } catch (error) {
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

// GET /performance/media - Get user media with caching
performanceRoutes.get('/media', cacheMiddleware(CACHE_CONFIG.media), async (c) => {
  try {
    const userId = c.get('user')?.id
    const category = c.req.query('category')
    const limit = parseInt(c.req.query('limit') || '50')
    const offset = parseInt(c.req.query('offset') || '0')
    
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User ID required',
          code: 'USER_ID_REQUIRED'
        }
      }, 400)
    }
    
    let query = `
      SELECT id, fileName, fileType, fileSize, category, url, 
             createdAt, updatedAt
      FROM media 
      WHERE userId = ?
    `
    const params: any[] = [userId]
    
    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }
    
    query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)
    
    const media = await optimizedQuery(c, query, params)
    
    return c.json({
      success: true,
      data: media
    })
    
  } catch (error) {
    console.error('Get media error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to get media',
        code: 'GET_MEDIA_ERROR'
      }
    }, 500)
  }
})

// GET /performance/sitemaps - Get sitemap with caching
performanceRoutes.get('/sitemaps/:siteId', cacheMiddleware(CACHE_CONFIG.sitemaps), async (c) => {
  try {
    const siteId = c.req.param('siteId')
    
    if (!siteId) {
      return c.json({
        success: false,
        error: {
          message: 'Site ID required',
          code: 'SITE_ID_REQUIRED'
        }
      }, 400)
    }
    
    const sitemap = await optimizedQuery(c, `
      SELECT id, siteId, sitemapUrl, robotsUrl, jsonLDUrl, 
             pagesCount, lastGenerated, createdAt, updatedAt
      FROM sitemaps 
      WHERE siteId = ?
    `, [siteId])
    
    if (sitemap.length === 0) {
      return c.json({
        success: false,
        error: {
          message: 'Sitemap not found',
          code: 'SITEMAP_NOT_FOUND'
        }
      }, 404)
    }
    
    return c.json({
      success: true,
      data: sitemap[0]
    })
    
  } catch (error) {
    console.error('Get sitemap error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to get sitemap',
        code: 'GET_SITEMAP_ERROR'
      }
    }, 500)
  }
})

// POST /performance/bulk-operations - Bulk operations for better performance
performanceRoutes.post('/bulk-operations', async (c) => {
  try {
    const body = await c.req.json()
    const { operations } = body
    
    if (!Array.isArray(operations) || operations.length === 0) {
      return c.json({
        success: false,
        error: {
          message: 'Operations array required',
          code: 'OPERATIONS_REQUIRED'
        }
      }, 400)
    }
    
    const results = []
    
    for (const operation of operations) {
      try {
        switch (operation.type) {
          case 'update_component':
            await optimizedQuery(c, `
              UPDATE components 
              SET props = ?, layout = ?, styles = ?, updatedAt = ?
              WHERE id = ? AND siteId = ?
            `, [
              JSON.stringify(operation.props),
              JSON.stringify(operation.layout),
              JSON.stringify(operation.styles),
              new Date().toISOString(),
              operation.componentId,
              operation.siteId
            ])
            results.push({ id: operation.id, success: true })
            break
            
          case 'update_page':
            await optimizedQuery(c, `
              UPDATE pages 
              SET content = ?, settings = ?, updatedAt = ?
              WHERE id = ? AND siteId = ?
            `, [
              JSON.stringify(operation.content),
              JSON.stringify(operation.settings),
              new Date().toISOString(),
              operation.pageId,
              operation.siteId
            ])
            results.push({ id: operation.id, success: true })
            break
            
          case 'update_site':
            await optimizedQuery(c, `
              UPDATE websites 
              SET settings = ?, customCSS = ?, customJS = ?, updatedAt = ?
              WHERE id = ? AND userId = ?
            `, [
              JSON.stringify(operation.settings),
              operation.customCSS,
              operation.customJS,
              new Date().toISOString(),
              operation.siteId,
              operation.userId
            ])
            results.push({ id: operation.id, success: true })
            break
            
          default:
            results.push({ 
              id: operation.id, 
              success: false, 
              error: 'Unknown operation type' 
            })
        }
      } catch (error) {
        results.push({ 
          id: operation.id, 
          success: false, 
          error: error.message 
        })
      }
    }
    
    return c.json({
      success: true,
      data: results
    })
    
  } catch (error) {
    console.error('Bulk operations error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to execute bulk operations',
        code: 'BULK_OPERATIONS_ERROR'
      }
    }, 500)
  }
})

// GET /performance/analytics - Get performance analytics
performanceRoutes.get('/analytics', async (c) => {
  try {
    const userId = c.get('user')?.id
    
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User ID required',
          code: 'USER_ID_REQUIRED'
        }
      }, 400)
    }
    
    // Get user statistics
    const stats = await optimizedQuery(c, `
      SELECT 
        COUNT(DISTINCT w.id) as totalSites,
        COUNT(DISTINCT p.id) as totalPages,
        COUNT(DISTINCT m.id) as totalMedia,
        COUNT(DISTINCT ut.id) as totalTemplates,
        SUM(CASE WHEN w.status = 'PUBLISHED' THEN 1 ELSE 0 END) as publishedSites,
        AVG(CASE WHEN w.status = 'PUBLISHED' THEN 1 ELSE 0 END) as publishRate
      FROM websites w
      LEFT JOIN pages p ON w.id = p.siteId
      LEFT JOIN media m ON w.userId = m.userId
      LEFT JOIN user_templates ut ON w.userId = ut.userId
      WHERE w.userId = ?
    `, [userId])
    
    // Get recent activity
    const recentActivity = await optimizedQuery(c, `
      SELECT 'site' as type, id, name, updatedAt
      FROM websites 
      WHERE userId = ?
      UNION ALL
      SELECT 'page' as type, id, name, updatedAt
      FROM pages 
      WHERE siteId IN (SELECT id FROM websites WHERE userId = ?)
      ORDER BY updatedAt DESC
      LIMIT 10
    `, [userId, userId])
    
    return c.json({
      success: true,
      data: {
        stats: stats[0],
        recentActivity
      }
    })
    
  } catch (error) {
    console.error('Get analytics error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to get analytics',
        code: 'GET_ANALYTICS_ERROR'
      }
    }, 500)
  }
})

// POST /performance/optimize - Optimize user data
performanceRoutes.post('/optimize', async (c) => {
  try {
    const userId = c.get('user')?.id
    
    if (!userId) {
      return c.json({
        success: false,
        error: {
          message: 'User ID required',
          code: 'USER_ID_REQUIRED'
        }
      }, 400)
    }
    
    // Clean up old versions
    await optimizedQuery(c, `
      DELETE FROM versions 
      WHERE siteId IN (
        SELECT id FROM websites WHERE userId = ?
      ) AND createdAt < datetime('now', '-30 days')
    `, [userId])
    
    // Clean up old media
    await optimizedQuery(c, `
      DELETE FROM media 
      WHERE userId = ? AND createdAt < datetime('now', '-90 days')
    `, [userId])
    
    // Clean up old publish jobs
    await optimizedQuery(c, `
      DELETE FROM publish_jobs 
      WHERE siteId IN (
        SELECT id FROM websites WHERE userId = ?
      ) AND createdAt < datetime('now', '-7 days')
    `, [userId])
    
    // Update statistics
    const stats = await optimizedQuery(c, `
      SELECT 
        COUNT(DISTINCT w.id) as totalSites,
        COUNT(DISTINCT p.id) as totalPages,
        COUNT(DISTINCT m.id) as totalMedia
      FROM websites w
      LEFT JOIN pages p ON w.id = p.siteId
      LEFT JOIN media m ON w.userId = m.userId
      WHERE w.userId = ?
    `, [userId])
    
    return c.json({
      success: true,
      data: {
        message: 'Data optimized successfully',
        stats: stats[0]
      }
    })
    
  } catch (error) {
    console.error('Optimize error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to optimize data',
        code: 'OPTIMIZE_ERROR'
      }
    }, 500)
  }
})

// GET /performance/health - Health check with performance metrics
performanceRoutes.get('/health', async (c) => {
  try {
    const startTime = Date.now()
    
    // Test database connection
    const dbStart = Date.now()
    await optimizedQuery(c, 'SELECT 1')
    const dbTime = Date.now() - dbStart
    
    // Test KV connection
    const kvStart = Date.now()
    await kv.set(c, 'health_check', 'ok', 60)
    await kv.get(c, 'health_check')
    const kvTime = Date.now() - kvStart
    
    const totalTime = Date.now() - startTime
    
    return c.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        performance: {
          totalTime,
          databaseTime: dbTime,
          kvTime: kvTime
        },
        cache: {
          preparedStatements: preparedStatements.size,
          cacheConfig: CACHE_CONFIG
        }
      }
    })
    
  } catch (error) {
    console.error('Health check error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Health check failed',
        code: 'HEALTH_CHECK_ERROR'
      }
    }, 500)
  }
})

export { performanceRoutes }
