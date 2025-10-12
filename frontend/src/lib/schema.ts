// Enhanced Page Schema with Responsive Breakpoints and Component Layout Structure
// Version 2.0 - Cloudflare-native with Urdu/RTL support

export interface StyleObject {
  // Layout properties
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  top?: number | string
  left?: number | string
  right?: number | string
  bottom?: number | string
  zIndex?: number
  
  // Box model
  width?: number | string
  height?: number | string
  minWidth?: number | string
  minHeight?: number | string
  maxWidth?: number | string
  maxHeight?: number | string
  margin?: number | string
  marginTop?: number | string
  marginRight?: number | string
  marginBottom?: number | string
  marginLeft?: number | string
  padding?: number | string
  paddingTop?: number | string
  paddingRight?: number | string
  paddingBottom?: number | string
  paddingLeft?: number | string
  
  // Flexbox
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'none'
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch'
  flex?: number | string
  flexGrow?: number
  flexShrink?: number
  flexBasis?: number | string
  
  // Grid
  gridTemplateColumns?: string
  gridTemplateRows?: string
  gridColumn?: string
  gridRow?: string
  gridArea?: string
  gap?: number | string
  columnGap?: number | string
  rowGap?: number | string
  
  // Visual properties
  backgroundColor?: string
  backgroundImage?: string
  backgroundSize?: 'cover' | 'contain' | 'auto' | string
  backgroundPosition?: string
  backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y'
  border?: string
  borderTop?: string
  borderRight?: string
  borderBottom?: string
  borderLeft?: string
  borderRadius?: number | string
  boxShadow?: string
  
  // Typography
  fontFamily?: string
  fontSize?: number | string
  fontWeight?: number | string
  lineHeight?: number | string
  letterSpacing?: number | string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  textDecoration?: 'none' | 'underline' | 'line-through' | 'overline'
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  color?: string
  
  // RTL Support
  direction?: 'ltr' | 'rtl'
  textAlignRTL?: 'left' | 'center' | 'right' | 'justify'
  
  // Urdu-specific properties
  fontUrdu?: boolean
  nastaliq?: boolean
  
  // Transform
  transform?: string
  transformOrigin?: string
  
  // Transition
  transition?: string
  transitionDuration?: string
  transitionTimingFunction?: string
  transitionDelay?: string
  
  // Animation
  animation?: string
  animationDuration?: string
  animationTimingFunction?: string
  animationDelay?: string
  animationIterationCount?: number | 'infinite'
  animationDirection?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  animationFillMode?: 'none' | 'forwards' | 'backwards' | 'both'
  
  // Opacity
  opacity?: number
  
  // Overflow
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto'
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto'
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto'
  
  // Cursor
  cursor?: 'default' | 'pointer' | 'text' | 'move' | 'grab' | 'grabbing' | 'not-allowed' | 'help'
  
  // User select
  userSelect?: 'none' | 'auto' | 'text' | 'all'
  
  // Pointer events
  pointerEvents?: 'auto' | 'none'
}

export interface LayoutObject {
  x: number
  y: number
  width: number
  height: number
  zIndex?: number
  rotation?: number
  scale?: number
  locked?: boolean
  visible?: boolean
}

export interface ResponsiveStyles {
  default: StyleObject
  tablet?: Partial<StyleObject>
  mobile?: Partial<StyleObject>
}

export interface ResponsiveLayout {
  default: LayoutObject
  tablet?: Partial<LayoutObject>
  mobile?: Partial<LayoutObject>
}

export interface ComponentNode {
  id: string
  type: string
  props: Record<string, any>
  layout: ResponsiveLayout
  styles: ResponsiveStyles
  children?: ComponentNode[]
  groupId?: string
  locked?: boolean
  visible?: boolean
  
  // Urdu/RTL specific
  language?: 'ENGLISH' | 'URDU' | 'اردو'
  direction?: 'ltr' | 'rtl'
  
  // Metadata
  metadata?: {
    createdAt: string
    updatedAt: string
    createdBy?: string
    version?: number
  }
}

export interface PageSchema {
  id: string
  name: string
  slug: string
  schemaVersion: number
  components: ComponentNode[]
  
  // Page-level settings
  settings: {
    language: 'ENGLISH' | 'URDU' | 'اردو'
    direction: 'ltr' | 'rtl'
    theme?: 'light' | 'dark' | 'auto'
    customCSS?: string
    customJS?: string
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string[]
    ogImage?: string
    favicon?: string
  }
  
  // Responsive settings
  responsive: {
    breakpoints: {
      tablet: number
      mobile: number
    }
    defaultDevice: 'desktop' | 'tablet' | 'mobile'
  }
  
  // Metadata
  metadata: {
    createdAt: string
    updatedAt: string
    author: string
    version: number
    lastModifiedBy?: string
  }
  
  // Publishing
  publishing?: {
    publishedAt?: string
    publishedBy?: string
    publishedUrl?: string
    status: 'draft' | 'published' | 'archived'
  }
}

