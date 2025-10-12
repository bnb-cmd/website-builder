import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { db } from '../lib/db'
import { kv } from '../lib/kv'

const mediaRoutes = new Hono()

// Validation schemas
const uploadSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileType: z.string().regex(/^(image|video|audio|application)\/[a-zA-Z0-9\-\.]+$/),
  fileSize: z.number().min(1).max(50 * 1024 * 1024), // 50MB max
  category: z.enum(['image', 'video', 'audio', 'document']).optional(),
  altText: z.string().max(500).optional()
})

const updateMediaSchema = z.object({
  fileName: z.string().min(1).max(255).optional(),
  altText: z.string().max(500).optional(),
  category: z.enum(['image', 'video', 'audio', 'document']).optional()
})

type Bindings = {
  DB: D1Database
  CACHE_KV: KVNamespace
  ASSETS_BUCKET: R2Bucket
  CLOUDFLARE_ACCOUNT_ID: string
  CLOUDFLARE_API_TOKEN: string
}

// Helper function to generate presigned URL for R2
const generatePresignedUrl = async (bucket: R2Bucket, key: string, expiresIn: number = 3600) => {
  // In a real implementation, this would use the R2 API to generate presigned URLs
  // For now, we'll return a placeholder URL
  return `https://assets.example.com/${key}?expires=${Date.now() + expiresIn * 1000}`
}

// Helper function to generate Cloudflare Images URL
const generateImageUrl = (imageId: string, variant: string = 'public') => {
  return `https://imagedelivery.net/${process.env.CLOUDFLARE_IMAGES_HASH}/${imageId}/${variant}`
}

// Helper function to generate srcset for responsive images
const generateSrcset = (imageId: string) => {
  const variants = ['w=400', 'w=800', 'w=1200', 'w=1600']
  return variants.map(variant => 
    `${generateImageUrl(imageId, variant)} ${variant.split('=')[1]}w`
  ).join(', ')
}

// POST /upload - Generate presigned URL for upload
mediaRoutes.post('/upload', zValidator('json', uploadSchema), async (c) => {
  const { ASSETS_BUCKET } = c.env as Bindings
  const userId = c.get('user')?.userId
  const uploadData = c.req.valid('json')

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

    // Generate unique file key
    const fileExtension = uploadData.fileName.split('.').pop()
    const fileKey = `users/${userId}/media/${crypto.randomUUID()}.${fileExtension}`

    // Generate presigned URL for upload
    const presignedUrl = await generatePresignedUrl(ASSETS_BUCKET, fileKey, 3600)

    // Store upload metadata in KV temporarily
    await kv.setJSON(c, `upload:${fileKey}`, {
      userId,
      fileName: uploadData.fileName,
      fileType: uploadData.fileType,
      fileSize: uploadData.fileSize,
      category: uploadData.category,
      altText: uploadData.altText,
      createdAt: new Date().toISOString()
    }, 3600) // 1 hour TTL

    return c.json({
      success: true,
      data: {
        uploadUrl: presignedUrl,
        fileKey,
        expiresIn: 3600
      }
    })

  } catch (error: any) {
    console.error('Upload URL generation error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to generate upload URL',
        code: 'UPLOAD_URL_ERROR'
      }
    }, 500)
  }
})

