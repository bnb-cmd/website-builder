export interface ComponentNode {
  id: string
  type: string
  props: Record<string, any>
  children?: ComponentNode[]
  parent?: string
  position?: { x: number; y: number }
  size?: { width: number; height: number }
}

export interface PageSchema {
  id: string
  name: string
  components: ComponentNode[]
  metadata: {
    title: string
    description: string
    keywords: string[]
    createdAt: string
    updatedAt: string
  }
  settings: {
    theme: string
    layout: string
    responsive: boolean
  }
}

export interface ComponentOperation {
  type: 'add' | 'remove' | 'update' | 'move' | 'duplicate'
  componentId: string
  data?: any
  position?: { x: number; y: number }
  parentId?: string
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
