import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from '../lib/db'
import { kv } from '../lib/kv'
import { v4 as uuidv4 } from 'uuid'
import { requireEcommerceFeature, requirePackage } from '../middleware/packageAccess'

const socialSyncRoutes = new Hono()

// Validation schemas
const importLinkSchema = z.object({
  websiteId: z.string().uuid(),
  url: z.string().url(),
  platform: z.enum(['instagram', 'tiktok', 'facebook', 'pinterest', 'any']).optional()
})

const syncProductsSchema = z.object({
  websiteId: z.string().uuid(),
  platform: z.enum(['instagram', 'tiktok', 'facebook', 'pinterest']).optional()
})

type Bindings = {
  DB: D1Database
  CACHE_KV: KVNamespace
  INSTAGRAM_APP_ID: string
  INSTAGRAM_APP_SECRET: string
  TIKTOK_APP_KEY: string
  TIKTOK_APP_SECRET: string
  FACEBOOK_APP_ID: string
  FACEBOOK_APP_SECRET: string
  PINTEREST_APP_ID: string
  PINTEREST_APP_SECRET: string
}

// Helper function to extract product data from URL
async function extractProductFromUrl(url: string, platform?: string): Promise<any> {
  try {
    // This would typically use a web scraping service or API
    // For now, we'll simulate the extraction
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PakistanWebsiteBuilder/1.0)'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`)
    }

    const html = await response.text()
    
    // Extract Open Graph meta tags
    const titleMatch = html.match(/<meta property="og:title" content="([^"]*)"[^>]*>/i)
    const descriptionMatch = html.match(/<meta property="og:description" content="([^"]*)"[^>]*>/i)
    const imageMatch = html.match(/<meta property="og:image" content="([^"]*)"[^>]*>/i)
    
    // Extract price from description or title
    const priceMatch = html.match(/Rs\.?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|PKR\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*PKR/i)
    
    let price = 0
    if (priceMatch) {
      const priceStr = priceMatch[1] || priceMatch[2] || priceMatch[3]
      price = parseFloat(priceStr.replace(/,/g, ''))
    }

    return {
      name: titleMatch?.[1] || 'Imported Product',
      description: descriptionMatch?.[1] || '',
      price: price || 0,
      imageUrl: imageMatch?.[1] || '',
      originalUrl: url,
      platform: platform || 'unknown'
    }
  } catch (error) {
    console.error('Error extracting product from URL:', error)
    throw new Error('Failed to extract product data from URL')
  }
}

// GET /social/auth/:platform - Initiate OAuth flow
socialSyncRoutes.get('/auth/:platform', requirePackage('PRO'), async (c) => {
  const { INSTAGRAM_APP_ID, INSTAGRAM_APP_SECRET, TIKTOK_APP_KEY, TIKTOK_APP_SECRET, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, PINTEREST_APP_ID, PINTEREST_APP_SECRET } = c.env as Bindings
  const platform = c.req.param('platform')
  const userId = c.get('user')?.userId
  const websiteId = c.req.query('websiteId')

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

    if (!websiteId) {
      return c.json({
        success: false,
        error: {
          message: 'Website ID is required',
          code: 'WEBSITE_ID_REQUIRED'
        }
      }, 400)
    }

    // Verify website ownership
    const website = await db.queryOne(c, 'SELECT id FROM websites WHERE id = ? AND user_id = ?', [websiteId, userId])
    
    if (!website) {
      return c.json({
        success: false,
        error: {
          message: 'Website not found or access denied',
          code: 'WEBSITE_NOT_FOUND'
        }
      }, 404)
    }

    const state = uuidv4()
    const redirectUri = `${c.req.url.split('/api')[0]}/api/v1/social/callback/${platform}`
    
    let authUrl = ''

    switch (platform) {
      case 'instagram':
        authUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_profile,user_media&response_type=code&state=${state}`
        break
      case 'tiktok':
        authUrl = `https://www.tiktok.com/auth/authorize/?client_key=${TIKTOK_APP_KEY}&scope=user.info.basic,user.info.profile&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`
        break
      case 'facebook':
        authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=pages_read_engagement,pages_manage_metadata&response_type=code&state=${state}`
        break
      case 'pinterest':
        authUrl = `https://www.pinterest.com/oauth/?client_id=${PINTEREST_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=boards:read,pins:read&response_type=code&state=${state}`
        break
      default:
        return c.json({
          success: false,
          error: {
            message: 'Unsupported platform',
            code: 'UNSUPPORTED_PLATFORM'
          }
        }, 400)
    }

    // Store state for verification
    await kv.set(c, `oauth_state:${state}`, JSON.stringify({ userId, websiteId, platform }), { expirationTtl: 600 })

    return c.json({
      success: true,
      data: {
        authUrl,
        state,
        platform
      }
    })

  } catch (error: any) {
    console.error('OAuth initiation error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to initiate OAuth',
        code: 'OAUTH_INITIATION_FAILED'
      }
    }, 500)
  }
})

