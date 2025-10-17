import { Website, Page } from '@prisma/client'
import { config } from '@/config/environment'

export interface DynamicComponent {
  id: string
  type: string
  props: Record<string, any>
  apiEndpoint?: string
  cacheStrategy?: 'static' | 'dynamic' | 'hybrid'
  hydrationStrategy?: 'immediate' | 'lazy' | 'viewport'
}

export interface GeneratedPage {
  path: string
  html: string
  css: string
  js: string
  dynamicComponents: DynamicComponent[]
  seo: {
    title: string
    description: string
    keywords: string[]
    ogImage?: string
    canonical?: string
  }
  performance: {
    criticalCSS: string
    preloadAssets: string[]
    deferAssets: string[]
  }
}

export interface GeneratedSite {
  pages: GeneratedPage[]
  globalCSS: string
  globalJS: string
  assets: Array<{ path: string; content: string; type: string }>
  manifest: {
    name: string
    shortName: string
    description: string
    themeColor: string
    backgroundColor: string
    display: string
    icons: Array<{ src: string; sizes: string; type: string }>
  }
  sitemap: Array<{ url: string; lastmod: string; priority: number }>
  robots: string
}

export interface ComponentData {
  id: string
  type: string
  props: Record<string, any>
  content?: string
  responsive?: boolean
  animations?: {
    enter?: string
    exit?: string
    hover?: string
  }
  accessibility?: {
    ariaLabel?: string
    ariaDescribedBy?: string
    role?: string
  }
}

export interface ComponentStyle {
  base: string
  responsive: string
  animations: string
  darkMode?: string
  print?: string
}

export interface ComponentBehavior {
  interactions: string
  events: string
  lifecycle: string
}

/**
 * Generate static HTML for a website with dynamic island support
 */
export async function generateStaticHTML(website: Website & { pages: Page[] }): Promise<GeneratedSite> {
  const globalCSS = generateGlobalCSS(website)
  const globalJS = generateGlobalJS(website)
  const pages: GeneratedPage[] = []
  const assets: Array<{ path: string; content: string; type: string }> = []

  // Generate pages with enhanced features
  for (const page of website.pages) {
    const pageData = await generatePageHTML(page, website)
    pages.push(pageData)
  }

  // Generate PWA manifest
  const manifest = generatePWAManifest(website)

  // Generate sitemap
  const sitemap = generateSitemap(website, pages)

  // Generate robots.txt
  const robots = generateRobotsTxt(website)

  // Generate additional assets
  assets.push(
    { path: 'manifest.json', content: JSON.stringify(manifest, null, 2), type: 'application/json' },
    { path: 'sitemap.xml', content: generateSitemapXML(sitemap), type: 'application/xml' },
    { path: 'robots.txt', content: robots, type: 'text/plain' }
  )

  return {
    pages,
    globalCSS,
    globalJS,
    assets,
    manifest,
    sitemap,
    robots
  }
}

/**
 * Generate HTML for a single page with enhanced features
 */
async function generatePageHTML(page: Page, website: Website): Promise<GeneratedPage> {
  const pageContent = JSON.parse(page.content || '{}')
  const components = pageContent.components || []
  const dynamicComponents: DynamicComponent[] = []
  const preloadAssets: string[] = []
  const deferAssets: string[] = []
  
  // Generate SEO data
  const seo = {
    title: page.metaTitle || page.name || website.name || 'Untitled Page',
    description: page.metaDescription || website.description || '',
    keywords: (page.metaKeywords || '').split(',').map(k => k.trim()).filter(Boolean),
    ogImage: pageContent.ogImage || '',
    canonical: `${config.server.clientUrl}${page.slug || '/'}`
  }

  // Generate critical CSS inline
  const criticalCSS = generateCriticalCSS(page, components)

  let html = `<!DOCTYPE html>
<html lang="${website.language || 'en'}" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <!-- SEO Meta Tags -->
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}">
    ${seo.keywords.length > 0 ? `<meta name="keywords" content="${seo.keywords.join(', ')}">` : ''}
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${seo.title}">
    <meta property="og:description" content="${seo.description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${seo.canonical}">
    ${seo.ogImage ? `<meta property="og:image" content="${seo.ogImage}">` : ''}
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${seo.title}">
    <meta name="twitter:description" content="${seo.description}">
    ${seo.ogImage ? `<meta name="twitter:image" content="${seo.ogImage}">` : ''}
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${seo.canonical}">
    
    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#3b82f6">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="${website.name}">
    
    <!-- Critical CSS (inline) -->
    <style>${criticalCSS}</style>
    
    <!-- Preload critical resources -->
    <link rel="preload" href="/css/global.css" as="style">
    <link rel="preload" href="/js/global.js" as="script">
    
    <!-- Non-critical CSS (deferred) -->
    <link rel="stylesheet" href="/css/global.css" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="/css/page-${page.id}.css" media="print" onload="this.media='all'">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    
    <!-- Manifest -->
    <link rel="manifest" href="/manifest.json">
</head>
<body>
    <!-- Skip to main content for accessibility -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <div id="app" data-page-id="${page.id}" data-page-slug="${page.slug}">
        <main id="main-content" role="main">`

  // Generate component HTML with enhanced features
  for (const component of components) {
    const componentHTML = await generateComponentHTML(component)
    html += componentHTML.html
    
    // Track dynamic components with enhanced metadata
    if (componentHTML.isDynamic) {
      dynamicComponents.push({
        id: component.id || Math.random().toString(36).substr(2, 9),
        type: component.type,
        props: component.props || {},
        apiEndpoint: componentHTML.apiEndpoint,
        cacheStrategy: componentHTML.cacheStrategy,
        hydrationStrategy: componentHTML.hydrationStrategy || 'lazy'
      })
    }

    // Track assets for preloading/deferring
    if (componentHTML.preloadAssets) {
      preloadAssets.push(...componentHTML.preloadAssets)
    }
    if (componentHTML.deferAssets) {
      deferAssets.push(...componentHTML.deferAssets)
    }
  }

  html += `
        </main>
    </div>
    
    <!-- Service Worker Registration -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => console.log('SW registered'))
                    .catch(error => console.log('SW registration failed'));
            });
        }
    </script>
    
    <!-- Dynamic island hydration -->
    <script>
        window.__DYNAMIC_COMPONENTS__ = ${JSON.stringify(dynamicComponents)};
        window.__API_BASE_URL__ = '${config.server.clientUrl}';
        window.__SITE_CONFIG__ = {
            id: '${website.id}',
            name: '${website.name}',
            language: '${website.language || 'en'}',
            theme: 'light'
        };
    </script>
    
    <!-- Non-critical JavaScript (deferred) -->
    <script src="/js/global.js" defer></script>
    <script src="/js/page-${page.id}.js" defer></script>
</body>
</html>`

  const css = generatePageCSS(page, website)
  const js = generatePageJS(page, website, dynamicComponents)

  return {
    path: page.slug || '/',
    html,
    css,
    js,
    dynamicComponents,
    seo,
    performance: {
      criticalCSS,
      preloadAssets,
      deferAssets
    }
  }
}

