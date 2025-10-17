import { ComponentConfig, ComponentMetadata, ComponentCategory } from '@/lib/component-config'

// Registry for all website components
const componentRegistry = new Map<string, ComponentMetadata>()

// Categories for organizing components
export const componentCategories: ComponentCategory[] = [
  'basic',
  'layout', 
  'content',
  'business',
  'ecommerce',
  'media',
  'interactive'
]

// Register a component
export function registerComponent(config: ComponentConfig, component: React.ComponentType<any>) {
  componentRegistry.set(config.id, { config, component })
}

// Get component metadata by ID
export function getComponentMetadata(id: string): ComponentMetadata | undefined {
  return componentRegistry.get(id)
}

// Get all components for a category
export function getComponentsByCategory(category: ComponentCategory): ComponentMetadata[] {
  return Array.from(componentRegistry.values()).filter(meta => meta.config.category === category)
}

// Get all components
export function getAllComponents(): ComponentMetadata[] {
  return Array.from(componentRegistry.values())
}

// Get component config by ID
export function getComponentConfig(id: string): ComponentConfig | undefined {
  return componentRegistry.get(id)?.config
}

// Get component by ID
export function getComponent(id: string): React.ComponentType<any> | undefined {
  return componentRegistry.get(id)?.component
}

// Get component registry (for debugging/inspection)
export function getComponentRegistry(): Map<string, ComponentMetadata> {
  return componentRegistry
}

// Get components organized by category
export function getComponentsByCategoryMap(): Record<ComponentCategory, ComponentMetadata[]> {
  const result: Record<string, ComponentMetadata[]> = {}
  
  componentCategories.forEach(category => {
    result[category] = getComponentsByCategory(category)
  })
  
  return result as Record<ComponentCategory, ComponentMetadata[]>
}

// Get default props for a component
export function getDefaultProps(id: string): Record<string, any> {
  const config = getComponentConfig(id)
  return config?.defaultProps || {}
}

// Get default size for a component
export function getDefaultSize(id: string): { width: number; height: number } {
  const config = getComponentConfig(id)
  return config?.defaultSize || { width: 200, height: 100 }
}

// Get editable fields for a component
export function getEditableFields(id: string): string[] {
  const config = getComponentConfig(id)
  return config?.editableFields || []
}