// GET /social/callback/:platform - OAuth callback handler
socialSyncRoutes.get('/callback/:platform', async (c) => {
  const { INSTAGRAM_APP_ID, INSTAGRAM_APP_SECRET, TIKTOK_APP_KEY, TIKTOK_APP_SECRET, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, PINTEREST_APP_ID, PINTEREST_APP_SECRET } = c.env as Bindings
  const platform = c.req.param('platform')
  const code = c.req.query('code')
  const state = c.req.query('state')
  const error = c.req.query('error')

  try {
    if (error) {
      return c.json({
        success: false,
        error: {
          message: `OAuth error: ${error}`,
          code: 'OAUTH_ERROR'
        }
      }, 400)
    }

    if (!code || !state) {
      return c.json({
        success: false,
        error: {
          message: 'Missing authorization code or state',
          code: 'MISSING_PARAMETERS'
        }
      }, 400)
    }

    // Verify state
    const stateData = await kv.get(c, `oauth_state:${state}`)
    if (!stateData) {
      return c.json({
        success: false,
        error: {
          message: 'Invalid or expired state',
          code: 'INVALID_STATE'
        }
      }, 400)
    }

    const { userId, websiteId } = JSON.parse(stateData)
    await kv.delete(c, `oauth_state:${state}`)

    const redirectUri = `${c.req.url.split('/api')[0]}/api/v1/social/callback/${platform}`
    let accessToken = ''
    let refreshToken = ''
    let expiresAt = ''

    // Exchange code for access token
    switch (platform) {
      case 'instagram':
        const instagramResponse = await fetch('https://api.instagram.com/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            client_id: INSTAGRAM_APP_ID,
            client_secret: INSTAGRAM_APP_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
            code: code
          })
        })
        const instagramData = await instagramResponse.json()
        accessToken = instagramData.access_token
        expiresAt = new Date(Date.now() + (instagramData.expires_in * 1000)).toISOString()
        break

      case 'tiktok':
        const tiktokResponse = await fetch('https://open-api.tiktok.com/oauth/access_token/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            client_key: TIKTOK_APP_KEY,
            client_secret: TIKTOK_APP_SECRET,
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri
          })
        })
        const tiktokData = await tiktokResponse.json()
        accessToken = tiktokData.access_token
        refreshToken = tiktokData.refresh_token
        expiresAt = new Date(Date.now() + (tiktokData.expires_in * 1000)).toISOString()
        break

      case 'facebook':
        const facebookResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            client_id: FACEBOOK_APP_ID,
            client_secret: FACEBOOK_APP_SECRET,
            redirect_uri: redirectUri,
            code: code
          })
        })
        const facebookData = await facebookResponse.json()
        accessToken = facebookData.access_token
        expiresAt = new Date(Date.now() + (facebookData.expires_in * 1000)).toISOString()
        break

      case 'pinterest':
        const pinterestResponse = await fetch('https://api.pinterest.com/v5/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: PINTEREST_APP_ID,
            client_secret: PINTEREST_APP_SECRET,
            code: code,
            redirect_uri: redirectUri
          })
        })
        const pinterestData = await pinterestResponse.json()
        accessToken = pinterestData.access_token
        refreshToken = pinterestData.refresh_token
        expiresAt = new Date(Date.now() + (pinterestData.expires_in * 1000)).toISOString()
        break
    }

    if (!accessToken) {
      return c.json({
        success: false,
        error: {
          message: 'Failed to obtain access token',
          code: 'TOKEN_EXCHANGE_FAILED'
        }
      }, 400)
    }

    // Store OAuth tokens
    const linkId = uuidv4()
    const now = new Date().toISOString()

    await db.execute(c, `
      INSERT OR REPLACE INTO social_media_links 
      (id, website_id, platform, oauth_token, refresh_token, token_expires_at, 
       sync_enabled, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      linkId,
      websiteId,
      platform,
      accessToken,
      refreshToken || null,
      expiresAt,
      true,
      now,
      now
    ])

    // Invalidate cache
    await kv.delete(c, `website:${websiteId}:*`)

    return c.json({
      success: true,
      data: {
        platform,
        connected: true,
        expiresAt
      }
    })

  } catch (error: any) {
    console.error('OAuth callback error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to process OAuth callback',
        code: 'OAUTH_CALLBACK_FAILED'
      }
    }, 500)
  }
})

// POST /social/import-link - Import single product from social media link (STARTER tier)
socialSyncRoutes.post('/import-link', requireEcommerceFeature('orders'), zValidator('json', importLinkSchema), async (c) => {
  const { DB } = c.env as Bindings
  const { websiteId, url, platform } = c.req.valid('json')
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

    // Verify website ownership
    const website = await db.queryOne(c, 'SELECT id FROM websites WHERE id = ? AND user_id = ?', [websiteId, userId])
    
    if (!website) {
      return c.json({
        success: false,
        error: {
          message: 'Website not found or access denied',
          code: 'WEBSITE_NOT_FOUND'
        }
      }, 404)
    }

    // Extract product data from URL
    const productData = await extractProductFromUrl(url, platform)

    if (!productData.name || !productData.price) {
      return c.json({
        success: false,
        error: {
          message: 'Could not extract product information from URL',
          code: 'EXTRACTION_FAILED'
        }
      }, 400)
    }

    // Create product
    const productId = uuidv4()
    const now = new Date().toISOString()

    await db.execute(c, `
      INSERT INTO products (id, website_id, name, description, price, currency, 
                          images, social_platform, social_post_url, 
                          last_synced_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      productId,
      websiteId,
      productData.name,
      productData.description,
      productData.price,
      'PKR',
      JSON.stringify([productData.imageUrl]),
      productData.platform,
      url,
      now,
      now,
      now
    ])

    // Invalidate cache
    await kv.delete(c, `website:${websiteId}:*`)

    return c.json({
      success: true,
      data: {
        productId,
        name: productData.name,
        price: productData.price,
        currency: 'PKR',
        imageUrl: productData.imageUrl,
        platform: productData.platform,
        originalUrl: url
      }
    })

  } catch (error: any) {
    console.error('Import link error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to import product from link',
        code: 'IMPORT_LINK_FAILED'
      }
    }, 500)
  }
})

