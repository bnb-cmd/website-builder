"use client";

import React, { useState, useRef, useEffect } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { cn } from '../../lib/utils'
import { useEditorStore } from '../../lib/store'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { 
  Trash2, 
  Move, 
  Copy,
  Edit,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  GripVertical,
  RotateCcw,
  Maximize2,
  Minimize2
} from 'lucide-react'

interface PageComponent {
  id: string
  type: string
  props: Record<string, any>
  children?: PageComponent[]
  style?: Record<string, any>
  position?: { x: number; y: number }
  size?: { width: number; height: number }
  locked?: boolean
  visible?: boolean
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

interface EditorCanvasProps {
  components: PageComponent[]
  onComponentsChange: (components: PageComponent[]) => void
  onComponentSelect: (component: PageComponent | null) => void
  selectedComponent: PageComponent | null
  deviceMode: DeviceMode
  deviceDimensions: { width: number; height: number }
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  components,
  onComponentsChange,
  onComponentSelect,
  selectedComponent,
  deviceMode,
  deviceDimensions
}) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [draggedComponent, setDraggedComponent] = useState<any>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isMovingComponent, setIsMovingComponent] = useState(false)
  const [isResizingComponent, setIsResizingComponent] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [moveStartPos, setMoveStartPos] = useState({ x: 0, y: 0 })
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [editingComponent, setEditingComponent] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const { isPreviewMode } = useEditorStore()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setIsDragOver(true)
    console.log('Drag over canvas')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (!canvasRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    console.log('Drop event triggered')
    
    try {
      const componentData = JSON.parse(e.dataTransfer.getData('application/json'))
      console.log('Dropped component data:', componentData)
      const rect = canvasRef.current?.getBoundingClientRect()
      
      if (rect) {
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        const newComponent: PageComponent = {
          id: `${componentData.id}_${Date.now()}`,
          type: componentData.id,
          props: getDefaultProps(componentData.id),
          position: { x, y },
          size: getDefaultSize(componentData.id),
          visible: true,
          locked: false
        }
        
        console.log('Creating new component:', newComponent)
        onComponentsChange([...components, newComponent])
        onComponentSelect(newComponent)
      }
    } catch (error) {
      console.error('Failed to drop component:', error)
    }
  }

  const handleComponentClick = (component: PageComponent, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isPreviewMode) {
      onComponentSelect(component)
    }
  }

  // Handle component movement
  const handleComponentMouseDown = (component: PageComponent, e: React.MouseEvent) => {
    if (isPreviewMode || component.locked) return
    
    e.preventDefault()
    e.stopPropagation()
    
    setIsMovingComponent(true)
    setMoveStartPos({
      x: e.clientX - (component.position?.x || 0),
      y: e.clientY - (component.position?.y || 0)
    })
    
    onComponentSelect(component)
  }

  // Handle resize handle mouse down
  const handleResizeMouseDown = (handle: string, e: React.MouseEvent) => {
    if (isPreviewMode || !selectedComponent || selectedComponent.locked) return
    
    e.preventDefault()
    e.stopPropagation()
    
    setIsResizingComponent(true)
    setResizeHandle(handle)
    setResizeStartPos({
      x: e.clientX,
      y: e.clientY,
      width: selectedComponent.size?.width || 200,
      height: selectedComponent.size?.height || 100
    })
  }

  // Handle mouse move for component dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isMovingComponent && selectedComponent) {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return
        
        const newX = e.clientX - moveStartPos.x
        const newY = e.clientY - moveStartPos.y
        
        onComponentsChange(
          components.map(c => 
            c.id === selectedComponent.id 
              ? { ...c, position: { x: Math.max(0, newX), y: Math.max(0, newY) } }
              : c
          )
        )
      } else if (isResizingComponent && selectedComponent && resizeHandle) {
        const deltaX = e.clientX - resizeStartPos.x
        const deltaY = e.clientY - resizeStartPos.y
        
        let newWidth = resizeStartPos.width
        let newHeight = resizeStartPos.height
        
        switch (resizeHandle) {
          case 'se':
            newWidth = Math.max(50, resizeStartPos.width + deltaX)
            newHeight = Math.max(30, resizeStartPos.height + deltaY)
            break
          case 'sw':
            newWidth = Math.max(50, resizeStartPos.width - deltaX)
            newHeight = Math.max(30, resizeStartPos.height + deltaY)
            break
          case 'ne':
            newWidth = Math.max(50, resizeStartPos.width + deltaX)
            newHeight = Math.max(30, resizeStartPos.height - deltaY)
            break
          case 'nw':
            newWidth = Math.max(50, resizeStartPos.width - deltaX)
            newHeight = Math.max(30, resizeStartPos.height - deltaY)
            break
          case 'e':
            newWidth = Math.max(50, resizeStartPos.width + deltaX)
            break
          case 'w':
            newWidth = Math.max(50, resizeStartPos.width - deltaX)
            break
          case 's':
            newHeight = Math.max(30, resizeStartPos.height + deltaY)
            break
          case 'n':
            newHeight = Math.max(30, resizeStartPos.height - deltaY)
            break
        }
        
        onComponentsChange(
          components.map(c => 
            c.id === selectedComponent.id 
              ? { ...c, size: { width: newWidth, height: newHeight } }
              : c
          )
        )
      }
    }

    const handleMouseUp = () => {
      setIsMovingComponent(false)
      setIsResizingComponent(false)
      setResizeHandle(null)
    }

    if (isMovingComponent || isResizingComponent) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isMovingComponent, isResizingComponent, selectedComponent, moveStartPos, resizeStartPos, resizeHandle, components, onComponentsChange])

  // Handle inline text editing
  const handleTextDoubleClick = (component: PageComponent, e: React.MouseEvent) => {
    if (isPreviewMode || component.locked) return
    
    e.stopPropagation()
    setEditingComponent(component.id)
    setEditingValue(component.props.text || '')
  }

  const handleTextEditSubmit = () => {
    if (!editingComponent) return
    
    onComponentsChange(
      components.map(c => 
        c.id === editingComponent 
          ? { ...c, props: { ...c.props, text: editingValue } }
          : c
      )
    )
    
    setEditingComponent(null)
    setEditingValue('')
  }

  const handleTextEditCancel = () => {
    setEditingComponent(null)
    setEditingValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTextEditSubmit()
    } else if (e.key === 'Escape') {
      handleTextEditCancel()
    }
  }

  const handleDeleteComponent = (componentId: string) => {
    onComponentsChange(components.filter(c => c.id !== componentId))
    if (selectedComponent?.id === componentId) {
      onComponentSelect(null)
    }
  }

  const handleDuplicateComponent = (component: PageComponent) => {
    const duplicatedComponent: PageComponent = {
      ...component,
      id: `${component.id}_copy_${Date.now()}`,
      position: {
        x: (component.position?.x || 0) + 20,
        y: (component.position?.y || 0) + 20
      }
    }
    onComponentsChange([...components, duplicatedComponent])
    onComponentSelect(duplicatedComponent)
  }

  const handleToggleVisibility = (componentId: string) => {
    onComponentsChange(
      components.map(c => 
        c.id === componentId 
          ? { ...c, visible: !c.visible }
          : c
      )
    )
  }

  const handleToggleLock = (componentId: string) => {
    onComponentsChange(
      components.map(c => 
        c.id === componentId 
          ? { ...c, locked: !c.locked }
          : c
      )
    )
  }

  // IMPROVED: Get responsive component dimensions based on device mode
  const getResponsiveDimensions = (component: PageComponent) => {
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

  // IMPROVED: Get responsive text size based on device mode
  const getResponsiveTextSize = (baseSize: string) => {
    switch (deviceMode) {
      case 'mobile':
        // More aggressive text scaling for mobile
        return baseSize
          .replace('text-3xl', 'text-lg')
          .replace('text-2xl', 'text-base')
          .replace('text-xl', 'text-sm')
          .replace('text-lg', 'text-sm')
          .replace('text-base', 'text-xs')
      case 'tablet':
        return baseSize
          .replace('text-3xl', 'text-xl')
          .replace('text-2xl', 'text-lg')
          .replace('text-xl', 'text-base')
      default:
        return baseSize
    }
  }

  // IMPROVED: Get responsive padding based on device mode
  const getResponsivePadding = (basePadding: string) => {
    switch (deviceMode) {
      case 'mobile':
        return basePadding
          .replace('p-8', 'p-2')
          .replace('p-6', 'p-2')
          .replace('p-4', 'p-1')
          .replace('p-3', 'p-1')
      case 'tablet':
        return basePadding
          .replace('p-8', 'p-4')
          .replace('p-6', 'p-3')
          .replace('p-4', 'p-2')
      default:
        return basePadding
    }
  }

  // Render resize handles
  const renderResizeHandles = (component: PageComponent) => {
    if (isPreviewMode || !selectedComponent || selectedComponent.id !== component.id || component.locked) {
      return null
    }

    const responsiveDimensions = getResponsiveDimensions(component)
    const width = responsiveDimensions.width
    const height = responsiveDimensions.height

    const handles = [
      { id: 'nw', position: { top: -4, left: -4 }, cursor: 'nw-resize' },
      { id: 'n', position: { top: -4, left: width / 2 - 4 }, cursor: 'n-resize' },
      { id: 'ne', position: { top: -4, right: -4 }, cursor: 'ne-resize' },
      { id: 'e', position: { top: height / 2 - 4, right: -4 }, cursor: 'e-resize' },
      { id: 'se', position: { bottom: -4, right: -4 }, cursor: 'se-resize' },
      { id: 's', position: { bottom: -4, left: width / 2 - 4 }, cursor: 's-resize' },
      { id: 'sw', position: { bottom: -4, left: -4 }, cursor: 'sw-resize' },
      { id: 'w', position: { top: height / 2 - 4, left: -4 }, cursor: 'w-resize' }
    ]

    return (
      <>
        {handles.map(handle => (
          <div
            key={handle.id}
            className="absolute w-2 h-2 bg-primary border border-white rounded-sm cursor-pointer hover:bg-primary/80"
            style={{
              ...handle.position,
              cursor: handle.cursor,
              zIndex: 20
            }}
            onMouseDown={(e) => handleResizeMouseDown(handle.id, e)}
          />
        ))}
      </>
    )
  }

  const renderComponent = (component: PageComponent) => {
    const isSelected = selectedComponent?.id === component.id
    const isLocked = component.locked
    const isVisible = component.visible !== false
    const isEditing = editingComponent === component.id
    const responsiveDimensions = getResponsiveDimensions(component)

    if (!isVisible) return null

    return (
      <div
        key={component.id}
        className={cn(
          "absolute group",
          isSelected && !isPreviewMode && "ring-2 ring-primary ring-offset-2",
          isMovingComponent && isSelected && "cursor-grabbing",
          !isPreviewMode && !isLocked && "cursor-grab"
        )}
        style={{
          left: responsiveDimensions.x,
          top: responsiveDimensions.y,
          width: responsiveDimensions.width,
          height: responsiveDimensions.height,
          zIndex: isSelected ? 10 : 1
        }}
        onClick={(e) => handleComponentClick(component, e)}
        onMouseDown={(e) => handleComponentMouseDown(component, e)}
      >
        {/* Component Content */}
        <div className="relative w-full h-full overflow-hidden">
          {renderComponentContent(component)}
        </div>

        {/* Component Controls */}
        {isSelected && !isPreviewMode && (
          <div className="absolute -top-8 left-0 bg-primary text-primary-foreground rounded-md px-2 py-1 text-xs font-medium flex items-center gap-1 shadow-lg">
            <span className="capitalize">{component.type}</span>
            <div className="flex items-center gap-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 text-primary-foreground hover:bg-primary/20"
                onClick={() => handleToggleVisibility(component.id)}
              >
                {isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 text-primary-foreground hover:bg-primary/20"
                onClick={() => handleToggleLock(component.id)}
              >
                {isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 text-primary-foreground hover:bg-primary/20"
                onClick={() => handleDuplicateComponent(component)}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 text-primary-foreground hover:bg-primary/20"
                onClick={() => handleDeleteComponent(component.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Move Handle */}
        {isSelected && !isPreviewMode && !isLocked && (
          <div className="absolute -left-6 top-0 bg-primary text-primary-foreground rounded p-1 cursor-grab hover:bg-primary/80">
            <GripVertical className="h-3 w-3" />
          </div>
        )}

        {/* Resize Handles */}
        {renderResizeHandles(component)}
        
        {/* Locked indicator */}
        {isLocked && !isPreviewMode && (
          <div className="absolute top-1 right-1">
            <Lock className="h-3 w-3 text-muted-foreground" />
          </div>
        )}
      </div>
    )
  }

  const renderComponentContent = (component: PageComponent) => {
    const isEditing = editingComponent === component.id

    switch (component.type) {
      case 'heading':
        return (
          <div className="w-full h-full flex items-center">
            {isEditing ? (
              <Input
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={handleTextEditSubmit}
                onKeyDown={handleKeyDown}
                className={cn("font-bold border-primary w-full", getResponsiveTextSize("text-2xl"))}
                autoFocus
              />
            ) : (
              <h2 
                className={cn("font-bold cursor-pointer hover:bg-primary/5 rounded px-1 w-full", getResponsiveTextSize("text-2xl"))}
                onDoubleClick={(e) => handleTextDoubleClick(component, e)}
              >
                {component.props.text || 'Your Heading Here'}
              </h2>
            )}
          </div>
        )
      
      case 'text':
        return (
          <div className="w-full h-full flex items-center">
            {isEditing ? (
              <Input
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={handleTextEditSubmit}
                onKeyDown={handleKeyDown}
                className={cn("border-primary w-full", getResponsiveTextSize("text-base"))}
                autoFocus
              />
            ) : (
              <p 
                className={cn("cursor-pointer hover:bg-primary/5 rounded px-1 w-full", getResponsiveTextSize("text-base"))}
                onDoubleClick={(e) => handleTextDoubleClick(component, e)}
              >
                {component.props.text || 'Your text content goes here. Click to edit this text and make it your own.'}
              </p>
            )}
          </div>
        )
      
      case 'button':
        return (
          <div className="w-full h-full flex items-center justify-center">
            {isEditing ? (
              <Input
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={handleTextEditSubmit}
                onKeyDown={handleKeyDown}
                className="border-primary w-full"
                autoFocus
              />
            ) : (
              <Button 
                variant={component.props.variant || 'default'}
                className={cn("cursor-pointer w-full h-full", getResponsiveTextSize("text-sm"))}
                onDoubleClick={(e) => handleTextDoubleClick(component, e)}
              >
                {component.props.text || 'Click Me'}
              </Button>
            )}
          </div>
        )
      
      case 'hero-section':
        return (
          <div className={cn("w-full h-full bg-gradient-to-r from-primary to-primary/70 rounded-lg text-primary-foreground flex flex-col justify-center", getResponsivePadding("p-8"))}>
            <div>
              {isEditing ? (
                <Input
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={handleTextEditSubmit}
                  onKeyDown={handleKeyDown}
                  className={cn("font-bold mb-4 border-primary bg-white/10 text-white placeholder:text-white/70 w-full", getResponsiveTextSize("text-3xl"))}
                  placeholder="Your Hero Title"
                  autoFocus
                />
              ) : (
                <h1 
                  className={cn("font-bold mb-4 cursor-pointer hover:bg-white/10 rounded px-1", getResponsiveTextSize("text-3xl"))}
                  onDoubleClick={(e) => handleTextDoubleClick(component, e)}
                >
                  {component.props.title || 'Your Hero Title'}
                </h1>
              )}
            </div>
            <p className={cn("mb-6", getResponsiveTextSize("text-base"))}>
              {component.props.subtitle || 'Compelling subtitle that describes your business'}
            </p>
            <Button variant="secondary" className={getResponsiveTextSize("text-sm")}>
              {component.props.buttonText || 'Get Started'}
            </Button>
          </div>
        )
      
      case 'contact-form':
        return (
          <Card className={cn("w-full h-full flex flex-col", getResponsivePadding("p-6"))}>
            <h3 className={cn("font-semibold mb-4", getResponsiveTextSize("text-lg"))}>Contact Us</h3>
            <div className="space-y-4 flex-1">
              <input 
                type="text" 
                placeholder="Name" 
                className="w-full p-2 border rounded"
                readOnly 
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full p-2 border rounded"
                readOnly 
              />
              <textarea 
                placeholder="Message" 
                className="w-full p-2 border rounded flex-1"
                readOnly 
              />
              <Button className="w-full">Send Message</Button>
            </div>
          </Card>
        )
      
      case 'pricing-card':
        return (
          <Card className={cn("w-full h-full flex flex-col", getResponsivePadding("p-6"))}>
            <h3 className={cn("font-bold mb-2", getResponsiveTextSize("text-xl"))}>{component.props.title || 'Basic Plan'}</h3>
            <div className="mb-4">
              <span className={cn("font-bold", getResponsiveTextSize("text-3xl"))}>${component.props.price || '29'}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2 mb-6 flex-1">
              {(component.props.features || ['Feature 1', 'Feature 2', 'Feature 3']).map((feature: string, index: number) => (
                <li key={index} className={getResponsiveTextSize("text-sm")}>✓ {feature}</li>
              ))}
            </ul>
            <Button className="w-full">Choose Plan</Button>
          </Card>
        )
      
      case 'testimonial':
        return (
          <Card className={cn("w-full h-full flex flex-col", getResponsivePadding("p-6"))}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                {component.props.author?.charAt(0) || 'J'}
              </div>
              <div className="ml-3">
                <p className="font-semibold">{component.props.author || 'John Doe'}</p>
                <p className={cn("text-muted-foreground", getResponsiveTextSize("text-sm"))}>{component.props.role || 'Customer'}</p>
              </div>
            </div>
            <p className={cn("italic flex-1", getResponsiveTextSize("text-sm"))}>
              "{component.props.text || 'This is an amazing service! Highly recommended.'}"
            </p>
          </Card>
        )
      
      case 'image':
        return (
          <div className="w-full h-full border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center bg-muted/50">
            {component.props.src ? (
              <ImageWithFallback
                src={component.props.src}
                alt={component.props.alt || 'Image'}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <ImageWithFallback 
                  src=""
                  alt="Placeholder"
                  className="w-12 h-12 mx-auto mb-2 opacity-50"
                />
                <p className={getResponsiveTextSize("text-sm")}>Click to add image</p>
              </div>
            )}
          </div>
        )
      
      case 'container':
        return (
          <div className={cn("w-full h-full border-2 border-dashed border-muted-foreground rounded-lg bg-muted/20 flex items-center justify-center", getResponsivePadding("p-4"))}>
            <p className={cn("text-muted-foreground text-center", getResponsiveTextSize("text-sm"))}>Container</p>
          </div>
        )
      
      case 'divider':
        return (
          <div className="w-full h-full flex items-center">
            <hr className="w-full border-t-2 border-muted-foreground" />
          </div>
        )
      
      default:
        return (
          <div className="w-full h-full border-2 border-dashed border-muted-foreground rounded-lg bg-muted/20 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-muted-foreground">?</span>
              </div>
              <p className="text-sm">Unknown Component</p>
              <p className="text-xs">{component.type}</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex-1 bg-gray-50 relative overflow-auto">
      {/* Device Frame */}
      <div className={cn(
        "relative mx-auto transition-all duration-300",
        deviceMode === 'mobile' && "max-w-sm",
        deviceMode === 'tablet' && "max-w-2xl",
        deviceMode === 'desktop' && "w-full max-w-6xl"
      )}>
        {/* Device Frame Border */}
        {deviceMode === 'mobile' && (
          <div className="absolute inset-0 border-8 border-gray-800 rounded-3xl pointer-events-none z-10">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-600 rounded-full"></div>
          </div>
        )}
        
        {deviceMode === 'tablet' && (
          <div className="absolute inset-0 border-8 border-gray-800 rounded-3xl pointer-events-none z-10">
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-600 rounded-full"></div>
          </div>
        )}
        
        {deviceMode === 'desktop' && (
          <div className="absolute inset-0 border-4 border-gray-600 pointer-events-none z-10">
            {/* Desktop monitor frame */}
            <div className="absolute -top-8 left-0 right-0 h-8 bg-gray-700 rounded-t-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            </div>
            {/* Desktop stand */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gray-600 rounded-b-lg"></div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-gray-500 rounded"></div>
          </div>
        )}
        
        {/* Canvas */}
        <div
          ref={canvasRef}
          className={cn(
            "relative p-8 transition-colors",
            "min-h-[1200px] w-full",
            deviceMode === 'mobile' && "min-h-[667px]",
            deviceMode === 'tablet' && "min-h-[1024px]",
            deviceMode === 'desktop' && "min-h-[800px]",
            isDragOver && "bg-primary/5 border-2 border-dashed border-primary"
          )}
          style={{
            width: deviceMode === 'mobile' ? '375px' : deviceMode === 'tablet' ? '768px' : '100%',
            minHeight: deviceMode === 'mobile' ? '667px' : deviceMode === 'tablet' ? '1024px' : '800px'
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => onComponentSelect(null)}
        >
          {/* Canvas Background Pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* Drop Zone Hint */}
          {components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-muted-foreground">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Move className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Start Building</h3>
                <p>Drag components from the sidebar to build your page</p>
                <p className="text-sm mt-2 text-muted-foreground">
                  💡 Tip: Components automatically adjust to {deviceMode} view
                </p>
                <p className="text-xs mt-1 text-muted-foreground">
                  Current view: {deviceMode} ({deviceDimensions.width}×{deviceDimensions.height})
                </p>
              </div>
            </div>
          )}
          
          {/* Render Components */}
          {components.map(renderComponent)}
        </div>
      </div>
    </div>
  )
}

// Helper function to get default props for components
function getDefaultProps(componentType: string): Record<string, any> {
  switch (componentType) {
    case 'heading':
      return { text: 'Your Heading Here', level: 2 }
    case 'text':
      return { text: 'Your text content goes here. Click to edit this text and make it your own.' }
    case 'button':
      return { text: 'Click Me', variant: 'default' }
    case 'image':
      return { src: '', alt: 'Image', width: 300, height: 200 }
    case 'hero-section':
      return {
        title: 'Your Hero Title',
        subtitle: 'Compelling subtitle that describes your business',
        buttonText: 'Get Started'
      }
    case 'contact-form':
      return { title: 'Contact Us' }
    case 'testimonial':
      return { 
        author: 'John Doe', 
        role: 'Customer',
        text: 'This is an amazing service! Highly recommended.'
      }
    case 'pricing-card':
      return { 
        title: 'Basic Plan', 
        price: '29',
        features: ['Feature 1', 'Feature 2', 'Feature 3']
      }
    default:
      return {}
  }
}

// Helper function to get default sizes for components
function getDefaultSize(componentType: string): { width: number; height: number } {
  switch (componentType) {
    case 'heading':
      return { width: 300, height: 60 }
    case 'text':
      return { width: 400, height: 80 }
    case 'button':
      return { width: 150, height: 40 }
    case 'image':
      return { width: 300, height: 200 }
    case 'container':
      return { width: 300, height: 200 }
    case 'divider':
      return { width: 400, height: 20 }
    case 'hero-section':
      return { width: 600, height: 400 }
    case 'contact-form':
      return { width: 400, height: 500 }
    case 'testimonial':
      return { width: 400, height: 250 }
    case 'pricing-card':
      return { width: 350, height: 450 }
    default:
      return { width: 200, height: 100 }
  }
}