/**
 * Generate HTML for a component
 */
async function generateComponentHTML(component: ComponentData): Promise<{
  html: string
  isDynamic: boolean
  apiEndpoint?: string
  cacheStrategy?: 'static' | 'dynamic' | 'hybrid'
  hydrationStrategy?: 'immediate' | 'lazy' | 'viewport'
  preloadAssets?: string[]
  deferAssets?: string[]
}> {
  const props = component.props || {}
  const isDynamic = isDynamicComponent(component.type)
  
  let html = `<div id="component-${component.id}" class="component ${component.type}" data-component-id="${component.id}">`

  switch (component.type) {
    case 'hero':
      html += generateHeroHTML(props)
      break
    case 'text':
      html += generateTextHTML(props)
      break
    case 'image':
      html += generateImageHTML(props)
      break
    case 'button':
      html += generateButtonHTML(props)
      break
    case 'form':
      html += generateFormHTML(props)
      break
    case 'gallery':
      html += generateGalleryHTML(props)
      break
    case 'testimonials':
      html += generateTestimonialsHTML(props)
      break
    case 'pricing':
      html += generatePricingHTML(props)
      break
    case 'contact':
      html += generateContactHTML(props)
      break
    case 'ecommerce-product':
      html += generateEcommerceProductHTML(props)
      break
    case 'ecommerce-cart':
      html += generateEcommerceCartHTML(props)
      break
    case 'blog-list':
      html += generateBlogListHTML(props)
      break
    case 'newsletter':
      html += generateNewsletterHTML(props)
      break
    case 'social-links':
      html += generateSocialLinksHTML(props)
      break
    case 'map':
      html += generateMapHTML(props)
      break
    case 'video':
      html += generateVideoHTML(props)
      break
    case 'countdown':
      html += generateCountdownHTML(props)
      break
    case 'faq':
      html += generateFAQHTML(props)
      break
    case 'team':
      html += generateTeamHTML(props)
      break
    case 'stats':
      html += generateStatsHTML(props)
      break
    case 'timeline':
      html += generateTimelineHTML(props)
      break
    case 'tabs':
      html += generateTabsHTML(props)
      break
    case 'accordion':
      html += generateAccordionHTML(props)
      break
    case 'modal':
      html += generateModalHTML(props)
      break
    case 'carousel':
      html += generateCarouselHTML(props)
      break
    case 'navigation':
      html += generateNavigationHTML(props)
      break
    case 'footer':
      html += generateFooterHTML(props)
      break
    default:
      html += `<div class="unknown-component">Unknown component: ${component.type}</div>`
  }

  html += '</div>'

  return {
    html,
    isDynamic,
    apiEndpoint: isDynamic ? getAPIEndpoint(component.type) : undefined,
    cacheStrategy: getCacheStrategy(component.type),
    hydrationStrategy: getHydrationStrategy(component.type),
    preloadAssets: getPreloadAssets(component),
    deferAssets: getDeferAssets(component)
  }
}

/**
 * Generate CSS for a page
 */
function generatePageCSS(page: Page, website: Website): string {
  let css = `/* Page: ${page.name} */\n`
  
  css += `.page-${page.id} {\n`
  css += `  min-height: 100vh;\n`
  css += `}\n\n`

  const pageContent = JSON.parse(page.content || '{}')
  const components = pageContent.components || []
  
  for (const component of components) {
    css += generateComponentCSS(component)
  }

  return css
}

/**
 * Generate CSS for a component
 */
function generateComponentCSS(component: ComponentData): string {
  const props = component.props || {}
  
  let css = `/* Component: ${component.type} */\n`
  css += `#component-${component.id} {\n`
  
  // Add responsive styles
  if (props.responsive) {
    css += `  display: block;\n`
    css += `  width: 100%;\n`
    css += `  max-width: ${props.maxWidth || '100%'};\n`
    css += `  margin: ${props.margin || '0 auto'};\n`
    css += `  padding: ${props.padding || '0'};\n`
  }

  // Add custom styles
  if (props.customCSS) {
    css += `  ${props.customCSS}\n`
  }

  css += `}\n\n`

  // Add component-specific styles
  switch (component.type) {
    case 'hero':
      css += generateHeroCSS(component.id, props)
      break
    case 'button':
      css += generateButtonCSS(component.id, props)
      break
    case 'form':
      css += generateFormCSS(component.id, props)
      break
    case 'gallery':
      css += generateGalleryCSS(component.id, props)
      break
    case 'navigation':
      css += generateNavigationCSS(component.id, props)
      break
    case 'footer':
      css += generateFooterCSS(component.id, props)
      break
  }

  return css
}

/**
 * Generate JavaScript for a page
 */
function generatePageJS(page: Page, website: Website, dynamicComponents: DynamicComponent[]): string {
  let js = `/* Page: ${page.name} */\n`
  
  js += `document.addEventListener('DOMContentLoaded', function() {\n`
  js += `  console.log('Page ${page.id} loaded');\n\n`

  const pageContent = JSON.parse(page.content || '{}')
  const components = pageContent.components || []
  
  // Add component JavaScript
  for (const component of components) {
    js += generateComponentJS(component)
  }

  // Add dynamic component hydration
  if (dynamicComponents.length > 0) {
    js += `\n  // Hydrate dynamic components\n`
    js += `  hydrateDynamicComponents();\n`
  }

  js += `});\n\n`

  // Add dynamic component hydration function
  if (dynamicComponents.length > 0) {
    js += generateDynamicHydrationJS(dynamicComponents)
  }

  return js
}

/**
 * Generate JavaScript for a component
 */
function generateComponentJS(component: ComponentData): string {
  const props = component.props || {}
  
  let js = `\n  // Component: ${component.type}\n`
  js += `  const component${component.id} = document.getElementById('component-${component.id}');\n`
  
  switch (component.type) {
    case 'form':
      js += generateFormJS(component.id, props)
      break
    case 'gallery':
      js += generateGalleryJS(component.id, props)
      break
    case 'carousel':
      js += generateCarouselJS(component.id, props)
      break
    case 'modal':
      js += generateModalJS(component.id, props)
      break
    case 'tabs':
      js += generateTabsJS(component.id, props)
      break
    case 'accordion':
      js += generateAccordionJS(component.id, props)
      break
    case 'countdown':
      js += generateCountdownJS(component.id, props)
      break
    case 'ecommerce-cart':
      js += generateEcommerceCartJS(component.id, props)
      break
    case 'newsletter':
      js += generateNewsletterJS(component.id, props)
      break
  }

  return js
}