// POST /social/sync - Trigger manual product sync
socialSyncRoutes.post('/sync', requirePackage('PRO'), zValidator('json', syncProductsSchema), async (c) => {
  const { DB } = c.env as Bindings
  const { websiteId, platform } = c.req.valid('json')
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

    // Verify website ownership
    const website = await db.queryOne(c, 'SELECT id FROM websites WHERE id = ? AND user_id = ?', [websiteId, userId])
    
    if (!website) {
      return c.json({
        success: false,
        error: {
          message: 'Website not found or access denied',
          code: 'WEBSITE_NOT_FOUND'
        }
      }, 404)
    }

    // Get connected social media accounts
    let query = 'SELECT * FROM social_media_links WHERE website_id = ? AND sync_enabled = true'
    const params: any[] = [websiteId]

    if (platform) {
      query += ' AND platform = ?'
      params.push(platform)
    }

    const socialLinks = await db.query(c, query, params)

    if (socialLinks.length === 0) {
      return c.json({
        success: false,
        error: {
          message: 'No connected social media accounts found',
          code: 'NO_CONNECTED_ACCOUNTS'
        }
      }, 400)
    }

    const syncResults = []

    for (const link of socialLinks) {
      try {
        // This would implement platform-specific sync logic
        // For now, we'll simulate a sync
        const now = new Date().toISOString()
        
        await db.execute(c, `
          UPDATE social_media_links 
          SET last_sync_at = ?, updated_at = ?
          WHERE id = ?
        `, [now, now, link.id])

        syncResults.push({
          platform: link.platform,
          status: 'success',
          syncedAt: now
        })

      } catch (error) {
        console.error(`Sync error for ${link.platform}:`, error)
        syncResults.push({
          platform: link.platform,
          status: 'failed',
          error: error.message
        })
      }
    }

    // Invalidate cache
    await kv.delete(c, `website:${websiteId}:*`)

    return c.json({
      success: true,
      data: {
        results: syncResults,
        syncedAt: new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error('Sync error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to sync products',
        code: 'SYNC_FAILED'
      }
    }, 500)
  }
})

