"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { restrictToWindowEdges, snapCenterToCursor } from '@dnd-kit/modifiers'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { cn } from '../../lib/utils'
import { useEditorStore } from '../../lib/store'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { ComponentRenderer, getResponsiveDimensions } from '../website/renderer'
import { getDefaultProps, getDefaultSize } from '../website/registry'
import { ComponentNode, PageSchema, ResponsiveLayout, ResponsiveStyles, LayoutObject, StyleObject } from '../../lib/schema'
import { useUndoRedo } from '../../hooks/useUndo'
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
  Minimize2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Grid,
  Ruler,
  MousePointer,
  Square
} from 'lucide-react'

interface EditorCanvasProps {
  components: ComponentNode[]
  onComponentsChange: (components: ComponentNode[]) => void
  onComponentSelect: (component: ComponentNode | null) => void
  selectedComponent: ComponentNode | null
  deviceMode: 'desktop' | 'tablet' | 'mobile'
  deviceDimensions: { width: number; height: number }
  pageSchema: PageSchema
  onPageSchemaChange: (schema: PageSchema) => void
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile'

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  components,
  onComponentsChange,
  onComponentSelect,
  selectedComponent,
  deviceMode,
  deviceDimensions,
  pageSchema,
  onPageSchemaChange
}) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [draggedComponent, setDraggedComponent] = useState<ComponentNode | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isMovingComponent, setIsMovingComponent] = useState(false)
  const [isResizingComponent, setIsResizingComponent] = useState(false)
  const [resizeHandle, setResizeHandle] = useState<string | null>(null)
  const [moveStartPos, setMoveStartPos] = useState({ x: 0, y: 0 })
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [editingComponent, setEditingComponent] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [snapGrid, setSnapGrid] = useState(true)
  const [snapGuides, setSnapGuides] = useState(true)
  const [alignmentGuides, setAlignmentGuides] = useState<Array<{ x?: number; y?: number; type: 'horizontal' | 'vertical' }>>([])
  const [multiSelect, setMultiSelect] = useState<string[]>([])
  const { isPreviewMode } = useEditorStore()

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Undo/Redo integration
  const { addState, updateState } = useUndoRedo(pageSchema, {
    onStateChange: onPageSchemaChange,
    onPatchCreated: (patch) => {
      console.log('Patch created:', patch)
    }
  })

  // Snap to grid function
  const snapToGrid = useCallback((value: number, gridSize: number = 10): number => {
    if (!snapGrid) return value
    return Math.round(value / gridSize) * gridSize
  }, [snapGrid])

  // Helper function to safely get styles for a device
  const getStyles = useCallback((styles: ResponsiveStyles, device: 'desktop' | 'tablet' | 'mobile'): StyleObject => {
    if (device === 'desktop') {
      return styles.default
    }
    
    const deviceStyles = styles[device]
    if (!deviceStyles) {
      return styles.default
    }
    
    // Merge partial styles with default styles
    return {
      ...styles.default,
      ...deviceStyles
    }
  }, [])

  // Helper function to safely get layout for a device
  const getLayout = useCallback((layout: ResponsiveLayout, device: 'desktop' | 'tablet' | 'mobile'): LayoutObject => {
    if (device === 'desktop') {
      return layout.default
    }
    
    const deviceLayout = layout[device]
    if (!deviceLayout) {
      return layout.default
    }
    
    // Merge partial layout with default layout
    return {
      x: deviceLayout.x ?? layout.default.x,
      y: deviceLayout.y ?? layout.default.y,
      width: deviceLayout.width ?? layout.default.width,
      height: deviceLayout.height ?? layout.default.height,
      zIndex: deviceLayout.zIndex ?? layout.default.zIndex
    }
  }, [])

  // Calculate alignment guides
  const calculateAlignmentGuides = useCallback((component: ComponentNode): Array<{ x?: number; y?: number; type: 'horizontal' | 'vertical' }> => {
    if (!snapGuides) return []

    const guides: Array<{ x?: number; y?: number; type: 'horizontal' | 'vertical' }> = []
    const currentLayout = getLayout(component.layout, deviceMode)

    components.forEach(comp => {
      if (comp.id === component.id) return
      
      const compLayout = getLayout(comp.layout, deviceMode)
      
      // Vertical alignment guides
      if (Math.abs(currentLayout.x - compLayout.x) < 5) {
        guides.push({ x: compLayout.x, type: 'vertical' })
      }
      if (Math.abs((currentLayout.x + currentLayout.width) - (compLayout.x + compLayout.width)) < 5) {
        guides.push({ x: compLayout.x + compLayout.width, type: 'vertical' })
      }
      
      // Horizontal alignment guides
      if (Math.abs(currentLayout.y - compLayout.y) < 5) {
        guides.push({ y: compLayout.y, type: 'horizontal' })
      }
      if (Math.abs((currentLayout.y + currentLayout.height) - (compLayout.y + compLayout.height)) < 5) {
        guides.push({ y: compLayout.y + compLayout.height, type: 'horizontal' })
      }
    })

    return guides
  }, [components, deviceMode, snapGuides, getLayout, getStyles])

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const component = components.find(c => c.id === active.id)
    if (component) {
      setDraggedComponent(component)
      onComponentSelect(component)
    }
  }

  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    
    if (!over || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = event.activatorEvent && 'clientX' in event.activatorEvent ? (event.activatorEvent as MouseEvent).clientX - rect.left : 0
    const y = event.activatorEvent && 'clientY' in event.activatorEvent ? (event.activatorEvent as MouseEvent).clientY - rect.top : 0

    // Calculate alignment guides
    if (draggedComponent) {
      const guides = calculateAlignmentGuides(draggedComponent)
      setAlignmentGuides(guides)
    }
  }

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    setDraggedComponent(null)
    setAlignmentGuides([])

    if (!over || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = event.activatorEvent && 'clientX' in event.activatorEvent ? (event.activatorEvent as MouseEvent).clientX - rect.left : 0
    const y = event.activatorEvent && 'clientY' in event.activatorEvent ? (event.activatorEvent as MouseEvent).clientY - rect.top : 0

    // Handle component reordering
    if (over.id === 'canvas' && active.id !== over.id) {
      const activeIndex = components.findIndex(c => c.id === active.id)
      const overIndex = components.findIndex(c => c.id === over.id)
      
      if (activeIndex !== -1 && overIndex !== -1) {
        const newComponents = arrayMove(components, activeIndex, overIndex)
        onComponentsChange(newComponents)
        
        addState({
          type: 'move',
          componentId: active.id as string,
          targetIndex: overIndex
        }, newComponents)
      }
    }

    // Handle dropping from palette
    if (over.id === 'canvas' && active.data.current?.fromPalette) {
      const componentData = active.data.current
      const snappedX = snapToGrid(x)
      const snappedY = snapToGrid(y)
      
      const newComponent: ComponentNode = {
        id: `${componentData.id}_${Date.now()}`,
        type: componentData.id,
        props: getDefaultProps(componentData.id),
        layout: {
          default: {
            x: snappedX,
            y: snappedY,
            width: getDefaultSize(componentData.id).width,
            height: getDefaultSize(componentData.id).height,
            zIndex: components.length + 1,
            locked: false,
            visible: true
          }
        },
        styles: {
          default: {
            position: 'absolute',
            display: 'block'
          }
        },
        visible: true,
        locked: false,
        language: pageSchema.settings.language,
        direction: pageSchema.settings.direction
      }

      const newComponents = [...components, newComponent]
      onComponentsChange(newComponents)
      onComponentSelect(newComponent)
      
      addState({
        type: 'add',
        componentId: newComponent.id
      }, newComponents)
    }
  }

  // Handle component click
  const handleComponentClick = (component: ComponentNode, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (isPreviewMode) return

    if (e.shiftKey) {
      // Multi-select
      setMultiSelect(prev => 
        prev.includes(component.id) 
          ? prev.filter(id => id !== component.id)
          : [...prev, component.id]
      )
    } else {
      // Single select
      setMultiSelect([])
      onComponentSelect(component)
    }
  }

  // Handle component movement
  const handleComponentMouseDown = (component: ComponentNode, e: React.MouseEvent) => {
    if (isPreviewMode || component.locked) return
    
    e.preventDefault()
    e.stopPropagation()
    
    setIsMovingComponent(true)
    setMoveStartPos({
      x: e.clientX - getLayout(component.layout, deviceMode).x,
      y: e.clientY - getLayout(component.layout, deviceMode).y
    })
    
    onComponentSelect(component)
  }

  // Handle resize
  const handleResizeMouseDown = (handle: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!selectedComponent) return
    
    setIsResizingComponent(true)
    setResizeHandle(handle)
    
    const layout = getLayout(selectedComponent.layout, deviceMode)
    setResizeStartPos({
      x: e.clientX,
      y: e.clientY,
      width: layout.width,
      height: layout.height
    })
  }

  // Handle mouse move for dragging/resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return

      const rect = canvasRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (isMovingComponent && selectedComponent) {
        const newX = snapToGrid(x - moveStartPos.x)
        const newY = snapToGrid(y - moveStartPos.y)

        updateState((draft) => {
          const component = draft.components.find(c => c.id === selectedComponent.id)
          if (component) {
            if (deviceMode === 'desktop') {
              component.layout.default.x = Math.max(0, newX)
              component.layout.default.y = Math.max(0, newY)
            } else {
              if (!component.layout[deviceMode]) {
                component.layout[deviceMode] = { ...component.layout.default }
              }
              component.layout[deviceMode]!.x = Math.max(0, newX)
              component.layout[deviceMode]!.y = Math.max(0, newY)
            }
          }
        })

        // Calculate alignment guides
        const guides = calculateAlignmentGuides(selectedComponent)
        setAlignmentGuides(guides)
      }

      if (isResizingComponent && selectedComponent && resizeHandle) {
        const deltaX = e.clientX - resizeStartPos.x
        const deltaY = e.clientY - resizeStartPos.y

        updateState((draft) => {
          const component = draft.components.find(c => c.id === selectedComponent.id)
          if (component) {
            if (deviceMode === 'desktop') {
              const layout = component.layout.default
              
              switch (resizeHandle) {
                case 'se':
                  layout.width = Math.max(50, snapToGrid(resizeStartPos.width + deltaX))
                  layout.height = Math.max(50, snapToGrid(resizeStartPos.height + deltaY))
                  break
                case 'sw':
                  layout.width = Math.max(50, snapToGrid(resizeStartPos.width - deltaX))
                  layout.height = Math.max(50, snapToGrid(resizeStartPos.height + deltaY))
                  layout.x = snapToGrid(component.layout.default.x + (resizeStartPos.width - layout.width))
                  break
                case 'ne':
                  layout.width = Math.max(50, snapToGrid(resizeStartPos.width + deltaX))
                  layout.height = Math.max(50, snapToGrid(resizeStartPos.height - deltaY))
                  layout.y = snapToGrid(component.layout.default.y + (resizeStartPos.height - layout.height))
                  break
                case 'nw':
                  layout.width = Math.max(50, snapToGrid(resizeStartPos.width - deltaX))
                  layout.height = Math.max(50, snapToGrid(resizeStartPos.height - deltaY))
                  layout.x = snapToGrid(component.layout.default.x + (resizeStartPos.width - layout.width))
                  layout.y = snapToGrid(component.layout.default.y + (resizeStartPos.height - layout.height))
                  break
              }
            } else {
              if (!component.layout[deviceMode]) {
                component.layout[deviceMode] = { ...component.layout.default }
              }
              
              const layout = component.layout[deviceMode]!
              
              switch (resizeHandle) {
                case 'se':
                  layout.width = Math.max(50, snapToGrid(resizeStartPos.width + deltaX))
                  layout.height = Math.max(50, snapToGrid(resizeStartPos.height + deltaY))
                  break
                case 'sw':
                  layout.width = Math.max(50, snapToGrid(resizeStartPos.width - deltaX))
                  layout.height = Math.max(50, snapToGrid(resizeStartPos.height + deltaY))
                  layout.x = snapToGrid(component.layout.default.x + (resizeStartPos.width - layout.width))
                  break
                case 'ne':
                  layout.width = Math.max(50, snapToGrid(resizeStartPos.width + deltaX))
                  layout.height = Math.max(50, snapToGrid(resizeStartPos.height - deltaY))
                  layout.y = snapToGrid(component.layout.default.y + (resizeStartPos.height - layout.height))
                  break
                case 'nw':
                  layout.width = Math.max(50, snapToGrid(resizeStartPos.width - deltaX))
                  layout.height = Math.max(50, snapToGrid(resizeStartPos.height - deltaY))
                  layout.x = snapToGrid(component.layout.default.x + (resizeStartPos.width - layout.width))
                  layout.y = snapToGrid(component.layout.default.y + (resizeStartPos.height - layout.height))
                  break
              }
            }
          }
        })
      }
    }

    const handleMouseUp = () => {
      if (isMovingComponent) {
        setIsMovingComponent(false)
        addState({
          type: 'update',
          componentId: selectedComponent?.id || ''
        }, components)
      }
      
      if (isResizingComponent) {
        setIsResizingComponent(false)
        setResizeHandle(null)
        addState({
          type: 'update',
          componentId: selectedComponent?.id || ''
        }, components)
      }
    }

    if (isMovingComponent || isResizingComponent) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isMovingComponent, isResizingComponent, selectedComponent, moveStartPos, resizeStartPos, resizeHandle, snapToGrid, updateState, addState, components])

  // Handle component deletion
  const handleDeleteComponent = (componentId: string) => {
    const newComponents = components.filter(c => c.id !== componentId)
    onComponentsChange(newComponents)
    onComponentSelect(null)
    
    addState({
      type: 'remove',
      componentId
    }, newComponents)
  }

  // Handle component duplication
  const handleDuplicateComponent = (component: ComponentNode) => {
    const newComponent: ComponentNode = {
      ...component,
      id: `${component.id}_copy_${Date.now()}`,
      layout: {
        ...component.layout,
        default: {
          ...component.layout.default,
          x: component.layout.default.x + 20,
          y: component.layout.default.y + 20,
          zIndex: components.length + 1
        }
      }
    }

    const newComponents = [...components, newComponent]
    onComponentsChange(newComponents)
    onComponentSelect(newComponent)
    
    addState({
      type: 'duplicate',
      componentId: component.id
    }, newComponents)
  }

  // Handle component lock/unlock
  const handleToggleLock = (component: ComponentNode) => {
    updateState((draft) => {
      const comp = draft.components.find(c => c.id === component.id)
      if (comp) {
        comp.locked = !comp.locked
      }
    })
  }

  // Handle component visibility
  const handleToggleVisibility = (component: ComponentNode) => {
    updateState((draft) => {
      const comp = draft.components.find(c => c.id === component.id)
      if (comp) {
        comp.visible = !comp.visible
      }
    })
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={snapGrid ? "default" : "outline"}
              size="sm"
              onClick={() => setSnapGrid(!snapGrid)}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={snapGuides ? "default" : "outline"}
              size="sm"
              onClick={() => setSnapGuides(!snapGuides)}
            >
              <Ruler className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {deviceMode.toUpperCase()}
            </Badge>
            <Badge variant="outline">
              {deviceDimensions.width} × {deviceDimensions.height}
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {selectedComponent && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleLock(selectedComponent)}
              >
                {selectedComponent.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleVisibility(selectedComponent)}
              >
                {selectedComponent.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDuplicateComponent(selectedComponent)}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteComponent(selectedComponent.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto p-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToWindowEdges, snapCenterToCursor]}
        >
          <div
            ref={canvasRef}
            id="canvas"
            className={cn(
              "relative mx-auto bg-white shadow-lg",
              "border border-gray-200",
              pageSchema.settings.direction === 'rtl' && "rtl"
            )}
            style={{
              width: deviceDimensions.width,
              height: deviceDimensions.height,
              minHeight: '600px'
            }}
          >
            {/* Snap Grid */}
            {snapGrid && (
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            )}

            {/* Alignment Guides */}
            {alignmentGuides.map((guide, index) => (
              <div
                key={index}
                className={cn(
                  "absolute pointer-events-none z-50",
                  guide.type === 'vertical' ? "w-px h-full bg-blue-500" : "w-full h-px bg-blue-500"
                )}
                style={{
                  [guide.type === 'vertical' ? 'left' : 'top']: guide.type === 'vertical' ? guide.x : guide.y,
                  [guide.type === 'vertical' ? 'top' : 'left']: 0
                }}
              />
            ))}

            <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
              {components.map((component) => {
                if (!component.visible) return null

                const layout = getLayout(component.layout, deviceMode)
                const styles = getStyles(component.styles, deviceMode)
                const isSelected = selectedComponent?.id === component.id
                const isMultiSelected = multiSelect.includes(component.id)

                return (
                  <div
                    key={component.id}
                    className={cn(
                      "absolute cursor-move group",
                      isSelected && "ring-2 ring-blue-500 ring-offset-2",
                      isMultiSelected && "ring-2 ring-purple-500 ring-offset-2",
                      component.locked && "cursor-not-allowed opacity-75"
                    )}
                    style={{
                      left: layout.x,
                      top: layout.y,
                      width: layout.width,
                      height: layout.height,
                      zIndex: layout.zIndex || 1,
                      ...styles
                    }}
                    onClick={(e) => handleComponentClick(component, e)}
                    onMouseDown={(e) => handleComponentMouseDown(component, e)}
                  >
                    {/* Component Content */}
                    <div className="w-full h-full">
                      <ComponentRenderer
                        componentType={component.type}
                        props={component.props}
                        deviceMode={deviceMode}
                        isPreviewMode={isPreviewMode}
                      />
                    </div>

                    {/* Selection Handles */}
                    {!isPreviewMode && (isSelected || isMultiSelected) && (
                      <>
                        {/* Resize Handles */}
                        {!component.locked && (
                          <>
                            <div
                              className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-se-resize"
                              onMouseDown={(e) => handleResizeMouseDown('se', e)}
                            />
                            <div
                              className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-sw-resize"
                              onMouseDown={(e) => handleResizeMouseDown('sw', e)}
                            />
                            <div
                              className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white cursor-ne-resize"
                              onMouseDown={(e) => handleResizeMouseDown('ne', e)}
                            />
                            <div
                              className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white cursor-nw-resize"
                              onMouseDown={(e) => handleResizeMouseDown('nw', e)}
                            />
                          </>
                        )}

                        {/* Move Handle */}
                        <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded flex items-center space-x-1">
                          <GripVertical className="w-3 h-3" />
                          <span>{component.type}</span>
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </SortableContext>

            {/* Drop Zone Overlay */}
            {isDragOver && (
              <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-300 flex items-center justify-center">
                <div className="text-blue-600 font-medium">Drop component here</div>
              </div>
            )}
          </div>

          <DragOverlay>
            {draggedComponent ? (
              <div className="opacity-50">
                <ComponentRenderer
                  componentType={draggedComponent.type}
                  props={draggedComponent.props}
                  deviceMode={deviceMode}
                  isPreviewMode={false}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}

export default EditorCanvas