import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '../lib/db'
import { kv } from '../lib/kv'
import { r2 } from '../lib/r2'

const sitemapRoutes = new Hono()

// Sitemap generation schema
const SitemapRequestSchema = z.object({
  siteId: z.string(),
  pages: z.array(z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    isHome: z.boolean().default(false),
    order: z.number().default(0),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.string().optional(),
    language: z.enum(['ENGLISH', 'URDU']).default('ENGLISH'),
    direction: z.enum(['ltr', 'rtl']).default('ltr'),
    updatedAt: z.string()
  })),
  settings: z.object({
    siteName: z.string(),
    description: z.string().optional(),
    language: z.enum(['ENGLISH', 'URDU']).default('ENGLISH'),
    direction: z.enum(['ltr', 'rtl']).default('ltr'),
    customDomain: z.string().optional(),
    subdomain: z.string().optional(),
    seo: z.object({
      robotsIndex: z.boolean().default(true),
      robotsFollow: z.boolean().default(true),
      robotsArchive: z.boolean().default(true),
      robotsSnippet: z.boolean().default(true),
      robotsImageIndex: z.boolean().default(true),
      robotsTranslate: z.boolean().default(true)
    }).optional()
  })
})

// Generate XML sitemap
function generateSitemapXML(pages: any[], settings: any): string {
  const baseUrl = settings.customDomain ? 
    `https://${settings.customDomain}` : 
    `https://${settings.subdomain}.pakistanbuilder.com`
  
  const urls = pages
    .filter(page => page.slug && page.slug !== '')
    .sort((a, b) => {
      // Home page first
      if (a.isHome && !b.isHome) return -1
      if (!a.isHome && b.isHome) return 1
      // Then by order
      return a.order - b.order
    })
    .map(page => {
      const url = page.isHome ? baseUrl : `${baseUrl}/${page.slug}`
      const lastmod = new Date(page.updatedAt).toISOString().split('T')[0]
      
      return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.isHome ? '1.0' : '0.8'}</priority>
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

// Generate robots.txt
function generateRobotsTxt(settings: any): string {
  const baseUrl = settings.customDomain ? 
    `https://${settings.customDomain}` : 
    `https://${settings.subdomain}.pakistanbuilder.com`
  
  const seo = settings.seo || {}
  
  const robotsDirectives = []
  
  // User-agent directives
  if (seo.robotsIndex && seo.robotsFollow) {
    robotsDirectives.push('User-agent: *')
    robotsDirectives.push('Allow: /')
  } else {
    robotsDirectives.push('User-agent: *')
    if (!seo.robotsIndex) {
      robotsDirectives.push('Disallow: /')
    } else {
      robotsDirectives.push('Allow: /')
    }
  }
  
  // Specific directives
  if (!seo.robotsArchive) {
    robotsDirectives.push('Disallow: /archive/')
  }
  if (!seo.robotsSnippet) {
    robotsDirectives.push('Disallow: /snippet/')
  }
  if (!seo.robotsImageIndex) {
    robotsDirectives.push('Disallow: /images/')
  }
  
  // Sitemap
  robotsDirectives.push(`Sitemap: ${baseUrl}/sitemap.xml`)
  
  return robotsDirectives.join('\n')
}

// Generate JSON-LD structured data
function generateJSONLD(pages: any[], settings: any): string {
  const baseUrl = settings.customDomain ? 
    `https://${settings.customDomain}` : 
    `https://${settings.subdomain}.pakistanbuilder.com`
  
  const homePage = pages.find(page => page.isHome)
  
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": settings.siteName,
    "description": settings.description,
    "url": baseUrl,
    "inLanguage": settings.language === 'URDU' ? 'ur' : 'en',
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }
  
  if (homePage) {
    websiteSchema["@type"] = "WebPage"
    websiteSchema["name"] = homePage.metaTitle || settings.siteName
    websiteSchema["description"] = homePage.metaDescription || settings.description
  }
  
  return JSON.stringify(websiteSchema, null, 2)
}

// POST /sitemap - Generate sitemap and robots.txt
sitemapRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const validatedData = SitemapRequestSchema.parse(body)
    
    const { siteId, pages, settings } = validatedData
    
    // Generate sitemap XML
    const sitemapXML = generateSitemapXML(pages, settings)
    
    // Generate robots.txt
    const robotsTxt = generateRobotsTxt(settings)
    
    // Generate JSON-LD
    const jsonLD = generateJSONLD(pages, settings)
    
    // Upload to R2
    const baseUrl = settings.customDomain ? 
      `https://${settings.customDomain}` : 
      `https://${settings.subdomain}.pakistanbuilder.com`
    
    const uploadPromises = []
    
    // Upload sitemap.xml
    uploadPromises.push(
      r2.upload(c, `sites/${siteId}/sitemap.xml`, sitemapXML, {
        contentType: 'application/xml',
        cacheControl: 'public, max-age=3600'
      })
    )
    
    // Upload robots.txt
    uploadPromises.push(
      r2.upload(c, `sites/${siteId}/robots.txt`, robotsTxt, {
        contentType: 'text/plain',
        cacheControl: 'public, max-age=3600'
      })
    )
    
    // Upload JSON-LD
    uploadPromises.push(
      r2.upload(c, `sites/${siteId}/structured-data.json`, jsonLD, {
        contentType: 'application/json',
        cacheControl: 'public, max-age=3600'
      })
    )
    
    await Promise.all(uploadPromises)
    
    // Store sitemap info in database
    await db.execute(c, `
      INSERT OR REPLACE INTO sitemaps (siteId, sitemapUrl, robotsUrl, jsonLDUrl, pagesCount, lastGenerated, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      siteId,
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/robots.txt`,
      `${baseUrl}/structured-data.json`,
      pages.length,
      new Date().toISOString(),
      new Date().toISOString(),
      new Date().toISOString()
    ])
    
    return c.json({
      success: true,
      data: {
        sitemapUrl: `${baseUrl}/sitemap.xml`,
        robotsUrl: `${baseUrl}/robots.txt`,
        jsonLDUrl: `${baseUrl}/structured-data.json`,
        pagesCount: pages.length,
        lastGenerated: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return c.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to generate sitemap',
        code: 'SITEMAP_ERROR'
      }
    }, 500)
  }
})