/**
 * Generate global CSS
 */
function generateGlobalCSS(website: Website): string {
  return `/* Global Styles for ${website.name} */

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
}

.col {
  flex: 1;
  padding: 0 15px;
}

/* Responsive utilities */
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  .row {
    margin: 0 -10px;
  }
  
  .col {
    padding: 0 10px;
  }
}

/* Animation utilities */
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.slide-in-left {
  animation: slideInLeft 0.5s ease-out;
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

.slide-in-right {
  animation: slideInRight 0.5s ease-out;
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Loading states */
.loading {
  opacity: 0.6;
  pointer-events: none;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error states */
.error {
  color: #e74c3c;
  background-color: #fdf2f2;
  border: 1px solid #fecaca;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

.success {
  color: #27ae60;
  background-color: #f0f9f0;
  border: 1px solid #c3e6c3;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

/* Dynamic component placeholders */
.dynamic-component {
  position: relative;
  min-height: 50px;
}

.dynamic-component.loading::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.dynamic-component.error {
  background-color: #fdf2f2;
  border: 1px solid #fecaca;
  padding: 20px;
  text-align: center;
  color: #e74c3c;
}
`
}

/**
 * Generate global JavaScript
 */
function generateGlobalJS(website: Website): string {
  return `/* Global JavaScript for ${website.name} */

// API helper
const API = {
  baseURL: window.__API_BASE_URL__ || '${config.server.clientUrl}',
  
  async request(endpoint, options = {}) {
    const url = this.baseURL + endpoint;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },
  
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },
  
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};

// Dynamic component hydration
function hydrateDynamicComponents() {
  const components = window.__DYNAMIC_COMPONENTS__ || [];
  
  components.forEach(component => {
    const element = document.getElementById(\`component-\${component.id}\`);
    if (!element) return;
    
    element.classList.add('dynamic-component', 'loading');
    
    // Load component data
    loadDynamicComponent(component)
      .then(data => {
        element.classList.remove('loading');
        element.classList.add('loaded');
        renderDynamicComponent(element, component, data);
      })
      .catch(error => {
        console.error(\`Failed to load dynamic component \${component.id}:\`, error);
        element.classList.remove('loading');
        element.classList.add('error');
        element.innerHTML = \`<div class="error">Failed to load component: \${error.message}</div>\`;
      });
  });
}

// Load data for dynamic component
async function loadDynamicComponent(component) {
  if (!component.apiEndpoint) {
    return component.props;
  }
  
  try {
    const data = await API.get(component.apiEndpoint);
    return { ...component.props, ...data };
  } catch (error) {
    console.error(\`Failed to fetch data for component \${component.id}:\`, error);
    return component.props;
  }
}

// Render dynamic component with data
function renderDynamicComponent(element, component, data) {
  switch (component.type) {
    case 'ecommerce-product':
      renderEcommerceProduct(element, data);
      break;
    case 'ecommerce-cart':
      renderEcommerceCart(element, data);
      break;
    case 'blog-list':
      renderBlogList(element, data);
      break;
    case 'newsletter':
      renderNewsletter(element, data);
      break;
    case 'testimonials':
      renderTestimonials(element, data);
      break;
    case 'stats':
      renderStats(element, data);
      break;
    case 'contact':
      renderContact(element, data);
      break;
    default:
      console.warn(\`Unknown dynamic component type: \${component.type}\`);
  }
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export for use in components
window.API = API;
window.hydrateDynamicComponents = hydrateDynamicComponents;
window.debounce = debounce;
window.throttle = throttle;
`
}

// Component HTML generators
function generateHeroHTML(props: any): string {
  return `
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">${props.title || 'Welcome'}</h1>
        <p class="hero-subtitle">${props.subtitle || ''}</p>
        ${props.buttonText ? `<a href="${props.buttonLink || '#'}" class="hero-button">${props.buttonText}</a>` : ''}
      </div>
      ${props.backgroundImage ? `<div class="hero-background" style="background-image: url('${props.backgroundImage}')"></div>` : ''}
    </div>
  `
}

function generateTextHTML(props: any): string {
  return `
    <div class="text-content">
      <h2>${props.title || ''}</h2>
      <p>${props.content || ''}</p>
    </div>
  `
}

function generateImageHTML(props: any): string {
  return `
    <div class="image-container">
      <img src="${props.src || ''}" alt="${props.alt || ''}" class="responsive-image">
      ${props.caption ? `<p class="image-caption">${props.caption}</p>` : ''}
    </div>
  `
}

function generateButtonHTML(props: any): string {
  return `
    <a href="${props.link || '#'}" class="button ${props.style || 'primary'}" ${props.target ? `target="${props.target}"` : ''}>
      ${props.text || 'Button'}
    </a>
  `
}

function generateFormHTML(props: any): string {
  return `
    <form class="contact-form" data-form-id="${props.id || ''}">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" name="message" rows="5" required></textarea>
      </div>
      <button type="submit" class="submit-button">Send Message</button>
    </form>
  `
}