// GET /social/products - Fetch products from connected social account
socialSyncRoutes.get('/products', requireEcommerceFeature('orders'), async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const websiteId = c.req.query('websiteId')
  const platform = c.req.query('platform')

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

    if (!websiteId) {
      return c.json({
        success: false,
        error: {
          message: 'Website ID is required',
          code: 'WEBSITE_ID_REQUIRED'
        }
      }, 400)
    }

    // Verify website ownership
    const website = await db.queryOne(c, 'SELECT id FROM websites WHERE id = ? AND user_id = ?', [websiteId, userId])
    
    if (!website) {
      return c.json({
        success: false,
        error: {
          message: 'Website not found or access denied',
          code: 'WEBSITE_NOT_FOUND'
        }
      }, 404)
    }

    // Get products with social media data
    let query = `
      SELECT p.*, sml.platform as social_platform, sml.last_sync_at
      FROM products p
      LEFT JOIN social_media_links sml ON p.website_id = sml.website_id
      WHERE p.website_id = ?
    `
    const params: any[] = [websiteId]

    if (platform) {
      query += ' AND sml.platform = ?'
      params.push(platform)
    }

    query += ' ORDER BY p.created_at DESC'

    const products = await db.query(c, query, params)

    return c.json({
      success: true,
      data: products
    })

  } catch (error: any) {
    console.error('Get social products error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to retrieve social products',
        code: 'SOCIAL_PRODUCTS_FAILED'
      }
    }, 500)
  }
})

// DELETE /social/disconnect/:platform - Remove integration
socialSyncRoutes.delete('/disconnect/:platform', requireEcommerceFeature('orders'), async (c) => {
  const { DB } = c.env as Bindings
  const platform = c.req.param('platform')
  const userId = c.get('user')?.userId
  const websiteId = c.req.query('websiteId')

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

    if (!websiteId) {
      return c.json({
        success: false,
        error: {
          message: 'Website ID is required',
          code: 'WEBSITE_ID_REQUIRED'
        }
      }, 400)
    }

    // Verify website ownership
    const website = await db.queryOne(c, 'SELECT id FROM websites WHERE id = ? AND user_id = ?', [websiteId, userId])
    
    if (!website) {
      return c.json({
        success: false,
        error: {
          message: 'Website not found or access denied',
          code: 'WEBSITE_NOT_FOUND'
        }
      }, 404)
    }

    // Delete social media link
    await db.execute(c, `
      DELETE FROM social_media_links 
      WHERE website_id = ? AND platform = ?
    `, [websiteId, platform])

    // Invalidate cache
    await kv.delete(c, `website:${websiteId}:*`)

    return c.json({
      success: true,
      data: {
        platform,
        disconnected: true
      }
    })

  } catch (error: any) {
    console.error('Disconnect error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to disconnect social media account',
        code: 'DISCONNECT_FAILED'
      }
    }, 500)
  }
})

export default socialSyncRoutes