// POST /confirm - Confirm upload and save to database
mediaRoutes.post('/confirm', async (c) => {
  const { DB, ASSETS_BUCKET } = c.env as Bindings
  const userId = c.get('user')?.userId
  const { fileKey } = await c.req.json()

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

    if (!fileKey) {
      return c.json({
        success: false,
        error: {
          message: 'File key is required',
          code: 'FILE_KEY_REQUIRED'
        }
      }, 400)
    }

    // Get upload metadata from KV
    const uploadData = await kv.getJSON(c, `upload:${fileKey}`)
    if (!uploadData) {
      return c.json({
        success: false,
        error: {
          message: 'Upload session not found or expired',
          code: 'UPLOAD_SESSION_NOT_FOUND'
        }
      }, 404)
    }

    // Verify file exists in R2
    const fileObject = await ASSETS_BUCKET.head(fileKey)
    if (!fileObject) {
      return c.json({
        success: false,
        error: {
          message: 'File not found in storage',
          code: 'FILE_NOT_FOUND'
        }
      }, 404)
    }

    // Generate public URL
    const publicUrl = `https://assets.example.com/${fileKey}`

    // Save to database
    const mediaId = crypto.randomUUID()
    await db.execute(c, `
      INSERT INTO media (id, fileName, fileType, fileSize, category, url, altText, userId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      mediaId, uploadData.fileName, uploadData.fileType, uploadData.fileSize,
      uploadData.category, publicUrl, uploadData.altText, userId,
      new Date().toISOString(), new Date().toISOString()
    ])

    // Clean up upload session
    await kv.delete(c, `upload:${fileKey}`)

    // Get created media record
    const media = await db.queryOne(c, `
      SELECT id, fileName, fileType, fileSize, category, url, altText, createdAt, updatedAt
      FROM media WHERE id = ?
    `, [mediaId])

    return c.json({
      success: true,
      data: media
    })

  } catch (error: any) {
    console.error('Upload confirmation error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to confirm upload',
        code: 'UPLOAD_CONFIRM_ERROR'
      }
    }, 500)
  }
})

// GET /media - Get user's media
mediaRoutes.get('/media', async (c) => {
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

    const category = c.req.query('category')
    const limit = parseInt(c.req.query('limit') || '50')
    const offset = parseInt(c.req.query('offset') || '0')

    let query = `
      SELECT id, fileName, fileType, fileSize, category, url, altText, createdAt, updatedAt
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

    const media = await db.query(c, query, params)

    return c.json({
      success: true,
      data: media
    })

  } catch (error: any) {
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

// GET /media/:id - Get media by ID
mediaRoutes.get('/media/:id', async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const mediaId = c.req.param('id')

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

    const media = await db.queryOne(c, `
      SELECT id, fileName, fileType, fileSize, category, url, altText, createdAt, updatedAt
      FROM media 
      WHERE id = ? AND userId = ?
    `, [mediaId, userId])

    if (!media) {
      return c.json({
        success: false,
        error: {
          message: 'Media not found',
          code: 'MEDIA_NOT_FOUND'
        }
      }, 404)
    }

    return c.json({
      success: true,
      data: media
    })

  } catch (error: any) {
    console.error('Get media by ID error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to get media',
        code: 'GET_MEDIA_ERROR'
      }
    }, 500)
  }
})

// PUT /media/:id - Update media
mediaRoutes.put('/media/:id', zValidator('json', updateMediaSchema), async (c) => {
  const { DB } = c.env as Bindings
  const userId = c.get('user')?.userId
  const mediaId = c.req.param('id')
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
    const media = await db.queryOne(c, 'SELECT id FROM media WHERE id = ? AND userId = ?', [mediaId, userId])
    if (!media) {
      return c.json({
        success: false,
        error: {
          message: 'Media not found',
          code: 'MEDIA_NOT_FOUND'
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
    values.push(new Date().toISOString(), mediaId)

    await db.execute(c, `
      UPDATE media 
      SET ${setClause}, updatedAt = ?
      WHERE id = ?
    `, values)

    // Get updated media
    const updatedMedia = await db.queryOne(c, `
      SELECT id, fileName, fileType, fileSize, category, url, altText, createdAt, updatedAt
      FROM media WHERE id = ?
    `, [mediaId])

    return c.json({
      success: true,
      data: updatedMedia
    })

  } catch (error: any) {
    console.error('Update media error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to update media',
        code: 'UPDATE_MEDIA_ERROR'
      }
    }, 500)
  }
})

// DELETE /media/:id - Delete media
mediaRoutes.delete('/media/:id', async (c) => {
  const { DB, ASSETS_BUCKET } = c.env as Bindings
  const userId = c.get('user')?.userId
  const mediaId = c.req.param('id')

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

    // Get media record
    const media = await db.queryOne(c, 'SELECT id, url FROM media WHERE id = ? AND userId = ?', [mediaId, userId])
    if (!media) {
      return c.json({
        success: false,
        error: {
          message: 'Media not found',
          code: 'MEDIA_NOT_FOUND'
        }
      }, 404)
    }

    // Extract file key from URL
    const fileKey = media.url.split('/').slice(-2).join('/') // Extract path after domain

    // Delete from R2
    await ASSETS_BUCKET.delete(fileKey)

    // Delete from database
    await db.execute(c, 'DELETE FROM media WHERE id = ?', [mediaId])

    return c.json({
      success: true,
      message: 'Media deleted successfully'
    })

  } catch (error: any) {
    console.error('Delete media error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to delete media',
        code: 'DELETE_MEDIA_ERROR'
      }
    }, 500)
  }
})