function generateGalleryHTML(props: any): string {
  const images = props.images || []
  return `
    <div class="gallery-container">
      <div class="gallery-grid">
        ${images.map((img: any, index: number) => `
          <div class="gallery-item" data-index="${index}">
            <img src="${img.src}" alt="${img.alt || ''}" class="gallery-image">
            ${img.caption ? `<p class="gallery-caption">${img.caption}</p>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function generateTestimonialsHTML(props: any): string {
  const testimonials = props.testimonials || []
  return `
    <div class="testimonials-container">
      <h2 class="testimonials-title">${props.title || 'What Our Customers Say'}</h2>
      <div class="testimonials-grid">
        ${testimonials.map((testimonial: any) => `
          <div class="testimonial-item">
            <div class="testimonial-content">
              <p>"${testimonial.content}"</p>
            </div>
            <div class="testimonial-author">
              <img src="${testimonial.avatar || ''}" alt="${testimonial.name}" class="testimonial-avatar">
              <div class="testimonial-info">
                <h4>${testimonial.name}</h4>
                <p>${testimonial.role}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function generatePricingHTML(props: any): string {
  const plans = props.plans || []
  return `
    <div class="pricing-container">
      <h2 class="pricing-title">${props.title || 'Choose Your Plan'}</h2>
      <div class="pricing-grid">
        ${plans.map((plan: any) => `
          <div class="pricing-card ${plan.featured ? 'featured' : ''}">
            <h3 class="plan-name">${plan.name}</h3>
            <div class="plan-price">
              <span class="currency">${plan.currency || '$'}</span>
              <span class="amount">${plan.price}</span>
              <span class="period">/${plan.period || 'month'}</span>
            </div>
            <ul class="plan-features">
              ${plan.features.map((feature: string) => `<li>${feature}</li>`).join('')}
            </ul>
            <a href="${plan.buttonLink || '#'}" class="plan-button">${plan.buttonText || 'Get Started'}</a>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function generateContactHTML(props: any): string {
  return `
    <div class="contact-container">
      <div class="contact-info">
        <h2>${props.title || 'Get In Touch'}</h2>
        <p>${props.description || ''}</p>
        <div class="contact-details">
          ${props.phone ? `<p><strong>Phone:</strong> ${props.phone}</p>` : ''}
          ${props.email ? `<p><strong>Email:</strong> ${props.email}</p>` : ''}
          ${props.address ? `<p><strong>Address:</strong> ${props.address}</p>` : ''}
        </div>
      </div>
      <div class="contact-form-container">
        ${generateFormHTML(props)}
      </div>
    </div>
  `
}

function generateEcommerceProductHTML(props: any): string {
  return `
    <div class="product-container">
      <div class="product-image">
        <img src="${props.image || ''}" alt="${props.name || ''}" class="product-main-image">
      </div>
      <div class="product-details">
        <h1 class="product-name">${props.name || ''}</h1>
        <div class="product-price">
          <span class="current-price">$${props.price || '0'}</span>
          ${props.originalPrice ? `<span class="original-price">$${props.originalPrice}</span>` : ''}
        </div>
        <div class="product-description">
          <p>${props.description || ''}</p>
        </div>
        <div class="product-options">
          <div class="quantity-selector">
            <label for="quantity">Quantity:</label>
            <input type="number" id="quantity" name="quantity" min="1" value="1">
          </div>
          <button class="add-to-cart-button" data-product-id="${props.id || ''}">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `
}

function generateEcommerceCartHTML(props: any): string {
  return `
    <div class="cart-container">
      <h2>Shopping Cart</h2>
      <div class="cart-items" id="cart-items">
        <!-- Dynamic cart items will be loaded here -->
      </div>
      <div class="cart-summary">
        <div class="cart-total">
          <span>Total: $<span id="cart-total">0.00</span></span>
        </div>
        <button class="checkout-button">Proceed to Checkout</button>
      </div>
    </div>
  `
}

function generateBlogListHTML(props: any): string {
  return `
    <div class="blog-container">
      <h2 class="blog-title">${props.title || 'Latest Posts'}</h2>
      <div class="blog-grid" id="blog-posts">
        <!-- Dynamic blog posts will be loaded here -->
      </div>
    </div>
  `
}

function generateNewsletterHTML(props: any): string {
  return `
    <div class="newsletter-container">
      <h2 class="newsletter-title">${props.title || 'Subscribe to Our Newsletter'}</h2>
      <p class="newsletter-description">${props.description || 'Get the latest updates and news delivered to your inbox.'}</p>
      <form class="newsletter-form" data-newsletter-id="${props.id || ''}">
        <div class="newsletter-input-group">
          <input type="email" name="email" placeholder="Enter your email" required>
          <button type="submit">Subscribe</button>
        </div>
      </form>
    </div>
  `
}

function generateSocialLinksHTML(props: any): string {
  const links = props.links || []
  return `
    <div class="social-links-container">
      ${links.map((link: any) => `
        <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-link ${link.platform}">
          <span class="social-icon">${link.icon || ''}</span>
          <span class="social-text">${link.text || link.platform}</span>
        </a>
      `).join('')}
    </div>
  `
}

function generateMapHTML(props: any): string {
  return `
    <div class="map-container">
      <div id="map-${props.id || 'default'}" class="map" data-lat="${props.latitude || 0}" data-lng="${props.longitude || 0}">
        <!-- Map will be loaded dynamically -->
      </div>
    </div>
  `
}

function generateVideoHTML(props: any): string {
  return `
    <div class="video-container">
      <video controls class="responsive-video">
        <source src="${props.src || ''}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      ${props.caption ? `<p class="video-caption">${props.caption}</p>` : ''}
    </div>
  `
}

function generateCountdownHTML(props: any): string {
  return `
    <div class="countdown-container">
      <h2 class="countdown-title">${props.title || 'Countdown Timer'}</h2>
      <div class="countdown-timer" data-target-date="${props.targetDate || ''}">
        <div class="countdown-item">
          <span class="countdown-number" id="days">0</span>
          <span class="countdown-label">Days</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number" id="hours">0</span>
          <span class="countdown-label">Hours</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number" id="minutes">0</span>
          <span class="countdown-label">Minutes</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number" id="seconds">0</span>
          <span class="countdown-label">Seconds</span>
        </div>
      </div>
    </div>
  `
}

function generateFAQHTML(props: any): string {
  const faqs = props.faqs || []
  return `
    <div class="faq-container">
      <h2 class="faq-title">${props.title || 'Frequently Asked Questions'}</h2>
      <div class="faq-list">
        ${faqs.map((faq: any, index: number) => `
          <div class="faq-item">
            <div class="faq-question" data-faq-index="${index}">
              <h3>${faq.question}</h3>
              <span class="faq-toggle">+</span>
            </div>
            <div class="faq-answer">
              <p>${faq.answer}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function generateTeamHTML(props: any): string {
  const members = props.members || []
  return `
    <div class="team-container">
      <h2 class="team-title">${props.title || 'Our Team'}</h2>
      <div class="team-grid">
        ${members.map((member: any) => `
          <div class="team-member">
            <img src="${member.photo || ''}" alt="${member.name}" class="member-photo">
            <h3 class="member-name">${member.name}</h3>
            <p class="member-role">${member.role}</p>
            <p class="member-bio">${member.bio || ''}</p>
            <div class="member-social">
              ${member.social ? Object.entries(member.social).map(([platform, url]: [string, any]) => `
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="social-link ${platform}">
                  ${platform}
                </a>
              `).join('') : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function generateStatsHTML(props: any): string {
  const stats = props.stats || []
  return `
    <div class="stats-container">
      <h2 class="stats-title">${props.title || 'Our Statistics'}</h2>
      <div class="stats-grid">
        ${stats.map((stat: any) => `
          <div class="stat-item">
            <div class="stat-number" data-target="${stat.value}">0</div>
            <div class="stat-label">${stat.label}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function generateTimelineHTML(props: any): string {
  const events = props.events || []
  return `
    <div class="timeline-container">
      <h2 class="timeline-title">${props.title || 'Timeline'}</h2>
      <div class="timeline">
        ${events.map((event: any, index: number) => `
          <div class="timeline-item ${index % 2 === 0 ? 'left' : 'right'}">
            <div class="timeline-content">
              <h3 class="timeline-date">${event.date}</h3>
              <h4 class="timeline-title">${event.title}</h4>
              <p class="timeline-description">${event.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function generateTabsHTML(props: any): string {
  const tabs = props.tabs || []
  return `
    <div class="tabs-container">
      <div class="tabs-header">
        ${tabs.map((tab: any, index: number) => `
          <button class="tab-button ${index === 0 ? 'active' : ''}" data-tab-index="${index}">
            ${tab.title}
          </button>
        `).join('')}
      </div>
      <div class="tabs-content">
        ${tabs.map((tab: any, index: number) => `
          <div class="tab-panel ${index === 0 ? 'active' : ''}" data-tab-index="${index}">
            ${tab.content}
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function generateAccordionHTML(props: any): string {
  const items = props.items || []
  return `
    <div class="accordion-container">
      <h2 class="accordion-title">${props.title || 'Accordion'}</h2>
      <div class="accordion-list">
        ${items.map((item: any, index: number) => `
          <div class="accordion-item">
            <div class="accordion-header" data-accordion-index="${index}">
              <h3>${item.title}</h3>
              <span class="accordion-toggle">+</span>
            </div>
            <div class="accordion-content">
              <p>${item.content}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}

function generateModalHTML(props: any): string {
  return `
    <div class="modal-container">
      <button class="modal-trigger" data-modal-id="${props.id || 'default'}">
        ${props.triggerText || 'Open Modal'}
      </button>
      <div class="modal-overlay" id="modal-${props.id || 'default'}">
        <div class="modal-content">
          <div class="modal-header">
            <h2>${props.title || 'Modal Title'}</h2>
            <button class="modal-close">&times;</button>
          </div>
          <div class="modal-body">
            ${props.content || ''}
          </div>
        </div>
      </div>
    </div>
  `
}

function generateCarouselHTML(props: any): string {
  const items = props.items || []
  return `
    <div class="carousel-container">
      <div class="carousel-wrapper">
        <div class="carousel-track" id="carousel-track">
          ${items.map((item: any, index: number) => `
            <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-slide-index="${index}">
              ${item.content}
            </div>
          `).join('')}
        </div>
        <button class="carousel-prev">&lt;</button>
        <button class="carousel-next">&gt;</button>
      </div>
      <div class="carousel-indicators">
        ${items.map((item: any, index: number) => `
          <button class="carousel-indicator ${index === 0 ? 'active' : ''}" data-slide-index="${index}"></button>
        `).join('')}
      </div>
    </div>
  `
}

function generateNavigationHTML(props: any): string {
  const links = props.links || []
  return `
    <nav class="navigation-container">
      <div class="nav-brand">
        <a href="${props.brandLink || '/'}">${props.brandText || 'Brand'}</a>
      </div>
      <div class="nav-menu">
        ${links.map((link: any) => `
          <a href="${link.url}" class="nav-link">${link.text}</a>
        `).join('')}
      </div>
      <button class="nav-toggle">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  `
}

function generateFooterHTML(props: any): string {
  return `
    <footer class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>${props.title || 'Company Name'}</h3>
          <p>${props.description || ''}</p>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            ${props.links ? props.links.map((link: any) => `
              <li><a href="${link.url}">${link.text}</a></li>
            `).join('') : ''}
          </ul>
        </div>
        <div class="footer-section">
          <h4>Contact</h4>
          <p>${props.contact || ''}</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} ${props.copyright || 'All rights reserved.'}</p>
      </div>
    </footer>
  `
}

// Component CSS generators
function generateHeroCSS(componentId: string, props: any): string {
  return `
#component-${componentId} .hero-section {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

#component-${componentId} .hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.3;
}

#component-${componentId} .hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  padding: 0 20px;
}

#component-${componentId} .hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

#component-${componentId} .hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

#component-${componentId} .hero-button {
  display: inline-block;
  padding: 12px 30px;
  background-color: #fff;
  color: #333;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: transform 0.3s ease;
}

#component-${componentId} .hero-button:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  #component-${componentId} .hero-title {
    font-size: 2rem;
  }
  
  #component-${componentId} .hero-subtitle {
    font-size: 1rem;
  }
}
`
}

function generateButtonCSS(componentId: string, props: any): string {
  return `
#component-${componentId} .button {
  display: inline-block;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

#component-${componentId} .button.primary {
  background-color: #3498db;
  color: white;
}

#component-${componentId} .button.secondary {
  background-color: #95a5a6;
  color: white;
}

#component-${componentId} .button.outline {
  background-color: transparent;
  color: #3498db;
  border: 2px solid #3498db;
}

#component-${componentId} .button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
`
}

function generateFormCSS(componentId: string, props: any): string {
  return `
#component-${componentId} .contact-form {
  max-width: 600px;
  margin: 0 auto;
}

#component-${componentId} .form-group {
  margin-bottom: 20px;
}

#component-${componentId} .form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

#component-${componentId} .form-group input,
#component-${componentId} .form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

#component-${componentId} .form-group input:focus,
#component-${componentId} .form-group textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
}

#component-${componentId} .submit-button {
  background-color: #3498db;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

#component-${componentId} .submit-button:hover {
  background-color: #2980b9;
}
`
}

function generateGalleryCSS(componentId: string, props: any): string {
  return `
#component-${componentId} .gallery-container {
  padding: 20px 0;
}

#component-${componentId} .gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

#component-${componentId} .gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

#component-${componentId} .gallery-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

#component-${componentId} .gallery-item:hover .gallery-image {
  transform: scale(1.05);
}

#component-${componentId} .gallery-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: white;
  padding: 20px;
  margin: 0;
}
`
}

function generateNavigationCSS(componentId: string, props: any): string {
  return `
#component-${componentId} .navigation-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

#component-${componentId} .nav-brand a {
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: #333;
}

