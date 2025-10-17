import { PrismaClient } from '@prisma/client'
import { Redis } from '@upstash/redis'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { config } from '@/config/environment'

export interface PublishJob {
  id: string
  websiteId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  message: string
  deploymentUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface StaticFile {
  path: string
  content: string
  contentType: string
}

export class PublishService {
  private prisma: PrismaClient
  private redis: Redis
  private r2Client: S3Client
  
  constructor() {
    this.prisma = new PrismaClient()
    this.redis = Redis.fromEnv()
    
    // Configure R2 client
    this.r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.storage.r2?.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.storage.r2?.accessKeyId!,
        secretAccessKey: config.storage.r2?.secretAccessKey!,
      },
    })
  }
  
  async publishWebsite(websiteId: string, userId: string, customDomain?: string): Promise<{
    success: boolean
    jobId: string
    deploymentUrl: string
  }> {
    // 1. Validate website ownership
    const website = await this.prisma.website.findFirst({
      where: { id: websiteId, userId },
      include: { 
        pages: true,
        domains: true // Include custom domains
      }
    })
    
    if (!website) {
      throw new Error('Website not found or unauthorized')
    }
    
    // 2. Determine deployment URL based on domain type
    let deploymentUrl: string
    let domainToUse: string | undefined
    
    if (customDomain) {
      // Validate custom domain ownership
      const domain = website.domains?.find(d => d.domain === customDomain)
      if (!domain) {
        throw new Error('Custom domain not found or not owned by user')
      }
      if (!domain.verified) {
        throw new Error('Custom domain must be verified before publishing')
      }
      deploymentUrl = `https://${customDomain}`
      domainToUse = customDomain
    } else if (website.subdomain) {
      deploymentUrl = `https://${website.subdomain}.pakistanbuilder.com`
      domainToUse = website.subdomain
    } else {
      throw new Error('Please set a subdomain or custom domain before publishing')
    }
    
    // 3. Create publish job
    const jobId = `publish_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Store job status in Redis
    await this.redis.setex(`publish:job:${jobId}`, 3600, JSON.stringify({
      id: jobId,
      status: 'queued',
      progress: 0,
      websiteId,
      customDomain: domainToUse,
      deploymentUrl,
      createdAt: new Date().toISOString()
    }))
    
    // 4. Start async publishing
    this.executePublish(jobId, website, domainToUse).catch(console.error)
    
    return {
      success: true,
      jobId,
      deploymentUrl
    }
  }
  
  private async executePublish(jobId: string, website: any, domainToUse?: string) {
    try {
      await this.updateJobStatus(jobId, 'processing', 10, 'Generating static files...')
      
      // 5. Generate static HTML for each page
      const staticFiles = await this.generateStaticFiles(website)
      
      await this.updateJobStatus(jobId, 'processing', 40, 'Uploading to CDN...')
      
      // 6. Upload to R2
      await this.uploadToR2(website.id, staticFiles)
      
      await this.updateJobStatus(jobId, 'processing', 70, 'Updating metadata...')
      
      // 7. Update database
      await this.prisma.website.update({
        where: { id: website.id },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date()
        }
      })
      
      // 8. Update Redis cache for fast lookups
      if (domainToUse) {
        const cacheKey = domainToUse.includes('.') && !domainToUse.endsWith('.pakistanbuilder.com')
          ? `domain:${domainToUse}` // Custom domain
          : `subdomain:${website.subdomain}`; // Subdomain
        
        await this.redis.setex(
          cacheKey,
          86400, // 24 hours
          website.id
        )
      }
      
      await this.updateJobStatus(jobId, 'completed', 100, 'Published successfully!')
      
    } catch (error) {
      console.error('Publish error:', error)
      await this.updateJobStatus(jobId, 'failed', 0, error instanceof Error ? error.message : 'Unknown error')
    }
  }
  
  private async generateStaticFiles(website: any): Promise<Map<string, string>> {
    const files = new Map<string, string>()
    
    // Generate HTML for each page
    for (const page of website.pages) {
      const html = this.generatePageHTML(page, website)
      const path = page.slug === '/' ? '/index.html' : `/${page.slug}/index.html`
      files.set(path, html)
    }
    
    // Generate global assets
    files.set('/_assets/styles.css', this.generateGlobalCSS(website))
    files.set('/_assets/scripts.js', this.generateGlobalJS(website))
    
    // Generate dynamic component manifest
    const dynamicManifest = this.extractDynamicComponents(website)
    files.set('/_dynamic.json', JSON.stringify(dynamicManifest))
    
    return files
  }
  
  private generatePageHTML(page: any, website: any): string {
    const pageContent = JSON.parse(page.content || '{}')
    const components = pageContent.components || []
    
    // Generate component HTML
    const componentHTML = components.map((comp: any) => 
      this.renderComponent(comp)
    ).join('\n')
    
    return `<!DOCTYPE html>
<html lang="${website.language || 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.metaTitle || website.name}</title>
  <meta name="description" content="${page.metaDescription || website.description}">
  <link rel="stylesheet" href="/_assets/styles.css">
</head>
<body>
  ${componentHTML}
  <script src="/_assets/scripts.js"></script>
  <script>
    // Initialize dynamic components
    window.SITE_CONFIG = {
      apiUrl: '${config.server.clientUrl}',
      siteId: '${website.id}'
    };
    initDynamicComponents();
  </script>
</body>
</html>`
  }
  
  private renderComponent(component: any): string {
    const type = component.type
    const props = component.props || {}
    
    // Check if component has dynamic data
    const isDynamic = ['product-list', 'product-detail', 'cart', 'checkout', 'contact-form'].includes(type)
    
    if (isDynamic) {
      // Render placeholder for dynamic island
      return `<div data-component="${type}" data-props='${JSON.stringify(props)}' class="dynamic-component">
        <div class="loading">Loading...</div>
      </div>`
    }
    
    // Render static components
    switch (type) {
      case 'hero':
        return `<section class="hero">
          <h1>${props.title || ''}</h1>
          <p>${props.subtitle || ''}</p>
          ${props.buttonText ? `<a href="${props.buttonUrl}" class="btn">${props.buttonText}</a>` : ''}
        </section>`
      
      case 'features':
        return `<section class="features">
          <h2>${props.title || 'Features'}</h2>
          <div class="features-grid">
            ${(props.features || []).map((f: any) => `
              <div class="feature-item">
                <h3>${f.title}</h3>
                <p>${f.description}</p>
              </div>
            `).join('')}
          </div>
        </section>`
      
      default:
        return `<div class="component-${type}">${props.content || ''}</div>`
    }
  }
  
  private generateGlobalCSS(website: any): string {
    return `/* Global Styles */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

/* Component Styles */
.hero { padding: 80px 20px; text-align: center; }
.hero h1 { font-size: 3rem; margin-bottom: 1rem; }
.btn { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; }

/* Dynamic component styles */
.dynamic-component { min-height: 100px; }
.loading { text-align: center; padding: 20px; color: #666; }

${website.customCSS || ''}`
  }
  
  private generateGlobalJS(website: any): string {
    return `// Dynamic Component Hydration
async function initDynamicComponents() {
  const components = document.querySelectorAll('[data-component]');
  
  for (const el of components) {
    const type = el.getAttribute('data-component');
    const props = JSON.parse(el.getAttribute('data-props') || '{}');
    
    try {
      const data = await fetchComponentData(type, props);
      renderComponent(el, type, data);
    } catch (error) {
      console.error('Failed to load component:', type, error);
      el.innerHTML = '<div class="error">Failed to load content</div>';
    }
  }
}

async function fetchComponentData(type, props) {
  const { apiUrl, siteId } = window.SITE_CONFIG;
  const response = await fetch(\`\${apiUrl}/api/v1/sites/\${siteId}/components/\${type}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(props)
  });
  return response.json();
}

function renderComponent(el, type, data) {
  // Component-specific rendering logic
  switch (type) {
    case 'product-list':
      el.innerHTML = renderProductList(data);
      break;
    case 'cart':
      el.innerHTML = renderCart(data);
      break;
    // Add more cases
  }
}

function renderProductList(data) {
  return \`<div class="products-grid">
    \${data.products.map(p => \`
      <div class="product-card">
        <h3>\${p.name}</h3>
        <p class="price">$\${p.price}</p>
        <button onclick="addToCart('\${p.id}')">Add to Cart</button>
      </div>
    \`).join('')}
  </div>\`;
}

function renderCart(data) {
  return \`<div class="cart">
    <h3>Shopping Cart</h3>
    <div class="cart-items">
      \${data.items.map(item => \`
        <div class="cart-item">
          <span>\${item.name}</span>
          <span>$\${item.price}</span>
        </div>
      \`).join('')}
    </div>
    <div class="cart-total">Total: $\${data.total}</div>
  </div>\`;
}

${website.customJS || ''}`
  }
  
  private extractDynamicComponents(website: any): any {
    const dynamicComponents = []
    
    for (const page of website.pages) {
      const pageContent = JSON.parse(page.content || '{}')
      const components = pageContent.components || []
      
      components.forEach((comp: any) => {
        if (['product-list', 'product-detail', 'cart', 'checkout', 'contact-form'].includes(comp.type)) {
          dynamicComponents.push({
            type: comp.type,
            page: page.slug,
            props: comp.props
          })
        }
      })
    }
    
    return { components: dynamicComponents }
  }
  
  private async uploadToR2(siteId: string, files: Map<string, string>) {
    const uploadPromises = []
    
    for (const [path, content] of files) {
      const key = `sites/${siteId}${path}`
      const contentType = this.getContentType(path)
      
      uploadPromises.push(
        this.r2Client.send(new PutObjectCommand({
          Bucket: config.storage.r2?.bucket,
          Key: key,
          Body: content,
          ContentType: contentType,
          CacheControl: contentType.includes('html')
            ? 'public, max-age=300'
            : 'public, max-age=31536000, immutable'
        }))
      )
    }
    
    await Promise.all(uploadPromises)
  }
  
  private getContentType(path: string): string {
    if (path.endsWith('.html')) return 'text/html'
    if (path.endsWith('.css')) return 'text/css'
    if (path.endsWith('.js')) return 'application/javascript'
    if (path.endsWith('.json')) return 'application/json'
    return 'text/plain'
  }
  
  private async updateJobStatus(jobId: string, status: string, progress: number, message: string) {
    await this.redis.setex(`publish:job:${jobId}`, 3600, JSON.stringify({
      id: jobId,
      status,
      progress,
      message,
      updatedAt: new Date().toISOString()
    }))
  }
  
  async getJobStatus(jobId: string): Promise<any> {
    const jobData = await this.redis.get(`publish:job:${jobId}`)
    return jobData ? JSON.parse(jobData as string) : null
  }
}