// GET /sitemap/:siteId - Get sitemap info
sitemapRoutes.get('/:siteId', async (c) => {
  try {
    const siteId = c.req.param('siteId')
    
    if (!siteId) {
      return c.json({
        success: false,
        error: {
          message: 'Site ID is required',
          code: 'MISSING_SITE_ID'
        }
      }, 400)
    }
    
    // Get sitemap info from database
    const sitemapInfo = await db.queryOne(c, `
      SELECT * FROM sitemaps WHERE siteId = ?
    `, [siteId])
    
    if (!sitemapInfo) {
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
      data: sitemapInfo
    })
    
  } catch (error) {
    console.error('Get sitemap error:', error)
    return c.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get sitemap',
        code: 'GET_SITEMAP_ERROR'
      }
    }, 500)
  }
})

// GET /sitemap/:siteId/xml - Get sitemap XML
sitemapRoutes.get('/:siteId/xml', async (c) => {
  try {
    const siteId = c.req.param('siteId')
    
    if (!siteId) {
      return c.json({
        success: false,
        error: {
          message: 'Site ID is required',
          code: 'MISSING_SITE_ID'
        }
      }, 400)
    }
    
    // Get sitemap XML from R2
    const sitemapXML = await r2.get(c, `sites/${siteId}/sitemap.xml`)
    
    if (!sitemapXML) {
      return c.json({
        success: false,
        error: {
          message: 'Sitemap XML not found',
          code: 'SITEMAP_XML_NOT_FOUND'
        }
      }, 404)
    }
    
    return new Response(sitemapXML, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    })
    
  } catch (error) {
    console.error('Get sitemap XML error:', error)
    return c.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get sitemap XML',
        code: 'GET_SITEMAP_XML_ERROR'
      }
    }, 500)
  }
})

// GET /sitemap/:siteId/robots - Get robots.txt
sitemapRoutes.get('/:siteId/robots', async (c) => {
  try {
    const siteId = c.req.param('siteId')
    
    if (!siteId) {
      return c.json({
        success: false,
        error: {
          message: 'Site ID is required',
          code: 'MISSING_SITE_ID'
        }
      }, 400)
    }
    
    // Get robots.txt from R2
    const robotsTxt = await r2.get(c, `sites/${siteId}/robots.txt`)
    
    if (!robotsTxt) {
      return c.json({
        success: false,
        error: {
          message: 'Robots.txt not found',
          code: 'ROBOTS_TXT_NOT_FOUND'
        }
      }, 404)
    }
    
    return new Response(robotsTxt, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600'
      }
    })
    
  } catch (error) {
    console.error('Get robots.txt error:', error)
    return c.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get robots.txt',
        code: 'GET_ROBOTS_TXT_ERROR'
      }
    }, 500)
  }
})

