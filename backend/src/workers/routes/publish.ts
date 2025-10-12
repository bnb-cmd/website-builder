import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '../lib/db'
import { kv } from '../lib/kv'
import { r2 } from '../lib/r2'

const publishRoutes = new Hono()

// Publish request schema
const PublishRequestSchema = z.object({
  siteId: z.string(),
  pages: z.array(z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    components: z.array(z.any()),
    settings: z.record(z.any()).optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.string().optional(),
    language: z.enum(['ENGLISH', 'URDU']).default('ENGLISH'),
    direction: z.enum(['ltr', 'rtl']).default('ltr')
  })),
  settings: z.object({
    siteName: z.string(),
    description: z.string().optional(),
    language: z.enum(['ENGLISH', 'URDU']).default('ENGLISH'),
    direction: z.enum(['ltr', 'rtl']).default('ltr'),
    customCSS: z.string().optional(),
    customJS: z.string().optional(),
    favicon: z.string().optional(),
    ogImage: z.string().optional()
  }),
  domain: z.string().optional(),
  subdomain: z.string().optional()
})

// Publish job status schema
const PublishJobStatusSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  progress: z.number().min(0).max(100),
  message: z.string().optional(),
  error: z.string().optional(),
  deploymentUrl: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  completedAt: z.string().optional()
})

// Generate static HTML for a page
async function generatePageHTML(page: any, siteSettings: any): Promise<string> {
  const { components, settings, metaTitle, metaDescription, metaKeywords, language, direction } = page
  
  // Generate component HTML
  const componentHTML = components.map((component: any) => {
    return generateComponentHTML(component, language, direction)
  }).join('\n')

  // Generate CSS
  const componentCSS = components.map((component: any) => {
    return generateComponentCSS(component, language, direction)
  }).join('\n')

  // Generate JavaScript
  const componentJS = components.map((component: any) => {
    return generateComponentJS(component)
  }).join('\n')

  return `<!DOCTYPE html>
<html lang="${language === 'URDU' ? 'ur' : 'en'}" dir="${direction}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${metaTitle || siteSettings.siteName}</title>
  <meta name="description" content="${metaDescription || siteSettings.description || ''}">
  <meta name="keywords" content="${metaKeywords || ''}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${metaTitle || siteSettings.siteName}">
  <meta property="og:description" content="${metaDescription || siteSettings.description || ''}">
  <meta property="og:type" content="website">
  ${siteSettings.ogImage ? `<meta property="og:image" content="${siteSettings.ogImage}">` : ''}
  
  <!-- Favicon -->
  ${siteSettings.favicon ? `<link rel="icon" href="${siteSettings.favicon}">` : ''}
  
  <!-- Fonts -->
  ${language === 'URDU' ? `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet">
  ` : ''}
  
  <!-- Styles -->
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: ${language === 'URDU' ? 'Noto Nastaliq Urdu, serif' : 'Inter, system-ui, sans-serif'};
      line-height: 1.6;
      color: #333;
      direction: ${direction};
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    /* Responsive breakpoints */
    @media (max-width: 768px) {
      .container {
        padding: 0 15px;
      }
    }
    
    @media (max-width: 480px) {
      .container {
        padding: 0 10px;
      }
    }
    
    ${componentCSS}
    ${siteSettings.customCSS || ''}
  </style>
</head>
<body>
  <div class="container">
    ${componentHTML}
  </div>
  
  <!-- Scripts -->
  <script>
    ${componentJS}
    ${siteSettings.customJS || ''}
  </script>
</body>
</html>`
}

