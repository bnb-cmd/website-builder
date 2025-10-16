// Import types from lib/schema.ts to ensure consistency
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
  
  // Display
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'none'
  visibility?: 'visible' | 'hidden' | 'collapse'
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto'
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto'
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto'
  
  // Flexbox
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch'
  flex?: number | string
  flexGrow?: number
  flexShrink?: number
  flexBasis?: number | string
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
  
  // Grid
  gridTemplateColumns?: string
  gridTemplateRows?: string
  gridTemplateAreas?: string
  gridColumn?: string
  gridRow?: string
  gridArea?: string
  gap?: number | string
  rowGap?: number | string
  columnGap?: number | string
  justifyItems?: 'start' | 'end' | 'center' | 'stretch'
  placeItems?: string
  placeContent?: string
  
  // Typography
  fontFamily?: string
  fontSize?: number | string
  fontWeight?: number | string
  fontStyle?: 'normal' | 'italic' | 'oblique'
  lineHeight?: number | string
  letterSpacing?: number | string
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  textDecoration?: 'none' | 'underline' | 'overline' | 'line-through'
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  color?: string
  backgroundColor?: string
  
  // Border
  border?: string
  borderWidth?: number | string
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset'
  borderColor?: string
  borderTop?: string
  borderRight?: string
  borderBottom?: string
  borderLeft?: string
  borderRadius?: number | string
  borderTopLeftRadius?: number | string
  borderTopRightRadius?: number | string
  borderBottomLeftRadius?: number | string
  borderBottomRightRadius?: number | string
  
  // Shadow
  boxShadow?: string
  textShadow?: string
  
  // Transform
  transform?: string
  transformOrigin?: string
  transition?: string
  
  // Urdu/RTL specific
  direction?: 'ltr' | 'rtl'
  unicodeBidi?: 'normal' | 'embed' | 'bidi-override'
}

export interface LayoutObject {
  x: number
  y: number
  width: number
  height: number
  zIndex?: number
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
}

export interface ComponentOperation {
  type: 'add' | 'remove' | 'update' | 'move' | 'duplicate'
  componentId: string
  data?: any
  position?: { x: number; y: number }
  parentId?: string
  targetIndex?: number
}

export interface PatchOperation {
  type: 'add' | 'remove' | 'replace' | 'move'
  path: string
  value?: any
  from?: string
  to?: string
}

export interface EditorState {
  currentPage: PageSchema
  selectedComponent?: string
  clipboard?: ComponentNode
  history: {
    canUndo: boolean
    canRedo: boolean
  }
  viewport: {
    zoom: number
    pan: { x: number; y: number }
  }
}

export interface ComponentDefinition {
  type: string
  name: string
  category: string
  icon: string
  description: string
  defaultProps: Record<string, any>
  schema: {
    properties: Record<string, any>
    required?: string[]
  }
  preview?: string
  examples?: ComponentNode[]
}
