export type ElementType = 
  // Basic Elements
  | 'text'
  | 'heading' 
  | 'image'
  | 'button'
  | 'container'
  | 'form'
  | 'video'
  | 'gallery'
  | 'map'
  | 'divider'
  | 'spacer'
  | 'icon'
  | 'social'
  
  // Layout Elements
  | 'grid'
  | 'flexbox'
  | 'section'
  | 'column'
  | 'row'
  
  // Content Elements
  | 'testimonial'
  | 'pricing'
  | 'cta'
  | 'newsletter'
  | 'countdown'
  | 'accordion'
  | 'tabs'
  | 'slider'
  | 'carousel'
  | 'hero'
  | 'features'
  | 'about'
  | 'contact'
  | 'footer'
  | 'navbar'
  | 'sidebar'
  
  // Advanced Elements
  | 'timeline'
  | 'progress'
  | 'stats'
  | 'team'
  | 'faq'
  | 'blog'
  | 'portfolio'
  | 'services'
  | 'clients'
  | 'partners'
  | 'awards'
  | 'banner'
  | 'popup'
  | 'notification'
  | 'search'
  | 'filter'
  | 'table'
  | 'chart'
  | 'code'
  | 'embed'
  | 'audio'
  | 'pdf'
  | 'download'
  | 'breadcrumb'
  | 'pagination'
  | 'comments'
  | 'rating'
  | 'share'
  | 'login'
  | 'register'
  | 'checkout'
  | 'cart'
  | 'wishlist'
  | 'compare'
  | 'quickview'

export interface Element {
  id: string
  type: ElementType
  props: Record<string, any>
  children: Element[]
  style: React.CSSProperties
  position: {
    x: number
    y: number
  }
  responsive?: {
    desktop?: React.CSSProperties
    tablet?: React.CSSProperties
    mobile?: React.CSSProperties
  }
}

export interface WebsiteData {
  id: string
  name: string
  elements: Element[]
  settings: WebsiteSettings
  pages: Page[]
  theme: Theme
}

export interface WebsiteSettings {
  title: string
  description: string
  favicon: string
  language: 'en' | 'ur'
  rtl: boolean
  customCSS: string
  customJS: string
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
    ogImage: string
  }
  analytics: {
    googleAnalytics?: string
    facebookPixel?: string
    customCode?: string
  }
}

export interface Page {
  id: string
  name: string
  slug: string
  elements: Element[]
  isHome: boolean
  seo: {
    title: string
    description: string
    keywords: string[]
  }
}

export interface Theme {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    muted: string
  }
  fonts: {
    heading: string
    body: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  borderRadius: string
  shadows: {
    sm: string
    md: string
    lg: string
  }
}

export type ViewMode = 'desktop' | 'tablet' | 'mobile'

export interface DropZone {
  id: string
  accepts: ElementType[]
  position: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface ComponentCategory {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  elements: ElementDefinition[]
}

export interface ElementDefinition {
  type: ElementType
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  defaultProps: Record<string, any>
  category: string
  isPremium?: boolean
}

export interface StyleProperty {
  key: string
  label: string
  type: 'text' | 'number' | 'color' | 'select' | 'slider' | 'toggle' | 'spacing' | 'dimension'
  options?: Array<{ label: string; value: string }>
  min?: number
  max?: number
  step?: number
  unit?: string
}

export interface PropertyGroup {
  id: string
  label: string
  properties: StyleProperty[]
  collapsible?: boolean
  defaultOpen?: boolean
}

export interface EditorHistory {
  past: Element[][]
  present: Element[]
  future: Element[][]
}

export interface Breakpoint {
  name: ViewMode
  width: number
  icon: React.ComponentType<{ className?: string }>
}

export interface TemplateBlock {
  id: string
  name: string
  category: string
  elements: Element[]
  preview: string
  isPremium?: boolean
}

// AI Generation Types
export interface AIGenerationRequest {
  type: 'content' | 'layout' | 'style' | 'seo'
  prompt: string
  context: {
    businessType?: string
    industry?: string
    language: 'en' | 'ur'
    tone?: string
    target?: string
  }
}

export interface AIGenerationResponse {
  success: boolean
  data: any
  suggestions?: string[]
  alternatives?: any[]
}

// Form Types
export interface FormField {
  id: string
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file'
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  validation?: {
    pattern?: string
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
  }
}

export interface FormData {
  fields: FormField[]
  submitUrl?: string
  successMessage: string
  errorMessage: string
  emailNotification?: {
    to: string
    subject: string
    template: string
  }
}

// E-commerce Types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  comparePrice?: number
  sku?: string
  images: string[]
  variants?: ProductVariant[]
  inventory: {
    track: boolean
    quantity: number
    allowBackorder: boolean
  }
  seo: {
    title: string
    description: string
    handle: string
  }
  status: 'active' | 'draft' | 'archived'
}

export interface ProductVariant {
  id: string
  title: string
  price: number
  sku?: string
  inventory: number
  options: Record<string, string>
}

export interface ShoppingCart {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: string
}

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  price: number
  title: string
  image?: string
}

// Animation Types
export interface Animation {
  type: 'fadeIn' | 'slideIn' | 'scaleIn' | 'rotateIn' | 'bounceIn' | 'none'
  duration: number
  delay: number
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'
  trigger: 'onLoad' | 'onScroll' | 'onHover' | 'onClick'
}

// Integration Types
export interface Integration {
  id: string
  name: string
  type: 'analytics' | 'marketing' | 'payment' | 'shipping' | 'social' | 'other'
  config: Record<string, any>
  enabled: boolean
}

// Export Types
export interface ExportOptions {
  format: 'html' | 'react' | 'vue' | 'wordpress'
  includeAssets: boolean
  minify: boolean
  responsive: boolean
  seo: boolean
}

export interface ExportResult {
  files: Array<{
    path: string
    content: string
    type: string
  }>
  assets: Array<{
    url: string
    local: string
    type: string
  }>
}