// POST /sitemap/:siteId/validate - Validate sitemap
sitemapRoutes.post('/:siteId/validate', async (c) => {
  try {
    const siteId = c.req.param('siteId')
    
    if (!siteId) {
      return c.json({
        success: false,
        error: {
          message: 'Site ID is required',
          code: 'MISSING_SITE_ID'
        }
      }, 400)
    }
    
    // Get sitemap XML
    const sitemapXML = await r2.get(c, `sites/${siteId}/sitemap.xml`)
    
    if (!sitemapXML) {
      return c.json({
        success: false,
        error: {
          message: 'Sitemap not found',
          code: 'SITEMAP_NOT_FOUND'
        }
      }, 404)
    }
    
    // Basic XML validation
    const validationErrors = []
    
    try {
      // Check if it's valid XML
      new DOMParser().parseFromString(sitemapXML, 'application/xml')
    } catch (error) {
      validationErrors.push('Invalid XML format')
    }
    
    // Check for required elements
    if (!sitemapXML.includes('<urlset')) {
      validationErrors.push('Missing urlset element')
    }
    
    if (!sitemapXML.includes('<url>')) {
      validationErrors.push('No URLs found in sitemap')
    }
    
    // Check for required URL elements
    const urlMatches = sitemapXML.match(/<url>/g)
    const locMatches = sitemapXML.match(/<loc>/g)
    
    if (urlMatches && locMatches && urlMatches.length !== locMatches.length) {
      validationErrors.push('Mismatch between URL and loc elements')
    }
    
    return c.json({
      success: true,
      data: {
        isValid: validationErrors.length === 0,
        errors: validationErrors,
        urlCount: urlMatches ? urlMatches.length : 0,
        lastValidated: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Validate sitemap error:', error)
    return c.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to validate sitemap',
        code: 'VALIDATE_SITEMAP_ERROR'
      }
    }, 500)
  }
})

// POST /sitemap/:siteId/submit - Submit sitemap to search engines
sitemapRoutes.post('/:siteId/submit', async (c) => {
  try {
    const siteId = c.req.param('siteId')
    
    if (!siteId) {
      return c.json({
        success: false,
        error: {
          message: 'Site ID is required',
          code: 'MISSING_SITE_ID'
        }
      }, 400)
    }
    
    // Get sitemap info
    const sitemapInfo = await db.queryOne(c, `
      SELECT * FROM sitemaps WHERE siteId = ?
    `, [siteId])
    
    if (!sitemapInfo) {
      return c.json({
        success: false,
        error: {
          message: 'Sitemap not found',
          code: 'SITEMAP_NOT_FOUND'
        }
      }, 404)
    }
    
    const sitemapUrl = sitemapInfo.sitemapUrl
    
    // Submit to Google Search Console
    const googleSubmission = await fetch('https://www.google.com/ping?sitemap=' + encodeURIComponent(sitemapUrl))
    
    // Submit to Bing Webmaster Tools
    const bingSubmission = await fetch('https://www.bing.com/ping?sitemap=' + encodeURIComponent(sitemapUrl))
    
    // Store submission results
    const submissionResults = {
      google: {
        status: googleSubmission.ok ? 'success' : 'failed',
        statusCode: googleSubmission.status,
        submittedAt: new Date().toISOString()
      },
      bing: {
        status: bingSubmission.ok ? 'success' : 'failed',
        statusCode: bingSubmission.status,
        submittedAt: new Date().toISOString()
      }
    }
    
    // Update sitemap record
    await db.execute(c, `
      UPDATE sitemaps 
      SET submissionResults = ?, lastSubmitted = ?, updatedAt = ?
      WHERE siteId = ?
    `, [
      JSON.stringify(submissionResults),
      new Date().toISOString(),
      new Date().toISOString(),
      siteId
    ])
    
    return c.json({
      success: true,
      data: {
        sitemapUrl,
        submissionResults,
        submittedAt: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Submit sitemap error:', error)
    return c.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to submit sitemap',
        code: 'SUBMIT_SITEMAP_ERROR'
      }
    }, 500)
  }
})

export { sitemapRoutes }