// POST /images/upload - Upload image to Cloudflare Images
mediaRoutes.post('/images/upload', async (c) => {
  const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN } = c.env as Bindings
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

    const formData = await c.req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return c.json({
        success: false,
        error: {
          message: 'No file provided',
          code: 'NO_FILE_PROVIDED'
        }
      }, 400)
    }

    // Upload to Cloudflare Images
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`
      },
      body: uploadFormData
    })

    if (!response.ok) {
      throw new Error(`Cloudflare Images API error: ${response.statusText}`)
    }

    const result = await response.json()
    const imageId = result.result.id

    // Generate URLs
    const imageUrl = generateImageUrl(imageId)
    const srcset = generateSrcset(imageId)

    // Save to database
    const mediaId = crypto.randomUUID()
    await db.execute(c, `
      INSERT INTO media (id, fileName, fileType, fileSize, category, url, altText, userId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      mediaId, file.name, file.type, file.size, 'image', imageUrl, '', userId,
      new Date().toISOString(), new Date().toISOString()
    ])

    return c.json({
      success: true,
      data: {
        id: mediaId,
        imageId,
        url: imageUrl,
        srcset,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      }
    })

  } catch (error: any) {
    console.error('Image upload error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to upload image',
        code: 'IMAGE_UPLOAD_ERROR'
      }
    }, 500)
  }
})

// GET /images/:id/variants - Get image variants
mediaRoutes.get('/images/:id/variants', async (c) => {
  const { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN } = c.env as Bindings
  const imageId = c.req.param('id')

  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`, {
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`
      }
    })

    if (!response.ok) {
      return c.json({
        success: false,
        error: {
          message: 'Image not found',
          code: 'IMAGE_NOT_FOUND'
        }
      }, 404)
    }

    const result = await response.json()
    const image = result.result

    // Generate variant URLs
    const variants = {
      original: generateImageUrl(imageId, 'public'),
      thumbnail: generateImageUrl(imageId, 'thumbnail'),
      small: generateImageUrl(imageId, 'w=400'),
      medium: generateImageUrl(imageId, 'w=800'),
      large: generateImageUrl(imageId, 'w=1200'),
      xlarge: generateImageUrl(imageId, 'w=1600'),
      srcset: generateSrcset(imageId)
    }

    return c.json({
      success: true,
      data: {
        id: imageId,
        variants,
        metadata: {
          filename: image.filename,
          uploaded: image.uploaded,
          size: image.size,
          width: image.width,
          height: image.height
        }
      }
    })

  } catch (error: any) {
    console.error('Get image variants error:', error)
    return c.json({
      success: false,
      error: {
        message: 'Failed to get image variants',
        code: 'GET_VARIANTS_ERROR'
      }
    }, 500)
  }
})

export { mediaRoutes }