export interface WebsiteSchema {
  id: string
  name: string
  description?: string
  schemaVersion: number
  pages: PageSchema[]
  
  // Global settings
  settings: {
    language: 'ENGLISH' | 'URDU' | 'اردو'
    direction: 'ltr' | 'rtl'
    theme: 'light' | 'dark' | 'auto'
    customCSS?: string
    customJS?: string
    globalMetaTitle?: string
    globalMetaDescription?: string
    globalMetaKeywords?: string[]
    favicon?: string
    ogImage?: string
  }
  
  // Domain settings
  domain: {
    subdomain?: string
    customDomain?: string
    sslEnabled?: boolean
  }
  
  // Business settings
  business: {
    type?: string
    industry?: string
    location?: string
    contactInfo?: {
      email?: string
      phone?: string
      address?: string
    }
  }
  
  // Publishing
  publishing: {
    status: 'draft' | 'published' | 'archived'
    publishedAt?: string
    publishedUrl?: string
    lastPublishedAt?: string
    lastPublishedBy?: string
  }
  
  // Metadata
  metadata: {
    createdAt: string
    updatedAt: string
    createdBy: string
    version: number
  }
}

// Utility types for component operations
export interface ComponentOperation {
  type: 'add' | 'remove' | 'update' | 'move' | 'duplicate' | 'group' | 'ungroup'
  componentId: string
  data?: any
  targetIndex?: number
  targetParentId?: string
}

export interface HistoryState {
  id: string
  timestamp: number
  operation: ComponentOperation
  components: ComponentNode[]
  pageSchema: PageSchema
}

export interface VersionInfo {
  id: string
  versionNumber: number
  pageId: string
  content: string
  changes: string
  createdBy: string
  createdAt: string
}

// Migration utilities
export interface SchemaMigration {
  fromVersion: number
  toVersion: number
  migrate: (schema: any) => any
}

// Default breakpoints
export const DEFAULT_BREAKPOINTS = {
  tablet: 768,
  mobile: 480
}

// Default component layout
export const DEFAULT_COMPONENT_LAYOUT: LayoutObject = {
  x: 0,
  y: 0,
  width: 100,
  height: 50,
  zIndex: 1,
  rotation: 0,
  scale: 1,
  locked: false,
  visible: true
}

// Default component styles
export const DEFAULT_COMPONENT_STYLES: StyleObject = {
  position: 'relative',
  display: 'block',
  width: '100%',
  height: 'auto',
  margin: 0,
  padding: 0,
  backgroundColor: 'transparent',
  color: '#000000',
  fontSize: '16px',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  textAlign: 'left',
  direction: 'ltr'
}

// Schema version
export const CURRENT_SCHEMA_VERSION = 2

// Migration functions
export const schemaMigrations: SchemaMigration[] = [
  {
    fromVersion: 1,
    toVersion: 2,
    migrate: (schema: any) => {
      // Migrate from v1 to v2
      if (schema.schemaVersion === 1) {
        return {
          ...schema,
          schemaVersion: 2,
          components: schema.components?.map((component: any) => ({
            ...component,
            layout: {
              default: component.layout || DEFAULT_COMPONENT_LAYOUT,
              tablet: component.layout?.tablet,
              mobile: component.layout?.mobile
            },
            styles: {
              default: component.styles || DEFAULT_COMPONENT_STYLES,
              tablet: component.styles?.tablet,
              mobile: component.styles?.mobile
            },
            language: component.language || 'ENGLISH',
            direction: component.direction || 'ltr'
          })) || [],
          settings: {
            ...schema.settings,
            language: schema.settings?.language || 'ENGLISH',
            direction: schema.settings?.direction || 'ltr'
          },
          responsive: {
            breakpoints: DEFAULT_BREAKPOINTS,
            defaultDevice: 'desktop'
          }
        }
      }
      return schema
    }
  }
]

// Helper functions
export function migrateSchema(schema: any): PageSchema {
  let currentSchema = schema
  
  for (const migration of schemaMigrations) {
    if (currentSchema.schemaVersion === migration.fromVersion) {
      currentSchema = migration.migrate(currentSchema)
    }
  }
  
  return currentSchema as PageSchema
}

export function createEmptyPageSchema(id: string, name: string, author: string): PageSchema {
  return {
    id,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    schemaVersion: CURRENT_SCHEMA_VERSION,
    components: [],
    settings: {
      language: 'ENGLISH',
      direction: 'ltr',
      theme: 'light'
    },
    responsive: {
      breakpoints: DEFAULT_BREAKPOINTS,
      defaultDevice: 'desktop'
    },
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author,
      version: 1
    }
  }
}

export function createEmptyWebsiteSchema(id: string, name: string, author: string): WebsiteSchema {
  return {
    id,
    name,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    pages: [],
    settings: {
      language: 'ENGLISH',
      direction: 'ltr',
      theme: 'light'
    },
    domain: {},
    business: {},
    publishing: {
      status: 'draft'
    },
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: author,
      version: 1
    }
  }
}
