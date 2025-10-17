import { Hono } from 'hono'
import { createUpstashClient } from '@upstash/redis'

interface Env {
  SITES_BUCKET: R2Bucket
  REDIS_REST_URL: string
  REDIS_REST_TOKEN: string
  RAILWAY_API_URL: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const hostname = url.hostname
    
    // Main dashboard - pass through to Pages
    if (hostname === 'pakistanbuilder.com' || 
        hostname.startsWith('www.pakistanbuilder') ||
        hostname.startsWith('app.')) {
      return fetch(request)
    }
    
    // Resolve site from subdomain or custom domain
    const siteId = await resolveSiteId(hostname, env)
    
    if (!siteId) {
      return new Response('Site not found', { 
        status: 404,
        headers: { 'Content-Type': 'text/html' }
      })
    }
    
    // Check if it's an API request (dynamic content)
    if (url.pathname.startsWith('/api/')) {
      return proxyToRailway(request, siteId, env)
    }
    
    // Serve static site from R2
    return serveStaticSite(siteId, url.pathname, env)
  }
}

// Resolve site ID from hostname using Upstash Redis
async function resolveSiteId(hostname: string, env: Env): Promise<string | null> {
  // Query Upstash Redis via REST API
  const redis = createUpstashClient(env.REDIS_REST_URL, env.REDIS_REST_TOKEN)
  
  // Try subdomain first
  if (hostname.endsWith('.pakistanbuilder.com')) {
    const subdomain = hostname.replace('.pakistanbuilder.com', '')
    const cached = await redis.get(`subdomain:${subdomain}`)
    if (cached) return cached
  }
  
  // Try custom domain (premium)
  const cached = await redis.get(`domain:${hostname}`)
  if (cached) return cached
  
  // Cache miss - fetch from Railway backend
  const response = await fetch(`${env.RAILWAY_API_URL}/api/v1/sites/resolve?hostname=${hostname}`)
  if (response.ok) {
    const data = await response.json()
    const siteId = data.siteId
    
    // Cache for 5 minutes
    if (hostname.endsWith('.pakistanbuilder.com')) {
      await redis.setex(`subdomain:${hostname.split('.')[0]}`, 300, siteId)
    } else {
      await redis.setex(`domain:${hostname}`, 300, siteId)
    }
    
    return siteId
  }
  
  return null
}

// Serve static files from R2
async function serveStaticSite(siteId: string, pathname: string, env: Env): Promise<Response> {
  // Normalize path
  let filePath = pathname === '/' ? '/index.html' : pathname
  if (!filePath.includes('.')) {
    filePath = `${filePath}/index.html`
  }
  
  const objectKey = `sites/${siteId}${filePath}`
  
  // Try to get from R2
  const object = await env.SITES_BUCKET.get(objectKey)
  
  if (!object) {
    // Try index.html as fallback
    const fallback = await env.SITES_BUCKET.get(`sites/${siteId}/index.html`)
    if (!fallback) {
      return new Response('Page not found', { status: 404 })
    }
    return new Response(fallback.body, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600',
      }
    })
  }
  
  // Determine content type
  const contentType = getContentType(filePath)
  
  return new Response(object.body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': contentType.includes('html') 
        ? 'public, max-age=300' // 5 min for HTML
        : 'public, max-age=31536000, immutable', // 1 year for assets
      'ETag': object.etag || '',
    }
  })
}

// Proxy dynamic API requests to Railway backend
async function proxyToRailway(request: Request, siteId: string, env: Env): Promise<Response> {
  const url = new URL(request.url)
  const railwayUrl = new URL(url.pathname + url.search, env.RAILWAY_API_URL)
  
  // Add site context header
  const headers = new Headers(request.headers)
  headers.set('X-Site-ID', siteId)
  
  return fetch(railwayUrl.toString(), {
    method: request.method,
    headers,
    body: request.body,
  })
}

function getContentType(path: string): string {
  if (path.endsWith('.html')) return 'text/html'
  if (path.endsWith('.css')) return 'text/css'
  if (path.endsWith('.js')) return 'application/javascript'
  if (path.endsWith('.json')) return 'application/json'
  if (path.endsWith('.png')) return 'image/png'
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg'
  if (path.endsWith('.gif')) return 'image/gif'
  if (path.endsWith('.svg')) return 'image/svg+xml'
  if (path.endsWith('.webp')) return 'image/webp'
  return 'text/plain'
}