#component-${componentId} .nav-menu {
  display: flex;
  gap: 2rem;
}

#component-${componentId} .nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;
}

#component-${componentId} .nav-link:hover {
  color: #3498db;
}

#component-${componentId} .nav-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
}

#component-${componentId} .nav-toggle span {
  width: 25px;
  height: 3px;
  background-color: #333;
  margin: 3px 0;
  transition: 0.3s;
}

@media (max-width: 768px) {
  #component-${componentId} .nav-menu {
    display: none;
  }
  
  #component-${componentId} .nav-toggle {
    display: flex;
  }
}
`
}

function generateFooterCSS(componentId: string, props: any): string {
  return `
#component-${componentId} .footer-container {
  background-color: #2c3e50;
  color: white;
  padding: 3rem 0 1rem;
}

#component-${componentId} .footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

#component-${componentId} .footer-section h3,
#component-${componentId} .footer-section h4 {
  margin-bottom: 1rem;
}

#component-${componentId} .footer-section ul {
  list-style: none;
  padding: 0;
}

#component-${componentId} .footer-section ul li {
  margin-bottom: 0.5rem;
}

#component-${componentId} .footer-section a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
}

#component-${componentId} .footer-section a:hover {
  color: white;
}

#component-${componentId} .footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #34495e;
  margin-top: 2rem;
}
`
}

// Component JavaScript generators
function generateFormJS(componentId: string, props: any): string {
  return `
  if (component${componentId}) {
    const form = component${componentId}.querySelector('.contact-form');
    if (form) {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
          const response = await API.post('/api/contact', data);
          alert('Message sent successfully!');
          form.reset();
        } catch (error) {
          alert('Failed to send message. Please try again.');
        }
      });
    }
  }