// Generate HTML for a component
function generateComponentHTML(component: any, language: string, direction: string): string {
  const { type, props, layout, styles } = component
  const layoutStyles = layout.default || {}
  const componentStyles = styles.default || {}
  
  const styleString = Object.entries({
    ...layoutStyles,
    ...componentStyles
  }).map(([key, value]) => `${key}: ${value}`).join('; ')

  switch (type) {
    case 'hero':
      return `
        <section class="hero" style="${styleString}">
          <div class="hero-content">
            <h1>${props.title || 'Welcome'}</h1>
            <p>${props.subtitle || 'Create amazing experiences'}</p>
            ${props.buttonText ? `<a href="${props.buttonUrl || '#'}" class="btn">${props.buttonText}</a>` : ''}
          </div>
        </section>
      `
    
    case 'features':
      return `
        <section class="features" style="${styleString}">
          <h2>${props.title || 'Our Features'}</h2>
          <div class="features-grid" style="display: grid; grid-template-columns: repeat(${props.columns || 3}, 1fr); gap: 20px;">
            ${(props.features || []).map((feature: any) => `
              <div class="feature-item">
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
              </div>
            `).join('')}
          </div>
        </section>
      `
    
    case 'testimonials':
      return `
        <section class="testimonials" style="${styleString}">
          <h2>${props.title || 'What Our Customers Say'}</h2>
          <div class="testimonials-grid">
            ${(props.testimonials || []).map((testimonial: any) => `
              <div class="testimonial-item">
                <p>"${testimonial.content}"</p>
                <div class="testimonial-author">
                  <strong>${testimonial.name}</strong>
                  <span>${testimonial.role}, ${testimonial.company}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `
    
    case 'contact-form':
      return `
        <section class="contact-form" style="${styleString}">
          <h2>${props.title || 'Get In Touch'}</h2>
          <form>
            ${(props.fields || []).map((field: any) => `
              <div class="form-group">
                <label for="${field.name}">${field.label}</label>
                ${field.type === 'textarea' ? 
                  `<textarea id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}></textarea>` :
                  `<input type="${field.type}" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>`
                }
              </div>
            `).join('')}
            <button type="submit">${props.submitText || 'Send Message'}</button>
          </form>
        </section>
      `
    
    case 'gallery':
      return `
        <section class="gallery" style="${styleString}">
          <h2>${props.title || 'Our Gallery'}</h2>
          <div class="gallery-grid" style="display: grid; grid-template-columns: repeat(${props.columns || 3}, 1fr); gap: 20px;">
            ${(props.images || []).map((image: any) => `
              <div class="gallery-item">
                <img src="${image.src}" alt="${image.alt}" loading="lazy">
                ${props.showCaptions && image.caption ? `<p class="caption">${image.caption}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </section>
      `
    
    default:
      return `<div class="component-${type}" style="${styleString}">${props.content || ''}</div>`
  }
}

// Generate CSS for a component
function generateComponentCSS(component: any, language: string, direction: string): string {
  const { type, props } = component
  
  switch (type) {
    case 'hero':
      return `
        .hero {
          background: ${props.backgroundImage ? `url('${props.backgroundImage}')` : props.backgroundColor || '#f8f9fa'};
          background-size: cover;
          background-position: center;
          color: ${props.textColor || '#333'};
          text-align: center;
          padding: 80px 20px;
        }
        
        .hero h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }
        
        .hero p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }
        
        .btn {
          display: inline-block;
          background: ${props.buttonColor || '#3b82f6'};
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        @media (max-width: 768px) {
          .hero h1 { font-size: 2rem; }
          .hero p { font-size: 1rem; }
        }
      `
    
    case 'features':
      return `
        .features {
          padding: 80px 20px;
          background: #fff;
        }
        
        .features h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #333;
        }
        
        .feature-item {
          text-align: center;
          padding: 20px;
        }
        
        .feature-item h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #333;
        }
        
        .feature-item p {
          color: #666;
          line-height: 1.6;
        }
        
        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `
    
    case 'testimonials':
      return `
        .testimonials {
          padding: 80px 20px;
          background: #f8f9fa;
        }
        
        .testimonials h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #333;
        }
        
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }
        
        .testimonial-item {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .testimonial-item p {
          font-style: italic;
          margin-bottom: 20px;
          color: #555;
        }
        
        .testimonial-author strong {
          display: block;
          color: #333;
        }
        
        .testimonial-author span {
          color: #666;
          font-size: 0.9rem;
        }
      `
    
    case 'contact-form':
      return `
        .contact-form {
          padding: 80px 20px;
          background: #fff;
        }
        
        .contact-form h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #333;
        }
        
        .contact-form form {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }
        
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
        }
        
        .form-group textarea {
          height: 120px;
          resize: vertical;
        }
        
        .contact-form button {
          background: #3b82f6;
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          width: 100%;
        }
        
        .contact-form button:hover {
          background: #2563eb;
        }
      `
    
    case 'gallery':
      return `
        .gallery {
          padding: 80px 20px;
          background: #fff;
        }
        
        .gallery h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #333;
        }
        
        .gallery-item {
          position: relative;
          overflow: hidden;
          border-radius: 8px;
        }
        
        .gallery-item img {
          width: 100%;
          height: 250px;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .gallery-item:hover img {
          transform: scale(1.05);
        }
        
        .caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 10px;
          text-align: center;
        }
        
        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (max-width: 480px) {
          .gallery-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `
    
    default:
      return ''
  }
}

// Generate JavaScript for a component
function generateComponentJS(component: any): string {
  const { type, props } = component
  
  switch (type) {
    case 'contact-form':
      return `
        document.addEventListener('DOMContentLoaded', function() {
          const forms = document.querySelectorAll('.contact-form form');
          forms.forEach(form => {
            form.addEventListener('submit', function(e) {
              e.preventDefault();
              // Handle form submission
              alert('${props.successMessage || 'Thank you for your message!'}');
            });
          });
        });
      `
    
    case 'gallery':
      if (props.lightbox) {
        return `
          document.addEventListener('DOMContentLoaded', function() {
            const galleryItems = document.querySelectorAll('.gallery-item img');
            galleryItems.forEach(img => {
              img.addEventListener('click', function() {
                // Simple lightbox implementation
                const lightbox = document.createElement('div');
                lightbox.style.cssText = \`
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background: rgba(0,0,0,0.9);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  z-index: 1000;
                  cursor: pointer;
                \`;
                
                const lightboxImg = document.createElement('img');
                lightboxImg.src = this.src;
                lightboxImg.style.cssText = \`
                  max-width: 90%;
                  max-height: 90%;
                  object-fit: contain;
                \`;
                
                lightbox.appendChild(lightboxImg);
                document.body.appendChild(lightbox);
                
                lightbox.addEventListener('click', function() {
                  document.body.removeChild(lightbox);
                });
              });
            });
          });
        `
      }
      return ''
    
    default:
      return ''
  }
}

// POST /publish - Start publishing process
publishRoutes.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const validatedData = PublishRequestSchema.parse(body)
    
    const { siteId, pages, settings, domain, subdomain } = validatedData
    
    // Generate unique job ID
    const jobId = `publish_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Create publish job record
    const jobStatus: any = {
      id: jobId,
      status: 'pending',
      progress: 0,
      message: 'Starting publish process...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Store job status in KV
    await kv.setJSON(c, `publish_job:${jobId}`, jobStatus)
    
    // Queue the publish job
    await c.env.PUBLISH_QUEUE.send({
      jobId,
      siteId,
      pages,
      settings,
      domain,
      subdomain
    })
    
    return c.json({
      success: true,
      data: {
        jobId,
        status: 'pending',
        message: 'Publish job queued successfully'
      }
    })
    
  } catch (error) {
    console.error('Publish error:', error)
    return c.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to start publish process',
        code: 'PUBLISH_ERROR'
      }
    }, 500)
  }
})

// GET /publish/:jobId/status - Get publish job status
publishRoutes.get('/:jobId/status', async (c) => {
  try {
    const jobId = c.req.param('jobId')
    
    if (!jobId) {
      return c.json({
        success: false,
        error: {
          message: 'Job ID is required',
          code: 'MISSING_JOB_ID'
        }
      }, 400)
    }
    
    // Get job status from KV
    const jobStatus = await kv.getJSON(c, `publish_job:${jobId}`)
    
    if (!jobStatus) {
      return c.json({
        success: false,
        error: {
          message: 'Job not found',
          code: 'JOB_NOT_FOUND'
        }
      }, 404)
    }
    
    return c.json({
      success: true,
      data: jobStatus
    })
    
  } catch (error) {
    console.error('Get job status error:', error)
    return c.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get job status',
        code: 'STATUS_ERROR'
      }
    }, 500)
  }
})

// POST /publish/:jobId/cancel - Cancel publish job
publishRoutes.post('/:jobId/cancel', async (c) => {
  try {
    const jobId = c.req.param('jobId')
    
    if (!jobId) {
      return c.json({
        success: false,
        error: {
          message: 'Job ID is required',
          code: 'MISSING_JOB_ID'
        }
      }, 400)
    }
    
    // Get current job status
    const jobStatus = await kv.getJSON(c, `publish_job:${jobId}`)
    
    if (!jobStatus) {
      return c.json({
        success: false,
        error: {
          message: 'Job not found',
          code: 'JOB_NOT_FOUND'
        }
      }, 404)
    }
    
    if (jobStatus.status === 'completed' || jobStatus.status === 'failed') {
      return c.json({
        success: false,
        error: {
          message: 'Cannot cancel completed or failed job',
          code: 'JOB_NOT_CANCELLABLE'
        }
      }, 400)
    }
    
    // Update job status to cancelled
    const updatedStatus = {
      ...jobStatus,
      status: 'cancelled',
      message: 'Job cancelled by user',
      updatedAt: new Date().toISOString()
    }
    
    await kv.setJSON(c, `publish_job:${jobId}`, updatedStatus)
    
    return c.json({
      success: true,
      data: {
        jobId,
        status: 'cancelled',
        message: 'Job cancelled successfully'
      }
    })
    
  } catch (error) {
    console.error('Cancel job error:', error)
    return c.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to cancel job',
        code: 'CANCEL_ERROR'
      }
    }, 500)
  }
})

// GET /publish/history - Get publish history for a site
publishRoutes.get('/history', async (c) => {
  try {
    const siteId = c.req.query('siteId')
    
    if (!siteId) {
      return c.json({
        success: false,
        error: {
          message: 'Site ID is required',
          code: 'MISSING_SITE_ID'
        }
      }, 400)
    }
    
    // Get publish history from database
    const history = await db.query(c, `
      SELECT id, status, progress, message, deploymentUrl, createdAt, updatedAt, completedAt
      FROM publish_jobs
      WHERE siteId = ?
      ORDER BY createdAt DESC
      LIMIT 50
    `, [siteId])
    
    return c.json({
      success: true,
      data: history
    })
    
  } catch (error) {
    console.error('Get publish history error:', error)
    return c.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to get publish history',
        code: 'HISTORY_ERROR'
      }
    }, 500)
  }
})

export { publishRoutes }