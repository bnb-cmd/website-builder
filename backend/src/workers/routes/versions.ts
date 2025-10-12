import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { initDB, initKV, cacheKeys, cacheTTL } from '../lib'
import type { Env } from '../index'

const app = new Hono<{ Bindings: Env }>()

// Apply auth middleware to all routes
app.use('*', authMiddleware)

// Get page versions
app.get('/pages/:pageId', async (c) => {
  const user = c.get('user')
  const pageId = c.req.param('pageId')
  const db = initDB(c.env)

  // Verify page ownership
  const pages = await db.query(
    'SELECT p.*, w.user_id FROM pages p JOIN websites w ON p.website_id = w.id WHERE p.id = ? AND w.user_id = ?',
    [pageId, user.id]
  )

  if (pages.length === 0) {
    return c.json({ error: 'Page not found or access denied' }, 404)
  }

  const versions = await db.query(
    'SELECT * FROM page_versions WHERE page_id = ? ORDER BY version_number DESC',
    [pageId]
  )

  return c.json({ success: true, data: versions })
})

// Create new version
app.post('/pages/:pageId', async (c) => {
  const user = c.get('user')
  const pageId = c.req.param('pageId')
  const body = await c.req.json()
  const { content, changes } = body

  const db = initDB(c.env)
  const cache = initKV(c.env)

  // Verify page ownership
  const pages = await db.query(
    'SELECT p.*, w.user_id FROM pages p JOIN websites w ON p.website_id = w.id WHERE p.id = ? AND w.user_id = ?',
    [pageId, user.id]
  )

  if (pages.length === 0) {
    return c.json({ error: 'Page not found or access denied' }, 404)
  }

  // Get next version number
  const versions = await db.query(
    'SELECT MAX(version_number) as max_version FROM page_versions WHERE page_id = ?',
    [pageId]
  )

  const nextVersion = (versions[0]?.max_version || 0) + 1

  // Create new version
  const versionId = crypto.randomUUID()
  await db.execute(
    'INSERT INTO page_versions (id, page_id, version_number, content, changes, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [versionId, pageId, nextVersion, content, changes || '', user.id, new Date().toISOString()]
  )

  // Update page content
  await db.execute(
    'UPDATE pages SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [content, pageId]
  )

  // Invalidate cache
  await cache.delete(cacheKeys.page(pageId))

  return c.json({
    success: true,
    data: {
      id: versionId,
      versionNumber: nextVersion,
      content,
      changes,
      createdAt: new Date().toISOString()
    }
  })
})

// Restore version
app.post('/pages/:pageId/restore/:versionNumber', async (c) => {
  const user = c.get('user')
  const pageId = c.req.param('pageId')
  const versionNumber = parseInt(c.req.param('versionNumber'))
  const db = initDB(c.env)
  const cache = initKV(c.env)

  // Verify page ownership
  const pages = await db.query(
    'SELECT p.*, w.user_id FROM pages p JOIN websites w ON p.website_id = w.id WHERE p.id = ? AND w.user_id = ?',
    [pageId, user.id]
  )

  if (pages.length === 0) {
    return c.json({ error: 'Page not found or access denied' }, 404)
  }

  // Get version content
  const versions = await db.query(
    'SELECT content FROM page_versions WHERE page_id = ? AND version_number = ?',
    [pageId, versionNumber]
  )

  if (versions.length === 0) {
    return c.json({ error: 'Version not found' }, 404)
  }

  const versionContent = versions[0].content

  // Restore page content
  await db.execute(
    'UPDATE pages SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [versionContent, pageId]
  )

  // Create new version for the restore action
  const restoreVersionId = crypto.randomUUID()
  const nextVersion = (await db.query('SELECT MAX(version_number) as max_version FROM page_versions WHERE page_id = ?', [pageId]))[0]?.max_version + 1

  await db.execute(
    'INSERT INTO page_versions (id, page_id, version_number, content, changes, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [restoreVersionId, pageId, nextVersion, versionContent, `Restored from version ${versionNumber}`, user.id, new Date().toISOString()]
  )

  // Invalidate cache
  await cache.delete(cacheKeys.page(pageId))

  return c.json({
    success: true,
    message: `Page restored to version ${versionNumber}`,
    data: {
      content: versionContent,
      restoredFrom: versionNumber
    }
  })
})

// Get version diff
app.get('/pages/:pageId/diff/:version1/:version2', async (c) => {
  const user = c.get('user')
  const pageId = c.req.param('pageId')
  const version1 = parseInt(c.req.param('version1'))
  const version2 = parseInt(c.req.param('version2'))
  const db = initDB(c.env)

  // Verify page ownership
  const pages = await db.query(
    'SELECT p.*, w.user_id FROM pages p JOIN websites w ON p.website_id = w.id WHERE p.id = ? AND w.user_id = ?',
    [pageId, user.id]
  )

  if (pages.length === 0) {
    return c.json({ error: 'Page not found or access denied' }, 404)
  }

  // Get both versions
  const versions = await db.query(
    'SELECT version_number, content FROM page_versions WHERE page_id = ? AND version_number IN (?, ?) ORDER BY version_number',
    [pageId, version1, version2]
  )

  if (versions.length !== 2) {
    return c.json({ error: 'One or both versions not found' }, 404)
  }

  // Simple diff (in production, use a proper diff library)
  const content1 = versions[0].content
  const content2 = versions[1].content

  return c.json({
    success: true,
    data: {
      version1: {
        number: version1,
        content: content1
      },
      version2: {
        number: version2,
        content: content2
      },
      diff: content1 !== content2 ? 'Content differs' : 'No differences'
    }
  })
})

export default app
