import React from 'react'
import { getComponent, getComponentConfig } from './registry'
import { WebsiteComponentProps, DeviceMode } from '@/lib/component-config'

interface ComponentRendererProps {
  componentType: string
  props: Record<string, any>
  deviceMode?: DeviceMode
  isEditing?: boolean
  isPreviewMode?: boolean
  editingComponent?: string | null
  editingValue?: string
  setEditingValue?: (value: string) => void
  onTextEditSubmit?: () => void
  onTextEditCancel?: () => void
  onTextDoubleClick?: (e: React.MouseEvent) => void
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  componentType,
  props,
  deviceMode = 'desktop',
  isEditing = false,
  isPreviewMode = false,
  editingComponent,
  editingValue = '',
  setEditingValue,
  onTextEditSubmit,
  onTextEditCancel,
  onTextDoubleClick
}) => {
  const Component = getComponent(componentType)
  
  if (!Component) {
    console.warn(`Component ${componentType} not found in registry`)
    return (
      <div className="w-full h-full border-2 border-dashed border-red-500 rounded-lg flex items-center justify-center bg-red-50">
        <p className="text-red-600 text-sm">Component not found: {componentType}</p>
      </div>
    )
  }

  // Prepare props for the component
  const componentProps: WebsiteComponentProps = {
    ...props,
    deviceMode,
    isEditing: isEditing && editingComponent === componentType,
    onTextEdit: setEditingValue,
    onTextEditSubmit,
    onTextEditCancel,
    onTextDoubleClick
  }

  // Handle inline text editing for text-based components
  if (isEditing && editingComponent === componentType && (componentType === 'heading' || componentType === 'text' || componentType === 'button')) {
    return (
      <textarea
        className="w-full h-full bg-white border border-primary p-2 resize-none focus:outline-none"
        value={editingValue}
        onChange={(e) => setEditingValue?.(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onTextEditSubmit?.()
          } else if (e.key === 'Escape') {
            onTextEditCancel?.()
          }
        }}
        onBlur={onTextEditSubmit}
        autoFocus
      />
    )
  }

  try {
    return <Component {...componentProps} />
  } catch (error) {
    console.error(`Error rendering component ${componentType}:`, error)
    return (
      <div className="w-full h-full border-2 border-dashed border-red-500 rounded-lg flex items-center justify-center bg-red-50">
        <p className="text-red-600 text-sm">Error rendering {componentType}</p>
      </div>
    )
  }
}

// Utility function to get responsive dimensions
export const getResponsiveDimensions = (
  component: { size?: { width: number; height: number }; position?: { x: number; y: number } },
  deviceMode: DeviceMode,
  deviceDimensions: { width: number; height: number }
) => {
  const baseWidth = component.size?.width || 200
  const baseHeight = component.size?.height || 100
  const baseX = component.position?.x || 0
  const baseY = component.position?.y || 0

  switch (deviceMode) {
    case 'mobile':
      // Mobile: Scale down components significantly (60% of original size)
      const mobileScale = 0.6
      const scaledWidth = baseWidth * mobileScale
      const scaledHeight = baseHeight * mobileScale
      return {
        width: Math.min(scaledWidth, deviceDimensions.width - 32), // Account for padding
        height: Math.min(scaledHeight, deviceDimensions.height - 32),
        x: Math.min(baseX * mobileScale, deviceDimensions.width - scaledWidth),
        y: Math.min(baseY * mobileScale, deviceDimensions.height - scaledHeight)
      }
    case 'tablet':
      // Tablet: Moderate scaling (80% of original size)
      const tabletScale = 0.8
      const tabletWidth = baseWidth * tabletScale
      const tabletHeight = baseHeight * tabletScale
      return {
        width: Math.min(tabletWidth, deviceDimensions.width - 32),
        height: Math.min(tabletHeight, deviceDimensions.height - 32),
        x: Math.min(baseX * tabletScale, deviceDimensions.width - tabletWidth),
        y: Math.min(baseY * tabletScale, deviceDimensions.height - tabletHeight)
      }
    default:
      // Desktop: Use original dimensions
      return {
        width: baseWidth,
        height: baseHeight,
        x: baseX,
        y: baseY
      }
  }
}

// Utility function to get responsive text size
export const getResponsiveTextSize = (baseSize: string, deviceMode: DeviceMode): string => {
  switch (deviceMode) {
    case 'mobile':
      return baseSize
        .replace('text-3xl', 'text-lg')
        .replace('text-2xl', 'text-base')
        .replace('text-xl', 'text-sm')
        .replace('text-lg', 'text-xs')
    case 'tablet':
      return baseSize
        .replace('text-3xl', 'text-xl')
        .replace('text-2xl', 'text-lg')
        .replace('text-xl', 'text-base')
    default:
      return baseSize
  }
}

// Utility function to get responsive padding
export const getResponsivePadding = (basePadding: string, deviceMode: DeviceMode): string => {
  switch (deviceMode) {
    case 'mobile':
      return basePadding
        .replace('p-8', 'p-2')
        .replace('p-6', 'p-2')
        .replace('p-4', 'p-2')
    case 'tablet':
      return basePadding
        .replace('p-8', 'p-4')
        .replace('p-6', 'p-3')
    default:
      return basePadding
  }
}