`
}

function generateGalleryJS(componentId: string, props: any): string {
  return `
  if (component${componentId}) {
    const galleryItems = component${componentId}.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
      item.addEventListener('click', function() {
        const img = this.querySelector('.gallery-image');
        if (img) {
          // Create lightbox or modal for image viewing
          const lightbox = document.createElement('div');
          lightbox.className = 'lightbox';
          lightbox.innerHTML = \`
            <div class="lightbox-content">
              <img src="\${img.src}" alt="\${img.alt}">
              <button class="lightbox-close">&times;</button>
            </div>
          \`;
          
          document.body.appendChild(lightbox);
          
          lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
              document.body.removeChild(lightbox);
            }
          });
        }
      });
    });
  }
`
}

function generateCarouselJS(componentId: string, props: any): string {
  return `
  if (component${componentId}) {
    const track = component${componentId}.querySelector('.carousel-track');
    const slides = component${componentId}.querySelectorAll('.carousel-slide');
    const prevBtn = component${componentId}.querySelector('.carousel-prev');
    const nextBtn = component${componentId}.querySelector('.carousel-next');
    const indicators = component${componentId}.querySelectorAll('.carousel-indicator');
    
    let currentSlide = 0;
    
    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
      
      indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
      });
    }
    
    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }
    
    function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    }
    
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
      });
    });
    
    // Auto-play
    setInterval(nextSlide, 5000);
  }
`
}

function generateModalJS(componentId: string, props: any): string {
  return `
  if (component${componentId}) {
    const trigger = component${componentId}.querySelector('.modal-trigger');
    const modal = component${componentId}.querySelector('.modal-overlay');
    const closeBtn = component${componentId}.querySelector('.modal-close');
    
    if (trigger && modal) {
      trigger.addEventListener('click', function() {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
      
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          modal.style.display = 'none';
          document.body.style.overflow = 'auto';
        });
      }
      
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.style.display = 'none';
          document.body.style.overflow = 'auto';
        }
      });
    }
  }
`
}

function generateTabsJS(componentId: string, props: any): string {
  return `
  if (component${componentId}) {
    const tabButtons = component${componentId}.querySelectorAll('.tab-button');
    const tabPanels = component${componentId}.querySelectorAll('.tab-panel');
    
    tabButtons.forEach((button, index) => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons and panels
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // Add active class to clicked button and corresponding panel
        button.classList.add('active');
        tabPanels[index].classList.add('active');
      });
    });
  }
`
}

function generateAccordionJS(componentId: string, props: any): string {
  return `
  if (component${componentId}) {
    const accordionHeaders = component${componentId}.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
      header.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const isOpen = content.style.display === 'block';
        
        // Close all accordion items
        accordionHeaders.forEach(h => {
          h.nextElementSibling.style.display = 'none';
          h.querySelector('.accordion-toggle').textContent = '+';
        });
        
        // Toggle current item
        if (!isOpen) {
          content.style.display = 'block';
          this.querySelector('.accordion-toggle').textContent = '-';
        }
      });
    });
  }
`
}

function generateCountdownJS(componentId: string, props: any): string {
  return `
  if (component${componentId}) {
    const countdownElement = component${componentId}.querySelector('.countdown-timer');
    const targetDate = countdownElement.dataset.targetDate;
    
    if (targetDate) {
      const target = new Date(targetDate).getTime();
      
      function updateCountdown() {
        const now = new Date().getTime();
        const distance = target - now;
        
        if (distance < 0) {
          countdownElement.innerHTML = '<div class="countdown-expired">Countdown Expired!</div>';
          return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const daysEl = countdownElement.querySelector('#days');
        const hoursEl = countdownElement.querySelector('#hours');
        const minutesEl = countdownElement.querySelector('#minutes');
        const secondsEl = countdownElement.querySelector('#seconds');
        
        if (daysEl) daysEl.textContent = days;
        if (hoursEl) hoursEl.textContent = hours;
        if (minutesEl) minutesEl.textContent = minutes;
        if (secondsEl) secondsEl.textContent = seconds;
      }
      
      updateCountdown();
      setInterval(updateCountdown, 1000);
    }
  }
`
}

function generateEcommerceCartJS(componentId: string, props: any): string {
  return `
  if (component${componentId}) {
    const cartItems = component${componentId}.querySelector('#cart-items');
    const cartTotal = component${componentId}.querySelector('#cart-total');
    
    function updateCart() {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      let total = 0;
      
      cartItems.innerHTML = '';
      
      cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = \`
          <div class="cart-item-image">
            <img src="\${item.image}" alt="\${item.name}">
          </div>
          <div class="cart-item-details">
            <h4>\${item.name}</h4>
            <p>\${item.price}</p>
            <div class="cart-item-quantity">
              <button onclick="updateQuantity('\${item.id}', -1)">-</button>
              <span>\${item.quantity}</span>
              <button onclick="updateQuantity('\${item.id}', 1)">+</button>
            </div>
          </div>
          <button onclick="removeFromCart('\${item.id}')">Remove</button>
        \`;
        
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
      });
      
      cartTotal.textContent = total.toFixed(2);
    }
    
    window.updateQuantity = function(id, change) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const item = cart.find(item => item.id === id);
      
      if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
          cart.splice(cart.indexOf(item), 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
      }
    };
    
    window.removeFromCart = function(id) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const filteredCart = cart.filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(filteredCart));
      updateCart();
    };
    
    updateCart();
  }
`
}

function generateNewsletterJS(componentId: string, props: any): string {
  return `
  if (component${componentId}) {
    const form = component${componentId}.querySelector('.newsletter-form');
    
    if (form) {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const email = formData.get('email');
        
        try {
          const response = await API.post('/api/newsletter/subscribe', { email });
          alert('Successfully subscribed to newsletter!');
          form.reset();
        } catch (error) {
          alert('Failed to subscribe. Please try again.');
        }
      });
    }
  }
`
}

// Dynamic component rendering functions
function renderEcommerceProduct(element: HTMLElement, data: any): void {
  // Update product details with real-time data
  const priceEl = element.querySelector('.current-price');
  if (priceEl && data.price) {
    priceEl.textContent = `$${data.price}`;
  }
  
  const stockEl = element.querySelector('.stock-status');
  if (stockEl && data.stock !== undefined) {
    stockEl.textContent = data.stock > 0 ? `In Stock (${data.stock})` : 'Out of Stock';
    stockEl.className = data.stock > 0 ? 'stock-status in-stock' : 'stock-status out-of-stock';
  }
}

function renderEcommerceCart(element: HTMLElement, data: any): void {
  // Update cart with server-side data
  const cartItems = element.querySelector('#cart-items');
  if (cartItems && data.items) {
    cartItems.innerHTML = data.items.map((item: any) => 
      `<div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>$${item.price}</p>
          <span>Qty: ${item.quantity}</span>
        </div>
      </div>`
    ).join('');
  }
}

function renderBlogList(element: HTMLElement, data: any): void {
  const blogPosts = element.querySelector('#blog-posts');
  if (blogPosts && data.posts) {
    blogPosts.innerHTML = data.posts.map((post: any) => `
      <article class="blog-post">
        <img src="${post.featuredImage}" alt="${post.title}">
        <div class="blog-post-content">
          <h3><a href="${post.slug}">${post.title}</a></h3>
          <p class="blog-excerpt">${post.excerpt}</p>
          <div class="blog-meta">
            <span class="blog-date">${new Date(post.publishedAt).toLocaleDateString()}</span>
            <span class="blog-author">By ${post.author}</span>
          </div>
        </div>
      </article>
    `).join('');
  }
}

function renderNewsletter(element: HTMLElement, data: any): void {
  // Update newsletter with current subscriber count
  const subscriberCount = element.querySelector('.subscriber-count');
  if (subscriberCount && data.subscriberCount) {
    subscriberCount.textContent = `${data.subscriberCount} subscribers`;
  }
}

function renderTestimonials(element: HTMLElement, data: any): void {
  // Update testimonials with fresh data
  const testimonialsGrid = element.querySelector('.testimonials-grid');
  if (testimonialsGrid && data.testimonials) {
    testimonialsGrid.innerHTML = data.testimonials.map((testimonial: any) => `
      <div class="testimonial-item">
        <div class="testimonial-content">
          <p>"${testimonial.content}"</p>
        </div>
        <div class="testimonial-author">
          <img src="${testimonial.avatar}" alt="${testimonial.name}">
          <div class="testimonial-info">
            <h4>${testimonial.name}</h4>
            <p>${testimonial.role}</p>
          </div>
        </div>
      </div>
    `).join('');
  }
}

function renderStats(element: HTMLElement, data: any): void {
  // Animate stats counters
  const statNumbers = element.querySelectorAll('.stat-number');
  statNumbers.forEach((statEl: Element) => {
    const target = parseInt(statEl.getAttribute('data-target') || '0');
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      statEl.textContent = Math.floor(current).toString();
    }, 16);
  });
}

function renderContact(element: HTMLElement, data: any): void {
  // Update contact form with dynamic fields
  const form = element.querySelector('.contact-form');
  if (form && data.fields) {
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach((group: Element, index: number) => {
      if (data.fields[index]) {
        const label = group.querySelector('label');
        const input = group.querySelector('input, textarea');
        
        if (label) label.textContent = data.fields[index].label;
        if (input) {
          input.setAttribute('name', data.fields[index].name);
          input.setAttribute('type', data.fields[index].type || 'text');
        }
      }
    });
  }
}

// Utility functions
function isDynamicComponent(type: string): boolean {
  const dynamicTypes = [
    'ecommerce-product',
    'ecommerce-cart',
    'blog-list',
    'newsletter',
    'testimonials',
    'stats',
    'contact',
    'countdown'
  ]
  return dynamicTypes.includes(type)
}

function getAPIEndpoint(type: string): string {
  const endpoints: Record<string, string> = {
    'ecommerce-product': '/api/products',
    'ecommerce-cart': '/api/cart',
    'blog-list': '/api/blog/posts',
    'newsletter': '/api/newsletter',
    'testimonials': '/api/testimonials',
    'stats': '/api/stats',
    'contact': '/api/contact',
    'countdown': '/api/countdown'
  }
  return endpoints[type] || ''
}

function getCacheStrategy(type: string): 'static' | 'dynamic' | 'hybrid' {
  const strategies: Record<string, 'static' | 'dynamic' | 'hybrid'> = {
    'ecommerce-product': 'dynamic',
    'ecommerce-cart': 'dynamic',
    'blog-list': 'hybrid',
    'newsletter': 'hybrid',
    'testimonials': 'hybrid',
    'stats': 'dynamic',
    'contact': 'static',
    'countdown': 'dynamic'
  }
  return strategies[type] || 'static'
}

function getHydrationStrategy(type: string): 'immediate' | 'lazy' | 'viewport' {
  const strategies: Record<string, 'immediate' | 'lazy' | 'viewport'> = {
    'ecommerce-cart': 'immediate',
    'contact': 'immediate',
    'newsletter': 'viewport',
    'blog-list': 'viewport',
    'testimonials': 'lazy',
    'stats': 'lazy',
    'countdown': 'immediate'
  }
  return strategies[type] || 'lazy'
}

function getPreloadAssets(component: ComponentData): string[] {
  const assets: string[] = []
  
  // Preload critical images
  if (component.type === 'hero' && component.props?.backgroundImage) {
    assets.push(component.props.backgroundImage)
  }
  
  // Preload fonts
  if (component.props?.fontFamily) {
    assets.push(`/fonts/${component.props.fontFamily}.woff2`)
  }
  
  return assets
}

function getDeferAssets(component: ComponentData): string[] {
  const assets: string[] = []
  
  // Defer non-critical images
  if (component.type === 'gallery') {
    const images = component.props?.images || []
    assets.push(...images.map((img: any) => img.src).slice(3)) // Skip first 3 images
  }
  
  return assets
}

// Utility functions for enhanced features
function generateCriticalCSS(page: Page, components: ComponentData[]): string {
  return `
/* Critical CSS for above-the-fold content */
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
.skip-link { position: absolute; top: -40px; left: 6px; background: #000; color: #fff; padding: 8px; text-decoration: none; z-index: 1000; }
.skip-link:focus { top: 6px; }
#app { min-height: 100vh; }
main { min-height: 100vh; }
/* Critical component styles */
.hero-section { min-height: 60vh; display: flex; align-items: center; justify-content: center; }
.navigation-container { position: sticky; top: 0; z-index: 100; }
`
}

function generatePWAManifest(website: Website): any {
  return {
    name: website.name,
    short_name: website.name.substring(0, 12),
    description: website.description || '',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    categories: ['business', 'productivity'],
    lang: website.language || 'en'
  }
}

function generateSitemap(website: Website, pages: GeneratedPage[]): Array<{ url: string; lastmod: string; priority: number }> {
  const baseUrl = config.server.clientUrl
  return pages.map(page => ({
    url: `${baseUrl}${page.path}`,
    lastmod: new Date().toISOString(),
    priority: page.path === '/' ? 1.0 : 0.8
  }))
}

function generateSitemapXML(sitemap: Array<{ url: string; lastmod: string; priority: number }>): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map(item => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`
}

function generateRobotsTxt(website: Website): string {
  const baseUrl = config.server.clientUrl
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1`
}

function generateDynamicHydrationJS(dynamicComponents: DynamicComponent[]): string {
  return `
// Dynamic component hydration functions
function hydrateDynamicComponents() {
  const components = ${JSON.stringify(dynamicComponents)};
  
  components.forEach(component => {
    const element = document.getElementById(\`component-\${component.id}\`);
    if (!element) return;
    
    element.classList.add('dynamic-component', 'loading');
    
    loadDynamicComponent(component)
      .then(data => {
        element.classList.remove('loading');
        element.classList.add('loaded');
        renderDynamicComponent(element, component, data);
      })
      .catch(error => {
        console.error(\`Failed to load dynamic component \${component.id}:\`, error);
        element.classList.remove('loading');
        element.classList.add('error');
        element.innerHTML = \`<div class="error">Failed to load component: \${error.message}</div>\`;
      });
  });
}

// Load data for dynamic component
async function loadDynamicComponent(component) {
  if (!component.apiEndpoint) {
    return component.props;
  }
  
  try {
    const data = await API.get(component.apiEndpoint);
    return { ...component.props, ...data };
  } catch (error) {
    console.error(\`Failed to fetch data for component \${component.id}:\`, error);
    return component.props;
  }
}

// Render dynamic component with data
function renderDynamicComponent(element, component, data) {
  switch (component.type) {
    case 'ecommerce-product':
      renderEcommerceProduct(element, data);
      break;
    case 'ecommerce-cart':
      renderEcommerceCart(element, data);
      break;
    case 'blog-list':
      renderBlogList(element, data);
      break;
    case 'newsletter':
      renderNewsletter(element, data);
      break;
    case 'testimonials':
      renderTestimonials(element, data);
      break;
    case 'stats':
      renderStats(element, data);
      break;
    case 'contact':
      renderContact(element, data);
      break;
    default:
      console.warn(\`Unknown dynamic component type: \${component.type}\`);
  }
}

// Dynamic component rendering functions
function renderEcommerceProduct(element, data) {
  const priceEl = element.querySelector('.current-price');
  if (priceEl && data.price) {
    priceEl.textContent = \`$\${data.price}\`;
  }
  
  const stockEl = element.querySelector('.stock-status');
  if (stockEl && data.stock !== undefined) {
    stockEl.textContent = data.stock > 0 ? \`In Stock (\${data.stock})\` : 'Out of Stock';
    stockEl.className = data.stock > 0 ? 'stock-status in-stock' : 'stock-status out-of-stock';
  }
}

function renderEcommerceCart(element, data) {
  const cartItems = element.querySelector('#cart-items');
  if (cartItems && data.items) {
    cartItems.innerHTML = data.items.map(item => 
      \`<div class="cart-item">
        <img src="\${item.image}" alt="\${item.name}">
        <div class="cart-item-details">
          <h4>\${item.name}</h4>
          <p>$\${item.price}</p>
          <span>Qty: \${item.quantity}</span>
        </div>
      </div>\`
    ).join('');
  }
}

function renderBlogList(element, data) {
  const blogPosts = element.querySelector('#blog-posts');
  if (blogPosts && data.posts) {
    blogPosts.innerHTML = data.posts.map(post => \`
      <article class="blog-post">
        <img src="\${post.featuredImage}" alt="\${post.title}">
        <div class="blog-post-content">
          <h3><a href="\${post.slug}">\${post.title}</a></h3>
          <p class="blog-excerpt">\${post.excerpt}</p>
          <div class="blog-meta">
            <span class="blog-date">\${new Date(post.publishedAt).toLocaleDateString()}</span>
            <span class="blog-author">By \${post.author}</span>
          </div>
        </div>
      </article>
    \`).join('');
  }
}

function renderNewsletter(element, data) {
  const subscriberCount = element.querySelector('.subscriber-count');
  if (subscriberCount && data.subscriberCount) {
    subscriberCount.textContent = \`\${data.subscriberCount} subscribers\`;
  }
}

function renderTestimonials(element, data) {
  const testimonialsGrid = element.querySelector('.testimonials-grid');
  if (testimonialsGrid && data.testimonials) {
    testimonialsGrid.innerHTML = data.testimonials.map(testimonial => \`
      <div class="testimonial-item">
        <div class="testimonial-content">
          <p>"\${testimonial.content}"</p>
        </div>
        <div class="testimonial-author">
          <img src="\${testimonial.avatar}" alt="\${testimonial.name}">
          <div class="testimonial-info">
            <h4>\${testimonial.name}</h4>
            <p>\${testimonial.role}</p>
          </div>
        </div>
      </div>
    \`).join('');
  }
}

function renderStats(element, data) {
  const statNumbers = element.querySelectorAll('.stat-number');
  statNumbers.forEach(statEl => {
    const target = parseInt(statEl.getAttribute('data-target') || '0');
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      statEl.textContent = Math.floor(current).toString();
    }, 16);
  });
}

function renderContact(element, data) {
  const form = element.querySelector('.contact-form');
  if (form && data.fields) {
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
      if (data.fields[index]) {
        const label = group.querySelector('label');
        const input = group.querySelector('input, textarea');
        
        if (label) label.textContent = data.fields[index].label;
        if (input) {
          input.setAttribute('name', data.fields[index].name);
          input.setAttribute('type', data.fields[index].type || 'text');
        }
      }
    });
  }
}
`
}